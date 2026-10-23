import { createHash, randomBytes } from "crypto";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  oidcAuthorizeUrl,
  oidcCallbackUrl,
  oidcClientId,
  safeReturnTo,
  siteCookieOptions,
} from "@/lib/oidc";
import { publicSiteUrl } from "@/lib/public-url";

function b64url(buf: Buffer) {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export async function GET(request: NextRequest) {
  const site = publicSiteUrl();
  const returnTo = safeReturnTo(request.nextUrl.searchParams.get("returnTo"), site);
  const verifier = b64url(randomBytes(32));
  const challenge = b64url(createHash("sha256").update(verifier).digest());
  const state = b64url(randomBytes(16));
  const jar = cookies();
  jar.set("tirdo_oidc_v", verifier, siteCookieOptions(600));
  jar.set("tirdo_oidc_s", state, siteCookieOptions(600));
  jar.set("tirdo_oidc_r", returnTo, siteCookieOptions(600));

  const params = new URLSearchParams({
    client_id: oidcClientId(),
    redirect_uri: oidcCallbackUrl(),
    response_type: "code",
    scope: "openid profile email",
    state,
    code_challenge: challenge,
    code_challenge_method: "S256",
  });
  return NextResponse.redirect(`${oidcAuthorizeUrl()}?${params.toString()}`);
}
