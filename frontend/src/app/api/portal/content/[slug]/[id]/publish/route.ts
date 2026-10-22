import { NextRequest, NextResponse } from "next/server";
import { collectionBySlug } from "@/lib/portal";
import { canUseCollection, canUsePage, forbidden, loadAccess } from "../../../../_access";
import { cmsAdmin, portalToken, unauthorized } from "../../../../_cms";

export async function POST(_request: NextRequest, { params }: { params: { slug: string; id: string } }) {
  const token = portalToken();
  if (!token) return unauthorized();
  const access = await loadAccess(token);
  if (!access) return NextResponse.json({ error: "Session expired. Sign in again." }, { status: 401 });

  const col = collectionBySlug(params.slug);
  if (!col) return NextResponse.json({ error: "Unknown collection." }, { status: 404 });
  if (!canUseCollection(access, col.slug)) return forbidden();
  if (!access.canPublish) return forbidden("You are not assigned to publish this content.");
  if (col.slug === "pages") {
    const current = await cmsAdmin(
      `/content-manager/collection-types/${encodeURIComponent(col.uid)}/${encodeURIComponent(params.id)}`,
      token
    );
    const currentJson = (await current.json().catch(() => ({}))) as { data?: { slug?: string }; slug?: string };
    const slug = String(currentJson.data?.slug || currentJson.slug || "");
    if (!canUsePage(access, slug)) return forbidden("You are not assigned to this page.");
  }

  const res = await cmsAdmin(
    `/content-manager/collection-types/${encodeURIComponent(col.uid)}/${encodeURIComponent(params.id)}/actions/publish`,
    token,
    { method: "POST" }
  );
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    return NextResponse.json({ error: "Could not publish this entry." }, { status: res.status });
  }
  return NextResponse.json({ data: json.data || json });
}
