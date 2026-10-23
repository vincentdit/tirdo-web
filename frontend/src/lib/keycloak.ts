"use client";
// Single Keycloak instance shared across the app. init() is memoised so React
// 18 strict-mode double effects (and multiple consumers) never re-initialise.
import Keycloak from "keycloak-js";

let kc: Keycloak | null = null;
let initPromise: Promise<boolean> | null = null;
let cachedCfg: AuthConfig | null = null;

type AuthConfig = { url: string; realm: string; clientId: string };

export async function loadAuthConfig(): Promise<AuthConfig> {
  if (cachedCfg) return cachedCfg;
  try {
    const res = await fetch("/api/public-config", { cache: "no-store" });
    if (res.ok) {
      const j = await res.json();
      if (j?.keycloakUrl) {
        cachedCfg = { url: j.keycloakUrl, realm: j.realm || "tirdo", clientId: j.clientId || "tirdo-web" };
        return cachedCfg;
      }
    }
  } catch {
    // fall through to build-time defaults
  }
  cachedCfg = {
    url: process.env.NEXT_PUBLIC_KEYCLOAK_URL || "http://localhost:8080/auth",
    realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || "tirdo",
    clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || "tirdo-web",
  };
  return cachedCfg;
}

export function getKeycloak(): Keycloak {
  if (!kc) throw new Error("Keycloak has not been initialised yet");
  return kc;
}

/** crypto.subtle exists only on HTTPS and localhost. LAN HTTP (e.g. :3001) cannot do PKCE. */
function canUsePkce() {
  return typeof window !== "undefined" && !!globalThis.crypto?.subtle;
}

function pkceInit() {
  return canUsePkce() ? ("S256" as const) : false;
}

function redirectToKeycloak(cfg: AuthConfig, extra: Record<string, string> = {}) {
  const redirectUri = extra.redirect_uri || window.location.href;
  const params = new URLSearchParams({
    client_id: cfg.clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid",
    ...extra,
  });
  const base = cfg.url.replace(/\/$/, "");
  window.location.assign(`${base}/realms/${cfg.realm}/protocol/openid-connect/auth?${params.toString()}`);
}

export function initKeycloak(): Promise<boolean> {
  if (!initPromise) {
    initPromise = loadAuthConfig()
      .then(async (cfg) => {
        if (!kc) kc = new Keycloak(cfg);
        const keycloak = kc;
        try {
          // No check-sso / silent iframe: those fail on LAN HTTP and then
          // Sign in does nothing. Callback after Keycloak redirect still works.
          const authed = await keycloak.init({
            pkceMethod: pkceInit(),
            checkLoginIframe: false,
          });
          keycloak.onTokenExpired = () => keycloak.updateToken(30).catch(() => startLogin());
          return authed;
        } catch {
          return false;
        }
      })
      .catch(() => false);
  }
  return initPromise;
}

/** Full-page redirect to Keycloak. Safe to call even if silent SSO failed. */
export async function startLogin() {
  await initKeycloak();
  const cfg = await loadAuthConfig();
  if (kc && canUsePkce()) {
    try {
      await kc.login({ redirectUri: window.location.href });
      return;
    } catch {
      /* LAN HTTP: Web Crypto is missing; fall through. */
    }
  }
  redirectToKeycloak(cfg);
}

export async function startRegister() {
  await initKeycloak();
  const cfg = await loadAuthConfig();
  if (kc && canUsePkce()) {
    try {
      await kc.register({ redirectUri: window.location.href });
      return;
    } catch {
      /* fall through */
    }
  }
  redirectToKeycloak(cfg);
}

export async function startLogout() {
  await initKeycloak();
  if (kc && canUsePkce()) {
    try {
      await kc.logout({ redirectUri: window.location.origin });
      return;
    } catch {
      /* fall through */
    }
  }
  window.location.assign(window.location.origin);
}
