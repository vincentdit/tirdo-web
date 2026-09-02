import { notFound } from "next/navigation";
import { User, Mail, Phone, MapPin } from "lucide-react";
import { PageBanner } from "@/components/site/page-banner";
import { ProjectCard } from "@/components/site/cards";
import { ButtonLink } from "@/components/ui/button";
import { departments, projects } from "@/lib/content";
import { site } from "@/lib/site";

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
        <div className="container-tirdo grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-4 text-foreground/80">
            {dept.body.map((p, i) => <p key={i}>{p}</p>)}
          </div>

          {/* Contact / staff */}
          <aside>
            <div className="rounded-xl border bg-secondary/40 p-6">
              {dept.head && (
                <div className="mb-4 flex items-center gap-3 border-b pb-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                    <User className="h-6 w-6" />
                  </span>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">Head of Division</div>
                    <div className="font-semibold text-primary">{dept.head}</div>
                  </div>
                </div>
              )}
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-brand-teal">Contact this department</h3>
              <ul className="space-y-3 text-sm text-foreground/80">
                <li className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-teal" />{site.address}</li>
                <li className="flex gap-2"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-teal" />{site.phone}</li>
                <li className="flex gap-2"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-teal" /><a href={`mailto:${site.email}`} className="hover:text-brand-teal">{site.email}</a></li>
              </ul>
              <ButtonLink href="/contact" variant="accent" className="mt-5 w-full justify-center">Request services</ButtonLink>
            </div>
          </aside>
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
