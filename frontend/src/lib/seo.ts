// -----------------------------------------------------------------------
// Central SEO helpers: canonical base URL, absolute-URL builder, shared
// keywords and the Organization / WebSite JSON-LD used site-wide.
//
// Set NEXT_PUBLIC_SITE_URL to the public origin (e.g. https://www.tirdo.or.tz)
// in production so the sitemap, robots.txt and canonical/OG URLs are absolute
// and correct. It falls back to http://localhost for local development.
// -----------------------------------------------------------------------
import { site } from "./site";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost").replace(/\/$/, "");

export function absoluteUrl(path = "/"): string {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export const siteKeywords = [
  "TIRDO",
  "Tanzania Industrial Research and Development Organization",
  "industrial research Tanzania",
  "technology transfer",
  "energy auditing",
  "laboratory analytical services",
  "feasibility studies",
  "product development",
  "COMSATS",
  "Dar es Salaam",
];

// GovernmentOrganization + WebSite structured data (schema.org) for rich
// results and the sitelinks search box.
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "GovernmentOrganization",
    name: site.longName,
    alternateName: site.name,
    url: siteUrl,
    logo: absoluteUrl("/media/brand/logo.jpg"),
    email: site.email,
    telephone: "+255 22 2666034",
    foundingDate: "1979",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Kimweri Avenue, Msasani, TIRDO Complex, P.O. Box 23235",
      addressLocality: "Dar es Salaam",
      addressCountry: "TZ",
    },
    sameAs: [
      site.social.facebook,
      site.social.twitter,
      site.social.instagram,
      site.social.linkedin,
      site.social.youtube,
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: absoluteUrl("/search?q={search_term_string}"),
      },
      "query-input": "required name=search_term_string",
    },
  };
}
