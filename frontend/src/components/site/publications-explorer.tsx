"use client";
import { useEffect, useMemo, useState } from "react";
import { Download, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/site/filter-chips";
import { PublicationPreview } from "@/components/site/publication-preview";
import type { Publication } from "@/lib/content";

export function PublicationsExplorer({ publications }: { publications: Publication[] }) {
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const [year, setYear] = useState("all");
  const [preview, setPreview] = useState<Publication | null>(null);

  const types = useMemo(() => Array.from(new Set(publications.map((p) => p.type))).sort(), [publications]);
  const years = useMemo(() => Array.from(new Set(publications.map((p) => p.year))).sort((a, b) => b - a), [publications]);

  const filtered = publications.filter((p) => {
    const hay = `${p.title} ${p.type} ${p.year} ${p.abstract ?? ""} ${p.authors ?? ""} ${(p.keywords ?? []).join(" ")}`.toLowerCase();
    const matchQ = !q || hay.includes(q.toLowerCase());
    const matchT = type === "all" || p.type === type;
    const matchY = year === "all" || String(p.year) === year;
    return matchQ && matchT && matchY;
  });

  useEffect(() => {
    const openFromHash = () => {
      const id = window.location.hash.replace(/^#/, "");
      if (!id) return;
      const found = publications.find((p) => p.slug === id);
      if (found) setPreview(found);
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, [publications]);

  useEffect(() => {
    if (!preview) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPreview(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [preview]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search title, author, keyword…"
            aria-label="Search publications"
            className="h-11 w-full rounded-lg border bg-white pl-10 pr-3 text-sm outline-none ring-brand-gold/40 focus:ring-2"
          />
        </div>
        <p className="text-xs text-muted-foreground sm:max-w-[14rem]">Click a title to preview before you download.</p>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Type</span>
        <Chip active={type === "all"} onClick={() => setType("all")}>All</Chip>
        {types.map((t) => (
          <Chip key={t} active={type === t} onClick={() => setType(t)}>{t}</Chip>
        ))}
      </div>
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Year</span>
        <Chip active={year === "all"} onClick={() => setYear("all")}>All</Chip>
        {years.map((y) => (
          <Chip key={y} active={year === String(y)} onClick={() => setYear(String(y))}>{y}</Chip>
        ))}
      </div>

      <p className="mb-3 text-sm text-muted-foreground">{filtered.length} publication{filtered.length === 1 ? "" : "s"}</p>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b bg-secondary/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-semibold">Title</th>
              <th className="px-5 py-3 font-semibold">Type</th>
              <th className="px-5 py-3 font-semibold">Year</th>
              <th className="px-5 py-3 font-semibold">File</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={4} className="px-5 py-10 text-center text-sm text-muted-foreground">No publications match these filters.</td></tr>
            ) : filtered.map((p) => (
              <tr key={p.slug} id={p.slug} className="border-b last:border-0 hover:bg-secondary/30">
                <td className="px-5 py-3">
                  <button
                    type="button"
                    onClick={() => setPreview(p)}
                    className="text-left font-medium text-primary underline-offset-2 hover:text-brand-teal hover:underline"
                  >
                    {p.title}
                  </button>
                </td>
                <td className="px-5 py-3 text-muted-foreground">{p.type}</td>
                <td className="px-5 py-3 text-muted-foreground">{p.year}</td>
                <td className="px-5 py-3">
                  {p.fileUrl ? (
                    <a href={p.fileUrl} className="inline-flex items-center gap-1 text-brand-teal hover:underline" download>
                      <Download className="h-4 w-4" /> Download
                    </a>
                  ) : (
                    <button type="button" onClick={() => setPreview(p)} className="text-muted-foreground hover:text-brand-teal hover:underline">
                      Preview
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {preview ? (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-10 sm:pt-16"
          onClick={() => setPreview(null)}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="publication-preview-title"
            className="relative mb-10 w-full max-w-4xl rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <h2 id="publication-preview-title" className="font-heading text-xl font-bold text-primary">{preview.title}</h2>
              <Button type="button" variant="ghost" size="icon" aria-label="Close preview" onClick={() => setPreview(null)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <PublicationPreview publication={preview} compact />
          </div>
        </div>
      ) : null}
    </div>
  );
}
