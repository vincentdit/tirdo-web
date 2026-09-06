"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search as SearchIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Hit = { title: string; type: string; url: string; excerpt?: string; highlight?: string };
type Facet = { type: string; count: number };
type Suggestion = { title: string; type: string; url: string };

export function SearchClient() {
  const router = useRouter();
  const params = useSearchParams();

  const [input, setInput] = useState(params.get("q") ?? "");
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [type, setType] = useState<string | undefined>(params.get("type") ?? undefined);

  const [hits, setHits] = useState<Hit[] | null>(null);
  const [facets, setFacets] = useState<Facet[]>([]);
  const [total, setTotal] = useState(0);
  const [engine, setEngine] = useState<string>();
  const [loading, setLoading] = useState(false);

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggest, setShowSuggest] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  // Run a search and reflect it in the URL.
  const runSearch = useCallback(
    async (q: string, t?: string) => {
      const trimmed = q.trim();
      if (!trimmed) return;
      setLoading(true);
      setShowSuggest(false);
      const qs = new URLSearchParams({ q: trimmed });
      if (t) qs.set("type", t);
      router.replace(`/search?${qs.toString()}`, { scroll: false });
      try {
        const res = await fetch(`/api/search?${qs.toString()}`);
        const json = await res.json();
        setHits(json.hits ?? []);
        setFacets(json.facets ?? []);
        setTotal(json.total ?? (json.hits?.length ?? 0));
        setEngine(json.engine);
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  // Initial + back/forward: run whenever the URL query/type changes.
  useEffect(() => {
    const q = params.get("q") ?? "";
    const t = params.get("type") ?? undefined;
    setInput(q);
    setQuery(q);
    setType(t);
    if (q) runSearch(q, t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.get("q"), params.get("type")]);

  // Debounced autocomplete.
  useEffect(() => {
    if (input.trim().length < 2 || input.trim() === query) {
      setSuggestions([]);
      return;
    }
    const id = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search/suggest?q=${encodeURIComponent(input.trim())}`);
        const json = await res.json();
        setSuggestions(json.suggestions ?? []);
        setShowSuggest(true);
      } catch {
        setSuggestions([]);
      }
    }, 200);
    return () => clearTimeout(id);
  }, [input, query]);

  // Close the suggestion dropdown on outside click.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setShowSuggest(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(input);
    setType(undefined);
    runSearch(input, undefined);
  };

  const pickType = (t?: string) => {
    setType(t);
    runSearch(query || input, t);
  };

  const filterTypes = ["News", "Publication", "Project", "Service", "Department", "Event", "Page"];
  const orderedFacets = filterTypes
    .map((t) => facets.find((f) => f.type === t))
    .filter((f): f is Facet => !!f && f.count > 0);

  return (
    <div className="container-tirdo max-w-3xl">
      <div ref={boxRef} className="relative">
        <form onSubmit={onSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => suggestions.length && setShowSuggest(true)}
              placeholder="Search TIRDO…"
              className="w-full rounded-md border border-input bg-background py-3 pl-10 pr-9 text-sm outline-none focus:ring-2 focus:ring-ring"
              aria-label="Search"
              autoComplete="off"
            />
            {input && (
              <button
                type="button"
                onClick={() => { setInput(""); setSuggestions([]); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button type="submit" variant="accent" disabled={loading}>{loading ? "Searching…" : "Search"}</Button>
        </form>

        {showSuggest && suggestions.length > 0 && (
          <ul className="absolute z-20 mt-1 w-full overflow-hidden rounded-md border bg-background shadow-lg">
            {suggestions.map((s, i) => (
              <li key={i}>
                <Link
                  href={s.url}
                  className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm hover:bg-secondary/60"
                  onClick={() => setShowSuggest(false)}
                >
                  <span className="truncate">{s.title}</span>
                  <Badge variant="secondary" className="shrink-0">{s.type}</Badge>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {hits && (
        <div className="mt-8">
          {/* Type filters */}
          {orderedFacets.length > 0 && (
            <div className="mb-5 flex flex-wrap gap-2">
              <FilterChip active={!type} onClick={() => pickType(undefined)}>All ({total})</FilterChip>
              {orderedFacets.map((f) => (
                <FilterChip key={f.type} active={type === f.type} onClick={() => pickType(f.type)}>
                  {f.type} ({f.count})
                </FilterChip>
              ))}
            </div>
          )}

          <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
            <span>{hits.length} result{hits.length !== 1 && "s"}{type ? ` in ${type}` : ""}</span>
            {engine && <span className="text-xs">via {engine === "opensearch" ? "OpenSearch" : "local index"}</span>}
          </div>

          <ul className="divide-y rounded-xl border">
            {hits.map((h, i) => (
              <li key={i} className="p-4 hover:bg-secondary/40">
                <Link href={h.url} className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold text-primary">{h.title}</div>
                    {h.highlight ? (
                      <p
                        className="mt-1 text-sm text-muted-foreground [&_mark]:bg-brand-gold/40 [&_mark]:text-foreground"
                        dangerouslySetInnerHTML={{ __html: h.highlight }}
                      />
                    ) : (
                      h.excerpt && <p className="mt-1 text-sm text-muted-foreground">{h.excerpt}</p>
                    )}
                  </div>
                  <Badge variant="secondary" className="shrink-0">{h.type}</Badge>
                </Link>
              </li>
            ))}
            {hits.length === 0 && (
              <li className="p-6 text-center text-sm text-muted-foreground">
                No results found{query ? ` for “${query}”` : ""}.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "rounded-full border px-3 py-1 text-xs font-medium transition-colors " +
        (active
          ? "border-brand-teal bg-brand-teal text-white"
          : "border-input bg-background text-muted-foreground hover:border-brand-teal hover:text-brand-teal")
      }
    >
      {children}
    </button>
  );
}
