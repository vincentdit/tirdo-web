import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";
import { HeroSlider } from "@/components/site/hero-slider";
import { Stats } from "@/components/site/stats";
import { SectionHeading } from "@/components/site/section-heading";
import { NewsCard, ProjectCard } from "@/components/site/cards";
import { Icon } from "@/components/site/icon";
import { Card, CardContent } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { quickAccess } from "@/lib/site";
import { coreActivities, services, eservices, partners } from "@/lib/content";
import { getNews, getProjects } from "@/lib/strapi";

export default async function HomePage() {
  const [news, projects] = await Promise.all([getNews(3), getProjects()]);

  return (
    <>
      <HeroSlider />

      {/* Quick access strip (NACTVET pattern) */}
      <section className="relative z-10 -mt-8">
        <div className="container-tirdo">
          <div className="grid grid-cols-2 gap-3 rounded-xl border bg-card p-4 shadow-lg sm:grid-cols-3 lg:grid-cols-6">
            {quickAccess.map((q) => (
              <Link key={q.href} href={q.href} className="group flex flex-col items-center gap-2 rounded-lg p-4 text-center transition-colors hover:bg-secondary">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon name={q.icon} className="h-6 w-6" />
                </span>
                <span className="text-xs font-semibold text-foreground/80">{q.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* DG welcome + core activities */}
      <section className="py-16">
        <div className="container-tirdo grid gap-12 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <SectionHeading eyebrow="Welcome" title="From the Director General" />
            <div className="relative rounded-xl bg-secondary p-6">
              <Quote className="absolute right-5 top-5 h-10 w-10 text-primary/10" />
              <p className="text-sm leading-relaxed text-foreground/80">
                Established by an Act of Parliament No. 5 of 1979, TIRDO exists to support the
                industrialization of Tanzania through applied research, engineering development and
                the transfer of appropriate technologies. We partner with industry, government and
                development partners to add value to local resources, improve productivity and grow a
                competitive, sustainable industrial sector.
              </p>
              <div className="mt-5 flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-primary font-bold text-primary-foreground">DG</div>
                <div>
                  <div className="font-semibold text-primary">Director General</div>
                  <div className="text-xs text-muted-foreground">TIRDO</div>
                </div>
              </div>
              <Link href="/about" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent hover:gap-2">
                About TIRDO <ArrowRight className="h-4 w-4 transition-all" />
              </Link>
            </div>
          </div>

          <div>
            <SectionHeading eyebrow="What we do" title="Our Core Activities" />
            <div className="grid gap-4 sm:grid-cols-2">
              {coreActivities.map((a) => (
                <Card key={a.title} className="transition-shadow hover:shadow-md">
                  <CardContent className="p-5">
                    <span className="mb-3 grid h-11 w-11 place-items-center rounded-lg bg-accent/15 text-accent">
                      <Icon name={a.icon} className="h-6 w-6" />
                    </span>
                    <h3 className="mb-1 font-semibold text-primary">{a.title}</h3>
                    <p className="text-sm text-muted-foreground">{a.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Stats />

      {/* Services */}
      <section className="py-16">
        <div className="container-tirdo">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="How we help" title="Our Services" className="mb-0" />
            <ButtonLink href="/services" variant="outline">All services</ButtonLink>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <Link key={s.slug} href={`/services/${s.slug}`}>
                <Card className="group h-full border-l-4 border-l-transparent transition-all hover:border-l-accent hover:shadow-md">
                  <CardContent className="flex gap-4 p-5">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon name={s.icon} className="h-6 w-6" />
                    </span>
                    <div>
                      <h3 className="mb-1 font-semibold text-primary">{s.title}</h3>
                      <p className="text-sm text-muted-foreground">{s.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured research products */}
      <section id="products" className="bg-secondary/50 py-16">
        <div className="container-tirdo">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="Innovation" title="Featured Research Products" className="mb-0" />
            <ButtonLink href="/projects" variant="outline">All projects</ButtonLink>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {projects.slice(0, 4).map((p) => (
              <ProjectCard key={p.slug} item={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Latest news */}
      <section className="py-16">
        <div className="container-tirdo">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="Newsroom" title="News & Announcements" className="mb-0" />
            <ButtonLink href="/news" variant="outline">All news</ButtonLink>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {news.map((n) => (
              <NewsCard key={n.slug} item={n} />
            ))}
          </div>
        </div>
      </section>

      {/* e-Services CTA band */}
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="container-tirdo">
          <div className="mb-8 text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-accent">Online</span>
            <h2 className="mt-1 text-2xl font-bold sm:text-3xl">TIRDO e-Services</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {eservices.map((e) => (
              <Link key={e.anchor} href={e.href} className="group rounded-xl border border-white/15 bg-white/5 p-6 transition-colors hover:bg-white/10">
                <h3 className="mb-2 font-semibold text-accent">{e.title}</h3>
                <p className="text-sm text-white/75">{e.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold group-hover:gap-2">
                  Open <ArrowRight className="h-4 w-4 transition-all" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-14">
        <div className="container-tirdo">
          <SectionHeading eyebrow="Collaboration" title="Our Partners" center />
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {partners.map((p) => (
              <div key={p} className="grid h-20 w-36 place-items-center rounded-lg border bg-card text-lg font-bold text-primary/70 grayscale transition-all hover:grayscale-0">
                {p}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
