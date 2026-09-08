# Multi-factor authentication (MFA)

Security must-have: MFA for admin and privileged accounts. This covers each
admin surface. None of it changes the running site; apply it per console.

> Not runnable in the build environment — validate on your host.

## Keycloak (staff SSO + admin console)

Keycloak is the identity provider, so enabling TOTP here protects everyone who
signs in through it.

**Enable (scripted):**

```bash
./scripts/keycloak-mfa.sh                 # your app realm ($KEYCLOAK_REALM)
./scripts/keycloak-mfa.sh master          # the Keycloak admin console itself
```

The script sets a TOTP policy and enables `CONFIGURE_TOTP` as a default required
action, so users are prompted to set up an authenticator app (Google
Authenticator, FreeOTP, etc.) at next login and then challenged for the code.

**Hard-require OTP** (not just prompt): in the admin console →
**Authentication → Flows → Browser**, set the **OTP Form** execution to
**Required** (instead of Conditional). Now login always demands a code.

**Limit MFA to privileged accounts** (when the realm also serves public
e-services users): build a role-based conditional flow — Authentication → Flows
→ duplicate *Browser* → in the *Conditional OTP* subflow add **Condition - User
Role** = your `admin`/`staff` role, and bind the flow. Public users skip OTP;
privileged users are challenged. (This is the recommended posture for a shared
realm.)

## Strapi CMS admin panel

Strapi Community Edition has **no built-in admin 2FA** (it's an Enterprise
feature). Options, best first:

1. **Front the admin with Keycloak** — put an OAuth2 proxy (e.g. `oauth2-proxy`)
   in front of `/(admin|content-manager)` on `:1337`, authenticating against
   Keycloak. MFA is then enforced at the proxy by the Keycloak policy above, and
   the Strapi admin inherits it. Recommended.
2. **Community 2FA plugin** — a `strapi-plugin`-style TOTP add-on can be
   installed if one is maintained for Strapi 5; audit it before use.
3. **Network-restrict** `:1337` to a VPN/trusted network and enforce strong,
   rotated passwords as an interim control.

## Other admin consoles

- **MinIO console (:9101)** — supports **OIDC**; wire it to Keycloak so console
  sign-in inherits MFA. Otherwise restrict the port to a trusted network.
- **Matomo (:8095)** — has built-in **two-factor authentication**: each admin
  enables it under *Personal → Security* in Matomo settings. Require it for all
  Matomo users.
- **OpenSearch Dashboards (:5601)** — the security plugin is disabled in this
  stack (internal only). Keep it off the public internet; if it must be exposed,
  enable the security plugin with an auth backend (Keycloak/OIDC) + MFA.

## Rollout checklist

1. `./scripts/keycloak-mfa.sh` for the app realm and `master`.
2. Enforce OTP in the browser flow (or a role-conditional flow).
3. Front the Strapi admin with Keycloak (or restrict the port).
4. Enable Matomo 2FA for admins; wire MinIO console to Keycloak OIDC.
5. Confirm every privileged account has enrolled an authenticator before go-live.
