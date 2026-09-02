"use client";

import { useState } from "react";
import Link from "next/link";
import { Search as SearchIcon } from "lucide-react";
import { PageBanner } from "@/components/site/page-banner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { SearchHit } from "@/app/api/search/route";

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<SearchHit[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [engine, setEngine] = useState<string>();

  async function run(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    setLoading(true);
    const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
    const json = await res.json();
    setHits(json.hits);
    setEngine(json.engine);
    setLoading(false);
  }

  return (
    <>
      <PageBanner title="Search" subtitle="Find news, publications, projects, services and departments." crumbs={[{ label: "Search" }]} />
      <section className="py-14">
        <div className="container-tirdo max-w-3xl">
          <form onSubmit={run} className="flex gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search TIRDO…"
                className="w-full rounded-md border border-input bg-background py-3 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <Button type="submit" variant="accent" disabled={loading}>{loading ? "Searching…" : "Search"}</Button>
          </form>

          {hits && (
            <div className="mt-8">
              <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
                <span>{hits.length} result{hits.length !== 1 && "s"}</span>
                {engine && <span className="text-xs">via {engine === "opensearch" ? "OpenSearch" : "local index"}</span>}
              </div>
              <ul className="divide-y rounded-xl border">
                {hits.map((h, i) => (
                  <li key={i} className="p-4 hover:bg-secondary/40">
                    <Link href={h.url} className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold text-primary">{h.title}</div>
                        {h.excerpt && <p className="mt-1 text-sm text-muted-foreground">{h.excerpt}</p>}
                      </div>
                      <Badge variant="secondary" className="shrink-0">{h.type}</Badge>
                    </Link>
                  </li>
                ))}
                {hits.length === 0 && <li className="p-6 text-center text-sm text-muted-foreground">No results found.</li>}
              </ul>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
