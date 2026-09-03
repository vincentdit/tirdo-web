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
| Tracker target | build arg `NEXT_PUBLIC_MATOMO_URL` | `http://localhost:8095/` |
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
