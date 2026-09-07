import { describe, it, expect } from "vitest";
import {
  isOpen,
  projectAreaSlug,
  researchAreaName,
  researchAreas,
  vacancies,
  tenders,
  type Project,
} from "@/lib/content";

describe("isOpen (vacancy/tender auto-archive)", () => {
  const now = new Date("2026-09-06T12:00:00Z");

  it("is open on a future closing date", () => {
    expect(isOpen("2026-12-31", now)).toBe(true);
  });

  it("is open through the whole closing day (end of day)", () => {
    expect(isOpen("2026-09-06", now)).toBe(true);
  });

  it("is closed the day after the closing date", () => {
    expect(isOpen("2026-09-05", now)).toBe(false);
  });

  it("treats an unparseable date as open (fail-safe)", () => {
    expect(isOpen("not-a-date", now)).toBe(true);
  });
});

describe("projectAreaSlug (department -> research area)", () => {
  const p = (department: string, extra: Partial<Project> = {}): Project => ({
    slug: "x", title: "X", summary: "", department, status: "Ongoing", ...extra,
  });

  it("prefers an explicit researchArea", () => {
    expect(projectAreaSlug(p("Whatever", { researchArea: "materials" }))).toBe("materials");
  });

  it("maps energy divisions", () => {
    expect(projectAreaSlug(p("Energy Technology Division"))).toBe("energy");
    expect(projectAreaSlug(p("Energy"))).toBe("energy");
  });

  it("maps environment, food/biotech, ICT and transfer", () => {
    expect(projectAreaSlug(p("Environmental Technology & Occupational Safety Division"))).toBe("environment");
    expect(projectAreaSlug(p("Food & Biotechnology"))).toBe("food-biotechnology");
    expect(projectAreaSlug(p("Information & Communication Technologies Division"))).toBe("ict");
    expect(projectAreaSlug(p("Technology Transfer"))).toBe("technology-transfer");
  });

  it("returns undefined for an unmapped department", () => {
    expect(projectAreaSlug(p("Corporate Services"))).toBeUndefined();
  });
});

describe("researchAreaName", () => {
  it("resolves a known slug", () => {
    expect(researchAreaName("energy")).toBe("Energy");
  });
  it("returns undefined for unknown/undefined", () => {
    expect(researchAreaName("nope")).toBeUndefined();
    expect(researchAreaName(undefined)).toBeUndefined();
  });
  it("every area maps back to a name", () => {
    for (const a of researchAreas) expect(researchAreaName(a.slug)).toBe(a.name);
  });
});

describe("sample content integrity", () => {
  it("vacancies have required fields and unique slugs", () => {
    const slugs = new Set<string>();
    for (const v of vacancies) {
      expect(v.slug).toBeTruthy();
      expect(v.title).toBeTruthy();
      expect(v.closingDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(slugs.has(v.slug)).toBe(false);
      slugs.add(v.slug);
    }
  });
  it("tenders have references and unique slugs", () => {
    const slugs = new Set<string>();
    for (const t of tenders) {
      expect(t.reference).toBeTruthy();
      expect(t.closingDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(slugs.has(t.slug)).toBe(false);
      slugs.add(t.slug);
    }
  });
});
