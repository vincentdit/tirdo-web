# Backup & disaster recovery

Scripts: `scripts/backup.sh` (create) and `scripts/restore.sh` (restore). Run
them on the Docker host, from the project root, with the stack running.

## What is backed up

Each run writes to `backups/<timestamp>/`:

| Item | File | Method |
|---|---|---|
| Postgres (Strapi + Keycloak, all DBs & roles) | `postgres-all.sql.gz` | `pg_dumpall` |
| MariaDB (Matomo) | `matomo.sql.gz` | `mariadb-dump --single-transaction` |
| Strapi uploads | `strapi-uploads.tgz` | tar of the uploads volume |
| MinIO objects | `minio.tgz` | tar of the MinIO data volume |
| Config | `config/` | `.env`, `docker-compose.yml`, `nginx/` |
| Integrity | `SHA256SUMS`, `manifest.txt` | checksums + summary |

OpenSearch is **not** backed up — it is a derived index that rebuilds itself
from the CMS/content (see `docs/` search notes), so it needs no backup.

## Running a backup

```bash
./scripts/backup.sh
```

Options via environment:

- `BACKUP_DIR` — output root (default `./backups`).
- `BACKUP_RETENTION_DAYS` — prune older local backups (default `14`).
- `BACKUP_REMOTE` — an `rclone` remote for off-site copy, e.g.
  `offsite:tirdo-backups` (requires `rclone` configured on the host).

**Keep backups private** — they contain database dumps and a copy of `.env`.
Restrict the backup directory and any off-site bucket.

## Scheduling (nightly)

Cron (host):

```cron
# /etc/cron.d/tirdo-backup — 02:30 every day
30 2 * * * deploy cd /opt/tirdo-web && BACKUP_REMOTE=offsite:tirdo-backups ./scripts/backup.sh >> /var/log/tirdo-backup.log 2>&1
```

Or a systemd timer (`tirdo-backup.service` + `tirdo-backup.timer` with
`OnCalendar=*-*-* 02:30:00`).

## Restoring

```bash
./scripts/restore.sh backups/<timestamp>          # interactive confirm
./scripts/restore.sh backups/<timestamp> --yes    # non-interactive
```

It verifies `SHA256SUMS` first, then restores Postgres, MariaDB, uploads and
MinIO. **Destructive** — it overwrites current data. Afterwards:

```bash
docker compose restart cms matomo keycloak
```

## Disaster-recovery runbook

Target **RPO ≤ 24h** (nightly backups; tighten by running more often) and
**RTO ≤ 2h** on a replacement host:

1. Provision a host with Docker + Docker Compose.
2. `git clone` the repo (or restore `config/` from the backup).
3. Put the backed-up `.env` in place.
4. `docker compose up -d` and wait for health checks.
5. `./scripts/restore.sh <backup> --yes`.
6. `docker compose restart cms matomo keycloak`.
7. Verify: site loads, admin login works, search returns results
   (`/api/search?q=…`), analytics records, and the audit log verifies
   (`/api/audit-log/verify`).

## Test restores

A backup you have never restored is a hope, not a plan. **Quarterly**, restore
the latest backup onto a throwaway host (or a separate compose project) and run
the verification in step 7. Record the date and result.
