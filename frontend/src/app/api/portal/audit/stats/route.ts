import { NextResponse } from "next/server";
import { loadAccess } from "../../_access";
import { cmsAdmin, portalToken, unauthorized } from "../../_cms";

export async function GET() {
  const token = portalToken();
  if (!token) return unauthorized();
  const access = await loadAccess(token);
  if (!access) return NextResponse.json({ error: "Session expired. Sign in again." }, { status: 401 });
  if (!access.canViewAudit) {
    return NextResponse.json({ error: "Audit records are restricted." }, { status: 403 });
  }
  const res = await cmsAdmin("/portal-internal/audit/stats", token);
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    return NextResponse.json({ error: json.error || "Could not load audit totals." }, { status: res.status });
  }
  return NextResponse.json(json);
}
