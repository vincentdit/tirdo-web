import { NextRequest, NextResponse } from "next/server";
import { ingestAuditEvent } from "@/lib/audit-ingest";
import { clientIp } from "@/lib/audit";
import { cmsBase, friendlyAuthError, isAdminEmail, isPortalLoginId, PORTAL_COOKIE } from "@/lib/portal";
import { verifyKeycloakPassword } from "@/lib/oidc";
import { cookieOptions } from "../_cms";

export async function POST(request: NextRequest) {
  let body: { identifier?: string; email?: string; username?: string; password?: string; rememberMe?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Enter your TIRDO email and password to sign in." }, { status: 400 });
  }

  const identifier = String(body.email || body.identifier || body.username || "").trim();
  const password = String(body.password || "");
  const rememberMe = Boolean(body.rememberMe);

  if (!isPortalLoginId(identifier)) {
    return NextResponse.json(
      { error: "Enter your TIRDO username or email address." },
      { status: 400 }
    );
  }
  if (!password) {
    return NextResponse.json({ error: "Enter your password." }, { status: 400 });
  }

  const sso = await verifyKeycloakPassword(identifier, password);
  if (!sso.ok) {
    await ingestAuditEvent({
      action: "login_failed",
      eventType: "authentication",
      outcome: "failure",
      actor: identifier,
      actorType: "user",
      identityProvider: "keycloak",
      sourceService: "portal",
      reason: "invalid_credentials",
      changeSummary: "CMS portal Keycloak sign-in failed",
      metadata: { ip: clientIp(request.headers) },
    });
    return NextResponse.json({ error: friendlyAuthError(401, "invalid credentials") }, { status: 401 });
  }
  const email = sso.email || (isAdminEmail(identifier) ? identifier.toLowerCase() : "");
  if (!email) {
    return NextResponse.json(
      { error: "This TIRDO account has no email, so Content Manager cannot sign you in. Ask ICT support to add an email in Keycloak." },
      { status: 403 }
    );
  }

  let cmsRes: Response;
  try {
    cmsRes = await fetch(`${cmsBase()}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
      signal: AbortSignal.timeout(12000),
    });
  } catch {
    return NextResponse.json(
      { error: friendlyAuthError(503, "network") },
      { status: 503 }
    );
  }

  const json = await cmsRes.json().catch(() => ({}));
  const token = json?.data?.token as string | undefined;
  const user = json?.data?.user as Record<string, unknown> | undefined;

  if (json?.data && !token && (json.data.deviceId || json.data.requireTwoFactor || json.data.twoFactor)) {
    return NextResponse.json(
      {
        requiresSecondFactor: true,
        message: "Additional verification is required for this account. Complete the step in TIRDO Content Manager or contact your administrator.",
      },
      { status: 202 }
    );
  }

  if (!cmsRes.ok || !token) {
    await ingestAuditEvent({
      action: "login_failed",
      eventType: "authentication",
      outcome: "failure",
      actor: email,
      actorType: "user",
      identityProvider: "keycloak",
      sourceService: "portal",
      reason: "cms_account_missing",
      changeSummary: "Keycloak sign-in succeeded but Content Manager account is not enabled",
      metadata: { ip: clientIp(request.headers) },
    });
    return NextResponse.json(
      { error: "Your TIRDO account is signed in, but it is not enabled for Content management. Ask a Super Admin to grant access." },
      { status: 403 }
    );
  }

  if (user && user.isActive === false) {
    return NextResponse.json({ error: "This account is deactivated. Ask an administrator to activate it." }, { status: 403 });
  }

  await ingestAuditEvent({
    action: "login",
    eventType: "authentication",
    outcome: "success",
    actor: String(user?.email || email),
    actorId: user?.id != null ? String(user.id) : "",
    actorType: "user",
    identityProvider: "keycloak",
    sourceService: "portal",
    changeSummary: "CMS portal Keycloak sign-in succeeded",
    metadata: { ip: clientIp(request.headers) },
  });
  const res = NextResponse.json({
    ok: true,
    user: {
      email: user?.email,
      firstname: user?.firstname,
      lastname: user?.lastname,
    },
  });
  res.cookies.set(PORTAL_COOKIE, token, cookieOptions(rememberMe));
  return res;
}
