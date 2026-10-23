import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { cmsBase, PORTAL_COOKIE } from "@/lib/portal";
import { publicSiteUrl } from "@/lib/public-url";

export function portalToken(): string | undefined {
  return cookies().get(PORTAL_COOKIE)?.value;
}

export function unauthorized() {
  return NextResponse.json({ error: "Sign in required." }, { status: 401 });
}

export async function cmsAdmin(
  path: string,
  token: string,
  init: RequestInit = {}
): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);
  const isForm = typeof FormData !== "undefined" && init.body instanceof FormData;
  if (!headers.has("Content-Type") && init.body && !isForm) {
    headers.set("Content-Type", "application/json");
  }
  return fetch(`${cmsBase()}${path}`, {
    ...init,
    headers,
    cache: "no-store",
    signal: AbortSignal.timeout(20000),
  });
}

export function cookieOptions(remember: boolean) {
  const secure = publicSiteUrl().startsWith("https");
  return {
    httpOnly: true as const,
    sameSite: "lax" as const,
    secure,
    path: "/",
    ...(remember ? { maxAge: 60 * 60 * 24 * 7 } : {}),
  };
}
