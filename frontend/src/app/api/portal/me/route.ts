import { NextRequest, NextResponse } from "next/server";
import { loadAccess } from "../_access";
import { cmsAdmin, portalToken, unauthorized } from "../_cms";

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
    isFullAccess: access.isFullAccess,
    canPublish: access.canPublish,
    canManageMedia: access.canManageMedia,
    canManageUsers: access.canManageUsers,
    canDelete: access.canDelete,
    canManageSite: access.canManageSite,
    departments: access.departments,
    collections: access.collections.map((c) => ({
      slug: c.slug,
      label: c.label,
      description: c.description,
      group: c.group,
      draftAndPublish: c.draftAndPublish,
    })),
    pageSlugs: access.pageSlugs,
    grantReady: access.grantReady,
  });
}

export async function PUT(request: NextRequest) {
  const token = portalToken();
  if (!token) return unauthorized();
  const access = await loadAccess(token);
  if (!access) return NextResponse.json({ error: "Session expired. Sign in again." }, { status: 401 });

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const firstname = String(body.firstname ?? access.firstname ?? "").trim();
  const lastname = String(body.lastname ?? access.lastname ?? "").trim();
  if (!firstname) {
    return NextResponse.json({ error: "First name is required." }, { status: 400 });
  }

  const res = await cmsAdmin("/admin/users/me", token, {
    method: "PUT",
    body: JSON.stringify({ firstname, lastname }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    return NextResponse.json({ error: "Could not save your profile." }, { status: res.status });
  }
  return NextResponse.json({
    ok: true,
    user: json.data || json,
    firstname,
    lastname,
    email: access.email,
  });
}
