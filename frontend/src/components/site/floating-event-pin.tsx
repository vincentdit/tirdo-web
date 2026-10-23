"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, ChevronRight, X } from "lucide-react";
import type { EventItem } from "@/lib/content";
import { formatDate } from "@/lib/utils";
import { RegisterLink } from "@/components/site/current-event-ribbon";

export function FloatingEventPin({ events }: { events: EventItem[] }) {
  const items = events.filter((item) => item.notifyOnSite !== false);
  const [open, setOpen] = useState(true);
  if (!items.length) return null;

  const loop = items.length > 1 ? [...items, ...items] : items;
  const duration = Math.max(16, items.length * 8);

  if (!open) {
    return (
      <button
        type="button"
        className="fixed right-0 top-1/3 z-[90] rounded-l-md bg-brand-gold px-2 py-4 text-[0.65rem] font-bold uppercase tracking-wide text-brand-ink shadow-lg"
        aria-label="Open event notification"
        onClick={() => setOpen(true)}
      >
        <span className="flex flex-col items-center gap-1">
          <Bell className="h-4 w-4" />
          <span className="[writing-mode:vertical-rl] rotate-180">Notification</span>
        </span>
      </button>
    );
  }

  return (
    <aside
      className="fixed right-0 top-28 z-[90] w-[min(18.5rem,calc(100vw-1rem))] overflow-hidden rounded-l-xl border border-r-0 border-brand-gold/60 bg-white shadow-[0_12px_32px_rgba(9,42,69,0.18)] sm:top-32"
      aria-label="Event notification"
    >
      <div className="flex items-center justify-between bg-brand-gold px-3 py-2 text-brand-ink">
        <span className="inline-flex items-center gap-1.5 text-[0.72rem] font-bold uppercase tracking-wide">
          <Bell className="h-3.5 w-3.5" /> Notification
        </span>
        <button
          type="button"
          className="rounded p-0.5 hover:bg-black/10"
          aria-label="Hide notification"
          onClick={() => setOpen(false)}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="h-[220px] overflow-hidden bg-[#fffdf6]">
        <div
          className="event-ticker-y motion-reduce:animate-none"
          style={{ animationDuration: `${duration}s` }}
        >
          {loop.map((item, index) => (
            <article key={`${item.slug}-${index}`} className="border-b border-brand-gold/20 px-3 py-3 hover:bg-white">
              <span className="inline-block bg-brand-teal px-1.5 py-0.5 text-[0.58rem] font-bold uppercase tracking-wide text-white">
                New
              </span>
              <Link href={`/events/${item.slug}`} className="mt-1 block text-sm font-semibold leading-snug text-brand-ink hover:underline">
                {item.title}
              </Link>
              <p className="mt-1 text-[11px] text-brand-muted">{formatDate(item.date)}</p>
              {item.registerUrl ? (
                <RegisterLink href={item.registerUrl} className="mt-1 inline-block text-[11px] font-bold text-brand-teal">
                  Register
                </RegisterLink>
              ) : null}
            </article>
          ))}
        </div>
      </div>
      <Link
        href="/events"
        className="flex items-center justify-between bg-brand-navy px-3 py-2 text-xs font-semibold text-white hover:bg-brand-blue"
      >
        View events
        <ChevronRight className="h-4 w-4" />
      </Link>
    </aside>
  );
}
