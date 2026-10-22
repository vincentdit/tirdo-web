import { NextResponse } from "next/server";
import { loadAccess } from "../_access";
import { cmsAdmin, portalToken, unauthorized } from "../_cms";

export async function GET() {
  const token = portalToken();
  if (!token) return unauthorized();
  const access = await loadAccess(token);
  if (!access) return NextResponse.json({ error: "Session expired. Sign in again." }, { status: 401 });

  const counts = await Promise.all(
    access.collections.map(async (col) => {
      try {
        const res = await cmsAdmin(
          `/content-manager/collection-types/${encodeURIComponent(col.uid)}?page=1&pageSize=1`,
          token
        );
        const json = await res.json().catch(() => ({}));
        const total = json?.pagination?.total ?? json?.meta?.pagination?.total ?? 0;
        return { slug: col.slug, uid: col.uid, label: col.label, description: col.description, group: col.group, total: Number(total) || 0, ok: res.ok };
      } catch {
        return { slug: col.slug, uid: col.uid, label: col.label, description: col.description, group: col.group, total: 0, ok: false };
      }
    })
  );

  return NextResponse.json({
    collections: counts,
    access: {
      isSuperAdmin: access.isSuperAdmin,
      isFullAccess: access.isFullAccess,
      canPublish: access.canPublish,
      canManageMedia: access.canManageMedia,
      canManageUsers: access.canManageUsers,
      canManageSite: access.canManageSite,
      pageSlugs: access.pageSlugs,
      departments: access.departments,
      grantReady: access.grantReady,
    },
  });
}
