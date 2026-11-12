import { oidcRolesFromPayload } from "@/lib/e-service-access";
import { parseJwtPayload, siteCookieOptions } from "@/lib/oidc";
import { allowOidcSubject, oidcPayloadActive } from "@/lib/oidc-session-revoke";

export const OIDC_SESS_COOKIE = "tirdo_oidc_sess";
export const OIDC_ACCESS_COOKIE = "tirdo_oidc_at";
export const OIDC_ID_COOKIE = "tirdo_oidc_it";
/** Browsers often drop cookies above ~4 KiB; keep Set-Cookie well under that. */
export const MAX_ACCESS_TOKEN_COOKIE = 3000;
/** Website SSO stays signed in after the short Keycloak access token expires. */
export const BROWSER_SESSION_MAX_AGE = 8 * 60 * 60;

export type CompactOidcSession = {
  sub: string;
  username?: string;
  name?: string;
  email?: string;
  roles: string[];
  exp: number;
  sid?: string;
};

type CookieJar = { get(name: string): { value: string } | undefined };

export function compactSessionFromPayload(payload: Record<string, unknown>): CompactOidcSession | null {
  const sub = String(payload.sub || "").trim();
  if (!sub) return null;
  const exp = Number(payload.exp);
  return {
    sub,
    username: payload.preferred_username ? String(payload.preferred_username) : undefined,
    name: payload.name ? String(payload.name) : undefined,
    email: payload.email ? String(payload.email) : undefined,
    roles: oidcRolesFromPayload(payload),
    exp: Number.isFinite(exp) ? exp : Math.floor(Date.now() / 1000) + 3600,
    sid: payload.sid ? String(payload.sid) : undefined,
  };
}

export function encodeCompactSession(session: CompactOidcSession) {
  return Buffer.from(JSON.stringify(session), "utf8").toString("base64url");
}

export function decodeCompactSession(raw: string | undefined): CompactOidcSession | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(Buffer.from(raw, "base64url").toString("utf8")) as Partial<CompactOidcSession>;
    if (!parsed || typeof parsed !== "object" || !parsed.sub) return null;
    const exp = Number(parsed.exp);
    return {
      sub: String(parsed.sub),
      username: parsed.username ? String(parsed.username) : undefined,
      name: parsed.name ? String(parsed.name) : undefined,
      email: parsed.email ? String(parsed.email) : undefined,
      roles: Array.isArray(parsed.roles) ? parsed.roles.map(String) : [],
      exp: Number.isFinite(exp) ? exp : 0,
      sid: parsed.sid ? String(parsed.sid) : undefined,
    };
  } catch {
    return null;
  }
}

const HIDDEN_CLIENT_ROLES = /^(default-roles-|offline_access$|uma_authorization$|manage-account|manage-account-links$|view-profile$|account:)/;

/** Roles used for UI gating, without Keycloak account-console names. */
export function clientFacingRoles(roles: string[]) {
  return roles.filter((role) => !HIDDEN_CLIENT_ROLES.test(role));
}

type CachedOidcTokens = { accessToken: string; idToken?: string; exp: number };
const oidcTokenCache = new Map<string, CachedOidcTokens>();

function cacheKey(session: Pick<CompactOidcSession, "sub" | "sid">) {
  return session.sid ? `${session.sub}:${session.sid}` : session.sub;
}

function pruneOidcTokenCache(now = Date.now()) {
  for (const [key, value] of oidcTokenCache) {
    if (value.exp * 1000 <= now) oidcTokenCache.delete(key);
  }
}

export function cacheOidcTokens(
  session: CompactOidcSession,
  tokens: { accessToken: string; idToken?: string },
  accessExp = session.exp
) {
  pruneOidcTokenCache();
  oidcTokenCache.set(cacheKey(session), {
    accessToken: tokens.accessToken,
    idToken: tokens.idToken,
    exp: accessExp,
  });
}

export function clearCachedOidcTokens(session: CompactOidcSession | null) {
  if (session) oidcTokenCache.delete(cacheKey(session));
}

export function readCachedOidcTokens(session: CompactOidcSession | null): CachedOidcTokens | null {
  if (!session) return null;
  pruneOidcTokenCache();
  return oidcTokenCache.get(cacheKey(session)) || null;
}

export function readOidcBrowserSession(jar: CookieJar): CompactOidcSession | null {
  const access = jar.get(OIDC_ACCESS_COOKIE)?.value || "";
  const fromAccess = access ? compactSessionFromPayload(parseJwtPayload(access) || {}) : null;
  if (fromAccess && oidcPayloadActive(fromAccess as unknown as Record<string, unknown>)) return fromAccess;
  const compact = decodeCompactSession(jar.get(OIDC_SESS_COOKIE)?.value);
  if (compact && oidcPayloadActive(compact as unknown as Record<string, unknown>)) return compact;
  return null;
}

export function readOidcAccessToken(jar: CookieJar): string {
  const cookie = jar.get(OIDC_ACCESS_COOKIE)?.value || "";
  if (cookie) return cookie;
  return readCachedOidcTokens(readOidcBrowserSession(jar))?.accessToken || "";
}

type CookieSetter = {
  set: (name: string, value: string, options: ReturnType<typeof siteCookieOptions>) => unknown;
};

export function writeOidcBrowserCookies(
  jar: CookieSetter,
  tokens: { accessToken: string; idToken?: string; maxAge: number }
) {
  const payload =
    parseJwtPayload(tokens.accessToken) || (tokens.idToken ? parseJwtPayload(tokens.idToken) : null) || {};
  const session = compactSessionFromPayload(payload);
  if (!session) return;
  const accessExp = session.exp;
  const maxAge = Math.max(BROWSER_SESSION_MAX_AGE, tokens.maxAge || 0);
  session.exp = Math.floor(Date.now() / 1000) + maxAge;
  allowOidcSubject(session.sub);
  jar.set(OIDC_SESS_COOKIE, encodeCompactSession(session), siteCookieOptions(maxAge));
  cacheOidcTokens(session, tokens, accessExp);
}

export function clearOidcBrowserCookies(jar: CookieSetter) {
  const gone = { ...siteCookieOptions(0), maxAge: 0 };
  for (const name of [
    OIDC_ACCESS_COOKIE,
    OIDC_ID_COOKIE,
    OIDC_SESS_COOKIE,
    "tirdo_oidc_v",
    "tirdo_oidc_s",
    "tirdo_oidc_r",
  ]) {
    jar.set(name, "", gone);
  }
}
