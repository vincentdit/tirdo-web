"use client";

import { useMemo, useState } from "react";
import { Briefcase, MapPin, CalendarClock, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Chip } from "@/components/site/filter-chips";
import { isOpen, type Vacancy } from "@/lib/content";

function fmt(d: string) {
  const date = new Date(d);
  return isNaN(date.getTime()) ? d : date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// Vacancies list with category filter and auto-archive: closed positions
// (past their closing date) are hidden unless "Include closed" is toggled on.
export function VacanciesExplorer({ vacancies }: { vacancies: Vacancy[] }) {
  const [category, setCategory] = useState<string | undefined>();
  const [showClosed, setShowClosed] = useState(false);

  const categories = useMemo(() => Array.from(new Set(vacancies.map((v) => v.category))).sort(), [vacancies]);
  const openCount = useMemo(() => vacancies.filter((v) => isOpen(v.closingDate)).length, [vacancies]);

  const filtered = vacancies.filter((v) => {
    if (!showClosed && !isOpen(v.closingDate)) return false;
    if (category && v.category !== category) return false;
    return true;
  });

  if (vacancies.length === 0) {
    return (
      <p className="text-foreground/80">
        There are currently no open positions listed. New vacancies will be published here and managed through the CMS.
      </p>
    );
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
          Include closed ({vacancies.length - openCount})
        </label>
      </div>

      <p className="text-sm text-muted-foreground">
        {filtered.length} position{filtered.length !== 1 && "s"}{!showClosed ? " open" : ""}
      </p>

      <div className="space-y-3">
        {filtered.map((v) => {
          const open = isOpen(v.closingDate);
          return (
            <article key={v.slug} id={v.slug} className="scroll-mt-28 rounded-xl border p-5 transition-shadow hover:shadow-md">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{v.category}</Badge>
                    <Badge variant={open ? "accent" : "outline"}>{open ? "Open" : "Closed"}</Badge>
                  </div>
                  <h3 className="flex items-center gap-2 font-semibold text-primary">
                    <Briefcase className="h-4 w-4 text-accent" /> {v.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{v.description}</p>
                  {v.body && v.body.length > 0 && (
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                      {v.body.map((b, i) => <li key={i}>{b}</li>)}
                    </ul>
                  )}
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
                    <span>{v.department}</span>
                    <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {v.location}</span>
                    <span className="inline-flex items-center gap-1"><CalendarClock className="h-3.5 w-3.5" /> Closes {fmt(v.closingDate)}</span>
                  </div>
                </div>
                {open && v.applyUrl && (
                  <a
                    href={v.applyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-brand-gold px-3 py-2 text-sm font-bold text-brand-ink hover:brightness-95"
                  >
                    Apply <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </article>
          );
        })}
        {filtered.length === 0 && (
          <div className="rounded-xl border p-8 text-center text-sm text-muted-foreground">
            No {category ? `${category.toLowerCase()} ` : ""}positions are currently open.
          </div>
        )}
      </div>
    </div>
  );
}
