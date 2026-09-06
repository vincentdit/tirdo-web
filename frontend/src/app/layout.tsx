import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import "./globals.css";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { MatomoAnalytics } from "@/components/site/matomo";
import { AuthProvider } from "@/components/site/auth-provider";
import { site } from "@/lib/site";
import { siteUrl, siteKeywords, organizationJsonLd, websiteJsonLd } from "@/lib/seo";

const description =
  "TIRDO drives industrialization in Tanzania through applied research, engineering development, ICT and technology transfer.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.name} — ${site.longName}`,
    template: `%s | ${site.name}`,
  },
  description,
  keywords: siteKeywords,
  applicationName: site.name,
  authors: [{ name: site.longName }],
  icons: {
    icon: "/media/brand/logo.jpg",
    apple: "/media/brand/logo.jpg",
  },
  openGraph: {
    title: `${site.name} — ${site.longName}`,
    description,
    type: "website",
    locale: "en_TZ",
    url: siteUrl,
    siteName: site.longName,
    images: [{ url: "/media/brand/logo.jpg", width: 512, height: 512, alt: site.longName }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.longName}`,
    description,
    images: ["/media/brand/logo.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
        />
      </head>
      <body className="min-h-screen font-sans antialiased">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground">
          Skip to content
        </a>
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <Header />
            <main id="main">{children}</main>
            <Footer />
          </AuthProvider>
        </NextIntlClientProvider>
        <MatomoAnalytics />
      </body>
    </html>
  );
}
