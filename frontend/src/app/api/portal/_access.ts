import { NextResponse } from "next/server";
import {
  DEPARTMENT_UID,
  PORTAL_COLLECTIONS,
  PR_COLLECTION_SLUGS,
  allowedPageSlugsFromGrants,
  canAccessPageSlug,
  grantedCollectionSlugs,
  canExportAudit,
  canViewAudit,
  highestDuty,
  isAdminRole,
  isSuperAdminRole,
  parseCollectionList,
  parsePortalDuty,
  type PortalCollection,
  type PortalDuty,
} from "@/lib/portal";
import { cmsAdmin } from "./_cms";

export type PortalAccess = {
  id: number;
  email: string;
  firstname?: string;
  lastname?: string;
  roles: string[];
  isSuperAdmin: boolean;
  isFullAccess: boolean;
  duty: PortalDuty;
  isHod: boolean;
  isSectionHead: boolean;
  isPr: boolean;
  isDg: boolean;
  canPublish: boolean;
  canManageMedia: boolean;
  canManageUsers: boolean;
  canDelete: boolean;
  canManageSite: boolean;
  canViewAudit: boolean;
  canExportAudit: boolean;
  departments: { slug: string; title: string }[];
  collections: PortalCollection[];
  pageSlugs: string[] | null;
  grantReady: boolean;
};

function asUser(json: Record<string, unknown>) {
  const u = (json.data || json) as Record<string, unknown>;
  const roles = Array.isArray(u.roles)
    ? (u.roles as { name?: string }[]).map((r) => r.name).filter((n): n is string => Boolean(n))
    : [];
  return {
    id: Number(u.id),
    email: String(u.email || ""),
    firstname: u.firstname ? String(u.firstname) : undefined,
    lastname: u.lastname ? String(u.lastname) : undefined,
    isActive: u.isActive !== false,
    roles,
  };
}

export async function loadAccess(token: string): Promise<PortalAccess | null> {
  const meRes = await cmsAdmin("/admin/users/me", token);
  const meJson = (await meRes.json().catch(() => ({}))) as Record<string, unknown>;
  if (!meRes.ok) return null;
  const me = asUser(meJson);
  if (!me.isActive) return null;
  const isSuperAdmin = isSuperAdminRole(me.roles);
  const isFullAccess = isSuperAdmin;

  const grantRes = await cmsAdmin("/portal-internal/grants", token);
  const grantJson = (await grantRes.json().catch(() => ({}))) as {
    results?: Record<string, unknown>[];
    grantReady?: boolean;
  };
  const grantReady = grantRes.ok && grantJson.grantReady !== false;
  const rows = Array.isArray(grantJson.results) ? grantJson.results : [];
  const mine = rows.filter((row) => {
    const email = String(row.staffEmail || "").trim().toLowerCase();
    return email === me.email.trim().toLowerCase() && row.active !== false;
  });
  const duty = highestDuty(mine.map((row) => parsePortalDuty(row.duty)));
  const isHod = mine.some((row) => parsePortalDuty(row.duty) === "hod");
  const isSectionHead = mine.some((row) => parsePortalDuty(row.duty) === "section-head");
  const isPr = mine.some((row) => parsePortalDuty(row.duty) === "public-relations");
  const isDg = duty === "director-general";

  if (isFullAccess) {
    return {
      ...me,
      isSuperAdmin,
      isFullAccess: true,
      duty: isDg ? "director-general" : duty,
      isHod,
      isSectionHead,
      isPr,
      isDg,
      canPublish: true,
      canManageMedia: true,
      canManageUsers: isSuperAdmin || isAdminRole(me.roles),
      canDelete: true,
      canManageSite: true,
      canViewAudit: canViewAudit(me.roles),
      canExportAudit: canExportAudit(me.roles),
      departments: [{ slug: "*", title: "All departments" }],
      collections: PORTAL_COLLECTIONS,
      pageSlugs: null,
      grantReady,
    };
  }

  const allowed = new Set<string>();
  const departments: { slug: string; title: string }[] = [];
  let canPublish = false;
  let canManageMedia = false;
  let canManageUsers = false;
  let canDelete = false;

  for (const row of mine) {
    for (const slug of parseCollectionList(row.collections)) allowed.add(slug);
    canPublish = canPublish || Boolean(row.canPublish);
    canManageMedia = canManageMedia || Boolean(row.canManageMedia);
    canManageUsers = canManageUsers || Boolean(row.canManageUsers);
    canDelete = canDelete || Boolean(row.canDelete);
    const title = String(row.departmentTitle || row.departmentSlug || "").trim();
    const slug = String(row.departmentSlug || "").trim();
    if (title && !departments.some((d) => d.slug === slug && d.title === title)) {
      departments.push({ slug, title });
    }
  }

  if (isPr && allowed.size === 0) PR_COLLECTION_SLUGS.forEach((slug) => allowed.add(slug));
  if ((isHod || isSectionHead || isDg) && allowed.size === 0) {
    PORTAL_COLLECTIONS.filter((c) => c.draftAndPublish).forEach((c) => allowed.add(c.slug));
  }
  if (isDg) departments.push({ slug: "*", title: "All departments" });

  return {
    ...me,
    isSuperAdmin: false,
    isFullAccess: false,
    duty,
    isHod,
    isSectionHead,
    isPr,
    isDg,
    canPublish: canPublish || isHod || isSectionHead || isPr || isDg,
    canManageMedia,
    canManageUsers: isPr ? false : isAdminRole(me.roles) || canManageUsers,
    canDelete,
    canManageSite: canManageMedia,
    canViewAudit: canViewAudit(me.roles),
    canExportAudit: canExportAudit(me.roles),
    departments,
    collections: PORTAL_COLLECTIONS.filter((c) => grantedCollectionSlugs(me.roles, [...allowed]).includes(c.slug)),
    pageSlugs: allowed.has("pages") ? allowedPageSlugsFromGrants(mine) : [],
    grantReady,
  };
}

export async function loadPortalDepartments(token: string) {
  const res = await cmsAdmin(
    `/content-manager/collection-types/${encodeURIComponent(DEPARTMENT_UID)}?page=1&pageSize=100&sort=title:asc`,
    token
  );
  const json = (await res.json().catch(() => ({}))) as { results?: Record<string, unknown>[]; data?: Record<string, unknown>[] };
  const rows = Array.isArray(json.results) ? json.results : Array.isArray(json.data) ? json.data : [];
  return rows
    .map((row) => ({
      slug: String(row.slug || ""),
      title: String(row.title || row.slug || ""),
    }))
    .filter((row) => row.slug);
}

export function canUsePage(access: PortalAccess, slug?: string) {
  if (!canUseCollection(access, "pages")) return false;
  return canAccessPageSlug(access.pageSlugs, slug);
}

export function forbidden(message = "You are not assigned to this work.") {
  return NextResponse.json({ error: message }, { status: 403 });
}

export function canUseCollection(access: PortalAccess, slug: string) {
  return access.collections.some((c) => c.slug === slug);
}
