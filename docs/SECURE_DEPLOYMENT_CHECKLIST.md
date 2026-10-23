# TIRDO Web — secure deployment checklist

Do not skip backups. Do not rotate production secrets in this change unless operators already planned it.

## Before pulling this change

- [ ] Snapshot Compose volumes (`postgres_data`, `mariadb_data`, `minio_data`, `matomo_data`, `strapi_uploads`).
- [ ] Record current image tags / git SHA.
- [ ] Confirm `.env` is not committed.

## Environment (placeholders only — set real values in `.env`, never in git)

- [ ] `SEARCH_ADMIN_TOKEN` — long random; same value for `frontend` and `cms`.
- [ ] `AUDIT_LOG_TOKEN` — long random; CMS only.
- [ ] `STRAPI_CORS_ORIGINS` unset (defaults to `PUBLIC_URL`) or an explicit origin list. Never `*` with credentials.
- [ ] Database, Strapi, Keycloak, MinIO, Matomo passwords are not the `.env.example` placeholders.
- [ ] `BIND_ADMIN=127.0.0.1` so Keycloak, MinIO, Matomo, Mailpit, OpenSearch Dashboards are not on the LAN.
- [ ] SMTP points at real mail in production (not Mailpit).

## Application rollout

```bash
git pull
# add SEARCH_ADMIN_TOKEN and AUDIT_LOG_TOKEN to .env if missing
docker compose up -d --build frontend cms nginx
```

- [ ] `docker compose ps` healthy.
- [ ] Public site loads.
- [ ] Portal login works.
- [ ] Publish one article: site updates (revalidate 200 in cms logs, not 401).
- [ ] User without gallery grant cannot upload on `/portal/gallery`.
- [ ] Search result snippets do not execute HTML.

## HTTPS / edge (go-live, not this patch)

- [ ] TLS at Nginx or the load balancer (`docs/TLS.md`).
- [ ] Then rely on HSTS already configured.
- [ ] Rename CSP from Report-Only to enforcing after a console pass (`docs/SECURITY.md`).
- [ ] Optional WAF: DetectionOnly first (`docs/WAF.md`).

## Identity

- [ ] Keycloak MFA for admins (`docs/MFA.md`).
- [ ] Replace `start-dev` with production Keycloak start once HTTPS hostnames work.
- [ ] Strapi Super Admin MFA.

## Monitoring and backups

- [ ] Watch nginx 401/403/429 on `/api/portal/login` and `/api/revalidate`.
- [ ] Confirm audit verify with header token only (`docs/AUDIT-LOG.md`).
- [ ] Restore drill (`docs/BACKUP-DR.md`).

## Rollback

```bash
git checkout <previous-sha>
docker compose up -d --build frontend cms nginx
```

Volumes are not deleted by this rollback.

## Residual (operators)

Independent VAPT, malware scanning of uploads, secret-store instead of `.env`, OpenSearch security plugin if the search port is ever published, non-root CMS image.
