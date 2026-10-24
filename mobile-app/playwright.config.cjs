const { defineConfig } = require("@playwright/test");
module.exports = defineConfig({
  testDir: "./tests/e2e",
  testMatch: "**/*.spec.cjs",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 120000,
  expect: { timeout: 15000 },
  outputDir: ".validation/playwright",
  reporter: [["list"], ["json", { outputFile: ".validation/playwright-results.json" }]],
  use: {
    browserName: "chromium",
    baseURL: "http://127.0.0.1:4175",
    viewport: { width: 390, height: 844 },
    reducedMotion: "no-preference",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "node scripts/serve-web-export.cjs",
    url: "http://127.0.0.1:4175",
    reuseExistingServer: false,
    timeout: 15000,
  },
});
