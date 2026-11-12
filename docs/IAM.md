# Centralized Keycloak IAM (TIRDO Web)

## Technical assessment (existing system)

TIRDO Web **already runs Keycloak 26.0** (`tirdo-keycloak`) with PostgreSQL (`tirdo_keycloak`), HTTP path `/auth`, realm **`tirdo`**, imported from `keycloak/realm-export.json` (import applies on empty DB only). `keycloak-config` updates the **`tirdo-web`** public client redirect URIs from `PUBLIC_URL`.

| Surface | How users sign in today |
|---|---|
| Public website Sign in | OIDC authorization code + PKCE, BFF cookies (`tirdo_oidc_at` / `tirdo_oidc_it`), routes `/api/auth/login`, `/callback`, `/logout`, `/session` |
| CMS / Content portal | Keycloak session from e-Services (click Content management) or email/password at `/portal/login` |
| NIIMS, LIMS, CIAP, TELT | **Not in this repository.** They appear as e-service catalogue rows (`nilims`, `ciap`, `teltp`, …). Login is not implemented here. |

Existing Keycloak clients: **`tirdo-web`** (public, PKCE S256) and **`tirdo-cms`** (confidential, service account). Realm roles: `tirdo-admin`, `content-editor`, `staff`, `public`. `CONFIGURE_TOTP` is a default required action in the realm export. MFA operations also exist as `scripts/keycloak-mfa.sh` and `docs/MFA.md`.

There is **no Spring Boot / NestJS IAM service** (ADR 0002). Administration is implemented as **Next.js route handlers** that call the Keycloak Admin REST API with `KEYCLOAK_ADMIN` via `admin-cli`. The browser never talks to the Admin API.

This work **reuses** the `tirdo` realm and `tirdo-web` client. It does not create a second realm, reset passwords, or replace Keycloak. The realm allows **login with email**. New IAM users are created with **email as username**. Existing demo accounts may still have a short username (`mabele`) and can sign in with either that username or their email.

## What TIRDO Web now provides

Portal (Super Admin or Users & access administrators): **Identity & Access** → SSO dashboard, connected applications, registration wizard, users, groups, roles, session policies, sessions, IdPs, Keycloak events, MFA policy, configuration.

Keycloak remains authoritative for credentials and SSO sessions. TIRDO Web stores **no passwords and no OTP secrets**. Client secrets are returned **once** on create/rotate.

## Integration status

| Application | Keycloak client | Login tested in this repo |
|---|---|---|
| TIRDO Web | `tirdo-web` (existing) | Yes — public OIDC BFF |
| NIIMS | Register in IAM UI if missing | **No** — separate system |
| LIMS | Register in IAM UI if missing | **No** — separate system |
| CIAP | Register in IAM UI if missing | **No** — separate system |
| TELT | Register in IAM UI if missing | **No** — separate system |

Creating a client is **not** a completed integration. See `docs/IAM-INTEGRATION.md`.

After Keycloak sign-in on **e-Services**, staff see only systems their realm roles allow. Opening a tile goes through `/api/e-services/launch/{slug}` (policy check, then redirect). **Content management** uses `/api/portal/from-sso` so the same Keycloak session opens the TIRDO portal without a second password prompt. If that application uses the `tirdo` realm, Keycloak reuses the SSO session and does not ask for the password again. Set each live URL in Content management → E-service links.

**Sign out** from TIRDO Web, Content Manager, or LIMS runs Keycloak RP-initiated logout (`id_token_hint`). Keycloak then posts back-channel logout to TIRDO Web and LIMS so local sessions end together.

## MFA

Keycloak 26 native TOTP (RFC 6238) is the institutional MFA. Email OTP is **not** a Keycloak 26 built-in; do not treat it as equivalent to TOTP. WebAuthn can be enabled as a required action in the Keycloak admin console. Users enroll via login required action or the Account Console. Administrators can require enrollment, remove OTP/WebAuthn credentials (never viewing secrets), and revoke sessions.

## Rollback

Disable the IAM menu by removing `/portal/iam` access (non-admin users never see it). Keycloak itself is unchanged except for clients/users/policies edited through the console. Restore realm from backup (`docs/BACKUP-DR.md`).
