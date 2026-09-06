"use client";

import { useMemo, useState } from "react";
import { FileText, CalendarClock, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Chip } from "@/components/site/filter-chips";
import { isOpen, type Tender } from "@/lib/content";

function fmt(d: string) {
  const date = new Date(d);
  return isNaN(date.getTime()) ? d : date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// Tenders list with category filter and auto-archive by closing date.
export function TendersExplorer({ tenders }: { tenders: Tender[] }) {
  const [category, setCategory] = useState<string | undefined>();
  const [showClosed, setShowClosed] = useState(false);

  const categories = useMemo(() => Array.from(new Set(tenders.map((t) => t.category))).sort(), [tenders]);
  const openCount = useMemo(() => tenders.filter((t) => isOpen(t.closingDate)).length, [tenders]);

  const filtered = tenders.filter((t) => {
    if (!showClosed && !isOpen(t.closingDate)) return false;
    if (category && t.category !== category) return false;
    return true;
  });

  if (tenders.length === 0) {
    return <p className="text-foreground/80">There are currently no active tenders listed.</p>;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <Chip active={!category} onClick={() => setCategory(undefined)}>All</Chip>
          {categories.map((c) => (
            <Chip key={c} active={category === c} onClick={() => setCategory(c)}>{c}</Chip>
          ))}
        </div>
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <input type="checkbox" checked={showClosed} onChange={(e) => setShowClosed(e.target.checked)} className="accent-brand-teal" />
          Include closed ({tenders.length - openCount})
        </label>
      </div>

      <p className="text-sm text-muted-foreground">
        {filtered.length} tender{filtered.length !== 1 && "s"}{!showClosed ? " open" : ""}
      </p>

      <div className="overflow-hidden rounded-xl border">
        <table className="w-full text-left text-sm">
          <thead className="bg-secondary text-primary">
            <tr>
              <th className="px-5 py-3 font-semibold">Tender</th>
              <th className="hidden px-5 py-3 font-semibold md:table-cell">Reference</th>
              <th className="px-5 py-3 font-semibold">Closing</th>
              <th className="px-5 py-3 text-right font-semibold">Document</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((t) => {
              const open = isOpen(t.closingDate);
              return (
                <tr key={t.slug} id={t.slug} className="scroll-mt-28 align-top hover:bg-secondary/40">
                  <td className="px-5 py-4">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">{t.category}</Badge>
                      <Badge variant={open ? "accent" : "outline"}>{open ? "Open" : "Closed"}</Badge>
                    </div>
                    <div className="flex items-start gap-2 font-medium text-primary">
                      <FileText className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> {t.title}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{t.description}</p>
                    <span className="mt-1 block text-xs text-muted-foreground md:hidden">Ref: {t.reference}</span>
                  </td>
                  <td className="hidden px-5 py-4 text-xs text-muted-foreground md:table-cell">{t.reference}</td>
                  <td className="px-5 py-4 text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><CalendarClock className="h-3.5 w-3.5" /> {fmt(t.closingDate)}</span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    {t.documentUrl ? (
                      <a href={t.documentUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-accent hover:underline">
                        <Download className="h-4 w-4" /> PDF
                      </a>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={4} className="px-5 py-10 text-center text-sm text-muted-foreground">No {category ? `${category.toLowerCase()} ` : ""}tenders are currently open.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
