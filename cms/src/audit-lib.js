'use strict';

const crypto = require('crypto');

const SCHEMA_VERSION = '2';
const GENESIS = 'GENESIS';
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
  'api::leader.leader',
  'api::event.event',
  'api::partner.partner',
  'api::e-service.e-service',
  'api::portal-grant.portal-grant',
  'api::technology.technology',
  'api::site-brand.site-brand',
  'admin::user',
  'admin::role',
]);

const AUDITED_ACTIONS = new Set(['create', 'update', 'delete', 'publish', 'unpublish']);

const SECRET_KEY = /password|passwd|secret|token|cookie|authorization|api[_-]?key|refresh|session|private.?key|card|cvv|cvc|pan/i;
const MAX_SUMMARY_CHARS = 4000;

function sha256(s) {
  return crypto.createHash('sha256').update(s).digest('hex');
}

function stableStringify(v) {
  if (v === null || typeof v !== 'object') return JSON.stringify(v);
  if (Array.isArray(v)) return '[' + v.map(stableStringify).join(',') + ']';
  return '{' + Object.keys(v).sort().map((k) => JSON.stringify(k) + ':' + stableStringify(v[k])).join(',') + '}';
}

function canonicalV1(e) {
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

function canonicalV2(e) {
  return stableStringify({
    seq: e.seq,
    occurredAt: e.occurredAt,
    recordedAt: e.recordedAt || '',
    action: e.action,
    contentType: e.contentType,
    entityId: e.entityId || '',
    entitySlug: e.entitySlug || '',
    actor: e.actor || 'system',
    actorId: e.actorId || '',
    summary: JSON.parse(JSON.stringify(e.summary || {})),
    prevHash: e.prevHash,
    schemaVersion: e.schemaVersion || SCHEMA_VERSION,
    eventType: e.eventType || '',
    outcome: e.outcome || '',
    severity: e.severity || '',
    actorType: e.actorType || '',
    identityProvider: e.identityProvider || '',
    sourceService: e.sourceService || '',
    requestId: e.requestId || '',
    targetType: e.targetType || '',
    reason: e.reason || '',
    changeSummary: e.changeSummary || '',
  });
}

function canonical(e) {
  const version = String(e.schemaVersion || '1');
  return version === '2' ? canonicalV2(e) : canonicalV1(e);
}

function redactValue(value, depth = 0) {
  if (depth > 4) return '[truncated]';
  if (value == null) return value;
  if (typeof value === 'string') return value.length > 240 ? value.slice(0, 240) + '…' : value;
  if (typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.slice(0, 20).map((item) => redactValue(item, depth + 1));
  const out = {};
  for (const [key, item] of Object.entries(value)) {
    if (SECRET_KEY.test(key)) {
      out[key] = '[redacted]';
      continue;
    }
    out[key] = redactValue(item, depth + 1);
  }
  return out;
}

function sanitizeSummary(input) {
  const cleaned = redactValue(input && typeof input === 'object' ? input : {});
  const compact = JSON.parse(JSON.stringify(cleaned ?? {}));
  let json = stableStringify(compact);
  if (json.length > MAX_SUMMARY_CHARS) {
    return { truncated: true, preview: json.slice(0, MAX_SUMMARY_CHARS) };
  }
  return compact;
}

function eventTypeFor(action, contentType) {
  if (['login', 'logout', 'login_failed', 'password_reset'].includes(action)) return 'authentication';
  if (['access_denied', 'privilege_denied'].includes(action)) return 'authorization';
  if (action === 'export') return 'administration';
  if (String(contentType || '').startsWith('admin::') || contentType === 'api::portal-grant.portal-grant') {
    return 'administration';
  }
  return 'content';
}

function severityFor(action, outcome) {
  const failed = outcome === 'failure' || outcome === 'denied';
  if (failed && ['login_failed', 'access_denied', 'privilege_denied'].includes(action)) return 'high';
  if (failed) return 'medium';
  if (['delete', 'unpublish', 'export'].includes(action)) return 'medium';
  if (['publish', 'login'].includes(action)) return 'low';
  return 'informational';
}

function csvCell(value) {
  const text = value == null ? '' : String(value);
  const safe = /^[=+\-@]/.test(text) ? `'${text}` : text;
  if (/[",\n\r]/.test(safe)) return `"${safe.replace(/"/g, '""')}"`;
  return safe;
}

function toCsv(rows, headers) {
  const lines = [headers.join(',')];
  for (const row of rows) {
    lines.push(headers.map((h) => csvCell(row[h])).join(','));
  }
  return lines.join('\n');
}

function publicView(row, detailed) {
  const summary = detailed ? row.summary || {} : redactViewerSummary(row.summary || {});
  return {
    id: row.id,
    seq: row.seq,
    schemaVersion: row.schemaVersion || '1',
    occurredAt: row.occurredAt,
    recordedAt: row.recordedAt || row.occurredAt,
    eventType: row.eventType || eventTypeFor(row.action, row.contentType),
    action: row.action,
    outcome: row.outcome || 'success',
    severity: row.severity || severityFor(row.action, row.outcome || 'success'),
    actorType: row.actorType || (row.actor === 'system' ? 'system' : 'user'),
    actorId: row.actorId || '',
    actorDisplayName: row.actor || 'system',
    identityProvider: row.identityProvider || 'strapi',
    targetType: row.targetType || row.contentType,
    targetId: row.entityId || '',
    targetDisplayName: row.entitySlug || (summary && summary.title) || '',
    sourceService: row.sourceService || 'cms',
    requestId: row.requestId || '',
    reason: row.reason || '',
    changeSummary: row.changeSummary || '',
    summary,
    hash: detailed ? row.hash : undefined,
    prevHash: detailed ? row.prevHash : undefined,
  };
}

function redactViewerSummary(summary) {
  if (!summary || typeof summary !== 'object') return {};
  const { ip, userAgent, fields, title, truncated, preview } = summary;
  return {
    title,
    fields,
    truncated,
    preview: preview ? '[redacted for this role]' : undefined,
    ip: ip ? 'recorded' : undefined,
    userAgent: userAgent ? 'recorded' : undefined,
  };
}

function tokenMatches(provided, expected) {
  if (!expected || !provided) return false;
  const a = Buffer.from(String(provided), 'utf8');
  const b = Buffer.from(String(expected), 'utf8');
  const len = Math.max(a.length, b.length, 1);
  const pa = Buffer.alloc(len);
  const pb = Buffer.alloc(len);
  a.copy(pa);
  b.copy(pb);
  return crypto.timingSafeEqual(pa, pb) && a.length === b.length && b.length > 0;
}

module.exports = {
  SCHEMA_VERSION,
  GENESIS,
  AUDIT_UID,
  AUDITED_TYPES,
  AUDITED_ACTIONS,
  sha256,
  stableStringify,
  canonical,
  canonicalV1,
  canonicalV2,
  sanitizeSummary,
  redactValue,
  eventTypeFor,
  severityFor,
  csvCell,
  toCsv,
  publicView,
  tokenMatches,
};
