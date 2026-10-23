"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import type { EventItem } from "@/lib/content";
import { formatDate } from "@/lib/utils";

function TickerItem({ item }: { item: EventItem }) {
  return (
    <span className="inline-flex items-center gap-3 px-8 text-sm text-brand-ink">
      {item.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.logo} alt="" className="h-7 w-7 rounded bg-white object-contain p-0.5" />
      ) : null}
      <strong className="whitespace-nowrap">{item.title}</strong>
      <span className="whitespace-nowrap text-brand-muted">{formatDate(item.date)}</span>
      {item.location ? <span className="whitespace-nowrap text-brand-muted">· {item.location}</span> : null}
      {item.registerUrl ? (
        <RegisterLink href={item.registerUrl} className="whitespace-nowrap font-bold text-brand-teal hover:underline">
          Register
        </RegisterLink>
      ) : null}
      <Link href={`/events/${item.slug}`} className="whitespace-nowrap font-bold text-brand-teal hover:underline">
        Details
      </Link>
    </span>
  );
}

export function CurrentEventRibbon({ events }: { events: EventItem[] }) {
  if (!events.length) return null;
  const loop = [...events, ...events];
  const duration = Math.max(22, events.length * 14);

  return (
    <div className="border-b border-brand-gold/50 bg-[#fff8e8]" role="region" aria-label="Event notification">
      <div className="flex min-h-[48px] items-stretch">
        <span className="z-10 inline-flex shrink-0 items-center gap-1.5 bg-brand-gold px-3 text-[0.68rem] font-bold uppercase tracking-wide text-brand-ink">
          <Bell className="h-3.5 w-3.5" /> Notification
        </span>
        <div className="min-w-0 flex-1 overflow-hidden">
          <div
            className="event-ticker-track flex w-max items-center py-2 motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:animate-none"
            style={{ animationDuration: `${duration}s` }}
          >
            {loop.map((item, index) => (
              <TickerItem key={`${item.slug}-${index}`} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function RegisterLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  const external = /^https?:\/\//i.test(href);
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
