# TIRDO Web — security audit

Date: 2026-10-23  
Scope: source, Compose, Nginx, Next.js API routes, Strapi custom code, portal authz.  
Branch at audit start: `mabele-tirdo-web` @ `111d12e`.  
This application is not claimed to be completely secure.

## Inventory (verified in-repo)

| Component | What exists | Trust boundary |
|-----------|-------------|----------------|
| Public site | Next.js 14 App Router (`frontend`) | Browser → Nginx :80 → frontend :3000 |
| Portal CMS UI | `/portal` cookie `tirdo_portal_token` (Strapi admin JWT) | Same origin; CMS not published on host |
| Public SSO | Keycloak 26, nginx `/auth`, PKCE | Public |
| CMS | Strapi 5.5, Postgres 16 | Docker network only |
| Media | MinIO; public read via `/cms-media` | Console bound `BIND_ADMIN` |
| Search | OpenSearch 2.17 with security plugin **disabled** | Docker network |
| Analytics | Matomo + MariaDB; tracker proxied `/s/*` | Console bound `BIND_ADMIN` |
| Mail | Mailpit local SMTP | Console bound `BIND_ADMIN` |
| Payments | **No Stripe/Clickey in this repository** | N/A |
| WAF | `docker-compose.waf.yml` opt-in, DetectionOnly | Not on by default |
| TLS | Mapped :443; no certs in default conf | HTTP LAN still in use |

Secrets live in `.env` (gitignored). `.env.example` uses placeholders only. Secret **values** are not recorded here.

## Findings

### TIRDO-001 — Unauthenticated cache purge and search reindex (High) — **fixed**

- **Component:** `frontend/src/app/api/revalidate/route.ts`, `frontend/src/app/api/search/reindex/route.ts`
- **Evidence:** POST succeeded when `SEARCH_ADMIN_TOKEN` was unset; query `?token=` was accepted.
- **Attack:** Anyone who can reach Nginx could flush the public cache or force a full reindex (availability / stale-content abuse).
- **Fix:** Fail closed. Header `x-reindex-token` only. Constant-time compare.

### TIRDO-002 — Portal gallery upload without media grant (High) — **fixed**

- **Component:** `frontend/src/app/api/portal/media/route.ts` POST
- **Evidence:** GET required `canManageSite`; POST only required a valid portal cookie.
- **Attack:** Any signed-in CMS user could upload files (vertical privilege).
- **Fix:** Same grant as gallery GET.

### TIRDO-003 — Stored XSS via search highlights (High) — **fixed**

- **Component:** `frontend/src/lib/search.ts`, `search-client.tsx` `dangerouslySetInnerHTML`
- **Evidence:** OpenSearch highlight HTML was rendered; CMS body can contain markup.
- **Attack:** Published content with HTML could execute in visitors’ browsers.
- **Fix:** Escape highlight HTML; allow only `<mark>`.

### TIRDO-004 — SVG upload XSS (Medium) — **fixed**

- **Component:** portal media POST allowed `image/svg+xml`.
- **Fix:** SVG rejected. JPG/PNG/WebP/GIF/PDF remain.

### TIRDO-005 — CSRF on cookie portal APIs (Medium) — **fixed**

- **Component:** HttpOnly cookie, `SameSite=lax`, no Origin check.
- **Fix:** Middleware requires same-origin Origin/Referer on mutating `/api/portal/*` except login and forgot-password.

### TIRDO-006 — Audit verify and admin tokens optional / in query string (Medium) — **fixed**

- **Component:** `cms/src/api/audit-log/controllers/audit-log.js`
- **Fix:** `AUDIT_LOG_TOKEN` required; header only.

### TIRDO-007 — Strapi CORS `*` with credentials (Medium) — **fixed**

- **Component:** `cms/config/middlewares.js`, Compose default
- **Impact:** Lower while CMS is unpublished; high if CMS is ever exposed.
- **Fix:** Default origin is `PUBLIC_URL`.

### TIRDO-008 — Weak login rate limit (Medium) — **fixed at edge**

- **Component:** `/api/portal/login` used the general `/api/` 10 r/s zone.
- **Fix:** Dedicated `req_write` limit on login and forgot-password.

### TIRDO-009 — Portal `next` open redirect (Low) — **fixed**

- Login already preferred `/portal`; now rejects `//`, `..`, and schemes.

### TIRDO-010 — Keycloak `start-dev` in Compose (High in production) — **documented**

- **Evidence:** `command: ["start-dev", ...]` in `docker-compose.yml`.
- **Why not changed:** Current LAN/HTTP SSO depends on this. Switching to `start` without HTTPS and hostname settings would break Sign in.
- **Plan:** Use production Keycloak start + TLS before internet go-live (`docs/TLS.md`, `docs/MFA.md`).

### TIRDO-011 — OpenSearch security plugin disabled (High if exposed) — **documented**

- Internal-only today (no host port). Enable security plugin or keep unpublished.

### TIRDO-012 — MinIO anonymous download on media bucket (Medium) — **accepted for public media**

- Website needs public logos/PDFs via `/cms-media`. Residual: unlisted object guessing if object names leak.

### TIRDO-013 — CSP Report-Only; HTTP in production-oriented stack (Medium) — **documented**

- HSTS is sent but ineffective on HTTP. Enforce CSP and HTTPS per `docs/TLS.md` after a browser pass.

### TIRDO-014 — CMS image container runs as root (Low) — **documented**

- Changing UID can break the uploads volume. Plan a non-root user in a dedicated change.

### TIRDO-015 — Next.js `images.remotePatterns` allows any host (Low) — **documented**

- Residual SSRF via the image optimizer if an attacker can set a remote `src`. Prefer same-origin `/cms-media`.

### TIRDO-016 — No application MFA enrollment in the portal (Informational)

- Strapi 2FA is detected on login (HTTP 202). Keycloak MFA is operational, not code. See `docs/MFA.md`.

### TIRDO-017 — Public REST create for contact/feedback (Informational)

- Intended. Honeypot + nginx rate limit. Residual spam without a WAF or CAPTCHA.

## Checks performed vs not performed

| Area | Status |
|------|--------|
| Static review of Next API, portal authz, Strapi custom routes | Performed |
| Unit tests for new security helpers | Added |
| `npm audit` / Trivy in this session | **Not run** (host has no npm on PATH) |
| Dynamic pentest of live production | **Not performed** (forbidden; LAN server not attacked) |
| Payment webhooks | N/A (no Stripe in repo) |
| Independent VAPT | Still required before public go-live |
