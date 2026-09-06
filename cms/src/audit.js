'use strict';

// -----------------------------------------------------------------------
// Tamper-evident audit log of administrative content actions.
//
// A document-service middleware records every create / update / delete /
// publish / unpublish on the audited content types. Each entry is chained to
// the previous one with a SHA-256 hash (hash = SHA256(entry fields + prevHash)),
// so altering or deleting any past entry breaks the chain — detectable via
// verifyChain(). Entries are written with the low-level query engine (bypassing
// the document middleware, so no recursion) and the audit-log content type is
// append-only (its lifecycles reject updates/deletes).
// -----------------------------------------------------------------------
const crypto = require('crypto');

const AUDIT_UID = 'api::audit-log.audit-log';

const AUDITED_TYPES = new Set([
  'api::article.article',
  'api::project.project',
  'api::publication.publication',
  'api::service.service',
  'api::department.department',
  'api::page.page',
  'api::vacancy.vacancy',
  'api::tender.tender',
]);

const AUDITED_ACTIONS = new Set(['create', 'update', 'delete', 'publish', 'unpublish']);

const GENESIS = 'GENESIS';

function sha256(s) {
  return crypto.createHash('sha256').update(s).digest('hex');
}

// Stable (sorted-key) serialization so the hash is independent of JSON/JSONB
// key ordering when the entry is read back from the database.
function stableStringify(v) {
  if (v === null || typeof v !== 'object') return JSON.stringify(v);
  if (Array.isArray(v)) return '[' + v.map(stableStringify).join(',') + ']';
  return '{' + Object.keys(v).sort().map((k) => JSON.stringify(k) + ':' + stableStringify(v[k])).join(',') + '}';
}

// The exact set of fields covered by the hash (never the hash itself).
function canonical(e) {
  return stableStringify({
    seq: e.seq,
    occurredAt: e.occurredAt,
    action: e.action,
    contentType: e.contentType,
    entityId: e.entityId || '',
    entitySlug: e.entitySlug || '',
    actor: e.actor || 'system',
    actorId: e.actorId || '',
    summary: e.summary || {},
    prevHash: e.prevHash,
  });
}

// Identify the acting admin (or API caller) from the current request context.
function actorFrom(strapi) {
  try {
    const ctx = strapi.requestContext.get();
    const user = ctx && ctx.state && ctx.state.user;
    if (user) {
      const name = user.email || user.username || (user.firstname ? `${user.firstname} ${user.lastname || ''}`.trim() : null);
      return { actor: name || `admin#${user.id}`, actorId: String(user.id) };
    }
  } catch {
    /* no request context (e.g. bootstrap seeding) */
  }
  return { actor: 'system', actorId: '' };
}

// Serialize writes so concurrent operations in this instance can't fork the
// chain (single-container deployment; note for multi-replica setups below).
let queue = Promise.resolve();

function record(strapi, entry) {
  queue = queue
    .then(async () => {
      const last = await strapi.db.query(AUDIT_UID).findMany({ orderBy: { seq: 'desc' }, limit: 1 });
      const prev = last[0];
      const seq = prev ? prev.seq + 1 : 1;
      const prevHash = prev ? prev.hash : GENESIS;
      const base = {
        seq,
        occurredAt: entry.occurredAt,
        action: entry.action,
        contentType: entry.contentType,
        entityId: entry.entityId || '',
        entitySlug: entry.entitySlug || '',
        actor: entry.actor,
        actorId: entry.actorId,
        summary: entry.summary || {},
        prevHash,
      };
      const hash = sha256(canonical(base));
      await strapi.db.query(AUDIT_UID).create({ data: { ...base, hash } });
    })
    .catch((err) => {
      strapi.log.error('[audit] failed to record entry: ' + err.message);
    });
  return queue;
}

// Document-service middleware factory.
function auditMiddleware(strapi) {
  return async (ctx, next) => {
    const result = await next();
    try {
      if (!AUDITED_ACTIONS.has(ctx.action)) return result;
      const uid = ctx.uid || (ctx.contentType && ctx.contentType.uid);
      if (!AUDITED_TYPES.has(uid)) return result;

      const data = (ctx.params && ctx.params.data) || {};
      const ent = result || {};
      const { actor, actorId } = actorFrom(strapi);

      const summary = {};
      if (ctx.action === 'update' && data && typeof data === 'object') summary.fields = Object.keys(data);
      const title = ent.title || data.title;
      if (title) summary.title = title;

      await record(strapi, {
        occurredAt: new Date().toISOString(),
        action: ctx.action,
        contentType: uid,
        entityId: String(ent.documentId || (ctx.params && ctx.params.documentId) || ''),
        entitySlug: ent.slug || data.slug || '',
        actor,
        actorId,
        summary,
      });
    } catch (e) {
      strapi.log.error('[audit] middleware error: ' + e.message);
    }
    return result;
  };
}

// Walk the whole chain and verify integrity: sequence continuity, prevHash
// linkage, and that each stored hash matches a recomputation of its fields.
async function verifyChain(strapi) {
  const all = await strapi.db.query(AUDIT_UID).findMany({ orderBy: { seq: 'asc' } });
  let prevHash = GENESIS;
  let expectedSeq = 1;
  for (const e of all) {
    if (e.seq !== expectedSeq) return { intact: false, brokenAt: e.seq, reason: 'sequence gap or reordering', checked: expectedSeq - 1 };
    if (e.prevHash !== prevHash) return { intact: false, brokenAt: e.seq, reason: 'prevHash does not match previous entry', checked: expectedSeq - 1 };
    const recomputed = sha256(canonical(e));
    if (recomputed !== e.hash) return { intact: false, brokenAt: e.seq, reason: 'stored hash does not match contents (entry altered)', checked: expectedSeq - 1 };
    prevHash = e.hash;
    expectedSeq += 1;
  }
  return { intact: true, count: all.length, head: prevHash === GENESIS ? null : prevHash };
}

module.exports = { auditMiddleware, verifyChain, AUDIT_UID, AUDITED_TYPES };
