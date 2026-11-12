import { oidcRolesFromPayload } from "@/lib/e-service-access";
import { parseJwtPayload, siteCookieOptions } from "@/lib/oidc";
import { oidcPayloadActive } from "@/lib/oidc-session-revoke";

export const OIDC_SESS_COOKIE = "tirdo_oidc_sess";
export const OIDC_ACCESS_COOKIE = "tirdo_oidc_at";
export const OIDC_ID_COOKIE = "tirdo_oidc_it";
/** Keep the access-token cookie small enough for browsers and nginx. */
export const MAX_ACCESS_TOKEN_COOKIE = 3000;

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

export function readOidcBrowserSession(jar: CookieJar): CompactOidcSession | null {
  const access = jar.get(OIDC_ACCESS_COOKIE)?.value || "";
  const fromAccess = access ? compactSessionFromPayload(parseJwtPayload(access) || {}) : null;
  if (fromAccess && oidcPayloadActive(fromAccess as unknown as Record<string, unknown>)) return fromAccess;
  const compact = decodeCompactSession(jar.get(OIDC_SESS_COOKIE)?.value);
  if (compact && oidcPayloadActive(compact as unknown as Record<string, unknown>)) return compact;
  return null;
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
  const opts = siteCookieOptions(tokens.maxAge);
  if (session) jar.set(OIDC_SESS_COOKIE, encodeCompactSession(session), opts);
  if (tokens.accessToken.length <= MAX_ACCESS_TOKEN_COOKIE) {
    jar.set(OIDC_ACCESS_COOKIE, tokens.accessToken, opts);
  }
  if (tokens.idToken && tokens.idToken.length <= MAX_ACCESS_TOKEN_COOKIE) {
    jar.set(OIDC_ID_COOKIE, tokens.idToken, opts);
  }
}

export function clearOidcBrowserCookies(jar: CookieSetter) {
  const gone = { ...siteCookieOptions(0), maxAge: 0 };
  jar.set(OIDC_ACCESS_COOKIE, "", gone);
  jar.set(OIDC_ID_COOKIE, "", gone);
  jar.set(OIDC_SESS_COOKIE, "", gone);
}
