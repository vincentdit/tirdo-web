import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PORTAL_COOKIE, PORTAL_HOME_PATH, PORTAL_LOGIN_PATH, tirdoPortalFromLegacyCmsPath } from "@/lib/portal";
import { isSameOriginRequest } from "@/lib/security-http";

const PUBLIC_PORTAL = [PORTAL_LOGIN_PATH, "/portal/forgot-password"];
const PUBLIC_PORTAL_API = ["/api/portal/login", "/api/portal/forgot-password"];

function portalApiGuard(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const mutating = !["GET", "HEAD", "OPTIONS"].includes(request.method);
  const publicApi = PUBLIC_PORTAL_API.some((p) => pathname === p);
  if (mutating && !publicApi && !isSameOriginRequest(request.headers)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }
  return NextResponse.next();
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const legacy = tirdoPortalFromLegacyCmsPath(pathname);
  if (legacy) {
    const url = request.nextUrl.clone();
    const signedIn = Boolean(request.cookies.get(PORTAL_COOKIE)?.value);
    url.pathname = signedIn ? PORTAL_HOME_PATH : PORTAL_LOGIN_PATH;
    url.search = "";
    if (!signedIn) url.searchParams.set("next", PORTAL_HOME_PATH);
    return NextResponse.redirect(url);
  }
  if (pathname.startsWith("/api/portal")) return portalApiGuard(request);
  if (!pathname.startsWith("/portal")) return NextResponse.next();
  if (PUBLIC_PORTAL.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return NextResponse.next();
  }
  if (!request.cookies.get(PORTAL_COOKIE)?.value) {
    const url = request.nextUrl.clone();
    url.pathname = PORTAL_LOGIN_PATH;
    url.searchParams.set("next", pathname.startsWith("/portal") ? pathname : "/portal");
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/portal/:path*", "/api/portal/:path*", "/admin", "/admin/:path*", "/cms", "/cms/:path*", "/content-manager/:path*", "/content-type-builder/:path*"],
};
