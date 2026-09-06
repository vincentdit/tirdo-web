// -----------------------------------------------------------------------
// Strapi data access. Every getter tries the live CMS first and gracefully
// falls back to bundled sample content (lib/content.ts) so the site always
// renders — even during the CMS's first boot.
// -----------------------------------------------------------------------
import * as fallback from "./content";
import type { NewsItem, Project, Publication, Vacancy, Tender } from "./content";

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
    image: a.imageUrl || a.cover?.url,
    sourceUrl: a.sourceUrl,
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
      category: a.category ?? "News", date: a.date ?? a.publishedAt,
      image: a.imageUrl || a.cover?.url, sourceUrl: a.sourceUrl,
    };
  }
  return fallback.news.find((n) => n.slug === slug) ?? null;
}

export async function getProjects(): Promise<Project[]> {
  const data = await strapiFetch<Raw[]>(`projects?populate=cover`);
  if (!data || data.length === 0) return fallback.projects;
  return data.map((p) => ({
    slug: p.slug, title: p.title, summary: p.summary,
    department: p.department ?? "", status: p.status ?? "Ongoing", image: p.imageUrl || p.cover?.url,
    researchArea: p.researchArea, year: p.year, funder: p.funder,
  }));
}

export async function getPublications(): Promise<Publication[]> {
  const data = await strapiFetch<Raw[]>(`publications?sort=year:desc&populate=file`);
  if (!data || data.length === 0) return fallback.publications;
  return data.map((p) => ({
    slug: p.slug, title: p.title, type: p.type ?? "Report",
    year: p.year ?? new Date().getFullYear(), fileUrl: p.fileUrl || p.file?.url,
    abstract: p.abstract, authors: p.authors,
    keywords: Array.isArray(p.keywords) ? p.keywords : typeof p.keywords === "string" ? p.keywords.split(",").map((k: string) => k.trim()).filter(Boolean) : undefined,
    doi: p.doi, citation: p.citation,
  }));
}

export async function getVacancies(): Promise<Vacancy[]> {
  const data = await strapiFetch<Raw[]>(`vacancies?sort=closingDate:desc`);
  if (!data || data.length === 0) return fallback.vacancies;
  return data.map((v) => ({
    slug: v.slug, title: v.title, department: v.department ?? "", category: v.category ?? "Professional",
    location: v.location ?? "Dar es Salaam", description: v.description ?? "",
    body: Array.isArray(v.body) ? v.body : undefined,
    postedDate: v.postedDate ?? v.publishedAt, closingDate: v.closingDate, applyUrl: v.applyUrl,
  }));
}

export async function getTenders(): Promise<Tender[]> {
  const data = await strapiFetch<Raw[]>(`tenders?sort=closingDate:desc&populate=document`);
  if (!data || data.length === 0) return fallback.tenders;
  return data.map((t) => ({
    slug: t.slug, title: t.title, reference: t.reference ?? "", category: t.category ?? "Goods",
    description: t.description ?? "", postedDate: t.postedDate ?? t.publishedAt, closingDate: t.closingDate,
    documentUrl: t.documentUrl || t.document?.url,
  }));
}
