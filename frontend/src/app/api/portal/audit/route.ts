import { NextRequest, NextResponse } from "next/server";
import { loadAccess } from "../_access";
import { cmsAdmin, portalToken, unauthorized } from "../_cms";

export async function GET(request: NextRequest) {
  const token = portalToken();
  if (!token) return unauthorized();
  const access = await loadAccess(token);
  if (!access) return NextResponse.json({ error: "Session expired. Sign in again." }, { status: 401 });
  if (!access.canViewAudit) {
    return NextResponse.json({ error: "Audit records are restricted." }, { status: 403 });
  }
  const qs = request.nextUrl.searchParams.toString();
  const res = await cmsAdmin(`/portal-internal/audit${qs ? `?${qs}` : ""}`, token);
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    return NextResponse.json({ error: json.error || "Could not load the audit trail." }, { status: res.status });
  }
  return NextResponse.json({
    ...json,
    access: { canExportAudit: access.canExportAudit, canViewAudit: true, isSuperAdmin: access.isSuperAdmin },
  });
}
