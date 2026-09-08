import type { Metadata } from "next";
import { PageBanner } from "@/components/site/page-banner";
import { SectionHeading } from "@/components/site/section-heading";
import { PortalGateway } from "@/components/site/gateway";
import { Icon } from "@/components/site/icon";
import { ShieldCheck } from "lucide-react";
import { laboratory } from "@/lib/content";
import { portals } from "@/lib/site";

export const metadata: Metadata = {
  title: "Laboratory Services",
  description: "TIRDO's accredited laboratories for food, chemistry, materials, energy and environmental testing — with online sample submission and results through NILIMS.",
  alternates: { canonical: "/laboratory" },
};

export default function LaboratoryPage() {
  return (
    <>
      <PageBanner
        title="Laboratory Services"
        subtitle="Accredited testing and analysis for industry, government, SMEs and the public."
        crumbs={[{ label: "Services", href: "/services" }, { label: "Laboratory" }]}
      />

      <section className="py-14">
        <div className="container-tirdo grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-4 text-foreground/80">
            {laboratory.intro.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          <aside className="rounded-xl border-l-4 border-accent bg-secondary/40 p-6">
            <div className="mb-2 flex items-center gap-2 font-semibold text-primary">
              <ShieldCheck className="h-5 w-5 text-brand-teal" /> Accreditation & quality
            </div>
            <p className="text-sm text-foreground/75">{laboratory.accreditation}</p>
          </aside>
        </div>
      </section>

      <section className="border-t bg-secondary/30 py-14">
        <div className="container-tirdo">
          <SectionHeading eyebrow="Capabilities" title="What we test" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {laboratory.groups.map((g) => (
              <div key={g.name} className="rounded-xl border bg-card p-6 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Icon name="TestTube" className="h-5 w-5" />
                  </span>
                  <h3 className="font-semibold text-primary">{g.name}</h3>
                </div>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  {g.tests.map((t) => <li key={t}>• {t}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="container-tirdo">
          <SectionHeading eyebrow="How it works" title="Submitting a sample" />
          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {laboratory.process.map((s, i) => (
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
            name="National Industrial Laboratory Information Management System"
            acronym="NILIMS"
            icon="Microscope"
            tagline="Register samples, track your jobs and download certified test results online — TIRDO's laboratory information management system."
            href={portals.nilims}
            features={["Online sample registration", "Real-time job tracking", "Digital test reports", "Client history and re-orders"]}
          />
        </div>
      </section>
    </>
  );
}
