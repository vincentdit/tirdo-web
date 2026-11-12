#!/bin/sh
set -eu
KCADM=/opt/keycloak/bin/kcadm.sh
REALM=tirdo
PASS=Admin@1234
ADMIN_USER="${KEYCLOAK_ADMIN:-${KC_BOOTSTRAP_ADMIN_USERNAME:-}}"
ADMIN_PASS="${KEYCLOAK_ADMIN_PASSWORD:-${KC_BOOTSTRAP_ADMIN_PASSWORD:-}}"
if [ -z "$ADMIN_USER" ] || [ -z "$ADMIN_PASS" ]; then
  echo "missing admin env"
  exit 1
fi
login_kcadm() {
  $KCADM config credentials --server http://127.0.0.1:8080/auth --realm master \
    --user "$ADMIN_USER" --password "$ADMIN_PASS" >/dev/null
}

login_kcadm

ensure_user() {
  login_kcadm
  username="$1"
  email="$2"
  first="$3"
  last="$4"
  shift 4
  id=$($KCADM get users -r "$REALM" -q "username=$username" --fields id --format csv --noquotes 2>/dev/null | tail -n 1 | tr -d '\r')
  if [ -z "$id" ] || [ "$id" = "id" ]; then
    $KCADM create users -r "$REALM" \
      -s username="$username" \
      -s enabled=true \
      -s emailVerified=true \
      -s email="$email" \
      -s firstName="$first" \
      -s lastName="$last" \
      -s 'requiredActions=[]' >/dev/null 2>/tmp/kc-create.err || true
    id=$($KCADM get users -r "$REALM" -q "username=$username" --fields id --format csv --noquotes 2>/dev/null | tail -n 1 | tr -d '\r')
    if [ -z "$id" ] || [ "$id" = "id" ]; then
      $KCADM create users -r "$REALM" \
        -s username="$username" \
        -s enabled=true \
        -s emailVerified=true \
        -s email="${username}@tirdo.go.tz" \
        -s firstName="$first" \
        -s lastName="$last" \
        -s 'requiredActions=[]' >/dev/null 2>/tmp/kc-create.err || true
      id=$($KCADM get users -r "$REALM" -q "username=$username" --fields id --format csv --noquotes 2>/dev/null | tail -n 1 | tr -d '\r')
    fi
  fi
  if [ -z "$id" ] || [ "$id" = "id" ]; then
    echo "skip $username (could not create)"
    return 0
  fi
  $KCADM update "users/$id" -r "$REALM" -s enabled=true -s emailVerified=true -s 'requiredActions=[]' >/dev/null
  $KCADM set-password -r "$REALM" --username "$username" --new-password "$PASS" >/dev/null
  for role in "$@"; do
    $KCADM add-roles -r "$REALM" --uusername "$username" --rolename "$role" >/dev/null 2>&1 || true
  done
  echo "ok $username"
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
ensure_user ptech        ptech@tirdo.go.tz            Peter    Lyimo         staff lims
ensure_user qmanager     quality@tirdo.go.tz          Queen    Makoye        staff lims
ensure_user mclient      client.demo@company.co.tz    Michael  Temba         public lims
echo done
