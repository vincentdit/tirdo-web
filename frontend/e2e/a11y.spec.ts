import { test, expect } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";

// Accessibility regression guard (WCAG 2.1 A/AA). Keeps the axe 81->0 result
// from regressing as pages change. See docs/ACCESSIBILITY.md.
const PAGES = ["/", "/about", "/departments", "/services", "/technology", "/laboratory", "/consultancy", "/training", "/publications", "/careers", "/tenders", "/contact", "/search"];

for (const path of PAGES) {
  test(`no WCAG 2.1 A/AA violations on ${path}`, async ({ page }) => {
    // Scan with reduced motion so the auto-advancing hero is static and
    // contrast readings are deterministic (the hero pauses under this).
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(path, { waitUntil: "networkidle" });
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    const summary = results.violations.map((v) => `${v.id} (${v.nodes.length})`).join(", ");
    expect(results.violations, `axe violations on ${path}: ${summary}`).toEqual([]);
  });
}
