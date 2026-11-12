import { NextRequest, NextResponse } from "next/server";
import { parseJwtPayload } from "@/lib/oidc";
import { ingestAuditEvent } from "@/lib/audit-ingest";
import { revokeOidcSession } from "@/lib/oidc-session-revoke";

export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type") || "";
  let logoutToken = "";
  if (contentType.includes("application/x-www-form-urlencoded")) {
    const form = await request.formData();
    logoutToken = String(form.get("logout_token") || "");
  } else {
    const json = (await request.json().catch(() => ({}))) as { logout_token?: string };
    logoutToken = String(json.logout_token || "");
  }
  const claims = logoutToken ? parseJwtPayload(logoutToken) : null;
  if (!claims || claims.events == null) {
    return NextResponse.json({ error: "Invalid logout token." }, { status: 400 });
  }
  revokeOidcSession(claims);
  await ingestAuditEvent({
    action: "logout",
    eventType: "authentication",
    outcome: "success",
    identityProvider: "keycloak",
    sourceService: "frontend",
    actorId: String(claims.sub || ""),
    actorType: "user",
    changeSummary: "OIDC back-channel logout received",
    metadata: { sid: claims.sid ? "[present]" : undefined },
  });
  return NextResponse.json({ ok: true });
}
