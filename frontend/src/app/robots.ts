import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

// Served at /robots.txt. Allows crawling of the public site, keeps API and
// auth-only routes out of the index, and points crawlers at the sitemap.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/e-services"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
