import { NextRequest, NextResponse } from "next/server";
import { eventsToCsv, type AuditEvent } from "@/lib/audit";
import { loadAccess } from "../../_access";
import { cmsAdmin, portalToken, unauthorized } from "../../_cms";

export async function GET(request: NextRequest) {
  const token = portalToken();
  if (!token) return unauthorized();
  const access = await loadAccess(token);
  if (!access) return NextResponse.json({ error: "Session expired. Sign in again." }, { status: 401 });
  if (!access.canExportAudit) {
    return NextResponse.json({ error: "Export is restricted to Super Admin." }, { status: 403 });
  }
  const qs = new URLSearchParams(request.nextUrl.searchParams);
  qs.set("limit", String(Math.min(1000, Number(qs.get("limit") || "500"))));
  const format = qs.get("format") === "csv" ? "csv" : "json";
  qs.set("format", format);
  const res = await cmsAdmin(`/portal-internal/audit/export?${qs.toString()}`, token);
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    return NextResponse.json({ error: json.error || "Could not export audit events." }, { status: res.status });
  }
  const rows = (Array.isArray(json.results) ? json.results : []) as AuditEvent[];
  if (format === "csv") {
    return new NextResponse(eventsToCsv(rows), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="tirdo-audit-trail.csv"',
      },
    });
  }
  return NextResponse.json({ count: rows.length, results: rows });
}
