import { NextRequest, NextResponse } from "next/server";
import {
  DEPARTMENT_UID,
  GRANT_UID,
  PORTAL_COLLECTIONS,
  SITE_PAGES,
  cmsAdminErrorMessage,
  isSuperAdminRole,
  parseCollectionList,
  parsePortalDuty,
  pickDefaultPortalRoleId,
  portalPasswordIssue,
  PR_COLLECTION_SLUGS,
} from "@/lib/portal";
import { ensureRealmUser } from "@/lib/iam-keycloak";
import { forbidden, loadAccess, loadPortalDepartments, type PortalAccess } from "../_access";
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
    duty: parsePortalDuty(g.duty),
    sectionSlug: g.sectionSlug,
    sectionTitle: g.sectionTitle,
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
      units: Array.isArray(d.units)
        ? (d.units as Record<string, unknown>[])
            .map((unit) => ({
              slug: String(unit.slug || ""),
              title: String(unit.title || unit.slug || ""),
            }))
            .filter((unit) => unit.slug || unit.title)
        : [],
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
    const passwordConfirmation = String(body.passwordConfirmation || body.confirmPassword || "");
    const roleId = Number(body.roleId);
    if (!email || !password || !firstname || !lastname) {
      return NextResponse.json({ error: "Email, first name, last name and password are required." }, { status: 400 });
    }
    if (!passwordConfirmation) {
      return NextResponse.json({ error: "Confirm the password." }, { status: 400 });
    }
    if (password !== passwordConfirmation) {
      return NextResponse.json({ error: "Password and confirmation do not match." }, { status: 400 });
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
    const createdDuty = parsePortalDuty(body.duty);
    if (chosen && isSuperAdminRole([chosen.name]) && (createdDuty === "public-relations" || createdDuty === "director-general")) {
      return NextResponse.json(
        { error: "Public relations and Director General accounts must not be Super Admin. Choose Author or Editor, then assign the duty on Edit access." },
        { status: 400 }
      );
    }
    try {
      await ensureRealmUser({
        email,
        firstName: firstname,
        lastName: lastname,
        password,
        cmsRoleName: chosen?.name,
      });
    } catch (err) {
      const status = Number((err as { status?: number }).status);
      return NextResponse.json(
        { error: err instanceof Error ? err.message : "Could not add this user to the sign-in realm." },
        { status: status >= 400 && status < 600 ? status : 502 }
      );
    }
    const createdRes = await cmsAdmin("/admin/users", token, {
      method: "POST",
      body: JSON.stringify({
        email,
        firstname,
        lastname,
        roles: [assignedRoleId],
      }),
    });
    const createdJson = await createdRes.json().catch(() => ({}));
    if (!createdRes.ok) {
      const message = String((createdJson as { error?: { message?: string } }).error?.message || "");
      if (/already|exist|taken|unique/i.test(message)) {
        return NextResponse.json({ error: "A user with this email already exists. Edit that account instead." }, { status: 409 });
      }
      return NextResponse.json({ error: cmsAdminErrorMessage(createdJson, "Could not create this user.") }, { status: 400 });
    }
    const created = asRecord(createdJson);
    const newId = Number(created.id);
    if (!Number.isFinite(newId)) {
      return NextResponse.json({ data: createdJson.data || createdJson });
    }
    const saved = await saveUser(token, { ...created, email, firstname, lastname }, {
      firstname,
      lastname,
      isActive: true,
      roles: [assignedRoleId],
      password,
    });
    const savedJson = await saved.json().catch(() => ({}));
    if (!saved.ok) {
      return NextResponse.json(
        { error: cmsAdminErrorMessage(savedJson, "The user was created but the password could not be set. Use Forgot password.") },
        { status: 400 }
      );
    }
    return NextResponse.json({ data: savedJson.data || savedJson });
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
    const passwordConfirmation = String(body.passwordConfirmation || body.confirmPassword || "");
    if (password) {
      if (!passwordConfirmation) {
        return NextResponse.json({ error: "Confirm the password." }, { status: 400 });
      }
      if (password !== passwordConfirmation) {
        return NextResponse.json({ error: "Password and confirmation do not match." }, { status: 400 });
      }
      const passwordIssue = portalPasswordIssue(password);
      if (passwordIssue) return NextResponse.json({ error: passwordIssue }, { status: 400 });
    }
    if (password) {
      try {
        await ensureRealmUser({
          email: emailKey(current.email),
          firstName: String(body.firstname || current.firstname || "").trim(),
          lastName: String(body.lastname || "").trim(),
          password,
          cmsRoleName: chosen ? String(chosen.name || "") : "",
        });
      } catch (err) {
        const status = Number((err as { status?: number }).status);
        return NextResponse.json(
          { error: err instanceof Error ? err.message : "Could not update the sign-in password." },
          { status: status >= 400 && status < 600 ? status : 502 }
        );
      }
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
  const duty = parsePortalDuty(body.duty);
  if ((duty === "hod" || duty === "section-head") && !String(body.departmentSlug || "").trim()) {
    return NextResponse.json({ error: "Choose the department for this Head of Department or section head." }, { status: 400 });
  }
  const collections = Array.isArray(body.collections) ? body.collections.map(String) : [];
  const catalog = await loadPortalDepartments(token);
  const parentDept = catalog.find((d) => d.slug === String(body.departmentSlug || ""));
  const hasUnits = (parentDept?.units || []).length > 0;
  const sectionSlug =
    duty === "section-head"
      ? String(body.sectionSlug || (hasUnits ? "" : body.departmentSlug) || "").trim()
      : "";
  if (duty === "section-head" && hasUnits && !sectionSlug) {
    return NextResponse.json({ error: "Choose the division or section this person heads." }, { status: 400 });
  }
  const payload = {
    staffEmail,
    departmentSlug: String(body.departmentSlug || ""),
    departmentTitle: String(body.departmentTitle || ""),
    sectionSlug,
    sectionTitle:
      duty === "section-head"
        ? String(body.sectionTitle || parentDept?.units?.find((u) => u.slug === sectionSlug)?.title || sectionSlug)
        : "",
    collections: duty === "public-relations" && collections.length === 0 ? PR_COLLECTION_SLUGS : collections,
    pageSlugs: Array.isArray(body.pageSlugs) ? body.pageSlugs : [],
    canPublish: duty === "staff" ? Boolean(body.canPublish) : true,
    canManageMedia: Boolean(body.canManageMedia),
    canManageUsers: duty === "public-relations" || duty === "director-general" ? false : Boolean(body.canManageUsers),
    canDelete: Boolean(body.canDelete),
    duty,
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
  if (duty === "hod" || duty === "section-head" || duty === "director-general") {
    const promoted = await promoteApproverRole(token, staffEmail);
    if (!promoted.ok) {
      return NextResponse.json(
        { error: promoted.error || "Access was saved, but this person could not be given approval rights." },
        { status: 400 }
      );
    }
  }
  return NextResponse.json({ data: json.data || json });
}

async function promoteApproverRole(token: string, email: string) {
  const user = (await loadUsers(token)).find((row) => emailKey(row.email) === email);
  if (!user) return { ok: true };
  const current = await loadUser(token, Number(user.id));
  if (!current) return { ok: false, error: "Access was saved, but the user account could not be updated." };
  if (isSuperAdminRole(roleNames(current))) return { ok: true };
  const rolesJson = await (await cmsAdmin("/admin/roles", token)).json().catch(() => ({}));
  const editor = asList(rolesJson).find((role) => String(role.name || "").trim().toLowerCase() === "editor");
  const editorId = Number(editor?.id);
  if (!editorId) return { ok: false, error: "Access was saved, but the Editor role is missing." };
  if (!roleNames(current).some((name) => name.trim().toLowerCase() === "editor")) {
    const saved = await saveUser(token, current, { roles: [editorId] });
    if (!saved.ok) return { ok: false, error: "Access was saved, but this person could not be given the Editor role needed to approve." };
  }
  try {
    await ensureRealmUser({
      email,
      firstName: String(current.firstname || ""),
      lastName: String(current.lastname || ""),
      cmsRoleName: "Editor",
    });
  } catch {
    return { ok: true };
  }
  return { ok: true };
}
