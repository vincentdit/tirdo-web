module.exports = ({ env }) => {
  const origins = env(
    "STRAPI_CORS_ORIGINS",
    "http://localhost,http://localhost:3000,http://frontend:3000"
  )
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

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
        // Allow the LAN site origin (e.g. http://172.30.30.54:3001) plus listed hosts.
        origin: origins.length ? origins : true,
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
