#!/usr/bin/env bash
# -----------------------------------------------------------------------
# TIRDO stack restore — run on the Docker host.
#
#   ./scripts/restore.sh backups/<timestamp> [--yes]
#
# Restores Postgres, MariaDB, Strapi uploads and MinIO objects from a backup
# directory produced by backup.sh. DESTRUCTIVE — overwrites current data.
# Requires --yes (or an interactive "RESTORE" confirmation). The stack should
# be running (databases up) before restoring.
# -----------------------------------------------------------------------
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$HERE"
set -a; [ -f .env ] && . ./.env; set +a

SRC="${1:-}"
[ -n "$SRC" ] && [ -d "$SRC" ] || { echo "usage: $0 backups/<timestamp> [--yes]"; exit 1; }
SRC="$(cd "$SRC" && pwd)"

if [ "${2:-}" != "--yes" ]; then
  echo "About to RESTORE from $SRC — this OVERWRITES current databases and storage."
  read -r -p 'Type RESTORE to continue: ' ans
  [ "$ans" = "RESTORE" ] || { echo "aborted"; exit 1; }
fi

log() { printf '[restore] %s\n' "$*"; }

# Verify integrity first.
if [ -f "$SRC/SHA256SUMS" ]; then
  log "Verifying checksums…"
  ( cd "$SRC" && sha256sum -c SHA256SUMS >/dev/null ) && log "checksums OK" || { echo "CHECKSUM FAILURE — aborting"; exit 1; }
fi

# 1) Postgres.
if [ -f "$SRC/postgres-all.sql.gz" ]; then
  log "Restoring Postgres…"
  gunzip -c "$SRC/postgres-all.sql.gz" | docker exec -i -e PGPASSWORD="${POSTGRES_PASSWORD:-}" tirdo-postgres psql -U "$POSTGRES_USER" -d postgres
fi

# 2) MariaDB (Matomo).
if [ -f "$SRC/matomo.sql.gz" ]; then
  log "Restoring MariaDB (Matomo)…"
  gunzip -c "$SRC/matomo.sql.gz" | docker exec -i tirdo-mariadb sh -c \
    "exec mariadb -uroot -p\"$MATOMO_DB_ROOT_PASSWORD\" 2>/dev/null || exec mysql -uroot -p\"$MATOMO_DB_ROOT_PASSWORD\""
fi

# 3) Strapi uploads.
if [ -f "$SRC/strapi-uploads.tgz" ]; then
  log "Restoring Strapi uploads…"
  docker run --rm --volumes-from tirdo-cms -v "$SRC:/backup" alpine \
    sh -c 'mkdir -p /opt/app/public/uploads && cd /opt/app/public/uploads && tar xzf /backup/strapi-uploads.tgz'
fi

# 4) MinIO objects.
if [ -f "$SRC/minio.tgz" ]; then
  log "Restoring MinIO objects…"
  docker run --rm --volumes-from tirdo-minio -v "$SRC:/backup" alpine \
    sh -c 'cd /data && tar xzf /backup/minio.tgz'
fi

log "Restore complete. Restart services:  docker compose restart cms matomo keycloak"
