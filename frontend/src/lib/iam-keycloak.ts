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

function realmRolesForCmsRole(roleName: string) {
  const name = roleName.trim().toLowerCase();
  if (name === "super admin") return ["staff", "content-editor", "tirdo-admin"];
  if (name.includes("editor")) return ["staff", "content-editor"];
  return ["staff"];
}

/** Create or update the same person in Keycloak so Content Manager is not a second account. */
export async function ensureRealmUser(input: {
  email: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  cmsRoleName?: string;
}) {
  const email = String(input.email || "").trim().toLowerCase();
  if (!email.includes("@")) throw new IamError("A valid email is required for the sign-in account.", 400);
  const found = await kcAdmin(`/users?email=${encodeURIComponent(email)}&exact=true&max=2`);
  const rows = Array.isArray(found.json) ? (found.json as Record<string, unknown>[]) : [];
  let userId = String(rows[0]?.id || "");
  if (!userId) {
    const created = await kcAdmin("/users", {
      method: "POST",
      body: JSON.stringify({
        username: email,
        email,
        firstName: String(input.firstName || ""),
        lastName: String(input.lastName || ""),
        enabled: true,
        emailVerified: true,
        ...(input.password
          ? { credentials: [{ type: "password", value: input.password, temporary: false }] }
          : {}),
      }),
    });
    if (!created.ok && created.status !== 409) {
      throw new IamError("Could not add this user to the sign-in realm.", 502);
    }
    const location = created.headers.get("location") || "";
    userId = location.split("/").filter(Boolean).pop() || "";
    if (!userId) {
      const again = await kcAdmin(`/users?email=${encodeURIComponent(email)}&exact=true&max=2`);
      const againRows = Array.isArray(again.json) ? (again.json as Record<string, unknown>[]) : [];
      userId = String(againRows[0]?.id || "");
    }
  } else if (input.password) {
    const reset = await kcAdmin(`/users/${encodeURIComponent(userId)}/reset-password`, {
      method: "PUT",
      body: JSON.stringify({ type: "password", value: input.password, temporary: false }),
    });
    if (!reset.ok) throw new IamError("The sign-in password could not be updated.", 502);
  }
  if (!userId) throw new IamError("Could not add this user to the sign-in realm.", 502);
  for (const roleName of realmRolesForCmsRole(String(input.cmsRoleName || ""))) {
    const role = await kcAdmin(`/roles/${encodeURIComponent(roleName)}`);
    const roleJson = role.json as { id?: string; name?: string };
    if (!role.ok || !roleJson?.id) continue;
    await kcAdmin(`/users/${encodeURIComponent(userId)}/role-mappings/realm`, {
      method: "POST",
      body: JSON.stringify([{ id: roleJson.id, name: roleJson.name || roleName }]),
    });
  }
  return userId;
}

/** Ends every Keycloak SSO session for this user (website, LIMS, and other realm clients). */
export async function endKeycloakUserSessions(userId: string) {
  const id = String(userId || "").trim();
  if (!id) return false;
  try {
    const res = await kcAdmin(`/users/${encodeURIComponent(id)}/logout`, { method: "POST", body: "{}" });
    return res.ok || res.status === 204;
  } catch {
    return false;
  }
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
