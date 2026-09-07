# Testing

Two layers, both run in CI (`.github/workflows/ci.yml`).

## Unit tests (Vitest)

Fast, Node-environment tests over the pure library logic — no DOM, no network
(CMS calls fall back to bundled content).

```
cd frontend
npm test          # vitest run
npm run test:watch
```

Covered (`frontend/src/**/*.test.ts`):

- `lib/content` — `isOpen()` auto-archive boundaries, `projectAreaSlug()`
  department→area mapping, `researchAreaName()`, and sample-data integrity
  (unique slugs, date formats).
- `lib/seo` — `absoluteUrl()` joining rules, and the Organization / WebSite
  JSON-LD shape (GovernmentOrganization, SearchAction).
- `lib/search` — `gatherDocuments()` indexes every content type with
  well-formed URLs and unique ids, including the `about:mission-vision`
  sentinel the self-populating index relies on.

## End-to-end + accessibility (Playwright)

Runs against a production build the config starts itself.

```
cd frontend
npx playwright install --with-deps chromium   # first time / CI
npm run build
npm run test:e2e
```

- `e2e/smoke.spec.ts` — home renders; the EN⇄SW language switch flips
  `<html lang>`; search returns results; careers lists a vacancy; tenders show
  structured rows; `robots.txt` and `sitemap.xml` are served.
- `e2e/a11y.spec.ts` — an **axe** WCAG 2.1 A/AA scan of nine key pages, asserting
  **zero** violations (guards the 81→0 result in `docs/ACCESSIBILITY.md`). Scans
  run with reduced motion so the hero is static and readings are deterministic.

Point at an already-running server with `BASE_URL=http://host:port`. Locally you
can skip the browser download by setting `PW_CHROMIUM` to an existing Chromium
binary.

## CMS audit-log chain test

The audit hash-chain has its own logic test (see the audit round) proving it
records the right actions and detects alteration, deletion and reordering.

## What isn't covered yet

Component/interaction unit tests (React Testing Library), load/performance
tests, and full UAT scripts. The e2e smoke layer is the safety net for now;
expand `e2e/` as features land.
