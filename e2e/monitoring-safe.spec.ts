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
    const guidanceY: number[] = [];
    const starterY: number[] = [];

    for (const [label, guidance] of modes) {
      await page.getByRole('button', { name: label, exact: true }).click();
      const guidanceLocator = page.getByText(guidance, { exact: true });
      await expect(guidanceLocator).toBeVisible();
      await expect(page.getByRole('button', { name: 'Open search preferences' })).toBeVisible();
      const guidanceBox = await guidanceLocator.boundingBox();
      const starterBox = await page.getByText('Try a search', { exact: true }).boundingBox();
      expect(guidanceBox).not.toBeNull();
      expect(starterBox).not.toBeNull();
      guidanceY.push(guidanceBox?.y ?? -1);
      starterY.push(starterBox?.y ?? -1);
    }

    expect(guidanceY[1]).toBeCloseTo(guidanceY[0], 1);
    expect(guidanceY[2]).toBeCloseTo(guidanceY[0], 1);
    expect(starterY[1]).toBeCloseTo(starterY[0], 1);
    expect(starterY[2]).toBeCloseTo(starterY[0], 1);

    await page.getByRole('button', { name: 'AI-created recipes', exact: true }).click();
    await expect(page.getByRole('button', { name: 'A choice of Shellfish recipes', exact: true })).toBeVisible();
    await expect(page.getByText('AI-assisted search, with links to original recipe sources.', { exact: true })).toHaveCount(0);

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

  test('guest starters remain available in other modes after an AI search is counted', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('dbd_guest_search_count_v1', '1');
    });
    await page.goto('/?view=home');

    await page.getByRole('button', { name: 'AI-created recipes', exact: true }).click();
    await expect(page.getByRole('button', { name: 'A choice of Shellfish recipes', exact: true })).toHaveCount(0);

    await page.getByRole('button', { name: 'Published recipes', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Minced beef', exact: true })).toBeVisible();

    await page.getByRole('button', { name: 'Ready-made dinners', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Fancy something Oriental or Asian?', exact: true })).toBeVisible();
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

  test('back to search controls share the same floating treatment', async ({ page }) => {
    let baselineStyle: Record<string, string> | null = null;
    for (const route of ['/planner', '/shopping']) {
      await page.goto(route);
      const button = page.getByRole('button', { name: 'Back to search', exact: true });
      await expect(button).toBeVisible();
      const box = await button.boundingBox();
      const viewport = page.viewportSize();
      expect(box).not.toBeNull();
      expect(viewport).not.toBeNull();

      const style = await button.evaluate(element => {
        const computed = window.getComputedStyle(element);
        return {
          position: computed.position,
          top: computed.top,
          right: computed.right,
          color: computed.color,
          fontWeight: computed.fontWeight,
          textTransform: computed.textTransform
        };
      });

      expect(style.position).toBe('fixed');
      expect(Math.abs((box!.y + box!.height / 2) - viewport!.height / 2)).toBeLessThanOrEqual(1);
      expect(style.fontWeight).toBe('700');
      expect(style.textTransform).toBe('uppercase');
      if (baselineStyle) {
        expect(style).toEqual(baselineStyle);
      } else {
        baselineStyle = style;
      }
    }
  });
});
