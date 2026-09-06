import type { Metadata } from "next";
import { PageBanner } from "@/components/site/page-banner";
import { TendersExplorer } from "@/components/site/tenders-explorer";
import { getTenders } from "@/lib/strapi";

export const metadata: Metadata = {
  title: "Tenders",
  description: "Active TIRDO procurement opportunities and tender documents, filterable by category.",
  alternates: { canonical: "/tenders" },
};

export default async function TendersPage() {
  const tenders = await getTenders();
  return (
    <>
      <PageBanner title="Tenders" subtitle="Procurement opportunities at TIRDO." crumbs={[{ label: "Tenders" }]} />
      <section className="py-14">
        <div className="container-tirdo space-y-6">
          <p className="max-w-3xl text-foreground/80">
            TIRDO conducts procurement in accordance with the Public Procurement Act. Active tenders and their
            documents are published here and on the National e-Procurement System (NeST). Closed tenders are
            archived automatically once their deadline passes.
          </p>
          <TendersExplorer tenders={tenders} />
        </div>
      </section>
    </>
  );
}
