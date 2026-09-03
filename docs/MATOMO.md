# Matomo Analytics — Activation Guide

Matomo is the privacy-first analytics layer for the TIRDO site. Everything is
already wired; Matomo just needs a **one-time install** to create its database
tables, an admin login, and the tracked website. Because Matomo stores its state
in the `matomo_data` Docker volume, you only ever do this once — it survives
restarts and rebuilds.

## What's already wired

| Piece | Where | Value |
|-------|-------|-------|
| Matomo app | `docker-compose.yml` → `matomo` (`matomo:5-apache`) | http://localhost:8095 |
| Database | `docker-compose.yml` → `mariadb` (`mariadb:11`) | host `mariadb`, db/user from `.env` |
| Tracker snippet | `frontend/src/components/site/matomo.tsx` | injected on every page |
| Tracker script (first-party) | `NEXT_PUBLIC_MATOMO_JS_URL` → Nginx | `/s/js` |
| Tracking endpoint (first-party) | `NEXT_PUBLIC_MATOMO_TRACK_URL` → Nginx | `/s/e` |
| Tracked site ID | build arg `NEXT_PUBLIC_MATOMO_SITE_ID` | `1` |

The tracker records a page view on first load **and** on every in-app navigation.

## One-time install (about 2 minutes)

1. Make sure the stack is up and the two containers are healthy:

   ```powershell
   cd "C:\Users\USER\My Drive\tirdo-web"
   docker compose up -d mariadb matomo
   docker compose ps            # tirdo-matomo and tirdo-mariadb should be running
   ```

2. Open **http://localhost:8095** in your browser. The Matomo installer appears.

3. **Welcome** → Next. **System Check** → everything should be green → Next.

4. **Database Setup** — the fields are **already pre-filled** from your `.env`
   (`Database Server: mariadb`, `Login: matomo`, `Database Name: matomo`,
   `Adapter: MYSQL/MARIADB`). Leave the password as pre-filled and click **Next**.
   Matomo creates its tables.

5. **Super User** — create your Matomo admin login (username, password, email).
   **Write these down** — this is how you'll sign in to the dashboard.

6. **Set up a website:**
   - **Website name:** `TIRDO`
   - **Website URL:** `http://localhost`
   - **Timezone:** `Africa/Dar es Salaam`
   - **Ecommerce:** Not an ecommerce site
   
   Click Next. This is the **first** website, so Matomo gives it **Site ID `1`**,
   which is exactly what the tracker is built with — no other change needed.

7. **JavaScript Tracking Code** — you can **skip/ignore** this screen. The tracker
   is already embedded in the site by `matomo.tsx`. Click Next → **Finish**.

8. Sign in at **http://localhost:8095** with the admin from step 5.

## Verify it's tracking

1. Browse the site at **http://localhost** (open a few pages).
2. In Matomo go to **Visitors → Real-time** (or **Visits Log**). Your visit should
   appear within a few seconds.

If nothing shows up, open the site with DevTools → Network and confirm a request
to `localhost:8095/matomo.php` returns **200**. (Ad blockers and browser tracking
protection often block `matomo.js` — allow it for `localhost`.)

## Troubleshooting

- **"Matomo can't be reached" / untrusted host** — Matomo trusts the hostname you
  installed from (`localhost:8095`). If you later reach it via another hostname,
  add it under **Administration → System → General Settings → Trusted Matomo
  hostnames**, or edit `trusted_hosts[]` in
  `/var/www/html/config/config.ini.php` inside the `matomo` container.
- **Site ID mismatch** — the tracker uses site ID `1`
  (`NEXT_PUBLIC_MATOMO_SITE_ID`). If the TIRDO site ended up with a different ID,
  either delete/recreate it as the first site, or change the build arg in
  `docker-compose.yml` and rebuild the frontend:
  `docker compose up -d --build frontend`.
- **Start the install over** — remove the volume and bring Matomo back up:
  `docker compose rm -sf matomo && docker volume rm tirdo-web_matomo_data && docker compose up -d matomo`.
  (This erases all collected analytics.)

## First-party tracking (ad-blocker resistance)

Ad and privacy blockers block Matomo by the tell-tale names `matomo.js` and
`matomo.php` (you'll see `net::ERR_BLOCKED_BY_CLIENT` in the console). To avoid
losing that traffic, the tracker is served **first-party** through Nginx under
bland, same-origin paths — no separate port, no "matomo" in the URL:

| Purpose | Public path (same origin as the site) | Proxied to |
|---------|---------------------------------------|------------|
| Tracker script | `/s/js` | `matomo:80/matomo.js` |
| Tracking endpoint | `/s/e` | `matomo:80/matomo.php` |

These are defined in `nginx/conf.d/default.conf`, and the tracker
(`frontend/src/components/site/matomo.tsx`) points at them via the build args
`NEXT_PUBLIC_MATOMO_JS_URL=/s/js` and `NEXT_PUBLIC_MATOMO_TRACK_URL=/s/e`
(in `docker-compose.yml`). The Matomo **dashboard** is still at
http://localhost:8095 for admins — only the visitor-facing tracking is proxied.

**Verify:** load http://localhost, open DevTools → Network, and you should see
`s/js` and `s/e` return **200** (no `ERR_BLOCKED_BY_CLIENT`), and the visit
appears in Matomo → Visitors → Real-time. To turn analytics off entirely, set
`NEXT_PUBLIC_MATOMO_TRACK_URL: off` and rebuild the frontend.

### Real visitor IPs behind the proxy (optional)

Because hits now reach Matomo through Nginx, Matomo sees the proxy's IP unless
told to read the forwarded header. Nginx already sends `X-Forwarded-For`; tell
Matomo to trust it once (stored in the volume, so it sticks). In your PowerShell:

```powershell
docker compose exec -u www-data matomo ./console config:set 'General.proxy_client_headers=["HTTP_X_FORWARDED_FOR"]'
docker compose exec -u www-data matomo ./console config:set 'General.proxy_host_headers=["HTTP_X_FORWARDED_HOST"]'
docker compose restart matomo
```

Verify it took:

```powershell
docker compose exec -u www-data matomo ./console config:get 'General.proxy_client_headers'
```

Note: **locally** every request is loopback, so visits will still show an
internal address (127.0.0.1 / the Docker gateway) — this setting only shows its
value in production, where real external visitor IPs arrive in the header.

## Going to production

The tracker URL and site ID are baked at **build time** from
`docker-compose.yml` build args:

```yaml
NEXT_PUBLIC_MATOMO_URL: http://localhost:8095/     # → https://analytics.tirdo.or.tz/
NEXT_PUBLIC_MATOMO_SITE_ID: "1"
```

For a real deployment, point `NEXT_PUBLIC_MATOMO_URL` at the public Matomo URL
(served over HTTPS behind Nginx), keep the trailing slash, then rebuild the
frontend. Add the production domain to Matomo's trusted hostnames and to the
tracked website's URLs.
