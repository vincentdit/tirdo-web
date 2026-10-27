# Audit trail architecture

TIRDO Web already had a Strapi 5 append-only, hash-chained content audit log
(`cms/src/audit.js`). This design **extends that store** rather than replacing
Strapi, Keycloak, or adding a microservice.

## Stack that actually exists

| Component | Role in audit |
| --- | --- |
| Strapi 5.5 + PostgreSQL | Canonical audit table `audit_logs` |
| Next.js portal (`/portal`) | Authorized search, detail, export, chain verify |
| Keycloak | Public SSO. Application records observed login/logout only |
| Nginx | Rate-limits `/api/portal/audit/export` |
| Stripe | **Not in this repository** — no payment events |

## Event flow

1. **Content / grants / admin users** — Strapi document middleware records
   create, update, delete, publish, unpublish **after** the operation returns.
2. **CMS portal authentication** — Next.js `/api/portal/login` and logout POST
   ingest events to CMS with `AUDIT_LOG_TOKEN`.
3. **Keycloak SSO** — Next.js `/api/auth/callback` and `/api/auth/logout`
   ingest **application-observed** outcomes. These are not Keycloak admin
   events.
4. **Readers** — Super Admin and Admin JWT via `/portal-internal/audit*`.
   The public REST API still exposes only `/api/audit-log/verify` (token header).

```
producers (CMS middleware, portal, OIDC routes)
        |  structured JSON, redacted metadata
        v
PostgreSQL audit_logs (append-only, hash chain)
        ^
        |  admin JWT / AUDIT_LOG_TOKEN
        |
portal /portal/audit  +  GET /api/audit-log/verify
```

## Trust boundaries

- Browsers never receive `AUDIT_LOG_TOKEN`.
- Ordinary CMS editors cannot update or delete rows (content-type lifecycles).
- Admin role can **view** a redacted list. Super Admin can see hashes, export,
  and verify the chain.
- Ingest without a valid token is rejected (401).

## Delivery guarantees

- Content operations **do not roll back** if audit persistence fails. The
  failure is logged (`[audit] failed to record entry`).
- Ingest for authentication returns 503 if the store is down; the sign-in
  response is still returned to the user so a CMS outage of the audit writer
  does not lock staff out. The miss is logged.

## Schema versioning

Existing rows remain **schemaVersion 1** (implicit). New rows use version `2`
and a wider canonical hash. `verifyChain` selects the canonical function from
`schemaVersion` so historical hashes stay valid.
