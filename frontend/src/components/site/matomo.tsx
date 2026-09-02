"use client";

import Script from "next/script";

// Loads the Matomo tracker. Configured via NEXT_PUBLIC_MATOMO_URL and
// NEXT_PUBLIC_MATOMO_SITE_ID (baked at build time). No-ops if URL is unset.
export function MatomoAnalytics() {
  const url = process.env.NEXT_PUBLIC_MATOMO_URL;
  const siteId = process.env.NEXT_PUBLIC_MATOMO_SITE_ID || "1";
  if (!url) return null;

  return (
    <Script id="matomo" strategy="afterInteractive">
      {`
        var _paq = window._paq = window._paq || [];
        _paq.push(['trackPageView']);
        _paq.push(['enableLinkTracking']);
        (function() {
          var u="${url}";
          _paq.push(['setTrackerUrl', u+'matomo.php']);
          _paq.push(['setSiteId', '${siteId}']);
          var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
          g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
        })();
      `}
    </Script>
  );
}
