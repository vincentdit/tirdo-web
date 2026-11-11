"use strict";

function portalPublicUrl(env = process.env) {
  const raw = String(env.PORTAL_PUBLIC_URL || env.PUBLIC_URL || "").trim();
  return raw.replace(/\/+$/, "") || "http://localhost";
}

function wantsHtml(accept) {
  const value = String(accept || "").toLowerCase();
  if (!value.includes("text/html")) return false;
  const html = value.indexOf("text/html");
  const json = value.indexOf("application/json");
  return json === -1 || html < json;
}

function isStrapiAdminUiPath(pathname) {
  const path = String(pathname || "").split("?")[0];
  return (
    path === "/admin" ||
    path === "/admin/" ||
    path.startsWith("/admin/auth") ||
    path.startsWith("/admin/plugins")
  );
}

function portalRedirectLocation(method, pathname, accept, env = process.env) {
  if (method !== "GET" && method !== "HEAD") return null;
  if (!wantsHtml(accept)) return null;
  if (!isStrapiAdminUiPath(pathname)) return null;
  return `${portalPublicUrl(env)}/portal`;
}

module.exports = {
  portalPublicUrl,
  wantsHtml,
  isStrapiAdminUiPath,
  portalRedirectLocation,
};
