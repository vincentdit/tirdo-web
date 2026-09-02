import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroSlider } from "@/components/site/hero-slider";
import { Icon } from "@/components/site/icon";
import { coreActivities, services, directorMessage } from "@/lib/content";
import { formatDate } from "@/lib/utils";
import { getNews } from "@/lib/strapi";

export default async function HomePage() {
  const news = await getNews(3);
  const latest = news[0];

  return (
    <>
      <HeroSlider />

      {/* Latest announcement */}
      {latest && (
        <section className="border-b border-brand-pale">
          <div className="container-tirdo flex min-h-[75px] flex-wrap items-center gap-x-5 gap-y-2 py-4 text-sm">
            <span className="bg-brand-gold px-2 py-1 text-[0.68rem] font-bold tracking-wide text-brand-ink">LATEST</span>
            <strong className="text-brand-ink">{latest.title}</strong>
            <Link href={`/news/${latest.slug}`} className="ml-auto inline-flex shrink-0 items-center gap-1 font-bold text-brand-teal hover:gap-2">
              Read announcement <ArrowRight className="h-4 w-4 transition-all" />
            </Link>
          </div>
        </section>
      )}

      {/* Welcome / intro */}
      <section className="container-tirdo grid gap-12 py-20 md:grid-cols-2 md:gap-20 md:py-24">
        <div>
          <p className="eyebrow mb-3 text-brand-teal">Welcome to TIRDO</p>
          <h2 className="font-display text-[2rem] leading-tight text-brand-ink md:text-[2.6rem]">
            Research that moves industry forward.
          </h2>
        </div>
        <div className="md:pt-7">
          <p className="text-[1.05rem] text-brand-muted">
            Tanzania Industrial Research and Development Organization is a multidisciplinary R&amp;D
            institution established in 1979. We help industry solve practical challenges, strengthen
            technology capability and create value from Tanzania&apos;s resources.
          </p>
          <Link href="/about" className="mt-5 inline-flex items-center gap-1 text-sm font-bold uppercase tracking-wide text-brand-teal hover:gap-2">
            Learn about our mandate <ArrowRight className="h-4 w-4 transition-all" />
          </Link>
        </div>
      </section>

      {/* Core activities */}
      <section className="bg-brand-pale py-20">
        <div className="container-tirdo">
          <div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow mb-2 text-brand-teal">What we do</p>
              <h2 className="font-display text-[2rem] text-brand-ink md:text-[2.6rem]">Our core activities</h2>
            </div>
            <p className="max-w-sm text-brand-muted">
              Practical science, technical expertise and innovation support for an industrial Tanzania.
            </p>
          </div>
          <div className="grid gap-px overflow-hidden bg-[#dce5e7] sm:grid-cols-2 lg:grid-cols-4">
            {coreActivities.map((a, idx) => (
              <article key={a.title} className="flex min-h-[280px] flex-col bg-white p-6">
                <span className="text-[0.76rem] font-bold text-[#a4b7ba]">{String(idx + 1).padStart(2, "0")}</span>
                <span className="my-4 text-brand-teal"><Icon name={a.icon} className="h-8 w-8" /></span>
                <h3 className="mb-2 text-lg font-semibold text-brand-ink">{a.title}</h3>
                <p className="flex-1 text-sm text-brand-muted">{a.description}</p>
                <Link href="/departments" className="mt-3 inline-flex items-center gap-1 text-[0.76rem] font-bold uppercase tracking-wide text-brand-teal hover:gap-2">
                  Explore <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Industrial services */}
      <section className="container-tirdo py-20 md:py-24">
        <div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow mb-2 text-brand-teal">Digital access</p>
            <h2 className="font-display text-[2rem] text-brand-ink md:text-[2.6rem]">Industrial services</h2>
          </div>
          <Link href="/services" className="inline-flex items-center gap-2 border border-brand-teal px-4 py-3 text-[0.78rem] font-bold uppercase tracking-wide text-brand-teal hover:bg-brand-teal hover:text-white">
            View all services <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Link key={s.slug} href={`/services/${s.slug}`} className="group flex min-h-[210px] flex-col border p-6 transition-all hover:-translate-y-1 hover:border-brand-teal hover:shadow-[0_9px_20px_rgba(6,48,68,0.08)]">
              <span className="mb-4 text-brand-teal"><Icon name={s.icon} className="h-7 w-7" /></span>
              <h3 className="mb-2 text-lg font-semibold text-brand-ink">{s.title}</h3>
              <p className="flex-1 text-sm text-brand-muted">{s.description}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-[0.75rem] font-bold uppercase tracking-wide text-brand-teal">
                Access service <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Leadership message */}
      <section className="bg-brand-blue text-white">
        <div className="container-tirdo grid items-center gap-10 md:grid-cols-[38%_1fr] md:gap-16">
          <div className="h-[360px] overflow-hidden md:h-[460px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={directorMessage.photo} alt={directorMessage.name} className="h-full w-full object-cover object-top" />
          </div>
          <div className="py-12 md:py-14">
            <p className="eyebrow mb-3 text-brand-gold">Leadership message</p>
            <h2 className="max-w-2xl font-display text-[1.9rem] leading-tight md:text-[2.5rem]">
              Working together for a capable, competitive industrial economy.
            </h2>
            <p className="mt-5 max-w-2xl text-[1.05rem] text-[#dce8f2]">&ldquo;{directorMessage.quote}&rdquo;</p>
            <strong className="mt-6 block">{directorMessage.name}</strong>
            <small className="mb-6 block text-[#b8cce3]">{directorMessage.role}</small>
            <Link href="/about/administration" className="inline-flex items-center gap-4 bg-white px-5 py-3.5 text-[0.78rem] font-bold uppercase tracking-wide text-brand-blue hover:bg-brand-pale">
              Read the full message <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* News & innovations */}
      <section className="container-tirdo py-20 md:py-24">
        <div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow mb-2 text-brand-teal">From TIRDO</p>
            <h2 className="font-display text-[2rem] text-brand-ink md:text-[2.6rem]">News &amp; innovations</h2>
          </div>
          <Link href="/news" className="inline-flex items-center gap-1 text-sm font-bold uppercase tracking-wide text-brand-teal hover:gap-2">
            View all news <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-5 lg:grid-cols-[2fr_1fr_1fr]">
          {latest && (
            <Link href={`/news/${latest.slug}`} className="group relative h-[350px] overflow-hidden text-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={latest.image} alt={latest.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(8,40,62,0.85),transparent_65%)]" />
              <div className="absolute bottom-0 z-10 p-6">
                <span className="text-[0.65rem] font-bold uppercase tracking-wide text-brand-gold">{latest.category} · {formatDate(latest.date)}</span>
                <h3 className="my-2 text-[1.3rem] font-semibold leading-snug">{latest.title}</h3>
                <span className="inline-flex items-center gap-1 text-sm font-bold uppercase tracking-wide">Read story <ArrowRight className="h-4 w-4" /></span>
              </div>
            </Link>
          )}
          {news.slice(1, 3).map((n) => (
            <Link key={n.slug} href={`/news/${n.slug}`} className="flex h-[350px] flex-col justify-end border-t-4 border-brand-teal bg-brand-pale p-6">
              <span className="text-[0.65rem] font-bold uppercase tracking-wide text-brand-teal">{n.category} · {formatDate(n.date)}</span>
              <h3 className="my-3 text-[1.2rem] font-semibold leading-snug text-brand-ink">{n.title}</h3>
              <span className="inline-flex items-center gap-1 text-[0.76rem] font-bold uppercase tracking-wide text-brand-teal">Read story <ArrowRight className="h-4 w-4" /></span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
