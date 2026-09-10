import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.E2E_BASE_URL || 'http://127.0.0.1:4173';
const useLocalPreview = baseURL.startsWith('http://127.0.0.1') || baseURL.startsWith('http://localhost');

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  expect: { timeout: 8_000 },
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'desktop-chromium',
      use: { ...devices['Desktop Chrome'], channel: 'chrome', viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'phone-chromium',
      use: { ...devices['Pixel 7'], channel: 'chrome' },
    },
    {
      name: 'tablet-chromium',
      use: { ...devices['Desktop Chrome'], channel: 'chrome', viewport: { width: 1024, height: 768 }, isMobile: false },
    },
    {
      name: 'desktop-firefox',
      use: { ...devices['Desktop Firefox'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'desktop-webkit',
      use: { ...devices['Desktop Safari'], viewport: { width: 1440, height: 900 } },
    },
  ],
  webServer: useLocalPreview ? {
    command: 'npm run preview -- --host 127.0.0.1 --port 4173',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  } : undefined,
});
