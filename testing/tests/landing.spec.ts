import { test, expect } from '@playwright/test';
import { screenSizes } from '../values';

// test all screen sizes
screenSizes.forEach((size) => {
  test(`Landing - ${size.name}`, async ({ page }) => {
    // setup
    await page.setViewportSize(size);
    await page.goto('/');

    await expect(page.locator('h1')).toContainText('Exciting news');
  });

  test(`Login - ${size.name}`, async ({ page }) => {
    // setup
    await page.setViewportSize(size);
    await page.goto('/');

    await page.locator('.q-btn', { hasText: 'Login' }).click();

    await expect(page.locator('p', { hasText: 'Login' })).toBeVisible();
    await page.locator('.q-btn', { hasText: 'Credentials' }).click();

    page.waitForURL('/dashboard');
    await expect(page.locator('h1', { hasText: 'Dashboard' })).toBeVisible();
  });
});
