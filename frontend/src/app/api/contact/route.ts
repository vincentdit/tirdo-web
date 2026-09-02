import { NextResponse } from "next/server";

const STRAPI = process.env.STRAPI_INTERNAL_URL || "http://cms:1337";

// Forwards contact submissions to Strapi (contact-messages collection).
// Always returns 200 to the user; logs failures server-side.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body ?? {};
    if (!name || !email || !message) {
      return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
    }

    try {
      await fetch(`${STRAPI}/api/contact-messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: { name, email, subject, message } }),
        signal: AbortSignal.timeout(4000),
      });
    } catch (e) {
      // CMS not ready — accept the message anyway so the UX doesn't break.
      console.warn("[contact] could not persist to Strapi:", e);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
