import { NextRequest, NextResponse } from "next/server";
import { SITE_BRAND_UID, mediaId } from "@/lib/portal";
import { forbidden, loadAccess } from "../_access";
import { cmsAdmin, portalToken, unauthorized } from "../_cms";

const UID = encodeURIComponent(SITE_BRAND_UID);
const FIELDS = [
  "logo",
  "emblem",
  "heroImage",
  "showHero",
  "hideHeroImage",
  "directorPhoto",
  "tagline",
  "footerBlurb",
  "welcomeTitle",
  "welcomeBody",
] as const;

function payloadFrom(body: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const key of FIELDS) {
    if (!(key in body)) continue;
    if (key === "logo" || key === "emblem" || key === "heroImage" || key === "directorPhoto") {
      out[key] = mediaId(body[key]);
    } else if (key === "showHero") {
      out[key] = body[key] !== false;
    } else if (key === "hideHeroImage") {
      out[key] = Boolean(body[key]);
    } else {
      out[key] = body[key] ?? "";
    }
  }
  return out;
}

export async function GET() {
  const token = portalToken();
  if (!token) return unauthorized();
  const access = await loadAccess(token);
  if (!access) return NextResponse.json({ error: "Session expired. Sign in again." }, { status: 401 });
  if (!access.canManageSite) return forbidden("You are not assigned to site photos and branding.");

  const res = await cmsAdmin(`/content-manager/single-types/${UID}`, token);
  const json = await res.json().catch(() => ({}));
  if (!res.ok && res.status !== 404) {
    return NextResponse.json({ error: "Could not load branding." }, { status: res.status });
  }
  return NextResponse.json({ data: json.data || json || {}, canPublish: access.canPublish });
}

export async function PUT(request: NextRequest) {
  const token = portalToken();
  if (!token) return unauthorized();
  const access = await loadAccess(token);
  if (!access) return NextResponse.json({ error: "Session expired. Sign in again." }, { status: 401 });
  if (!access.canManageSite) return forbidden("You are not assigned to site photos and branding.");

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const payload = payloadFrom(body);
  const res = await cmsAdmin(`/content-manager/single-types/${UID}`, token, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    return NextResponse.json({ error: "Could not save branding." }, { status: res.status });
  }

  if (access.canPublish) {
    await cmsAdmin(`/content-manager/single-types/${UID}/actions/publish`, token, { method: "POST" });
  }
  return NextResponse.json({ data: json.data || json });
}
