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
  validateCollectionPayload,
  mediaPreviewUrl,
  cmsAdminErrorMessage,
  pickDefaultPortalRoleId,
  portalPasswordIssue,
  grantedCollectionSlugs,
  PORTAL_COLLECTIONS,
} from "@/lib/portal";
import { oidcCallbackUrl, safeReturnTo } from "@/lib/oidc";
import { publicFileUrl } from "@/lib/utils";
import { resolveKeycloakPublicUrl } from "@/lib/public-url";
import { applyUniqueVisit, emptyVisits } from "@/lib/visit-store";

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
    expect(collectionBySlug("partners")?.uid).toBe("api::partner.partner");
    expect(collectionBySlug("partners")?.group).toBe("content");
    expect(collectionBySlug("partners")?.label).toBe("Our Partners");
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

  it("limits content management to granted collections except Super Admin", () => {
    expect(grantedCollectionSlugs(["Author"], ["publications"])).toEqual(["publications"]);
    expect(grantedCollectionSlugs(["Admin"], ["articles"])).toEqual(["articles"]);
    expect(grantedCollectionSlugs(["Editor"], ["articles", "publications"]).sort()).toEqual(["articles", "publications"]);
    expect(grantedCollectionSlugs(["Super Admin"], ["publications"])).toEqual(PORTAL_COLLECTIONS.map((c) => c.slug));
  });

  it("maps public pages to the matching portal editor", () => {
    expect(pageEditTarget("/").href).toBe("/portal/branding");
    expect(pageEditTarget("/news/foo").collection).toBe("articles");
    expect(pageEditTarget("/events/training").collection).toBe("events");
    expect(pageEditTarget("/about/partners").collection).toBe("partners");
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
    expect(entryStatus({ active: false, publishedAt: "2026-01-01" }, true)).toBe("Inactive");
  });

  it("maps CMS user-create validation into a clear message", () => {
    expect(portalPasswordIssue("short")).toMatch(/8/);
    expect(portalPasswordIssue("password1")).toMatch(/uppercase/i);
    expect(portalPasswordIssue("Password1")).toBeNull();
    expect(portalPasswordIssue("Tanzania@64")).toBeNull();
    expect(
      cmsAdminErrorMessage({ error: { message: "passwordConfirmation is a required field" } }, "Could not create this user.")
    ).toMatch(/do not match/i);
    expect(pickDefaultPortalRoleId([{ id: 1, name: "Super Admin" }, { id: 2, name: "Author" }], undefined)).toBe(2);
    expect(
      cmsAdminErrorMessage({ error: { message: "lastname is a required field" } }, "Could not create this user.")
    ).toMatch(/last name/i);
  });

  it("keeps OIDC return URLs on the public site", () => {
    expect(oidcCallbackUrl({ PUBLIC_URL: "http://172.30.30.54:3001" })).toBe(
      "http://172.30.30.54:3001/api/auth/callback"
    );
    expect(safeReturnTo("http://evil.example/phish", "http://172.30.30.54:3001")).toBe("http://172.30.30.54:3001");
    expect(safeReturnTo("/staff", "http://172.30.30.54:3001")).toBe("http://172.30.30.54:3001/staff");
  });

  it("points Sign in at the public site Keycloak path", () => {
    expect(resolveKeycloakPublicUrl({ PUBLIC_URL: "http://172.30.30.54" })).toBe("http://172.30.30.54/auth");
    expect(
      resolveKeycloakPublicUrl({
        PUBLIC_URL: "http://172.30.30.54",
        KEYCLOAK_PUBLIC_URL: "http://localhost:8080/auth",
      })
    ).toBe("http://172.30.30.54/auth");
    expect(
      resolveKeycloakPublicUrl({
        PUBLIC_URL: "http://172.30.30.54:3001",
        KEYCLOAK_PUBLIC_URL: "http://172.30.30.54:8082/auth",
      })
    ).toBe("http://172.30.30.54:3001/auth");
    expect(resolveKeycloakPublicUrl({ PUBLIC_URL: "http://localhost" })).toBe("http://localhost/auth");
  });

  it("rewrites MinIO logo URLs onto the public site origin", () => {
    expect(publicFileUrl("http://localhost:9100/tirdo-media/sido_5a8f9ea095.jpg")).toBe("/cms-media/sido_5a8f9ea095.jpg");
    expect(publicFileUrl("http://172.30.30.54:9100/tirdo-media/sido_5a8f9ea095.jpg")).toBe("/cms-media/sido_5a8f9ea095.jpg");
    expect(mediaPreviewUrl({ url: "http://localhost:9100/tirdo-media/sido_5a8f9ea095.jpg" })).toBe("/cms-media/sido_5a8f9ea095.jpg");
  });

  it("counts a unique visit and rolls today on a new day", () => {
    const first = applyUniqueVisit(emptyVisits(new Date("2026-10-23T09:00:00Z")), new Date("2026-10-23T09:00:00Z"));
    expect(first.total).toBe(1);
    expect(first.today).toBe(1);
    const nextDay = applyUniqueVisit(first, new Date("2026-10-24T09:00:00Z"));
    expect(nextDay.today).toBe(1);
    expect(nextDay.total).toBe(2);
  });

  it("validates partner records", () => {
    const col = collectionBySlug("partners")!;
    expect(validateCollectionPayload(col, { name: "TBS" })).toBeNull();
    expect(validateCollectionPayload(col, {})).toMatch(/required/i);
    expect(validateCollectionPayload(col, { name: "TBS", website: "tbs.go.tz" })).toMatch(/http/i);
    expect(validateCollectionPayload(col, { name: "TBS", email: "not-mail" })).toMatch(/email/i);
  });
});
