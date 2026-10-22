import { NextResponse } from "next/server";
import { loadAccess } from "../_access";
import { portalToken, unauthorized } from "../_cms";

export async function GET() {
  const token = portalToken();
  if (!token) return unauthorized();

  const access = await loadAccess(token);
  if (!access) {
    return NextResponse.json({ error: "Session expired. Sign in again." }, { status: 401 });
  }

  return NextResponse.json({
    id: access.id,
    email: access.email,
    firstname: access.firstname,
    lastname: access.lastname,
    roles: access.roles,
    isSuperAdmin: access.isSuperAdmin,
    canPublish: access.canPublish,
    canManageMedia: access.canManageMedia,
    canManageUsers: access.canManageUsers,
    departments: access.departments,
    collections: access.collections.map((c) => ({
      slug: c.slug,
      label: c.label,
      description: c.description,
      group: c.group,
      draftAndPublish: c.draftAndPublish,
    })),
    grantReady: access.grantReady,
  });
}
