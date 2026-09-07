import { describe, it, expect } from "vitest";
import { gatherDocuments } from "@/lib/search";

// gatherDocuments falls back to bundled content when the CMS is unreachable
// (as in unit tests), so this exercises the real document-shaping logic.
describe("gatherDocuments (search index documents)", () => {
  it("indexes every content type with well-formed URLs", async () => {
    const docs = await gatherDocuments();
    const byType = new Map<string, number>();
    for (const d of docs) byType.set(d.type, (byType.get(d.type) ?? 0) + 1);

    // All the expected content types are represented.
    for (const t of ["News", "Project", "Publication", "Service", "Department", "Vacancy", "Tender", "Page"]) {
      expect(byType.get(t) ?? 0).toBeGreaterThan(0);
    }

    // Every doc has an id, a title and a rooted URL.
    for (const d of docs) {
      expect(d.id).toBeTruthy();
      expect(d.title).toBeTruthy();
      expect(d.url.startsWith("/")).toBe(true);
    }

    // Type-specific URL shapes the search UI relies on.
    const vac = docs.find((d) => d.type === "Vacancy");
    const ten = docs.find((d) => d.type === "Tender");
    const dep = docs.find((d) => d.type === "Department");
    expect(vac?.url.startsWith("/careers#")).toBe(true);
    expect(ten?.url.startsWith("/tenders#")).toBe(true);
    expect(dep?.url.startsWith("/departments/")).toBe(true);

    // Ids are unique (no accidental collisions across types).
    const ids = docs.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("includes the about-page sentinel used to detect a fully-populated index", async () => {
    const docs = await gatherDocuments();
    expect(docs.some((d) => d.id === "about:mission-vision")).toBe(true);
  });
});
