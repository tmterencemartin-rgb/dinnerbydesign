import { expect, test } from '@playwright/test';

test.describe('guest access', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?view=home');
    await expect(page.getByRole('button', { name: 'Open search preferences' })).toBeVisible();
  });

  test('locked tabs explain that an account is required', async ({ page }) => {
    await page.getByRole('button', { name: 'Save & Schedule, sign in required' }).click();
    await expect(page.getByText('Sign in to save and schedule dinners.')).toBeVisible();

    await page.getByRole('button', { name: 'Shopping, sign in required' }).click();
    await expect(page.getByText('Sign in to create and manage your shopping list.')).toBeVisible();
  });

  test('search preferences open without consuming a free search', async ({ page }) => {
    await expect(page.getByText('Three free searches. No account required.')).toBeVisible();
    await page.getByRole('button', { name: 'Open search preferences' }).click();
    await expect(page.getByRole('heading', { name: 'Recipe preferences' })).toBeVisible();
    await expect(page.getByText('Three free searches. No account required.')).toBeVisible();
  });
});

test.describe('public guides', () => {
  test('category links align the selected category with the viewport', async ({ page }) => {
    await page.goto('/guides');
    const categoryLink = page.getByRole('link', { name: 'Compare choices and nutrition' }).first();
    await categoryLink.click();

    const target = page.getByRole('heading', { name: 'Compare choices and nutrition' });
    await expect(target).toBeVisible();
    await expect.poll(async () => Math.round((await target.boundingBox())?.y ?? 9999)).toBeLessThanOrEqual(24);
    await expect(page).toHaveURL(/#choices-and-nutrition$/);
  });

  test('guide handoff reaches account creation and the footer uses real links', async ({ page }) => {
    await page.goto('/food-costs/fresh-or-frozen');
    await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toContainText('Food cost guides');

    const contact = page.getByRole('link', { name: 'chef@dinnerbydesign.app' });
    await expect(contact).toHaveAttribute('href', 'mailto:chef@dinnerbydesign.app');
    await expect(page.getByRole('navigation', { name: 'Footer' }).getByRole('link', { name: 'Guides' })).toHaveAttribute('href', '/guides');

    await page.getByRole('button', { name: /Plan my week/ }).click();
    await expect(page).toHaveURL(/\/signin$/);
    await expect(page.getByText('Start your 7-day full-access trial.')).toBeVisible();
  });
});

test.describe('signed-in planning', () => {
  test('planner opens the shopping view', async ({ page }) => {
    test.skip(!process.env.E2E_USER_EMAIL || !process.env.E2E_USER_PASSWORD, 'Set E2E_USER_EMAIL and E2E_USER_PASSWORD to run the signed-in journey.');

    await page.goto('/signin?mode=signin');
    await page.getByLabel('Email').fill(process.env.E2E_USER_EMAIL!);
    await page.getByLabel('Password').fill(process.env.E2E_USER_PASSWORD!);
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();

    await page.getByRole('button', { name: 'Save & Schedule' }).click();
    await expect(page.getByRole('heading', { name: 'Save & Schedule' })).toBeVisible();
    await page.getByRole('button', { name: 'Shopping' }).click();
    await expect(page.getByRole('heading', { name: 'Shopping list' })).toBeVisible();
  });
});
