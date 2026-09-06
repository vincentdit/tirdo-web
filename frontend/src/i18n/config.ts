// Supported UI locales. English is the default; Kiswahili is the second
// official language. Locale is stored in the NEXT_LOCALE cookie (no URL
// prefix yet — see docs/I18N.md for the planned /en /sw routing upgrade).
export const locales = ["en", "sw"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  sw: "Kiswahili",
};

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}
