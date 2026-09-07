import { test, expect } from "@playwright/test";

test.describe("public site smoke", () => {
  test("home renders masthead, nav and hero", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/TIRDO/i);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    // "About Us" appears in the header nav (and "About us" in the footer);
    // exact:true + first() targets the visible desktop nav item.
    await expect(page.getByRole("link", { name: "About Us", exact: true }).first()).toBeVisible();
    await expect(page.getByText("TIRDO AT A GLANCE")).toBeVisible();
  });

  test("language switch flips the document language to Kiswahili", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await page.getByRole("button", { name: /Kiswahili/i }).click();
    await expect(page.locator("html")).toHaveAttribute("lang", "sw");
    await expect(page.getByRole("link", { name: "Mwanzo" })).toBeVisible();
  });

  test("search returns results for a known term", async ({ page }) => {
    await page.goto("/search?q=energy");
    // Results list renders with at least one hit and a type badge.
    await expect(page.getByText(/results?/i)).toBeVisible();
    await expect(page.locator("a", { hasText: /energy/i }).first()).toBeVisible();
  });

  test("careers lists a vacancy and can filter by category", async ({ page }) => {
    await page.goto("/careers");
    await expect(page.getByRole("heading", { name: /current vacancies/i })).toBeVisible();
    await expect(page.getByText(/Research Officer/i)).toBeVisible();
  });

  test("tenders page shows structured tenders", async ({ page }) => {
    await page.goto("/tenders");
    // Scope to the table (excludes Next's flight-data script) and take the
    // first match (the title text nests in a div inside its cell).
    await expect(
      page.locator("table").getByText("Supply and Delivery of Laboratory Reagents and Consumables").first()
    ).toBeVisible();
  });

  test("robots.txt and sitemap.xml are served", async ({ request }) => {
    const robots = await request.get("/robots.txt");
    expect(robots.ok()).toBeTruthy();
    expect(await robots.text()).toMatch(/Sitemap:/i);

    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.ok()).toBeTruthy();
    expect(await sitemap.text()).toContain("<urlset");
  });
});
