/** @type {import('next').NextConfig} */
const createNextIntlPlugin = require("next-intl/plugin");
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  // Fonts load via <link> at runtime (browser), so skip build-time fetch/optimize.
  optimizeFonts: false,
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "cms" },
      { protocol: "http", hostname: "minio" },
      { protocol: "https", hostname: "**" },
    ],
  },
  // Allow the site to render even if the CMS is still booting.
  experimental: { missingSuspenseWithCSRBailout: false },
  // Long-cache immutable static media (served from /public/media). Content is
  // content-addressed (hashed filenames from tirdo.or.tz), so it is safe to
  // cache aggressively; HTML and API routes remain uncached.
  async headers() {
    return [
      {
        source: "/media/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};
module.exports = withNextIntl(nextConfig);
