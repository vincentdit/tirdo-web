import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ingestAuditEvent } from "@/lib/audit-ingest";
import { oidcClientId, oidcLogoutUrl, siteCookieOptions } from "@/lib/oidc";
import { publicSiteUrl } from "@/lib/public-url";

export async function GET() {
  const site = publicSiteUrl();
  const jar = cookies();
  const idToken = jar.get("tirdo_oidc_it")?.value || "";
  jar.set("tirdo_oidc_at", "", { ...siteCookieOptions(0), maxAge: 0 });
  jar.set("tirdo_oidc_it", "", { ...siteCookieOptions(0), maxAge: 0 });
  const params = new URLSearchParams({
    client_id: oidcClientId(),
    post_logout_redirect_uri: site,
  });
  if (idToken) params.set("id_token_hint", idToken);
  await ingestAuditEvent({
    action: "logout",
    eventType: "authentication",
    outcome: "success",
    identityProvider: "keycloak",
    sourceService: "frontend",
    actorType: "user",
    changeSummary: "Keycloak sign-out (application observed)",
  });
  return NextResponse.redirect(`${oidcLogoutUrl()}?${params.toString()}`);
}
