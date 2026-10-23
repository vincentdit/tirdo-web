# TIRDO Web — remediation implemented

Changes are small and reversible. No database schema migrations. No production deploy or secret rotation was performed.

## Code and config

| Change | Files | Why | Compatibility |
|--------|--------|-----|----------------|
| Fail-closed revalidate/reindex | `frontend/src/app/api/revalidate/route.ts`, `frontend/src/app/api/search/reindex/route.ts`, `frontend/src/lib/security.ts` | Stop anonymous cache flush / reindex | **Requires** `SEARCH_ADMIN_TOKEN` in `.env` for both frontend and cms. After publish, cache refresh fails until the token is set. |
| Gallery authz + no SVG | `frontend/src/app/api/portal/media/route.ts` | Least privilege; no scriptable SVG | Staff without gallery grant cannot upload. Use PNG/JPG for logos. |
| Highlight sanitization | `frontend/src/lib/search.ts` | XSS | Search snippets still bold matches via `<mark>`. |
| Same-origin portal writes | `frontend/src/middleware.ts`, `frontend/src/lib/security-http.ts` | CSRF | Browser portal UI unchanged. Cross-origin scripts with stolen cookies are rejected. |
| Safe `next` | `frontend/src/components/tirdo-auth/login-form.tsx` | Open redirect | Still returns to `/portal/...`. |
| Search input caps | `frontend/src/app/api/search/route.ts`, `suggest/route.ts` | Resource abuse | Queries truncated to 200/80 chars; `from` max 1000. |
| Audit verify fail-closed | `cms/src/api/audit-log/controllers/audit-log.js` | Info leak | Set `AUDIT_LOG_TOKEN`. Header `x-audit-token` only. |
| CORS default | `cms/config/middlewares.js`, `docker-compose.yml` | No `*` + credentials | Uses `PUBLIC_URL`. |
| Login rate limits | `nginx/conf.d/default.conf` | Brute force | 1 r/s burst 5 login; burst 3 forgot-password. |
| Container hardening | `docker-compose.yml` `security_opt: no-new-privileges` on cms, frontend, nginx | Privilege escalation | Should not affect volumes or networks. |
| Env placeholders | `.env.example`, `scripts/setup.ps1` | New installs get tokens | Existing `.env` is not overwritten. |

## Tests added

- `frontend/src/lib/security.test.ts` — token fail-closed, highlight sanitization, CSRF origin, portal next paths.

## Rollback

Revert the commit that contains these files. Restore previous Nginx config if login rate limits mis-fire. If cache stop refreshing, confirm `SEARCH_ADMIN_TOKEN` is identical in cms and frontend.

## Intentionally not changed

- Keycloak `start-dev` (would break HTTP LAN SSO).
- OpenSearch `DISABLE_SECURITY_PLUGIN` (internal-only).
- MinIO anonymous download (needed for public media).
- Strapi models, portal business workflows, Keycloak public SSO.
- Production secrets (no rotation without an approved plan).
