"use client";

export type AuthSession = {
  authenticated: boolean;
  username?: string;
  name?: string;
  email?: string;
  roles: string[];
};

let cachedSession: AuthSession | null = null;

export async function initKeycloak(): Promise<boolean> {
  try {
    const res = await fetch("/api/auth/session", { cache: "no-store" });
    const json = (await res.json().catch(() => ({}))) as AuthSession;
    cachedSession = {
      authenticated: Boolean(json.authenticated),
      username: json.username,
      name: json.name,
      email: json.email,
      roles: Array.isArray(json.roles) ? json.roles : [],
    };
    return cachedSession.authenticated;
  } catch {
    cachedSession = { authenticated: false, roles: [] };
    return false;
  }
}

export function getKeycloakSession(): AuthSession {
  return cachedSession || { authenticated: false, roles: [] };
}

export function loginHref(returnTo?: string) {
  const dest = returnTo || `${window.location.pathname}${window.location.search}` || "/";
  return `/api/auth/login?returnTo=${encodeURIComponent(dest)}`;
}

export function startLogin() {
  window.location.href = loginHref();
}

export function startRegister() {
  startLogin();
}

export function startLogout() {
  window.location.assign("/api/auth/logout");
}
