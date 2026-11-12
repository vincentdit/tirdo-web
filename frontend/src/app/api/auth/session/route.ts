import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { clientFacingRoles, readOidcBrowserSession } from "@/lib/oidc-session-cookie";

export const dynamic = "force-dynamic";

export function GET() {
  const session = readOidcBrowserSession(cookies());
  if (!session) {
    return NextResponse.json({ authenticated: false, roles: [] });
  }
  return NextResponse.json({
    authenticated: true,
    sub: session.sub,
    username: session.username,
    name: session.name,
    email: session.email,
    roles: clientFacingRoles(session.roles),
  });
}
