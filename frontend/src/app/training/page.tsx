import type { Metadata } from "next";
import Link from "next/link";
import { PageBanner } from "@/components/site/page-banner";
import { SectionHeading } from "@/components/site/section-heading";
import { PortalGateway } from "@/components/site/gateway";
import { Clock, MapPin, Calendar } from "lucide-react";
import { training, events } from "@/lib/content";
import { formatDate } from "@/lib/utils";
import { portals } from "@/lib/site";

export const metadata: Metadata = {
  title: "Training & Skills Development",
  description: "TIRDO short courses and capacity building for industry and SMEs — schedules, registration and materials through the TeLTP e-learning platform.",
  alternates: { canonical: "/training" },
};

export default function TrainingPage() {
  const trainingEvents = events.filter((e) => e.category === "Training");
  return (
    <>
      <PageBanner
        title="Training & Skills Development"
        subtitle="Practical short courses and capacity building that combine TIRDO's laboratories with field experience."
        crumbs={[{ label: "Services", href: "/services" }, { label: "Training" }]}
      />

      <section className="py-14">
        <div className="container-tirdo max-w-3xl space-y-4 text-foreground/80">
          {training.intro.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </section>

      <section className="border-t bg-secondary/30 py-14">
        <div className="container-tirdo">
          <SectionHeading eyebrow="Catalogue" title="Short courses" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {training.courses.map((c) => (
              <div key={c.title} className="flex flex-col rounded-xl border bg-card p-6 shadow-sm">
                <div className="mb-1 text-xs font-medium uppercase tracking-wide text-brand-teal">{c.area}</div>
                <h3 className="mb-2 font-semibold text-primary">{c.title}</h3>
                <p className="mb-4 flex-1 text-sm text-muted-foreground">{c.description}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {c.duration}</span>
                  <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {c.mode}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {trainingEvents.length > 0 && (
        <section className="py-14">
          <div className="container-tirdo">
            <SectionHeading eyebrow="Scheduled" title="Upcoming training" />
            <ul className="space-y-3">
              {trainingEvents.map((e) => (
                <li key={e.title} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-5">
                  <div>
                    <h3 className="font-semibold text-primary">{e.title}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {formatDate(e.date)}</span>
                      <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {e.location}</span>
                    </div>
                  </div>
                  <Link href="/events" className="text-sm font-semibold text-brand-teal hover:underline">Details</Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="border-t bg-secondary/30 py-14">
        <div className="container-tirdo">
          <PortalGateway
            name="TIRDO e-Learning & Training Platform"
            acronym="TeLTP"
            icon="GraduationCap"
            tagline="Browse the course calendar, enrol online and access learning materials — TIRDO's e-learning and training platform."
            href={portals.teltp}
            features={["Course catalogue and schedules", "Online registration and payment", "Learning materials and resources", "Certificates of completion"]}
          />
        </div>
      </section>
    </>
  );
}
