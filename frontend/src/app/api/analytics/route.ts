import { NextResponse } from "next/server";
import { getTotalVisits } from "@/lib/matomo-api";

// Lightweight endpoint for the footer visitor counter. Rendered at request
// time (runtime token); browsers cache the response for 15 minutes.
export const dynamic = "force-dynamic";

export async function GET() {
  const totalVisits = await getTotalVisits();
  return NextResponse.json(
    { totalVisits },
    { headers: { "Cache-Control": "public, max-age=900, stale-while-revalidate=3600" } },
  );
}
