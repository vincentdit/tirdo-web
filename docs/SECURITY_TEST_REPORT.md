# TIRDO Web — security test report

Date: 2026-10-23  
Environment: developer workstation (Windows). Live production was not tested.

## Baseline

- Git: clean `mabele-tirdo-web` at `111d12e` before this work.
- Existing unit tests were not executed before edits: `npx` / `npm` are not on the host PATH in this session (same limitation noted in prior portal work).

## Automated tests added

| Test | Expected | Result in this session |
|------|----------|------------------------|
| `secretsEqual` / fail-closed admin token | Missing env or query token denied | Code added; run with `npm test` in `frontend` when Node is available |
| Highlight sanitizer | Script tags escaped | Same |
| `isSameOriginRequest` | Foreign Origin denied | Same |
| `isSafePortalNext` | `//evil` and `..` denied | Same |

Command when Node is on PATH:

```powershell
cd frontend
npm test
```

CI already has a report-only `security` job (`npm audit` + Trivy) in `.github/workflows/ci.yml`. That job was **not** re-run here.

## Manual / dynamic tests not performed

- Authenticated portal CSRF in a browser (would need a staff session).
- Login brute-force against the LAN server (DoS/abuse; not authorized).
- Exploitation of OpenSearch, MinIO, or Keycloak admin consoles.
- Payment webhook tests (no payment integration in repo).
- TLS handshake and HSTS (site is still HTTP on the test bind).
- ModSecurity blocking mode (overlay is DetectionOnly and opt-in).
- `npm audit` / Trivy / osv-scanner on this workstation.

## Legitimate flows that must still work after deploy

1. Public pages, search, contact, feedback.
2. Portal login, users, granted content types only.
3. CMS publish → frontend revalidate **after** `SEARCH_ADMIN_TOKEN` is set on **both** `cms` and `frontend`.
4. Keycloak `/auth` SSO on `PUBLIC_URL`.
5. `/cms-media` images and PDFs.

## Failures to record

None observed in runtime because the stack was not rebuilt in this session. Residual risk: existing servers without `SEARCH_ADMIN_TOKEN` will see `401` on `/api/revalidate` until the variable is added and containers are recreated (not only `--build` of images: env comes from `.env`).
