import Link from "next/link";
import { Clock, MapPin, Pin } from "lucide-react";
import { RegisterLink } from "@/components/site/current-event-ribbon";
import type { EventItem } from "@/lib/content";
import { eventDateBadge, formatDateRange } from "@/lib/utils";

export function EventDateBadge({ date, className = "" }: { date?: string; className?: string }) {
  const { day, month } = eventDateBadge(date);
  if (!day) return null;
  return (
    <div
      className={`grid min-w-[3.4rem] place-items-center rounded-xl bg-gradient-to-b from-brand-teal to-brand-navy px-2.5 py-1.5 text-center text-white shadow-md ${className}`}
    >
      <span className="text-[1.35rem] font-black leading-none">{day}</span>
      <span className="mt-0.5 text-[0.62rem] font-bold uppercase tracking-wider">{month}</span>
    </div>
  );
}

export function EventCard({ item, featured = false }: { item: EventItem; featured?: boolean }) {
  const when = formatDateRange(item.date, item.endDate);
  const href = `/events/${item.slug}`;

  return (
    <article className="group h-full overflow-hidden rounded-2xl bg-white shadow-[0_10px_28px_rgba(9,42,69,0.08)] ring-1 ring-black/[0.04] transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(9,42,69,0.12)]">
      <Link href={href} className="block">
        <div className={`relative overflow-hidden bg-brand-pale ${featured ? "aspect-[16/9]" : "aspect-[16/10]"}`}>
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
          <EventDateBadge date={item.date} className="absolute right-3 top-3" />
          {item.pinned ? (
            <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-brand-gold px-2 py-0.5 text-[0.62rem] font-bold text-brand-ink">
              <Pin className="h-3 w-3" /> Pinned
            </span>
          ) : null}
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-[1.05rem] font-bold uppercase leading-snug tracking-wide text-brand-ink">
          <Link href={href} className="hover:text-brand-teal">
            {item.title}
          </Link>
        </h3>
        <div className="mt-4 space-y-1.5 text-sm text-brand-muted">
          {item.location ? (
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-teal" />
              <span>{item.location}</span>
            </p>
          ) : null}
          {when ? (
            <p className="flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0 text-brand-teal" />
              <span>{when}</span>
            </p>
          ) : null}
        </div>
        {item.registerUrl ? (
          <RegisterLink
            href={item.registerUrl}
            className="mt-4 inline-flex w-fit items-center text-xs font-bold uppercase tracking-wide text-brand-teal hover:underline"
          >
            Register
          </RegisterLink>
        ) : null}
      </div>
    </article>
  );
}

export function EventCompactRow({ item }: { item: EventItem }) {
  const when = formatDateRange(item.date, item.endDate);
  return (
    <li className="flex flex-col gap-4 rounded-2xl border border-[#dce5e7] bg-white p-4 shadow-sm transition hover:border-brand-teal/40 hover:shadow-md sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-4">
        <EventDateBadge date={item.date} className="shrink-0" />
        <div className="min-w-0">
          <h3 className="font-semibold uppercase leading-snug text-brand-ink">
            <Link href={`/events/${item.slug}`} className="hover:text-brand-teal">
              {item.title}
            </Link>
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-brand-muted">
            {when ? (
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-brand-teal" /> {when}
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
