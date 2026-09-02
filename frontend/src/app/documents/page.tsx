import { FileText, Download, FileSpreadsheet, Scale, BookOpen, FileBadge, Files } from "lucide-react";
import { PageBanner } from "@/components/site/page-banner";
import { Badge } from "@/components/ui/badge";
import { getPublications } from "@/lib/strapi";
import type { Publication } from "@/lib/content";

export const metadata = { title: "Documents" };

// Icon per document category.
function typeIcon(type: string) {
  const t = type.toLowerCase();
  if (t.includes("financial")) return FileSpreadsheet;
  if (t.includes("legislation") || t.includes("act")) return Scale;
  if (t.includes("handbook") || t.includes("guideline")) return BookOpen;
  if (t.includes("profile")) return FileBadge;
  return FileText;
}

export default async function DocumentsPage() {
  const pubs = await getPublications();

  // Group by type, then sort groups by size (desc) and docs by year (desc).
  const groups = new Map<string, Publication[]>();
  for (const p of pubs) {
    if (!groups.has(p.type)) groups.set(p.type, []);
    groups.get(p.type)!.push(p);
  }
  const grouped = Array.from(groups.entries())
    .map(([type, items]) => ({ type, items: items.sort((a, b) => b.year - a.year) }))
    .sort((a, b) => b.items.length - a.items.length);

  return (
    <>
      <PageBanner
        title="Documents"
        subtitle="Reports, publications, handbooks, guidelines and official TIRDO documents."
        crumbs={[{ label: "Documents" }]}
      />

      <section className="py-14">
        <div className="container-tirdo">
          {/* category summary chips */}
          <div className="mb-10 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-teal px-3 py-1.5 text-xs font-semibold text-white">
              <Files className="h-3.5 w-3.5" /> All documents · {pubs.length}
            </span>
            {grouped.map((g) => (
              <a key={g.type} href={`#${g.type.replace(/\s+/g, "-").toLowerCase()}`} className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold text-brand-ink hover:border-brand-teal hover:text-brand-teal">
                {g.type} · {g.items.length}
              </a>
            ))}
          </div>

          <div className="space-y-12">
            {grouped.map((g) => {
              const Icon = typeIcon(g.type);
              return (
                <div key={g.type} id={g.type.replace(/\s+/g, "-").toLowerCase()} className="scroll-mt-28">
                  <h2 className="mb-5 flex items-center gap-2 border-l-4 border-accent pl-3 text-xl font-bold text-primary">
                    <Icon className="h-5 w-5 text-brand-teal" /> {g.type}
                  </h2>
                  <div className="grid gap-3 md:grid-cols-2">
                    {g.items.map((p) => (
                      <a
                        key={p.slug}
                        href={p.fileUrl ?? "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-start justify-between gap-4 rounded-lg border bg-card p-4 transition-all hover:border-brand-teal hover:shadow-md"
                      >
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-teal/10 text-brand-teal group-hover:bg-brand-teal group-hover:text-white">
                            <Icon className="h-5 w-5" />
                          </span>
                          <div>
                            <div className="font-medium leading-snug text-brand-ink group-hover:text-brand-teal">{p.title}</div>
                            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                              <Badge variant="secondary">{p.type}</Badge>
                              <span>{p.year}</span>
                            </div>
                          </div>
                        </div>
                        <Download className="mt-1 h-5 w-5 shrink-0 text-brand-teal opacity-70 group-hover:opacity-100" />
                      </a>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-12 rounded-lg border-l-4 border-brand-teal bg-brand-pale p-4 text-sm text-foreground/70">
            Looking for something specific? Use the site <a href="/search" className="font-semibold text-brand-teal hover:underline">search</a>,
            or contact the <a href="/industrial-information-centre" className="font-semibold text-brand-teal hover:underline">Industrial Information Centre</a>.
          </p>
        </div>
      </section>
    </>
  );
}
