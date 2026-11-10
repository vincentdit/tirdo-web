import { keycloakInternalUrl, oidcRealm } from "@/lib/oidc";
import { stripSecrets } from "@/lib/iam";

export class IamError extends Error {
  status: number;
  constructor(message: string, status = 502) {
    super(message);
    this.status = status;
  }
}

type TokenCache = { access: string; exp: number };
let tokenCache: TokenCache | null = null;

function adminBase() {
  return `${keycloakInternalUrl()}/admin/realms/${encodeURIComponent(oidcRealm())}`;
}

function masterTokenUrl() {
  return `${keycloakInternalUrl()}/realms/master/protocol/openid-connect/token`;
}

export async function iamAdminToken(): Promise<string> {
  const now = Date.now();
  if (tokenCache && tokenCache.exp - 15000 > now) return tokenCache.access;
  const username = process.env.KEYCLOAK_ADMIN || "";
  const password = process.env.KEYCLOAK_ADMIN_PASSWORD || "";
  if (!username || !password) throw new IamError("Keycloak administrator credentials are not configured on the server.", 503);
  const res = await fetch(masterTokenUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "password",
      client_id: process.env.KEYCLOAK_IAM_CLIENT_ID || "admin-cli",
      username,
      password,
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });
  const json = (await res.json().catch(() => ({}))) as { access_token?: string; expires_in?: number };
  if (!res.ok || !json.access_token) throw new IamError("Could not authenticate to the Keycloak administration API.", 502);
  tokenCache = { access: json.access_token, exp: now + Math.max(30, Number(json.expires_in) || 60) * 1000 };
  return json.access_token;
}

export async function kcAdmin(path: string, init?: RequestInit) {
  const token = await iamAdminToken();
  const url = path.startsWith("http") ? path : `${adminBase()}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...(init?.headers || {}),
    },
    cache: "no-store",
    signal: AbortSignal.timeout(20000),
  });
  const text = await res.text();
  let json: unknown = {};
  if (text) {
    try {
      json = JSON.parse(text);
    } catch {
      json = { message: text.slice(0, 200) };
    }
  }
  return { ok: res.ok, status: res.status, json, headers: res.headers };
}

export async function kcJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await kcAdmin(path, init);
  if (!res.ok) {
    const msg = String((res.json as { errorMessage?: string; error?: string }).errorMessage || (res.json as { error?: string }).error || "Keycloak request failed.");
    throw new IamError(msg, res.status >= 400 && res.status < 500 ? res.status : 502);
  }
  return stripSecrets(res.json) as T;
}

export async function keycloakHealth(): Promise<{ ok: boolean; version?: string }> {
  try {
    const res = await fetch(`${keycloakInternalUrl()}/realms/${encodeURIComponent(oidcRealm())}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    const json = (await res.json().catch(() => ({}))) as { realm?: string };
    return { ok: res.ok && Boolean(json.realm), version: "26.0" };
  } catch {
    return { ok: false };
  }
}

const sensitiveOps = new Map<string, number[]>();
export function iamRateLimit(key: string, limit = 8, windowMs = 60000) {
  const now = Date.now();
  const prev = (sensitiveOps.get(key) || []).filter((t) => now - t < windowMs);
  if (prev.length >= limit) return false;
  prev.push(now);
  sensitiveOps.set(key, prev);
  return true;
}
