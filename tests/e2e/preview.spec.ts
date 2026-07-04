import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

test('preview page renders and passes accessibility', async ({ page }) => {
  await page.goto('http://localhost:3000/preview/home');
  await expect(page.locator('h1')).toHaveText('Welcome');

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter(v => v.impact === 'critical')).toHaveLength(0);
});