import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, ArrowLeft } from "lucide-react";
import { PageBanner } from "@/components/site/page-banner";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { getNews, getNewsBySlug } from "@/lib/strapi";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const item = await getNewsBySlug(params.slug);
  return { title: item?.title ?? "News" };
}

export default async function NewsDetail({ params }: { params: { slug: string } }) {
  const item = await getNewsBySlug(params.slug);
  if (!item) notFound();
  const related = (await getNews(4)).filter((n) => n.slug !== item.slug).slice(0, 3);

  return (
    <>
      <PageBanner title={item.title} crumbs={[{ label: "News", href: "/news" }, { label: item.category }]} />
      <section className="py-14">
        <div className="container-tirdo grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <article className="max-w-none">
            <div className="mb-6 flex items-center gap-3 text-sm text-muted-foreground">
              <Badge variant="accent">{item.category}</Badge>
              <span className="inline-flex items-center gap-1"><Calendar className="h-4 w-4" /> {formatDate(item.date)}</span>
            </div>
            {item.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.image} alt={item.title} className="mb-8 aspect-[16/7] w-full rounded-xl object-cover" />
            ) : (
              <div className="mb-8 aspect-[16/7] rounded-xl bg-gradient-to-br from-primary/15 to-accent/15" />
            )}
            <div className="space-y-4 text-foreground/80">
              <p className="text-lg font-medium text-foreground">{item.excerpt}</p>
              {item.body ? (
                <p className="whitespace-pre-line">{item.body}</p>
              ) : (
                <>
                  <p>
                    TIRDO continues to deliver on its mandate of supporting Tanzania&apos;s industrialization
                    through applied research and technology development. This work brings together the
                    organization&apos;s laboratories, engineers and industry partners to translate research
                    outputs into practical, commercial impact.
                  </p>
                  <p>
                    For more information about this initiative or to partner with TIRDO, please get in touch
                    with our team through the contact page.
                  </p>
                </>
              )}
            </div>
            <Link href="/news" className="mt-8 inline-flex items-center gap-1 text-sm font-semibold text-accent hover:gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to news
            </Link>
          </article>

          <aside>
            <div className="rounded-xl border bg-secondary/40 p-5">
              <h3 className="mb-3 font-bold text-primary">Related news</h3>
              <ul className="space-y-3">
                {related.map((n) => (
                  <li key={n.slug}>
                    <Link href={`/news/${n.slug}`} className="block text-sm font-medium text-foreground/80 hover:text-accent">
                      {n.title}
                    </Link>
                    <span className="text-xs text-muted-foreground">{formatDate(n.date)}</span>
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
