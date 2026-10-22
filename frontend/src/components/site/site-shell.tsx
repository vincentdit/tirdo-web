"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/portal")) {
    return <main id="main">{children}</main>;
  }
  return (
    <>
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
