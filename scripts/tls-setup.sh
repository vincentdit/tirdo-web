#!/usr/bin/env bash
# -----------------------------------------------------------------------
# Enable HTTPS at the Nginx edge. Run on the Docker host, project root.
#
#   ./scripts/tls-setup.sh local <domain>                 # self-signed (dev/testing)
#   ./scripts/tls-setup.sh letsencrypt <domain> <email>   # Let's Encrypt (production)
#
# It obtains a certificate, then swaps nginx/tls/default.tls.conf in for
# nginx/conf.d/default.conf — but only AFTER a pre-flight `nginx -t` in the
# real nginx image passes, so a bad config never reaches the running container.
# The previous HTTP config is backed up to nginx/conf.d/default.conf.http.bak.
#
# Let's Encrypt mode uses certbot in standalone mode for the first issuance and
# briefly stops nginx (~30s downtime); requires certbot on the host and DNS for
# <domain> pointing here with ports 80/443 open. Renew with tls-renew.sh.
# -----------------------------------------------------------------------
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$HERE"

MODE="${1:-}"; DOMAIN="${2:-}"; EMAIL="${3:-}"
IMAGE="nginx:1.27-alpine"
CERTS="$HERE/nginx/certs"
ACME="$HERE/nginx/acme"
TLSCONF="$HERE/nginx/tls/default.tls.conf"
TARGET="$HERE/nginx/conf.d/default.conf"

[ -n "$MODE" ] && [ -n "$DOMAIN" ] || { echo "usage: $0 local <domain> | letsencrypt <domain> <email>"; exit 1; }
mkdir -p "$CERTS" "$ACME"
log() { printf '[tls] %s\n' "$*"; }

case "$MODE" in
  local)
    log "Generating self-signed certificate for $DOMAIN…"
    openssl req -x509 -newkey rsa:2048 -nodes -days 365 \
      -keyout "$CERTS/privkey.pem" -out "$CERTS/fullchain.pem" \
      -subj "/CN=$DOMAIN" -addext "subjectAltName=DNS:$DOMAIN"
    ;;
  letsencrypt)
    [ -n "$EMAIL" ] || { echo "letsencrypt mode needs an email: $0 letsencrypt <domain> <email>"; exit 1; }
    command -v certbot >/dev/null 2>&1 || { echo "certbot not installed on host (apt install certbot)"; exit 1; }
    log "Obtaining Let's Encrypt certificate for $DOMAIN (nginx will stop briefly)…"
    docker compose stop nginx || true
    certbot certonly --standalone --preferred-challenges http \
      -d "$DOMAIN" --email "$EMAIL" --agree-tos -n
    cp "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" "$CERTS/fullchain.pem"
    cp "/etc/letsencrypt/live/$DOMAIN/privkey.pem"   "$CERTS/privkey.pem"
    ;;
  *)
    echo "unknown mode: $MODE (use 'local' or 'letsencrypt')"; exit 1;;
esac

# Render the TLS config with the domain filled in.
TMP="$(mktemp)"
sed "s/__DOMAIN__/$DOMAIN/g" "$TLSCONF" > "$TMP"

# Pre-flight: test the exact config in the real image before touching nginx.
log "Pre-flight nginx -t in $IMAGE…"
docker run --rm \
  -v "$HERE/nginx/nginx.conf:/etc/nginx/nginx.conf:ro" \
  -v "$TMP:/etc/nginx/conf.d/default.conf:ro" \
  -v "$CERTS:/etc/nginx/certs:ro" \
  "$IMAGE" nginx -t || { echo "pre-flight FAILED — not enabling TLS"; rm -f "$TMP"; exit 1; }

# Swap in (backup the working HTTP config once).
[ -f "$TARGET.http.bak" ] || cp "$TARGET" "$TARGET.http.bak"
cp "$TMP" "$TARGET"; rm -f "$TMP"

log "Recreating nginx with TLS…"
docker compose up -d --force-recreate nginx
sleep 3
docker compose ps nginx

cat <<EOF

[tls] Done. HTTPS is enabled for https://$DOMAIN
      HTTP now redirects to HTTPS. To roll back:
        cp nginx/conf.d/default.conf.http.bak nginx/conf.d/default.conf
        docker compose up -d --force-recreate nginx
$( [ "$MODE" = letsencrypt ] && echo "      Schedule renewal:  ./scripts/tls-renew.sh $DOMAIN  (see docs/TLS.md)" )
EOF
