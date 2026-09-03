"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

// Loads the Matomo tracker and records a page view on every route change
// (Next.js App Router navigations don't reload the page).
//
// The tracker script and endpoint are served FIRST-PARTY through Nginx under
// bland paths (/s/js and /s/e) so ad/privacy blockers — which block the
// tell-tale "matomo.js" / "matomo.php" — don't drop them. Configured via
// NEXT_PUBLIC_MATOMO_JS_URL, NEXT_PUBLIC_MATOMO_TRACK_URL and
// NEXT_PUBLIC_MATOMO_SITE_ID (baked at build time). Set the track URL to
// "off" to disable analytics entirely.
export function MatomoAnalytics() {
  const jsUrl = process.env.NEXT_PUBLIC_MATOMO_JS_URL || "/s/js";
  const trackUrl = process.env.NEXT_PUBLIC_MATOMO_TRACK_URL || "/s/e";
  const siteId = process.env.NEXT_PUBLIC_MATOMO_SITE_ID || "1";
  const pathname = usePathname();
  const initialLoad = useRef(true);

  const enabled = trackUrl.toLowerCase() !== "off";

  useEffect(() => {
    if (!enabled) return;
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
  }, [pathname, enabled]);

  if (!enabled) return null;

  return (
    <Script id="matomo" strategy="afterInteractive">
      {`
        var _paq = window._paq = window._paq || [];
        _paq.push(['enableLinkTracking']);
        _paq.push(['trackPageView']);
        (function() {
          _paq.push(['setTrackerUrl', '${trackUrl}']);
          _paq.push(['setSiteId', '${siteId}']);
          var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
          g.async=true; g.src='${jsUrl}'; s.parentNode.insertBefore(g,s);
        })();
      `}
    </Script>
  );
}
