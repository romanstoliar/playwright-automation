import { defineConfig, devices } from '@playwright/test';

// Локально тести запускаються в встановленому Google Chrome (channel: 'chrome'),
// у CI (GitHub Actions) - у браузері Chromium, який встановлює Playwright.
export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    ...devices['Desktop Chrome'],
    channel: process.env.CI ? undefined : 'chrome',
    headless: !!process.env.CI,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    locale: 'uk-UA',
  },
});
