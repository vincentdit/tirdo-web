import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { canOpenContentManagement, oidcRolesFromPayload, workspaceServices } from "@/lib/e-service-access";
import { parseJwtPayload } from "@/lib/oidc";
import { getEServices } from "@/lib/strapi";

export const dynamic = "force-dynamic";

export async function GET() {
  const token = cookies().get("tirdo_oidc_at")?.value || "";
  const payload = token ? parseJwtPayload(token) : null;
  if (!payload) {
    return NextResponse.json({ authenticated: false, services: [] }, { status: 401 });
  }
  const roles = oidcRolesFromPayload(payload);
  const items = await getEServices();
  return NextResponse.json({
    authenticated: true,
    sub: payload.sub || "",
    username: payload.preferred_username,
    name: payload.name,
    email: payload.email,
    roles,
    services: workspaceServices(items, roles),
    contentManagement: canOpenContentManagement(roles),
    staffPortal: roles.includes("staff") || roles.includes("tirdo-admin"),
  });
}
