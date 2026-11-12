import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { ingestAuditEvent } from "@/lib/audit-ingest";
import { clientIp } from "@/lib/audit";
import { canOpenContentManagement, oidcRolesFromPayload } from "@/lib/e-service-access";
import { parseJwtPayload } from "@/lib/oidc";
import { oidcPayloadActive } from "@/lib/oidc-session-revoke";
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

export async function GET(request: NextRequest) {
  const next = portalNext(request.nextUrl.searchParams.get("next"));
  const token = cookies().get("tirdo_oidc_at")?.value || "";
  const payload = token ? parseJwtPayload(token) : null;
  if (!token || !oidcPayloadActive(payload)) {
    const login = sitePath("/api/auth/login");
    login.searchParams.set("returnTo", `/api/portal/from-sso?next=${encodeURIComponent(next)}`);
    return NextResponse.redirect(login);
  }

  const roles = oidcRolesFromPayload(payload as Record<string, unknown>);
  if (!canOpenContentManagement(roles)) {
    return loginRedirect(next, "cms_disabled");
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
  const cmsToken = json?.data?.token;
  if (!cmsRes.ok || !cmsToken) {
    return loginRedirect(next, "cms_disabled");
  }

  await ingestAuditEvent({
    action: "login",
    eventType: "authentication",
    outcome: "success",
    actor: String(json.data?.user?.email || payload?.email || payload?.preferred_username || ""),
    actorId: json.data?.user?.id != null ? String(json.data.user.id) : String(payload?.sub || ""),
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
