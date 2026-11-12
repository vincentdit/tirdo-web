import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { canOpenContentManagement, oidcRolesFromPayload, workspaceServices } from "@/lib/e-service-access";
import { parseJwtPayload } from "@/lib/oidc";
import { oidcPayloadActive } from "@/lib/oidc-session-revoke";
import { getEServices } from "@/lib/strapi";

export const dynamic = "force-dynamic";

export async function GET() {
  const token = cookies().get("tirdo_oidc_at")?.value || "";
  const payload = token ? parseJwtPayload(token) : null;
  if (!oidcPayloadActive(payload)) {
    return NextResponse.json({ authenticated: false, services: [] }, { status: 401 });
  }
  const claims = payload as Record<string, unknown>;
  const roles = oidcRolesFromPayload(claims);
  const items = await getEServices();
  return NextResponse.json({
    authenticated: true,
    sub: claims.sub || "",
    username: claims.preferred_username,
    name: claims.name,
    email: claims.email,
    roles,
    services: workspaceServices(items, roles),
    contentManagement: canOpenContentManagement(roles),
    staffPortal: roles.includes("staff") || roles.includes("tirdo-admin"),
  });
}
