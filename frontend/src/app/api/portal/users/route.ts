import { NextRequest, NextResponse } from "next/server";
import { DEPARTMENT_UID, GRANT_UID, PORTAL_COLLECTIONS, parseCollectionList } from "@/lib/portal";

function asList(json: unknown): Record<string, unknown>[] {
  if (Array.isArray(json)) return json as Record<string, unknown>[];
  if (!json || typeof json !== "object") return [];
  const o = json as Record<string, unknown>;
  const data = o.data;
  if (data && typeof data === "object" && Array.isArray((data as { results?: unknown }).results)) {
    return (data as { results: Record<string, unknown>[] }).results;
  }
  if (Array.isArray(data)) return data as Record<string, unknown>[];
  if (Array.isArray(o.results)) return o.results as Record<string, unknown>[];
  return [];
}
import { forbidden, loadAccess } from "../_access";
import { cmsAdmin, portalToken, unauthorized } from "../_cms";

export async function GET() {
  const token = portalToken();
  if (!token) return unauthorized();
  const access = await loadAccess(token);
  if (!access) return NextResponse.json({ error: "Session expired. Sign in again." }, { status: 401 });
  if (!access.canManageUsers) return forbidden("Only a user administrator can manage access.");

  const [usersRes, rolesRes, grantsRes, deptsRes] = await Promise.all([
    cmsAdmin("/admin/users?pageSize=100", token),
    cmsAdmin("/admin/roles", token),
    cmsAdmin(
      `/content-manager/collection-types/${encodeURIComponent(GRANT_UID)}?page=1&pageSize=100&sort=updatedAt:desc`,
      token
    ),
    cmsAdmin(
      `/content-manager/collection-types/${encodeURIComponent(DEPARTMENT_UID)}?page=1&pageSize=100&sort=title:asc`,
      token
    ),
  ]);

  const usersJson = await usersRes.json().catch(() => ({}));
  const rolesJson = await rolesRes.json().catch(() => ({}));
  const grantsJson = await grantsRes.json().catch(() => ({}));
  const deptsJson = await deptsRes.json().catch(() => ({}));

  const users = asList(usersJson);
  const roles = asList(rolesJson);
  const grants = asList(grantsJson);
  const departments = asList(deptsJson);

  return NextResponse.json({
    users: users.map((u: Record<string, unknown>) => ({
      id: u.id,
      email: u.email,
      firstname: u.firstname,
      lastname: u.lastname,
      isActive: u.isActive !== false,
      blocked: u.blocked,
      roles: Array.isArray(u.roles) ? (u.roles as { name?: string }[]).map((r) => r.name).filter(Boolean) : [],
    })),
    roles: roles.map((r: Record<string, unknown>) => ({ id: r.id, name: r.name, code: r.code })),
    grants: grants.map((g: Record<string, unknown>) => ({
      documentId: g.documentId || g.id,
      staffEmail: g.staffEmail,
      departmentSlug: g.departmentSlug,
      departmentTitle: g.departmentTitle,
      collections: parseCollectionList(g.collections),
      canPublish: Boolean(g.canPublish),
      canManageMedia: Boolean(g.canManageMedia),
      canManageUsers: Boolean(g.canManageUsers),
      active: g.active !== false,
      notes: g.notes,
    })),
    departments: departments.map((d: Record<string, unknown>) => ({
      documentId: d.documentId || d.id,
      title: d.title,
      slug: d.slug,
    })),
    collections: PORTAL_COLLECTIONS.map((c) => ({ slug: c.slug, label: c.label, group: c.group })),
  });
}

export async function POST(request: NextRequest) {
  const token = portalToken();
  if (!token) return unauthorized();
  const access = await loadAccess(token);
  if (!access) return NextResponse.json({ error: "Session expired. Sign in again." }, { status: 401 });
  if (!access.canManageUsers) return forbidden("Only a user administrator can manage access.");

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const action = String(body.action || "grant");

  if (action === "create-user") {
    const email = String(body.email || "").trim().toLowerCase();
    const firstname = String(body.firstname || "").trim();
    const lastname = String(body.lastname || "").trim();
    const password = String(body.password || "");
    const roleId = body.roleId;
    if (!email || !password || !firstname) {
      return NextResponse.json({ error: "Email, first name and password are required." }, { status: 400 });
    }
    const res = await cmsAdmin("/admin/users", token, {
      method: "POST",
      body: JSON.stringify({
        email,
        firstname,
        lastname,
        password,
        isActive: true,
        roles: roleId ? [roleId] : undefined,
      }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json({ error: "Could not create this user." }, { status: res.status });
    }
    return NextResponse.json({ data: json.data || json });
  }

  const staffEmail = String(body.staffEmail || "").trim().toLowerCase();
  if (!staffEmail) return NextResponse.json({ error: "Staff email is required." }, { status: 400 });
  const payload = {
    staffEmail,
    departmentSlug: String(body.departmentSlug || ""),
    departmentTitle: String(body.departmentTitle || ""),
    collections: Array.isArray(body.collections) ? body.collections : [],
    canPublish: Boolean(body.canPublish),
    canManageMedia: Boolean(body.canManageMedia),
    canManageUsers: Boolean(body.canManageUsers),
    active: body.active !== false,
    notes: String(body.notes || ""),
  };

  const documentId = body.documentId ? String(body.documentId) : "";
  const path = documentId
    ? `/content-manager/collection-types/${encodeURIComponent(GRANT_UID)}/${encodeURIComponent(documentId)}`
    : `/content-manager/collection-types/${encodeURIComponent(GRANT_UID)}`;
  const res = await cmsAdmin(path, token, {
    method: documentId ? "PUT" : "POST",
    body: JSON.stringify(payload),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    return NextResponse.json({ error: "Could not save this access assignment." }, { status: res.status });
  }
  return NextResponse.json({ data: json.data || json });
}
