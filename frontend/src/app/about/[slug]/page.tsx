import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { PageBanner } from "@/components/site/page-banner";
import { UnitsGrid } from "@/components/site/units-grid";
import { Card, CardContent } from "@/components/ui/card";
import {
  board, topManagement, successStories, comsats, comsatsObjectives,
  comsatsActivities, orgStructure, managementUnits, type Leader,
} from "@/lib/content";

const meta: Record<string, { title: string; subtitle: string }> = {
  "mission-vision": { title: "Mission & Vision", subtitle: "Our purpose, aspiration and values" },
  structure: { title: "Organization Structure", subtitle: "How TIRDO is organised" },
  board: { title: "Board of Directors", subtitle: "Governance and oversight" },
  administration: { title: "Administration", subtitle: "TIRDO top management" },
  "success-stories": { title: "Success Stories", subtitle: "Impact from the laboratory to industry" },
  comsats: { title: "COMSATS Centre for Climate & Sustainability", subtitle: "International science & technology cooperation" },
};

export function generateStaticParams() {
  return Object.keys(meta).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  return { title: meta[params.slug]?.title ?? "About" };
}

function initials(name: string) {
  return name.replace(/^(Prof\.|Eng\.|Ms\.|Mr\.|Dr\.)\s*/, "").split(" ").map((w) => w[0]).slice(0, 2).join("");
}

// Portrait card for the governance tree (photo when available, initials otherwise).
function PortraitCard({ l, featured = false }: { l: Leader; featured?: boolean }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className={`overflow-hidden rounded-lg border border-black/5 shadow-sm ${featured ? "h-56 w-48" : "h-44 w-40"}`}>
        {l.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={l.photo} alt={l.name} className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full w-full place-items-center bg-gradient-to-b from-brand-pale to-secondary/70 text-3xl font-bold text-brand-teal/50">
            {initials(l.name)}
          </div>
        )}
      </div>
      <div className="mt-3 max-w-[12rem] text-sm font-bold leading-snug text-brand-ink">{l.name}</div>
      <div className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-brand-teal">{l.role}</div>
    </div>
  );
}

// Governance tree: Chairperson on top, members in a grid, Secretary at the bottom.
function BoardTree() {
  const chair = board.find((b) => /chair/i.test(b.role)) ?? board[0];
  const secretary = board.find((b) => /secretary/i.test(b.role));
  const members = board.filter((b) => b !== chair && b !== secretary);
  return (
    <div className="container-tirdo mt-10">
      <div className="flex justify-center">
        <PortraitCard l={chair} featured />
      </div>
      <div className="mx-auto my-7 h-7 w-px bg-brand-teal/30" />
      <div className="grid justify-items-center gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {members.map((m) => (
          <PortraitCard key={m.name} l={m} />
        ))}
      </div>
      {secretary && (
        <>
          <div className="mx-auto my-7 h-7 w-px bg-brand-teal/30" />
          <div className="flex justify-center">
            <PortraitCard l={secretary} />
          </div>
        </>
      )}
    </div>
  );
}

// Management tree: the lead (Director General) featured on top, the rest in a grid.
function LeaderTree({ people }: { people: Leader[] }) {
  const [lead, ...rest] = people;
  return (
    <div className="container-tirdo mt-10">
      <div className="flex justify-center">
        <PortraitCard l={lead} featured />
      </div>
      <div className="mx-auto my-7 h-7 w-px bg-brand-teal/30" />
      <div className="grid justify-items-center gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {rest.map((m) => (
          <PortraitCard key={m.name} l={m} />
        ))}
      </div>
    </div>
  );
}

export default function AboutSubPage({ params }: { params: { slug: string } }) {
  const m = meta[params.slug];
  if (!m) notFound();
  const crumbs = [{ label: "About Us", href: "/about" }, { label: m.title }];

  return (
    <>
      <PageBanner title={m.title} subtitle={m.subtitle} crumbs={crumbs} />
      <section className="py-14">
        {params.slug === "mission-vision" && (
          <div className="container-tirdo max-w-3xl space-y-4 text-foreground/80">
            <p>Vision: To be a centre of excellence in provision of innovative solutions for a competitive industrial sector.</p>
            <p>Mission: To support the development of competitive and sustainable industries through quality research and professional technical services.</p>
            <p>Core values: Integrity, Customer Focus, Quality, Innovation, Partnership, Accountability and Environmental Protection guide how TIRDO delivers its mandate.</p>
          </div>
        )}

        {params.slug === "structure" && (
          <div className="container-tirdo">
            <p className="mx-auto mb-10 max-w-3xl text-center text-foreground/80">{orgStructure.intro}</p>

            <div className="flex flex-col items-center">
              {/* Council */}
              <div className="rounded-md bg-brand-blue px-8 py-2.5 text-center text-sm font-bold text-white shadow">
                Council<div className="text-[10px] font-normal text-white/80">Board of Directors</div>
              </div>
              <div className="org-v h-6" />

              {/* Director General with side support units */}
              <div className="grid items-center gap-3 lg:grid-cols-[1fr_auto_1fr] lg:gap-0">
                <div className="flex flex-col items-center gap-2 lg:items-end">
                  {orgStructure.units.slice(0, 2).map((u) => (
                    <span key={u.name} className="max-w-[13rem] rounded-md border border-brand-teal/30 bg-brand-pale px-3 py-2 text-center text-xs font-semibold text-brand-ink">
                      {u.name}{u.role ? ` (${u.role})` : ""}
                      {u.head && <span className="block text-[10px] font-normal text-brand-teal">{u.head}</span>}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-center">
                  <span className="org-h hidden w-6 lg:block" />
                  <div className="rounded-md bg-brand-teal px-8 py-2.5 text-center text-sm font-bold text-white shadow">Director General</div>
                  <span className="org-h hidden w-6 lg:block" />
                </div>
                <div className="flex flex-col items-center gap-2 lg:items-start">
                  {orgStructure.units.slice(2).map((u) => (
                    <span key={u.name} className="max-w-[13rem] rounded-md border border-brand-teal/30 bg-brand-pale px-3 py-2 text-center text-xs font-semibold text-brand-ink">
                      {u.name}{u.role ? ` (${u.role})` : ""}
                      {u.head && <span className="block text-[10px] font-normal text-brand-teal">{u.head}</span>}
                    </span>
                  ))}
                </div>
              </div>

              <div className="org-v h-6 hidden lg:block" />
            </div>

            {/* Departments and their divisions */}
            <div className="org-row mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-0 lg:grid-cols-5" style={{ "--cols": "5" } as CSSProperties}>
              {orgStructure.departments.map((d) => (
                <div key={d.name} className="overflow-hidden rounded-lg border bg-card">
                  <div className="bg-brand-teal px-3 py-2.5 text-center text-[11px] font-bold leading-tight text-white">
                    {d.name} ({d.role})
                    {d.director && <div className="text-[10px] font-normal text-white/85">{d.director}</div>}
                  </div>
                  <ul className="space-y-1.5 p-2">
                    {d.divisions.map((x) => (
                      <li key={x.name} className="rounded bg-brand-pale px-2 py-1.5 text-[11px] leading-snug text-brand-ink">
                        <span className="font-medium">{x.name}{x.role ? ` (${x.role})` : ""}</span>
                        {x.head && <span className="block text-[10px] text-brand-teal">{x.head}</span>}
                        {x.items && x.items.length > 0 && (
                          <ul className="mt-1 space-y-0.5 pl-1 text-[10px] text-brand-muted">
                            {x.items.map((it) => <li key={it}>· {it}</li>)}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {params.slug === "board" && (
          <>
            <div className="container-tirdo max-w-3xl text-center text-foreground/80">
              <p>The Board of Directors provides strategic direction and oversight, ensuring TIRDO delivers on its statutory mandate under the TIRDO Act, 1979 and serves the national industrialization agenda.</p>
            </div>
            <BoardTree />
          </>
        )}

        {params.slug === "administration" && (
          <>
            <div className="container-tirdo max-w-3xl text-center text-foreground/80">
              <p>TIRDO&apos;s top management leads the organisation&apos;s research, engineering, ICT and corporate services, translating the mandate into applied research and technical services for industry.</p>
            </div>
            <LeaderTree people={topManagement} />

            <div className="container-tirdo mt-14">
              <h2 className="text-center text-lg font-bold text-primary">Supporting Units</h2>
              <p className="mb-8 text-center text-sm text-muted-foreground">Reporting directly to the Director General.</p>
              <UnitsGrid units={managementUnits} />
            </div>
          </>
        )}

        {params.slug === "success-stories" && (
          <>
            <div className="container-tirdo max-w-3xl text-foreground/80">
              <p>Over four decades TIRDO has delivered technologies and services with real national impact. A selection of milestones:</p>
            </div>
            <div className="container-tirdo mt-8 max-w-3xl space-y-4">
              {successStories.map((s) => (
                <Card key={s.title} className="border-l-4 border-l-accent">
                  <CardContent className="p-5">
                    <h3 className="mb-1 font-semibold text-primary">{s.title}</h3>
                    <p className="text-sm text-muted-foreground">{s.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {params.slug === "comsats" && (
          <div className="container-tirdo max-w-3xl space-y-8 text-foreground/80">
            <div className="space-y-4">{comsats.map((p, i) => <p key={i}>{p}</p>)}</div>
            <div>
              <h3 className="mb-3 font-bold text-primary">Objectives</h3>
              <ul className="list-inside list-disc space-y-1.5 text-sm">
                {comsatsObjectives.map((o, i) => <li key={i}>{o}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="mb-3 font-bold text-primary">Activities</h3>
              <ul className="list-inside list-disc space-y-1.5 text-sm">
                {comsatsActivities.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
