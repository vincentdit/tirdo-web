import { PageBanner } from "@/components/site/page-banner";
import { ProjectCard } from "@/components/site/cards";
import { getProjects } from "@/lib/strapi";

export const metadata = { title: "Research & Projects" };

export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <>
      <PageBanner title="Research & Projects" subtitle="Ongoing and featured research turning local resources into industrial value." crumbs={[{ label: "Research & Innovation" }, { label: "Projects" }]} />
      <section id="products" className="py-14">
        <div className="container-tirdo grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => <ProjectCard key={p.slug} item={p} />)}
        </div>
      </section>
    </>
  );
}
