#!/usr/bin/env bash
# -----------------------------------------------------------------------
# TIRDO stack backup — run on the Docker host (Ubuntu Server).
#
#   ./scripts/backup.sh
#
# Backs up, into ./backups/<timestamp>/:
#   - Postgres (all databases: Strapi + Keycloak)   -> postgres-all.sql.gz
#   - MariaDB  (Matomo analytics)                    -> matomo.sql.gz
#   - Strapi uploads volume                          -> strapi-uploads.tgz
#   - MinIO object storage volume                    -> minio.tgz
#   - Config (.env, docker-compose.yml, nginx/)      -> config/
#   - SHA256SUMS + manifest.txt
#
# Env (optional): BACKUP_DIR (default ./backups), BACKUP_RETENTION_DAYS (14),
#                 BACKUP_REMOTE (rclone remote, e.g. "offsite:tirdo-backups").
# -----------------------------------------------------------------------
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$HERE"

# Load environment (DB credentials etc.)
set -a; [ -f .env ] && . ./.env; set +a
: "${POSTGRES_USER:?POSTGRES_USER not set (is .env present?)}"
: "${MATOMO_DB_ROOT_PASSWORD:?MATOMO_DB_ROOT_PASSWORD not set}"

TS="$(date +%Y%m%d-%H%M%S)"
ROOT="${BACKUP_DIR:-$HERE/backups}"
DEST="$ROOT/$TS"
RETENTION="${BACKUP_RETENTION_DAYS:-14}"
mkdir -p "$DEST/config"

log() { printf '[backup] %s\n' "$*"; }

# 1) Postgres — all databases + roles.
log "Postgres (all databases)…"
docker exec -e PGPASSWORD="${POSTGRES_PASSWORD:-}" tirdo-postgres \
  pg_dumpall -U "$POSTGRES_USER" | gzip -9 > "$DEST/postgres-all.sql.gz"

# 2) MariaDB — Matomo.
log "MariaDB (Matomo)…"
docker exec tirdo-mariadb sh -c \
  "exec mariadb-dump -uroot -p\"$MATOMO_DB_ROOT_PASSWORD\" --single-transaction --databases \"${MATOMO_DB_NAME:-matomo}\" 2>/dev/null \
   || exec mysqldump -uroot -p\"$MATOMO_DB_ROOT_PASSWORD\" --single-transaction --databases \"${MATOMO_DB_NAME:-matomo}\"" \
  | gzip -9 > "$DEST/matomo.sql.gz"

# 3) Strapi uploads volume (mounted via the cms container).
log "Strapi uploads…"
docker run --rm --volumes-from tirdo-cms -v "$DEST:/backup" alpine \
  sh -c 'cd /opt/app/public/uploads 2>/dev/null && tar czf /backup/strapi-uploads.tgz . || echo "(no uploads dir)"'

# 4) MinIO object storage volume.
log "MinIO objects…"
docker run --rm --volumes-from tirdo-minio -v "$DEST:/backup" alpine \
  sh -c 'cd /data && tar czf /backup/minio.tgz .'

# 5) Config (never commit real secrets elsewhere; keep these backups private).
log "Config…"
cp -f .env "$DEST/config/.env" 2>/dev/null || true
cp -f docker-compose.yml "$DEST/config/docker-compose.yml"
cp -rf nginx "$DEST/config/nginx"

# 6) Checksums + manifest.
( cd "$DEST" && find . -type f ! -name SHA256SUMS -print0 | sort -z | xargs -0 sha256sum > SHA256SUMS )
{
  echo "TIRDO backup"
  echo "created:   $(date -Is)"
  echo "host:      $(hostname)"
  echo "retention: ${RETENTION} days"
  echo
  ( cd "$DEST" && du -h --max-depth=1 . | sort -k2 )
} > "$DEST/manifest.txt"

# 7) Optional off-site copy (rclone).
if [ -n "${BACKUP_REMOTE:-}" ] && command -v rclone >/dev/null 2>&1; then
  log "Off-site copy -> $BACKUP_REMOTE/$TS"
  rclone copy "$DEST" "$BACKUP_REMOTE/$TS" || log "WARN: off-site copy failed"
fi

# 8) Retention — prune old local backups.
log "Pruning backups older than ${RETENTION} days…"
find "$ROOT" -mindepth 1 -maxdepth 1 -type d -mtime "+${RETENTION}" -exec rm -rf {} + 2>/dev/null || true

log "Done -> $DEST"
du -sh "$DEST"
