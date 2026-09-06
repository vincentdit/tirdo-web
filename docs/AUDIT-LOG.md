# Tamper-evident audit log

The CMS keeps an **append-only, hash-chained audit log** of administrative
content actions — an e-GA governance requirement.

## What is recorded

A document-service middleware (`cms/src/audit.js`, registered in
`cms/src/index.js` `register()`) records every **create, update, delete,
publish and unpublish** on the audited content types (articles, projects,
publications, services, departments, pages, vacancies, tenders). Reads are not
recorded, and the audit log never records itself.

Each entry stores: a monotonic `seq`, `occurredAt`, `action`, `contentType`,
`entityId`/`entitySlug`, the **actor** (the acting admin's email/name from the
request context, or `system` for bootstrap seeding), a `summary` (title and,
for updates, the list of changed field names — names only, not values),
`prevHash` and `hash`.

## Why it is tamper-evident

Entries form a hash chain:

```
hash = SHA256( stableStringify(entry fields) + prevHash )
```

Because each hash depends on the previous entry's hash, **altering or deleting
any past entry breaks every hash after it**. The chain is verifiable:

```
GET /api/audit-log/verify        # optionally: header x-audit-token: <AUDIT_LOG_TOKEN>
```

Returns `{ "intact": true, "count": N, "head": "<hash>" }`, or, if broken,
`{ "intact": false, "brokenAt": <seq>, "reason": "..." }` naming the first
tampered/removed/reordered entry.

Two further defences:

- The `audit-log` content type is **append-only**: its lifecycles reject any
  update or delete, including from the admin panel.
- Entries are written with the low-level query engine, so the audit middleware
  never records its own writes (no recursion) and can't be suppressed through
  the normal document API.

`stableStringify` sorts object keys before hashing, so the hash is independent
of how the database (e.g. Postgres JSONB) reorders JSON keys on read.

## Viewing

Browse entries in the Strapi admin panel under **Content Manager → Audit Log**
(read-only there; edits/deletes are refused). The log is not exposed on the
public REST API — only `/audit-log/verify` is, and that can be locked behind
`AUDIT_LOG_TOKEN`.

## Editorial workflow context

Strapi Community Edition provides **draft / publish** (enabled on all content
types) as the approval gate: authors save drafts, and a reviewer publishes.
Configure the roles under **Settings → Administration Panel → Roles** — e.g. an
*Author* role that can create and edit drafts but not publish, and an
*Editor/Approver* role that can publish. The audit log is the evidence layer
for this workflow: every publish records **who** published **what** and
**when**, immutably. (Multi-stage review-workflow automation is a Strapi
Enterprise feature; the draft/publish gate plus this audit trail covers the
Community Edition case.)

## Operational notes

- Writes are serialized in-process to prevent chain forks. For a
  multi-replica CMS deployment, funnel audit writes through a single writer or
  add a DB-level advisory lock around the read-latest/insert step.
- Set `AUDIT_LOG_TOKEN` in `.env` to require a token on the verify endpoint; a
  scheduled task can call it periodically and alert if `intact` is ever false.
