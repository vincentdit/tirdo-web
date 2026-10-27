# Audit test report

## Automated

| Suite | Scope |
| --- | --- |
| `cms`: `node --test src/audit.test.js` | v1 hash stability, redaction, CSV injection, token compare, viewer redaction |
| `frontend`: vitest `src/lib/audit.test.ts` | role gates, CSV injection |

## Manual (this workstation)

- Architecture inspection: Strapi 5.5, Postgres, Next.js 14 portal, Keycloak
  SSO, **no Stripe**.
- Existing uncommitted e-services work was preserved.

## Residual risks / not covered

- No isolated CMS integration test against a live Postgres in CI (CMS image
  has no vitest). Chain verify is operational.
- Keycloak Admin Event API is not ingested.
- Content-audit write failure does not fail the user transaction.
- Multi-replica CMS can fork the hash chain without an advisory lock.
- Hash chain does not protect against a fully privileged DBA rewrite.

## Unresolved

Configure a scheduled `GET /api/audit-log/verify` with `x-audit-token` if
operations wants continuous integrity alerts.
