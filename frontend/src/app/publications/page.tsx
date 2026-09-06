import type { Metadata } from "next";
import { PageBanner } from "@/components/site/page-banner";
import { PublicationsExplorer } from "@/components/site/publications-explorer";
import { getPublications } from "@/lib/strapi";

export const metadata: Metadata = {
  title: "Publications & Downloads",
  description: "TIRDO reports, journals, policy briefs and guidelines — searchable and filterable by type and year.",
  alternates: { canonical: "/publications" },
};

export default async function PublicationsPage() {
  const pubs = await getPublications();
  return (
    <>
      <PageBanner
        title="Publications & Downloads"
        subtitle="Reports, journals, policy briefs and guidelines from TIRDO's research."
        crumbs={[{ label: "Publications" }]}
      />
      <section className="py-14">
        <div className="container-tirdo">
          <PublicationsExplorer publications={pubs} />
        </div>
      </section>
    </>
  );
}
