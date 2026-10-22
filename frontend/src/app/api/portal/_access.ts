import { NextResponse } from "next/server";
import {
  PORTAL_COLLECTIONS,
  isSuperAdminRole,
  parseCollectionList,
  type PortalCollection,
} from "@/lib/portal";
import { cmsAdmin } from "./_cms";

export type PortalAccess = {
  id: number;
  email: string;
  firstname?: string;
  lastname?: string;
  roles: string[];
  isSuperAdmin: boolean;
  canPublish: boolean;
  canManageMedia: boolean;
  canManageUsers: boolean;
  departments: { slug: string; title: string }[];
  collections: PortalCollection[];
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
    roles,
  };
}

export async function loadAccess(token: string): Promise<PortalAccess | null> {
  const meRes = await cmsAdmin("/admin/users/me", token);
  const meJson = (await meRes.json().catch(() => ({}))) as Record<string, unknown>;
  if (!meRes.ok) return null;
  const me = asUser(meJson);
  const isSuperAdmin = isSuperAdminRole(me.roles);

  const grantRes = await cmsAdmin("/portal-internal/grants", token);
  const grantJson = (await grantRes.json().catch(() => ({}))) as {
    results?: Record<string, unknown>[];
    grantReady?: boolean;
  };
  const grantReady = grantRes.ok && grantJson.grantReady !== false;
  const rows = Array.isArray(grantJson.results) ? grantJson.results : [];
  const mine = rows.filter((row) => {
    const email = String(row.staffEmail || "").trim().toLowerCase();
    return email === me.email.trim().toLowerCase();
  });

  if (isSuperAdmin) {
    return {
      ...me,
      isSuperAdmin: true,
      canPublish: true,
      canManageMedia: true,
      canManageUsers: true,
      departments: [{ slug: "*", title: "All departments" }],
      collections: PORTAL_COLLECTIONS,
      grantReady,
    };
  }

  const allowed = new Set<string>();
  const departments: { slug: string; title: string }[] = [];
  let canPublish = false;
  let canManageMedia = false;
  let canManageUsers = false;

  for (const row of mine) {
    for (const slug of parseCollectionList(row.collections)) allowed.add(slug);
    canPublish = canPublish || Boolean(row.canPublish);
    canManageMedia = canManageMedia || Boolean(row.canManageMedia);
    canManageUsers = canManageUsers || Boolean(row.canManageUsers);
    const title = String(row.departmentTitle || row.departmentSlug || "").trim();
    const slug = String(row.departmentSlug || "").trim();
    if (title && !departments.some((d) => d.slug === slug && d.title === title)) {
      departments.push({ slug, title });
    }
  }

  return {
    ...me,
    isSuperAdmin: false,
    canPublish,
    canManageMedia,
    canManageUsers,
    departments,
    collections: PORTAL_COLLECTIONS.filter((c) => allowed.has(c.slug)),
    grantReady,
  };
}

export function forbidden(message = "You are not assigned to this work.") {
  return NextResponse.json({ error: message }, { status: 403 });
}

export function canUseCollection(access: PortalAccess, slug: string) {
  return access.collections.some((c) => c.slug === slug);
}
