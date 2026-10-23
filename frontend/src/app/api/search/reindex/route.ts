import { NextResponse } from "next/server";
import { reindexAll, indexStatus } from "@/lib/search";
import { adminTokenAuthorized } from "@/lib/security";

export const dynamic = "force-dynamic";

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

// GET  /api/search/reindex  -> report index status (exists, doc count)
// POST /api/search/reindex  -> rebuild the index from all content
// Both require SEARCH_ADMIN_TOKEN via x-reindex-token (never a query string).
export async function GET(req: Request) {
  if (!adminTokenAuthorized(req)) return unauthorized();
  const status = await indexStatus();
  return NextResponse.json(status);
}

export async function POST(req: Request) {
  if (!adminTokenAuthorized(req)) return unauthorized();
  const result = await reindexAll();
  return NextResponse.json(result, { status: result.ok ? 200 : 502 });
}
