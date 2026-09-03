"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

// Loads the Matomo tracker and records a page view on every route change
// (Next.js App Router navigations don't reload the page). Configured via
// NEXT_PUBLIC_MATOMO_URL and NEXT_PUBLIC_MATOMO_SITE_ID (baked at build time).
// No-ops if the URL is unset.
export function MatomoAnalytics() {
  const url = process.env.NEXT_PUBLIC_MATOMO_URL;
  const siteId = process.env.NEXT_PUBLIC_MATOMO_SITE_ID || "1";
  const pathname = usePathname();
  const initialLoad = useRef(true);

  useEffect(() => {
    if (!url) return;
    // The inline script below already tracks the first page view on load.
    if (initialLoad.current) {
      initialLoad.current = false;
      return;
    }
    const w = window as unknown as { _paq?: unknown[][] };
    if (!w._paq) return;
    w._paq.push(["setCustomUrl", window.location.href]);
    w._paq.push(["setDocumentTitle", document.title]);
    w._paq.push(["trackPageView"]);
  }, [pathname, url]);

  if (!url) return null;

  return (
    <Script id="matomo" strategy="afterInteractive">
      {`
        var _paq = window._paq = window._paq || [];
        _paq.push(['enableLinkTracking']);
        _paq.push(['trackPageView']);
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
