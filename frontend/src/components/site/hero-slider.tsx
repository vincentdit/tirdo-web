"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Pause, Play } from "lucide-react";
import { heroSlides } from "@/lib/content";
import { cn } from "@/lib/utils";

export function HeroSlider() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useRef(false);
  const n = heroSlides.length;

  // Respect the user's reduced-motion preference: no auto-advance.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduceMotion.current = mq.matches;
    if (mq.matches) setPaused(true);
    const onChange = (e: MediaQueryListEvent) => setPaused(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((v) => (v + 1) % n), 6000);
    return () => clearInterval(t);
  }, [n, paused]);

  const slide = heroSlides[i];

  return (
    <section
      className="relative h-[470px] overflow-hidden text-white md:h-[515px]"
      aria-roledescription="carousel"
      aria-label="TIRDO highlights"
    >
      {heroSlides.map((s, idx) => (
        // Decorative — the headline text is provided in the overlay below.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={idx}
          src={s.image}
          alt=""
          aria-hidden="true"
          className={cn(
            "absolute inset-0 h-full w-full object-cover object-[center_42%] transition-opacity duration-700 motion-reduce:transition-none",
            idx === i ? "opacity-100" : "opacity-0"
          )}
        />
      ))}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,42,59,0.87)_0%,rgba(7,54,73,0.6)_40%,transparent_70%)]" />

      <div className="container-tirdo relative flex h-full flex-col justify-center">
        <div key={i} className="max-w-[520px] animate-fade-in motion-reduce:animate-none" aria-live="polite">
          <p className="eyebrow mb-3 text-white/90">TIRDO AT A GLANCE</p>
          <h2 className="font-display text-[2.25rem] leading-[1.1] md:text-[3.15rem]">{slide.title}</h2>
          <p className="mb-7 mt-4 text-base md:text-[1.08rem]">{slide.subtitle}</p>
          <Link
            href={slide.href}
            className="inline-flex items-center gap-5 bg-white px-5 py-3.5 text-[0.78rem] font-bold uppercase tracking-wide text-brand-blue hover:bg-brand-pale"
          >
            {slide.cta} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-3">
        <div className="flex gap-2">
          {heroSlides.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              aria-label={`Go to slide ${idx + 1}: ${s.title}`}
              aria-current={idx === i}
              className={cn("h-2 rounded-full transition-all motion-reduce:transition-none", idx === i ? "w-6 bg-brand-gold" : "w-2 bg-white/50 hover:bg-white/80")}
            />
          ))}
        </div>
        <button
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? "Play slideshow" : "Pause slideshow"}
          className="ml-1 grid h-7 w-7 place-items-center rounded-full bg-white/20 text-white hover:bg-white/30"
        >
          {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
        </button>
      </div>
    </section>
  );
}
