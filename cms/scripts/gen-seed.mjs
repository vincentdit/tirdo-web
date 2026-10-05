#!/usr/bin/env node
// ---------------------------------------------------------------------------
// Generate cms/src/seed-data.generated.json from the single source of truth,
// frontend/src/lib/content.ts, so booting the CMS once with SEED_DATA=true on
// an EMPTY database loads the real TIRDO content — published, and via the
// Strapi document service (correct v5 publish semantics, no API token needed).
//
// Usage (Node >= 22; the repo's dev machine runs Node 24):
//   node cms/scripts/gen-seed.mjs
//   # Node 22 / 23.5 and older need the flag:
//   node --experimental-strip-types cms/scripts/gen-seed.mjs
//
// Then, on a fresh database:
//   docker compose run --rm -e SEED_DATA=true cms   # or set SEED_DATA=true and boot
//
// Re-run this generator whenever content.ts changes to refresh the seed.
// It only maps fields that exist on each content type's schema, so the
// document service accepts every entry without validation errors.
// ---------------------------------------------------------------------------
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const contentPath = resolve(here, '../../frontend/src/lib/content.ts');

let C;
try {
  C = await import(pathToFileURL(contentPath).href);
} catch (e) {
  console.error('Could not import content.ts — Node could not strip its types.');
  console.error('Run with Node >= 22 and type stripping, e.g.:');
  console.error('  node --experimental-strip-types cms/scripts/gen-seed.mjs');
  console.error('Original error:', e.message);
  process.exit(1);
}

// Drop undefined/null/'' so we never send empty optional fields to Strapi.
const clean = (o) =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && v !== null && v !== ''));
// richtext fields want a single markdown string; content.ts holds string[].
const rich = (arr) => (Array.isArray(arr) ? arr.filter(Boolean).join('\n\n') : arr || undefined);

const articles = (C.news || []).map((n) =>
  clean({
    title: n.title, slug: n.slug, excerpt: n.excerpt, body: n.body,
    category: n.category, date: n.date, imageUrl: n.image, sourceUrl: n.sourceUrl,
  })
);

const projects = (C.projects || []).map((p) =>
  clean({
    title: p.title, slug: p.slug, summary: p.summary,
    department: p.department, status: p.status,
    researchArea: C.projectAreaSlug ? C.projectAreaSlug(p) : p.researchArea,
    year: p.year, funder: p.funder, imageUrl: p.image,
  })
);

const publications = (C.publications || []).map((p) =>
  clean({
    title: p.title, slug: p.slug, type: p.type, year: p.year,
    abstract: p.abstract, authors: p.authors, keywords: p.keywords,
    doi: p.doi, citation: p.citation, fileUrl: p.fileUrl,
  })
);

const services = (C.services || []).map((s) =>
  clean({ title: s.title, slug: s.slug, description: s.description, icon: s.icon, body: rich(s.body) })
);

const departments = (C.departments || []).map((d) => {
  const sections = (d.sections || []).map(
    (x) => `**${x.name}**${x.items && x.items.length ? ': ' + x.items.join(', ') : ''}`
  );
  return clean({
    title: d.title, slug: d.slug, group: d.group, blurb: d.blurb,
    body: rich([...(d.body || []), ...sections]),
  });
});

const vacancies = (C.vacancies || []).map((v) =>
  clean({
    title: v.title, slug: v.slug, department: v.department, category: v.category,
    location: v.location, description: v.description, body: v.body, // json array
    postedDate: v.postedDate, closingDate: v.closingDate, applyUrl: v.applyUrl,
  })
);

const tenders = (C.tenders || []).map((t) =>
  clean({
    title: t.title, slug: t.slug, reference: t.reference, category: t.category,
    description: t.description, postedDate: t.postedDate, closingDate: t.closingDate,
    documentUrl: t.documentUrl,
  })
);

const technologies = (C.technologies || []).map((t) =>
  clean({
    title: t.title, slug: t.slug, summary: t.summary, sector: t.sector, maturity: t.maturity,
    body: rich(t.body), benefits: t.benefits, applications: t.applications,
    relatedServiceSlug: t.relatedServiceSlug, imageUrl: t.image,
  })
);

// Order is not significant (no relations between these types), but keep it
// stable for readable diffs.
const seed = {
  'api::article.article': articles,
  'api::department.department': departments,
  'api::service.service': services,
  'api::project.project': projects,
  'api::publication.publication': publications,
  'api::technology.technology': technologies,
  'api::vacancy.vacancy': vacancies,
  'api::tender.tender': tenders,
};

const out = resolve(here, '../src/seed-data.generated.json');
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(seed, null, 2) + '\n', 'utf8');

const counts = Object.entries(seed)
  .map(([k, v]) => `${k.split('.').pop()}=${v.length}`)
  .join(', ');
console.log('Wrote', out);
console.log('Seed counts:', counts);
