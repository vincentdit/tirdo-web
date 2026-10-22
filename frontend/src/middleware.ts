import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PORTAL_COOKIE, PORTAL_LOGIN_PATH } from "@/lib/portal";

const PUBLIC_PORTAL = [PORTAL_LOGIN_PATH, "/portal/forgot-password"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/portal")) return NextResponse.next();
  if (PUBLIC_PORTAL.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return NextResponse.next();
  }
  if (!request.cookies.get(PORTAL_COOKIE)?.value) {
    const url = request.nextUrl.clone();
    url.pathname = PORTAL_LOGIN_PATH;
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/portal/:path*"],
};
