import { Suspense } from "react";
import type { Metadata } from "next";
import { PageBanner } from "@/components/site/page-banner";
import { SearchClient } from "@/components/site/search-client";

export const metadata: Metadata = {
  title: "Search",
  description: "Search news, publications, projects, services and departments across TIRDO.",
  alternates: { canonical: "/search" },
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <>
      <PageBanner
        title="Search"
        subtitle="Find news, publications, projects, services and departments."
        crumbs={[{ label: "Search" }]}
      />
      <section className="py-14">
        <Suspense fallback={<div className="container-tirdo max-w-3xl text-sm text-muted-foreground">Loading…</div>}>
          <SearchClient />
        </Suspense>
      </section>
    </>
  );
}
