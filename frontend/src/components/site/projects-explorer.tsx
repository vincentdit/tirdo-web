"use client";

import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/site/cards";
import { Chip } from "@/components/site/filter-chips";
import { researchAreas, projectAreaSlug, type Project } from "@/lib/content";

const STATUSES = ["Featured", "Ongoing", "Completed"] as const;

// Client-side filtering of research projects by research area and status.
export function ProjectsExplorer({ projects }: { projects: Project[] }) {
  const [area, setArea] = useState<string | undefined>();
  const [status, setStatus] = useState<string | undefined>();

  // Only show areas/statuses that actually have projects.
  const availableAreas = useMemo(() => {
    const present = new Set(projects.map((p) => projectAreaSlug(p)).filter(Boolean) as string[]);
    return researchAreas.filter((a) => present.has(a.slug));
  }, [projects]);
  const availableStatuses = useMemo(
    () => STATUSES.filter((s) => projects.some((p) => p.status === s)),
    [projects]
  );

  const filtered = projects.filter(
    (p) => (!area || projectAreaSlug(p) === area) && (!status || p.status === status)
  );

  return (
    <div className="space-y-6">
      <div className="space-y-3 rounded-xl border bg-secondary/30 p-4">
        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Research area</div>
          <div className="flex flex-wrap gap-2">
            <Chip active={!area} onClick={() => setArea(undefined)}>All areas</Chip>
            {availableAreas.map((a) => (
              <Chip key={a.slug} active={area === a.slug} onClick={() => setArea(a.slug)}>{a.name}</Chip>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</div>
          <div className="flex flex-wrap gap-2">
            <Chip active={!status} onClick={() => setStatus(undefined)}>All</Chip>
            {availableStatuses.map((s) => (
              <Chip key={s} active={status === s} onClick={() => setStatus(s)}>{s}</Chip>
            ))}
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        {filtered.length} project{filtered.length !== 1 && "s"}
      </p>

      {filtered.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <div key={p.slug} id={p.slug} className="scroll-mt-28">
              <ProjectCard item={p} />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border p-10 text-center text-sm text-muted-foreground">
          No projects match these filters.
        </div>
      )}
    </div>
  );
}
