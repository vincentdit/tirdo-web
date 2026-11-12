import { describe, expect, it } from "vitest";
import { allowOidcSubject, isOidcSessionRevoked, oidcPayloadActive, revokeOidcSession } from "@/lib/oidc-session-revoke";

describe("OIDC session revoke", () => {
  it("revokes the SSO session id without blocking a later sign-in", () => {
    const payload = { sub: "user-1", sid: "sess-1", exp: Date.now() / 1000 + 3600 };
    expect(oidcPayloadActive(payload)).toBe(true);
    revokeOidcSession(payload);
    expect(isOidcSessionRevoked({ sid: "sess-1" })).toBe(true);
    expect(isOidcSessionRevoked({ sub: "user-1", sid: "sess-2" })).toBe(false);
    expect(oidcPayloadActive({ sub: "user-1", sid: "sess-2", exp: Date.now() / 1000 + 3600 })).toBe(true);
  });

  it("allows a new login after a subject-only revoke", () => {
    revokeOidcSession({ sub: "user-2" });
    expect(isOidcSessionRevoked({ sub: "user-2" })).toBe(true);
    allowOidcSubject("user-2");
    expect(isOidcSessionRevoked({ sub: "user-2" })).toBe(false);
  });

  it("rejects expired tokens", () => {
    expect(oidcPayloadActive({ sub: "fresh", exp: Date.now() / 1000 - 10 })).toBe(false);
  });
});
