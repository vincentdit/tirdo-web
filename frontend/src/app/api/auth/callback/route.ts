import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  oidcCallbackUrl,
  oidcClientId,
  oidcTokenUrl,
  safeReturnTo,
  siteCookieOptions,
} from "@/lib/oidc";
import { writeOidcBrowserCookies } from "@/lib/oidc-session-cookie";
import { ingestAuditEvent } from "@/lib/audit-ingest";
import { publicSiteUrl } from "@/lib/public-url";

function idTokenClaims(idToken?: string): { sub?: string; email?: string } {
  if (!idToken) return {};
  try {
    const payload = idToken.split(".")[1];
    if (!payload) return {};
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { sub?: string; email?: string };
  } catch {
    return {};
  }
}

function clearPkceCookies(res: NextResponse) {
  const gone = { ...siteCookieOptions(0), maxAge: 0 };
  res.cookies.set("tirdo_oidc_v", "", gone);
  res.cookies.set("tirdo_oidc_s", "", gone);
  res.cookies.set("tirdo_oidc_r", "", gone);
}

export async function GET(request: NextRequest) {
  const site = publicSiteUrl();
  const jar = cookies();
  const expectedState = jar.get("tirdo_oidc_s")?.value || "";
  const verifier = jar.get("tirdo_oidc_v")?.value || "";
  const returnTo = safeReturnTo(jar.get("tirdo_oidc_r")?.value, site);
  const code = request.nextUrl.searchParams.get("code") || "";
  const state = request.nextUrl.searchParams.get("state") || "";

  const fail = () => {
    const dest = new URL(returnTo);
    dest.searchParams.set("login_error", "1");
    const res = NextResponse.redirect(dest);
    clearPkceCookies(res);
    return res;
  };
  if (!code || !verifier || !expectedState || state !== expectedState) return fail();

  try {
    const tokenRes = await fetch(oidcTokenUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: oidcClientId(),
        code,
        redirect_uri: oidcCallbackUrl(),
        code_verifier: verifier,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
    const json = (await tokenRes.json().catch(() => ({}))) as {
      access_token?: string;
      id_token?: string;
      expires_in?: number;
    };
    if (!tokenRes.ok || !json.access_token) {
      await ingestAuditEvent({
        action: "login_failed",
        eventType: "authentication",
        outcome: "failure",
        identityProvider: "keycloak",
        sourceService: "frontend",
        actorType: "user",
        reason: "token_exchange_failed",
        changeSummary: "Keycloak sign-in failed (application observed)",
      });
      return fail();
    }
    const maxAge = Math.max(60, Number(json.expires_in) || 3600);
    jar.set("tirdo_oidc_v", "", { ...siteCookieOptions(0), maxAge: 0 });
    jar.set("tirdo_oidc_s", "", { ...siteCookieOptions(0), maxAge: 0 });
    jar.set("tirdo_oidc_r", "", { ...siteCookieOptions(0), maxAge: 0 });
    writeOidcBrowserCookies(jar, {
      accessToken: json.access_token,
      idToken: json.id_token,
      maxAge,
    });
    const res = NextResponse.redirect(returnTo);
    writeOidcBrowserCookies(res.cookies, {
      accessToken: json.access_token,
      idToken: json.id_token,
      maxAge,
    });
    const claims = idTokenClaims(json.id_token);
    await ingestAuditEvent({
      action: "login",
      eventType: "authentication",
      outcome: "success",
      actor: claims.email || claims.sub || "keycloak-user",
      actorId: claims.sub || "",
      actorType: "user",
      identityProvider: "keycloak",
      sourceService: "frontend",
      changeSummary: "Keycloak sign-in succeeded (application observed)",
    });
    return res;
  } catch {
    return fail();
  }
}
