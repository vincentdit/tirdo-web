"use client";

import { createContext, useContext, type ReactNode } from "react";
import { defaultBrand, type SiteBrand } from "@/lib/site";

const BrandContext = createContext<SiteBrand>(defaultBrand);

export function BrandProvider({ brand, children }: { brand?: Partial<SiteBrand>; children: ReactNode }) {
  const value: SiteBrand = {
    ...defaultBrand,
    ...brand,
    heroImage: brand?.hideHeroImage ? "" : brand?.heroImage || defaultBrand.heroImage,
    showHero: brand?.showHero !== false,
    hideHeroImage: Boolean(brand?.hideHeroImage),
  };
  return <BrandContext.Provider value={value}>{children}</BrandContext.Provider>;
}

export function useBrand(): SiteBrand {
  return useContext(BrandContext);
}
