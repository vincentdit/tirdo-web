import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { departments, services, projects, publications } from "@/lib/content";
import { getNews } from "@/lib/strapi";

// Served at /sitemap.xml. Static routes plus every dynamic detail page
// (departments, services, about sections, news, projects, publications).
// News is pulled live from the CMS with a bundled fallback.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPaths: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "/", priority: 1.0, freq: "weekly" },
    { path: "/about", priority: 0.8, freq: "monthly" },
    { path: "/departments", priority: 0.8, freq: "monthly" },
    { path: "/services", priority: 0.8, freq: "monthly" },
    { path: "/projects", priority: 0.7, freq: "weekly" },
    { path: "/publications", priority: 0.7, freq: "weekly" },
    { path: "/news", priority: 0.8, freq: "daily" },
    { path: "/events", priority: 0.7, freq: "weekly" },
    { path: "/gallery", priority: 0.5, freq: "monthly" },
    { path: "/documents", priority: 0.6, freq: "weekly" },
    { path: "/t-hub", priority: 0.6, freq: "monthly" },
    { path: "/industrial-information-centre", priority: 0.6, freq: "monthly" },
    { path: "/units", priority: 0.5, freq: "monthly" },
    { path: "/staff", priority: 0.5, freq: "monthly" },
    { path: "/careers", priority: 0.6, freq: "weekly" },
    { path: "/tenders", priority: 0.6, freq: "weekly" },
    { path: "/contact", priority: 0.6, freq: "yearly" },
    { path: "/analytics", priority: 0.3, freq: "daily" },
    { path: "/privacy", priority: 0.2, freq: "yearly" },
    { path: "/disclaimer", priority: 0.2, freq: "yearly" },
    { path: "/sitemap", priority: 0.2, freq: "yearly" },
  ];

  const aboutSlugs = ["mission-vision", "structure", "board", "administration", "success-stories", "comsats"];

  const news = await getNews(100).catch(() => []);

  const entries: MetadataRoute.Sitemap = [
    ...staticPaths.map((s) => ({
      url: absoluteUrl(s.path),
      lastModified: now,
      changeFrequency: s.freq,
      priority: s.priority,
    })),
    ...aboutSlugs.map((slug) => ({
      url: absoluteUrl(`/about/${slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...departments.map((d) => ({
      url: absoluteUrl(`/departments/${d.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...services.map((s) => ({
      url: absoluteUrl(`/services/${s.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...projects.map((p) => ({
      url: absoluteUrl(`/projects#${p.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...publications.map((p) => ({
      url: absoluteUrl(`/publications#${p.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...news.map((n) => ({
      url: absoluteUrl(`/news/${n.slug}`),
      lastModified: n.date ? new Date(n.date) : now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];

  // De-duplicate by URL (projects/publications use fragment anchors that may repeat a base).
  const seen = new Set<string>();
  return entries.filter((e) => (seen.has(e.url) ? false : (seen.add(e.url), true)));
}
