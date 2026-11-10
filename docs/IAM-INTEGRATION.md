# Connecting NIIMS, LIMS, CIAP, TELT (and future systems)

Each application must use:

- The same realm: **`tirdo`**
- Its **own** client ID (never reuse `tirdo-web`)
- Authorization Code + PKCE (public) or confidential client + secret (server apps)
- Redirect URIs that are exact HTTPS URLs in production
- RP-initiated logout with `id_token_hint` and `post_logout_redirect_uri`
- Optional back-channel logout URL (TIRDO Web listens at `/api/auth/backchannel-logout` for its own cookies; other apps must invalidate **their** local sessions)

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

Keycloak SSO logout does **not** automatically clear another application's local session unless that application implements RP-initiated logout and/or back-channel logout.

## MFA

Once TOTP is required on the `tirdo` browser flow, every OIDC client using that flow inherits MFA. Do not implement a second OTP generator in NIIMS/LIMS/CIAP/TELT.

## Backup

See `docs/BACKUP-DR.md` for PostgreSQL (includes the Keycloak database). After restore, run `keycloak-config` / confirm `tirdo-web` redirect URIs.
