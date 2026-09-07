# API reference

Two API surfaces: the **frontend application routes** (served from the site
origin) and the **Strapi CMS REST API** (`:1337`). All responses are JSON.

## Frontend application API (`/api/*`)

### `GET /api/search`
Full-text search over all content types.

| Param | Description |
|---|---|
| `q` | query string (required) |
| `type` | filter to one type: News, Publication, Project, Service, Department, Vacancy, Tender, Page |
| `from` | pagination offset (default 0) |

Response: `{ hits: [{title, type, url, excerpt, highlight}], total, facets: [{type, count}], engine: "opensearch" | "local" }`.
Falls back to a local scan when OpenSearch is unavailable; the index
self-populates on first use.

### `GET /api/search/suggest?q=`
Autocomplete. Returns `{ suggestions: [{title, type, url}] }` (min 2 chars).

### `GET /api/search/reindex`  ·  `POST /api/search/reindex`
- `GET` → `{ exists, count }` (index status).
- `POST` → rebuilds the index; returns `{ ok, count }`. If `SEARCH_ADMIN_TOKEN`
  is set, requires header `x-reindex-token` (or `?token=`). Call after bulk CMS
  changes.

### `GET /api/analytics`
Visitor totals for the footer/dashboard: `{ today, month, total }` (unique
visitors, from Matomo's Reporting API). Returns nulls if analytics isn't
configured.

### `POST /api/contact`
Contact form. Body: `{ name, email, subject, message }`. Stores the message and
emails `CONTACT_RECIPIENT`. Returns `{ ok: true }` on success. Rate-limited at
the edge (see `docs/SECURITY.md`).

## Strapi CMS REST API (`:1337/api/*`)

Public **read** access (`find`, `findOne`) is granted at bootstrap for:
`articles`, `projects`, `publications`, `services`, `departments`, `pages`,
`vacancies`, `tenders`. Standard Strapi 5 query params apply (`sort`,
`filters`, `pagination`, `populate`).

```
GET /api/projects?populate=cover&sort=year:desc
GET /api/publications?filters[year][$eq]=2025
GET /api/vacancies?sort=closingDate:desc
GET /api/articles?filters[slug][$eq]=<slug>&populate=cover
```

Response shape (Strapi 5, attributes flattened onto the entity):
`{ data: [ { id, documentId, title, slug, ... } ], meta: { pagination } }`.

**Write** access is disabled for the public role except contact submissions:

```
POST /api/contact-messages       # public create (name, email, subject, message)
```

The frontend uses its own `/api/contact` route (which also emails); the Strapi
collection is the stored record.

### `GET /api/audit-log/verify`
Verifies the tamper-evident audit chain. Returns
`{ intact: true, count, head }` or `{ intact: false, brokenAt, reason }`.
If `AUDIT_LOG_TOKEN` is set, requires header `x-audit-token` (or `?token=`).
See `docs/AUDIT-LOG.md`. The audit log itself is not exposed over the public
API — browse it in the admin panel.

## Authentication

Public endpoints above need no auth. Admin operations use the Strapi admin
session (admin panel) or a Strapi **API token** (Settings → API Tokens) sent as
`Authorization: Bearer <token>`. Site sign-in for staff uses Keycloak (OIDC/PKCE).

## Notes & roadmap

- There is no versioned `/api/v1` public contract yet; the Strapi REST API is
  the current integration surface. A versioned, OpenAPI-documented public API
  is a planned "should-have" (see `docs/RTM.md`).
- Rate limits: `/api/*` and the contact endpoint are throttled at the Nginx
  edge; tune in `nginx/conf.d/default.conf`.
