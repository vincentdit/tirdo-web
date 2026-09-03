"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Users, ArrowUpRight } from "lucide-react";

type Stats = { today: number | null; month: number | null; total: number | null };

const fmt = (n: number | null) => (typeof n === "number" ? n.toLocaleString("en-US") : "—");

// Footer visitor widget: total (headline) + today + this month, linking to the
// analytics dashboard. Renders nothing until analytics is configured.
export function VisitorCounter() {
  const [s, setS] = useState<Stats | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch("/api/analytics")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: Stats | null) => {
        if (!alive) return;
        setS(d);
        setLoaded(true);
      })
      .catch(() => alive && setLoaded(true));
    return () => {
      alive = false;
    };
  }, []);

  const hasData = s && (s.total !== null || s.today !== null || s.month !== null);
  if (loaded && !hasData) return null;

  return (
    <Link
      href="/analytics"
      className="group block rounded-lg bg-white/10 p-4 transition-colors hover:bg-white/[0.14]"
      aria-label="View the analytics dashboard"
    >
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-brand-gold text-brand-ink">
          <Users className="h-5 w-5" />
        </span>
        <span className="min-w-0">
          <span className="block text-[1.6rem] font-bold leading-none tabular-nums text-white">
            {s ? fmt(s.total) : "…"}
          </span>
          <span className="mt-1 block text-xs text-[#cfe0ea]">Total Site Visitors</span>
        </span>
        <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-[#cfe0ea] opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <span className="rounded bg-white/5 px-3 py-2">
          <span className="block text-sm font-bold tabular-nums text-white">{s ? fmt(s.today) : "…"}</span>
          <span className="block text-[0.68rem] uppercase tracking-wide text-[#a7c0d1]">Today</span>
        </span>
        <span className="rounded bg-white/5 px-3 py-2">
          <span className="block text-sm font-bold tabular-nums text-white">{s ? fmt(s.month) : "…"}</span>
          <span className="block text-[0.68rem] uppercase tracking-wide text-[#a7c0d1]">This month</span>
        </span>
      </div>
    </Link>
  );
}
