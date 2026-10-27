import { describe, it, expect } from "vitest";
import { csvCell, eventsToCsv, type AuditEvent } from "@/lib/audit";
import { canExportAudit, canViewAudit } from "@/lib/portal";

describe("audit helpers", () => {
  it("grants audit viewing to Admin and Super Admin only", () => {
    expect(canViewAudit(["Super Admin"])).toBe(true);
    expect(canViewAudit(["Admin"])).toBe(true);
    expect(canViewAudit(["Editor"])).toBe(false);
    expect(canExportAudit(["Admin"])).toBe(false);
    expect(canExportAudit(["Super Admin"])).toBe(true);
  });

  it("prevents CSV formula injection on export", () => {
    expect(csvCell("=HYPERLINK()")).toBe("'=HYPERLINK()");
    const rows: AuditEvent[] = [
      {
        seq: 1,
        occurredAt: "2026-01-01T00:00:00.000Z",
        eventType: "authentication",
        action: "=1+1",
        outcome: "failure",
        severity: "high",
        actorDisplayName: "cms@tirdo.or.tz",
      },
    ];
    expect(eventsToCsv(rows)).toContain("'=1+1");
  });
});
