import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { oidcRolesFromPayload } from "@/lib/e-service-access";
import { parseJwtPayload, siteCookieOptions } from "@/lib/oidc";
import { oidcPayloadActive } from "@/lib/oidc-session-revoke";
import { PORTAL_COOKIE } from "@/lib/portal";

export const dynamic = "force-dynamic";

export function GET() {
  const jar = cookies();
  const token = jar.get("tirdo_oidc_at")?.value || "";
  const payload = token ? parseJwtPayload(token) : null;
  if (!oidcPayloadActive(payload)) {
    if (token) {
      jar.set("tirdo_oidc_at", "", { ...siteCookieOptions(0), maxAge: 0 });
      jar.set("tirdo_oidc_it", "", { ...siteCookieOptions(0), maxAge: 0 });
      jar.set(PORTAL_COOKIE, "", { ...siteCookieOptions(0), maxAge: 0 });
    }
    return NextResponse.json({ authenticated: false, roles: [] });
  }
  const claims = payload as Record<string, unknown>;
  return NextResponse.json({
    authenticated: true,
    sub: claims.sub || "",
    username: claims.preferred_username,
    name: claims.name,
    email: claims.email,
    roles: oidcRolesFromPayload(claims),
  });
}
