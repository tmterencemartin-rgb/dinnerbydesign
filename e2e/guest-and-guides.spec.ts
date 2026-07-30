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

  test('mobile search keeps the field above equally sized actions', async ({ page }) => {
    test.skip((page.viewportSize()?.width ?? 1440) >= 640, 'Mobile layout check');

    const input = page.getByRole('textbox', { name: 'Search recipes by ingredient, dish, cuisine or chef' });
    const findButton = page.getByRole('button', { name: 'Find dinner options' });
    const preferencesButton = page.getByRole('button', { name: 'Open search preferences' });

    const inputBox = await input.boundingBox();
    const findBox = await findButton.boundingBox();
    const preferencesBox = await preferencesButton.boundingBox();

    expect(inputBox).not.toBeNull();
    expect(findBox).not.toBeNull();
    expect(preferencesBox).not.toBeNull();
    expect(findBox!.y).toBeGreaterThan(inputBox!.y + 20);
    expect(Math.abs(findBox!.y - preferencesBox!.y)).toBeLessThanOrEqual(2);
    expect(Math.abs(findBox!.width - preferencesBox!.width)).toBeLessThanOrEqual(4);
    expect(inputBox!.width).toBeGreaterThan(findBox!.width * 1.5);
  });
});

test.describe('public landing page', () => {
  test('mobile demonstration shows one compact result preview', async ({ page }) => {
    test.skip((page.viewportSize()?.width ?? 1440) >= 640, 'Mobile layout check');

    await page.goto('/?view=landing');
    await expect(page.getByText('3 matches • one preview shown')).toBeVisible();
    await expect(page.locator('#interactive-sandbox h4:visible')).toHaveCount(1);
  });
});

test.describe('public guides', () => {
  test('mobile pathways swipe horizontally and the footer is grouped', async ({ page }) => {
    test.skip((page.viewportSize()?.width ?? 1440) >= 640, 'Mobile layout check');

    await page.goto('/guides');
    await expect(page.getByText('Swipe to explore all three pathways.')).toBeVisible();

    const pathwayRow = page.getByTestId('public-pathways-row');
    const pathwayMetrics = await pathwayRow.evaluate(element => ({
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
      cardCount: element.querySelectorAll('a').length,
    }));

    expect(pathwayMetrics.cardCount).toBe(3);
    expect(pathwayMetrics.scrollWidth).toBeGreaterThan(pathwayMetrics.clientWidth);

    const footer = page.getByRole('navigation', { name: 'Footer' });
    await expect(footer.getByText('Guides', { exact: true })).toBeVisible();
    await expect(footer.getByText('Information', { exact: true })).toBeVisible();
    await expect(footer.getByText('Legal', { exact: true })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'Recipes and cooking ideas' })).toHaveAttribute('href', '/recipes');
    await expect(footer.getByRole('link', { name: 'Privacy & cookies' })).toHaveAttribute('href', '/privacy');
  });

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
