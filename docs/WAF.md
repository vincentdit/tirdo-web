# Web Application Firewall (ModSecurity + OWASP CRS)

**Opt-in and DetectionOnly-first.** The WAF is an OWASP Core Rule Set proxy
(`owasp/modsecurity-crs`) that fronts the existing app Nginx. Enabling it does
not change the app edge config, and it starts in **DetectionOnly** mode — it
logs would-be blocks but does not block — so you can turn it on safely, watch
for false positives, tune, and only then enforce.

> This layer could not be run in the build environment. Validate it on your host
> and adjust the image tag, listen port and CRS include path to the exact
> version you pull before relying on it.

## Topology

```
Internet ──▶ tirdo-waf (ModSecurity + CRS, :80) ──▶ tirdo-nginx (app edge) ──▶ frontend / matomo
```

The app Nginx keeps all its logic (analytics proxy, rate limits, security
headers, internal :8081 reporting upstream); the WAF only adds request/response
inspection in front. Config lives in `docker-compose.waf.yml` and
`nginx/waf/modsec-exclusions.conf`.

## Enable (DetectionOnly)

```bash
docker compose -f docker-compose.yml -f docker-compose.waf.yml up -d
docker compose ps            # tirdo-waf up; tirdo-nginx no longer publishes :80
curl -I http://<host>/       # site still served, now through the WAF
```

Requires Docker Compose ≥ 2.24 (for the `!reset` that unpublishes the app
Nginx ports).

## Tune, then enforce

1. Run in DetectionOnly for a representative period. Watch the audit log:
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.waf.yml logs -f waf
   docker exec tirdo-waf tail -f /var/log/modsecurity/audit.log
   ```
2. For each **confirmed false positive** (a legitimate request the CRS would
   block — most likely the contact form `/api/contact` message body, or the
   analytics beacon `/s/e`), add a targeted exclusion in
   `nginx/waf/modsec-exclusions.conf` using the rule ID the log names. Examples
   are in that file. Prefer `ruleRemoveTargetById` (one field) over removing a
   whole rule.
3. When the log is quiet on legitimate traffic, **enforce**: set
   `MODSEC_RULE_ENGINE: On` in `docker-compose.waf.yml` and recreate:
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.waf.yml up -d waf
   ```
4. Consider raising `PARANOIA` from 1 toward 2 for stronger coverage, tuning
   exclusions again at each step.

## Disable / rollback

```bash
docker compose up -d --force-recreate nginx     # no -f override → app Nginx fronts :80 again
docker rm -f tirdo-waf 2>/dev/null || true
```

## With HTTPS

The WAF must inspect cleartext, so terminate TLS **at the WAF** when both are
used: mount the certs into the `waf` service and configure its TLS listener
(the OWASP image supports `SSL_PORT`/cert env), with the app Nginx staying on
HTTP behind it. Keep `docs/TLS.md`'s cert issuance, but point the 443 listener
at the WAF rather than the app Nginx. This is a host-specific step — plan it
with the hosting decision.

## Notes

- Pin a specific image digest in production instead of the rolling
  `4-nginx-alpine` tag.
- The WAF fronts the **public site** only. The CMS (`:1337`), Keycloak
  (`:8080`) and other admin ports are not proxied here; restrict those at the
  firewall or add separate WAF/proxy front-ends if they must be public.
