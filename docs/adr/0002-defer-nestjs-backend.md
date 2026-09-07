# ADR 0002 — Defer the separate NestJS backend; use Next.js API routes for now

- **Status:** Accepted (pending governance ratification)
- **Date:** 2026-09
- **Deciders:** ICT team
- **Relates to:** Technical Architecture Specification

## Context

The specified architecture included a dedicated **NestJS** backend-services
layer. The current implementation does not yet run a separate NestJS service;
server-side application logic is handled by **Next.js API routes** and the
Strapi CMS. This ADR records that decision and the conditions under which the
NestJS layer will be introduced.

## Decision

For Phase I, implement server-side needs with **Next.js Route Handlers**
(`/api/*`) and Strapi:

- Search (query, suggest, reindex), analytics read-through to Matomo, and the
  contact endpoint are Next.js API routes.
- Content and the tamper-evident audit log live in Strapi.

Introduce a separate **NestJS** service later, when the platform needs
capabilities that don't belong in the frontend or CMS — e.g. transactional
business logic, an API gateway/BFF in front of external systems (LIMS, HR,
Finance), scheduled jobs, or a versioned public `/api/v1` contract.

## Consequences

- **Positive:** fewer moving parts and a smaller hosting footprint for Phase I;
  faster delivery of the corporate website and CMS scope.
- **Trade-off:** application logic currently spans the frontend API routes and
  Strapi rather than a single dedicated service; acceptable at the present
  scope.
- **Migration path:** the API routes are thin and can be lifted into a NestJS
  service without changing the frontend's call sites (same paths, same
  responses). The should-have versioned public API (ADR/RTM) is the natural
  first workload for that service.
- **Action:** obtain governance approval to defer the NestJS layer, with the
  above triggers recorded as the re-evaluation criteria.
