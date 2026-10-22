import Link from "next/link";
import { ArrowRight, Calendar, MapPin, Pin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RegisterLink } from "@/components/site/current-event-ribbon";
import type { EventItem } from "@/lib/content";
import { formatDateRange } from "@/lib/utils";

export function EventCard({ item, featured = false }: { item: EventItem; featured?: boolean }) {
  const when = formatDateRange(item.date, item.endDate);
  const href = `/events/${item.slug}`;

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-[#dce5e7] bg-white shadow-[0_8px_24px_rgba(9,42,69,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-teal/40 hover:shadow-[0_16px_32px_rgba(9,42,69,0.1)] ${
        featured ? "md:flex-row" : ""
      }`}
    >
      <Link
        href={href}
        className={`relative block overflow-hidden bg-brand-pale ${featured ? "md:w-[44%] md:min-h-[280px]" : "aspect-[16/9]"}`}
      >
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            loading="lazy"
            decoding="async"
            src={item.image}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full min-h-[180px] place-items-center bg-gradient-to-br from-brand-teal/15 via-brand-pale to-brand-gold/20 text-brand-teal/40">
            <span className="font-display text-4xl font-black">TIRDO</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/35 via-transparent to-transparent" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {item.category ? <Badge variant="accent">{item.category}</Badge> : null}
          {item.pinned ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-gold px-2.5 py-0.5 text-[0.65rem] font-bold text-brand-ink">
              <Pin className="h-3 w-3" /> Pinned
            </span>
          ) : null}
        </div>
        {item.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.logo}
            alt=""
            className="absolute bottom-3 left-3 h-12 w-12 rounded-full border border-white/80 bg-white object-contain p-1 shadow"
          />
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-brand-muted">
          {when ? (
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-brand-teal" /> {when}
            </span>
          ) : null}
          {item.location ? (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-brand-teal" /> {item.location}
            </span>
          ) : null}
        </div>
        <h3 className="mb-2 font-display text-xl font-semibold leading-snug text-brand-ink group-hover:text-brand-teal">
          <Link href={href}>{item.title}</Link>
        </h3>
        {item.description ? <p className="mb-5 line-clamp-3 flex-1 text-sm leading-relaxed text-brand-muted">{item.description}</p> : <div className="flex-1" />}
        <div className="flex flex-wrap gap-2">
          <Link
            href={href}
            className="inline-flex items-center gap-1 rounded-md border border-brand-teal px-3.5 py-2 text-xs font-bold uppercase tracking-wide text-brand-teal transition hover:bg-brand-teal hover:text-white"
          >
            View details <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          {item.registerUrl ? (
            <RegisterLink
              href={item.registerUrl}
              className="inline-flex items-center rounded-md bg-brand-teal px-3.5 py-2 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-brand-teal-dark"
            >
              Register
            </RegisterLink>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function EventCompactRow({ item }: { item: EventItem }) {
  const when = formatDateRange(item.date, item.endDate);
  return (
    <li className="flex flex-col gap-4 rounded-2xl border border-[#dce5e7] bg-white p-5 shadow-sm transition hover:border-brand-teal/40 hover:shadow-md sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-4">
        {item.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.logo} alt="" className="h-12 w-12 shrink-0 rounded-full border border-brand-gold/40 bg-[#fff8e8] object-contain p-1" />
        ) : (
          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-gold text-brand-ink">
            <Calendar className="h-5 w-5" />
          </span>
        )}
        <div className="min-w-0">
          <h3 className="font-semibold text-brand-ink">
            <Link href={`/events/${item.slug}`} className="hover:text-brand-teal">
              {item.title}
            </Link>
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-brand-muted">
            {when ? (
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-brand-teal" /> {when}
              </span>
            ) : null}
            {item.location ? (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-brand-teal" /> {item.location}
              </span>
            ) : null}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 sm:shrink-0">
        <Link
          href={`/events/${item.slug}`}
          className="inline-flex items-center rounded-md border border-brand-teal px-3 py-2 text-xs font-bold uppercase tracking-wide text-brand-teal transition hover:bg-brand-teal hover:text-white"
        >
          Details
        </Link>
        {item.registerUrl ? (
          <RegisterLink
            href={item.registerUrl}
            className="inline-flex items-center rounded-md bg-brand-teal px-3 py-2 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-brand-teal-dark"
          >
            Register
          </RegisterLink>
        ) : null}
      </div>
    </li>
  );
}
