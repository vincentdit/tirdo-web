import { NextRequest, NextResponse } from "next/server";
import { collectionBySlug } from "@/lib/portal";
import { canUseCollection, canUsePage, forbidden, loadAccess } from "../../../../_access";
import { cmsAdmin, portalToken, unauthorized } from "../../../../_cms";
import { listContentReviews, updateContentReview } from "../../../../_reviews";

export async function POST(_request: NextRequest, { params }: { params: { slug: string; id: string } }) {
  const token = portalToken();
  if (!token) return unauthorized();
  const access = await loadAccess(token);
  if (!access) return NextResponse.json({ error: "Session expired. Sign in again." }, { status: 401 });

  const col = collectionBySlug(params.slug);
  if (!col) return NextResponse.json({ error: "Unknown collection." }, { status: 404 });
  if (!canUseCollection(access, col.slug)) return forbidden();
  if (!access.canDelete) return forbidden("You are not assigned to restore this content.");
  if (col.slug === "pages") {
    const current = await cmsAdmin(
      `/content-manager/collection-types/${encodeURIComponent(col.uid)}/${encodeURIComponent(params.id)}`,
      token
    );
    const currentJson = (await current.json().catch(() => ({}))) as { data?: { slug?: string }; slug?: string };
    const slug = String(currentJson.data?.slug || currentJson.slug || "");
    if (!canUsePage(access, slug)) return forbidden("You are not assigned to this page.");
  }

  const reviews = await listContentReviews(token, col.slug);
  const removed = reviews.find((row) => row.entryId === params.id && row.kind === "remove" && row.state === "applied");
  if (!removed) return NextResponse.json({ error: "This entry is not in the removed list." }, { status: 404 });
  const ok = await updateContentReview(token, removed.documentId, {
    state: "rejected",
    reviewedBy: access.email,
    reviewedById: access.id,
  });
  if (!ok) return NextResponse.json({ error: "Could not restore this entry." }, { status: 502 });
  return NextResponse.json({ ok: true, status: "Draft" });
}
