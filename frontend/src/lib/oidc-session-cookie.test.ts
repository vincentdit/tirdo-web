import { describe, expect, it } from "vitest";
import {
  clientFacingRoles,
  compactSessionFromPayload,
  decodeCompactSession,
  encodeCompactSession,
  MAX_ACCESS_TOKEN_COOKIE,
  readOidcAccessToken,
  readOidcBrowserSession,
  writeOidcBrowserCookies,
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

  it("keeps a large access token off the browser cookie and still serves it in-process", () => {
    const header = Buffer.from(JSON.stringify({ alg: "none" })).toString("base64url");
    const payload = Buffer.from(
      JSON.stringify({
        sub: "abc",
        preferred_username: "mabele",
        exp: Math.floor(Date.now() / 1000) + 3600,
        realm_access: { roles: ["staff"] },
      })
    ).toString("base64url");
    const accessToken = `${header}.${payload}.${"x".repeat(MAX_ACCESS_TOKEN_COOKIE)}`;
    const set: Record<string, string> = {};
    writeOidcBrowserCookies(
      { set: (name, value) => { set[name] = value; } },
      { accessToken, maxAge: 3600 }
    );
    expect(set.tirdo_oidc_sess).toBeTruthy();
    expect(set.tirdo_oidc_at).toBeUndefined();
    const stored = decodeCompactSession(set.tirdo_oidc_sess);
    expect(stored?.exp || 0).toBeGreaterThan(Math.floor(Date.now() / 1000) + 7 * 60 * 60);
    expect(
      readOidcAccessToken({
        get: (name) => (set[name] ? { value: set[name] } : undefined),
      })
    ).toBe(accessToken);
  });

  it("hides Keycloak account-console role names from the browser", () => {
    expect(
      clientFacingRoles(["staff", "manage-account", "account:manage-account", "offline_access", "lims"])
    ).toEqual(["staff", "lims"]);
  });
});
