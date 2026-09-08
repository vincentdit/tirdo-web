# Performance (NFR-PERF)

The site is server-rendered (Next.js standalone) and serves all assets
first-party, so it starts fast. This documents the performance measures in
place and how to measure and keep them from regressing.

## Measures in place

- **Server-side rendering + standalone output** — pages are HTML on first
  byte; no client-side data waterfall for the main content.
- **First-party assets** — fonts load with `display=swap` and `preconnect`;
  imagery is served locally from `/media` (no third-party image hosts).
- **Deferred images** — below-the-fold images use `loading="lazy"` and
  `decoding="async"`; the hero and masthead load eagerly so the LCP image is
  not delayed.
- **Immutable caching** — `/media/*` is served with
  `Cache-Control: public, max-age=31536000, immutable` (content-addressed
  filenames), and Next fingerprints `/_next/static`. Set at the Nginx edge too
  for production if you terminate caching there.
- **Compression** — gzip is enabled at the Nginx edge (see `nginx/nginx.conf`).

## Measure with Lighthouse CI

A Lighthouse CI harness runs against a production build:

```bash
cd frontend
npm run build
npm run test:lighthouse        # runs lhci: starts `npm run start`, audits key pages
```

Config is in `frontend/lighthouserc.json` — it audits the home, about,
services, technology, publications and contact pages (desktop preset) and
asserts category budgets:

| Category | Budget | Gate |
|---|---|---|
| Performance | ≥ 0.80 | warn |
| Accessibility | ≥ 0.95 | error |
| Best practices | ≥ 0.90 | warn |
| SEO | ≥ 0.90 | warn |

Reports are written to `frontend/.lighthouseci/` (git-ignored). In CI the
**Lighthouse CI** job runs on every push/PR and uploads the report as an
artifact; it is report-only (`continue-on-error`) for now — tighten the gates
by raising `minScore` or flipping warnings to errors in `lighthouserc.json`.

## Further gains (when needed)

- Convert `<img>` to `next/image` for automatic responsive sizing and modern
  formats (requires wiring the Next image optimizer or a loader in the
  standalone container).
- Add a CDN in front of `/media` and `/_next/static` for edge caching.
- Budget-check bundle size in CI (`next build` already reports per-route JS).
