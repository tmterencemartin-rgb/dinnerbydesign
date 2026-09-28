import { devices, expect, test } from '@playwright/test';

test.describe('mobile Google sign-in', () => {
  test('starts the redirect flow from a phone-sized browser', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'phone-chromium', 'This check requires a mobile user agent.');

    await page.goto('/signin?mode=signin');

    await page.getByRole('button', { name: 'Continue with Google' }).click();

    await expect.poll(() => page.url(), { timeout: 12_000 }).not.toContain('/signin');
  });

  test.describe('responsive viewport fallback', () => {
    test.use({
      userAgent: devices['Desktop Chrome'].userAgent,
      viewport: { width: 390, height: 844 },
      isMobile: false,
      hasTouch: false,
    });

    test('also starts the redirect flow at a mobile breakpoint', async ({ page }) => {
      await page.goto('/signin?mode=signin');

      await page.getByRole('button', { name: 'Continue with Google' }).click();

      await expect.poll(() => page.url(), { timeout: 12_000 }).not.toContain('/signin');
    });
  });
});
