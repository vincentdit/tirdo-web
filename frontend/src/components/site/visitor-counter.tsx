"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";

// Footer visitor counter. Fetches the all-time total-visits number from the
// server route (which talks to Matomo); renders nothing extra if analytics
// isn't configured yet.
export function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch("/api/analytics")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!alive) return;
        setCount(typeof d?.totalVisits === "number" ? d.totalVisits : null);
        setLoaded(true);
      })
      .catch(() => alive && setLoaded(true));
    return () => {
      alive = false;
    };
  }, []);

  // Nothing to show until we have a real number.
  if (loaded && count === null) return null;

  return (
    <div className="inline-flex items-center gap-3 rounded-lg bg-white/10 px-4 py-3">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-brand-gold text-brand-ink">
        <Users className="h-5 w-5" />
      </span>
      <span>
        <span className="block text-[1.6rem] font-bold leading-none tabular-nums text-white">
          {count === null ? "…" : count.toLocaleString("en-US")}
        </span>
        <span className="mt-1 block text-xs text-[#cfe0ea]">Total Site Visitors</span>
      </span>
    </div>
  );
}
