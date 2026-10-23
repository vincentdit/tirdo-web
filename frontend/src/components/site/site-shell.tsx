"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { BrandProvider } from "@/components/site/brand-provider";
import { PageEditorBar } from "@/components/site/page-editor-bar";
import { FloatingEventPin } from "@/components/site/floating-event-pin";
import type { SiteBrand } from "@/lib/site";
import type { EventItem } from "@/lib/content";

export function SiteShell({
  children,
  brand,
  pinnedEvents = [],
  notificationEvents = [],
}: {
  children: React.ReactNode;
  brand?: Partial<SiteBrand>;
  pinnedEvents?: EventItem[];
  notificationEvents?: EventItem[];
}) {
  const pathname = usePathname();
  if (pathname?.startsWith("/portal")) {
    return <main id="main">{children}</main>;
  }
  return (
    <BrandProvider brand={brand}>
      <Header />
      <main id="main" className="w-full">{children}</main>
      <Footer />
      <FloatingEventPin events={notificationEvents} />
      <PageEditorBar />
    </BrandProvider>
  );
}
