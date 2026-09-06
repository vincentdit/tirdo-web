import { NextResponse } from "next/server";
import { ensurePopulated, suggest, gatherDocuments, type SearchHit } from "@/lib/search";

export const dynamic = "force-dynamic";

// Autocomplete suggestions for the search-as-you-type box. Prefix match on
// titles via OpenSearch, with a local title-scan fallback.
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return NextResponse.json({ suggestions: [] });

  try {
    await ensurePopulated();
    const suggestions = await suggest(q);
    if (suggestions.length) return NextResponse.json({ suggestions });
  } catch {
    // fall through
  }

  const needle = q.toLowerCase();
  const docs = await gatherDocuments();
  const suggestions: SearchHit[] = docs
    .filter((d) => d.title.toLowerCase().includes(needle))
    .slice(0, 6)
    .map((d) => ({ title: d.title, type: d.type, url: d.url }));
  return NextResponse.json({ suggestions });
}
