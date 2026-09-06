import { NextResponse } from "next/server";
import {
  gatherDocuments,
  ensurePopulated,
  searchContent,
  type SearchHit,
  type Facet,
} from "@/lib/search";

export const dynamic = "force-dynamic";

// Local fallback: scan the gathered documents when OpenSearch is unavailable.
async function localResults(q: string, type?: string): Promise<{ hits: SearchHit[]; total: number; facets: Facet[] }> {
  const needle = q.toLowerCase();
  const docs = await gatherDocuments();
  const matched = docs.filter(
    (d) =>
      d.title.toLowerCase().includes(needle) ||
      d.excerpt?.toLowerCase().includes(needle) ||
      d.body?.toLowerCase().includes(needle)
  );
  const counts = new Map<string, number>();
  for (const m of matched) counts.set(m.type, (counts.get(m.type) ?? 0) + 1);
  const facets: Facet[] = [...counts.entries()].map(([t, count]) => ({ type: t, count })).sort((a, b) => b.count - a.count);
  const filtered = type ? matched.filter((m) => m.type === type) : matched;
  const hits: SearchHit[] = filtered.map((d) => ({ title: d.title, type: d.type, url: d.url, excerpt: d.excerpt }));
  return { hits, total: hits.length, facets };
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.trim() ?? "";
  const type = url.searchParams.get("type")?.trim() || undefined;
  const from = Math.max(0, parseInt(url.searchParams.get("from") ?? "0", 10) || 0);
  if (!q) return NextResponse.json({ hits: [], total: 0, facets: [], engine: "none" });

  // Try OpenSearch (self-populating on first use), then fall back to local.
  try {
    await ensurePopulated();
    const result = await searchContent(q, { type, from });
    if (result) return NextResponse.json({ ...result, engine: "opensearch" });
  } catch {
    // fall through
  }

  const local = await localResults(q, type);
  return NextResponse.json({ ...local, engine: "local" });
}
