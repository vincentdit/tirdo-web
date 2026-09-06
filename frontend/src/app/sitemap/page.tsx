import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { PageBanner } from "@/components/site/page-banner";
import { mainNav } from "@/lib/site";

export const metadata = { title: "Sitemap" };

export default async function SitemapPage() {
  const t = await getTranslations("nav");
  const ts = await getTranslations("sitemap");
  return (
    <>
      <PageBanner title={ts("title")} crumbs={[{ label: ts("title") }]} />
      <section className="py-14">
        <div className="container-tirdo grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {mainNav.map((item) => {
            const children = item.children ?? item.columns?.flatMap((c) => c.items) ?? [];
            return (
              <div key={item.key}>
                <Link href={item.href} className="mb-2 block font-bold text-primary hover:text-accent">{t(item.key)}</Link>
                <ul className="space-y-1 text-sm">
                  {children.map((c) => (
                    <li key={c.key}><Link href={c.href} className="text-muted-foreground hover:text-accent">{t(c.key)}</Link></li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
