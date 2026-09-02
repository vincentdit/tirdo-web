import { NextResponse } from "next/server";
import { news, projects, publications, services, departments } from "@/lib/content";

const OS_NODE = process.env.OPENSEARCH_NODE || "http://opensearch:9200";
const OS_INDEX = process.env.OPENSEARCH_INDEX || "tirdo-content";

export type SearchHit = { title: string; type: string; url: string; excerpt?: string };

// Local fallback index built from bundled content.
function localIndex(): SearchHit[] {
  return [
    ...news.map((n) => ({ title: n.title, type: "News", url: `/news/${n.slug}`, excerpt: n.excerpt })),
    ...projects.map((p) => ({ title: p.title, type: "Project", url: `/projects#${p.slug}`, excerpt: p.summary })),
    ...publications.map((p) => ({ title: p.title, type: "Publication", url: `/publications`, excerpt: `${p.type} · ${p.year}` })),
    ...services.map((s) => ({ title: s.title, type: "Service", url: `/services/${s.slug}`, excerpt: s.description })),
    ...departments.map((d) => ({ title: d.title, type: "Department", url: `/departments/${d.slug}`, excerpt: d.blurb })),
  ];
}

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q")?.trim() ?? "";
  if (!q) return NextResponse.json({ hits: [] });

  // Try OpenSearch first.
  try {
    const res = await fetch(`${OS_NODE}/${OS_INDEX}/_search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        size: 20,
        query: { multi_match: { query: q, fields: ["title^3", "excerpt", "body"], fuzziness: "AUTO" } },
      }),
      signal: AbortSignal.timeout(3000),
    });
    if (res.ok) {
      const json = await res.json();
      const hits: SearchHit[] = (json.hits?.hits ?? []).map((h: any) => ({
        title: h._source.title,
        type: h._source.type ?? "Content",
        url: h._source.url ?? "#",
        excerpt: h._source.excerpt,
      }));
      if (hits.length) return NextResponse.json({ hits, engine: "opensearch" });
    }
  } catch {
    // fall through to local
  }

  // Fallback: simple case-insensitive match over bundled content.
  const needle = q.toLowerCase();
  const hits = localIndex().filter(
    (h) => h.title.toLowerCase().includes(needle) || h.excerpt?.toLowerCase().includes(needle)
  );
  return NextResponse.json({ hits, engine: "local" });
}
