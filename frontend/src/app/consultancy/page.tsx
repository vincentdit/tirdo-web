import type { Metadata } from "next";
import { PageBanner } from "@/components/site/page-banner";
import { SectionHeading } from "@/components/site/section-heading";
import { PortalGateway } from "@/components/site/gateway";
import { Icon } from "@/components/site/icon";
import { consultancy } from "@/lib/content";
import { portals } from "@/lib/site";

export const metadata: Metadata = {
  title: "Consultancy & Advisory",
  description: "TIRDO's multidisciplinary consultancy and technical advisory services for industry and government — requested and managed through the CIAP portal.",
  alternates: { canonical: "/consultancy" },
};

export default function ConsultancyPage() {
  return (
    <>
      <PageBanner
        title="Consultancy & Advisory"
        subtitle="A multidisciplinary technical partner to industry, government and development partners."
        crumbs={[{ label: "Services", href: "/services" }, { label: "Consultancy" }]}
      />

      <section className="py-14">
        <div className="container-tirdo max-w-3xl space-y-4 text-foreground/80">
          {consultancy.intro.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </section>

      <section className="border-t bg-secondary/30 py-14">
        <div className="container-tirdo">
          <SectionHeading eyebrow="Expertise" title="Consultancy service lines" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {consultancy.lines.map((l) => (
              <div key={l.title} className="rounded-xl border bg-card p-6 shadow-sm">
                <span className="mb-3 grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon name={l.icon} className="h-5 w-5" />
                </span>
                <h3 className="mb-1 font-semibold text-primary">{l.title}</h3>
                <p className="text-sm text-muted-foreground">{l.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="container-tirdo">
          <SectionHeading eyebrow="How it works" title="From request to closure" />
          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {consultancy.process.map((s, i) => (
              <li key={s.title} className="rounded-xl border bg-card p-5">
                <div className="mb-2 grid h-8 w-8 place-items-center rounded-full bg-brand-teal text-sm font-bold text-white">{i + 1}</div>
                <h3 className="mb-1 font-semibold text-primary">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t bg-secondary/30 py-14">
        <div className="container-tirdo">
          <PortalGateway
            name="Consultancy & Industrial Advisory Portal"
            acronym="CIAP"
            icon="Handshake"
            tagline="Submit a consultancy request and follow it from proposal through delivery to closure — TIRDO's consultancy workflow portal."
            href={portals.ciap}
            features={["Submit and scope requests", "Track proposals and approvals", "Manage deliverables and reports", "Engagement history and closure"]}
          />
        </div>
      </section>
    </>
  );
}
