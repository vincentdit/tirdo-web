"use strict";

const { randomBytes } = require("crypto");

/**
 * Ensure a Keycloak staff account also exists as a Super Admin in Content Manager,
 * using the same email and password so /portal login can use Keycloak credentials.
 */
async function ensureKeycloakCmsSuperAdmin(strapi) {
  const username = String(process.env.CMS_KEYCLOAK_SUPERADMIN_USERNAME || "mabele").trim();
  const email = String(process.env.CMS_KEYCLOAK_SUPERADMIN_EMAIL || "mabele@tirdo.go.tz").trim().toLowerCase();
  const password = String(process.env.CMS_KEYCLOAK_SUPERADMIN_PASSWORD || "").trim();
  const firstname = String(process.env.CMS_KEYCLOAK_SUPERADMIN_FIRSTNAME || "Mabele").trim();
  const lastname = String(process.env.CMS_KEYCLOAK_SUPERADMIN_LASTNAME || "Admin").trim();

  const superAdmin = await strapi.service("admin::role").getSuperAdmin();
  if (!superAdmin) {
    strapi.log.warn("[cms-sso] Super Admin role is missing");
    return;
  }

  const existing =
    (await strapi.db.query("admin::user").findOne({
      where: { email },
      populate: ["roles"],
    })) ||
    (await strapi.db.query("admin::user").findOne({
      where: { username },
      populate: ["roles"],
    }));

  const roles = [superAdmin.id];
  const userService = strapi.service("admin::user");

  if (!existing) {
    if (!password) {
      strapi.log.warn("[cms-sso] CMS_KEYCLOAK_SUPERADMIN_PASSWORD is empty; skip creating " + username);
      return;
    }
    try {
      await userService.create({
        email,
        username,
        firstname,
        lastname,
        password,
        isActive: true,
        roles,
      });
    } catch {
      await userService.create({
        email,
        firstname,
        lastname,
        password,
        isActive: true,
        roles,
      });
    }
    strapi.log.info("[cms-sso] created Content Manager Super Admin for Keycloak user " + username);
    return;
  }

  const patch = {
    email,
    username,
    firstname: existing.firstname || firstname,
    lastname: existing.lastname || lastname,
    isActive: true,
    roles,
  };
  if (password) patch.password = password;
  await userService.updateById(existing.id, patch);
  strapi.log.info("[cms-sso] Content Manager Super Admin enabled for Keycloak user " + username);
}

function registerCmsOidcSessionRoute(strapi) {
  strapi.server.routes([
    {
      method: "POST",
      path: "/portal-internal/oidc-session",
      handler: async (ctx) => issueCmsSessionFromKeycloak(strapi, ctx),
      config: { auth: false },
    },
  ]);
}

async function issueCmsSessionFromKeycloak(strapi, ctx) {
  const header = String(ctx.request.header.authorization || "");
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!token) {
    ctx.status = 401;
    ctx.body = { error: "Sign in required." };
    return;
  }

  const kc = String(process.env.KEYCLOAK_INTERNAL_URL || "http://keycloak:8080/auth").replace(/\/+$/, "");
  const realm = String(process.env.KEYCLOAK_REALM || "tirdo").trim() || "tirdo";
  let info;
  try {
    const res = await fetch(`${kc}/realms/${realm}/protocol/openid-connect/userinfo`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(10000),
    });
    info = await res.json().catch(() => ({}));
    if (!res.ok) {
      ctx.status = 401;
      ctx.body = { error: "Your TIRDO session has expired. Sign in again." };
      return;
    }
  } catch (e) {
    strapi.log.warn("[cms-sso] Keycloak userinfo failed: " + e.message);
    ctx.status = 503;
    ctx.body = { error: "Sign-in is temporarily unavailable. Try again shortly." };
    return;
  }

  const claims = claimsFromAccessToken(token);
  const email = String(info.email || claims.email || "").trim().toLowerCase();
  const username = String(info.preferred_username || claims.preferred_username || "").trim();
  let user =
    (email
      ? await strapi.db.query("admin::user").findOne({ where: { email }, populate: ["roles"] })
      : null) ||
    (username
      ? await strapi.db.query("admin::user").findOne({ where: { username }, populate: ["roles"] })
      : null) ||
    (email
      ? await strapi.db.query("admin::user").findOne({ where: { username: email }, populate: ["roles"] })
      : null);

  if (!user) {
    user = await createCmsUserFromKeycloak(strapi, { ...info, email, preferred_username: username }, token);
  }

  if (!user || user.isActive === false) {
    ctx.status = 403;
    ctx.body = {
      error:
        "Your TIRDO account is signed in, but it is not enabled for Content management. Ask a Super Admin to grant access.",
    };
    return;
  }

  const tokenService = strapi.service("admin::token") || strapi.admin?.services?.token;
  const jwt = tokenService?.createJwtToken
    ? await tokenService.createJwtToken(user)
    : tokenService?.issue
      ? await tokenService.issue(user)
      : null;
  if (!jwt) {
    ctx.status = 503;
    ctx.body = { error: "Sign-in is temporarily unavailable. Try again shortly." };
    return;
  }

  ctx.body = {
    data: {
      token: jwt,
      user: {
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        isActive: user.isActive,
      },
    },
  };
}

function claimsFromAccessToken(token) {
  try {
    return JSON.parse(Buffer.from(String(token).split(".")[1], "base64url").toString("utf8"));
  } catch {
    return {};
  }
}

function rolesFromAccessToken(token) {
  const payload = claimsFromAccessToken(token);
  const realm = payload.realm_access && Array.isArray(payload.realm_access.roles) ? payload.realm_access.roles : [];
  const names = realm.map(String);
  const resource = payload.resource_access && typeof payload.resource_access === "object" ? payload.resource_access : {};
  for (const value of Object.values(resource)) {
    const roles = value && Array.isArray(value.roles) ? value.roles : [];
    names.push(...roles.map(String));
  }
  return Array.from(new Set(names.map((r) => r.trim()).filter(Boolean)));
}

function canProvisionCmsAccount(roles) {
  return roles.includes("tirdo-admin") || roles.includes("content-editor") || roles.includes("staff");
}

async function cmsRoleIdForKeycloak(strapi, roles) {
  if (roles.includes("tirdo-admin")) {
    const superAdmin = await strapi.service("admin::role").getSuperAdmin();
    return superAdmin && superAdmin.id;
  }
  const editor =
    (await strapi.db.query("admin::role").findOne({ where: { code: "strapi-editor" } })) ||
    (await strapi.db.query("admin::role").findOne({ where: { name: "Editor" } }));
  if (roles.includes("content-editor") && editor) return editor.id;
  const author =
    (await strapi.db.query("admin::role").findOne({ where: { code: "strapi-author" } })) ||
    (await strapi.db.query("admin::role").findOne({ where: { name: "Author" } }));
  if (roles.includes("staff")) return (author && author.id) || (editor && editor.id);
  return editor && editor.id;
}

async function createCmsUserFromKeycloak(strapi, info, token) {
  const roles = rolesFromAccessToken(token);
  if (!canProvisionCmsAccount(roles)) return null;
  const email = String(info.email || "").trim().toLowerCase();
  const username = String(info.preferred_username || email.split("@")[0] || "").trim();
  if (!email || !username) return null;
  const roleId = await cmsRoleIdForKeycloak(strapi, roles);
  if (!roleId) return null;
  const password = `${randomBytes(18).toString("base64url")}Aa1!`;
  const profile = {
    email,
    firstname: String(info.given_name || info.name || username).trim().slice(0, 40) || username,
    lastname: String(info.family_name || "User").trim().slice(0, 40) || "User",
    password,
    isActive: true,
    roles: [roleId],
  };
  try {
    const created = await strapi.service("admin::user").create({ ...profile, username });
    strapi.log.info("[cms-sso] created Content Manager account for " + email);
    return created;
  } catch (e) {
    try {
      const created = await strapi.service("admin::user").create({ ...profile, username: email });
      strapi.log.info("[cms-sso] created Content Manager account for " + email);
      return created;
    } catch (err) {
      strapi.log.warn("[cms-sso] could not create Content Manager account: " + (err.message || e.message));
      return null;
    }
  }
}

module.exports = { ensureKeycloakCmsSuperAdmin, registerCmsOidcSessionRoute };
