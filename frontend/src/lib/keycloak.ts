"use client";
// Single Keycloak instance shared across the app. init() is memoised so React
// 18 strict-mode double effects (and multiple consumers) never re-initialise.
import Keycloak from "keycloak-js";

let kc: Keycloak | null = null;
let initPromise: Promise<boolean> | null = null;

type AuthConfig = { url: string; realm: string; clientId: string };

async function loadAuthConfig(): Promise<AuthConfig> {
  try {
    const res = await fetch("/api/public-config", { cache: "no-store" });
    if (res.ok) {
      const j = await res.json();
      if (j?.keycloakUrl) {
        return { url: j.keycloakUrl, realm: j.realm || "tirdo", clientId: j.clientId || "tirdo-web" };
      }
    }
  } catch {
    // fall through to build-time defaults
  }
  return {
    url: process.env.NEXT_PUBLIC_KEYCLOAK_URL || "http://localhost:8080/auth",
    realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || "tirdo",
    clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || "tirdo-web",
  };
}

export function getKeycloak(): Keycloak {
  if (!kc) throw new Error("Keycloak has not been initialised yet");
  return kc;
}

export function initKeycloak(): Promise<boolean> {
  if (!initPromise) {
    initPromise = loadAuthConfig().then((cfg) => {
      if (!kc) kc = new Keycloak(cfg);
      const keycloak = kc;
      return keycloak
        .init({
          onLoad: "check-sso",
          // Hidden iframe SSO needs HTTPS. On LAN http://172.30.30.54:3001 it
          // only logs CSP/storage warnings and does not block Sign in.
          silentCheckSsoRedirectUri:
            typeof window !== "undefined" && window.location.protocol === "https:"
              ? `${window.location.origin}/silent-check-sso.html`
              : undefined,
          pkceMethod: "S256",
          checkLoginIframe: false,
        })
        .then((authed) => {
          keycloak.onTokenExpired = () => keycloak.updateToken(30).catch(() => keycloak.login());
          return authed;
        });
    });
  }
  return initPromise;
}
