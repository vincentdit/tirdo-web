import { describe, it, expect } from "vitest";
import {
  collectionBySlug,
  friendlyAuthError,
  isAdminEmail,
  isSuperAdminRole,
  entryStatus,
  parseCollectionList,
  cmsListQuery,
  sanitizeSearch,
  PORTAL_COLLECTIONS,
} from "@/lib/portal";

describe("portal helpers", () => {
  it("accepts TIRDO administrator emails only", () => {
    expect(isAdminEmail("cms@tirdo.or.tz")).toBe(true);
    expect(isAdminEmail("not-an-email")).toBe(false);
  });

  it("does not leak backend error text for bad credentials", () => {
    expect(friendlyAuthError(400, "Invalid identifier or password")).toMatch(/not correct/i);
    expect(friendlyAuthError(401, "invalid credentials")).toMatch(/not correct/i);
  });

  it("whitelists known CMS collections", () => {
    expect(PORTAL_COLLECTIONS.length).toBeGreaterThan(3);
    expect(collectionBySlug("articles")?.uid).toBe("api::article.article");
    expect(collectionBySlug("secret")).toBeUndefined();
  });

  it("treats Super Admin as full-access role", () => {
    expect(isSuperAdminRole(["Editor"])).toBe(false);
    expect(isSuperAdminRole(["Super Admin"])).toBe(true);
  });

  it("parses assigned collection lists", () => {
    expect(parseCollectionList(["articles", "pages"])).toEqual(["articles", "pages"]);
    expect(parseCollectionList("articles,vacancies")).toEqual(["articles", "vacancies"]);
  });

  it("builds paginated CMS search queries", () => {
    expect(sanitizeSearch("  minerals  ")).toBe("minerals");
    const qs = cmsListQuery(2, 10, "STAMICO", ["title"]);
    expect(qs).toContain("page=2");
    expect(qs).toContain("pageSize=10");
    expect(qs).toContain("_q=STAMICO");
    expect(qs).toContain("filters");
  });

  it("maps draft and handled status", () => {
    expect(entryStatus({ publishedAt: "2026-01-01" }, true)).toBe("Published");
    expect(entryStatus({ publishedAt: null }, true)).toBe("Draft");
    expect(entryStatus({ status: "modified" }, true)).toBe("Modified");
    expect(entryStatus({ handled: true }, false)).toBe("Handled");
  });
});
