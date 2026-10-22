import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { PageBanner } from "@/components/site/page-banner";
import { SectionHeading } from "@/components/site/section-heading";
import { EventCard } from "@/components/site/event-card";
import { isCurrentEvent } from "@/lib/content";
import { getEvents } from "@/lib/strapi";

export const metadata = {
  title: "Events",
  description: "Workshops, training, exhibitions and industry engagements hosted by TIRDO.",
};

export default async function EventsPage() {
  const events = await getEvents();
  const now = new Date();
  const upcoming = events
    .filter((e) => e.pinned || isCurrentEvent(e, now))
    .sort((a, b) => {
      if (Boolean(a.pinned) !== Boolean(b.pinned)) return a.pinned ? -1 : 1;
      return String(a.date).localeCompare(String(b.date));
    });
  const past = events
    .filter((e) => !upcoming.some((u) => u.slug === e.slug))
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));
  const spotlight = upcoming[0];
  const restUpcoming = upcoming.slice(1);

  return (
    <>
      <PageBanner
        title="Events"
        subtitle="Workshops, training, exhibitions and industry engagements hosted by TIRDO."
        crumbs={[{ label: "Media" }, { label: "Events" }]}
      />
      <section className="bg-brand-pale/60 py-12 md:py-16">
        <div className="container-tirdo">
          {upcoming.length === 0 && past.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-brand-teal/30 bg-white p-10 text-center">
              <CalendarDays className="mx-auto mb-3 h-10 w-10 text-brand-teal" />
              <h2 className="font-display text-2xl text-brand-ink">No events published yet</h2>
              <p className="mt-2 text-sm text-brand-muted">Upcoming TIRDO programmes will appear here.</p>
            </div>
          ) : null}

          {spotlight ? (
            <>
              <SectionHeading eyebrow="Featured" title="Happening now and upcoming" />
              <EventCard item={spotlight} featured />
            </>
          ) : null}

          {restUpcoming.length > 0 ? (
            <div className={`grid gap-6 md:grid-cols-2 ${spotlight ? "mt-8" : ""}`}>
              {restUpcoming.map((e) => (
                <EventCard key={e.slug} item={e} />
              ))}
            </div>
          ) : null}

          {past.length > 0 ? (
            <div className={upcoming.length ? "mt-14" : ""}>
              <SectionHeading eyebrow="Archive" title="Past events" />
              <div className="grid gap-6 md:grid-cols-2">
                {past.map((e) => (
                  <EventCard key={e.slug} item={e} />
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-12 rounded-2xl border border-brand-gold/40 bg-[#fff8e8] p-6 text-sm text-brand-ink md:p-8">
            <p className="font-semibold">Need to attend or host a programme with TIRDO?</p>
            <p className="mt-2 text-brand-muted">
              Upcoming events are published here. For enquiries or to register when a registration link is not listed, please{" "}
              <Link href="/contact" className="font-semibold text-brand-teal hover:underline">
                contact TIRDO
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
