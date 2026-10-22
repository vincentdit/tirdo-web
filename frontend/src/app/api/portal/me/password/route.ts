import { NextRequest, NextResponse } from "next/server";
import { loadAccess } from "../../_access";
import { cmsAdmin, portalToken, unauthorized } from "../../_cms";

export async function POST(request: NextRequest) {
  const token = portalToken();
  if (!token) return unauthorized();
  const access = await loadAccess(token);
  if (!access) return NextResponse.json({ error: "Session expired. Sign in again." }, { status: 401 });

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const currentPassword = String(body.currentPassword || "");
  const password = String(body.password || "");
  const confirm = String(body.confirmPassword || body.passwordConfirmation || "");
  if (!currentPassword || !password) {
    return NextResponse.json({ error: "Enter your current password and a new password." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "The new password must be at least 8 characters." }, { status: 400 });
  }
  if (password !== confirm) {
    return NextResponse.json({ error: "The new password and confirmation do not match." }, { status: 400 });
  }

  const res = await cmsAdmin("/admin/users/me", token, {
    method: "PUT",
    body: JSON.stringify({
      currentPassword,
      password,
      passwordConfirmation: confirm,
    }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = String((json as { error?: { message?: string } }).error?.message || "");
    if (/current|password|invalid/i.test(message)) {
      return NextResponse.json({ error: "The current password is not correct." }, { status: 400 });
    }
    return NextResponse.json({ error: "Could not change your password." }, { status: res.status });
  }
  return NextResponse.json({ ok: true });
}
