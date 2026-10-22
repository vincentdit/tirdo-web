"use client";

import { createContext, useContext, type ReactNode } from "react";
import { defaultBrand, type SiteBrand } from "@/lib/site";

const BrandContext = createContext<SiteBrand>(defaultBrand);

export function BrandProvider({ brand, children }: { brand?: Partial<SiteBrand>; children: ReactNode }) {
  return <BrandContext.Provider value={{ ...defaultBrand, ...brand }}>{children}</BrandContext.Provider>;
}

export function useBrand(): SiteBrand {
  return useContext(BrandContext);
}
