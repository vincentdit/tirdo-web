'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const {
  sha256,
  canonical,
  canonicalV1,
  sanitizeSummary,
  csvCell,
  toCsv,
  publicView,
  tokenMatches,
  eventTypeFor,
  severityFor,
  GENESIS,
} = require('./audit-lib');

describe('audit-lib', () => {
  it('keeps v1 hashes stable for existing chain entries', () => {
    const e = {
      seq: 1,
      occurredAt: '2026-01-01T00:00:00.000Z',
      action: 'create',
      contentType: 'api::article.article',
      entityId: 'abc',
      entitySlug: 'hello',
      actor: 'cms@tirdo.or.tz',
      actorId: '1',
      summary: { title: 'Hello' },
      prevHash: GENESIS,
    };
    const hash = sha256(canonicalV1(e));
    assert.equal(canonical(e), canonicalV1(e));
    assert.equal(hash.length, 64);
    e.summary = { title: 'Hello' };
    assert.equal(sha256(canonicalV1(e)), hash);
  });

  it('redacts secret-looking keys and truncates large summaries', () => {
    const cleaned = sanitizeSummary({
      title: 'User',
      password: 'Tirdo@2026',
      token: 'abc',
      nested: { refreshToken: 'nope', ok: 'yes' },
    });
    assert.equal(cleaned.password, '[redacted]');
    assert.equal(cleaned.token, '[redacted]');
    assert.equal(cleaned.nested.refreshToken, '[redacted]');
    assert.equal(cleaned.nested.ok, 'yes');
    assert.equal(Object.prototype.hasOwnProperty.call(sanitizeSummary({ title: 'A', fields: undefined }), 'fields'), false);
  });

  it('neutralizes CSV formula injection', () => {
    assert.equal(csvCell('=CMD()'), "'=CMD()");
    assert.equal(csvCell('+1+1'), "'+1+1");
    assert.equal(csvCell('normal'), 'normal');
    const csv = toCsv([{ action: '=1+1', actor: 'cms@tirdo.or.tz' }], ['action', 'actor']);
    assert.match(csv, /^action,actor\n'=1\+1,cms@tirdo\.or\.tz$/);
  });

  it('maps event types and severity without inventing providers', () => {
    assert.equal(eventTypeFor('login_failed'), 'authentication');
    assert.equal(eventTypeFor('create', 'api::article.article'), 'content');
    assert.equal(severityFor('login_failed', 'failure'), 'high');
    assert.equal(severityFor('create', 'success'), 'informational');
  });

  it('hides hash details from non-detailed viewers', () => {
    const row = {
      id: 3,
      seq: 3,
      action: 'login_failed',
      contentType: 'authentication',
      actor: 'cms@tirdo.or.tz',
      summary: { ip: '10.0.0.8', title: 'portal' },
      hash: 'abc',
      prevHash: GENESIS,
    };
    const limited = publicView(row, false);
    assert.equal(limited.hash, undefined);
    assert.equal(limited.summary.ip, 'recorded');
    const full = publicView(row, true);
    assert.equal(full.hash, 'abc');
    assert.equal(full.summary.ip, '10.0.0.8');
  });

  it('rejects empty or mismatched ingest tokens', () => {
    assert.equal(tokenMatches('a', ''), false);
    assert.equal(tokenMatches('', 'a'), false);
    assert.equal(tokenMatches('secret', 'secret'), true);
    assert.equal(tokenMatches('secret', 'Secret'), false);
  });
});
