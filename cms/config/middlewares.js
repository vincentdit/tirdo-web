module.exports = ({ env }) => {
  // Strapi's cors middleware always does originList.split() — origin must be a
  // string ("*" or comma-separated URLs), never a boolean or array.
  const origin = env("STRAPI_CORS_ORIGINS", "*");

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
