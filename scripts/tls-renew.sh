#!/usr/bin/env bash
# -----------------------------------------------------------------------
# Renew the Let's Encrypt certificate and reload nginx (no downtime).
# Run on the Docker host, project root. Schedule it (e.g. twice daily) after
# HTTPS has been enabled with tls-setup.sh letsencrypt.
#
#   ./scripts/tls-renew.sh <domain>
#
# Uses webroot renewal (nginx serves the ACME challenge from nginx/acme while
# it keeps running), copies the renewed cert into nginx/certs, and reloads.
# -----------------------------------------------------------------------
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$HERE"
DOMAIN="${1:?usage: $0 <domain>}"
CERTS="$HERE/nginx/certs"

command -v certbot >/dev/null 2>&1 || { echo "certbot not installed on host"; exit 1; }

echo "[tls] Renewing (if due)…"
certbot renew --webroot -w "$HERE/nginx/acme" --quiet

# Copy the (possibly renewed) certificate into the nginx cert dir and reload.
if [ -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
  cp "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" "$CERTS/fullchain.pem"
  cp "/etc/letsencrypt/live/$DOMAIN/privkey.pem"   "$CERTS/privkey.pem"
  docker compose exec -T nginx nginx -s reload && echo "[tls] nginx reloaded"
fi
