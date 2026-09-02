<#
.SYNOPSIS
    One-shot bootstrap for the TIRDO Web Platform on Windows + Docker Desktop.
.DESCRIPTION
    - Verifies Docker is running
    - Creates .env from .env.example (if missing) and fills in strong random secrets
    - Builds and starts the full stack
    - Prints the URLs for every service
.EXAMPLE
    ./scripts/setup.ps1
#>
[CmdletBinding()]
param(
    [switch]$Rebuild,           # force a clean rebuild of images
    [switch]$KeepSecrets        # do not regenerate secrets if .env already exists
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

function Write-Step($msg) { Write-Host "`n==> $msg" -ForegroundColor Cyan }
function New-Secret([int]$bytes = 24) {
    $buf = New-Object 'System.Byte[]' $bytes
    [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($buf)
    return [System.Convert]::ToBase64String($buf) -replace '[^A-Za-z0-9]', ''
}

Write-Step "Checking Docker..."
try { docker info *> $null } catch { throw "Docker is not running. Start Docker Desktop and retry." }
Write-Host "Docker OK" -ForegroundColor Green

Write-Step "Preparing .env..."
if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "Created .env from template" -ForegroundColor Green
    $regen = $true
} else {
    $regen = -not $KeepSecrets
    Write-Host ".env already exists" -ForegroundColor Yellow
}

if ($regen) {
    Write-Step "Generating strong secrets..."
    $env_lines = Get-Content ".env"
    $replacements = @{
        "POSTGRES_PASSWORD"        = (New-Secret)
        "STRAPI_API_TOKEN_SALT"    = (New-Secret)
        "STRAPI_ADMIN_JWT_SECRET"  = (New-Secret)
        "STRAPI_TRANSFER_TOKEN_SALT" = (New-Secret)
        "STRAPI_JWT_SECRET"        = (New-Secret)
        "STRAPI_ENCRYPTION_KEY"    = (New-Secret 16)
        "KEYCLOAK_ADMIN_PASSWORD"  = (New-Secret)
        "MINIO_ROOT_PASSWORD"      = (New-Secret)
        "MATOMO_DB_ROOT_PASSWORD"  = (New-Secret)
        "MATOMO_DB_PASSWORD"       = (New-Secret)
    }
    # APP_KEYS needs 4 comma-separated values
    $appKeys = "$(New-Secret),$(New-Secret),$(New-Secret),$(New-Secret)"
    $new = foreach ($line in $env_lines) {
        $matched = $false
        if ($line -match "^STRAPI_APP_KEYS=") { "STRAPI_APP_KEYS=$appKeys"; continue }
        foreach ($k in $replacements.Keys) {
            if ($line -match "^$k=") { "$k=$($replacements[$k])"; $matched = $true; break }
        }
        if (-not $matched) { $line }
    }
    $new | Set-Content ".env" -Encoding utf8
    Write-Host "Secrets generated and written to .env" -ForegroundColor Green
}

Write-Step "Building and starting the stack (this can take several minutes on first run)..."
if ($Rebuild) {
    docker compose build --no-cache
}
docker compose up -d --build

Write-Step "Waiting for services to become healthy..."
Start-Sleep -Seconds 10
docker compose ps

Write-Host @"

============================================================
  TIRDO Web Platform is starting up.
============================================================
  Public website .......... http://localhost
  Strapi CMS admin ........ http://localhost:1337/admin
  Keycloak admin .......... http://localhost:8080/auth
  Matomo analytics ........ http://localhost:8090
  MinIO console ........... http://localhost:9001
  OpenSearch Dashboards ... http://localhost:5601
------------------------------------------------------------
  First run notes:
  * Strapi builds its admin panel on first boot (2-4 min).
  * Create the Strapi admin user at /cms/admin on first visit.
  * Matomo runs a short DB install wizard on first visit.
  * Credentials live in your .env file.
============================================================
"@ -ForegroundColor Cyan
