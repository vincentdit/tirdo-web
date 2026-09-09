# Monitoring & availability (NFR-AVL)

TIRDO's stack ships with container healthchecks and application health
endpoints, plus an **opt-in** monitoring stack (uptime + status page and
container metrics). The monitoring stack does not change the running
application edge.

> The monitoring containers could not be run in the build environment.
> Validate on your host.

## Health endpoints (frontend)

| Endpoint | Purpose | Success |
|---|---|---|
| `GET /api/healthz` | Liveness — is the Next.js server up? Cheap, dependency-free. | `200` always when serving |
| `GET /api/health` | Readiness — are the CMS and OpenSearch reachable? | `200` healthy / `503` degraded |

`/api/health` returns a per-dependency breakdown, e.g.:

```json
{ "status": "healthy", "checks": [
  { "name": "cms", "ok": true, "status": 204, "ms": 12 },
  { "name": "opensearch", "ok": true, "status": 200, "ms": 8 } ] }
```

The `frontend` container has a Docker healthcheck that polls `/api/healthz`,
so `docker compose ps` shows its health. Postgres, MariaDB, CMS, MinIO and
OpenSearch already define healthchecks.

## Enable the monitoring stack

```bash
docker compose -f docker-compose.yml -f docker-compose.monitoring.yml up -d
```

This starts two extra containers, both on the `tirdo-net` network:

- **Uptime Kuma** (`:3001`) — HTTP/host uptime monitoring, a public status
  page, and notifications (email, Slack, Telegram, webhooks, …).
- **cAdvisor** (`:8092`) — per-container CPU, memory, network and disk metrics.

Both host ports are overridable via `UPTIME_KUMA_PORT` / `CADVISOR_PORT` in
`.env` if they collide with something already bound on the host.

Restrict both ports to a trusted network or put them behind authentication —
they are operator tools, not public services.

## Recommended monitors (Uptime Kuma)

After first run, open `http://<host>:3001`, create the admin account, then add
HTTP(s) monitors:

| Monitor | URL | Expect |
|---|---|---|
| Website | `https://<host>/` | 200 |
| Frontend liveness | `https://<host>/api/healthz` | 200, JSON `status:"ok"` |
| Frontend readiness | `https://<host>/api/health` | 200 (keyword `healthy`) |
| CMS | `http://<host>:1337/_health` | 204 |
| Keycloak | `http://<host>:8080/health/ready` | 200 |
| OpenSearch | `http://<host>:9200/_cluster/health` | 200 (keyword `green`/`yellow`) |
| Matomo | `http://<host>:8095/` | 200 |

Set the check interval (e.g. 60s), retries and a notification channel so the
team is alerted on downtime. Publish a status page from the monitors you want
to expose.

## Next steps

For metric dashboards and alerting rules beyond uptime, cAdvisor can be scraped
by Prometheus with a Grafana front-end and Alertmanager — added the same way,
as a further opt-in override, when the hosting decision is made.
