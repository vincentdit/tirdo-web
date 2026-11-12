# Connecting NIIMS, LIMS, CIAP, TELT (and future systems)

Each application must use:

- The same realm: **`tirdo`**
- Its **own** client ID (never reuse `tirdo-web`)
- Authorization Code + PKCE (public) or confidential client + secret (server apps)
- Redirect URIs that are exact HTTPS URLs in production
- RP-initiated logout with `id_token_hint` and `post_logout_redirect_uri`
- Back-channel logout URL (TIRDO Web: `http://frontend:3000/api/auth/backchannel-logout`; LIMS: host `/api/auth/oidc/back-channel-logout`)

Issuer / discovery (example, replace with the live `PUBLIC_URL`):

```
{PUBLIC_URL}/auth/realms/tirdo
{PUBLIC_URL}/auth/realms/tirdo/.well-known/openid-configuration
```

## Spring Boot (confidential client)

1. Register the app in TIRDO Web → Identity & Access → Application Registration (confidential).
2. Store the **one-time client secret** in that application's secret manager, not in git.
3. Use `spring-boot-starter-oauth2-client` for login and `oauth2-resource-server` for APIs.
4. Validate issuer, audience (`azp`/`aud`), signature and expiry. Map realm roles from `realm_access.roles`.
5. Do not grant every realm user access; map only the roles that application needs.

## React (public client)

Prefer a BFF (HttpOnly cookies) as TIRDO Web does. If the app must be a public SPA, use PKCE and **never** put a client secret in JavaScript or `localStorage`.

## Logout

Sign-out from any TIRDO Keycloak app must call the realm `end_session_endpoint` with `id_token_hint`. TIRDO Web and LIMS also listen for back-channel logout so remaining browser tabs are treated as signed out.

## MFA

Once TOTP is required on the `tirdo` browser flow, every OIDC client using that flow inherits MFA. Do not implement a second OTP generator in NIIMS/LIMS/CIAP/TELT.

## Backup

See `docs/BACKUP-DR.md` for PostgreSQL (includes the Keycloak database). After restore, run `keycloak-config` / confirm `tirdo-web` redirect URIs.
