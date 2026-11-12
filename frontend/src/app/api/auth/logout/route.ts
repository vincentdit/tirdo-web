import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ingestAuditEvent } from "@/lib/audit-ingest";
import { endKeycloakUserSessions } from "@/lib/iam-keycloak";
import { oidcClientId, oidcLogoutUrl, parseJwtPayload, siteCookieOptions } from "@/lib/oidc";
import {
  clearCachedOidcTokens,
  clearOidcBrowserCookies,
  decodeCompactSession,
  OIDC_SESS_COOKIE,
  readCachedOidcTokens,
  readOidcBrowserSession,
} from "@/lib/oidc-session-cookie";
import { revokeOidcSession } from "@/lib/oidc-session-revoke";
import { cmsBase, PORTAL_COOKIE } from "@/lib/portal";
import { publicSiteUrl } from "@/lib/public-url";

function wipeBrowserAuth(jar: { set: (name: string, value: string, options: ReturnType<typeof siteCookieOptions>) => unknown }) {
  clearOidcBrowserCookies(jar);
  jar.set(PORTAL_COOKIE, "", { ...siteCookieOptions(0), maxAge: 0 });
}

export async function GET() {
  const site = publicSiteUrl();
  const jar = cookies();
  const session = readOidcBrowserSession(jar);
  const cached = readCachedOidcTokens(session);
  const idToken = jar.get("tirdo_oidc_it")?.value || cached?.idToken || "";
  const access = jar.get("tirdo_oidc_at")?.value || cached?.accessToken || "";
  const portal = jar.get(PORTAL_COOKIE)?.value || "";
  const sub = session?.sub || String(parseJwtPayload(access)?.sub || parseJwtPayload(idToken)?.sub || "").trim();

  if (sub) await endKeycloakUserSessions(sub);

  revokeOidcSession(
    access
      ? parseJwtPayload(access)
      : parseJwtPayload(idToken) ||
          (decodeCompactSession(jar.get(OIDC_SESS_COOKIE)?.value) as Record<string, unknown> | null)
  );
  clearCachedOidcTokens(session);
  wipeBrowserAuth(jar);

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
    changeSummary: "Ended all Keycloak SSO sessions for this user across TIRDO systems",
  });

  const res = NextResponse.redirect(`${oidcLogoutUrl()}?${params.toString()}`, 307);
  wipeBrowserAuth(res.cookies);
  return res;
}
