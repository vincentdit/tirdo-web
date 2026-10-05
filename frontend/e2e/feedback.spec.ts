import { test, expect } from "@playwright/test";

// Stakeholder feedback & Customer Service Charter (FR-FEEDBACK, FR-CHARTER).
test.describe("feedback & service charter", () => {
  test("service charter page shows standards and a feedback CTA", async ({ page }) => {
    await page.goto("/service-charter");
    await expect(page.getByRole("heading", { name: /Customer Service Charter/i })).toBeVisible();
    await expect(page.getByText(/Service standards/i)).toBeVisible();
    await expect(page.getByRole("link", { name: /Give feedback/i }).first()).toBeVisible();
  });

  test("feedback page shows the rating form", async ({ page }) => {
    await page.goto("/feedback");
    await expect(page.getByRole("heading", { name: /Give Feedback/i })).toBeVisible();
    await expect(page.getByText(/Your rating of this service/i)).toBeVisible();
    await expect(page.getByRole("radio", { name: /5 stars/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Submit feedback/i })).toBeVisible();
  });
});
