import { createHash, randomBytes } from "crypto";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  oidcAuthorizeUrl,
  oidcCallbackUrl,
  oidcClientId,
  parseJwtPayload,
  safeReturnTo,
  siteCookieOptions,
} from "@/lib/oidc";
import { readOidcAccessToken, readOidcBrowserSession } from "@/lib/oidc-session-cookie";
import { oidcPayloadActive } from "@/lib/oidc-session-revoke";
import { publicSiteUrl } from "@/lib/public-url";

function b64url(buf: Buffer) {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export async function GET(request: NextRequest) {
  const site = publicSiteUrl();
  const returnTo = safeReturnTo(request.nextUrl.searchParams.get("returnTo"), site);
  const jar = cookies();
  const session = readOidcBrowserSession(jar);
  const access = readOidcAccessToken(jar);
  const accessOk = Boolean(access && oidcPayloadActive(parseJwtPayload(access)));
  const needsFreshAccess = returnTo.includes("/api/portal/from-sso");
  if (session && (!needsFreshAccess || accessOk)) {
    return NextResponse.redirect(returnTo);
  }

  const verifier = b64url(randomBytes(32));
  const challenge = b64url(createHash("sha256").update(verifier).digest());
  const state = b64url(randomBytes(16));
  const pkce = siteCookieOptions(600);
  jar.set("tirdo_oidc_v", verifier, pkce);
  jar.set("tirdo_oidc_s", state, pkce);
  jar.set("tirdo_oidc_r", returnTo, pkce);

  const params = new URLSearchParams({
    client_id: oidcClientId(),
    redirect_uri: oidcCallbackUrl(),
    response_type: "code",
    scope: "openid profile email",
    state,
    code_challenge: challenge,
    code_challenge_method: "S256",
  });
  const res = NextResponse.redirect(`${oidcAuthorizeUrl()}?${params.toString()}`, 307);
  res.cookies.set("tirdo_oidc_v", verifier, pkce);
  res.cookies.set("tirdo_oidc_s", state, pkce);
  res.cookies.set("tirdo_oidc_r", returnTo, pkce);
  return res;
}
