import { describe, it, expect, vi } from "vitest";

// strapi.ts imports next/headers (server-only). Stub it so the pure
// mergeLocale logic can be unit-tested in Node.
vi.mock("next/headers", () => ({ cookies: () => ({ get: () => undefined }) }));

import { mergeLocale } from "@/lib/strapi";

const base = {
  slug: "solar",
  year: 2025,
  title: "Solar Project",
  summary: "An English summary.",
  body: "English body.",
  localizations: [
    { locale: "sw", title: "Mradi wa Nishati ya Jua", summary: "Muhtasari kwa Kiswahili." },
  ],
};

describe("mergeLocale (EN base + SW overlay with per-field fallback)", () => {
  it("returns the base unchanged for the default locale", () => {
    expect(mergeLocale(base, "en")).toEqual(base);
  });

  it("overlays translated text fields for the active locale", () => {
    const sw = mergeLocale(base, "sw");
    expect(sw.title).toBe("Mradi wa Nishati ya Jua");
    expect(sw.summary).toBe("Muhtasari kwa Kiswahili.");
  });

  it("keeps English for fields not translated (per-field fallback)", () => {
    const sw = mergeLocale(base, "sw");
    expect(sw.body).toBe("English body."); // no SW body provided
  });

  it("preserves shared/non-text fields from the base", () => {
    const sw = mergeLocale(base, "sw");
    expect(sw.slug).toBe("solar");
    expect(sw.year).toBe(2025);
  });

  it("falls back to English when no matching localization exists", () => {
    const entry = { ...base, localizations: [{ locale: "fr", title: "Projet" }] };
    expect(mergeLocale(entry, "sw").title).toBe("Solar Project");
  });

  it("ignores empty-string translations (treated as untranslated)", () => {
    const entry = { ...base, localizations: [{ locale: "sw", title: "" }] };
    expect(mergeLocale(entry, "sw").title).toBe("Solar Project");
  });
});
