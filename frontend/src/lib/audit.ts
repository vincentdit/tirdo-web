export const AUDIT_CSV_HEADERS = [
  "seq",
  "occurredAt",
  "eventType",
  "action",
  "outcome",
  "severity",
  "actorDisplayName",
  "actorId",
  "identityProvider",
  "sourceService",
  "targetType",
  "targetId",
  "changeSummary",
  "requestId",
] as const;

export type AuditEvent = {
  id?: number;
  seq: number;
  schemaVersion?: string;
  occurredAt: string;
  recordedAt?: string;
  eventType: string;
  action: string;
  outcome: string;
  severity: string;
  actorType?: string;
  actorId?: string;
  actorDisplayName?: string;
  identityProvider?: string;
  targetType?: string;
  targetId?: string;
  targetDisplayName?: string;
  sourceService?: string;
  requestId?: string;
  reason?: string;
  changeSummary?: string;
  summary?: Record<string, unknown>;
};

export function csvCell(value: unknown): string {
  const text = value == null ? "" : String(value);
  const safe = /^[=+\-@]/.test(text) ? `'${text}` : text;
  if (/[",\n\r]/.test(safe)) return `"${safe.replace(/"/g, '""')}"`;
  return safe;
}

export function eventsToCsv(rows: AuditEvent[]): string {
  const lines = [AUDIT_CSV_HEADERS.join(",")];
  for (const row of rows) {
    lines.push(AUDIT_CSV_HEADERS.map((key) => csvCell(row[key])).join(","));
  }
  return lines.join("\n");
}

export function clientIp(headers: Headers): string | undefined {
  const forwarded = headers.get("x-forwarded-for") || "";
  const ip = forwarded.split(",")[0]?.trim() || headers.get("x-real-ip") || "";
  return ip.slice(0, 64) || undefined;
}
