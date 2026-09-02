"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { heroSlides } from "@/lib/content";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HeroSlider() {
  const [i, setI] = useState(0);
  const n = heroSlides.length;

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % n), 6000);
    return () => clearInterval(t);
  }, [n]);

  const slide = heroSlides[i];

  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      {/* decorative background */}
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-accent blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 h-96 w-96 rounded-full bg-white/30 blur-3xl" />
      </div>

      <div className="container-tirdo relative grid min-h-[460px] items-center gap-8 py-16 lg:grid-cols-2">
        <div key={i} className="animate-fade-in">
          <span className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
            Tanzania Industrial Research &amp; Development Organization
          </span>
          <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">{slide.title}</h1>
          <p className="mt-4 max-w-xl text-base text-white/80 sm:text-lg">{slide.subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={slide.href} variant="accent" size="lg">
              {slide.cta} <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="/contact" variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
              Request a service
            </ButtonLink>
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="relative mx-auto aspect-[4/3] w-full max-w-md rounded-2xl border border-white/20 bg-white/5 p-2 backdrop-blur">
            <div className="grid h-full place-items-center rounded-xl bg-gradient-to-br from-white/10 to-transparent">
              <div className="text-center">
                <div className="text-6xl font-black text-accent">TIRDO</div>
                <p className="mt-2 text-sm text-white/70">Research • Engineering • Innovation</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* controls */}
      <div className="container-tirdo relative flex items-center justify-between pb-6">
        <div className="flex gap-2">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              aria-label={`Slide ${idx + 1}`}
              className={cn("h-2 rounded-full transition-all", idx === i ? "w-8 bg-accent" : "w-2 bg-white/40")}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={() => setI((v) => (v - 1 + n) % n)} aria-label="Previous" className="grid h-9 w-9 place-items-center rounded-full border border-white/30 hover:bg-white/10">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={() => setI((v) => (v + 1) % n)} aria-label="Next" className="grid h-9 w-9 place-items-center rounded-full border border-white/30 hover:bg-white/10">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
