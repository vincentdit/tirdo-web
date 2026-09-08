// -----------------------------------------------------------------------
// OpenSearch integration for global site search.
//
//   - gatherDocuments(): collect every content type into flat search docs
//     (live CMS content with a bundled fallback, plus static pages).
//   - ensureIndex() / reindexAll(): create the index and (re)load all docs.
//   - searchContent(): multi-match query with type facets + highlighting.
//   - suggest(): fast prefix suggestions for the search-as-you-type box.
//
// OpenSearch runs without the security plugin (see docker-compose), so these
// are plain unauthenticated HTTP calls. Every function fails soft: callers
// fall back to a local content scan when OpenSearch is unavailable.
// -----------------------------------------------------------------------
import * as content from "./content";
import { getNews, getProjects, getPublications, getVacancies, getTenders, getTechnologies } from "./strapi";

export const OS_NODE = process.env.OPENSEARCH_NODE || "http://opensearch:9200";
export const OS_INDEX = process.env.OPENSEARCH_INDEX || "tirdo-content";

export type SearchDoc = {
  id: string;
  title: string;
  type: string;
  url: string;
  excerpt?: string;
  body?: string;
  category?: string;
  date?: string;
};

export type SearchHit = {
  title: string;
  type: string;
  url: string;
  excerpt?: string;
  highlight?: string;
};

export type Facet = { type: string; count: number };

const TIMEOUT = 4000;

async function osFetch(path: string, init?: RequestInit) {
  return fetch(`${OS_NODE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    signal: AbortSignal.timeout(TIMEOUT),
    cache: "no-store",
  });
}

// ---- Document collection ------------------------------------------------

const ABOUT_PAGES: { slug: string; title: string; subtitle: string }[] = [
  { slug: "mission-vision", title: "Mission & Vision", subtitle: "Our purpose, aspiration and values" },
  { slug: "structure", title: "Organization Structure", subtitle: "How TIRDO is organised" },
  { slug: "board", title: "Board of Directors", subtitle: "Governance and oversight" },
  { slug: "administration", title: "Administration", subtitle: "TIRDO top management" },
  { slug: "success-stories", title: "Success Stories", subtitle: "Impact from the laboratory to industry" },
  { slug: "comsats", title: "COMSATS Centre for Climate & Sustainability", subtitle: "International science & technology cooperation" },
];

const STATIC_PAGES: { title: string; url: string; excerpt: string }[] = [
  { title: "About TIRDO", url: "/about", excerpt: "Mandate, vision, governance and organization structure of TIRDO." },
  { title: "Departments", url: "/departments", excerpt: "Research, engineering and technology development divisions." },
  { title: "Services", url: "/services", excerpt: "Industrial research, testing, consultancy and training services." },
  { title: "Technology Catalogue", url: "/technology", excerpt: "Proven TIRDO technologies available for transfer, licensing and adoption." },
  { title: "Laboratory Services", url: "/laboratory", excerpt: "Accredited food, chemistry, materials, energy and environmental testing (NILIMS)." },
  { title: "Consultancy & Advisory", url: "/consultancy", excerpt: "Multidisciplinary technical consultancy and advisory services (CIAP)." },
  { title: "Training & Skills Development", url: "/training", excerpt: "Short courses and capacity building for industry and SMEs (TeLTP)." },
  { title: "Research & Innovation", url: "/projects", excerpt: "Ongoing projects, research products and innovation." },
  { title: "T-Hub Innovation", url: "/t-hub", excerpt: "TIRDO technology and business incubation hub." },
  { title: "Industrial Information Centre", url: "/industrial-information-centre", excerpt: "Industrial and technological information services." },
  { title: "Publications", url: "/publications", excerpt: "Reports, journals and technical publications." },
  { title: "News & Announcements", url: "/news", excerpt: "Latest news and announcements from TIRDO." },
  { title: "Events", url: "/events", excerpt: "Trainings, workshops and upcoming events." },
  { title: "Gallery", url: "/gallery", excerpt: "Photos from TIRDO activities and facilities." },
  { title: "Documents", url: "/documents", excerpt: "Downloadable forms, guidelines and official documents." },
  { title: "Careers", url: "/careers", excerpt: "Job and career opportunities at TIRDO." },
  { title: "Tenders", url: "/tenders", excerpt: "Procurement notices and tender opportunities." },
  { title: "e-Services", url: "/e-services", excerpt: "Online client services and staff portals." },
  { title: "Contact Us", url: "/contact", excerpt: "Address, phone, email and enquiry form." },
];

export async function gatherDocuments(): Promise<SearchDoc[]> {
  // Index the default-locale (English) content for a stable single index.
  const [news, projects, publications, vacancies, tenders, technologies] = await Promise.all([
    getNews(100, "en").catch(() => content.news),
    getProjects("en").catch(() => content.projects),
    getPublications("en").catch(() => content.publications),
    getVacancies("en").catch(() => content.vacancies),
    getTenders("en").catch(() => content.tenders),
    getTechnologies("en").catch(() => content.technologies),
  ]);

  const docs: SearchDoc[] = [];

  for (const n of news)
    docs.push({ id: `news:${n.slug}`, title: n.title, type: "News", url: `/news/${n.slug}`, excerpt: n.excerpt, body: n.body, category: n.category, date: n.date });

  for (const p of projects)
    docs.push({ id: `project:${p.slug}`, title: p.title, type: "Project", url: `/projects#${p.slug}`, excerpt: p.summary, body: [content.researchAreaName(content.projectAreaSlug(p)), p.funder].filter(Boolean).join(" "), category: p.department, date: p.year ? String(p.year) : undefined });

  for (const p of publications)
    docs.push({ id: `publication:${p.slug}`, title: p.title, type: "Publication", url: `/publications#${p.slug}`, excerpt: `${p.type} · ${p.year}`, body: [p.abstract, p.authors, ...(p.keywords ?? [])].filter(Boolean).join(" "), category: p.type, date: String(p.year) });

  for (const v of vacancies)
    docs.push({ id: `vacancy:${v.slug}`, title: v.title, type: "Vacancy", url: `/careers#${v.slug}`, excerpt: v.description, body: [v.department, ...(v.body ?? [])].filter(Boolean).join(" "), category: v.category, date: v.closingDate });

  for (const t of tenders)
    docs.push({ id: `tender:${t.slug}`, title: t.title, type: "Tender", url: `/tenders#${t.slug}`, excerpt: t.description, body: `${t.reference} ${t.category}`, category: t.category, date: t.closingDate });

  for (const s of content.services)
    docs.push({ id: `service:${s.slug}`, title: s.title, type: "Service", url: `/services/${s.slug}`, excerpt: s.description, body: s.body?.join(" ") });

  for (const t of technologies)
    docs.push({
      id: `technology:${t.slug}`, title: t.title, type: "Technology", url: `/technology/${t.slug}`,
      excerpt: t.summary, body: [...(t.body ?? []), ...(t.benefits ?? []), ...(t.applications ?? [])].join(" "),
      category: content.technologySectorName(t.sector),
    });

  for (const d of content.departments)
    docs.push({
      id: `department:${d.slug}`, title: d.title, type: "Department", url: `/departments/${d.slug}`,
      excerpt: d.blurb, body: [...(d.body ?? []), ...(d.sections?.flatMap((s) => [s.name, ...(s.items ?? [])]) ?? [])].join(" "), category: d.group,
    });

  for (const a of ABOUT_PAGES)
    docs.push({ id: `about:${a.slug}`, title: a.title, type: "Page", url: `/about/${a.slug}`, excerpt: a.subtitle });

  content.events.forEach((e, i) =>
    docs.push({ id: `event:${i}`, title: e.title, type: "Event", url: `/events`, excerpt: e.description, category: e.category, date: e.date }));

  for (const s of STATIC_PAGES)
    docs.push({ id: `page:${s.url}`, title: s.title, type: "Page", url: s.url, excerpt: s.excerpt });

  return docs;
}

// ---- Index lifecycle ----------------------------------------------------

const INDEX_BODY = {
  settings: {
    number_of_shards: 1,
    number_of_replicas: 0,
    analysis: {
      analyzer: {
        tirdo_text: { type: "custom", tokenizer: "standard", filter: ["lowercase", "english_stop", "english_stemmer"] },
      },
      filter: {
        english_stop: { type: "stop", stopwords: "_english_" },
        english_stemmer: { type: "stemmer", language: "english" },
      },
    },
  },
  mappings: {
    properties: {
      title: { type: "text", analyzer: "tirdo_text", fields: { raw: { type: "keyword" } } },
      excerpt: { type: "text", analyzer: "tirdo_text" },
      body: { type: "text", analyzer: "tirdo_text" },
      type: { type: "keyword" },
      url: { type: "keyword" },
      category: { type: "keyword" },
      date: { type: "keyword" },
    },
  },
};

export async function ensureIndex(): Promise<boolean> {
  const head = await osFetch(`/${OS_INDEX}`, { method: "HEAD" });
  if (head.ok) return true;
  const res = await osFetch(`/${OS_INDEX}`, { method: "PUT", body: JSON.stringify(INDEX_BODY) });
  return res.ok;
}

export async function reindexAll(): Promise<{ ok: boolean; count: number }> {
  // Recreate the index cleanly.
  await osFetch(`/${OS_INDEX}`, { method: "DELETE" }).catch(() => {});
  const created = await osFetch(`/${OS_INDEX}`, { method: "PUT", body: JSON.stringify(INDEX_BODY) });
  if (!created.ok) return { ok: false, count: 0 };

  const docs = await gatherDocuments();
  const ndjson =
    docs
      .map((d) => `${JSON.stringify({ index: { _index: OS_INDEX, _id: d.id } })}\n${JSON.stringify(d)}`)
      .join("\n") + "\n";

  const res = await osFetch(`/_bulk?refresh=true`, { method: "POST", body: ndjson });
  return { ok: res.ok, count: res.ok ? docs.length : 0 };
}

export async function indexStatus(): Promise<{ exists: boolean; count: number }> {
  try {
    const head = await osFetch(`/${OS_INDEX}`, { method: "HEAD" });
    if (!head.ok) return { exists: false, count: 0 };
    const res = await osFetch(`/${OS_INDEX}/_count`);
    if (!res.ok) return { exists: true, count: 0 };
    const json = await res.json();
    return { exists: true, count: json.count ?? 0 };
  } catch {
    return { exists: false, count: 0 };
  }
}

// A document only the frontend indexer creates. Its presence proves the index
// holds the FULL document set (not just the partial set the CMS bootstrap
// indexes), so search doesn't miss about pages, events, vacancies or tenders.
const SENTINEL_ID = "about:mission-vision";

// Populate the index on first use if the full frontend set isn't present.
// Guarded so concurrent requests don't all rebuild, and cached so warm
// requests skip the check. reindexAll() (via /api/search/reindex) refreshes
// content after CMS changes.
let reindexing: Promise<unknown> | null = null;
let knownPopulated = false;
export async function ensurePopulated(): Promise<void> {
  if (knownPopulated) return;
  try {
    const res = await osFetch(`/${OS_INDEX}/_doc/${encodeURIComponent(SENTINEL_ID)}`);
    if (res.ok) {
      const json = await res.json();
      if (json.found) {
        knownPopulated = true;
        return;
      }
    }
  } catch {
    // OpenSearch unreachable — let the caller fall back to local.
    throw new Error("opensearch unavailable");
  }
  if (!reindexing) reindexing = reindexAll().finally(() => (reindexing = null));
  const done = (await reindexing) as { ok?: boolean; count?: number } | undefined;
  if (done?.ok && (done.count ?? 0) > 0) knownPopulated = true;
}

// ---- Query --------------------------------------------------------------

const TYPES = ["News", "Publication", "Project", "Service", "Department", "Vacancy", "Tender", "Event", "Page"];

export async function searchContent(
  q: string,
  opts: { type?: string; from?: number; size?: number } = {}
): Promise<{ hits: SearchHit[]; total: number; facets: Facet[] } | null> {
  const { type, from = 0, size = 20 } = opts;
  const body: Record<string, unknown> = {
    from,
    size,
    query: {
      multi_match: {
        query: q,
        fields: ["title^4", "excerpt^2", "body", "category"],
        fuzziness: "AUTO",
        operator: "and",
        type: "best_fields",
      },
    },
    highlight: { fields: { excerpt: {}, body: {} }, pre_tags: ["<mark>"], post_tags: ["</mark>"], fragment_size: 160, number_of_fragments: 1 },
    aggs: { types: { terms: { field: "type", size: 20 } } },
  };
  if (type && TYPES.includes(type)) {
    // post_filter so the aggregation still counts across all types.
    body.post_filter = { term: { type } };
  }

  const res = await osFetch(`/${OS_INDEX}/_search`, { method: "POST", body: JSON.stringify(body) });
  if (!res.ok) return null;
  const json = await res.json();

  const hits: SearchHit[] = (json.hits?.hits ?? []).map((h: any) => ({
    title: h._source.title,
    type: h._source.type ?? "Content",
    url: h._source.url ?? "#",
    excerpt: h._source.excerpt,
    highlight: h.highlight?.excerpt?.[0] ?? h.highlight?.body?.[0],
  }));
  const total = typeof json.hits?.total === "object" ? json.hits.total.value : json.hits?.total ?? hits.length;
  const facets: Facet[] = (json.aggregations?.types?.buckets ?? []).map((b: any) => ({ type: b.key, count: b.doc_count }));

  return { hits, total, facets };
}

export async function suggest(q: string): Promise<SearchHit[]> {
  const body = {
    size: 6,
    _source: ["title", "type", "url"],
    query: { match_phrase_prefix: { title: { query: q, max_expansions: 20 } } },
  };
  const res = await osFetch(`/${OS_INDEX}/_search`, { method: "POST", body: JSON.stringify(body) });
  if (!res.ok) return [];
  const json = await res.json();
  return (json.hits?.hits ?? []).map((h: any) => ({
    title: h._source.title,
    type: h._source.type ?? "Content",
    url: h._source.url ?? "#",
  }));
}
