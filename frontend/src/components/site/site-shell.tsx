"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { BrandProvider } from "@/components/site/brand-provider";
import { PageEditorBar } from "@/components/site/page-editor-bar";
import type { SiteBrand } from "@/lib/site";

export function SiteShell({ children, brand }: { children: React.ReactNode; brand?: Partial<SiteBrand> }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/portal")) {
    return <main id="main">{children}</main>;
  }
  return (
    <BrandProvider brand={brand}>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <PageEditorBar />
    </BrandProvider>
  );
}
