# Audit event catalog

Schema version `2`. Fields follow `docs/security/AUDIT_TRAIL_ARCHITECTURE.md`.
Empty fields are omitted rather than invented.

| eventType | action | source | identityProvider | typical outcome | severity |
| --- | --- | --- | --- | --- | --- |
| content | create, update, delete, publish, unpublish | cms | strapi | success | informational / medium (delete, unpublish) |
| administration | create/update/delete on `admin::user`, `admin::role`, `api::portal-grant.portal-grant` | cms | strapi | success | medium |
| administration | export | portal | strapi | success | medium |
| authentication | login | portal | strapi | success | low |
| authentication | login_failed | portal | strapi | failure | high |
| authentication | logout | portal | strapi | success | informational |
| authentication | login / login_failed / logout | frontend | keycloak | success / failure | low / high |

Keycloak rows are **application-observed** (token exchange or cookie clear).
They are not Keycloak Admin Event API records.

## Not produced

- Stripe / payment webhooks (no Stripe integration in the repo).
- Keycloak admin console changes, MFA enrollment, lockouts (requires extra
  Keycloak event listener configuration).
- OS, Docker, or Nginx access logs (use those products’ own logs).
- Raw request bodies, passwords, tokens, cookies.

## Triggers

- Strapi document service actions on `AUDITED_TYPES` in `cms/src/audit-lib.js`.
- `POST /portal-internal/audit/ingest` from the frontend server.
- Super Admin export (records an `export` event).
