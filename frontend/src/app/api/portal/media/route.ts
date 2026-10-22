import { NextRequest, NextResponse } from "next/server";
import { sanitizeSearch } from "@/lib/portal";
import { forbidden, loadAccess } from "../_access";
import { cmsAdmin, portalToken, unauthorized } from "../_cms";

export async function GET(request: NextRequest) {
  const token = portalToken();
  if (!token) return unauthorized();
  const access = await loadAccess(token);
  if (!access) return NextResponse.json({ error: "Session expired. Sign in again." }, { status: 401 });
  if (!access.canManageSite) return forbidden("You are not assigned to the gallery.");

  const page = Number(request.nextUrl.searchParams.get("page") || "1") || 1;
  const pageSize = Math.min(48, Number(request.nextUrl.searchParams.get("pageSize") || "12") || 12);
  const q = sanitizeSearch(request.nextUrl.searchParams.get("q") || "");
  const qs = new URLSearchParams({ sort: "updatedAt:DESC", page: String(page), pageSize: String(pageSize) });
  if (q) {
    qs.set("_q", q);
    qs.set("filters[name][$containsi]", q);
  }
  const res = await cmsAdmin(`/upload/files?${qs.toString()}`, token);
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    return NextResponse.json({ error: "Could not load the gallery." }, { status: res.status });
  }
  let files = Array.isArray(json) ? json : Array.isArray(json.results) ? json.results : [];
  if (q && Array.isArray(json)) {
    const needle = q.toLowerCase();
    files = files.filter((f: { name?: string }) => String(f.name || "").toLowerCase().includes(needle));
  }
  const pagination = json.pagination || json.meta?.pagination;
  const total = Number(pagination?.total) || files.length;
  const start = Array.isArray(json) ? (page - 1) * pageSize : 0;
  const results = Array.isArray(json) ? files.slice(start, start + pageSize) : files;
  return NextResponse.json({
    results,
    query: q,
    canManageMedia: access.canManageSite,
    pagination: {
      page,
      pageSize,
      total,
      pageCount: Math.max(1, Math.ceil(total / pageSize)),
    },
  });
}

export async function POST(request: NextRequest) {
  const token = portalToken();
  if (!token) return unauthorized();
  const access = await loadAccess(token);
  if (!access) return NextResponse.json({ error: "Session expired. Sign in again." }, { status: 401 });

  const incoming = await request.formData();
  const file = incoming.get("files") || incoming.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Choose a file to upload." }, { status: 400 });
  }
  const maxBytes = 5 * 1024 * 1024;
  if (file.size > maxBytes) {
    return NextResponse.json({ error: "Files must be 5 MB or smaller." }, { status: 400 });
  }
  const allowed = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",
    "application/pdf",
  ]);
  const type = file.type || "";
  const name = file.name.toLowerCase();
  const byExt =
    /\.(jpe?g|png|webp|gif|svg)$/.test(name) ? "image" : /\.pdf$/.test(name) ? "pdf" : "";
  if (type && !allowed.has(type) && !byExt) {
    return NextResponse.json({ error: "Use a JPG, PNG, WebP, GIF, SVG or PDF file." }, { status: 400 });
  }
  if (!type && !byExt) {
    return NextResponse.json({ error: "Use a JPG, PNG, WebP, GIF, SVG or PDF file." }, { status: 400 });
  }
  const form = new FormData();
  form.append("files", file, file.name);
  const res = await cmsAdmin("/upload", token, { method: "POST", body: form });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    return NextResponse.json({ error: "Could not upload this file." }, { status: res.status });
  }
  return NextResponse.json({ data: json });
}
