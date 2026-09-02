/** @type {import('next').NextConfig} */
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
};
module.exports = nextConfig;
