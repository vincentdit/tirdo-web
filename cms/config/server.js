module.exports = ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  app: {
    keys: env.array("APP_KEYS"),
  },
  // Empty url = admin API calls stay on the same host:port the browser opened
  // (needed on LAN, e.g. http://172.30.30.54:3001/admin). Set STRAPI_PUBLIC_URL
  // only when you want absolute links (email, etc.).
  url: env("STRAPI_PUBLIC_URL") || undefined,
  proxy: env.bool("STRAPI_PROXY", true),
  webhooks: {
    populateRelations: env.bool("WEBHOOKS_POPULATE_RELATIONS", false),
  },
});
