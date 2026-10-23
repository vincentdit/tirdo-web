function stripSlash(url: string) {
  return url.trim().replace(/\/+$/, "");
}

function isLoopbackUrl(url: string) {
  try {
    const host = new URL(url, "http://localhost").hostname;
    return host === "localhost" || host === "127.0.0.1" || host === "::1";
  } catch {
    return /localhost|127\.0\.0\.1/i.test(url);
  }
}

export function publicSiteUrl(env: NodeJS.Dict<string> = process.env) {
  return stripSlash(env.PUBLIC_URL || env.NEXT_PUBLIC_SITE_URL || "http://localhost");
}

function sameHostname(a: string, b: string) {
  try {
    return new URL(a).hostname === new URL(b).hostname;
  } catch {
    return false;
  }
}

/** Sign-in uses nginx /auth on the public site. Ignore :8082-style Keycloak ports. */
export function resolveKeycloakPublicUrl(env: NodeJS.Dict<string> = process.env) {
  const site = publicSiteUrl(env);
  const viaSite = `${site}/auth`;
  const explicit = stripSlash(env.KEYCLOAK_PUBLIC_URL || env.NEXT_PUBLIC_KEYCLOAK_URL || "");
  if (!explicit) return viaSite;
  if (isLoopbackUrl(explicit)) return viaSite;
  if (sameHostname(explicit, site)) return viaSite;
  return explicit;
}
