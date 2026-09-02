<#
.SYNOPSIS  Seed staff accounts into the running Keycloak "tirdo" realm.
.DESCRIPTION
  The realm import only runs on Keycloak's first boot, so this script creates
  the staff users in an already-running instance via the Keycloak admin CLI.
  Safe to re-run — existing users are skipped, roles/passwords are re-applied.
.EXAMPLE  ./scripts/seed-keycloak.ps1
#>
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

# --- read admin credentials from .env ---
$envMap = @{}
Get-Content ".env" | Where-Object { $_ -match "^\s*[^#].*=" } | ForEach-Object {
  $k, $v = $_ -split "=", 2
  $envMap[$k.Trim()] = $v.Trim()
}
$admin = $envMap["KEYCLOAK_ADMIN"]
$adminPw = $envMap["KEYCLOAK_ADMIN_PASSWORD"]
if (-not $admin) { throw "KEYCLOAK_ADMIN not found in .env" }

function kc { docker compose exec -T keycloak /opt/keycloak/bin/kcadm.sh @args }

Write-Host "Authenticating to Keycloak..." -ForegroundColor Cyan
kc config credentials --server http://localhost:8080/auth --realm master --user $admin --password $adminPw

$defaultPw = "Tirdo@2026"   # temporary — users must change on first login
$users = @(
  @{ u = "m.mtambo"; f = "Mkumbukwa"; l = "Mtambo"; e = "dg@tirdo.or.tz";        roles = @("tirdo-admin", "staff") },
  @{ u = "m.masoud"; f = "Masoud";    l = "Masoud"; e = "m.masoud@tirdo.or.tz";  roles = @("content-editor", "staff") },
  @{ u = "h.ndossi"; f = "Humphrey";  l = "Ndossi"; e = "h.ndossi@tirdo.or.tz";  roles = @("staff") }
)

foreach ($usr in $users) {
  Write-Host "`n-> $($usr.u)" -ForegroundColor Green
  # create (ignore 'already exists')
  try {
    kc create users -r tirdo -s "username=$($usr.u)" -s enabled=true -s emailVerified=true `
      -s "firstName=$($usr.f)" -s "lastName=$($usr.l)" -s "email=$($usr.e)" 2>$null
  } catch { Write-Host "   (user already exists)" -ForegroundColor Yellow }

  kc set-password -r tirdo --username $usr.u --new-password $defaultPw --temporary
  foreach ($role in $usr.roles) {
    kc add-roles -r tirdo --uusername $usr.u --rolename $role 2>$null
  }
  Write-Host "   roles: $($usr.roles -join ', ')  |  temp password: $defaultPw"
}

Write-Host "`nDone. Users can sign in at http://localhost and will be prompted to change the password." -ForegroundColor Cyan
