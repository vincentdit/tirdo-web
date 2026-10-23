import { publicSiteUrl, resolveKeycloakPublicUrl } from "@/lib/public-url";

export function keycloakInternalUrl(env: NodeJS.Dict<string> = process.env) {
  const raw = String(env.KEYCLOAK_INTERNAL_URL || "http://keycloak:8080/auth").trim().replace(/\/+$/, "");
  return raw;
}

export function oidcCallbackUrl(env: NodeJS.Dict<string> = process.env) {
  return `${publicSiteUrl(env)}/api/auth/callback`;
}

export function oidcRealm(env: NodeJS.Dict<string> = process.env) {
  return env.KEYCLOAK_REALM || env.NEXT_PUBLIC_KEYCLOAK_REALM || "tirdo";
}

export function oidcClientId(env: NodeJS.Dict<string> = process.env) {
  return env.KEYCLOAK_CLIENT_ID || env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || "tirdo-web";
}

export function oidcAuthorizeUrl(env: NodeJS.Dict<string> = process.env) {
  return `${resolveKeycloakPublicUrl(env)}/realms/${oidcRealm(env)}/protocol/openid-connect/auth`;
}

export function oidcTokenUrl(env: NodeJS.Dict<string> = process.env) {
  return `${keycloakInternalUrl(env)}/realms/${oidcRealm(env)}/protocol/openid-connect/token`;
}

export function oidcLogoutUrl(env: NodeJS.Dict<string> = process.env) {
  return `${resolveKeycloakPublicUrl(env)}/realms/${oidcRealm(env)}/protocol/openid-connect/logout`;
}

export function safeReturnTo(value: string | null | undefined, origin: string): string {
  const fallback = origin.replace(/\/+$/, "") || "/";
  if (!value) return fallback;
  try {
    const base = new URL(origin);
    const url = new URL(value, origin);
    if (url.origin !== base.origin) return fallback;
    return `${url.origin}${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}

export function parseJwtPayload(token: string): Record<string, unknown> | null {
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    const padded = parts[1].replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(parts[1].length / 4) * 4, "=");
    const json = Buffer.from(padded, "base64").toString("utf8");
    const payload = JSON.parse(json) as unknown;
    return payload && typeof payload === "object" ? (payload as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

export function siteCookieOptions(maxAge?: number) {
  return {
    httpOnly: true as const,
    sameSite: "lax" as const,
    secure: publicSiteUrl().startsWith("https"),
    path: "/",
    ...(typeof maxAge === "number" ? { maxAge } : {}),
  };
}
