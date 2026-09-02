<#
  fetch-tirdo-assets.ps1
  Downloads all TIRDO images and documents from tirdo.or.tz into
  frontend/public/media so the site serves them locally instead of hot-linking.

  Run once from the repo root in your normal PowerShell (NOT inside the Cowork
  sandbox), which can reach tirdo.or.tz:

      cd "C:\Users\USER\My Drive\tirdo-web"
      powershell -ExecutionPolicy Bypass -File .\scripts\fetch-tirdo-assets.ps1

  After it finishes, rebuild the frontend:  docker compose up -d --build frontend
#>

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"   # much faster downloads

# Resolve media root relative to this script (repo/scripts -> repo/frontend/public/media)
$root = Join-Path $PSScriptRoot "..\frontend\public\media"

$assets = @(
  # --- Brand / identity ---
  @{ Url = "https://www.tirdo.or.tz/static/asset/images/tz-emblem.png"; Path = "brand\tz-emblem.png" },
  @{ Url = "https://www.tirdo.or.tz/static/asset/images/logo.jpg";      Path = "brand\logo.jpg" },

  # --- Director / administration ---
  @{ Url = "https://www.tirdo.or.tz/uploads/administration/1.%20Prof.%20Mkumbukwa%20M.%20A.%20message.png"; Path = "administration\director.png" },

  # --- Hero / carousel ---
  @{ Url = "https://www.tirdo.or.tz/storage/carousel-items/fRbUBRaWLBHYVw8U8yG1aRENYr39KbRrvArOp5kQ.jpg"; Path = "carousel-items\fRbUBRaWLBHYVw8U8yG1aRENYr39KbRrvArOp5kQ.jpg" },
  @{ Url = "https://www.tirdo.or.tz/storage/carousel-items/uNKy6HRLTxyTlnOfqZlMhXIR8nA6SaMGCDNzTmrq.jpg"; Path = "carousel-items\uNKy6HRLTxyTlnOfqZlMhXIR8nA6SaMGCDNzTmrq.jpg" },
  @{ Url = "https://www.tirdo.or.tz/storage/carousel-items/cCiap7vvzT3PcCrqVYJe99reAp4pnPJVZ5SnDDBV.jpg"; Path = "carousel-items\cCiap7vvzT3PcCrqVYJe99reAp4pnPJVZ5SnDDBV.jpg" },
  @{ Url = "https://www.tirdo.or.tz/storage/carousel-items/llWLlNlWubobDNVa4AKmzeiScT4efKRsoeZA4xRO.jpg"; Path = "carousel-items\llWLlNlWubobDNVa4AKmzeiScT4efKRsoeZA4xRO.jpg" },
  @{ Url = "https://www.tirdo.or.tz/storage/carousel-items/laX5QEVDZMj4dCwh7uxiIy1gerC4jjQOJe3myxs9.jpg"; Path = "carousel-items\laX5QEVDZMj4dCwh7uxiIy1gerC4jjQOJe3myxs9.jpg" },

  # --- Research products / resources ---
  @{ Url = "https://www.tirdo.or.tz/storage/resources/feHRWQMR9OJXOpyL21RzVcnWNQ9xzn2ATG2RKDLj.jpg"; Path = "resources\feHRWQMR9OJXOpyL21RzVcnWNQ9xzn2ATG2RKDLj.jpg" },
  @{ Url = "https://www.tirdo.or.tz/storage/resources/H1D6ScYYF7ZdoRK9q5V8fxut6gRVKKVeSQaTWjKU.png"; Path = "resources\H1D6ScYYF7ZdoRK9q5V8fxut6gRVKKVeSQaTWjKU.png" },
  @{ Url = "https://www.tirdo.or.tz/storage/resources/rulXDuQQtR41OMCyxi0UpFChGCupyDdXYHxHEfZz.png"; Path = "resources\rulXDuQQtR41OMCyxi0UpFChGCupyDdXYHxHEfZz.png" },
  @{ Url = "https://www.tirdo.or.tz/storage/resources/oE73KEynZEZ2mPY8pm9YD39qgwsjTVgtHrC44f7q.png"; Path = "resources\oE73KEynZEZ2mPY8pm9YD39qgwsjTVgtHrC44f7q.png" },

  # --- News ---
  @{ Url = "https://www.tirdo.or.tz/storage/news/eS05a9Ewg0Zp9bxOaIbmJpkipvJVRhpzToa8Pz1u.jpg"; Path = "news\eS05a9Ewg0Zp9bxOaIbmJpkipvJVRhpzToa8Pz1u.jpg" },
  @{ Url = "https://www.tirdo.or.tz/storage/news/q2cMG2Q6dwvZqhDC5vXf8vJTzX6LT4DBgJKj1OEd.jpg"; Path = "news\q2cMG2Q6dwvZqhDC5vXf8vJTzX6LT4DBgJKj1OEd.jpg" },
  @{ Url = "https://www.tirdo.or.tz/storage/news/2KFt3PRz9DRWIww6TBbfl0IcDvKXWfxOAXYHHGah.jpg"; Path = "news\2KFt3PRz9DRWIww6TBbfl0IcDvKXWfxOAXYHHGah.jpg" },
  @{ Url = "https://www.tirdo.or.tz/storage/news/Bi9KLvoqbRxTjvSEKZnmGtp9DcH41MmFbkdOLFuV.jpg"; Path = "news\Bi9KLvoqbRxTjvSEKZnmGtp9DcH41MmFbkdOLFuV.jpg" },

  # --- Partner / T-Hub company logos ---
  @{ Url = "https://www.tirdo.or.tz/uploads/innovasie/innovasie.png";            Path = "partners\innovasie.png" },
  @{ Url = "https://www.tirdo.or.tz/uploads/icon/AMMACOM.png";                   Path = "partners\ammacom.png" },
  @{ Url = "https://www.tirdo.or.tz/uploads/innovasie/albetus.png";              Path = "partners\albetus.png" },
  @{ Url = "https://www.tirdo.or.tz/static/uploads/icon/bivatek.png";            Path = "partners\bivatek.png" },
  @{ Url = "https://www.tirdo.or.tz/static/uploads/icon/AMANI%20SOLAR%20LOGO.png"; Path = "partners\amani-solar.png" },

  # --- Publications (PDF documents) ---
  @{ Url = "https://www.tirdo.or.tz/storage/publications/eQoyhgUlJc8U0uHefva0m7HnoJNfbnGQR4Xt8Y1K.pdf"; Path = "publications\eQoyhgUlJc8U0uHefva0m7HnoJNfbnGQR4Xt8Y1K.pdf" },
  @{ Url = "https://www.tirdo.or.tz/storage/publications/kgkHrHRHmlgiGpaliNrZMxskiHS5YGw3xdfb49LE.pdf"; Path = "publications\kgkHrHRHmlgiGpaliNrZMxskiHS5YGw3xdfb49LE.pdf" },
  @{ Url = "https://www.tirdo.or.tz/storage/publications/lE59YikFaoV4aaS21uVayYUuhMfere0HrxalV3bP.pdf"; Path = "publications\lE59YikFaoV4aaS21uVayYUuhMfere0HrxalV3bP.pdf" },
  @{ Url = "https://www.tirdo.or.tz/storage/publications/pwagpql6HXK1HkwFEWp331n4DaEdBzFEd1AyKGiq.pdf"; Path = "publications\pwagpql6HXK1HkwFEWp331n4DaEdBzFEd1AyKGiq.pdf" },
  @{ Url = "https://www.tirdo.or.tz/storage/publications/Tlu2YWpLr1LWpnEUIStuV7Sq8rv2bsJHcfict0S4.pdf"; Path = "publications\Tlu2YWpLr1LWpnEUIStuV7Sq8rv2bsJHcfict0S4.pdf" },
  @{ Url = "https://www.tirdo.or.tz/storage/publications/nvZj843NupUupmJT8zklTIGLloyomwPdZx7zaQ00.pdf"; Path = "publications\nvZj843NupUupmJT8zklTIGLloyomwPdZx7zaQ00.pdf" },
  @{ Url = "https://www.tirdo.or.tz/storage/publications/GlJkkH6ITUnN4puxePVw9KkYKKFlKWcJdirJ9m08.pdf"; Path = "publications\GlJkkH6ITUnN4puxePVw9KkYKKFlKWcJdirJ9m08.pdf" },
  @{ Url = "https://www.tirdo.or.tz/storage/publications/TIWzfCpIR5FViS8j2huHhAsXcaIcfvxNAQywQ5Px.pdf"; Path = "publications\TIWzfCpIR5FViS8j2huHhAsXcaIcfvxNAQywQ5Px.pdf" },
  @{ Url = "https://www.tirdo.or.tz/storage/publications/Z00lhvaYrG94XYwS3hDUQBGdMZn6VbTPrcGIWeKr.pdf"; Path = "publications\Z00lhvaYrG94XYwS3hDUQBGdMZn6VbTPrcGIWeKr.pdf" }
)

$ok = 0; $fail = 0; $failed = @()
Write-Host "Downloading $($assets.Count) assets into $root ...`n"

foreach ($a in $assets) {
  $dest = Join-Path $root $a.Path
  $dir  = Split-Path $dest -Parent
  if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
  try {
    Invoke-WebRequest -Uri $a.Url -OutFile $dest -UseBasicParsing -TimeoutSec 60
    $size = (Get-Item $dest).Length
    if ($size -lt 100) { throw "suspiciously small ($size bytes)" }
    Write-Host ("  OK   {0,-45} {1,8:N0} bytes" -f $a.Path, $size)
    $ok++
  } catch {
    Write-Host ("  FAIL {0,-45} {1}" -f $a.Path, $_.Exception.Message) -ForegroundColor Red
    $fail++; $failed += $a.Url
  }
}

Write-Host "`nDone. $ok downloaded, $fail failed."
if ($fail -gt 0) {
  Write-Host "`nFailed URLs (download these manually into the matching media subfolder):" -ForegroundColor Yellow
  $failed | ForEach-Object { Write-Host "  $_" }
}
