#!/usr/bin/env bash
# Register the public website URL on the tirdo-web client.
# Realm JSON import does not update an existing Keycloak database.
set -euo pipefail

KCADM="${KCADM:-/opt/keycloak/bin/kcadm.sh}"
KC_URL="${KEYCLOAK_URL:-http://keycloak:8080/auth}"
REALM="${KEYCLOAK_REALM:-tirdo}"
CLIENT_ID="${KEYCLOAK_CLIENT_ID:-tirdo-web}"
SITE="${PUBLIC_URL:-http://localhost}"
SITE="${SITE%/}"
ADMIN_USER="${KEYCLOAK_ADMIN:-admin}"
ADMIN_PASS="${KEYCLOAK_ADMIN_PASSWORD:-}"

if [ -z "$ADMIN_PASS" ]; then
  echo "[keycloak-config] KEYCLOAK_ADMIN_PASSWORD is empty" >&2
  exit 1
fi

echo "[keycloak-config] waiting for Keycloak at $KC_URL"
for _ in $(seq 1 60); do
  if "$KCADM" config credentials --server "$KC_URL" --realm master \
    --user "$ADMIN_USER" --password "$ADMIN_PASS" >/dev/null 2>&1; then
    break
  fi
  sleep 5
done

"$KCADM" config credentials --server "$KC_URL" --realm master \
  --user "$ADMIN_USER" --password "$ADMIN_PASS"

CID="$("$KCADM" get clients -r "$REALM" -q clientId="$CLIENT_ID" --fields id --format csv --noquotes 2>/dev/null | tail -n 1 | tr -d '\r')"
if [ -z "$CID" ] || [ "$CID" = "id" ]; then
  echo "[keycloak-config] client $CLIENT_ID was not found in realm $REALM" >&2
  exit 1
fi

cat > /tmp/tirdo-web-client.json <<EOF
{
  "rootUrl": "${SITE}",
  "baseUrl": "/",
  "redirectUris": [
    "/*",
    "${SITE}",
    "${SITE}/",
    "${SITE}/*",
    "${SITE}/api/auth/callback",
    "http://localhost/*",
    "http://localhost/api/auth/callback",
    "http://127.0.0.1/*",
    "http://127.0.0.1/api/auth/callback"
  ],
  "webOrigins": ["+", "*", "${SITE}"],
  "publicClient": true,
  "standardFlowEnabled": true,
  "directAccessGrantsEnabled": true,
  "attributes": {
    "post.logout.redirect.uris": "+",
    "pkce.code.challenge.method": "S256"
  }
}
EOF

"$KCADM" update "clients/$CID" -r "$REALM" -f /tmp/tirdo-web-client.json
echo "[keycloak-config] $CLIENT_ID accepts Sign in from ${SITE}/api/auth/callback"
