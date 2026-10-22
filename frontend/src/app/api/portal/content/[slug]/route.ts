import { NextRequest, NextResponse } from "next/server";
import { cmsListQuery, collectionBySlug, entryStatus, entryTitle, pickAllowedFields, sanitizeSearch } from "@/lib/portal";
import { canUseCollection, forbidden, loadAccess } from "../../_access";
import { cmsAdmin, portalToken, unauthorized } from "../../_cms";

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const token = portalToken();
  if (!token) return unauthorized();
  const access = await loadAccess(token);
  if (!access) return NextResponse.json({ error: "Session expired. Sign in again." }, { status: 401 });

  const col = collectionBySlug(params.slug);
  if (!col) return NextResponse.json({ error: "Unknown collection." }, { status: 404 });
  if (!canUseCollection(access, col.slug)) return forbidden();

  const page = Number(request.nextUrl.searchParams.get("page") || "1") || 1;
  const pageSize = Math.min(50, Number(request.nextUrl.searchParams.get("pageSize") || "10") || 10);
  const q = sanitizeSearch(request.nextUrl.searchParams.get("q") || "");
  const searchFields = Array.from(
    new Set([
      col.titleField,
      ...col.fields.filter((f) => f.type === "text" || f.type === "email" || f.type === "textarea").map((f) => f.key),
    ])
  ).slice(0, 5);

  const path = `/content-manager/collection-types/${encodeURIComponent(col.uid)}`;
  let res = await cmsAdmin(`${path}?${cmsListQuery(page, pageSize, q, searchFields)}`, token);
  if (!res.ok && q) {
    res = await cmsAdmin(`${path}?${cmsListQuery(page, pageSize, q, [col.titleField])}`, token);
  }
  if (!res.ok && q) {
    const fallback = new URLSearchParams({ page: String(page), pageSize: String(pageSize), sort: "updatedAt:desc", _q: q });
    res = await cmsAdmin(`${path}?${fallback.toString()}`, token);
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    return NextResponse.json({ error: "Could not load this content type." }, { status: res.status });
  }

  const rows = Array.isArray(json.results) ? json.results : Array.isArray(json.data) ? json.data : [];
  const pagination = json.pagination || json.meta?.pagination || { page, pageSize, total: rows.length };

  return NextResponse.json({
    collection: { slug: col.slug, label: col.label, description: col.description, fields: col.fields, draftAndPublish: col.draftAndPublish },
    canPublish: access.canPublish,
    query: q,
    pagination: {
      page: Number(pagination.page) || page,
      pageSize: Number(pagination.pageSize) || pageSize,
      pageCount: Number(pagination.pageCount) || Math.max(1, Math.ceil((Number(pagination.total) || rows.length) / pageSize)),
      total: Number(pagination.total) || rows.length,
    },
    results: rows.map((row: Record<string, unknown>) => ({
      documentId: row.documentId || row.id,
      title: entryTitle(row, col.titleField),
      status: entryStatus(row, col.draftAndPublish),
      cmsStatus: row.status,
      updatedAt: row.updatedAt || row.publishedAt || row.createdAt,
      email: row.email,
      name: row.name,
      handled: row.handled,
      publishedAt: row.publishedAt,
    })),
  });
}

export async function POST(request: NextRequest, { params }: { params: { slug: string } }) {
  const token = portalToken();
  if (!token) return unauthorized();
  const access = await loadAccess(token);
  if (!access) return NextResponse.json({ error: "Session expired. Sign in again." }, { status: 401 });

  const col = collectionBySlug(params.slug);
  if (!col) return NextResponse.json({ error: "Unknown collection." }, { status: 404 });
  if (!canUseCollection(access, col.slug)) return forbidden();

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const payload = pickAllowedFields(col, body);
  const res = await cmsAdmin(`/content-manager/collection-types/${encodeURIComponent(col.uid)}`, token, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    return NextResponse.json({ error: "Could not create this entry." }, { status: res.status });
  }
  return NextResponse.json({ documentId: json.documentId || json.data?.documentId || json.id, data: json });
}
