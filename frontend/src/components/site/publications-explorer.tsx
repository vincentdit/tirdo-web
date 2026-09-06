"use client";

import { useMemo, useState } from "react";
import { FileText, Download, Search as SearchIcon, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Chip } from "@/components/site/filter-chips";
import type { Publication } from "@/lib/content";

// Publications library with type + year filters, keyword search and expandable
// metadata (abstract, authors, keywords, DOI, citation).
export function PublicationsExplorer({ publications }: { publications: Publication[] }) {
  const [type, setType] = useState<string | undefined>();
  const [year, setYear] = useState<number | undefined>();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const types = useMemo(() => Array.from(new Set(publications.map((p) => p.type))).sort(), [publications]);
  const years = useMemo(() => Array.from(new Set(publications.map((p) => p.year))).sort((a, b) => b - a), [publications]);

  const needle = q.trim().toLowerCase();
  const filtered = publications.filter((p) => {
    if (type && p.type !== type) return false;
    if (year && p.year !== year) return false;
    if (needle) {
      const hay = [p.title, p.abstract, p.authors, p.type, ...(p.keywords ?? [])].filter(Boolean).join(" ").toLowerCase();
      if (!hay.includes(needle)) return false;
    }
    return true;
  });

  const hasMeta = (p: Publication) => !!(p.abstract || p.authors || (p.keywords && p.keywords.length) || p.doi || p.citation);

  return (
    <div className="space-y-6">
      <div className="relative max-w-md">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search titles, authors, keywords…"
          className="w-full rounded-md border border-input bg-background py-2.5 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          aria-label="Search publications"
        />
      </div>

      <div className="space-y-3 rounded-xl border bg-secondary/30 p-4">
        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Type</div>
          <div className="flex flex-wrap gap-2">
            <Chip active={!type} onClick={() => setType(undefined)}>All</Chip>
            {types.map((t) => (
              <Chip key={t} active={type === t} onClick={() => setType(t)}>{t}</Chip>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Year</div>
          <div className="flex flex-wrap gap-2">
            <Chip active={!year} onClick={() => setYear(undefined)}>All</Chip>
            {years.map((y) => (
              <Chip key={y} active={year === y} onClick={() => setYear(y)}>{y}</Chip>
            ))}
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">{filtered.length} publication{filtered.length !== 1 && "s"}</p>

      <div className="overflow-hidden rounded-xl border">
        <table className="w-full text-left text-sm">
          <thead className="bg-secondary text-primary">
            <tr>
              <th className="px-5 py-3 font-semibold">Title</th>
              <th className="hidden px-5 py-3 font-semibold sm:table-cell">Type</th>
              <th className="hidden px-5 py-3 font-semibold sm:table-cell">Year</th>
              <th className="px-5 py-3 text-right font-semibold">Download</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((p) => {
              const expandable = hasMeta(p);
              const isOpen = open === p.slug;
              return (
                <tr key={p.slug} id={p.slug} className="scroll-mt-28 align-top hover:bg-secondary/40">
                  <td className="px-5 py-4" colSpan={1}>
                    <button
                      type="button"
                      onClick={() => expandable && setOpen(isOpen ? null : p.slug)}
                      className={"flex items-start gap-2 text-left font-medium text-primary " + (expandable ? "cursor-pointer" : "cursor-default")}
                      aria-expanded={isOpen}
                    >
                      <FileText className="mt-0.5 h-4 w-4 shrink-0 text-brand-teal" />
                      <span>
                        {p.title}
                        {p.authors && <span className="block text-xs font-normal text-muted-foreground">{p.authors}</span>}
                        <span className="mt-1 flex flex-wrap items-center gap-2 sm:hidden">
                          <Badge variant="secondary">{p.type}</Badge>
                          <span className="text-xs text-muted-foreground">{p.year}</span>
                        </span>
                      </span>
                      {expandable && <ChevronDown className={"ml-1 mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform " + (isOpen ? "rotate-180" : "")} />}
                    </button>

                    {expandable && isOpen && (
                      <div className="mt-3 space-y-2 border-l-2 border-brand-teal/40 pl-3 text-sm text-muted-foreground">
                        {p.abstract && <p>{p.abstract}</p>}
                        {p.keywords && p.keywords.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {p.keywords.map((k) => <Badge key={k} variant="outline">{k}</Badge>)}
                          </div>
                        )}
                        {p.doi && (
                          <p>DOI: <a href={`https://doi.org/${p.doi}`} className="text-brand-teal hover:underline" target="_blank" rel="noreferrer">{p.doi}</a></p>
                        )}
                        {p.citation && <p className="italic">{p.citation}</p>}
                      </div>
                    )}
                  </td>
                  <td className="hidden px-5 py-4 sm:table-cell"><Badge variant="secondary">{p.type}</Badge></td>
                  <td className="hidden px-5 py-4 text-muted-foreground sm:table-cell">{p.year}</td>
                  <td className="px-5 py-4 text-right">
                    <a href={p.fileUrl ?? "#"} className="inline-flex items-center gap-1 text-brand-teal hover:underline" target="_blank" rel="noreferrer">
                      <Download className="h-4 w-4" /> PDF
                    </a>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={4} className="px-5 py-10 text-center text-sm text-muted-foreground">No publications match these filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
