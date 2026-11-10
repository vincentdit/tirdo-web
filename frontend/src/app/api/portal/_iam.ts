import { NextResponse } from "next/server";
import { ingestAuditEvent } from "@/lib/audit-ingest";
import { iamAdminAllowed } from "@/lib/iam";
import { IamError } from "@/lib/iam-keycloak";
import { loadAccess, type PortalAccess } from "./_access";
import { portalToken, unauthorized } from "./_cms";

export function canManageIam(access: PortalAccess) {
  return iamAdminAllowed(access.isSuperAdmin, access.canManageUsers);
}

export async function requireIam(): Promise<{ access: PortalAccess } | NextResponse> {
  const token = portalToken();
  if (!token) return unauthorized();
  const access = await loadAccess(token);
  if (!access) return NextResponse.json({ error: "Session expired. Sign in again." }, { status: 401 });
  if (!canManageIam(access)) {
    return NextResponse.json({ error: "Only an IAM administrator can manage institutional identity." }, { status: 403 });
  }
  return { access };
}

export function iamFail(err: unknown) {
  if (err instanceof IamError) return NextResponse.json({ error: err.message }, { status: err.status });
  return NextResponse.json({ error: "The identity service is unavailable." }, { status: 502 });
}

export async function iamAudit(access: PortalAccess, action: string, summary: string, target?: { type?: string; id?: string; name?: string }) {
  await ingestAuditEvent({
    action,
    eventType: "administration",
    outcome: "success",
    actor: access.email,
    actorId: String(access.id),
    actorType: "admin",
    sourceService: "frontend",
    identityProvider: "keycloak",
    targetType: target?.type || "keycloak",
    targetId: target?.id || "",
    targetDisplayName: target?.name || "",
    changeSummary: summary,
  });
}
