import { test, expect } from '@playwright/test';

test('Landing Page', async ({ page }) => {
  await page.goto('http://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});
