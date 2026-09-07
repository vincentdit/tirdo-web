# ADR 0004 — First-party Matomo proxy for reliable, privacy-first analytics

- **Status:** Accepted
- **Date:** 2026-09
- **Deciders:** ICT team

## Context

Matomo provides privacy-first, self-hosted analytics (no third-party data
sharing), as specified. Ad/privacy blockers, however, block requests whose paths
contain `matomo.js` / `matomo.php`, under-counting visits. The Reporting API
also needs a server-side call, but Matomo validates the `Host` header against
its trusted install host, and `Host` is a forbidden header for browser `fetch`.

## Decision

Serve the tracker and tracking endpoint **first-party** through Nginx under
neutral paths — `/s/js` → `matomo.js`, `/s/e` → `matomo.php` — so blockers don't
recognise and drop them. For server-side reporting, the frontend calls an
**internal Nginx upstream on :8081** that pins the trusted `Host` for Matomo.
Analytics remains self-hosted; only same-origin, path-obfuscated requests reach
the browser.

## Consequences

- **Positive:** accurate visit counts despite blockers; no third-party analytics;
  the reporting token never reaches the browser.
- **Trade-off:** a small amount of Nginx configuration couples the site to
  Matomo's proxy paths (documented in `nginx/conf.d/default.conf` and
  `docs/MATOMO.md`).
- **Note:** the `/analytics` dashboard route is excluded from tracking so viewing
  stats doesn't inflate visit counts.
