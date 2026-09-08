import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { PageBanner } from "@/components/site/page-banner";
import { ButtonLink } from "@/components/ui/button";
import { getTechnologies } from "@/lib/strapi";
import { technologies as fallbackTech, technologySectorName, services } from "@/lib/content";

export async function generateStaticParams() {
  return fallbackTech.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const list = await getTechnologies("en");
  const t = list.find((x) => x.slug === params.slug) ?? fallbackTech.find((x) => x.slug === params.slug);
  const title = t?.title ?? "Technology";
  const canonical = `/technology/${params.slug}`;
  return {
    title,
    description: t?.summary,
    alternates: { canonical },
    openGraph: { title, description: t?.summary, url: canonical, type: "article" },
  };
}

export default async function TechnologyDetailPage({ params }: { params: { slug: string } }) {
  const list = await getTechnologies();
  const tech = list.find((t) => t.slug === params.slug) ?? fallbackTech.find((t) => t.slug === params.slug);
  if (!tech) notFound();

  const related = services.find((s) => s.slug === tech.relatedServiceSlug);
  const others = list.filter((t) => t.slug !== tech.slug).slice(0, 5);

  return (
    <>
      <PageBanner
        title={tech.title}
        crumbs={[{ label: "Technology Catalogue", href: "/technology" }, { label: tech.title }]}
      />
      <section className="py-14">
        <div className="container-tirdo grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-4 text-foreground/80">
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-accent/15 px-3 py-1 font-semibold text-brand-teal">{technologySectorName(tech.sector) ?? "Technology"}</span>
              <span className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary">{tech.maturity}</span>
            </div>
            {tech.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img loading="lazy" decoding="async" src={tech.image} alt={tech.title} className="aspect-[16/9] w-full rounded-xl object-cover" />
            )}
            <p className="text-lg">{tech.summary}</p>
            {(tech.body ?? []).map((p, i) => <p key={i}>{p}</p>)}

            {tech.applications && tech.applications.length > 0 && (
              <>
                <h3 className="pt-2 font-semibold text-primary">Applications</h3>
                <div className="flex flex-wrap gap-2">
                  {tech.applications.map((a) => (
                    <span key={a} className="rounded-full border px-3 py-1 text-sm text-foreground/75">{a}</span>
                  ))}
                </div>
              </>
            )}

            {tech.benefits && tech.benefits.length > 0 && (
              <>
                <h3 className="pt-2 font-semibold text-primary">Benefits</h3>
                <ul className="space-y-2">
                  {tech.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-teal" /> {b}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <aside className="space-y-6">
            <div className="rounded-xl border bg-secondary/40 p-6">
              <h3 className="mb-2 font-bold text-primary">Adopt this technology</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                TIRDO supports transfer, licensing and training. Talk to our Technology Transfer team about bringing this to your enterprise.
              </p>
              <ButtonLink href="/contact" variant="accent" className="w-full justify-center">Request technology transfer</ButtonLink>
              {related && (
                <ButtonLink href={`/services/${related.slug}`} variant="outline" className="mt-3 w-full justify-center">
                  Related service: {related.title}
                </ButtonLink>
              )}
            </div>

            <div className="rounded-xl border p-6">
              <h4 className="mb-3 text-sm font-semibold text-primary">Other technologies</h4>
              <ul className="space-y-2 text-sm">
                {others.map((t) => (
                  <li key={t.slug}>
                    <Link href={`/technology/${t.slug}`} className="inline-flex items-center gap-1 text-foreground/75 hover:text-brand-teal">
                      <ArrowRight className="h-3.5 w-3.5" /> {t.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
