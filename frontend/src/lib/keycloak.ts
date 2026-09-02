"use client";
// Single Keycloak instance shared across the app. init() is memoised so React
// 18 strict-mode double effects (and multiple consumers) never re-initialise.
import Keycloak from "keycloak-js";

let kc: Keycloak | null = null;
let initPromise: Promise<boolean> | null = null;

export function getKeycloak(): Keycloak {
  if (!kc) {
    kc = new Keycloak({
      url: process.env.NEXT_PUBLIC_KEYCLOAK_URL || "http://localhost:8080/auth",
      realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || "tirdo",
      clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || "tirdo-web",
    });
  }
  return kc;
}

export function initKeycloak(): Promise<boolean> {
  const keycloak = getKeycloak();
  if (!initPromise) {
    initPromise = keycloak
      .init({
        onLoad: "check-sso",
        silentCheckSsoRedirectUri:
          typeof window !== "undefined" ? `${window.location.origin}/silent-check-sso.html` : undefined,
        pkceMethod: "S256",
        checkLoginIframe: false,
      })
      .then((authed) => {
        // keep the access token fresh
        keycloak.onTokenExpired = () => keycloak.updateToken(30).catch(() => keycloak.login());
        return authed;
      });
  }
  return initPromise;
}
