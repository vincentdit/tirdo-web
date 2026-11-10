import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { oidcRolesFromPayload } from "@/lib/e-service-access";
import { parseJwtPayload } from "@/lib/oidc";

export const dynamic = "force-dynamic";

export function GET() {
  const token = cookies().get("tirdo_oidc_at")?.value || "";
  const payload = token ? parseJwtPayload(token) : null;
  if (!payload) {
    return NextResponse.json({ authenticated: false, roles: [] });
  }
  return NextResponse.json({
    authenticated: true,
    sub: payload.sub || "",
    username: payload.preferred_username,
    name: payload.name,
    email: payload.email,
    roles: oidcRolesFromPayload(payload),
  });
}
