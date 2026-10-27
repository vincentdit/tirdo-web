'use strict';

// Tamper-evident, append-only audit log. Content actions are recorded after
// the document operation succeeds. Auth and application events are ingested
// through /portal-internal/audit/ingest with AUDIT_LOG_TOKEN.
const {
  SCHEMA_VERSION,
  GENESIS,
  AUDIT_UID,
  AUDITED_TYPES,
  AUDITED_ACTIONS,
  sha256,
  canonical,
  sanitizeSummary,
  eventTypeFor,
  severityFor,
  publicView,
  tokenMatches,
} = require('./audit-lib');

function actorFrom(strapi) {
  try {
    const ctx = strapi.requestContext.get();
    const user = ctx && ctx.state && ctx.state.user;
    if (user) {
      const name = user.email || user.username || (user.firstname ? `${user.firstname} ${user.lastname || ''}`.trim() : null);
      return {
        actor: name || `admin#${user.id}`,
        actorId: String(user.id),
        actorType: 'user',
        identityProvider: 'strapi',
      };
    }
  } catch {
    /* bootstrap / background */
  }
  return { actor: 'system', actorId: '', actorType: 'system', identityProvider: 'strapi' };
}

function requestMeta(strapi) {
  try {
    const ctx = strapi.requestContext.get();
    if (!ctx || !ctx.request) return {};
    const reqId = ctx.request.header['x-request-id'] || ctx.request.header['x-correlation-id'] || '';
    return { requestId: String(reqId).slice(0, 80) };
  } catch {
    return {};
  }
}

let queue = Promise.resolve();

function persist(strapi, entry) {
  queue = queue.then(async () => {
    const last = await strapi.db.query(AUDIT_UID).findMany({ orderBy: { seq: 'desc' }, limit: 1 });
    const prev = last[0];
    const seq = prev ? prev.seq + 1 : 1;
    const prevHash = prev ? prev.hash : GENESIS;
    const recordedAt = new Date().toISOString();
    const action = entry.action;
    const contentType = entry.contentType || entry.targetType || 'application';
    const outcome = entry.outcome || 'success';
    const base = {
      seq,
      occurredAt: entry.occurredAt || recordedAt,
      recordedAt,
      action,
      contentType,
      entityId: entry.entityId || entry.targetId || '',
      entitySlug: entry.entitySlug || '',
      actor: entry.actor || 'system',
      actorId: entry.actorId || '',
      summary: sanitizeSummary(entry.summary || {}),
      prevHash,
      schemaVersion: SCHEMA_VERSION,
      eventType: entry.eventType || eventTypeFor(action, contentType),
      outcome,
      severity: entry.severity || severityFor(action, outcome),
      actorType: entry.actorType || (entry.actor === 'system' ? 'system' : 'user'),
      identityProvider: entry.identityProvider || 'strapi',
      sourceService: entry.sourceService || 'cms',
      requestId: entry.requestId || '',
      targetType: entry.targetType || contentType,
      reason: String(entry.reason || '').slice(0, 240),
      changeSummary: String(entry.changeSummary || '').slice(0, 240),
    };
    const hash = sha256(canonical(base));
    await strapi.db.query(AUDIT_UID).create({ data: { ...base, hash } });
  });
  return queue;
}

function record(strapi, entry) {
  return persist(strapi, entry).catch((err) => {
    strapi.log.error('[audit] failed to record entry: ' + err.message);
    throw err;
  });
}

function recordBestEffort(strapi, entry) {
  return persist(strapi, entry).catch((err) => {
    strapi.log.error('[audit] failed to record entry: ' + err.message);
  });
}

function auditMiddleware(strapi) {
  return async (ctx, next) => {
    const result = await next();
    try {
      if (!AUDITED_ACTIONS.has(ctx.action)) return result;
      const uid = ctx.uid || (ctx.contentType && ctx.contentType.uid);
      if (!AUDITED_TYPES.has(uid) || uid === AUDIT_UID) return result;

      const data = (ctx.params && ctx.params.data) || {};
      const ent = result || {};
      const who = actorFrom(strapi);
      const meta = requestMeta(strapi);
      const title = ent.title || ent.name || data.title || data.name;
      const fields = ctx.action === 'update' && data && typeof data === 'object' ? Object.keys(data).slice(0, 40) : undefined;

      await recordBestEffort(strapi, {
        occurredAt: new Date().toISOString(),
        action: ctx.action,
        contentType: uid,
        targetType: uid,
        entityId: String(ent.documentId || ent.id || (ctx.params && ctx.params.documentId) || ''),
        entitySlug: ent.slug || data.slug || '',
        ...who,
        ...meta,
        sourceService: 'cms',
        outcome: 'success',
        changeSummary: title ? `${ctx.action} ${title}` : ctx.action,
        summary: { title, fields },
      });
    } catch (e) {
      strapi.log.error('[audit] middleware error: ' + e.message);
    }
    return result;
  };
}

async function repairMismatchedV2(strapi) {
  const result = await verifyChain(strapi);
  if (result.intact) return result;
  const broken = await strapi.db.query(AUDIT_UID).findOne({ where: { seq: result.brokenAt } });
  if (!broken || String(broken.schemaVersion) !== '2') return result;
  strapi.log.warn('[audit] repairing schema v2 hashes from seq ' + result.brokenAt);
  const all = await strapi.db.query(AUDIT_UID).findMany({
    where: { seq: { $gte: result.brokenAt } },
    orderBy: { seq: 'asc' },
  });
  let prev = await strapi.db.query(AUDIT_UID).findOne({ where: { seq: result.brokenAt - 1 } });
  let prevHash = prev ? prev.hash : GENESIS;
  const knex = strapi.db.connection;
  for (const row of all) {
    const next = { ...row, prevHash };
    const hash = sha256(canonical(next));
    await knex('audit_logs').where({ seq: row.seq }).update({ hash, prev_hash: prevHash });
    prevHash = hash;
  }
  return verifyChain(strapi);
}

async function verifyChain(strapi, limit = 50000) {
  const all = await strapi.db.query(AUDIT_UID).findMany({ orderBy: { seq: 'asc' }, limit });
  let prevHash = GENESIS;
  let expectedSeq = 1;
  for (const e of all) {
    if (e.seq !== expectedSeq) {
      return { intact: false, brokenAt: e.seq, reason: 'sequence gap or reordering', checked: expectedSeq - 1 };
    }
    if (e.prevHash !== prevHash) {
      return { intact: false, brokenAt: e.seq, reason: 'prevHash does not match previous entry', checked: expectedSeq - 1 };
    }
    const recomputed = sha256(canonical(e));
    if (recomputed !== e.hash) {
      return { intact: false, brokenAt: e.seq, reason: 'stored hash does not match contents (entry altered)', checked: expectedSeq - 1 };
    }
    prevHash = e.hash;
    expectedSeq += 1;
  }
  return {
    intact: true,
    count: all.length,
    truncated: all.length >= limit,
    head: prevHash === GENESIS ? null : prevHash,
    schemaVersion: SCHEMA_VERSION,
  };
}

function parseListQuery(query = {}) {
  const page = Math.max(1, Number(query.page) || 1);
  const pageSize = Math.min(50, Math.max(1, Number(query.pageSize) || 20));
  const where = {};
  if (query.action) where.action = String(query.action).slice(0, 80);
  if (query.eventType) where.eventType = String(query.eventType).slice(0, 80);
  if (query.outcome) where.outcome = String(query.outcome).slice(0, 40);
  if (query.severity) where.severity = String(query.severity).slice(0, 40);
  if (query.actorId) where.actorId = String(query.actorId).slice(0, 80);
  if (query.sourceService) where.sourceService = String(query.sourceService).slice(0, 80);
  if (query.targetType) where.contentType = String(query.targetType).slice(0, 120);
  if (query.targetId) where.entityId = String(query.targetId).slice(0, 120);
  if (query.requestId) where.requestId = String(query.requestId).slice(0, 80);
  const from = String(query.from || '').trim();
  const to = String(query.to || '').trim();
  if (from || to) {
    where.occurredAt = {};
    if (from) where.occurredAt.$gte = from;
    if (to) where.occurredAt.$lte = to;
  }
  const q = String(query.q || '').trim().slice(0, 80);
  if (q) {
    where.$or = [
      { actor: { $containsi: q } },
      { entitySlug: { $containsi: q } },
      { action: { $containsi: q } },
      { changeSummary: { $containsi: q } },
    ];
  }
  return { page, pageSize, where };
}

async function listEvents(strapi, query, detailed) {
  const { page, pageSize, where } = parseListQuery(query);
  const [results, total] = await Promise.all([
    strapi.db.query(AUDIT_UID).findMany({
      where,
      orderBy: { seq: 'desc' },
      offset: (page - 1) * pageSize,
      limit: pageSize,
    }),
    strapi.db.query(AUDIT_UID).count({ where }),
  ]);
  return {
    pagination: { page, pageSize, total, pageCount: Math.max(1, Math.ceil(total / pageSize)) },
    results: results.map((row) => publicView(row, detailed)),
  };
}

async function stats(strapi) {
  const total = await strapi.db.query(AUDIT_UID).count();
  const failure = await strapi.db.query(AUDIT_UID).count({ where: { outcome: { $in: ['failure', 'denied'] } } });
  const denied = await strapi.db.query(AUDIT_UID).count({ where: { outcome: 'denied' } });
  const high = await strapi.db.query(AUDIT_UID).count({ where: { severity: { $in: ['high', 'critical'] } } });
  const recent = await strapi.db.query(AUDIT_UID).findMany({ orderBy: { seq: 'desc' }, limit: 8 });
  return {
    total,
    failure,
    denied,
    high,
    success: Math.max(0, total - failure),
    recent: recent.map((row) => publicView(row, false)),
  };
}

function registerAuditRoutes(strapi) {
  strapi.server.routes([
    {
      method: 'GET',
      path: '/portal-internal/audit',
      handler: async (ctx) => {
        const access = await auditAccess(strapi, ctx);
        if (!access) {
          ctx.status = 401;
          ctx.body = { error: 'Unauthorized' };
          return;
        }
        if (!access.canView) {
          ctx.status = 403;
          ctx.body = { error: 'Audit records are restricted.' };
          return;
        }
        ctx.body = await listEvents(strapi, ctx.query, access.detailed);
      },
      config: { auth: false },
    },
    {
      method: 'GET',
      path: '/portal-internal/audit/stats',
      handler: async (ctx) => {
        const access = await auditAccess(strapi, ctx);
        if (!access) {
          ctx.status = 401;
          ctx.body = { error: 'Unauthorized' };
          return;
        }
        if (!access.canView) {
          ctx.status = 403;
          ctx.body = { error: 'Audit records are restricted.' };
          return;
        }
        ctx.body = await stats(strapi);
      },
      config: { auth: false },
    },
    {
      method: 'GET',
      path: '/portal-internal/audit/verify',
      handler: async (ctx) => {
        const access = await auditAccess(strapi, ctx);
        if (!access) {
          ctx.status = 401;
          ctx.body = { error: 'Unauthorized' };
          return;
        }
        if (!access.canVerify) {
          ctx.status = 403;
          ctx.body = { error: 'Integrity verification is restricted to Super Admin.' };
          return;
        }
        ctx.body = await verifyChain(strapi);
      },
      config: { auth: false },
    },
    {
      method: 'GET',
      path: '/portal-internal/audit/export',
      handler: async (ctx) => {
        const access = await auditAccess(strapi, ctx);
        if (!access) {
          ctx.status = 401;
          ctx.body = { error: 'Unauthorized' };
          return;
        }
        if (!access.canExport) {
          ctx.status = 403;
          ctx.body = { error: 'Export is restricted to Super Admin.' };
          return;
        }
        const cap = Math.min(1000, Number(ctx.query.limit) || 500);
        const where = parseListQuery(ctx.query).where;
        const rows = await strapi.db.query(AUDIT_UID).findMany({
          where,
          orderBy: { seq: 'desc' },
          limit: cap,
        });
        await recordBestEffort(strapi, {
          action: 'export',
          eventType: 'administration',
          outcome: 'success',
          actor: access.email,
          actorId: String(access.id || ''),
          actorType: 'user',
          identityProvider: 'strapi',
          sourceService: 'portal',
          targetType: AUDIT_UID,
          changeSummary: `Exported ${rows.length} audit events`,
          summary: { count: rows.length, format: String(ctx.query.format || 'json') },
        });
        ctx.body = { results: rows.map((row) => publicView(row, true)), count: rows.length };
      },
      config: { auth: false },
    },
    {
      method: 'POST',
      path: '/portal-internal/audit/ingest',
      handler: async (ctx) => {
        const required = process.env.AUDIT_LOG_TOKEN;
        if (!tokenMatches(ctx.request.header['x-audit-token'], required)) {
          ctx.status = 401;
          ctx.body = { error: 'Unauthorized' };
          return;
        }
        const body = ctx.request.body || {};
        if (!body.action) {
          ctx.status = 400;
          ctx.body = { error: 'action is required' };
          return;
        }
        try {
          await record(strapi, {
            action: String(body.action).slice(0, 80),
            eventType: body.eventType,
            outcome: body.outcome,
            severity: body.severity,
            actor: String(body.actor || 'system').slice(0, 180),
            actorId: String(body.actorId || '').slice(0, 80),
            actorType: body.actorType,
            identityProvider: body.identityProvider,
            sourceService: body.sourceService || 'frontend',
            requestId: body.requestId,
            targetType: body.targetType,
            entityId: body.targetId,
            entitySlug: body.targetDisplayName,
            reason: body.reason,
            changeSummary: body.changeSummary,
            summary: body.metadata,
            occurredAt: body.occurredAt,
          });
          ctx.body = { ok: true };
        } catch (e) {
          ctx.status = 503;
          ctx.body = { error: 'Audit store unavailable' };
        }
      },
      config: { auth: false },
    },
  ]);
}

async function auditAccess(strapi, ctx) {
  const header = String(ctx.request.header.authorization || '');
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
  if (!token) return null;
  try {
    const tokenService = strapi.service('admin::token') || strapi.admin?.services?.token;
    const decoded = tokenService?.decodeJwtToken
      ? await tokenService.decodeJwtToken(token)
      : tokenService?.decode
        ? await tokenService.decode(token)
        : null;
    const id = decoded?.id || decoded?.userId || decoded?.payload?.id;
    if (!id) return null;
    const user = await strapi.db.query('admin::user').findOne({ where: { id }, populate: ['roles'] });
    if (!user || user.isActive === false) return null;
    const roles = (user.roles || []).map((r) => String(r.name || '').toLowerCase());
    const isSuperAdmin = roles.includes('super admin');
    const isAdmin = roles.includes('admin') || roles.includes('administrator');
    return {
      id: user.id,
      email: user.email,
      canView: isSuperAdmin || isAdmin,
      detailed: isSuperAdmin,
      canExport: isSuperAdmin,
      canVerify: isSuperAdmin,
    };
  } catch {
    return null;
  }
}

module.exports = {
  auditMiddleware,
  verifyChain,
  registerAuditRoutes,
  repairMismatchedV2,
  record,
  recordBestEffort,
  AUDIT_UID,
  AUDITED_TYPES,
};
