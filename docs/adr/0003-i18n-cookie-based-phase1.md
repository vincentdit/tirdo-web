# ADR 0003 — Bilingual i18n: cookie-based locale in Phase I, prefixed routes later

- **Status:** Accepted
- **Date:** 2026-09
- **Deciders:** ICT team

## Context

English/Kiswahili bilingual delivery is a Must-have. Two common approaches:
locale-prefixed URLs (`/en`, `/sw`) or a cookie-selected locale without URL
changes.

## Decision

Phase I uses **`next-intl` in cookie mode**: the locale is stored in a
`NEXT_LOCALE` cookie set by the header language switch; no URL restructuring.
The entire UI chrome (navigation, header, footer, sitemap, common labels) is
translated; long-form page bodies remain English until translated content is
authored.

Promote to **locale-prefixed routing** (`/en`, `/sw`) once translated page
content exists — better per-language SEO and shareable URLs. Because all labels
are already keyed, this is a routing change, not a re-translation (see
`docs/I18N.md`).

## Consequences

- **Positive:** low-risk, delivered the bilingual framework early (before
  large-scale authoring, as the gap analysis recommended) without moving ~30
  route folders.
- **Trade-off:** no per-language URLs yet, so translated pages aren't separately
  indexable until Phase II. Acceptable while page bodies are still English-only.
- **Action:** schedule the Phase II routing promotion alongside the page-body
  translation effort.
