"use client";

import { useState } from "react";
import Link from "next/link";
import { Pin, X } from "lucide-react";
import type { EventItem } from "@/lib/content";
import { formatDate } from "@/lib/utils";
import { RegisterLink } from "@/components/site/current-event-ribbon";

export function FloatingEventPin({ events }: { events: EventItem[] }) {
  const pinned = events.filter((item) => item.pinned && item.notifyOnSite !== false);
  const item = pinned[0];
  const extra = pinned.length - 1;
  const [open, setOpen] = useState(false);
  if (!item) return null;

  const logo = item.logo;
  const when = [formatDate(item.date), item.endDate ? formatDate(item.endDate) : ""]
    .filter(Boolean)
    .join(" – ");

  return (
    <div className="pointer-events-none fixed bottom-20 right-4 z-[90] flex flex-col items-center gap-3 sm:right-6">
      {open ? (
        <div className="pointer-events-auto w-[min(20rem,calc(100vw-2rem))] rounded-xl border border-brand-gold/50 bg-white p-4 shadow-[0_12px_32px_rgba(9,42,69,0.18)]">
          <div className="mb-2 flex items-start justify-between gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-gold px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-brand-ink">
              <Pin className="h-3 w-3" /> Pinned event
            </span>
            <button
              type="button"
              className="rounded p-1 text-brand-muted hover:bg-brand-pale hover:text-brand-ink"
              aria-label="Close event"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="overflow-hidden">
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logo} alt="" className="event-pin-wrap mr-2 h-12 w-12 rounded-full border border-brand-gold bg-[#fff8e8] object-contain p-0.5" />
            ) : null}
            {item.title ? <p className="font-semibold leading-snug text-brand-ink">{item.title}</p> : null}
            {when ? <p className="mt-1 text-xs font-medium text-brand-gold">{when}</p> : null}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {item.registerUrl ? (
              <RegisterLink
                href={item.registerUrl}
                className="inline-flex rounded-md bg-brand-teal px-3 py-1.5 text-xs font-bold text-white hover:brightness-110"
              >
                Register
              </RegisterLink>
            ) : null}
            <Link
              href={`/events/${item.slug}`}
              className="inline-flex rounded-md border border-brand-teal px-3 py-1.5 text-xs font-bold text-brand-teal hover:bg-brand-teal hover:text-white"
            >
              Details
            </Link>
            {extra > 0 ? (
              <Link href="/events" className="inline-flex items-center text-xs font-semibold text-brand-muted hover:underline">
                +{extra} more
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}

      <button
        type="button"
        className="pointer-events-auto flex flex-col items-center"
        aria-label={open ? "Hide pinned event" : `Pinned event: ${item.title || "TIRDO event"}`}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-brand-gold text-brand-ink shadow-[0_8px_24px_rgba(242,197,0,0.55)]">
          <span className="absolute inset-0 rounded-full bg-brand-gold/70 motion-safe:animate-pin-ping" />
          <span className="absolute inset-[-6px] rounded-full border-2 border-brand-gold/50 motion-safe:animate-pin-ping" />
          <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-brand-gold motion-safe:animate-pin-blink">
            <Pin className="h-7 w-7" />
          </span>
        </span>
        {(logo || item.title || when) ? (
          <span className="mt-2 w-[11.5rem] overflow-hidden rounded-xl border border-brand-gold bg-[#fff8e8] px-2 py-2 text-left shadow-[0_6px_16px_rgba(9,42,69,0.18)]">
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logo}
                alt=""
                className="event-pin-wrap mr-2 h-11 w-11 rounded-full border border-brand-gold bg-white object-contain p-0.5"
              />
            ) : null}
            {item.title ? (
              <span className="text-[11px] font-semibold leading-snug text-brand-ink">{item.title}</span>
            ) : null}
            {when ? <span className="mt-0.5 block text-[10px] font-medium text-[#b8860b]">{when}</span> : null}
          </span>
        ) : null}
      </button>
    </div>
  );
}
