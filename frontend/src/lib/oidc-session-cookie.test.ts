import { describe, expect, it } from "vitest";
import {
  clientFacingRoles,
  compactSessionFromPayload,
  decodeCompactSession,
  encodeCompactSession,
  readOidcBrowserSession,
} from "@/lib/oidc-session-cookie";

describe("compact OIDC session cookie", () => {
  it("round-trips identity without storing the access token", () => {
    const session = compactSessionFromPayload({
      sub: "abc",
      preferred_username: "mabele",
      name: "Mabele Demo",
      email: "mabele@tirdo.go.tz",
      exp: 9e12,
      realm_access: { roles: ["staff", "lims"] },
    });
    expect(session?.username).toBe("mabele");
    const raw = encodeCompactSession(session!);
    expect(raw.length).toBeLessThan(800);
    expect(decodeCompactSession(raw)?.roles).toContain("staff");
  });

  it("reads a compact cookie when the access token is missing", () => {
    const compact = encodeCompactSession({
      sub: "abc",
      name: "Mabele Demo",
      roles: ["staff"],
      exp: Math.floor(Date.now() / 1000) + 3600,
    });
    const session = readOidcBrowserSession({
      get: (name) => (name === "tirdo_oidc_sess" ? { value: compact } : undefined),
    });
    expect(session?.name).toBe("Mabele Demo");
    expect(session?.roles).toEqual(["staff"]);
  });

  it("hides Keycloak account-console role names from the browser", () => {
    expect(
      clientFacingRoles(["staff", "manage-account", "account:manage-account", "offline_access", "lims"])
    ).toEqual(["staff", "lims"]);
  });
});
