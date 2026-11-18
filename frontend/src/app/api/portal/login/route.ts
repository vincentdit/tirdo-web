import { NextRequest, NextResponse } from "next/server";
import { ingestAuditEvent } from "@/lib/audit-ingest";
import { clientIp } from "@/lib/audit";
import { cmsBase, friendlyAuthError, isAdminEmail, isPortalLoginId, PORTAL_COOKIE } from "@/lib/portal";
import { verifyKeycloakPassword } from "@/lib/oidc";
import { cookieOptions } from "../_cms";

type CmsLoginBody = {
  data?: { token?: string; user?: Record<string, unknown>; deviceId?: string; requireTwoFactor?: boolean; twoFactor?: boolean };
  error?: string;
};

async function cmsOidcSession(accessToken: string) {
  return fetch(`${cmsBase()}/portal-internal/oidc-session`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
    signal: AbortSignal.timeout(12000),
  });
}

async function cmsPasswordLogin(email: string, password: string) {
  return fetch(`${cmsBase()}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
    signal: AbortSignal.timeout(12000),
  });
}

function loginFailed(request: NextRequest, actor: string, reason: string, summary: string) {
  return ingestAuditEvent({
    action: "login_failed",
    eventType: "authentication",
    outcome: "failure",
    actor,
    actorType: "user",
    identityProvider: "keycloak",
    sourceService: "portal",
    reason,
    changeSummary: summary,
    metadata: { ip: clientIp(request.headers) },
  });
}

function successResponse(user: Record<string, unknown> | undefined, email: string, token: string, rememberMe: boolean) {
  const res = NextResponse.json({
    ok: true,
    user: {
      email: user?.email || email,
      firstname: user?.firstname,
      lastname: user?.lastname,
    },
  });
  res.cookies.set(PORTAL_COOKIE, token, cookieOptions(rememberMe));
  return res;
}

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
    return NextResponse.json({ error: "Enter your TIRDO username or email address." }, { status: 400 });
  }
  if (!password) {
    return NextResponse.json({ error: "Enter your password." }, { status: 400 });
  }

  const sso = await verifyKeycloakPassword(identifier, password);
  if (sso.ok) {
    const email = sso.email || (isAdminEmail(identifier) ? identifier.toLowerCase() : "");
    let cmsRes: Response;
    try {
      cmsRes = await cmsOidcSession(sso.accessToken);
    } catch {
      return NextResponse.json({ error: friendlyAuthError(503, "network") }, { status: 503 });
    }
    const json = (await cmsRes.json().catch(() => ({}))) as CmsLoginBody;
    const token = json?.data?.token;
    const user = json?.data?.user;
    if (cmsRes.ok && token) {
      if (user && user.isActive === false) {
        return NextResponse.json({ error: "This account is deactivated. Ask an administrator to activate it." }, { status: 403 });
      }
      await ingestAuditEvent({
        action: "login",
        eventType: "authentication",
        outcome: "success",
        actor: String(user?.email || email || identifier),
        actorId: user?.id != null ? String(user.id) : "",
        actorType: "user",
        identityProvider: "keycloak",
        sourceService: "portal",
        changeSummary: "CMS portal Keycloak sign-in succeeded",
        metadata: { ip: clientIp(request.headers) },
      });
      return successResponse(user, email, token, rememberMe);
    }
    await loginFailed(
      request,
      email || identifier,
      "cms_account_missing",
      "Keycloak sign-in succeeded but Content Manager account is not enabled"
    );
    return NextResponse.json(
      {
        error:
          json.error ||
          "Your TIRDO account is signed in, but it is not enabled for Content management. Ask a Super Admin to grant Content editor or staff access.",
      },
      { status: 403 }
    );
  }

  const cmsEmail = isAdminEmail(identifier) ? identifier.toLowerCase() : "";
  if (!cmsEmail) {
    await loginFailed(request, identifier, "invalid_credentials", "CMS portal Keycloak sign-in failed");
    return NextResponse.json({ error: friendlyAuthError(401, "invalid credentials") }, { status: 401 });
  }

  let cmsRes: Response;
  try {
    cmsRes = await cmsPasswordLogin(cmsEmail, password);
  } catch {
    return NextResponse.json({ error: friendlyAuthError(503, "network") }, { status: 503 });
  }

  const json = (await cmsRes.json().catch(() => ({}))) as CmsLoginBody;
  const token = json?.data?.token;
  const user = json?.data?.user;

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
    await loginFailed(request, cmsEmail, "invalid_credentials", "CMS portal sign-in failed");
    return NextResponse.json({ error: friendlyAuthError(401, "invalid credentials") }, { status: 401 });
  }

  if (user && user.isActive === false) {
    return NextResponse.json({ error: "This account is deactivated. Ask an administrator to activate it." }, { status: 403 });
  }

  await ingestAuditEvent({
    action: "login",
    eventType: "authentication",
    outcome: "success",
    actor: String(user?.email || cmsEmail),
    actorId: user?.id != null ? String(user.id) : "",
    actorType: "user",
    identityProvider: "strapi",
    sourceService: "portal",
    changeSummary: "CMS portal Content Manager sign-in succeeded",
    metadata: { ip: clientIp(request.headers) },
  });
  return successResponse(user, cmsEmail, token, rememberMe);
}
