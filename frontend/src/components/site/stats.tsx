"use client";

import { useEffect, useRef, useState } from "react";
import { stats } from "@/lib/content";

function Counter({ value, suffix }: { value: number; suffix?: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          const duration = 1500;
          const start = performance.now();
          const tick = (t: number) => {
            const p = Math.min((t - start) / duration, 1);
            setN(Math.floor(p * value));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-4xl font-extrabold text-white sm:text-5xl">
      {n.toLocaleString()}
      {suffix}
    </div>
  );
}

export function Stats() {
  return (
    <section className="bg-primary-dark py-14">
      <div className="container-tirdo grid grid-cols-2 gap-8 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <Counter value={s.value} suffix={s.suffix} />
            <div className="mt-2 text-sm font-medium uppercase tracking-wide text-accent">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
