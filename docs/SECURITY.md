# Security hardening

This documents the hardening applied at the edge (Nginx) and the remaining
production security tasks from the gap analysis.

## Applied at the Nginx edge (`nginx/conf.d/default.conf`)

- **Version hidden** — `server_tokens off`.
- **Security response headers** (sent on all responses, including errors):
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: SAMEORIGIN`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=()`
  - `Strict-Transport-Security` (effective once served over HTTPS)
  - `Content-Security-Policy-Report-Only` (see below)
- **Rate limiting** — `/api/` (10 r/s, burst 20), the contact form
  `/api/contact` (1 r/s, burst 3, anti-spam), and the analytics beacon `/s/e`
  (10 r/s, burst 30); plus a 50-connection-per-IP cap.
- **gzip** for text/JSON/CSS/JS/SVG.
- Hidden dotfiles (`.git`, `.env`, …) are denied.

### Tightening the CSP

The Content-Security-Policy ships as **Report-Only** so it cannot break auth or
analytics on day one. To enforce it:

1. Browse the site (log in, submit the contact form, view analytics) with the
   dev console open and note any `Content-Security-Policy` violation reports.
2. Add the missing sources — most likely your **Keycloak origin** under
   `connect-src` (the JS adapter calls the token endpoint), and any external
   image/CDN hosts under `img-src`.
3. Rename the header from `Content-Security-Policy-Report-Only` to
   `Content-Security-Policy`.

The current policy already allows Google Fonts (`style-src`/`font-src`),
`data:`/`https:` images, and inline styles/scripts (needed by Next.js).

## Still to do (needs infrastructure decisions)

- **TLS / HTTPS** — terminate TLS at this Nginx (add a `listen 443 ssl` server
  with a real certificate, e.g. Let's Encrypt via certbot, and redirect 80→443)
  or at a load balancer in front. Once HTTPS is live, the HSTS header takes
  effect and you can enforce secure cookies.
- **WAF** — put a Web Application Firewall in front (ModSecurity + OWASP CRS on
  this Nginx, or a cloud/edge WAF). The rate limits here are a floor, not a WAF.
- **Admin MFA** — enable multi-factor auth for Keycloak admin and privileged
  accounts, and for the Strapi admin panel.
- **Secrets management** — move `.env` secrets to a managed secret store; rotate
  the Strapi keys, DB passwords and Matomo token that exist in `.env`.
- **Upload scanning** — scan CMS uploads for malware before they are served.
- **VAPT** — commission an independent vulnerability assessment and penetration
  test before go-live, and remediate findings.

## CI security scanning

`.github/workflows/ci.yml` runs a `security` job on every push/PR: `npm audit`
(frontend + CMS) and a **Trivy** filesystem scan for vulnerabilities, secrets
and misconfigurations. It is report-only today — set the Trivy `exit-code` to
`1` to fail the build on HIGH/CRITICAL findings once the backlog is clear.
