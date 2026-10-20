import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// POST /api/revalidate
// Called by Strapi after content is published so the public site drops its
// cached CMS pages. When SEARCH_ADMIN_TOKEN is set, require the same header
// as /api/search/reindex (x-reindex-token or ?token=).
export async function POST(req: Request) {
  const required = process.env.SEARCH_ADMIN_TOKEN;
  if (required) {
    const provided = req.headers.get("x-reindex-token") || new URL(req.url).searchParams.get("token");
    if (provided !== required) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  revalidateTag("strapi");
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, revalidated: true });
}
