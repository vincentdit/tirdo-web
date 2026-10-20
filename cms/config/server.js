module.exports = ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  app: {
    keys: env.array("APP_KEYS"),
  },
  // Public URL Strapi is reached at (used for absolute links / admin assets).
  // On a LAN host this is http://<server-ip>/cms — not http://localhost:1337.
  url: env("STRAPI_PUBLIC_URL", "http://localhost/cms"),
  proxy: env.bool("STRAPI_PROXY", true),
  webhooks: {
    populateRelations: env.bool("WEBHOOKS_POPULATE_RELATIONS", false),
  },
});
