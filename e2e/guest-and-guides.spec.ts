import { expect, test, type Page } from '@playwright/test';

const hasUserCredentials = Boolean(process.env.E2E_USER_EMAIL && process.env.E2E_USER_PASSWORD);
const hasAdminCredentials = Boolean(process.env.E2E_ADMIN_EMAIL && process.env.E2E_ADMIN_PASSWORD);

const signInWithCredentials = async (page: Page, email: string, password: string) => {
  await page.goto('/signin?mode=signin');
  await page.getByRole('textbox', { name: 'Email address' }).fill(email);
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Open search preferences' })).toBeVisible();
};

test.describe('guest access', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?view=home');
    await expect(page.getByRole('button', { name: 'Open search preferences' })).toBeVisible();
  });

  test('guests can open the planning and shopping views', async ({ page }) => {
    await page.getByRole('button', { name: 'Save & Schedule' }).click();
    await expect(page.getByRole('heading', { name: 'Save & Schedule' })).toBeVisible();

    await page.getByRole('button', { name: 'Shopping', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Shopping list', exact: true })).toBeVisible();
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
  test('mobile demonstration shows the compact result preview', async ({ page }) => {
    test.skip((page.viewportSize()?.width ?? 1440) >= 640, 'Mobile layout check');

    await page.goto('/?view=landing');
    await expect(page.getByText('3 matches')).toBeVisible();
    await expect(page.locator('#interactive-sandbox h4:visible')).toHaveCount(3);
  });
});

test.describe('public guides', () => {
  test('mobile pathways stack clearly and the footer is grouped', async ({ page }) => {
    test.skip((page.viewportSize()?.width ?? 1440) >= 640, 'Mobile layout check');

    await page.goto('/guides');
    await expect(page.getByRole('heading', { name: 'Choose where to start' })).toBeVisible();

    const pathwayRow = page.getByTestId('public-pathways-row');
    const pathwayMetrics = await pathwayRow.evaluate(element => ({
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
      cardCount: element.querySelectorAll('a').length,
    }));

    expect(pathwayMetrics.cardCount).toBe(3);
    expect(pathwayMetrics.scrollWidth).toBeLessThanOrEqual(pathwayMetrics.clientWidth + 4);

    const footer = page.getByRole('navigation', { name: 'Footer' });
    await expect(footer.getByText('Guides', { exact: true })).toBeVisible();
    await expect(footer.getByText('Information', { exact: true })).toBeVisible();
    await expect(footer.getByText('Legal', { exact: true })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'Recipes and cooking ideas' })).toHaveAttribute('href', '/recipes');
    await expect(footer.getByRole('link', { name: 'Privacy & cookies' })).toHaveAttribute('href', '/privacy');
  });

  test('pathway cards open their public collections', async ({ page }) => {
    await page.goto('/guides');
    const pathwayLink = page
      .getByTestId('public-pathways-row')
      .getByRole('link', { name: /Food-cost and waste guidance/ });
    await pathwayLink.click();

    await expect(page).toHaveURL(/\/food-costs$/);
    await expect(page.getByRole('heading', { name: 'Food-cost and waste guidance' })).toBeVisible();
  });

  test('guide handoff reaches account creation and the footer uses real links', async ({ page }) => {
    await page.goto('/food-costs/fresh-or-frozen');
    await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toContainText('Food-cost and waste guidance');

    await expect(page.locator('a[href="mailto:terence@dinnerbydesign.app"]')).toHaveCount(1);
    await expect(page.getByRole('navigation', { name: 'Footer' }).getByRole('link', { name: 'Recipes and cooking ideas' })).toHaveAttribute('href', '/recipes');

    await page.getByRole('button', { name: /Plan my week/ }).click();
    await expect(page).toHaveURL(/\/signin$/);
    await expect(page.getByText('Start your free 7-day trial.')).toBeVisible();
  });
});

test.describe('signed-in planning', () => {
  test('planner opens the shopping view', async ({ page }) => {
    test.skip(!hasUserCredentials, 'Set E2E_USER_EMAIL and E2E_USER_PASSWORD to run the signed-in journey.');

    await signInWithCredentials(page, process.env.E2E_USER_EMAIL!, process.env.E2E_USER_PASSWORD!);

    await page.getByRole('button', { name: 'Save & Schedule' }).click();
    await expect(page.getByRole('heading', { name: 'Save & Schedule' })).toBeVisible();
    await page.getByRole('button', { name: 'Shopping' }).click();
    await expect(page.getByRole('heading', { name: 'Shopping list' })).toBeVisible();
  });

  test('signed-in direct routes open planner and shopping', async ({ page }) => {
    test.skip(!hasUserCredentials, 'Set E2E_USER_EMAIL and E2E_USER_PASSWORD to run signed-in direct-route checks.');

    await signInWithCredentials(page, process.env.E2E_USER_EMAIL!, process.env.E2E_USER_PASSWORD!);

    await page.goto('/planner');
    await expect(page.getByRole('heading', { name: 'Save & Schedule' })).toBeVisible();
    await expect(page).toHaveURL(/\/planner$/);

    await page.goto('/shopping');
    await expect(page.getByRole('heading', { name: 'Shopping list', exact: true })).toBeVisible();
    await expect(page).toHaveURL(/\/shopping$/);
  });

  test('admin direct route opens for an administrator', async ({ page }) => {
    test.skip(!hasAdminCredentials, 'Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD to run the admin direct-route check.');

    await signInWithCredentials(page, process.env.E2E_ADMIN_EMAIL!, process.env.E2E_ADMIN_PASSWORD!);

    await page.goto('/admin');
    await expect(page.getByRole('heading', { name: 'Admin dashboard' })).toBeVisible();
    await expect(page).toHaveURL(/\/admin$/);
  });

  test('search, save, schedule and shopping list journey', async ({ page }) => {
    test.skip(
      !hasUserCredentials ||
      process.env.E2E_RUN_LIVE_JOURNEY !== 'true',
      'Set dedicated credentials and E2E_RUN_LIVE_JOURNEY=true to run the data-writing journey.'
    );
    test.setTimeout(90_000);

    let savedTitle = '';

    try {
      await signInWithCredentials(page, process.env.E2E_USER_EMAIL!, process.env.E2E_USER_PASSWORD!);

      const searchInput = page.getByRole('textbox', { name: 'Search recipes by ingredient, dish, cuisine or chef' });
      await expect(searchInput).toBeVisible();
      await searchInput.fill('tomato pasta');
      await page.getByRole('button', { name: 'Find dinner options' }).click();

      const viewButtons = page.getByRole('button', { name: 'View', exact: true });
      await expect(viewButtons.first()).toBeVisible({ timeout: 60_000 });
      await viewButtons.first().click();

      const detail = page.getByTestId('recipe-detail');
      const detailHeading = detail.getByRole('heading', { level: 3 }).first();
      savedTitle = (await detailHeading.innerText()).trim();
      expect(savedTitle).not.toBe('');

      await detail.getByRole('button', { name: 'Save', exact: true }).click();
      await expect(page.getByRole('heading', { name: 'Save & Schedule' })).toBeVisible();
      await expect(page.getByRole('heading', { name: savedTitle, exact: true })).toBeVisible();

      const savedRecipe = page.getByTestId('saved-recipe-item').filter({ hasText: savedTitle });
      await savedRecipe.getByRole('button', { name: 'Schedule', exact: true }).click();

      const availableDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      let scheduledDay = '';
      for (const day of availableDays) {
        const unbookedDay = page.getByRole('button', { name: day, exact: true });
        if (await unbookedDay.count() === 1) {
          scheduledDay = day;
          await unbookedDay.click();
          break;
        }
      }
      expect(scheduledDay).not.toBe('');
      await expect(savedRecipe.getByRole('button', { name: 'Scheduled', exact: true })).toBeVisible();

      await page.getByRole('button', { name: 'Shopping' }).click();
      await expect(page.getByRole('heading', { name: 'Shopping list' })).toBeVisible();
      await expect(page.getByPlaceholder('Add an extra item to your list...')).toBeVisible();
    } finally {
      if (savedTitle) {
        await page.getByRole('button', { name: 'Save & Schedule' }).click().catch(() => undefined);
        const deleteButton = page.getByRole('button', { name: `Permanently delete ${savedTitle}` });
        if (await deleteButton.count() === 1) {
          page.once('dialog', dialog => dialog.accept());
          await deleteButton.click();
        } else {
          const archiveButton = page
            .getByTestId('saved-recipe-item')
            .filter({ hasText: savedTitle })
            .getByRole('button', { name: 'Archive', exact: true });
          if (await archiveButton.count() === 1) {
            await archiveButton.click();
          }
        }
      }
    }
  });
});
