import type { Metadata } from "next";
import { CheckCircle2, MessageSquare } from "lucide-react";
import { PageBanner } from "@/components/site/page-banner";
import { SectionHeading } from "@/components/site/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { serviceCharter } from "@/lib/content";

export const metadata: Metadata = {
  title: "Customer Service Charter",
  description: "TIRDO's service standards, turnaround times, and your rights as a stakeholder — and how to give feedback on our services.",
  alternates: { canonical: "/service-charter" },
};

export default function ServiceCharterPage() {
  return (
    <>
      <PageBanner
        title="Customer Service Charter"
        subtitle="Our service standards and commitments to you — and how your feedback helps us improve."
        crumbs={[{ label: "About Us", href: "/about" }, { label: "Customer Service Charter" }]}
      />

      <section className="py-14">
        <div className="container-tirdo max-w-3xl space-y-4 text-foreground/80">
          {serviceCharter.intro.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </section>

      <section className="border-t bg-secondary/30 py-14">
        <div className="container-tirdo">
          <SectionHeading eyebrow="Our commitments" title="Service standards" />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="bg-primary text-primary-foreground">
                  <th className="p-3 text-left font-semibold">Service</th>
                  <th className="p-3 text-left font-semibold">Our standard</th>
                  <th className="p-3 text-left font-semibold">Turnaround</th>
                </tr>
              </thead>
              <tbody>
                {serviceCharter.standards.map((s, i) => (
                  <tr key={s.service} className={i % 2 ? "bg-card" : "bg-secondary/40"}>
                    <td className="border-t p-3 font-medium text-primary">{s.service}</td>
                    <td className="border-t p-3 text-foreground/80">{s.standard}</td>
                    <td className="border-t p-3 whitespace-nowrap text-foreground/80">{s.turnaround}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="container-tirdo grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="You can expect" title="Your rights" />
            <ul className="space-y-2">
              {serviceCharter.rights.map((r) => (
                <li key={r} className="flex items-start gap-2 text-sm text-foreground/80">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-teal" /> {r}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading eyebrow="We ask that you" title="Your responsibilities" />
            <ul className="space-y-2">
              {serviceCharter.responsibilities.map((r) => (
                <li key={r} className="flex items-start gap-2 text-sm text-foreground/80">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-teal" /> {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-t bg-secondary/30 py-14">
        <div className="container-tirdo rounded-2xl border-l-4 border-accent bg-card p-8 shadow-sm">
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <MessageSquare className="h-6 w-6" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-primary">Help us meet these standards</h3>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Tell us how we did — a compliment, a complaint or a suggestion. Your feedback is how
                TIRDO measures and improves its services to stakeholders.
              </p>
              <ButtonLink href="/feedback" variant="accent" className="mt-4">Give feedback</ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
