# ADR 0005 — Stakeholder feedback & Customer Service Charter

- **Status:** Accepted
- **Date:** 2026-10
- **Deciders:** ICT team

## Context

An internal directive asked ICT to establish a "TIRDO Stakeholders Relation
Management System" so stakeholders in the industrial sector can give feedback
on TIRDO's services, so service delivery can be measured, and to support a
Customer Service Charter.

The website already has the building blocks for this: a Strapi collection +
public-create pattern (contact-message), an email-notification lifecycle, an
append-only audit log, and a Matomo-backed Analytics page.

## Decision

Implement the website-facing parts of the system, reusing existing patterns
rather than building a separate application:

1. **Feedback capture** — a Strapi `feedback` collection (private; public
   `create` only), a `/feedback` page with a rating (1–5), feedback type
   (Compliment / Complaint / Suggestion / Enquiry), service area and message,
   an `/api/feedback` route (validation + honeypot), and a staff-email
   lifecycle. "Rate this service" CTAs appear on the service and section pages.
2. **Service measurement** — a public, aggregate-only `GET /api/feedback-summary`
   endpoint (no personal data) feeds a "Service feedback" panel on the public
   Analytics page (average rating, totals, by type). Individual feedback stays
   private to the CMS, where staff triage, respond (`response` field) and mark
   `handled`; the audit log records changes.
3. **Customer Service Charter** — a public `/service-charter` page publishing
   service standards, turnaround times, and client rights and responsibilities,
   linking to the feedback form.

## Consequences

- Delivers the directive's intent within the existing stack, with no new
  service to operate.
- Feedback privacy is preserved: only aggregates are public.
- A full stakeholder-relationship system (stakeholder database, case
  assignment, SLA tracking, follow-up workflow) remains a possible separate
  system; this website layer can feed it later.
- The charter is an editable CMS **single-type** (`service-charter`, with
  `charter.standard` / `charter.item` components, i18n-localized), read by the
  `/service-charter` page via `getServiceCharter()` with the `content.ts`
  charter as the fallback when the single-type is empty.
