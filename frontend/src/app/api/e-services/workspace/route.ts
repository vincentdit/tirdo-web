import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { canOpenContentManagement, workspaceServices } from "@/lib/e-service-access";
import { readOidcBrowserSession } from "@/lib/oidc-session-cookie";
import { getEServices } from "@/lib/strapi";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = readOidcBrowserSession(cookies());
  if (!session) {
    return NextResponse.json({ authenticated: false, services: [] }, { status: 401 });
  }
  const items = await getEServices();
  return NextResponse.json({
    authenticated: true,
    services: workspaceServices(items, session.roles),
    contentManagement: canOpenContentManagement(session.roles),
    staffPortal: session.roles.includes("staff") || session.roles.includes("tirdo-admin"),
  });
}
