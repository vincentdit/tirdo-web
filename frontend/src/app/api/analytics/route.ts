import { NextResponse } from "next/server";
import { getVisitStats } from "@/lib/matomo-api";

// Lightweight endpoint for the footer visitor widget (today / this month /
// total). Rendered at request time (runtime token); browsers cache 15 min.
export const dynamic = "force-dynamic";

export async function GET() {
  const stats = await getVisitStats();
  return NextResponse.json(stats, {
    headers: { "Cache-Control": "public, max-age=900, stale-while-revalidate=3600" },
  });
}
