# Audit access control

Uses existing Strapi admin roles. No new Keycloak roles are created.

| Capability | Super Admin | Admin / Administrator | Editor / Author / others |
| --- | --- | --- | --- |
| View list and totals | yes | yes (summary redacted) | no |
| Event hashes / full metadata | yes | no | no |
| CSV / JSON export | yes | no | no |
| Chain verify | yes | no | no |
| Modify or delete history | no | no | no |

Enforcement:

- Next.js `/api/portal/audit*` calls `loadAccess` then CMS
  `/portal-internal/audit*`, which re-checks the admin JWT.
- `GET /api/audit-log/verify` remains token-gated (`x-audit-token`).
- Ingest requires `AUDIT_LOG_TOKEN`.
- Nginx rate-limits export.

Redaction for Admin viewers: IP and user-agent become `recorded`; hashes are
omitted. Super Admin sees sanitized summaries (secrets already stripped at
write time).
