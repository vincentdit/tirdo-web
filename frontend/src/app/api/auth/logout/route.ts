import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ingestAuditEvent } from "@/lib/audit-ingest";
import { oidcClientId, oidcLogoutUrl, parseJwtPayload, siteCookieOptions } from "@/lib/oidc";
import { revokeOidcSession } from "@/lib/oidc-session-revoke";
import { cmsBase, PORTAL_COOKIE } from "@/lib/portal";
import { publicSiteUrl } from "@/lib/public-url";

export async function GET() {
  const site = publicSiteUrl();
  const jar = cookies();
  const idToken = jar.get("tirdo_oidc_it")?.value || "";
  const access = jar.get("tirdo_oidc_at")?.value || "";
  const portal = jar.get(PORTAL_COOKIE)?.value || "";
  revokeOidcSession(access ? parseJwtPayload(access) : parseJwtPayload(idToken));
  jar.set("tirdo_oidc_at", "", { ...siteCookieOptions(0), maxAge: 0 });
  jar.set("tirdo_oidc_it", "", { ...siteCookieOptions(0), maxAge: 0 });
  jar.set(PORTAL_COOKIE, "", { ...siteCookieOptions(0), maxAge: 0 });
  if (portal) {
    await fetch(`${cmsBase()}/admin/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${portal}` },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    }).catch(() => undefined);
  }
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
    changeSummary: "Keycloak sign-out (ends TIRDO Web, Content Manager, and other SSO sessions)",
  });
  return NextResponse.redirect(`${oidcLogoutUrl()}?${params.toString()}`);
}
