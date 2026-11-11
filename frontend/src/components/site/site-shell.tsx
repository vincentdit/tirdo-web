"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { BrandProvider } from "@/components/site/brand-provider";
import { PageEditorBar } from "@/components/site/page-editor-bar";
import { FloatingEventPin } from "@/components/site/floating-event-pin";
import { CustomerAuthNotice } from "@/components/site/customer-auth-notice";
import type { SiteBrand } from "@/lib/site";
import type { EventItem, FloatingNotice } from "@/lib/content";

export function SiteShell({
  children,
  brand,
  pinnedEvents = [],
  notificationEvents = [],
  notices = [],
}: {
  children: React.ReactNode;
  brand?: Partial<SiteBrand>;
  pinnedEvents?: EventItem[];
  notificationEvents?: EventItem[];
  notices?: FloatingNotice[];
}) {
  const pathname = usePathname();
  if (pathname?.startsWith("/portal")) {
    return <main id="main">{children}</main>;
  }
  return (
    <BrandProvider brand={brand}>
      <Header />
      <Suspense fallback={null}>
        <CustomerAuthNotice />
      </Suspense>
      <main id="main" className="w-full">{children}</main>
      <Footer />
      <FloatingEventPin events={notificationEvents} notices={notices} />
      <PageEditorBar />
    </BrandProvider>
  );
}
