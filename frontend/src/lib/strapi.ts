// -----------------------------------------------------------------------
// Strapi data access. Every getter tries the live CMS first and gracefully
// falls back to bundled sample content (lib/content.ts) so the site always
// renders — even during the CMS's first boot.
//
// Localization (EN/SW): entries are fetched in the default locale (en) with
// their `localizations` populated. mergeLocale() overlays the active locale's
// translated text fields per entry, keeping the English base for anything not
// yet translated — so a partly-translated collection still shows a full list.
// The active locale comes from the NEXT_LOCALE cookie (set by the language
// switch). See docs/I18N.md.
// -----------------------------------------------------------------------
import { cookies } from "next/headers";
import * as fallback from "./content";
import type { NewsItem, Project, Publication, Vacancy, Tender, Technology } from "./content";
import { isLocale, defaultLocale } from "@/i18n/config";

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

// Text fields that may be translated per locale (union across content types).
const LOCALIZED_KEYS = ["title", "summary", "body", "description", "excerpt", "abstract", "citation", "blurb"] as const;

// The locale requested for the current render (NEXT_LOCALE cookie).
export function activeLocale(): string {
  try {
    const v = cookies().get("NEXT_LOCALE")?.value;
    return isLocale(v) ? v : defaultLocale;
  } catch {
    return defaultLocale;
  }
}

// Overlay the active locale's translated text fields onto the English base
// entry; fields not translated keep their English value.
export function mergeLocale<T extends Raw>(entry: T, locale: string): T {
  if (!locale || locale === defaultLocale) return entry;
  const loc = Array.isArray(entry.localizations)
    ? entry.localizations.find((l: Raw) => l?.locale === locale)
    : undefined;
  if (!loc) return entry;
  const out: Raw = { ...entry };
  for (const k of LOCALIZED_KEYS) if (loc[k] != null && loc[k] !== "") out[k] = loc[k];
  return out as T;
}

// Common query suffix: base locale + localizations populated.
const L = "locale=en&populate[localizations]=true";

export async function getNews(limit = 8, locale = activeLocale()): Promise<NewsItem[]> {
  const data = await strapiFetch<Raw[]>(
    `articles?sort=date:desc&pagination[limit]=${limit}&${L}&populate[cover]=true`
  );
  if (!data || data.length === 0) return fallback.news.slice(0, limit);
  return data.map((raw) => {
    const a = mergeLocale(raw, locale);
    return {
      slug: a.slug, title: a.title, excerpt: a.excerpt, body: a.body,
      category: a.category ?? "News", date: a.date ?? a.publishedAt,
      image: a.imageUrl || a.cover?.url, sourceUrl: a.sourceUrl,
    };
  });
}

export async function getNewsBySlug(slug: string, locale = activeLocale()): Promise<NewsItem | null> {
  const data = await strapiFetch<Raw[]>(
    `articles?filters[slug][$eq]=${slug}&${L}&populate[cover]=true`
  );
  if (data && data.length) {
    const a = mergeLocale(data[0], locale);
    return {
      slug: a.slug, title: a.title, excerpt: a.excerpt, body: a.body,
      category: a.category ?? "News", date: a.date ?? a.publishedAt,
      image: a.imageUrl || a.cover?.url, sourceUrl: a.sourceUrl,
    };
  }
  return fallback.news.find((n) => n.slug === slug) ?? null;
}

export async function getProjects(locale = activeLocale()): Promise<Project[]> {
  const data = await strapiFetch<Raw[]>(`projects?${L}&populate[cover]=true`);
  if (!data || data.length === 0) return fallback.projects;
  return data.map((raw) => {
    const p = mergeLocale(raw, locale);
    return {
      slug: p.slug, title: p.title, summary: p.summary,
      department: p.department ?? "", status: p.status ?? "Ongoing", image: p.imageUrl || p.cover?.url,
      researchArea: p.researchArea, year: p.year, funder: p.funder,
    };
  });
}

export async function getPublications(locale = activeLocale()): Promise<Publication[]> {
  const data = await strapiFetch<Raw[]>(`publications?sort=year:desc&${L}&populate[file]=true`);
  if (!data || data.length === 0) return fallback.publications;
  return data.map((raw) => {
    const p = mergeLocale(raw, locale);
    return {
      slug: p.slug, title: p.title, type: p.type ?? "Report",
      year: p.year ?? new Date().getFullYear(), fileUrl: p.fileUrl || p.file?.url,
      abstract: p.abstract, authors: p.authors,
      keywords: Array.isArray(p.keywords) ? p.keywords : typeof p.keywords === "string" ? p.keywords.split(",").map((k: string) => k.trim()).filter(Boolean) : undefined,
      doi: p.doi, citation: p.citation,
    };
  });
}

export async function getVacancies(locale = activeLocale()): Promise<Vacancy[]> {
  const data = await strapiFetch<Raw[]>(`vacancies?sort=closingDate:desc&${L}`);
  if (!data || data.length === 0) return fallback.vacancies;
  return data.map((raw) => {
    const v = mergeLocale(raw, locale);
    return {
      slug: v.slug, title: v.title, department: v.department ?? "", category: v.category ?? "Professional",
      location: v.location ?? "Dar es Salaam", description: v.description ?? "",
      body: Array.isArray(v.body) ? v.body : undefined,
      postedDate: v.postedDate ?? v.publishedAt, closingDate: v.closingDate, applyUrl: v.applyUrl,
    };
  });
}

export async function getTenders(locale = activeLocale()): Promise<Tender[]> {
  const data = await strapiFetch<Raw[]>(`tenders?sort=closingDate:desc&${L}&populate[document]=true`);
  if (!data || data.length === 0) return fallback.tenders;
  return data.map((raw) => {
    const t = mergeLocale(raw, locale);
    return {
      slug: t.slug, title: t.title, reference: t.reference ?? "", category: t.category ?? "Goods",
      description: t.description ?? "", postedDate: t.postedDate ?? t.publishedAt, closingDate: t.closingDate,
      documentUrl: t.documentUrl || t.document?.url,
    };
  });
}


export async function getTechnologies(locale = activeLocale()): Promise<Technology[]> {
  const data = await strapiFetch<Raw[]>(`technologies?${L}&populate[cover]=true`);
  if (!data || data.length === 0) return fallback.technologies;
  return data.map((raw) => {
    const t = mergeLocale(raw, locale);
    return {
      slug: t.slug, title: t.title, summary: t.summary ?? "",
      sector: t.sector ?? "materials", maturity: t.maturity ?? "Commercial",
      body: Array.isArray(t.body) ? t.body : typeof t.body === "string" && t.body ? [t.body] : undefined,
      benefits: Array.isArray(t.benefits) ? t.benefits : undefined,
      applications: Array.isArray(t.applications) ? t.applications : undefined,
      image: t.imageUrl || t.cover?.url, relatedServiceSlug: t.relatedServiceSlug,
    };
  });
}

// Customer Service Charter (editable single-type). Falls back to the bundled
// content.ts charter when the CMS single-type is empty/unreachable. Repeatable
// components come back as arrays of objects ({text} or {service,standard,turnaround}).
export type Charter = {
  intro: string[];
  standards: { service: string; standard: string; turnaround: string }[];
  rights: string[];
  responsibilities: string[];
};

export async function getServiceCharter(locale = activeLocale()): Promise<Charter> {
  const texts = (arr: unknown): string[] =>
    Array.isArray(arr) ? arr.map((x: Raw) => x?.text).filter((v): v is string => !!v) : [];
  const d =
    (await strapiFetch<Raw>(`service-charter?populate=*&locale=${locale}`)) ||
    (locale !== defaultLocale ? await strapiFetch<Raw>(`service-charter?populate=*&locale=${defaultLocale}`) : null);

  if (!d || !Array.isArray(d.standards) || d.standards.length === 0) {
    return fallback.serviceCharter as Charter;
  }
  const fb = fallback.serviceCharter;
  const intro = texts(d.intro);
  const rights = texts(d.rights);
  const responsibilities = texts(d.responsibilities);
  return {
    intro: intro.length ? intro : fb.intro,
    standards: d.standards.map((s: Raw) => ({ service: s.service, standard: s.standard, turnaround: s.turnaround ?? "" })),
    rights: rights.length ? rights : fb.rights,
    responsibilities: responsibilities.length ? responsibilities : fb.responsibilities,
  };
}
