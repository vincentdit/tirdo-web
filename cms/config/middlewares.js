module.exports = ({ env }) => {
  const raw = env("STRAPI_CORS_ORIGINS", "*");
  const origin =
    raw === "*"
      ? true
      : raw.split(",").map((s) => s.trim()).filter(Boolean);

  return [
    "strapi::logger",
    "strapi::errors",
    {
      name: "strapi::security",
      config: {
        contentSecurityPolicy: {
          useDefaults: true,
          directives: {
            "connect-src": ["'self'", "https:", "http:"],
            "img-src": ["'self'", "data:", "blob:", "market-assets.strapi.io", "*"],
            "media-src": ["'self'", "data:", "blob:", "*"],
            upgradeInsecureRequests: null,
          },
        },
      },
    },
    {
      name: "strapi::cors",
      config: {
        origin,
        credentials: true,
        headers: "*",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"],
      },
    },
    "strapi::poweredBy",
    "strapi::query",
    "strapi::body",
    "strapi::session",
    "strapi::favicon",
    "strapi::public",
  ];
};
