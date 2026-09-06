import type { Metadata } from "next";
import { PageBanner } from "@/components/site/page-banner";
import { ProjectsExplorer } from "@/components/site/projects-explorer";
import { getProjects } from "@/lib/strapi";

export const metadata: Metadata = {
  title: "Research & Projects",
  description: "Ongoing and featured TIRDO research projects, filterable by research area and status.",
  alternates: { canonical: "/projects" },
};

export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <>
      <PageBanner
        title="Research & Projects"
        subtitle="Ongoing and featured research turning local resources into industrial value."
        crumbs={[{ label: "Research & Innovation" }, { label: "Projects" }]}
      />
      <section id="products" className="py-14">
        <div className="container-tirdo">
          <ProjectsExplorer projects={projects} />
        </div>
      </section>
    </>
  );
}
