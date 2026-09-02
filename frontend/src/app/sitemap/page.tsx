import Link from "next/link";
import { PageBanner } from "@/components/site/page-banner";
import { mainNav } from "@/lib/site";

export const metadata = { title: "Sitemap" };

export default function SitemapPage() {
  return (
    <>
      <PageBanner title="Sitemap" crumbs={[{ label: "Sitemap" }]} />
      <section className="py-14">
        <div className="container-tirdo grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {mainNav.map((item) => {
            const children = item.children ?? item.columns?.flatMap((c) => c.items) ?? [];
            return (
              <div key={item.title}>
                <Link href={item.href} className="mb-2 block font-bold text-primary hover:text-accent">{item.title}</Link>
                <ul className="space-y-1 text-sm">
                  {children.map((c) => (
                    <li key={c.href}><Link href={c.href} className="text-muted-foreground hover:text-accent">{c.title}</Link></li>
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
