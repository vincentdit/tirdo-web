"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { heroSlides } from "@/lib/content";
import { cn } from "@/lib/utils";

export function HeroSlider({ heroImage }: { heroImage?: string }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useRef(false);
  const slides = heroSlides.map((slide, idx) => ({
    ...slide,
    image: idx === 0 && heroImage ? heroImage : slide.image,
  }));
  const n = slides.length;

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

  const slide = slides[i];
  const go = (dir: number) => setI((v) => (v + dir + n) % n);

  return (
    <section
      className="relative h-[calc(100dvh-12.5rem)] min-h-[26rem] w-full overflow-hidden bg-brand-navy text-white sm:min-h-[32rem] md:h-[calc(100dvh-14.5rem)] md:min-h-[36rem] lg:min-h-[42rem]"
      aria-roledescription="carousel"
      aria-label="TIRDO highlights"
    >
      {slides.map((s, idx) =>
        s.image ? (
          // Decorative — the headline text is provided in the overlay below.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={idx}
            src={s.image}
            alt=""
            aria-hidden="true"
            className={cn(
              "absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 motion-reduce:transition-none",
              idx === i ? "opacity-100" : "opacity-0"
            )}
          />
        ) : null
      )}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,42,59,0.18)_0%,rgba(5,42,59,0.12)_45%,rgba(5,42,59,0.82)_100%)]" />

      <button
        type="button"
        onClick={() => go(-1)}
        aria-label="Previous"
        className="absolute left-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/35 text-white backdrop-blur-sm hover:bg-black/50 sm:left-5 sm:h-12 sm:w-12"
      >
        <ChevronLeft className="h-7 w-7" />
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        aria-label="Next"
        className="absolute right-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/35 text-white backdrop-blur-sm hover:bg-black/50 sm:right-5 sm:h-12 sm:w-12"
      >
        <ChevronRight className="h-7 w-7" />
      </button>

      <div className="container-tirdo relative flex h-full flex-col justify-end pb-16 sm:pb-20">
        <div key={i} className="max-w-4xl animate-fade-in motion-reduce:animate-none" aria-live="polite">
          <p className="eyebrow mb-2 text-white/90">TIRDO AT A GLANCE</p>
          <h2 className="font-display text-[2rem] leading-[1.12] drop-shadow-sm sm:text-[2.75rem] md:text-[3.5rem] lg:text-[4rem]">
            {slide.title}
          </h2>
          <p className="mb-6 mt-3 max-w-3xl text-base leading-relaxed text-white/95 sm:text-lg md:text-xl">{slide.subtitle}</p>
          <Link
            href={slide.href}
            className="inline-flex items-center gap-4 bg-white px-6 py-3.5 text-[0.8rem] font-bold uppercase tracking-wide text-brand-blue hover:bg-brand-pale"
          >
            {slide.cta} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-3">
        <div className="flex gap-2">
          {slides.map((s, idx) => (
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
