import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Download, MapPin, Pin, Tag } from "lucide-react";
import { PageBanner } from "@/components/site/page-banner";
import { Badge } from "@/components/ui/badge";
import { RegisterLink } from "@/components/site/current-event-ribbon";
import { formatDate, formatDateRange } from "@/lib/utils";
import { getEventBySlug, getEvents } from "@/lib/strapi";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const item = await getEventBySlug(params.slug);
  const title = item?.title ?? "Event";
  const canonical = `/events/${params.slug}`;
  return {
    title,
    description: item?.description,
    alternates: { canonical },
    openGraph: {
      title,
      description: item?.description,
      url: canonical,
      images: item?.image || item?.logo ? [{ url: item.image || item.logo || "" }] : undefined,
    },
  };
}

export default async function EventDetail({ params }: { params: { slug: string } }) {
  const item = await getEventBySlug(params.slug);
  if (!item) notFound();
  const related = (await getEvents()).filter((e) => e.slug !== item.slug).slice(0, 3);
  const when = formatDateRange(item.date, item.endDate);

  return (
    <>
      <PageBanner title={item.title} crumbs={[{ label: "Events", href: "/events" }, { label: item.category }]} />
      <section className="bg-brand-pale/40 py-12 md:py-16">
        <div className="container-tirdo grid gap-8 lg:grid-cols-[minmax(0,1.65fr)_20rem]">
          <article className="overflow-hidden rounded-2xl border border-[#dce5e7] bg-white shadow-[0_8px_24px_rgba(9,42,69,0.05)]">
            {item.image ? (
              <div className="relative aspect-[16/7] overflow-hidden bg-brand-pale">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/40 to-transparent" />
                {item.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.logo}
                    alt={`${item.title} logo`}
                    className="absolute bottom-4 left-4 h-16 w-16 rounded-full border-2 border-white bg-white object-contain p-1 shadow"
                  />
                ) : null}
              </div>
            ) : item.logo ? (
              <div className="flex items-center gap-4 border-b border-[#dce5e7] bg-[#fff8e8] px-6 py-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.logo} alt={`${item.title} logo`} className="h-16 w-16 rounded-full border border-brand-gold bg-white object-contain p-1" />
                <p className="text-sm font-medium text-brand-muted">Official event mark</p>
              </div>
            ) : null}

            <div className="p-6 md:p-8">
              <div className="mb-6 flex flex-wrap items-center gap-2">
                {item.pinned ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-gold px-2.5 py-0.5 text-xs font-bold text-brand-ink">
                    <Pin className="h-3 w-3" /> Pinned
                  </span>
                ) : null}
                {item.category ? <Badge variant="accent">{item.category}</Badge> : null}
              </div>

              <dl className="mb-8 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-[#dce5e7] bg-brand-pale/70 p-4">
                  <dt className="mb-1 inline-flex items-center gap-1.5 text-[0.68rem] font-bold uppercase tracking-wide text-brand-teal">
                    <Calendar className="h-3.5 w-3.5" /> Date
                  </dt>
                  <dd className="text-sm font-semibold text-brand-ink">{when || "To be announced"}</dd>
                </div>
                <div className="rounded-xl border border-[#dce5e7] bg-brand-pale/70 p-4">
                  <dt className="mb-1 inline-flex items-center gap-1.5 text-[0.68rem] font-bold uppercase tracking-wide text-brand-teal">
                    <MapPin className="h-3.5 w-3.5" /> Venue
                  </dt>
                  <dd className="text-sm font-semibold text-brand-ink">{item.location || "TIRDO"}</dd>
                </div>
                <div className="rounded-xl border border-[#dce5e7] bg-brand-pale/70 p-4">
                  <dt className="mb-1 inline-flex items-center gap-1.5 text-[0.68rem] font-bold uppercase tracking-wide text-brand-teal">
                    <Tag className="h-3.5 w-3.5" /> Type
                  </dt>
                  <dd className="text-sm font-semibold text-brand-ink">{item.category || "Event"}</dd>
                </div>
              </dl>

              {item.description ? <p className="text-lg font-medium leading-relaxed text-brand-ink">{item.description}</p> : null}
              {item.body ? <p className="mt-4 whitespace-pre-line leading-relaxed text-brand-muted">{item.body}</p> : null}

              <div className="mt-8 flex flex-wrap gap-3">
                {item.registerUrl ? (
                  <RegisterLink
                    href={item.registerUrl}
                    className="inline-flex items-center rounded-md bg-brand-teal px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-teal-dark"
                  >
                    Register to attend
                  </RegisterLink>
                ) : null}
                {item.documentUrl ? (
                  <a
                    href={item.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md border border-brand-ink/15 px-5 py-2.5 text-sm font-semibold text-brand-ink transition hover:border-brand-teal hover:text-brand-teal"
                  >
                    <Download className="h-4 w-4" /> Attached document
                  </a>
                ) : null}
              </div>

              <Link href="/events" className="mt-8 inline-flex items-center gap-1 text-sm font-semibold text-brand-teal transition hover:gap-2">
                <ArrowLeft className="h-4 w-4" /> Back to events
              </Link>
            </div>
          </article>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-brand-gold/40 bg-[#fff8e8] p-5">
              <h2 className="font-display text-lg text-brand-ink">Attend this event</h2>
              <p className="mt-2 text-sm text-brand-muted">
                {when}
                {item.location ? ` · ${item.location}` : ""}
              </p>
              {item.registerUrl ? (
                <RegisterLink
                  href={item.registerUrl}
                  className="mt-4 inline-flex w-full items-center justify-center rounded-md bg-brand-teal px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-teal-dark"
                >
                  Register now
                </RegisterLink>
              ) : (
                <Link
                  href="/contact"
                  className="mt-4 inline-flex w-full items-center justify-center rounded-md bg-brand-teal px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-teal-dark"
                >
                  Enquire to attend
                </Link>
              )}
            </div>
            {related.length > 0 ? (
              <div className="rounded-2xl border border-[#dce5e7] bg-white p-5 shadow-sm">
                <h2 className="mb-4 font-display text-lg text-brand-ink">Other events</h2>
                <ul className="space-y-4">
                  {related.map((e) => (
                    <li key={e.slug} className="border-t border-[#eef3f4] pt-4 first:border-0 first:pt-0">
                      <Link href={`/events/${e.slug}`} className="block text-sm font-semibold text-brand-ink hover:text-brand-teal">
                        {e.title}
                      </Link>
                      <span className="mt-1 block text-xs text-brand-muted">{formatDate(e.date)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </aside>
        </div>
      </section>
    </>
  );
}
