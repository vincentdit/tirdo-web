import { NextResponse } from "next/server";
import { PORTAL_COOKIE } from "@/lib/portal";
import { cookieOptions, cmsAdmin, portalToken } from "../_cms";

export async function POST() {
  const token = portalToken();
  if (token) {
    await cmsAdmin("/admin/logout", token, { method: "POST" }).catch(() => undefined);
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(PORTAL_COOKIE, "", { ...cookieOptions(false), maxAge: 0 });
  return res;
}
