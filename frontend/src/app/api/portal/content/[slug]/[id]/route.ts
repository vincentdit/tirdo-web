import { NextRequest, NextResponse } from "next/server";
import { collectionBySlug, entryStatus, overlayEntryStatus, pickAllowedFields, prepareEServicePayload, validateCollectionPayload } from "@/lib/portal";
import { canUseCollection, canUsePage, forbidden, loadAccess, loadPortalDepartments } from "../../../_access";
import { cmsAdmin, portalToken, unauthorized } from "../../../_cms";
import { activeReviewFor, createContentReview, listContentReviews, updateContentReview } from "../../../_reviews";

export async function GET(_request: NextRequest, { params }: { params: { slug: string; id: string } }) {
  const token = portalToken();
  if (!token) return unauthorized();
  const access = await loadAccess(token);
  if (!access) return NextResponse.json({ error: "Session expired. Sign in again." }, { status: 401 });

  const col = collectionBySlug(params.slug);
  if (!col) return NextResponse.json({ error: "Unknown collection." }, { status: 404 });
  if (!canUseCollection(access, col.slug)) return forbidden();

  const res = await cmsAdmin(
    `/content-manager/collection-types/${encodeURIComponent(col.uid)}/${encodeURIComponent(params.id)}`,
    token
  );
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    return NextResponse.json({ error: "Could not load this entry." }, { status: res.status });
  }
  const data = json.data || json;
  if (col.slug === "pages" && !canUsePage(access, String((data as { slug?: string }).slug || ""))) {
    return forbidden("You are not assigned to this page.");
  }
  const [reviews, departments] = await Promise.all([listContentReviews(token, col.slug), loadPortalDepartments(token)]);
  const review = activeReviewFor(reviews, params.id);
  return NextResponse.json({
    collection: { slug: col.slug, label: col.label, fields: col.fields, draftAndPublish: col.draftAndPublish },
    canPublish: access.canPublish,
    canDelete: access.canDelete,
    isHod: access.isHod,
    isSectionHead: access.isSectionHead,
    sectionSlugs: access.sectionSlugs,
    isDg: access.isDg,
    isSuperAdmin: access.isSuperAdmin,
    duty: access.duty,
    departments,
    assignedDepartments: access.departments,
    accountEmail: access.email,
    status: overlayEntryStatus(entryStatus((data as Record<string, unknown>) || {}, col.draftAndPublish), review),
    pendingPublishBy: review?.kind === "publish" && (review.state === "pending" || review.state === "approved") ? review.requestedBy : undefined,
    hodApprovedBy: review?.kind === "publish" ? review.hodApprovedBy : undefined,
    removed: review?.kind === "remove" && review.state === "applied",
    data,
  });
}

export async function PUT(request: NextRequest, { params }: { params: { slug: string; id: string } }) {
  const token = portalToken();
  if (!token) return unauthorized();
  const access = await loadAccess(token);
  if (!access) return NextResponse.json({ error: "Session expired. Sign in again." }, { status: 401 });

  const col = collectionBySlug(params.slug);
  if (!col) return NextResponse.json({ error: "Unknown collection." }, { status: 404 });
  if (!canUseCollection(access, col.slug)) return forbidden();

  const current = await cmsAdmin(
    `/content-manager/collection-types/${encodeURIComponent(col.uid)}/${encodeURIComponent(params.id)}`,
    token
  );
  const currentJson = (await current.json().catch(() => ({}))) as Record<string, unknown>;
  const currentData = (currentJson.data || currentJson) as Record<string, unknown>;
  if (col.slug === "pages" && !canUsePage(access, String(currentData.slug || ""))) {
    return forbidden("You are not assigned to this page.");
  }

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  if (col.slug === "pages" && body.slug && !canUsePage(access, String(body.slug))) {
    return forbidden("You are not assigned to this page.");
  }
  const payload = col.slug === "e-services" ? prepareEServicePayload(pickAllowedFields(col, body)) : pickAllowedFields(col, body);
  const invalid = validateCollectionPayload(col, { ...currentData, ...payload });
  if (invalid) return NextResponse.json({ error: invalid }, { status: 400 });
  const res = await cmsAdmin(
    `/content-manager/collection-types/${encodeURIComponent(col.uid)}/${encodeURIComponent(params.id)}`,
    token,
    { method: "PUT", body: JSON.stringify(payload) }
  );
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    return NextResponse.json({ error: "Could not save this entry." }, { status: res.status });
  }
  return NextResponse.json({ data: json.data || json });
}

export async function DELETE(_request: NextRequest, { params }: { params: { slug: string; id: string } }) {
  const token = portalToken();
  if (!token) return unauthorized();
  const access = await loadAccess(token);
  if (!access) return NextResponse.json({ error: "Session expired. Sign in again." }, { status: 401 });

  const col = collectionBySlug(params.slug);
  if (!col) return NextResponse.json({ error: "Unknown collection." }, { status: 404 });
  if (!canUseCollection(access, col.slug)) return forbidden();
  if (!access.canDelete) return forbidden("You are not assigned to delete this content.");
  if (col.slug === "pages") {
    const current = await cmsAdmin(
      `/content-manager/collection-types/${encodeURIComponent(col.uid)}/${encodeURIComponent(params.id)}`,
      token
    );
    const currentJson = (await current.json().catch(() => ({}))) as { data?: { slug?: string }; slug?: string };
    const slug = String(currentJson.data?.slug || currentJson.slug || "");
    if (!canUsePage(access, slug)) return forbidden("You are not assigned to this page.");
  }

  const current = await cmsAdmin(
    `/content-manager/collection-types/${encodeURIComponent(col.uid)}/${encodeURIComponent(params.id)}`,
    token
  );
  const currentJson = (await current.json().catch(() => ({}))) as Record<string, unknown>;
  const currentData = (currentJson.data || currentJson) as Record<string, unknown>;
  const title = String(currentData.title || currentData.name || currentData.subject || params.id);

  if (col.draftAndPublish && (currentData.publishedAt || String(currentData.status || "").toLowerCase() === "published")) {
    const un = await cmsAdmin(
      `/content-manager/collection-types/${encodeURIComponent(col.uid)}/${encodeURIComponent(params.id)}/actions/unpublish`,
      token,
      { method: "POST" }
    );
    if (!un.ok) {
      return NextResponse.json({ error: "Could not remove this entry from the website." }, { status: un.status });
    }
  }

  const reviews = await listContentReviews(token, col.slug);
  const existing = reviews.find((row) => row.entryId === params.id && row.kind === "remove" && row.state === "applied");
  if (!existing) {
    const created = await createContentReview(token, {
      collectionSlug: col.slug,
      entryId: params.id,
      title,
      kind: "remove",
      state: "applied",
      requestedBy: access.email,
      requestedById: access.id,
    });
    if (!created) {
      return NextResponse.json({ error: "Removed from the website, but could not keep the database record marked." }, { status: 502 });
    }
  }
  const pending = reviews.find((row) => row.entryId === params.id && row.kind === "publish" && row.state === "pending");
  if (pending) await updateContentReview(token, pending.documentId, { state: "rejected", reviewedBy: access.email });

  return NextResponse.json({ ok: true, partial: true });
}
