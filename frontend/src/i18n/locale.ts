"use server";

import { cookies } from "next/headers";
import { defaultLocale, isLocale, type Locale } from "./config";

const ONE_YEAR = 60 * 60 * 24 * 365;

// Server action: persist the chosen locale in a cookie. The language switcher
// calls this and then refreshes the route so server components re-render with
// the new catalogue.
export async function setLocale(next: Locale) {
  const value = isLocale(next) ? next : defaultLocale;
  cookies().set("NEXT_LOCALE", value, {
    path: "/",
    maxAge: ONE_YEAR,
    sameSite: "lax",
  });
}
