const TTL_MS = 12 * 60 * 60 * 1000;
const revokedSids = new Map<string, number>();
const revokedSubs = new Map<string, number>();

function prune(now: number) {
  for (const [key, until] of revokedSids) {
    if (until <= now) revokedSids.delete(key);
  }
  for (const [key, until] of revokedSubs) {
    if (until <= now) revokedSubs.delete(key);
  }
}

export function revokeOidcSession(payload: Record<string, unknown> | null | undefined) {
  if (!payload) return;
  const now = Date.now();
  const sid = String(payload.sid || "").trim();
  const sub = String(payload.sub || "").trim();
  if (sid) revokedSids.set(sid, now + TTL_MS);
  if (sub) revokedSubs.set(sub, now + TTL_MS);
  prune(now);
}

export function isOidcSessionRevoked(payload: Record<string, unknown> | null | undefined) {
  if (!payload) return false;
  prune(Date.now());
  const sid = String(payload.sid || "").trim();
  const sub = String(payload.sub || "").trim();
  if (sid && revokedSids.has(sid)) return true;
  if (sub && revokedSubs.has(sub)) return true;
  return false;
}

export function oidcPayloadActive(payload: Record<string, unknown> | null | undefined) {
  if (!payload) return false;
  const exp = Number(payload.exp);
  if (Number.isFinite(exp) && exp * 1000 < Date.now()) return false;
  return !isOidcSessionRevoked(payload);
}
