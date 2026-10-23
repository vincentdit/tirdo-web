import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { parseJwtPayload } from "@/lib/oidc";

export const dynamic = "force-dynamic";

export function GET() {
  const token = cookies().get("tirdo_oidc_at")?.value || "";
  const payload = token ? parseJwtPayload(token) : null;
  if (!payload) {
    return NextResponse.json({ authenticated: false, roles: [] });
  }
  const realmAccess = payload.realm_access as { roles?: string[] } | undefined;
  const roles = Array.isArray(realmAccess?.roles) ? realmAccess!.roles.filter(Boolean) : [];
  return NextResponse.json({
    authenticated: true,
    token,
    username: payload.preferred_username,
    name: payload.name,
    email: payload.email,
    roles,
  });
}
