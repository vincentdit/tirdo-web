import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageBanner } from "@/components/site/page-banner";
import { Card, CardContent } from "@/components/ui/card";
import { departments } from "@/lib/content";

export const metadata = { title: "Departments" };

export default function DepartmentsPage() {
  const groups = Array.from(new Set(departments.map((d) => d.group)));
  return (
    <>
      <PageBanner title="Departments" subtitle="Specialised research and engineering units delivering TIRDO's mandate." crumbs={[{ label: "Departments" }]} />
      <section className="py-14">
        <div className="container-tirdo space-y-12">
          {groups.map((g) => (
            <div key={g}>
              <h2 className="mb-5 border-l-4 border-accent pl-3 text-xl font-bold text-primary">{g}</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {departments.filter((d) => d.group === g).map((d) => (
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
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
