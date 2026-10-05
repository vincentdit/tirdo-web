import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { PageBanner } from "@/components/site/page-banner";
import { FeedbackForm } from "@/components/site/feedback-form";

export const metadata: Metadata = {
  title: "Give Feedback",
  description: "Rate and give feedback on TIRDO's services. Your feedback helps TIRDO measure and improve service delivery to stakeholders.",
  alternates: { canonical: "/feedback" },
};

export default function FeedbackPage() {
  return (
    <>
      <PageBanner
        title="Give Feedback"
        subtitle="Tell us how we did. Your feedback helps TIRDO measure and improve its services."
        crumbs={[{ label: "Feedback" }]}
      />
      <section className="py-14">
        <div className="container-tirdo grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          <div className="space-y-4 text-foreground/80">
            <p>
              TIRDO is committed to high-quality service to industry, government, SMEs and the public.
              Whether a compliment, a complaint or a suggestion, your feedback is the foundation of how
              we measure and improve service delivery.
            </p>
            <p>
              Our service standards and commitments are set out in the{" "}
              <Link href="/service-charter" className="font-medium text-brand-teal hover:underline">Customer Service Charter</Link>.
              For a general enquiry you can also use the{" "}
              <Link href="/contact" className="font-medium text-brand-teal hover:underline">Contact page</Link>.
            </p>
            <p className="text-sm text-muted-foreground">
              Feedback is handled confidentially by the TIRDO team and used to improve our services.
            </p>
          </div>
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-bold text-primary">Your feedback</h2>
            <Suspense fallback={<div className="h-80 animate-pulse rounded-lg bg-secondary/40" />}>
              <FeedbackForm />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
}
