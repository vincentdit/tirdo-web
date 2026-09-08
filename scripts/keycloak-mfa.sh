#!/usr/bin/env bash
# -----------------------------------------------------------------------
# Enable TOTP (authenticator-app) MFA in Keycloak. Run on the Docker host.
#
#   ./scripts/keycloak-mfa.sh [realm]     # default: $KEYCLOAK_REALM from .env
#
# It sets a TOTP policy on the realm and enables CONFIGURE_TOTP as a default
# required action, so users are prompted to set up an authenticator and are
# then challenged for it. Run it for the master realm too to protect the
# Keycloak admin console:  ./scripts/keycloak-mfa.sh master
#
# To *hard-require* OTP (not just prompt), also set the browser flow's OTP
# execution to REQUIRED in the admin console — see docs/MFA.md. To limit MFA to
# privileged accounts on a realm shared with public users, use a role-based
# conditional OTP flow (also in docs/MFA.md).
#
# Not runnable in the build environment — validate on your host.
# -----------------------------------------------------------------------
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$HERE"
set -a; [ -f .env ] && . ./.env; set +a

REALM="${1:-${KEYCLOAK_REALM:?set KEYCLOAK_REALM in .env or pass a realm}}"
: "${KEYCLOAK_ADMIN:?}"; : "${KEYCLOAK_ADMIN_PASSWORD:?}"
KC_URL="${KC_URL:-http://localhost:8080}"   # adjust if KC_HTTP_RELATIVE_PATH is set (e.g. .../auth)
KCADM="/opt/keycloak/bin/kcadm.sh"

kc() { docker compose exec -T keycloak "$KCADM" "$@"; }

echo "[mfa] Authenticating kcadm…"
kc config credentials --server "$KC_URL" --realm master \
  --user "$KEYCLOAK_ADMIN" --password "$KEYCLOAK_ADMIN_PASSWORD"

echo "[mfa] Setting TOTP policy on realm '$REALM'…"
kc update "realms/$REALM" \
  -s otpPolicyType=totp \
  -s otpPolicyAlgorithm=HmacSHA1 \
  -s otpPolicyDigits=6 \
  -s otpPolicyPeriod=30 \
  -s otpPolicyLookAheadWindow=1

echo "[mfa] Enabling CONFIGURE_TOTP as a default required action…"
kc update "authentication/required-actions/CONFIGURE_TOTP" -r "$REALM" \
  -s enabled=true -s defaultAction=true

echo "[mfa] Done for realm '$REALM'."
echo "      Users will be prompted to set up an authenticator at next login."
echo "      To hard-require OTP, set the browser flow's OTP execution to"
echo "      REQUIRED in the admin console (see docs/MFA.md)."
