import { NextRequest, NextResponse } from "next/server";
import { cmsBase, friendlyAuthError, isAdminEmail, PORTAL_COOKIE } from "@/lib/portal";
import { cookieOptions } from "../_cms";

export async function POST(request: NextRequest) {
  let body: { identifier?: string; email?: string; password?: string; rememberMe?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Enter your TIRDO email and password to sign in." }, { status: 400 });
  }

  const email = String(body.email || body.identifier || "").trim();
  const password = String(body.password || "");
  const rememberMe = Boolean(body.rememberMe);

  if (!isAdminEmail(email)) {
    return NextResponse.json(
      { error: "Use the email address of your TIRDO administrator account." },
      { status: 400 }
    );
  }
  if (!password) {
    return NextResponse.json({ error: "Enter your password." }, { status: 400 });
  }

  let cmsRes: Response;
  try {
    cmsRes = await fetch(`${cmsBase()}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
      signal: AbortSignal.timeout(12000),
    });
  } catch {
    return NextResponse.json(
      { error: friendlyAuthError(503, "network") },
      { status: 503 }
    );
  }

  const json = await cmsRes.json().catch(() => ({}));
  const token = json?.data?.token as string | undefined;
  const user = json?.data?.user as Record<string, unknown> | undefined;

  if (json?.data && !token && (json.data.deviceId || json.data.requireTwoFactor || json.data.twoFactor)) {
    return NextResponse.json(
      {
        requiresSecondFactor: true,
        message: "Additional verification is required for this account. Complete the step in TIRDO Content Manager or contact your administrator.",
      },
      { status: 202 }
    );
  }

  if (!cmsRes.ok || !token) {
    const msg = json?.error?.message || json?.message;
    return NextResponse.json({ error: friendlyAuthError(cmsRes.status, msg) }, { status: cmsRes.status === 400 ? 401 : cmsRes.status });
  }

  const res = NextResponse.json({
    ok: true,
    user: {
      email: user?.email,
      firstname: user?.firstname,
      lastname: user?.lastname,
    },
  });
  res.cookies.set(PORTAL_COOKIE, token, cookieOptions(rememberMe));
  return res;
}
