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

/** Sign-in uses Keycloak on the same public origin unless a non-local SSO URL is set. */
export function resolveKeycloakPublicUrl(env: NodeJS.Dict<string> = process.env) {
  const site = publicSiteUrl(env);
  const explicit = stripSlash(env.KEYCLOAK_PUBLIC_URL || env.NEXT_PUBLIC_KEYCLOAK_URL || "");
  if (explicit && !isLoopbackUrl(explicit)) return explicit;
  return `${site}/auth`;
}
