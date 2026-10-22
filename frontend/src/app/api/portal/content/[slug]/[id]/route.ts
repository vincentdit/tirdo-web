import { NextRequest, NextResponse } from "next/server";
import { collectionBySlug, pickAllowedFields } from "@/lib/portal";
import { canUseCollection, canUsePage, forbidden, loadAccess } from "../../../_access";
import { cmsAdmin, portalToken, unauthorized } from "../../../_cms";

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
  return NextResponse.json({
    collection: { slug: col.slug, label: col.label, fields: col.fields, draftAndPublish: col.draftAndPublish },
    canPublish: access.canPublish,
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
  const payload = pickAllowedFields(col, body);
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
