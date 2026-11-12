import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { ingestAuditEvent } from "@/lib/audit-ingest";
import { clientIp } from "@/lib/audit";
import { canOpenContentManagement } from "@/lib/e-service-access";
import { parseJwtPayload } from "@/lib/oidc";
import { oidcPayloadActive } from "@/lib/oidc-session-revoke";
import { readOidcAccessToken, readOidcBrowserSession } from "@/lib/oidc-session-cookie";
import { cmsBase, PORTAL_COOKIE } from "@/lib/portal";
import { publicSiteUrl } from "@/lib/public-url";
import { isSafePortalNext } from "@/lib/security-http";
import { cookieOptions } from "../_cms";

export const dynamic = "force-dynamic";

function portalNext(value: string | null) {
  return value && isSafePortalNext(value) ? value : "/portal";
}

function sitePath(path: string) {
  return new URL(path, `${publicSiteUrl()}/`);
}

function loginRedirect(next: string, error?: string) {
  const url = sitePath("/portal/login");
  url.searchParams.set("next", next);
  if (error) url.searchParams.set("login_error", error);
  return NextResponse.redirect(url);
}

function websiteSsoLogin(returnTo: string) {
  const login = sitePath("/api/auth/login");
  login.searchParams.set("returnTo", returnTo);
  return NextResponse.redirect(login);
}

export async function GET(request: NextRequest) {
  const next = portalNext(request.nextUrl.searchParams.get("next"));
  const jar = cookies();
  const session = readOidcBrowserSession(jar);
  const token = readOidcAccessToken(jar);
  const payload = token ? parseJwtPayload(token) : null;
  const fromSsoPath = `/api/portal/from-sso?next=${encodeURIComponent(next)}`;

  if (!session) {
    return websiteSsoLogin(fromSsoPath);
  }
  if (!token || !oidcPayloadActive(payload)) {
    return websiteSsoLogin(fromSsoPath);
  }

  const roles = session.roles;
  if (!canOpenContentManagement(roles)) {
    return NextResponse.redirect(sitePath("/e-services"));
  }

  let cmsRes: Response;
  try {
    cmsRes = await fetch(`${cmsBase()}/portal-internal/oidc-session`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
      signal: AbortSignal.timeout(12000),
    });
  } catch {
    return loginRedirect(next, "cms_unreachable");
  }

  const json = (await cmsRes.json().catch(() => ({}))) as {
    data?: { token?: string; user?: { email?: string; id?: unknown } };
    error?: string;
  };
  if (cmsRes.status === 401) {
    return websiteSsoLogin(fromSsoPath);
  }
  const cmsToken = json?.data?.token;
  if (!cmsRes.ok || !cmsToken) {
    return loginRedirect(next, cmsRes.status === 503 ? "cms_unreachable" : "cms_disabled");
  }

  await ingestAuditEvent({
    action: "login",
    eventType: "authentication",
    outcome: "success",
    actor: String(json.data?.user?.email || payload?.email || payload?.preferred_username || session.email || ""),
    actorId: json.data?.user?.id != null ? String(json.data.user.id) : String(payload?.sub || session.sub || ""),
    actorType: "user",
    identityProvider: "keycloak",
    sourceService: "portal",
    changeSummary: "CMS portal opened from TIRDO SSO session",
    metadata: { ip: clientIp(request.headers) },
  });

  const dest = sitePath(next);
  const res = NextResponse.redirect(dest);
  res.cookies.set(PORTAL_COOKIE, cmsToken, cookieOptions(false));
  return res;
}
