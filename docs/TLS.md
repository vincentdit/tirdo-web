# HTTPS / TLS

HTTPS is **opt-in** and does not affect the running HTTP setup until you enable
it. Nothing here changes the live config on its own — the current site keeps
serving on port 80 until you run the setup script.

## How it's wired

- `nginx/tls/default.tls.conf` — the TLS-enabled edge config: `:80` serves the
  ACME challenge and redirects everything to HTTPS; `:443` serves the site with
  the same security headers and rate limits as the HTTP config (HSTS becomes
  effective here); the internal `:8081` Matomo upstream is unchanged. It is
  **not** loaded by nginx until enabled.
- `scripts/tls-setup.sh` — obtains a certificate and, only after a pre-flight
  `nginx -t` in the real image passes, swaps the TLS config in for
  `nginx/conf.d/default.conf` (backing up the HTTP one to
  `default.conf.http.bak`).
- `scripts/tls-renew.sh` — renews the Let's Encrypt cert and reloads nginx.
- `docker-compose.yml` — the nginx service now publishes `443` and mounts
  `nginx/certs` (certificates) and `nginx/acme` (challenge webroot). Both are
  empty and harmless until you enable TLS. Certificates and keys are
  git-ignored.

After pulling this change, recreate nginx once so it picks up the new port and
mounts (still HTTP-only, no behaviour change):

```
docker compose up -d --force-recreate nginx
```

## Local / testing (self-signed)

```
./scripts/tls-setup.sh local localhost
```

Then open `https://localhost` (the browser will warn about the self-signed
cert — expected). Roll back any time with the command under **Rollback**.

## Production (Let's Encrypt)

Prerequisites: DNS for your domain points at the host, ports **80 and 443** are
open, and `certbot` is installed (`apt install certbot`).

```
./scripts/tls-setup.sh letsencrypt tirdo.or.tz admin@tirdo.or.tz
```

First issuance uses certbot **standalone** and stops nginx for ~30 seconds.
When it finishes, `https://tirdo.or.tz` is live and HTTP redirects to it.

Set `PUBLIC_URL=https://tirdo.or.tz` in `.env` and rebuild the frontend so
canonical/OG/sitemap URLs use https:

```
docker compose up -d --build frontend
```

### Renewal

Let's Encrypt certs last 90 days. Renew (no downtime — webroot challenge)
twice daily via cron on the host:

```cron
# /etc/cron.d/tirdo-tls — 03:15 and 15:15
15 3,15 * * * root cd /opt/tirdo-web && ./scripts/tls-renew.sh tirdo.or.tz >> /var/log/tirdo-tls.log 2>&1
```

## Rollback

If anything looks wrong, revert to plain HTTP:

```
cp nginx/conf.d/default.conf.http.bak nginx/conf.d/default.conf
docker compose up -d --force-recreate nginx
```

## Notes

- The pre-flight test means a bad TLS config is rejected **before** nginx is
  recreated, so enabling TLS can't crash-loop the container.
- Once HTTPS is stable, consider tightening the CSP from Report-Only to
  enforced (see `docs/SECURITY.md`) and enabling secure-only cookies.
- If you terminate TLS at a load balancer instead, skip this and keep nginx on
  HTTP behind it — just make sure the LB sets `X-Forwarded-Proto: https`.
