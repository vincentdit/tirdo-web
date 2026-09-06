import { NextResponse } from "next/server";
import { reindexAll, indexStatus } from "@/lib/search";

export const dynamic = "force-dynamic";

// GET  /api/search/reindex  -> report index status (exists, doc count)
// POST /api/search/reindex  -> rebuild the index from all content
//
// When SEARCH_ADMIN_TOKEN is set, POST requires a matching x-reindex-token
// header (or ?token=). Call this after CMS content changes; a scheduled task
// or a Strapi webhook can hit it to keep search fresh.
export async function GET() {
  const status = await indexStatus();
  return NextResponse.json(status);
}

export async function POST(req: Request) {
  const required = process.env.SEARCH_ADMIN_TOKEN;
  if (required) {
    const provided = req.headers.get("x-reindex-token") || new URL(req.url).searchParams.get("token");
    if (provided !== required) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }
  const result = await reindexAll();
  return NextResponse.json(result, { status: result.ok ? 200 : 502 });
}
