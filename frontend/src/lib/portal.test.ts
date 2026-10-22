import { describe, it, expect } from "vitest";
import {
  collectionBySlug,
  friendlyAuthError,
  isAdminEmail,
  isSuperAdminRole,
  isAdminRole,
  isFullPortalRole,
  pageEditTarget,
  mediaId,
  pickAllowedFields,
  entryStatus,
  parseCollectionList,
  allowedPageSlugsFromGrants,
  canAccessPageSlug,
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
    expect(collectionBySlug("events")?.uid).toBe("api::event.event");
    expect(collectionBySlug("secret")).toBeUndefined();
  });

  it("treats Super Admin as full-access role", () => {
    expect(isSuperAdminRole(["Editor"])).toBe(false);
    expect(isSuperAdminRole(["Super Admin"])).toBe(true);
  });

  it("treats Admin like Super Admin for site editing", () => {
    expect(isAdminRole(["Admin"])).toBe(true);
    expect(isAdminRole(["Editor"])).toBe(false);
    expect(isFullPortalRole(["Administrator"])).toBe(true);
    expect(isFullPortalRole(["Author"])).toBe(false);
  });

  it("maps public pages to the matching portal editor", () => {
    expect(pageEditTarget("/").href).toBe("/portal/branding");
    expect(pageEditTarget("/news/foo").collection).toBe("articles");
    expect(pageEditTarget("/events/training").collection).toBe("events");
    expect(pageEditTarget("/publications/tirdo-profile").collection).toBe("publications");
  });

  it("sends media fields as numeric ids", () => {
    const col = collectionBySlug("articles");
    expect(col).toBeTruthy();
    expect(mediaId({ id: 12, url: "/uploads/a.jpg" })).toBe(12);
    expect(pickAllowedFields(col!, { title: "News", cover: { id: 9 } }).cover).toBe(9);
  });

  it("parses assigned collection lists", () => {
    expect(parseCollectionList(["articles", "pages"])).toEqual(["articles", "pages"]);
    expect(parseCollectionList("articles,vacancies")).toEqual(["articles", "vacancies"]);
  });

  it("limits page editing to assigned slugs", () => {
    expect(allowedPageSlugsFromGrants([{ collections: ["pages"], pageSlugs: ["privacy", "about"] }])).toEqual([
      "privacy",
      "about",
    ]);
    expect(allowedPageSlugsFromGrants([{ collections: ["pages"], pageSlugs: [] }])).toBeNull();
    expect(canAccessPageSlug(["privacy"], "privacy")).toBe(true);
    expect(canAccessPageSlug(["privacy"], "about")).toBe(false);
    expect(canAccessPageSlug(null, "about")).toBe(true);
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
