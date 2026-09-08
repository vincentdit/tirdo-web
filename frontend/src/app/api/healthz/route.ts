import { NextResponse } from "next/server";

// Liveness probe — cheap and dependency-free. Returns 200 whenever the Next.js
// server is up. Used by the container healthcheck and uptime monitors.
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    { status: "ok", service: "tirdo-frontend", time: new Date().toISOString() },
    { headers: { "Cache-Control": "no-store" } }
  );
}
