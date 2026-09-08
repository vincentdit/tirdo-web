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
- [MATOMO.md](MATOMO.md) — analytics install and the first-party proxy.

## Using the system

- [ADMIN-MANUAL.md](ADMIN-MANUAL.md) — CMS administrator & editor guide.
- [USER-MANUAL.md](USER-MANUAL.md) — public website user guide.
- [API.md](API.md) — application and CMS API reference.

## Engineering

- [TESTING.md](TESTING.md) — unit, e2e and accessibility tests; how to run them.
- [RTM.md](RTM.md) — requirements-traceability matrix (spec → implementation →
  test).
- [ACCESSIBILITY.md](ACCESSIBILITY.md) — WCAG 2.1 AA conformance and how to
  re-audit.
- [I18N.md](I18N.md) — bilingual EN/SW setup and the Phase II routing plan.
- [AUDIT-LOG.md](AUDIT-LOG.md) — the tamper-evident audit log.
- [adr/](adr/README.md) — architecture decision records (incl. the
  Strapi-for-Directus and deferred-NestJS variations).

## Status

The [RTM](RTM.md) tracks each requirement's status. Current gaps that need
business/infrastructure decisions rather than code: production hosting + real
TLS certificate, a WAF, admin MFA, an independent VAPT, a tested production
restore, UAT with business representatives, migrating real content, and
translating long-form page bodies.
