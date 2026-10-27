"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import type { EventItem, FloatingNotice } from "@/lib/content";
import {
  mergeFloatingNotices,
  nextFloatingNotice,
  NOTICE_DISMISS_KEY,
  parseDismissedNotices,
} from "@/lib/content";
import { useBrand } from "@/components/site/brand-provider";
import { RegisterLink } from "@/components/site/current-event-ribbon";

function readDismissed(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return parseDismissedNotices(sessionStorage.getItem(NOTICE_DISMISS_KEY));
  } catch {
    return [];
  }
}

function writeDismissed(ids: string[]) {
  try {
    sessionStorage.setItem(NOTICE_DISMISS_KEY, JSON.stringify(ids));
  } catch {
    /* private mode */
  }
}

export function FloatingEventPin({
  events = [],
  notices: incoming = [],
}: {
  events?: EventItem[];
  notices?: FloatingNotice[];
}) {
  const brand = useBrand();
  const notices = useMemo(
    () => (incoming.length ? incoming : mergeFloatingNotices(events)),
    [incoming, events]
  );
  const [ready, setReady] = useState(false);
  const [dismissed, setDismissed] = useState<string[]>([]);

  useEffect(() => {
    setDismissed(readDismissed());
    setReady(true);
  }, []);

  const notice = ready ? nextFloatingNotice(notices, dismissed) : null;

  const dismiss = useCallback((item: FloatingNotice) => {
    setDismissed((prev) => {
      const next = prev.includes(item.id) ? prev : [...prev, item.id];
      writeDismissed(next);
      return next;
    });
  }, []);

  useEffect(() => {
    if (!notice) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss(notice);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [notice, dismiss]);

  if (!notice) return null;

  const logo = notice.logo || brand.logo;

  return (
    <aside
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[90] flex justify-end p-3 sm:p-4"
      style={{
        paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
        paddingRight: "max(0.75rem, env(safe-area-inset-right))",
      }}
      aria-label="Site notification"
    >
      <div className="pointer-events-auto origin-bottom-right motion-safe:animate-notice-float motion-reduce:animate-none">
      <div
        role="dialog"
        aria-modal="false"
        aria-labelledby="tirdo-notice-title"
        className="relative w-[min(16.5rem,calc(100vw-1.5rem))] origin-bottom-right overflow-hidden rounded-2xl bg-primary text-primary-foreground shadow-[0_16px_40px_rgba(9,42,69,0.28)] motion-safe:animate-notice-pop motion-reduce:animate-none"
      >
        <div className="pointer-events-none absolute inset-0 opacity-20" aria-hidden>
          <div className="absolute -right-10 top-0 h-28 w-28 rounded-full bg-accent blur-2xl" />
        </div>
        <div className="relative flex items-center gap-2.5 px-3 py-2.5">
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt="" className="h-8 w-8 shrink-0 rounded-md border border-white/25 bg-white object-contain p-0.5" />
          ) : null}
          <div className="min-w-0 flex-1">
            <h2 id="tirdo-notice-title" className="text-sm font-semibold leading-snug text-white">
              {notice.title}
            </h2>
          </div>
          <button
            type="button"
            className="rounded-md p-1 text-white/80 hover:bg-white/10 hover:text-white"
            aria-label="Dismiss notification"
            onClick={() => dismiss(notice)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="relative border-t border-white/15 px-4 py-3">
          <RegisterLink
            href={notice.href}
            className="inline-flex w-full items-center justify-center rounded-md bg-accent px-3 py-2 text-xs font-bold uppercase tracking-wide text-accent-foreground transition hover:brightness-95"
          >
            {notice.actionLabel}
          </RegisterLink>
        </div>
      </div>
      </div>
    </aside>
  );
}
