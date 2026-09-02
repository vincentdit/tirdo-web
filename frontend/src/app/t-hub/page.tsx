import { Lightbulb, Users, TrendingUp, Rocket, ExternalLink } from "lucide-react";
import { PageBanner } from "@/components/site/page-banner";
import { Card, CardContent } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { tHub } from "@/lib/content";

export const metadata = { title: "T-Hub Innovation" };

const pillars = [
  { icon: Lightbulb, title: "Incubation", text: "Nurturing early-stage technology and industrial startups." },
  { icon: Users, title: "Mentorship", text: "Access to TIRDO researchers, engineers and industry experts." },
  { icon: TrendingUp, title: "Commercialization", text: "Turning research and prototypes into market-ready products." },
  { icon: Rocket, title: "Acceleration", text: "Support to scale proven technologies and reach industry buyers." },
];

export default function THubPage() {
  return (
    <>
      <PageBanner title="T-Hub Innovation Centre" subtitle="TIRDO's innovation and IT development hub, incubating home-grown startups." crumbs={[{ label: "Research & Innovation" }, { label: "T-Hub" }]} />

      <section className="py-14">
        <div className="container-tirdo">
          <p className="mx-auto max-w-3xl text-center text-lg text-brand-muted">{tHub.intro}</p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p) => (
              <Card key={p.title}>
                <CardContent className="p-6">
                  <p.icon className="mb-3 h-8 w-8 text-brand-teal" />
                  <h3 className="mb-1 font-semibold text-primary">{p.title}</h3>
                  <p className="text-sm text-muted-foreground">{p.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About T-Hub */}
      <section className="border-t py-14">
        <div className="container-tirdo grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="eyebrow mb-2 text-brand-teal">About</p>
            <h2 className="font-display text-[1.8rem] text-brand-ink md:text-[2.2rem]">About T-Hub</h2>
          </div>
          <div className="space-y-4 text-foreground/80">
            {tHub.about.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>
      </section>

      {/* T-Hub Services */}
      <section className="border-t py-14">
        <div className="container-tirdo">
          <div className="mb-8">
            <p className="eyebrow mb-2 text-brand-teal">What we offer</p>
            <h2 className="font-display text-[1.8rem] text-brand-ink md:text-[2.2rem]">T-Hub Services</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tHub.services.map((s) => (
              <Card key={s.title}>
                <CardContent className="p-5">
                  <h3 className="mb-1 font-semibold text-primary">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why T-Hub */}
      <section className="bg-brand-blue py-16 text-white">
        <div className="container-tirdo">
          <div className="mb-8">
            <p className="eyebrow mb-2 text-brand-gold">The difference</p>
            <h2 className="font-display text-[1.8rem] md:text-[2.2rem]">Why T-Hub</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {tHub.why.map((w, i) => (
              <div key={w.title} className="rounded-xl border border-white/15 bg-white/5 p-5">
                <div className="mb-2 text-2xl font-black text-brand-gold">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="mb-1 font-semibold text-brand-gold">{w.title}</h3>
                <p className="text-sm text-white/80">{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio companies */}
      <section className="bg-brand-pale py-16">
        <div className="container-tirdo">
          <div className="mb-8">
            <p className="eyebrow mb-2 text-brand-teal">Portfolio</p>
            <h2 className="font-display text-[2rem] text-brand-ink md:text-[2.4rem]">T-Hub companies</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tHub.companies.map((c) => (
              <a key={c.name} href={c.href} target="_blank" rel="noreferrer" className="group flex flex-col rounded-xl border bg-card p-6 transition-all hover:-translate-y-1 hover:border-brand-teal hover:shadow-md">
                <div className="mb-4 flex h-14 items-center">
                  {c.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.logo} alt={c.name} className="max-h-14 max-w-[140px] object-contain" />
                  ) : (
                    <span className="text-xl font-bold text-brand-teal">{c.name}</span>
                  )}
                </div>
                <h3 className="mb-1 flex items-center gap-1 font-semibold text-primary">
                  {c.name} <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                </h3>
                <p className="text-sm text-muted-foreground">{c.description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="container-tirdo rounded-2xl bg-primary p-10 text-center text-primary-foreground">
          <h2 className="font-display text-2xl md:text-3xl">Have an industrial technology idea?</h2>
          <p className="mx-auto mt-2 max-w-xl text-white/85">Join the T-Hub community and turn your innovation into a viable business with TIRDO&apos;s technical and mentorship support.</p>
          <ButtonLink href="/contact" variant="accent" size="lg" className="mt-6">Apply to T-Hub</ButtonLink>
        </div>
      </section>
    </>
  );
}
