import { cmsBase } from "@/lib/portal";

export type AuditIngestInput = {
  action: string;
  eventType?: string;
  outcome?: string;
  severity?: string;
  actor?: string;
  actorId?: string;
  actorType?: string;
  identityProvider?: string;
  sourceService?: string;
  requestId?: string;
  targetType?: string;
  targetId?: string;
  targetDisplayName?: string;
  reason?: string;
  changeSummary?: string;
  metadata?: Record<string, unknown>;
};

export async function ingestAuditEvent(event: AuditIngestInput): Promise<void> {
  const token = process.env.AUDIT_LOG_TOKEN || "";
  if (!token) {
    console.error("[audit] AUDIT_LOG_TOKEN is not configured; event not recorded");
    return;
  }
  try {
    const res = await fetch(`${cmsBase()}/portal-internal/audit/ingest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-audit-token": token,
      },
      body: JSON.stringify(event),
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) {
      console.error("[audit] ingest failed", res.status);
    }
  } catch (err) {
    console.error("[audit] ingest unavailable", err instanceof Error ? err.message : err);
  }
}
