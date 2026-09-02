import { notFound } from "next/navigation";
import { PageBanner } from "@/components/site/page-banner";
import { ProjectCard } from "@/components/site/cards";
import { departments, projects } from "@/lib/content";

export function generateStaticParams() {
  return departments.map((d) => ({ slug: d.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const d = departments.find((x) => x.slug === params.slug);
  return { title: d?.title ?? "Department" };
}

export default function DepartmentPage({ params }: { params: { slug: string } }) {
  const dept = departments.find((d) => d.slug === params.slug);
  if (!dept) notFound();
  const related = projects.filter((p) => p.department.toLowerCase().includes(dept.title.split(" ")[0].toLowerCase()));

  return (
    <>
      <PageBanner title={dept.title} subtitle={dept.group} crumbs={[{ label: "Departments", href: "/departments" }, { label: dept.title }]} />
      <section className="py-14">
        <div className="container-tirdo max-w-3xl space-y-4 text-foreground/80">
          {dept.head && (
            <p className="text-sm font-semibold text-brand-teal">Head of division: {dept.head}</p>
          )}
          {dept.body.map((p, i) => <p key={i}>{p}</p>)}
        </div>

        {related.length > 0 && (
          <div className="container-tirdo mt-12">
            <h2 className="mb-5 text-xl font-bold text-primary">Related Projects</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => <ProjectCard key={p.slug} item={p} />)}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
