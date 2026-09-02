import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { MatomoAnalytics } from "@/components/site/matomo";
import { AuthProvider } from "@/components/site/auth-provider";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost"),
  title: {
    default: `${site.name} — ${site.longName}`,
    template: `%s | ${site.name}`,
  },
  description:
    "TIRDO drives industrialization in Tanzania through applied research, engineering development, ICT and technology transfer.",
  icons: {
    icon: "/media/brand/logo.jpg",
    apple: "/media/brand/logo.jpg",
  },
  openGraph: {
    title: `${site.name} — ${site.longName}`,
    type: "website",
    locale: "en_TZ",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen font-sans antialiased">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground">
          Skip to content
        </a>
        <AuthProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </AuthProvider>
        <MatomoAnalytics />
      </body>
    </html>
  );
}
