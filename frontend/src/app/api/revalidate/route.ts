import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { adminTokenAuthorized } from "@/lib/security";

export const dynamic = "force-dynamic";

// POST /api/revalidate
// Called by Strapi after content is published so the public site drops its
// cached CMS pages. Requires SEARCH_ADMIN_TOKEN in header x-reindex-token.
export async function POST(req: Request) {
  if (!adminTokenAuthorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  revalidateTag("strapi");
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, revalidated: true });
}
