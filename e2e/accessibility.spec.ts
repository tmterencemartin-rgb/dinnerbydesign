import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const publicRoutes = [
  { name: 'home search', path: '/?view=home' },
  { name: 'public landing', path: '/?view=landing' },
  { name: 'guides index', path: '/guides' },
  { name: 'guide detail', path: '/food-costs/fresh-or-frozen' },
  { name: 'contact', path: '/contact' },
  { name: 'sign in', path: '/signin?mode=signin' },
];

test.describe('public accessibility', () => {
  for (const route of publicRoutes) {
    test(`${route.name} has no WCAG 2 A/AA violations`, async ({ page }) => {
      await page.goto(route.path);
      await expect(page.getByRole('main')).toBeVisible();
      await page.waitForTimeout(1000);

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();

      expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
    });
  }
});
