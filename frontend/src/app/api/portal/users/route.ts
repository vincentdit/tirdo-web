import { NextRequest, NextResponse } from "next/server";
import {
  DEPARTMENT_UID,
  GRANT_UID,
  PORTAL_COLLECTIONS,
  SITE_PAGES,
  cmsAdminErrorMessage,
  isSuperAdminRole,
  parseCollectionList,
  pickDefaultPortalRoleId,
  portalPasswordIssue,
} from "@/lib/portal";
import { forbidden, loadAccess, type PortalAccess } from "../_access";
import { cmsAdmin, portalToken, unauthorized } from "../_cms";

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

function asRecord(json: unknown): Record<string, unknown> {
  if (!json || typeof json !== "object") return {};
  const o = json as Record<string, unknown>;
  if (o.data && typeof o.data === "object" && !Array.isArray(o.data)) return o.data as Record<string, unknown>;
  return o;
}

function emailKey(value: unknown) {
  return String(value || "").trim().toLowerCase();
}

function roleList(user: Record<string, unknown>) {
  return Array.isArray(user.roles) ? (user.roles as Record<string, unknown>[]) : [];
}

function roleNames(user: Record<string, unknown>) {
  return roleList(user)
    .map((r) => String(r.name || ""))
    .filter(Boolean);
}

function roleIds(user: Record<string, unknown>) {
  return roleList(user)
    .map((r) => Number(r.id))
    .filter((id) => Number.isFinite(id));
}

function mapUser(u: Record<string, unknown>) {
  return {
    id: u.id,
    email: u.email,
    firstname: u.firstname,
    lastname: u.lastname,
    isActive: u.isActive !== false,
    roles: roleNames(u),
    roleIds: roleIds(u),
  };
}

function mapGrant(g: Record<string, unknown>) {
  return {
    documentId: String(g.documentId || g.id || ""),
    staffEmail: String(g.staffEmail || ""),
    departmentSlug: g.departmentSlug,
    departmentTitle: g.departmentTitle,
    collections: parseCollectionList(g.collections),
    pageSlugs: parseCollectionList(g.pageSlugs),
    canPublish: Boolean(g.canPublish),
    canManageMedia: Boolean(g.canManageMedia),
    canManageUsers: Boolean(g.canManageUsers),
    canDelete: Boolean(g.canDelete),
    active: g.active !== false,
    notes: g.notes,
  };
}

async function loadUsers(token: string) {
  const res = await cmsAdmin("/admin/users?page=1&pageSize=100", token);
  const json = await res.json().catch(() => ({}));
  return asList(json);
}

async function loadGrants(token: string) {
  const res = await cmsAdmin(
    `/content-manager/collection-types/${encodeURIComponent(GRANT_UID)}?page=1&pageSize=100&sort=updatedAt:desc`,
    token
  );
  const json = await res.json().catch(() => ({}));
  return asList(json);
}

async function loadUser(token: string, id: number) {
  const res = await cmsAdmin(`/admin/users/${id}`, token);
  const json = await res.json().catch(() => ({}));
  if (!res.ok) return null;
  return asRecord(json);
}

function canChangeAccount(access: PortalAccess, target: Record<string, unknown>) {
  if (access.isSuperAdmin) return true;
  return !isSuperAdminRole(roleNames(target));
}

async function saveUser(
  token: string,
  current: Record<string, unknown>,
  patch: { firstname?: string; lastname?: string; isActive?: boolean; roles?: number[]; password?: string }
) {
  const body: Record<string, unknown> = {
    email: current.email,
    firstname: patch.firstname ?? current.firstname,
    lastname: patch.lastname ?? current.lastname ?? "",
    isActive: patch.isActive ?? current.isActive !== false,
    roles: patch.roles ?? roleIds(current),
  };
  if (patch.password) body.password = patch.password;
  return cmsAdmin(`/admin/users/${current.id}`, token, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function GET() {
  const token = portalToken();
  if (!token) return unauthorized();
  const access = await loadAccess(token);
  if (!access) return NextResponse.json({ error: "Session expired. Sign in again." }, { status: 401 });
  if (!access.canManageUsers) return forbidden("Only a user administrator can manage access.");

  const [users, rolesRes, grants, deptsRes] = await Promise.all([
    loadUsers(token),
    cmsAdmin("/admin/roles", token),
    loadGrants(token),
    cmsAdmin(
      `/content-manager/collection-types/${encodeURIComponent(DEPARTMENT_UID)}?page=1&pageSize=100&sort=title:asc`,
      token
    ),
  ]);

  const rolesJson = await rolesRes.json().catch(() => ({}));
  const deptsJson = await deptsRes.json().catch(() => ({}));
  const roles = asList(rolesJson);
  const departments = asList(deptsJson);

  return NextResponse.json({
    me: { id: access.id, email: access.email, isSuperAdmin: access.isSuperAdmin },
    users: users.map(mapUser),
    roles: roles
      .map((r) => ({ id: Number(r.id), name: String(r.name || ""), code: r.code }))
      .filter((r) => Number.isFinite(r.id) && r.name)
      .filter((r) => access.isSuperAdmin || r.name.toLowerCase() !== "super admin"),
    grants: grants.map(mapGrant),
    departments: departments.map((d: Record<string, unknown>) => ({
      documentId: d.documentId || d.id,
      title: d.title,
      slug: d.slug,
    })),
    collections: PORTAL_COLLECTIONS.map((c) => ({ slug: c.slug, label: c.label, group: c.group })),
    sitePages: SITE_PAGES,
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
    const email = emailKey(body.email);
    const firstname = String(body.firstname || "").trim();
    const lastname = String(body.lastname || "").trim();
    const password = String(body.password || "");
    const roleId = Number(body.roleId);
    if (!email || !password || !firstname || !lastname) {
      return NextResponse.json({ error: "Email, first name, last name and password are required." }, { status: 400 });
    }
    const passwordIssue = portalPasswordIssue(password);
    if (passwordIssue) return NextResponse.json({ error: passwordIssue }, { status: 400 });
    const existing = (await loadUsers(token)).find((u) => emailKey(u.email) === email);
    if (existing) {
      return NextResponse.json({ error: "A user with this email already exists. Edit that account instead." }, { status: 409 });
    }
    const rolesJson = await (await cmsAdmin("/admin/roles", token)).json().catch(() => ({}));
    const roles = asList(rolesJson).map((r) => ({ id: Number(r.id), name: String(r.name || "") })).filter((r) => r.id > 0 && r.name);
    const assignedRoleId = pickDefaultPortalRoleId(roles, Number.isFinite(roleId) && roleId > 0 ? roleId : undefined);
    const chosen = roles.find((r) => r.id === assignedRoleId);
    if (!assignedRoleId) {
      return NextResponse.json({ error: "Choose a role for this user." }, { status: 400 });
    }
    if (chosen && isSuperAdminRole([chosen.name]) && !access.isSuperAdmin) {
      return forbidden("Only a Super Admin can create a Super Admin.");
    }
    const res = await cmsAdmin("/admin/users", token, {
      method: "POST",
      body: JSON.stringify({
        email,
        firstname,
        lastname,
        password,
        isActive: true,
        roles: [assignedRoleId],
      }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      const message = String((json as { error?: { message?: string } }).error?.message || "");
      if (/already|exist|taken|unique/i.test(message)) {
        return NextResponse.json({ error: "A user with this email already exists. Edit that account instead." }, { status: 409 });
      }
      return NextResponse.json({ error: cmsAdminErrorMessage(json, "Could not create this user.") }, { status: 400 });
    }
    return NextResponse.json({ data: json.data || json });
  }

  if (action === "update-user" || action === "set-active") {
    const userId = Number(body.userId);
    if (!Number.isFinite(userId)) return NextResponse.json({ error: "User is required." }, { status: 400 });
    const current = await loadUser(token, userId);
    if (!current) return NextResponse.json({ error: "User was not found." }, { status: 404 });
    if (!canChangeAccount(access, current)) {
      return forbidden("Only a Super Admin can change a Super Admin account.");
    }
    if (action === "set-active") {
      const isActive = body.isActive !== false;
      if (!isActive && userId === access.id) {
        return NextResponse.json({ error: "You cannot deactivate your own account." }, { status: 400 });
      }
      const res = await saveUser(token, current, { isActive });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) return NextResponse.json({ error: cmsAdminErrorMessage(json, "Could not update this user.") }, { status: 400 });
      return NextResponse.json({ data: json.data || json });
    }

    const roleId = Number(body.roleId);
    const rolesJson = await (await cmsAdmin("/admin/roles", token)).json().catch(() => ({}));
    const chosen = asList(rolesJson).find((r) => Number(r.id) === roleId);
    if (chosen && isSuperAdminRole([String(chosen.name || "")]) && !access.isSuperAdmin) {
      return forbidden("Only a Super Admin can assign Super Admin.");
    }
    const password = String(body.password || "");
    if (password) {
      const passwordIssue = portalPasswordIssue(password);
      if (passwordIssue) return NextResponse.json({ error: passwordIssue }, { status: 400 });
    }
    const res = await saveUser(token, current, {
      firstname: String(body.firstname || current.firstname || "").trim(),
      lastname: String(body.lastname || "").trim(),
      roles: Number.isFinite(roleId) && roleId > 0 ? [roleId] : roleIds(current),
      password: password || undefined,
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return NextResponse.json({ error: cmsAdminErrorMessage(json, "Could not update this user.") }, { status: 400 });
    return NextResponse.json({ data: json.data || json });
  }

  const staffEmail = emailKey(body.staffEmail);
  if (!staffEmail) return NextResponse.json({ error: "Staff email is required." }, { status: 400 });
  const payload = {
    staffEmail,
    departmentSlug: String(body.departmentSlug || ""),
    departmentTitle: String(body.departmentTitle || ""),
    collections: Array.isArray(body.collections) ? body.collections : [],
    pageSlugs: Array.isArray(body.pageSlugs) ? body.pageSlugs : [],
    canPublish: Boolean(body.canPublish),
    canManageMedia: Boolean(body.canManageMedia),
    canManageUsers: Boolean(body.canManageUsers),
    canDelete: Boolean(body.canDelete),
    active: body.active !== false,
    notes: String(body.notes || ""),
  };

  const grants = await loadGrants(token);
  const existing = grants.find((g) => emailKey(g.staffEmail) === staffEmail);
  const documentId = String(body.documentId || existing?.documentId || existing?.id || "");
  const path = documentId
    ? `/content-manager/collection-types/${encodeURIComponent(GRANT_UID)}/${encodeURIComponent(documentId)}`
    : `/content-manager/collection-types/${encodeURIComponent(GRANT_UID)}`;
  const res = await cmsAdmin(path, token, {
    method: documentId ? "PUT" : "POST",
    body: JSON.stringify(payload),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    return NextResponse.json({ error: cmsAdminErrorMessage(json, "Could not save this access assignment.") }, { status: 400 });
  }
  return NextResponse.json({ data: json.data || json });
}
