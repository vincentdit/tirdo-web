import { NextRequest, NextResponse } from "next/server";
import { cmsBase, isAdminEmail } from "@/lib/portal";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email || "").trim();
  if (!isAdminEmail(email)) {
    return NextResponse.json(
      { error: "Enter the email address of your TIRDO administrator account." },
      { status: 400 }
    );
  }

  try {
    await fetch(`${cmsBase()}/admin/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
      cache: "no-store",
      signal: AbortSignal.timeout(12000),
    });
  } catch {
    // Always return the same message so this endpoint cannot be used to probe accounts.
  }

  return NextResponse.json({
    ok: true,
    message:
      "If an account exists for that address, TIRDO Content Manager will send a password reset link. It can take a few minutes to arrive.",
  });
}
