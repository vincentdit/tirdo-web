import { PageBanner } from "@/components/site/page-banner";
import { NewsCard } from "@/components/site/cards";
import { getNews } from "@/lib/strapi";

export const metadata = { title: "News & Announcements" };

export default async function NewsPage() {
  const news = await getNews(24);
  return (
    <>
      <PageBanner title="News & Announcements" subtitle="Latest updates, research milestones and events from TIRDO." crumbs={[{ label: "Media" }, { label: "News" }]} />
      <section className="py-14">
        <div className="container-tirdo grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((n) => <NewsCard key={n.slug} item={n} />)}
        </div>
      </section>
    </>
  );
}
