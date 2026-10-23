import { describe, it, expect } from "vitest";
import {
  adminTokenAuthorized,
  clampSearchFrom,
  clampSearchQuery,
  isSafePortalNext,
  isSameOriginRequest,
  sanitizeSearchHighlight,
  secretsEqual,
} from "@/lib/security";

describe("security helpers", () => {
  it("compares secrets in constant time and rejects empty expected values", () => {
    expect(secretsEqual("abc", "abc")).toBe(true);
    expect(secretsEqual("abc", "abd")).toBe(false);
    expect(secretsEqual("abc", "")).toBe(false);
    expect(secretsEqual("", "abc")).toBe(false);
  });

  it("fails closed when the admin token is not configured", () => {
    const req = new Request("http://localhost/api/revalidate", {
      method: "POST",
      headers: { "x-reindex-token": "guess" },
    });
    expect(adminTokenAuthorized(req, undefined)).toBe(false);
    expect(adminTokenAuthorized(req, "")).toBe(false);
    expect(adminTokenAuthorized(req, "guess")).toBe(true);
    const leaked = new Request("http://localhost/api/revalidate?token=guess", { method: "POST" });
    expect(adminTokenAuthorized(leaked, "guess")).toBe(false);
  });

  it("keeps only mark tags in search highlights", () => {
    expect(sanitizeSearchHighlight('<mark>ok</mark><script>alert(1)</script>')).toBe(
      "<mark>ok</mark>&lt;script&gt;alert(1)&lt;/script&gt;"
    );
  });

  it("caps search query length and offset", () => {
    expect(clampSearchQuery("  ab  ")).toBe("ab");
    expect(clampSearchQuery("x".repeat(500)).length).toBe(200);
    expect(clampSearchFrom(-3)).toBe(0);
    expect(clampSearchFrom(99999)).toBe(1000);
  });

  it("requires same-origin for cookie-authenticated portal writes", () => {
    const headers = new Headers({ host: "172.30.30.54:3001", origin: "http://172.30.30.54:3001" });
    expect(isSameOriginRequest(headers)).toBe(true);
    expect(isSameOriginRequest(new Headers({ host: "172.30.30.54:3001", origin: "https://evil.example" }))).toBe(false);
    expect(isSameOriginRequest(new Headers({ host: "172.30.30.54:3001" }))).toBe(false);
  });

  it("rejects open-redirect portal next paths", () => {
    expect(isSafePortalNext("/portal/users")).toBe(true);
    expect(isSafePortalNext("/portal")).toBe(true);
    expect(isSafePortalNext("//evil.example")).toBe(false);
    expect(isSafePortalNext("/staff")).toBe(false);
    expect(isSafePortalNext("/portal/../api")).toBe(false);
  });
});
