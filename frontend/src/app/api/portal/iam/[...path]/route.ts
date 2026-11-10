import { NextRequest, NextResponse } from "next/server";
import {
  IAM_CATALOG,
  integrationStatus,
  isDuplicateClient,
  publicClientView,
  suggestedClientId,
  validateRedirectUris,
} from "@/lib/iam";
import { iamRateLimit, kcAdmin, kcJson, keycloakHealth } from "@/lib/iam-keycloak";
import { oidcCallbackUrl, oidcClientId, oidcRealm } from "@/lib/oidc";
import { resolveKeycloakPublicUrl } from "@/lib/public-url";
import { iamAudit, iamFail, requireIam } from "../../_iam";

export const dynamic = "force-dynamic";

function parts(params: { path?: string[] }) {
  return params.path || [];
}

async function listClients() {
  const rows = await kcJson<Record<string, unknown>[]>("/clients?max=200");
  return Array.isArray(rows) ? rows : [];
}

function clientPayload(body: Record<string, unknown>, existing?: Record<string, unknown>) {
  const clientId = suggestedClientId(String(body.clientId || body.code || existing?.clientId || ""));
  const publicClient = body.publicClient !== false && body.clientAuthentication !== "confidential";
  const redirectUris = Array.isArray(body.redirectUris)
    ? body.redirectUris.map(String).map((v) => v.trim()).filter(Boolean)
    : String(body.redirectUris || "")
        .split(/\n|,/)
        .map((v) => v.trim())
        .filter(Boolean);
  const invalid = validateRedirectUris(redirectUris);
  if (invalid) throw Object.assign(new Error(invalid), { status: 400 });
  const rootUrl = String(body.rootUrl || body.applicationUrl || existing?.rootUrl || "").trim();
  return {
    clientId,
    name: String(body.name || existing?.name || clientId),
    description: String(body.description || existing?.description || ""),
    enabled: body.enabled !== false,
    protocol: String(body.protocol || "openid-connect") === "saml" ? "saml" : "openid-connect",
    publicClient,
    secret: publicClient ? undefined : undefined,
    standardFlowEnabled: true,
    implicitFlowEnabled: false,
    directAccessGrantsEnabled: false,
    serviceAccountsEnabled: !publicClient && body.serviceAccountsEnabled === true,
    rootUrl,
    baseUrl: String(body.baseUrl || existing?.baseUrl || "/"),
    redirectUris,
    webOrigins: Array.isArray(body.webOrigins) ? body.webOrigins.map(String) : rootUrl ? [rootUrl] : ["+"],
    frontchannelLogout: body.frontchannelLogout !== false,
    attributes: {
      ...((existing?.attributes && typeof existing.attributes === "object" ? existing.attributes : {}) as Record<string, unknown>),
      "pkce.code.challenge.method": publicClient || body.pkce !== false ? "S256" : "",
      "post.logout.redirect.uris": String(body.postLogoutRedirectUris || "+"),
      "backchannel.logout.url": String(body.backchannelLogoutUrl || ""),
      "backchannel.logout.session.required": "true",
      "tirdo.appCode": String(body.code || clientId),
      "tirdo.category": String(body.category || ""),
      "tirdo.owner": String(body.owner || ""),
      "tirdo.contact": String(body.technicalContact || ""),
      "tirdo.environment": String(body.environment || "Production"),
    },
  };
}

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  const gate = await requireIam();
  if (gate instanceof NextResponse) return gate;
  const segs = parts(params);
  const resource = segs[0] || "status";
  const id = segs[1];
  const extra = segs[2];
  try {
    if (resource === "status" || segs.length === 0) {
      const health = await keycloakHealth();
      return NextResponse.json({
        ok: health.ok,
        version: health.version,
        realm: oidcRealm(),
        issuer: `${resolveKeycloakPublicUrl()}/realms/${oidcRealm()}`,
        discovery: `${resolveKeycloakPublicUrl()}/realms/${oidcRealm()}/.well-known/openid-configuration`,
        siteClientId: oidcClientId(),
      });
    }
    if (resource === "dashboard") {
      const health = await keycloakHealth();
      const [realm, clients, userCount, events, sessionStats] = await Promise.all([
        kcJson<Record<string, unknown>>(""),
        listClients(),
        kcJson<number>("/users/count"),
        kcJson<Record<string, unknown>[]>("/events?max=20").catch(() => []),
        kcJson<Record<string, unknown>[]>("/client-session-stats").catch(() => []),
      ]);
      const enabledUsers = Number(userCount) || 0;
      const views = clients.map(publicClientView);
      const loginFails = (Array.isArray(events) ? events : []).filter((e) => String(e.type) === "LOGIN_ERROR");
      return NextResponse.json({
        health,
        realm: { name: realm.realm || oidcRealm(), displayName: realm.displayName, enabled: realm.enabled !== false },
        users: { total: enabledUsers },
        applications: {
          total: views.length,
          enabled: views.filter((v) => v.enabled).length,
          disabled: views.filter((v) => !v.enabled).length,
        },
        catalog: IAM_CATALOG.map((row) => {
          const found = views.find((v) => v.clientId === row.clientId);
          return { ...row, status: integrationStatus(row.clientId, Boolean(found), found?.enabled !== false), clientId: row.clientId };
        }),
        events: (Array.isArray(events) ? events : []).slice(0, 12).map((e) => ({
          time: e.time,
          type: e.type,
          clientId: e.clientId,
          ipAddress: e.ipAddress,
          error: e.error,
        })),
        failedLogins: loginFails.length,
        sessions: Array.isArray(sessionStats)
          ? sessionStats.map((s) => ({ clientId: s.clientId, active: s.active, offline: s.offline }))
          : [],
      });
    }
    if (resource === "applications" && !id) {
      const clients = await listClients();
      const views = clients.map(publicClientView);
      return NextResponse.json({
        results: [
          ...IAM_CATALOG.filter((row) => !views.some((v) => v.clientId === row.clientId)).map((row) => ({
            ...row,
            registered: false,
            enabled: false,
            status: "not_registered",
            protocol: "openid-connect",
          })),
          ...views.map((v) => ({ ...v, status: integrationStatus(v.clientId, true, v.enabled) })),
        ],
      });
    }
    if (resource === "applications" && id && extra === "events") {
      const events = await kcJson<Record<string, unknown>[]>(`/events?client=${encodeURIComponent(id)}&max=50`).catch(() => []);
      return NextResponse.json({ results: events });
    }
    if (resource === "applications" && id && extra === "roles") {
      const roles = await kcJson<Record<string, unknown>[]>(`/clients/${encodeURIComponent(id)}/roles`);
      return NextResponse.json({ results: Array.isArray(roles) ? roles.map((r) => ({ name: r.name, description: r.description })) : [] });
    }
    if (resource === "applications" && id) {
      const client = await kcJson<Record<string, unknown>>(`/clients/${encodeURIComponent(id)}`);
      return NextResponse.json({
        data: publicClientView(client),
        integration: {
          issuer: `${resolveKeycloakPublicUrl()}/realms/${oidcRealm()}`,
          realm: oidcRealm(),
          discovery: `${resolveKeycloakPublicUrl()}/realms/${oidcRealm()}/.well-known/openid-configuration`,
          callbackExample: `${String(client.rootUrl || "").replace(/\/+$/, "")}/api/auth/callback`,
          tirdoCallback: oidcCallbackUrl(),
        },
      });
    }
    if (resource === "users" && !id) {
      const q = request.nextUrl.searchParams.get("q") || "";
      const first = Number(request.nextUrl.searchParams.get("first") || "0") || 0;
      const max = Math.min(50, Number(request.nextUrl.searchParams.get("max") || "20") || 20);
      const qs = new URLSearchParams({ first: String(first), max: String(max) });
      if (q) qs.set("search", q);
      const users = await kcJson<Record<string, unknown>[]>(`/users?${qs.toString()}`);
      const count = await kcJson<number>("/users/count");
      return NextResponse.json({
        total: count,
        results: (Array.isArray(users) ? users : []).map((u) => ({
          id: u.id,
          username: u.username,
          email: u.email,
          firstName: u.firstName,
          lastName: u.lastName,
          enabled: u.enabled !== false,
          emailVerified: Boolean(u.emailVerified),
          requiredActions: u.requiredActions,
        })),
      });
    }
    if (resource === "users" && id && extra === "credentials") {
      const creds = await kcJson<Record<string, unknown>[]>(`/users/${encodeURIComponent(id)}/credentials`);
      return NextResponse.json({
        results: (Array.isArray(creds) ? creds : []).map((c) => ({
          id: c.id,
          type: c.type,
          userLabel: c.userLabel,
          createdDate: c.createdDate,
        })),
      });
    }
    if (resource === "users" && id && extra === "sessions") {
      const sessions = await kcJson<Record<string, unknown>[]>(`/users/${encodeURIComponent(id)}/sessions`);
      return NextResponse.json({ results: sessions });
    }
    if (resource === "users" && id && extra === "role-mappings") {
      const realm = await kcJson<{ realmMappings?: { name?: string }[] }>(`/users/${encodeURIComponent(id)}/role-mappings`);
      return NextResponse.json({ realm: (realm.realmMappings || []).map((r) => r.name) });
    }
    if (resource === "users" && id) {
      const user = await kcJson<Record<string, unknown>>(`/users/${encodeURIComponent(id)}`);
      return NextResponse.json({
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          enabled: user.enabled !== false,
          requiredActions: user.requiredActions,
        },
      });
    }
    if (resource === "groups") {
      const groups = await kcJson<Record<string, unknown>[]>("/groups");
      return NextResponse.json({ results: groups });
    }
    if (resource === "roles") {
      const roles = await kcJson<Record<string, unknown>[]>("/roles");
      return NextResponse.json({ results: (Array.isArray(roles) ? roles : []).map((r) => ({ name: r.name, description: r.description })) });
    }
    if (resource === "sessions") {
      const stats = await kcJson<Record<string, unknown>[]>("/client-session-stats").catch(() => []);
      return NextResponse.json({ results: stats });
    }
    if (resource === "events") {
      const type = request.nextUrl.searchParams.get("type") || "";
      const qs = new URLSearchParams({ max: "50" });
      if (type) qs.set("type", type);
      const events = await kcJson<Record<string, unknown>[]>(`/events?${qs.toString()}`).catch(() => []);
      return NextResponse.json({ results: events });
    }
    if (resource === "realm" || resource === "policies" || resource === "config") {
      const realm = await kcJson<Record<string, unknown>>("");
      return NextResponse.json({
        data: {
          realm: realm.realm,
          displayName: realm.displayName,
          sslRequired: realm.sslRequired,
          ssoSessionIdleTimeout: realm.ssoSessionIdleTimeout,
          ssoSessionMaxLifespan: realm.ssoSessionMaxLifespan,
          clientSessionIdleTimeout: realm.clientSessionIdleTimeout,
          clientSessionMaxLifespan: realm.clientSessionMaxLifespan,
          rememberMe: realm.rememberMe,
          resetPasswordAllowed: realm.resetPasswordAllowed,
          bruteForceProtected: realm.bruteForceProtected,
          otpPolicyType: realm.otpPolicyType,
          otpPolicyPeriod: realm.otpPolicyPeriod,
          otpPolicyDigits: realm.otpPolicyDigits,
        },
      });
    }
    if (resource === "idps") {
      const idps = await kcJson<Record<string, unknown>[]>("/identity-provider/instances").catch(() => []);
      return NextResponse.json({ results: idps });
    }
    if (resource === "mfa") {
      const realm = await kcJson<Record<string, unknown>>("");
      const actions = await kcJson<Record<string, unknown>[]>("/authentication/required-actions").catch(() => []);
      const totp = (Array.isArray(actions) ? actions : []).find((a) => String(a.alias) === "CONFIGURE_TOTP");
      const webauthn = (Array.isArray(actions) ? actions : []).find((a) => String(a.alias || "").includes("WEBAUTHN"));
      const count = await kcJson<number>("/users/count");
      return NextResponse.json({
        users: { total: count },
        policy: {
          otpType: realm.otpPolicyType || "totp",
          digits: realm.otpPolicyDigits,
          period: realm.otpPolicyPeriod,
          algorithm: realm.otpPolicyAlgorithm,
          configureTotpEnabled: totp?.enabled !== false,
          configureTotpDefault: Boolean(totp?.defaultAction),
          webauthnEnabled: Boolean(webauthn?.enabled),
          bruteForceProtected: Boolean(realm.bruteForceProtected),
        },
        note: "OTP secrets and current codes are never returned. Enrollment happens in the Keycloak login and Account Console.",
        accountConsole: `${resolveKeycloakPublicUrl()}/realms/${oidcRealm()}/account`,
      });
    }
    return NextResponse.json({ error: "Unknown IAM resource." }, { status: 404 });
  } catch (err) {
    return iamFail(err);
  }
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  const gate = await requireIam();
  if (gate instanceof NextResponse) return gate;
  const segs = parts(params);
  const resource = segs[0];
  const id = segs[1];
  const extra = segs[2];
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  try {
    if (resource === "applications" && !id) {
      const payload = clientPayload(body);
      const existing = await listClients();
      if (isDuplicateClient(existing.map((c) => String(c.clientId || "")), payload.clientId)) {
        return NextResponse.json({ error: "A Keycloak client with this ID already exists." }, { status: 409 });
      }
      const created = await kcAdmin("/clients", { method: "POST", body: JSON.stringify(payload) });
      if (!created.ok) return NextResponse.json({ error: "Could not register this application in Keycloak." }, { status: 502 });
      await iamAudit(gate.access, "iam_client_create", `Registered Keycloak client ${payload.clientId}`, { type: "client", name: payload.clientId });
      const location = created.headers.get("location") || "";
      const newId = location.split("/").filter(Boolean).pop() || "";
      let secret: string | undefined;
      if (!payload.publicClient && newId) {
        const sec = await kcJson<{ value?: string }>(`/clients/${encodeURIComponent(newId)}/client-secret`);
        secret = sec.value;
      }
      return NextResponse.json({
        ok: true,
        id: newId,
        clientId: payload.clientId,
        secretOnce: secret || null,
        warning: secret ? "Copy this client secret now. It will not be shown again." : undefined,
        issuer: `${resolveKeycloakPublicUrl()}/realms/${oidcRealm()}`,
        discovery: `${resolveKeycloakPublicUrl()}/realms/${oidcRealm()}/.well-known/openid-configuration`,
      });
    }
    if (resource === "applications" && id && extra === "test") {
      const health = await keycloakHealth();
      const client = await kcJson<Record<string, unknown>>(`/clients/${encodeURIComponent(id)}`);
      return NextResponse.json({
        ok: health.ok && client.enabled !== false,
        discovery: `${resolveKeycloakPublicUrl()}/realms/${oidcRealm()}/.well-known/openid-configuration`,
        clientId: client.clientId,
      });
    }
    if (resource === "applications" && id && extra === "secret") {
      if (!iamRateLimit(`secret:${gate.access.id}`)) return NextResponse.json({ error: "Too many credential rotations. Try again shortly." }, { status: 429 });
      if (body.confirm !== true) return NextResponse.json({ error: "Confirm client secret rotation." }, { status: 400 });
      const sec = await kcJson<{ value?: string }>(`/clients/${encodeURIComponent(id)}/client-secret`, { method: "POST", body: "{}" });
      await iamAudit(gate.access, "iam_client_secret_rotate", `Rotated client secret for ${id}`, { type: "client", id });
      return NextResponse.json({ secretOnce: sec.value || null, warning: "Copy this client secret now. It will not be shown again." });
    }
    if (resource === "users" && !id) {
      const username = String(body.username || "").trim();
      const email = String(body.email || "").trim();
      if (!username || !email) return NextResponse.json({ error: "Username and email are required." }, { status: 400 });
      const created = await kcAdmin("/users", {
        method: "POST",
        body: JSON.stringify({
          username,
          email,
          firstName: String(body.firstName || ""),
          lastName: String(body.lastName || ""),
          enabled: body.enabled !== false,
          emailVerified: Boolean(body.emailVerified),
          requiredActions: body.requireMfa === true ? ["CONFIGURE_TOTP"] : [],
        }),
      });
      if (!created.ok) return NextResponse.json({ error: "Could not create this user in Keycloak." }, { status: 502 });
      await iamAudit(gate.access, "iam_user_create", `Created Keycloak user ${username}`, { type: "user", name: username });
      return NextResponse.json({ ok: true });
    }
    if (resource === "users" && id && extra === "groups") {
      const groupId = String(body.groupId || "").trim();
      if (!groupId) return NextResponse.json({ error: "Group is required." }, { status: 400 });
      await kcAdmin(`/users/${encodeURIComponent(id)}/groups/${encodeURIComponent(groupId)}`, { method: "PUT", body: "{}" });
      await iamAudit(gate.access, "iam_user_group", `Assigned user ${id} to group ${groupId}`, { type: "user", id });
      return NextResponse.json({ ok: true });
    }
    if (resource === "users" && id && extra === "logout") {
      await kcAdmin(`/users/${encodeURIComponent(id)}/logout`, { method: "POST", body: "{}" });
      await iamAudit(gate.access, "iam_user_logout", `Revoked sessions for user ${id}`, { type: "user", id });
      return NextResponse.json({ ok: true });
    }
    if (resource === "users" && id && extra === "reset-mfa") {
      if (!iamRateLimit(`mfa:${gate.access.id}`, 5)) return NextResponse.json({ error: "Too many MFA reset attempts." }, { status: 429 });
      if (body.confirm !== true) return NextResponse.json({ error: "Confirm MFA credential removal." }, { status: 400 });
      const creds = await kcJson<Record<string, unknown>[]>(`/users/${encodeURIComponent(id)}/credentials`);
      for (const cred of Array.isArray(creds) ? creds : []) {
        if (String(cred.type) === "otp" || String(cred.type).toLowerCase().includes("webauthn")) {
          await kcAdmin(`/users/${encodeURIComponent(id)}/credentials/${encodeURIComponent(String(cred.id))}`, { method: "DELETE" });
        }
      }
      const user = await kcJson<Record<string, unknown>>(`/users/${encodeURIComponent(id)}`);
      await kcAdmin(`/users/${encodeURIComponent(id)}`, {
        method: "PUT",
        body: JSON.stringify({ ...user, requiredActions: ["CONFIGURE_TOTP"] }),
      });
      await kcAdmin(`/users/${encodeURIComponent(id)}/logout`, { method: "POST", body: "{}" });
      await iamAudit(gate.access, "iam_mfa_reset", `Reset MFA for user ${id} and revoked sessions`, { type: "user", id });
      return NextResponse.json({ ok: true, message: "OTP credentials were removed. The user must enroll a new authenticator. Sessions were revoked." });
    }
    if (resource === "groups" && !id) {
      const name = String(body.name || "").trim();
      if (!name) return NextResponse.json({ error: "Group name is required." }, { status: 400 });
      await kcAdmin("/groups", { method: "POST", body: JSON.stringify({ name }) });
      await iamAudit(gate.access, "iam_group_create", `Created group ${name}`, { type: "group", name });
      return NextResponse.json({ ok: true });
    }
    if (resource === "sessions" && id === "revoke-all") {
      if (body.confirm !== true) return NextResponse.json({ error: "Confirm revocation of all realm sessions." }, { status: 400 });
      if (!iamRateLimit(`revoke-all:${gate.access.id}`, 2, 300000)) return NextResponse.json({ error: "Too many global session revocations." }, { status: 429 });
      await kcAdmin("/logout-all", { method: "POST", body: "{}" });
      await iamAudit(gate.access, "iam_sessions_revoke_all", "Revoked all realm SSO sessions");
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: "Unknown IAM action." }, { status: 404 });
  } catch (err) {
    const status = Number((err as { status?: number }).status);
    if (status === 400) return NextResponse.json({ error: err instanceof Error ? err.message : "Invalid request." }, { status: 400 });
    return iamFail(err);
  }
}

export async function PUT(request: NextRequest, { params }: { params: { path: string[] } }) {
  const gate = await requireIam();
  if (gate instanceof NextResponse) return gate;
  const segs = parts(params);
  const resource = segs[0];
  const id = segs[1];
  const extra = segs[2];
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  try {
    if (resource === "applications" && id) {
      const current = await kcJson<Record<string, unknown>>(`/clients/${encodeURIComponent(id)}`);
      const payload = { ...current, ...clientPayload(body, current), id: current.id, clientId: current.clientId };
      delete (payload as { secret?: string }).secret;
      const res = await kcAdmin(`/clients/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(payload) });
      if (!res.ok) return NextResponse.json({ error: "Could not update this application." }, { status: 502 });
      await iamAudit(gate.access, "iam_client_update", `Updated Keycloak client ${current.clientId}`, { type: "client", id, name: String(current.clientId) });
      return NextResponse.json({ ok: true });
    }
    if (resource === "users" && id && extra === "roles") {
      const name = String(body.role || "").trim();
      if (!name) return NextResponse.json({ error: "Role is required." }, { status: 400 });
      const role = await kcJson<Record<string, unknown>>(`/roles/${encodeURIComponent(name)}`);
      await kcAdmin(`/users/${encodeURIComponent(id)}/role-mappings/realm`, { method: "POST", body: JSON.stringify([role]) });
      await iamAudit(gate.access, "iam_role_assign", `Assigned realm role ${name} to ${id}`, { type: "user", id });
      return NextResponse.json({ ok: true });
    }
    if (resource === "users" && id) {
      const current = await kcJson<Record<string, unknown>>(`/users/${encodeURIComponent(id)}`);
      const payload = {
        ...current,
        firstName: String(body.firstName ?? current.firstName ?? ""),
        lastName: String(body.lastName ?? current.lastName ?? ""),
        email: String(body.email ?? current.email ?? ""),
        enabled: body.enabled === undefined ? current.enabled !== false : body.enabled !== false,
        requiredActions: Array.isArray(body.requiredActions) ? body.requiredActions : current.requiredActions,
      };
      const res = await kcAdmin(`/users/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(payload) });
      if (!res.ok) return NextResponse.json({ error: "Could not update this user." }, { status: 502 });
      if (body.enabled === false) {
        await kcAdmin(`/users/${encodeURIComponent(id)}/logout`, { method: "POST", body: "{}" });
      }
      await iamAudit(gate.access, "iam_user_update", `Updated Keycloak user ${id}`, { type: "user", id });
      return NextResponse.json({ ok: true });
    }
    if (resource === "mfa") {
      const realm = await kcJson<Record<string, unknown>>("");
      const next = {
        ...realm,
        otpPolicyType: "totp",
        otpPolicyAlgorithm: "HmacSHA1",
        otpPolicyDigits: 6,
        otpPolicyPeriod: 30,
        bruteForceProtected: body.bruteForceProtected !== false,
      };
      await kcAdmin("", { method: "PUT", body: JSON.stringify(next) });
      const totp = {
        alias: "CONFIGURE_TOTP",
        name: "Configure OTP",
        providerId: "CONFIGURE_TOTP",
        enabled: body.configureTotpEnabled !== false,
        defaultAction: body.mandatory === true,
        priority: 10,
      };
      await kcAdmin("/authentication/required-actions/CONFIGURE_TOTP", { method: "PUT", body: JSON.stringify(totp) });
      await iamAudit(gate.access, "iam_mfa_policy", `Updated MFA policy (mandatory=${body.mandatory === true})`);
      return NextResponse.json({
        ok: true,
        message: body.mandatory
          ? "New users will be required to enroll an authenticator app. Set the browser OTP form to Required in Keycloak to hard-require OTP at every login."
          : "TOTP remains available. Users are not forced to enroll unless you make Configure OTP a default action.",
      });
    }
    if (resource === "policies" || resource === "realm") {
      if (body.confirm !== true) return NextResponse.json({ error: "Confirm authentication policy changes." }, { status: 400 });
      const realm = await kcJson<Record<string, unknown>>("");
      const next = {
        ...realm,
        ssoSessionIdleTimeout: Number(body.ssoSessionIdleTimeout ?? realm.ssoSessionIdleTimeout),
        ssoSessionMaxLifespan: Number(body.ssoSessionMaxLifespan ?? realm.ssoSessionMaxLifespan),
        clientSessionIdleTimeout: Number(body.clientSessionIdleTimeout ?? realm.clientSessionIdleTimeout),
        clientSessionMaxLifespan: Number(body.clientSessionMaxLifespan ?? realm.clientSessionMaxLifespan),
        rememberMe: body.rememberMe !== false,
      };
      await kcAdmin("", { method: "PUT", body: JSON.stringify(next) });
      await iamAudit(gate.access, "iam_realm_policy", "Updated realm SSO session policies");
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: "Unknown IAM update." }, { status: 404 });
  } catch (err) {
    const status = Number((err as { status?: number }).status);
    if (status === 400) return NextResponse.json({ error: err instanceof Error ? err.message : "Invalid request." }, { status: 400 });
    return iamFail(err);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { path: string[] } }) {
  const gate = await requireIam();
  if (gate instanceof NextResponse) return gate;
  const segs = parts(params);
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  try {
    if (segs[0] === "applications" && segs[1]) {
      const current = await kcJson<Record<string, unknown>>(`/clients/${encodeURIComponent(segs[1])}`);
      const enabled = body.enabled !== false;
      await kcAdmin(`/clients/${encodeURIComponent(segs[1])}`, { method: "PUT", body: JSON.stringify({ ...current, enabled }) });
      await iamAudit(gate.access, enabled ? "iam_client_enable" : "iam_client_disable", `${enabled ? "Enabled" : "Disabled"} client ${current.clientId}`, {
        type: "client",
        id: segs[1],
        name: String(current.clientId),
      });
      return NextResponse.json({ ok: true, enabled });
    }
    return NextResponse.json({ error: "Unknown IAM patch." }, { status: 404 });
  } catch (err) {
    return iamFail(err);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { path: string[] } }) {
  const gate = await requireIam();
  if (gate instanceof NextResponse) return gate;
  const segs = parts(params);
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  try {
    if (segs[0] === "applications" && segs[1]) {
      if (!iamRateLimit(`delete:${gate.access.id}`, 4)) return NextResponse.json({ error: "Too many deletions." }, { status: 429 });
      const current = await kcJson<Record<string, unknown>>(`/clients/${encodeURIComponent(segs[1])}`);
      if (String(current.clientId) === oidcClientId() || String(current.clientId) === "tirdo-web") {
        return NextResponse.json({ error: "The TIRDO Web client cannot be removed from this console." }, { status: 400 });
      }
      if (body.confirm !== true) return NextResponse.json({ error: "Confirm removal of this application registration." }, { status: 400 });
      await kcAdmin(`/clients/${encodeURIComponent(segs[1])}`, { method: "DELETE" });
      await iamAudit(gate.access, "iam_client_delete", `Removed Keycloak client ${current.clientId}`, { type: "client", name: String(current.clientId) });
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: "Unknown IAM delete." }, { status: 404 });
  } catch (err) {
    return iamFail(err);
  }
}
