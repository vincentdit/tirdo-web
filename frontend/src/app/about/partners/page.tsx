import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageBanner } from "@/components/site/page-banner";
import { PartnersGrid } from "@/components/site/partners-grid";
import { PARTNER_CATEGORIES } from "@/lib/content";
import { getPageBySlug, getPartners, pageParagraphs } from "@/lib/strapi";

export const metadata = {
  title: "Our Partners",
  description: "Government institutions, development partners and stakeholders working with TIRDO.",
  alternates: { canonical: "/about/partners" },
};

export default async function PartnersPage() {
  const [items, page] = await Promise.all([getPartners(), getPageBySlug("partners")]);
  const intro = pageParagraphs(page?.body);
  const grouped = PARTNER_CATEGORIES.map((category) => ({
    category,
    items: items.filter((item) => item.category === category),
  })).filter((group) => group.items.length > 0);
  const other = items.filter((item) => !PARTNER_CATEGORIES.includes(item.category as (typeof PARTNER_CATEGORIES)[number]));
  if (other.length) grouped.push({ category: "Other", items: other });

  return (
    <>
      <PageBanner
        title="Our Partners"
        subtitle="Strategic partners, stakeholders and collaborating institutions."
        crumbs={[{ label: "About Us", href: "/about" }, { label: "Our Partners" }]}
      />
      <section className="bg-brand-pale/50 py-12 md:py-16">
        <div className="container-tirdo">
          <div className="max-w-3xl space-y-3 text-brand-muted">
            {intro.length ? (
              intro.map((p) => <p key={p.slice(0, 40)}>{p}</p>)
            ) : (
              <p>
                TIRDO works with government institutions, development partners, industry associations and research
                organisations to strengthen Tanzania&apos;s industrial capability.
              </p>
            )}
          </div>
          {items.length === 0 ? (
            <p className="mt-8 rounded-2xl border border-dashed border-brand-teal/30 bg-white p-8 text-sm text-brand-muted">
              Partner organisations will appear here once they are published.
            </p>
          ) : (
            <div className="mt-10 space-y-12">
              {grouped.map((group) => (
                <div key={group.category}>
                  <h2 className="mb-5 font-display text-2xl text-brand-ink">{group.category}</h2>
                  <PartnersGrid items={group.items} />
                </div>
              ))}
            </div>
          )}
          <Link href="/contact" className="mt-12 inline-flex items-center gap-1 text-sm font-semibold text-brand-teal hover:gap-2">
            Partner with TIRDO <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
