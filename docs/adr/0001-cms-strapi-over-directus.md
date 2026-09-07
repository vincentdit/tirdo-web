# ADR 0001 — CMS: Strapi 5 instead of Directus

- **Status:** Accepted (pending governance ratification)
- **Date:** 2026-09
- **Deciders:** ICT team
- **Supersedes / relates to:** Database & Content-Model Specification

## Context

The specification named **Directus** as the headless CMS. During
implementation the team selected **Strapi 5** instead. The BFRS states that the
final technology selection remains subject to architecture review, so this ADR
records the variation for governance sign-off.

## Decision

Use **Strapi 5** (Node.js/TypeScript, PostgreSQL) as the headless CMS.

Reasons:
- Same architectural role as Directus: a headless CMS exposing a REST API over
  PostgreSQL, decoupled from the Next.js frontend — the specified pattern is
  preserved.
- Node/TypeScript end-to-end with the frontend, simplifying the team's toolchain
  and hosting footprint.
- First-class draft/publish, roles & permissions, media library, and
  code-defined content types (versionable in git), which the project relies on
  for the editorial and audit requirements.
- Straightforward lifecycle hooks, used here for the OpenSearch indexing and the
  tamper-evident audit log.

## Consequences

- **Positive:** one language across the stack; content types and permissions are
  code and travel with the repo; extension points (middleware/lifecycles) met
  the search and audit needs cleanly.
- **Neutral:** REST is the integration surface (Strapi also offers GraphQL if
  needed later).
- **Trade-off:** multi-stage editorial review workflows are a Strapi *Enterprise*
  feature; the Community Edition provides draft/publish, which — combined with
  configured roles and the audit log — covers the requirement (see ADR-0002 area
  and `docs/ADMIN-MANUAL.md`).
- **Action:** obtain formal governance approval of this deviation from the
  named product.
