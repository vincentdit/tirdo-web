import { test, expect } from "@playwright/test";

// Smoke coverage for the technology catalogue and the laboratory / consultancy
// / training sections (FR-TECH, FR-LAB, FR-CON, FR-TRN).
test.describe("new content sections", () => {
  test("technology catalogue lists technologies and filters by sector", async ({ page }) => {
    await page.goto("/technology");
    await expect(page.getByRole("heading", { name: /Technology Catalogue/i })).toBeVisible();
    await expect(page.getByText(/technolog(y|ies)/i).first()).toBeVisible();
    // A known technology from the catalogue.
    await expect(page.getByRole("link", { name: /Biomass Briquette Production/i }).first()).toBeVisible();
    // Filtering by an energy sector keeps at least one card.
    await page.getByRole("button", { name: "Energy", exact: true }).first().click();
    await expect(page.getByRole("link", { name: /Biomass Briquette Production/i }).first()).toBeVisible();
  });

  test("technology detail page renders and offers transfer CTA", async ({ page }) => {
    await page.goto("/technology/biomass-briquettes");
    await expect(page.getByRole("heading", { level: 1, name: /Biomass Briquette Production/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Request technology transfer/i })).toBeVisible();
  });

  test("laboratory section shows capabilities and the NILIMS gateway", async ({ page }) => {
    await page.goto("/laboratory");
    await expect(page.getByRole("heading", { name: /Laboratory Services/i })).toBeVisible();
    await expect(page.getByText(/What we test/i)).toBeVisible();
    await expect(page.getByText("NILIMS").first()).toBeVisible();
  });

  test("consultancy section shows service lines and the CIAP gateway", async ({ page }) => {
    await page.goto("/consultancy");
    await expect(page.getByRole("heading", { name: /Consultancy & Advisory/i })).toBeVisible();
    await expect(page.getByText("CIAP").first()).toBeVisible();
  });

  test("training section lists courses and the TeLTP gateway", async ({ page }) => {
    await page.goto("/training");
    await expect(page.getByRole("heading", { name: /Training & Skills Development/i })).toBeVisible();
    await expect(page.getByText(/Short courses/i)).toBeVisible();
    await expect(page.getByText("TeLTP").first()).toBeVisible();
  });
});
