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
    await expect(page.getByRole('button', { name: 'Minced beef' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Crab risotto' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Liver and bacon' })).toBeVisible();
  });

  test('search modes and their guidance switch without submitting a search', async ({ page }) => {
    await page.goto('/?view=home');

    const modes = [
      ['AI-created recipes', 'No searching. Just recipes built around your choice of ingredients and preferences.'],
      ['Published recipes', 'Recipes from named UK publishers, linking out to the original page.'],
      ['Ready-made dinners', 'Choose your favourite or closest supermarket in preferences'],
    ] as const;

    for (const [label, guidance] of modes) {
      await page.getByRole('button', { name: label, exact: true }).click();
      await expect(page.getByText(guidance, { exact: true })).toBeVisible();
    }

    await page.getByRole('button', { name: 'AI-created recipes', exact: true }).click();
    await expect(page.getByRole('button', { name: 'A fish dish by Jamie Oliver', exact: true })).toBeVisible();

    await page.getByRole('button', { name: 'Published recipes', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Minced beef', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Crab risotto', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Liver and bacon', exact: true })).toBeVisible();

    await page.getByRole('button', { name: 'Ready-made dinners', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Fancy something Oriental or Asian?', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Mac and cheese?', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Or Paella perhaps?', exact: true })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Search recipes by ingredient, dish, cuisine or chef' })).toHaveValue('');
  });

  test('contact and sign-in pages render without submitting forms', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.getByRole('heading', { name: 'Get in touch' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Name' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Email address' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Message' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Send', exact: true })).toBeEnabled();

    await page.goto('/signin?mode=signin');
    await expect(page.getByRole('heading', { name: 'Sign in to your account' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Email address' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
  });

  test('planner and shopping views open without saving or scheduling a recipe', async ({ page }) => {
    await page.goto('/?view=home');
    await page.getByRole('button', { name: 'Save & Schedule' }).click();
    await expect(page.getByRole('heading', { name: 'Save & Schedule' })).toBeVisible();

    await page.getByRole('button', { name: 'Shopping', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Shopping list', exact: true })).toBeVisible();
  });
});
