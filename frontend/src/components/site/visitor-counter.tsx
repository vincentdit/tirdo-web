"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Users, ArrowUpRight } from "lucide-react";

type Stats = { today: number | null; month: number | null; total: number | null };

const fmt = (n: number | null) => (typeof n === "number" ? n.toLocaleString("en-US") : "…");

export function VisitorCounter() {
  const t = useTranslations("visitors");
  const [s, setS] = useState<Stats>({ today: null, month: null, total: null });

  useEffect(() => {
    let alive = true;
    fetch("/api/analytics", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: Stats | null) => {
        if (!alive || !d) return;
        setS({
          today: typeof d.today === "number" ? d.today : 0,
          month: typeof d.month === "number" ? d.month : 0,
          total: typeof d.total === "number" ? d.total : 0,
        });
      })
      .catch(() => {
        if (alive) setS({ today: 0, month: 0, total: 0 });
      });
    return () => {
      alive = false;
    };
  }, []);

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
          <span className="mt-1 block text-xs text-[#cfe0ea]">{t("total")}</span>
        </span>
        <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-[#cfe0ea] opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <span className="rounded bg-white/5 px-3 py-2">
          <span className="block text-sm font-bold tabular-nums text-white">{s ? fmt(s.today) : "…"}</span>
          <span className="block text-[0.68rem] uppercase tracking-wide text-[#a7c0d1]">{t("today")}</span>
        </span>
        <span className="rounded bg-white/5 px-3 py-2">
          <span className="block text-sm font-bold tabular-nums text-white">{s ? fmt(s.month) : "…"}</span>
          <span className="block text-[0.68rem] uppercase tracking-wide text-[#a7c0d1]">{t("thisMonth")}</span>
        </span>
      </div>
    </Link>
  );
}
