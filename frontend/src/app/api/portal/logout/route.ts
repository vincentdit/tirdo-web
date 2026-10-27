import { NextResponse } from "next/server";
import { ingestAuditEvent } from "@/lib/audit-ingest";
import { PORTAL_COOKIE } from "@/lib/portal";
import { cookieOptions, cmsAdmin, portalToken } from "../_cms";

export async function POST() {
  const token = portalToken();
  if (token) {
    await cmsAdmin("/admin/logout", token, { method: "POST" }).catch(() => undefined);
  }
  await ingestAuditEvent({
    action: "logout",
    eventType: "authentication",
    outcome: "success",
    actorType: "user",
    identityProvider: "strapi",
    sourceService: "portal",
    changeSummary: "CMS portal sign-out",
  });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(PORTAL_COOKIE, "", { ...cookieOptions(false), maxAge: 0 });
  return res;
}
