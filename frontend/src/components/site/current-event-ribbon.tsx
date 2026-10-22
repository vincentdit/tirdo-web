"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Pin } from "lucide-react";
import type { EventItem } from "@/lib/content";
import { formatDate } from "@/lib/utils";

export function CurrentEventRibbon({ events }: { events: EventItem[] }) {
  const item = events[0];
  if (!item) return null;
  const extra = events.length - 1;

  return (
    <div className="border-b border-brand-gold/40 bg-[#fff8e8]">
      <div className="container-tirdo flex min-h-[56px] flex-wrap items-center gap-x-3 gap-y-2 py-2 text-sm">
        <span className="inline-flex items-center gap-1 bg-brand-gold px-2 py-1 text-[0.68rem] font-bold tracking-wide text-brand-ink">
          <Pin className="h-3 w-3" /> EVENT
        </span>
        {item.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.logo} alt="" className="h-8 w-8 rounded bg-white object-contain p-0.5" />
        ) : null}
        <strong className="min-w-0 flex-1 text-brand-ink">{item.title}</strong>
        <span className="text-brand-muted">{formatDate(item.date)}</span>
        <span className="ml-auto inline-flex shrink-0 items-center gap-4">
          {item.registerUrl ? (
            <RegisterLink href={item.registerUrl} className="font-bold text-brand-teal hover:underline">
              Register
            </RegisterLink>
          ) : null}
          <Link href={`/events/${item.slug}`} className="font-bold text-brand-teal hover:underline">
            Details
          </Link>
          {extra > 0 ? (
            <Link href="/events" className="text-xs text-brand-muted hover:underline">
              +{extra} more
            </Link>
          ) : null}
        </span>
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
