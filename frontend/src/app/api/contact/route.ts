import { NextResponse } from "next/server";

const STRAPI = process.env.STRAPI_INTERNAL_URL || "http://cms:1337";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clamp = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

// Forwards contact submissions to Strapi (contact-messages collection), where
// a lifecycle hook emails TIRDO staff. Validates input and drops obvious bot
// submissions via a honeypot. Returns 200 on success; logs failures server-side.
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    // Honeypot: real users never fill the hidden "company" field. Silently
    // accept (so bots don't learn) but do not persist.
    if (body?.company) return NextResponse.json({ ok: true });

    const name = clamp(body?.name, 120);
    const email = clamp(body?.email, 160);
    const subject = clamp(body?.subject, 200);
    const message = clamp(body?.message, 5000);
    const phone = clamp(body?.phone, 40);
    const organization = clamp(body?.organization, 160);

    if (!name || !email || !message) {
      return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
    }

    try {
      await fetch(`${STRAPI}/api/contact-messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: { name, email, subject, message, phone, organization } }),
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
