// -----------------------------------------------------------------------
// Strapi data access. Every getter tries the live CMS first and gracefully
// falls back to bundled sample content (lib/content.ts) so the site always
// renders — even during the CMS's first boot.
// -----------------------------------------------------------------------
import * as fallback from "./content";
import type { NewsItem, Project, Publication } from "./content";

const INTERNAL = process.env.STRAPI_INTERNAL_URL || "http://cms:1337";
const PUBLIC = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost/cms";

// server components run inside docker -> use the internal URL
const base = typeof window === "undefined" ? INTERNAL : PUBLIC;

async function strapiFetch<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${base}/api/${path}`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data as T;
  } catch {
    return null;
  }
}

// Strapi v5 flattens attributes onto the entity, so `item` already has fields.
type Raw = Record<string, any>;

export async function getNews(limit = 8): Promise<NewsItem[]> {
  const data = await strapiFetch<Raw[]>(
    `articles?sort=date:desc&pagination[limit]=${limit}&populate=cover`
  );
  if (!data || data.length === 0) return fallback.news.slice(0, limit);
  return data.map((a) => ({
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    body: a.body,
    category: a.category ?? "News",
    date: a.date ?? a.publishedAt,
    image: a.cover?.url,
  }));
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  const data = await strapiFetch<Raw[]>(
    `articles?filters[slug][$eq]=${slug}&populate=cover`
  );
  if (data && data.length) {
    const a = data[0];
    return {
      slug: a.slug, title: a.title, excerpt: a.excerpt, body: a.body,
      category: a.category ?? "News", date: a.date ?? a.publishedAt, image: a.cover?.url,
    };
  }
  return fallback.news.find((n) => n.slug === slug) ?? null;
}

export async function getProjects(): Promise<Project[]> {
  const data = await strapiFetch<Raw[]>(`projects?populate=cover`);
  if (!data || data.length === 0) return fallback.projects;
  return data.map((p) => ({
    slug: p.slug, title: p.title, summary: p.summary,
    department: p.department ?? "", status: p.status ?? "Ongoing", image: p.cover?.url,
  }));
}

export async function getPublications(): Promise<Publication[]> {
  const data = await strapiFetch<Raw[]>(`publications?sort=year:desc&populate=file`);
  if (!data || data.length === 0) return fallback.publications;
  return data.map((p) => ({
    slug: p.slug, title: p.title, type: p.type ?? "Report",
    year: p.year ?? new Date().getFullYear(), fileUrl: p.file?.url,
  }));
}
