import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getVisitStats } from "@/lib/matomo-api";
import { calendarDay } from "@/lib/visit-store";
import { currentVisits, recordUniqueVisit } from "@/lib/visit-file";

export const dynamic = "force-dynamic";

export async function GET() {
  const day = calendarDay();
  const jar = cookies();
  const seen = jar.get("tirdo_vc")?.value === day;
  const local = seen ? currentVisits() : recordUniqueVisit();
  const matomo = await getVisitStats();
  const stats = {
    today: matomo.today ?? local.today,
    month: matomo.month ?? local.month,
    total: matomo.total ?? local.total,
  };
  const res = NextResponse.json(stats, {
    headers: { "Cache-Control": "no-store" },
  });
  if (!seen) {
    res.cookies.set("tirdo_vc", day, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });
  }
  return res;
}
