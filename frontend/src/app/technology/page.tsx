import type { Metadata } from "next";
import { PageBanner } from "@/components/site/page-banner";
import { TechnologyExplorer } from "@/components/site/technology-explorer";
import { getTechnologies } from "@/lib/strapi";

export const metadata: Metadata = {
  title: "Technology Catalogue",
  description: "Proven TIRDO technologies available for transfer, licensing and adoption by industry, SMEs and communities.",
  alternates: { canonical: "/technology" },
};

export default async function TechnologyPage() {
  const technologies = await getTechnologies();
  return (
    <>
      <PageBanner
        title="Technology Catalogue"
        subtitle="Proven technologies developed by TIRDO and available for transfer, licensing and adoption."
        crumbs={[{ label: "Research & Innovation" }, { label: "Technology Catalogue" }]}
      />
      <section className="py-14">
        <div className="container-tirdo">
          <TechnologyExplorer technologies={technologies} />
        </div>
      </section>
    </>
  );
}
