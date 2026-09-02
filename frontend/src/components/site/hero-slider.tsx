"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { heroSlides } from "@/lib/content";
import { assets } from "@/lib/site";
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
    <section className="relative h-[470px] overflow-hidden text-white md:h-[515px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={assets.hero} alt="TIRDO leadership and team" className="absolute inset-0 h-full w-full object-cover object-[center_42%]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,42,59,0.87)_0%,rgba(7,54,73,0.6)_40%,transparent_70%)]" />

      <div className="container-tirdo relative flex h-full flex-col justify-center">
        <div key={i} className="max-w-[520px] animate-fade-in">
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

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        {heroSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            aria-label={`Slide ${idx + 1}`}
            className={cn("h-2 rounded-full transition-all", idx === i ? "w-6 bg-brand-gold" : "w-2 bg-white/50")}
          />
        ))}
      </div>
    </section>
  );
}
