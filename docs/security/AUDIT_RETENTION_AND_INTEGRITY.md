# Retention and integrity

## Integrity controls that exist

- Append-only Strapi lifecycles (`beforeUpdate` / `beforeDelete` refuse).
- SHA-256 hash chain with stable JSON serialization.
- Versioned canonical payload so v1 historical rows still verify.
- In-process write queue (single CMS replica). Multi-replica deployments must
  funnel writes or take a PostgreSQL advisory lock (see `docs/AUDIT-LOG.md`).

A privileged database administrator can still rewrite the table and recompute
hashes. The chain makes casual or application-level tampering **detectable**,
not cryptographically impossible. Periodic `verify` from an independent
scheduler is recommended.

## Retention

Default: keep all rows in PostgreSQL. There is no automated purge (purge would
break the chain unless a signed archive is taken first).

Recommended operations:

1. Super Admin export JSON to an offline store.
2. Run `GET /api/audit-log/verify` (or Portal → Verify chain).
3. If a legal retention window requires deletion, snapshot the table, verify,
   then perform a controlled DBA archive — not an application delete.

## Failure handling

| Class | Policy |
| --- | --- |
| Content CRUD audit write fails | Log error; do not roll back the edit |
| Auth ingest fails | Log error; login still proceeds |
| Verify endpoint without token | 401 |
| Export oversized | Hard cap 1000 rows |
