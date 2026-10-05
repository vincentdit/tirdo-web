# TIRDO website — documentation

The documentation set for the TIRDO public website & digital services portal.

## Operations

- [DEPLOYMENT.md](DEPLOYMENT.md) — stand up and operate the stack (services,
  config, bring-up, updates, troubleshooting).
- [TLS.md](TLS.md) — enable HTTPS (opt-in; self-signed or Let's Encrypt).
- [BACKUP-DR.md](BACKUP-DR.md) — backups, restore, and the disaster-recovery
  runbook (RPO/RTO).
- [SECURITY.md](SECURITY.md) — edge hardening (headers, rate limits, CSP) and
  the remaining security tasks.
- [WAF.md](WAF.md) — opt-in ModSecurity + OWASP CRS web application firewall.
- [MFA.md](MFA.md) — multi-factor auth for Keycloak, CMS and other admin consoles.
- [MONITORING.md](MONITORING.md) — health endpoints and the opt-in uptime/metrics stack.
- [MATOMO.md](MATOMO.md) — analytics install and the first-party proxy.

## Go-live

- [GO-LIVE.md](GO-LIVE.md) — ordered launch runbook (provision → seed → TLS →
  security → smoke test → monitoring → restore drill → UAT → cutover).
- [UAT-CHECKLIST.md](UAT-CHECKLIST.md) — user-acceptance testing checklist and
  sign-off.
- [../cms/scripts/README.md](../cms/scripts/README.md) — seed the real content
  into the CMS (`gen-seed.mjs`).
- [translations/sw-content.md](translations/sw-content.md) — draft Kiswahili
  content for review.

## Using the system

- [ADMIN-MANUAL.md](ADMIN-MANUAL.md) — CMS administrator & editor guide.
- [USER-MANUAL.md](USER-MANUAL.md) — public website user guide.
- [API.md](API.md) — application and CMS API reference.

## Engineering

- [TESTING.md](TESTING.md) — unit, e2e and accessibility tests; how to run them.
- [PERFORMANCE.md](PERFORMANCE.md) — performance measures and the Lighthouse CI harness.
- [RTM.md](RTM.md) — requirements-traceability matrix (spec → implementation →
  test).
- [ACCESSIBILITY.md](ACCESSIBILITY.md) — WCAG 2.1 AA conformance and how to
  re-audit.
- [I18N.md](I18N.md) — bilingual EN/SW setup and the Phase II routing plan.
- [AUDIT-LOG.md](AUDIT-LOG.md) — the tamper-evident audit log.
- [adr/](adr/README.md) — architecture decision records (incl. the
  Strapi-for-Directus and deferred-NestJS variations).

## Status

The [RTM](RTM.md) tracks each requirement's status. All spec features are
built; the WAF, admin MFA and monitoring are scaffolded and opt-in, a content
seed and draft Kiswahili translations are ready. What remains needs
infrastructure or business action rather than feature code: production hosting +
a real TLS certificate, an independent VAPT, a tested production restore, UAT
sign-off, and loading the real content/translations into the CMS. Follow
[GO-LIVE.md](GO-LIVE.md).
