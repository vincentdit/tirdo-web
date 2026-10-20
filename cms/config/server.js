module.exports = ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  app: {
    keys: env.array("APP_KEYS"),
  },
  // Public URL of the site (admin is at /admin on that origin).
  url: env("STRAPI_PUBLIC_URL", "http://localhost"),
  proxy: env.bool("STRAPI_PROXY", true),
  webhooks: {
    populateRelations: env.bool("WEBHOOKS_POPULATE_RELATIONS", false),
  },
});
