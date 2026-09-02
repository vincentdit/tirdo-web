import { Calendar, MapPin } from "lucide-react";
import { PageBanner } from "@/components/site/page-banner";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { events } from "@/lib/content";

export const metadata = { title: "Events" };

export default function EventsPage() {
  return (
    <>
      <PageBanner
        title="Events"
        subtitle="Workshops, training, exhibitions and industry engagements hosted by TIRDO."
        crumbs={[{ label: "Media" }, { label: "Events" }]}
      />
      <section className="py-14">
        <div className="container-tirdo grid gap-6 lg:grid-cols-2">
          {events.map((e) => (
            <article key={e.title} className="group grid overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-lg sm:grid-cols-[40%_1fr]">
              <div className="relative aspect-video bg-primary/10 sm:aspect-auto">
                {e.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={e.image} alt={e.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-primary/15 to-accent/15" />
                )}
                <Badge variant="accent" className="absolute left-3 top-3">{e.category}</Badge>
              </div>
              <div className="p-5">
                <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {formatDate(e.date)}</span>
                  <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {e.location}</span>
                </div>
                <h3 className="mb-2 font-semibold leading-snug text-primary">{e.title}</h3>
                <p className="text-sm text-muted-foreground">{e.description}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="container-tirdo mt-10 rounded-xl border-l-4 border-accent bg-secondary/40 p-6 text-sm text-foreground/70">
          Upcoming events are published here and can be managed through the CMS. For enquiries or to
          register for a training, please <a href="/contact" className="font-semibold text-brand-teal hover:underline">contact TIRDO</a>.
        </div>
      </section>
    </>
  );
}
