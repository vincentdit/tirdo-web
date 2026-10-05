import { NextResponse } from "next/server";

const STRAPI = process.env.STRAPI_INTERNAL_URL || "http://cms:1337";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TYPES = ["Compliment", "Complaint", "Suggestion", "Enquiry"];
const clamp = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

// Forwards stakeholder feedback to Strapi (feedbacks collection), where a
// lifecycle hook emails TIRDO staff. Validates input and drops bot
// submissions via a honeypot. Returns 200 on success.
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    if (body?.company) return NextResponse.json({ ok: true }); // honeypot

    const name = clamp(body?.name, 120);
    const email = clamp(body?.email, 160);
    const message = clamp(body?.message, 5000);
    const organization = clamp(body?.organization, 160);
    const serviceArea = clamp(body?.serviceArea, 120);
    const subject = clamp(body?.subject, 200);
    let feedbackType = clamp(body?.feedbackType, 40);
    if (!TYPES.includes(feedbackType)) feedbackType = "Suggestion";
    const ratingNum = Number(body?.rating);
    const rating = Number.isInteger(ratingNum) && ratingNum >= 1 && ratingNum <= 5 ? ratingNum : undefined;

    if (!name || !email || !message) {
      return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
    }

    try {
      await fetch(`${STRAPI}/api/feedbacks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: { name, email, organization, serviceArea, subject, message, feedbackType, ...(rating ? { rating } : {}) } }),
        signal: AbortSignal.timeout(4000),
      });
    } catch (e) {
      console.warn("[feedback] could not persist to Strapi:", e);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
