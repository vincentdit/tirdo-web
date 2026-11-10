import { describe, expect, it } from "vitest";
import {
  IAM_CATALOG,
  isDuplicateClient,
  publicClientView,
  stripSecrets,
  suggestedClientId,
  validateAccessTokenClaims,
  validateRedirectUris,
  integrationStatus,
  iamAdminAllowed,
} from "@/lib/iam";

describe("institutional IAM helpers", () => {
  it("lists the core institutional applications", () => {
    expect(IAM_CATALOG.map((row) => row.code)).toEqual(["tirdo-web", "niims", "lims", "ciap", "telt"]);
  });

  it("prevents duplicate client ids", () => {
    expect(isDuplicateClient(["tirdo-web", "niims"], "NIIMS")).toBe(true);
    expect(isDuplicateClient(["tirdo-web"], "lims")).toBe(false);
    expect(suggestedClientId("NIIMS Lab!")).toBe("niims-lab");
  });

  it("never returns client secrets in public views", () => {
    const view = publicClientView({
      id: "abc",
      clientId: "niims",
      secret: "super-secret",
      publicClient: false,
      enabled: true,
      attributes: { "tirdo.owner": "ICT" },
    });
    expect(JSON.stringify(view)).not.toMatch(/super-secret/);
    expect(view.secretConfigured).toBe(true);
    expect(stripSecrets({ secret: "x", clientId: "niims", nested: { password: "y" } })).toEqual({
      clientId: "niims",
      nested: {},
    });
  });

  it("rejects unsafe redirect URIs and invalid tokens", () => {
    expect(validateRedirectUris([])).toMatch(/required/i);
    expect(validateRedirectUris(["*"])).toMatch(/wildcard/i);
    expect(validateRedirectUris(["https://niims.tirdo.or.tz/callback"])).toBeNull();
    const issuer = "http://localhost/auth/realms/tirdo";
    expect(validateAccessTokenClaims({ iss: "other", aud: "tirdo-web", exp: 9e12 }, { issuer, audience: "tirdo-web" })).toBe(
      "invalid_issuer"
    );
    expect(validateAccessTokenClaims({ iss: issuer, aud: "other", exp: 9e12 }, { issuer, audience: "tirdo-web" })).toBe(
      "invalid_audience"
    );
    expect(validateAccessTokenClaims({ iss: issuer, aud: "tirdo-web", exp: 1 }, { issuer, audience: "tirdo-web", now: 2000 })).toBe(
      "expired"
    );
    expect(validateAccessTokenClaims({ iss: issuer, aud: "tirdo-web", exp: 9e12 }, { issuer, audience: "tirdo-web" })).toBeNull();
  });

  it("restricts IAM administration to authorised portal administrators", () => {
    expect(iamAdminAllowed(false, false)).toBe(false);
    expect(iamAdminAllowed(true, false)).toBe(true);
    expect(iamAdminAllowed(false, true)).toBe(true);
  });

  it("does not mark other systems integrated just because a client exists", () => {
    expect(integrationStatus("tirdo-web", true, true)).toBe("integrated");
    expect(integrationStatus("niims", true, true)).toBe("client_ready");
    expect(integrationStatus("lims", false, false)).toBe("not_registered");
  });
});
