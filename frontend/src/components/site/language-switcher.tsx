"use client";

import { useLocale } from "next-intl";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setLocale } from "@/i18n/locale";
import { localeNames, type Locale } from "@/i18n/config";

// EN <-> SW toggle for the utility bar. Shows the OTHER language as the
// clickable label and the CURRENT locale as a small badge, matching the
// original static markup. Persists the choice via a server action, then
// refreshes so server components re-render in the new language.
export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const other: Locale = locale === "en" ? "sw" : "en";

  const switchTo = (next: Locale) => {
    if (next === locale) return;
    startTransition(async () => {
      await setLocale(next);
      router.refresh();
    });
  };

  return (
    <span className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => switchTo(other)}
        disabled={pending}
        className="hidden px-1 hover:text-brand-gold disabled:opacity-60 sm:inline"
        aria-label={`Switch language to ${localeNames[other]}`}
      >
        {localeNames[other]}
      </button>
      <span className="ml-1 rounded-sm border border-white/60 px-1 py-0.5 text-[0.7rem] uppercase">
        {locale}
      </span>
    </span>
  );
}
