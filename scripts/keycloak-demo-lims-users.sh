#!/usr/bin/env bash
# Seed Keycloak (realm tirdo) with LIMS demo usernames so TIRDO Web SSO
# can open LIMS. Password is the same as LIMS local demo login.
# MFA setup is skipped on these accounts so a demo can finish in one sign-in.
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$HERE"
set -a; [ -f .env ] && . ./.env; set +a

REALM="${KEYCLOAK_REALM:-tirdo}"
: "${KEYCLOAK_ADMIN:?}"
: "${KEYCLOAK_ADMIN_PASSWORD:?}"
KC_URL="${KC_URL:-http://127.0.0.1:8080/auth}"
KCADM="/opt/keycloak/bin/kcadm.sh"
PASS="${LIMS_DEMO_PASSWORD:-Admin@1234}"

kc() { docker compose exec -T keycloak "$KCADM" "$@"; }

kc config credentials --server "$KC_URL" --realm master \
  --user "$KEYCLOAK_ADMIN" --password "$KEYCLOAK_ADMIN_PASSWORD" >/dev/null

ensure_user() {
  local username="$1" email="$2" first="$3" last="$4"
  shift 4
  local id
  id="$(kc get users -r "$REALM" -q "username=$username" --fields id --format csv --noquotes 2>/dev/null | tail -n 1 | tr -d '\r')"
  if [ -z "$id" ] || [ "$id" = "id" ]; then
    kc create users -r "$REALM" \
      -s username="$username" \
      -s enabled=true \
      -s emailVerified=true \
      -s email="$email" \
      -s firstName="$first" \
      -s lastName="$last" \
      -s 'requiredActions=[]' >/dev/null
    id="$(kc get users -r "$REALM" -q "username=$username" --fields id --format csv --noquotes 2>/dev/null | tail -n 1 | tr -d '\r')"
  fi
  kc update "users/$id" -r "$REALM" -s enabled=true -s emailVerified=true -s 'requiredActions=[]' >/dev/null
  kc set-password -r "$REALM" --username "$username" --new-password "$PASS" >/dev/null
  local role
  for role in "$@"; do
    kc add-roles -r "$REALM" --uusername "$username" --rolename "$role" >/dev/null || true
  done
}

ensure_user admin        admin@tirdo.go.tz            System   Administrator staff lims tirdo-admin
ensure_user mabele       mabele@tirdo.go.tz           Mabele   Demo          staff lims tirdo-admin
ensure_user jmkumba      j.mkumba@tirdo.go.tz         J        Mkumba        staff lims
ensure_user amwanga      a.mwanga@tirdo.go.tz         A        Mwanga        staff lims
ensure_user rkiliza      r.kiliza@tirdo.go.tz         R        Kiliza        staff lims
ensure_user freception   reception@tirdo.go.tz        Front    Reception     staff lims
ensure_user lsupervisor  lab.supervisor@tirdo.go.tz   Grace    Mushi         staff lims
ensure_user japprover    approver@tirdo.go.tz         John     Ndege         staff lims
ensure_user taccountant  accounts@tirdo.go.tz         Tatu     Mwakyusa      staff lims
ensure_user ptech        tech@tirdo.go.tz             Peter    Lyimo         staff lims
ensure_user qmanager     quality@tirdo.go.tz          Queen    Makoye        staff lims
ensure_user mclient      client.demo@company.co.tz    Michael  Temba         public lims

echo "[demo] Keycloak users ready in realm $REALM (staff + LIMS access)."
echo "      Sign in on TIRDO Web e-Services with a LIMS demo username."
echo "      Password is the LIMS demo password from the LIMS README."
