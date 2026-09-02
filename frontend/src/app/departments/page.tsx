import Link from "next/link";
import { ArrowRight, User } from "lucide-react";
import { PageBanner } from "@/components/site/page-banner";
import { Card, CardContent } from "@/components/ui/card";
import { departments, managementUnits } from "@/lib/content";

export const metadata = { title: "Departments" };

export default function DepartmentsPage() {
  const groups = Array.from(new Set(departments.map((d) => d.group)));

  return (
    <>
      <PageBanner
        title="Departments"
        subtitle="TIRDO delivers its mandate through five departments, each led by a Director."
        crumbs={[{ label: "Departments" }]}
      />
      <section className="py-14">
        <div className="container-tirdo space-y-12">
          {groups.map((g) => {
            const items = departments.filter((d) => d.group === g);
            const dept = items.length === 1 && items[0].sections ? items[0] : null;

            return (
              <div key={g}>
                <h2 className="mb-5 border-l-4 border-accent pl-3 text-xl font-bold text-primary">
                  {g}{dept ? " Department" : ""}
                </h2>

                {dept ? (
                  /* Department that has sections (Finance, HR & Administration) */
                  <Card className="overflow-hidden">
                    <CardContent className="grid gap-6 p-6 lg:grid-cols-[1.4fr_1fr]">
                      <div>
                        <p className="text-sm text-foreground/80">{dept.blurb}</p>
                        {dept.head && (
                          <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-teal">
                            <User className="h-4 w-4" /> {dept.head}
                          </p>
                        )}
                        <div>
                          <Link href={`/departments/${dept.slug}`} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent hover:gap-2">
                            View department <ArrowRight className="h-4 w-4 transition-all" />
                          </Link>
                        </div>
                      </div>
                      <div>
                        <div className="mb-2 text-xs font-bold uppercase tracking-wide text-brand-teal">Divisions &amp; Sections</div>
                        <ul className="space-y-1.5">
                          {dept.sections!.map((s) => (
                            <li key={s.name} className="rounded bg-brand-pale px-3 py-1.5 text-sm text-brand-ink">{s.name}</li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  /* Technical department cluster → its divisions */
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((d) => (
                      <Link key={d.slug} href={`/departments/${d.slug}`}>
                        <Card className="group h-full transition-shadow hover:shadow-md">
                          <CardContent className="p-5">
                            <h3 className="mb-1 font-semibold text-primary group-hover:underline">{d.title}</h3>
                            <p className="mb-3 text-sm text-muted-foreground">{d.blurb}</p>
                            <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent">
                              Learn more <ArrowRight className="h-4 w-4" />
                            </span>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Supporting units (report directly to the Director General) */}
          <div>
            <h2 className="mb-2 border-l-4 border-accent pl-3 text-xl font-bold text-primary">Supporting Units</h2>
            <p className="mb-5 pl-4 text-sm text-muted-foreground">Units reporting directly to the Director General.</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {managementUnits.map((u) => (
                <Card key={u.name}>
                  <CardContent className="p-5">
                    <h3 className="mb-1 font-semibold text-primary">{u.name}</h3>
                    <p className="text-sm text-muted-foreground">{u.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
