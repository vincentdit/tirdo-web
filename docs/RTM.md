# Requirements Traceability Matrix (RTM)

Maps the specification's functional (FR-*) and non-functional (NFR-*)
requirement groups to where they are implemented and how they are verified.
Status: **Done**, **Partial**, or **Not started**. This is the living evidence
record the e-GA governance framework expects — update it as work lands.

## Functional

| Req | Requirement | Status | Implementation | Verification |
|---|---|---|---|---|
| FR-HOME | Home / landing | Done | `app/page.tsx`, `hero-slider.tsx` | e2e smoke: home renders |
| FR-ABOUT | About / governance / structure | Done | `app/about/**`, `lib/content` (board, orgStructure) | e2e a11y `/about` |
| FR-DEPT | Departments & divisions | Done | `app/departments/**`, `lib/content.departments` | e2e a11y `/departments` |
| FR-SERV | Services catalogue | Done | `app/services/**` | e2e a11y `/services` |
| FR-RES | Research projects (filterable) | Done | `projects-explorer.tsx`, `projectAreaSlug()` | unit: area mapping |
| FR-PUB | Publications + metadata | Done | `publications-explorer.tsx` | e2e a11y `/publications` |
| FR-NEWS | News & events | Done | `app/news/**`, `app/events`, `strapi.getNews` | build/render |
| FR-CAR | Vacancies (taxonomy, auto-archive) | Done | `vacancies-explorer.tsx`, `isOpen()` | unit: isOpen; e2e: careers |
| FR-TEN | Tenders (taxonomy, auto-archive) | Done | `tenders-explorer.tsx`, `isOpen()` | unit: isOpen; e2e: tenders |
| FR-SEARCH | Global search (facets, suggest) | Done | `lib/search.ts`, `app/api/search/**`, `search-client.tsx` | unit: gatherDocuments; e2e: search |
| FR-CONTACT | Contact & enquiry | Partial | `contact-form.tsx`, `app/api/contact` | e2e a11y `/contact` |
| FR-CMS | Content management | Done | Strapi (`cms/`) content types | manual |
| FR-I18N | Bilingual EN/Kiswahili | Partial | `next-intl` chrome + Strapi i18n on all content types, `strapi.mergeLocale` per-field EN fallback | unit: mergeLocale; e2e: language switch (content translation still to author) |
| FR-TECH | Technology catalogue | Not started | — | — |
| FR-LAB | Laboratory services + LIMS gateway | Not started | — | — |
| FR-CON | Consultancy | Not started | — | — |
| FR-TRN | Training | Not started | — | — |
| FR-AUD | Audit trail of admin actions | Done | `cms/src/audit.js`, `/api/audit-log/verify` | chain logic test |

## Non-functional

| Req | Requirement | Status | Implementation | Verification |
|---|---|---|---|---|
| NFR-SEC | Security controls | Partial | Nginx headers + rate limits (`nginx/conf.d`), CSP report-only | `nginx -t`; `docs/SECURITY.md` |
| NFR-TLS | HTTPS / TLS | Partial | Opt-in TLS edge (`nginx/tls`, `scripts/tls-setup.sh`) | `nginx -t` with cert |
| NFR-ACC | Accessibility (WCAG 2.1 AA) | Done | contrast/label/motion fixes | e2e axe: 0 violations |
| NFR-SEO | SEO | Done | `sitemap.ts`, `robots.ts`, `lib/seo`, canonicals | unit: seo; e2e: robots/sitemap |
| NFR-PERF | Performance | Partial | SSR + local assets, gzip | — |
| NFR-BKP | Backups | Partial | `scripts/backup.sh` / `restore.sh` | shellcheck; manual restore |
| NFR-DR | Disaster recovery | Partial | `docs/BACKUP-DR.md` runbook | quarterly test restore |
| NFR-CI | CI/CD | Done | `.github/workflows/ci.yml` (lint, tsc, unit, e2e, security, build) | CI runs |
| NFR-TEST | Testing / QA | Partial | Vitest + Playwright + axe | this suite |
| NFR-AVL | Availability / monitoring | Not started | healthchecks only | — |
| NFR-WAF | Web application firewall | Partial | Opt-in OWASP CRS proxy (`docker-compose.waf.yml`, `nginx/waf`), DetectionOnly | `docker compose config`; runtime validate on host (`docs/WAF.md`) |
| NFR-MFA | Admin MFA | Partial | Keycloak TOTP (`scripts/keycloak-mfa.sh`); Strapi/MinIO/Matomo/OpenSearch documented | `bash -n`, shellcheck; enrol + enforce on host (`docs/MFA.md`) |
| NFR-VAPT | Pen test | Not started | — | — |

## How to use

When you add or change a feature: add/adjust its row, point Implementation at
the files, and cite the test that proves it. A requirement is only **Done** when
it has a verification reference.
