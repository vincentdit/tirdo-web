import { defineConfig, devices } from "@playwright/test";

// End-to-end + accessibility tests against a production build.
// - CI: the webServer builds and starts the app, and browsers come from
//   `npx playwright install --with-deps chromium`.
// - Locally: set PW_CHROMIUM to an existing Chromium binary to skip the
//   download, and BASE_URL if the app is already running.
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const executablePath = process.env.PW_CHROMIUM || undefined;

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "line",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    launchOptions: executablePath ? { executablePath } : {},
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: "npm run start",
        url: BASE_URL,
        timeout: 120_000,
        reuseExistingServer: !process.env.CI,
      },
});
