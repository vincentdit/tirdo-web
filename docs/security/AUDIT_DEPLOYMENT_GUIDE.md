# Audit deployment guide

## Environment

- `AUDIT_LOG_TOKEN` — required. Used by CMS verify/ingest and the frontend
  **server** (never the browser). Set in `.env`; Compose passes it to `cms`
  and `frontend`.
- Do not put the token in query strings.

## Schema

New optional columns on `audit_logs` are added by Strapi on CMS start
(`schemaVersion`, `eventType`, `outcome`, `severity`, and related fields).
Existing rows remain valid under canonical v1.

Restart CMS after pulling this change:

```
docker compose up -d --build cms frontend nginx
```

Rollback: restore the previous CMS image. Extra columns can remain; v1
verification still uses the original hashed fields.

## Keycloak

No extra realm export is required for application-observed SSO events.
To capture Keycloak **admin** events, enable Admin Events in the realm and
add a listener that posts to `/portal-internal/audit/ingest` with
`AUDIT_LOG_TOKEN`. That listener is **not** shipped in this change.

## Nginx

`/api/portal/audit/export` uses the write rate-limit zone. Reload nginx after
compose recreate.

## Checks

1. Sign in to `/portal` as Super Admin → **Audit trail**.
2. Publish a news article; confirm a `publish` row.
3. Failed portal login; confirm `login_failed`.
4. Super Admin → Verify chain → `intact: true`.
