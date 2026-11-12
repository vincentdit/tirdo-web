import { describe, expect, it } from "vitest";
import { isOidcSessionRevoked, oidcPayloadActive, revokeOidcSession } from "@/lib/oidc-session-revoke";

describe("OIDC session revoke", () => {
  it("treats a revoked sid or sub as signed out", () => {
    const payload = { sub: "user-1", sid: "sess-1", exp: Date.now() / 1000 + 3600 };
    expect(oidcPayloadActive(payload)).toBe(true);
    revokeOidcSession(payload);
    expect(isOidcSessionRevoked({ sub: "user-1" })).toBe(true);
    expect(isOidcSessionRevoked({ sid: "sess-1" })).toBe(true);
    expect(oidcPayloadActive({ sub: "other", exp: Date.now() / 1000 + 3600 })).toBe(true);
  });

  it("rejects expired tokens", () => {
    expect(oidcPayloadActive({ sub: "fresh", exp: Date.now() / 1000 - 10 })).toBe(false);
  });
});
