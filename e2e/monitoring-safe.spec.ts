import { expect, test } from '@playwright/test';

const productionApiBaseUrl = process.env.E2E_API_BASE_URL
  || (process.env.E2E_BASE_URL?.startsWith('https://') ? process.env.E2E_BASE_URL : '');

test.describe('monitoring-safe production checks', () => {
  test('shallow health endpoint is available', async ({ request }) => {
    test.skip(!productionApiBaseUrl, 'Production API checks run from the scheduled workflow.');
    const response = await request.get(`${productionApiBaseUrl}/api/health`);
    expect(response.status()).toBe(200);
    await expect(response).toBeOK();
    expect(response.headers()['content-type']).toMatch(/json/);
    const body = await response.json();
    expect(body).toMatchObject({ status: 'ok' });
  });

  test('protected monitoring routes do not expose readiness checks publicly', async ({ request }) => {
    test.skip(!productionApiBaseUrl, 'Production API checks run from the scheduled workflow.');
    const [deepHealth, searchCanary] = await Promise.all([
      request.get(`${productionApiBaseUrl}/api/health/deep`),
      request.get(`${productionApiBaseUrl}/api/monitor/search-canary`),
    ]);

    expect([401, 503]).toContain(deepHealth.status());
    expect([401, 503]).toContain(searchCanary.status());
  });

  test('search shell and getting-started suggestions render without using a search', async ({ page }) => {
    await page.goto('/?view=home');
    await expect(page.getByRole('textbox', { name: 'Search recipes by ingredient, dish, cuisine or chef' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Open search preferences' })).toBeVisible();
    await expect(page.getByText('Try a search')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Quick chicken dinner under 30 minutes' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Low-cost vegetarian dinner for two' })).toBeVisible();
  });
});
