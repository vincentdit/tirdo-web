"use strict";

const { test } = require("node:test");
const assert = require("node:assert/strict");
const { portalRedirectLocation } = require("./tirdo-portal-redirect");

test("browser visits to Strapi admin go to the TIRDO portal", () => {
  const html = "text/html,application/xhtml+xml";
  assert.equal(portalRedirectLocation("GET", "/admin", html, { PUBLIC_URL: "http://localhost" }), "http://localhost/portal");
  assert.equal(portalRedirectLocation("GET", "/admin/auth/login", html, { PORTAL_PUBLIC_URL: "http://localhost" }), "http://localhost/portal");
});

test("portal JSON admin APIs are not redirected", () => {
  assert.equal(portalRedirectLocation("POST", "/admin/login", "application/json"), null);
  assert.equal(portalRedirectLocation("GET", "/admin/users/me", "application/json"), null);
  assert.equal(portalRedirectLocation("GET", "/admin", "application/json"), null);
});
