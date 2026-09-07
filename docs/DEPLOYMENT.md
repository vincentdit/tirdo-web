# Deployment guide

How to stand up and operate the TIRDO website stack. It runs as a set of Docker
containers orchestrated by `docker-compose.yml` (compose project name `tirdo`).

## Architecture & services

| Service | Container | Host port | Purpose |
|---|---|---|---|
| Nginx (edge) | `tirdo-nginx` | 80, 443 | Public entrypoint, reverse proxy, first-party analytics proxy, TLS |
| Frontend (Next.js) | `tirdo-frontend` | — (via Nginx) | The public website (SSR) |
| CMS (Strapi 5) | `tirdo-cms` | 1337 | Content management + REST API |
| PostgreSQL 16 | `tirdo-postgres` | — | Strapi + Keycloak databases |
| Keycloak 26 | `tirdo-keycloak` | 8080 | Identity / SSO |
| MinIO | `tirdo-minio` | 9100 (API), 9101 (console) | Object storage |
| OpenSearch 2 | `tirdo-opensearch` | — | Global search index |
| OpenSearch Dashboards | `tirdo-opensearch-dashboards` | 5601 | Search admin (optional) |
| MariaDB 11 | `tirdo-mariadb` | — | Matomo database |
| Matomo 5 | `tirdo-matomo` | 8095 | Analytics |
| Mailpit | `tirdo-mailpit` | 8025 | Captured email (dev) |

Only Nginx (80/443) needs to be public. Everything else can stay on the
internal Docker network or behind the firewall.

## Prerequisites

- Docker Engine + Docker Compose v2 (`docker compose`).
- ~8 GB RAM (OpenSearch + Keycloak + Matomo are the heavy ones).
- Ports 80/443 reachable for the public site; the admin ports (1337, 8080,
  8095, 9101, 5601) restricted to trusted networks.

## Configuration

Copy `.env.example` to `.env` and fill every value. Group by concern:

- **Public**: `PUBLIC_URL` (e.g. `https://tirdo.or.tz`), `NODE_ENV=production`.
- **Postgres**: `POSTGRES_USER`, `POSTGRES_PASSWORD`, `STRAPI_DB_NAME`, `KEYCLOAK_DB_NAME`.
- **Strapi secrets** (generate random values): `STRAPI_APP_KEYS`, `STRAPI_API_TOKEN_SALT`, `STRAPI_ADMIN_JWT_SECRET`, `STRAPI_TRANSFER_TOKEN_SALT`, `STRAPI_JWT_SECRET`, `STRAPI_ENCRYPTION_KEY`.
- **Keycloak**: `KEYCLOAK_ADMIN`, `KEYCLOAK_ADMIN_PASSWORD`, `KEYCLOAK_REALM`, `KEYCLOAK_CLIENT_ID`.
- **MinIO**: `MINIO_ROOT_USER`, `MINIO_ROOT_PASSWORD`, `MINIO_BUCKET`, `MINIO_ENDPOINT`.
- **Search**: `OPENSEARCH_INDEX` (e.g. `tirdo-content`), optional `SEARCH_ADMIN_TOKEN`.
- **Analytics**: `MATOMO_DB_*`, `MATOMO_API_TOKEN` (added after Matomo install).
- **Audit**: optional `AUDIT_LOG_TOKEN`.
- **Email (SMTP)**: `SMTP_*`, `EMAIL_FROM`, `EMAIL_REPLY_TO`, `CONTACT_RECIPIENT`.

Generate a secret: `openssl rand -base64 32`. **Never commit `.env`** — it is
git-ignored and included in backups; keep those private.

## First-time bring-up

```bash
cp .env.example .env      # then edit .env
docker compose up -d --build
```

On first start, the CMS automatically opens public read permissions, seeds
demo content on the empty database, and pushes content to OpenSearch. Wait for
health checks (`docker compose ps` shows `healthy`). Then:

1. **Keycloak** — create/confirm the realm and client (`KEYCLOAK_REALM` /
   `KEYCLOAK_CLIENT_ID`); an import script exists in `scripts/`.
2. **Matomo** — first run only, complete the install wizard at
   `http://<host>:8095`, create the site (Site ID 1), generate an API token,
   and put it in `.env` as `MATOMO_API_TOKEN`, then
   `docker compose up -d frontend`. See `docs/MATOMO.md`.
3. **Search** — the index self-populates on the first `/api/search` request
   (or `curl -X POST http://<host>/api/search/reindex`).

## Access

- Public site: `http://<host>/` (or `https://` once TLS is enabled)
- CMS admin: `http://<host>:1337/admin`
- Keycloak: `http://<host>:8080`
- MinIO console: `http://<host>:9101`
- Matomo: `http://<host>:8095`
- OpenSearch Dashboards: `http://<host>:5601`

## Redeploying / updating

```bash
git pull
docker compose up -d --build <service>     # e.g. frontend, cms, nginx
```

Rebuild `frontend` after changing any `NEXT_PUBLIC_*` value or public content;
rebuild `cms` after changing Strapi content types. On Windows/Docker Desktop,
Nginx config changes need `docker compose up -d --force-recreate nginx` because
of how the bind-mount is refreshed.

## HTTPS, backups, search

- **HTTPS** — see `docs/TLS.md` (opt-in; `scripts/tls-setup.sh`).
- **Backups & DR** — see `docs/BACKUP-DR.md` (`scripts/backup.sh` / `restore.sh`).
- **Reindex search** after bulk content changes — `POST /api/search/reindex`.

## Health & logs

```bash
docker compose ps                      # status + health
docker compose logs --tail=50 <service>
curl -I http://<host>/                 # security headers present?
curl http://<host>/api/search?q=energy # "engine":"opensearch" once indexed
curl http://<host>:1337/api/audit-log/verify   # audit chain intact
```

## Environments

Currently a single host. For e-GA compliance, run **separate dev, staging/UAT
and production** deployments — the same compose file with per-environment
`.env` (distinct secrets, domains and data). Promote by tag/branch through the
CI pipeline (`.github/workflows/ci.yml`), whose deploy stage is a documented
stub to wire to your target host.

## Troubleshooting

- **Nginx crash-loops with `"gzip" directive is duplicate`** — `nginx/nginx.conf`
  already sets `gzip on`; never re-declare it in `conf.d`.
- **`ERR_CONNECTION_REFUSED` on :80** — the stack or the nginx container is down;
  `docker compose ps` then `docker compose up -d` (or check nginx logs).
- **CMS shows `(unhealthy)` briefly at boot** — the healthcheck is strict during
  Strapi's first compile; give it a minute, then check `logs cms`.
- **Analytics blocked by ad blockers** — already mitigated via the first-party
  `/s/js` and `/s/e` proxy (see `docs/MATOMO.md`).
