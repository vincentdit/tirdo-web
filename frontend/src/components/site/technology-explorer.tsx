"use client";

import { useMemo, useState } from "react";
import { TechnologyCard } from "@/components/site/cards";
import { Chip } from "@/components/site/filter-chips";
import { technologySectors, technologyMaturities, type Technology } from "@/lib/content";

// Client-side filtering of the technology catalogue by sector and maturity.
export function TechnologyExplorer({ technologies }: { technologies: Technology[] }) {
  const [sector, setSector] = useState<string | undefined>();
  const [maturity, setMaturity] = useState<string | undefined>();

  const availableSectors = useMemo(() => {
    const present = new Set(technologies.map((t) => t.sector));
    return technologySectors.filter((s) => present.has(s.slug));
  }, [technologies]);
  const availableMaturities = useMemo(
    () => technologyMaturities.filter((m) => technologies.some((t) => t.maturity === m)),
    [technologies]
  );

  const filtered = technologies.filter(
    (t) => (!sector || t.sector === sector) && (!maturity || t.maturity === maturity)
  );

  return (
    <div className="space-y-6">
      <div className="space-y-3 rounded-xl border bg-secondary/30 p-4">
        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Sector</div>
          <div className="flex flex-wrap gap-2">
            <Chip active={!sector} onClick={() => setSector(undefined)}>All sectors</Chip>
            {availableSectors.map((s) => (
              <Chip key={s.slug} active={sector === s.slug} onClick={() => setSector(s.slug)}>{s.name}</Chip>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Maturity</div>
          <div className="flex flex-wrap gap-2">
            <Chip active={!maturity} onClick={() => setMaturity(undefined)}>All</Chip>
            {availableMaturities.map((m) => (
              <Chip key={m} active={maturity === m} onClick={() => setMaturity(m)}>{m}</Chip>
            ))}
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        {filtered.length} technolog{filtered.length !== 1 ? "ies" : "y"}
      </p>

      {filtered.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <div key={t.slug} id={t.slug} className="scroll-mt-28">
              <TechnologyCard item={t} />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border p-10 text-center text-sm text-muted-foreground">
          No technologies match these filters.
        </div>
      )}
    </div>
  );
}
