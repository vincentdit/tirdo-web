import { describe, expect, it } from "vitest";
import { publicAuthNotice, publicLaunchError, publicSignInError } from "@/lib/customer-error";

describe("customer-facing auth errors", () => {
  it("never echoes HTTP status or slug codes to the user", () => {
    expect(publicSignInError()).not.toMatch(/500|OIDC|Keycloak|token/i);
    expect(publicLaunchError("403", "lims")).toMatch(/LIMS/);
    expect(publicLaunchError("403", "lims")).not.toMatch(/403/);
    expect(publicLaunchError("409", "ciap")).not.toMatch(/409|href|null/i);
    expect(publicAuthNotice({ loginError: "1" })).toBe(publicSignInError());
    expect(publicAuthNotice({ denied: "lims", reason: "403" })).not.toMatch(/SSO_|Exception/);
  });
});
