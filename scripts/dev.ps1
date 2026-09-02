<#
.SYNOPSIS  Everyday helper commands for the TIRDO stack.
.EXAMPLE   ./scripts/dev.ps1 up | down | restart | logs cms | ps | reindex | nuke
#>
param([Parameter(Position=0)][string]$cmd = "ps", [Parameter(Position=1)][string]$svc)
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

switch ($cmd) {
    "up"      { docker compose up -d --build }
    "down"    { docker compose down }
    "restart" { docker compose restart $svc }
    "logs"    { docker compose logs -f $svc }
    "ps"      { docker compose ps }
    "reindex" { docker compose exec cms npm run reindex }   # rebuild OpenSearch index
    "seed"    { docker compose exec cms npm run seed }       # (re)seed demo content
    "nuke"    { docker compose down -v; Write-Host "All containers + volumes removed." -ForegroundColor Yellow }
    default   { Write-Host "Usage: dev.ps1 up|down|restart <svc>|logs <svc>|ps|reindex|seed|nuke" }
}
