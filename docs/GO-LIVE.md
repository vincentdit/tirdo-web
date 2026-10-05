# Go-live runbook

An ordered, checkable path from the current build to a live production site.
Each phase references the detailed doc for that area. Work top-to-bottom; do not
skip the validation gates (smoke test, restore drill, UAT).

Legend: ☐ = to do. Record who/when in the sign-off table at the end.

## 0. Prerequisites & freeze

- ☐ All work merged to `main` and pushed (`git push origin main`); CI green.
- ☐ Suites pass locally: `cd frontend && npm ci && npm test && npm run test:e2e`.
- ☐ Tag the release: `git tag -a v1.0.0 -m "Public launch" && git push --tags`.
- ☐ Decide the production domain(s) and who controls DNS.
- ☐ Confirm the production host: Ubuntu Server LTS, Docker Engine + Compose v2
  (≥ 2.24 for the WAF override), adequate CPU/RAM/disk.

## 1. Provision the host

- ☐ Install Docker Engine + Compose plugin; add the deploy user to `docker`.
- ☐ Firewall (ufw): allow 22, 80, 443 only. Do **not** expose 1337, 8080, 9200,
  5601, 9001/9101, 3001, 8092 publicly — bind them to localhost or a VPN.
- ☐ Clone the repo to `/opt/tirdo-web`.
- ☐ Point DNS A/AAAA records at the host (keep TTL low during cutover).

## 2. Secrets & configuration

- ☐ `cp .env.example .env`; set **strong, unique** values for every secret
  (Postgres/MariaDB passwords, Strapi `APP_KEYS`/`API_TOKEN_SALT`/`ADMIN_JWT_SECRET`/`JWT_SECRET`,
  Keycloak admin, MinIO keys, `MATOMO_API_TOKEN`, `SEARCH_ADMIN_TOKEN`).
- ☐ Set `PUBLIC_URL`/`NEXT_PUBLIC_SITE_URL` to the real https domain; `NODE_ENV=production`.
- ☐ Set portal gateway URLs: `NEXT_PUBLIC_NILIMS_URL`, `NEXT_PUBLIC_CIAP_URL`,
  `NEXT_PUBLIC_TELTP_URL` (else the gateways fall back to `/e-services`).
- ☐ Configure outbound email for the contact form: point Strapi's email provider
  at a real SMTP relay and set `CONTACT_RECIPIENT` (see `docs/ADMIN-MANUAL.md`).
  Mailpit is dev-only — do not use it in production.
- ☐ Store `.env` with `chmod 600`; never commit it.

## 3. Build, bring up, seed content

- ☐ `docker compose build`
- ☐ `docker compose up -d`
- ☐ Wait for health: `docker compose ps` (postgres, mariadb, cms, minio,
  opensearch, frontend all healthy).
- ☐ Seed the real content on the empty DB (see `cms/scripts/README.md`):
  `node cms/scripts/gen-seed.mjs` then `docker compose run --rm -e SEED_DATA=true cms`.
  Verify counts in the CMS admin, then leave `SEED_DATA` unset.
- ☐ Confirm search is populated: `curl -s localhost/api/search?q=energy` returns hits.
- ☐ Enter/adjust real content and Kiswahili translations in the CMS
  (`docs/translations/sw-content.md` is the drafted starting point).

## 4. HTTPS / TLS

- ☐ Issue a real certificate (Let's Encrypt) per `docs/TLS.md`; run `tls-setup.sh`.
- ☐ Confirm `nginx -t` passes in the running image before reload.
- ☐ Verify `https://<domain>/` serves with a valid chain; HTTP redirects to HTTPS.
- ☐ Set up `tls-renew.sh` on a cron/timer.

## 5. Security hardening

- ☐ Enable the WAF in **DetectionOnly** first (`docs/WAF.md`):
  `docker compose -f docker-compose.yml -f docker-compose.waf.yml up -d`.
  Watch the audit log for false positives; tune, then flip to `On`.
- ☐ Enable Keycloak MFA (`docs/MFA.md`): run `scripts/keycloak-mfa.sh` for the app
  realm and `master`; enforce OTP; ensure every admin enrols an authenticator.
- ☐ Front the Strapi admin with SSO or restrict `:1337` to a trusted network.
- ☐ Confirm security headers/CSP and rate limits are active (`docs/SECURITY.md`);
  move CSP from report-only to enforcing once clean.

## 6. Smoke test (production)

- ☐ `GET /api/healthz` → 200; `GET /api/health` → 200 (cms + opensearch ok).
- ☐ Home, About, Departments, Services, Technology, Laboratory, Consultancy,
  Training, Projects, Publications, News, Events, Careers, Tenders, Contact,
  e-Services all render.
- ☐ Global search returns results and facets; suggestions work.
- ☐ Language switch flips EN↔SW; translated content shows.
- ☐ Contact form submits → message stored in CMS + notification email received.
- ☐ e-Services sign-in via Keycloak works (and MFA prompts).
- ☐ `robots.txt` and `sitemap.xml` served; new sections present in the sitemap.
- ☐ Analytics: Matomo records a visit via the first-party `/s/` proxy.
- ☐ Portal gateways (NILIMS/CIAP/TeLTP) point at the right systems.

## 7. Monitoring & alerting

- ☐ Bring up monitoring: `docker compose -f docker-compose.yml -f docker-compose.monitoring.yml up -d`.
- ☐ In Uptime Kuma, add the monitors from `docs/MONITORING.md` (site, `/api/healthz`,
  `/api/health`, CMS, Keycloak, OpenSearch, Matomo) and a notification channel.
- ☐ Confirm cAdvisor metrics load; restrict both ports to trusted access.

## 8. Backups & tested restore

- ☐ Schedule `scripts/backup.sh` (cron) with off-site copy and retention
  (`docs/BACKUP-DR.md`).
- ☐ **Restore drill**: restore the latest backup onto a scratch host/stack with
  `scripts/restore.sh` and confirm the site, CMS data, uploads and search come
  back. Record RPO/RTO actuals.

## 9. UAT sign-off

- ☐ Run `docs/UAT-CHECKLIST.md` with TIRDO business representatives.
- ☐ Log defects; fix or accept each; obtain written sign-off before cutover.

## 10. Cutover & post-launch

- ☐ Final content freeze; take a fresh backup.
- ☐ Lower DNS TTL ahead of time; switch DNS to production; confirm propagation.
- ☐ Re-run the phase-6 smoke test against the live domain.
- ☐ Watch monitoring and logs for the first 24–48h.
- ☐ Schedule the independent VAPT (NFR-VAPT); remediate findings.
- ☐ Announce launch.

## Rollback

- Keep the previous release tag and a pre-cutover backup.
- To roll back: `git checkout <previous-tag>`, `docker compose up -d --build`,
  restore the pre-cutover backup if data changed, revert DNS if needed.
- The WAF and monitoring are opt-in overrides — dropping the `-f` override files
  returns to the base stack without them.

## Sign-off

| Phase | Owner | Date | Notes |
|---|---|---|---|
| Host provisioned | | | |
| Config & secrets set | | | |
| Content seeded/migrated | | | |
| TLS live | | | |
| Security enabled (WAF/MFA) | | | |
| Smoke test passed | | | |
| Monitoring live | | | |
| Restore drill passed | | | |
| UAT signed off | | | |
| Cutover complete | | | |
| VAPT scheduled | | | |
