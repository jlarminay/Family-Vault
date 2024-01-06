import { test, expect } from '@playwright/test';
import { screenSizes } from '../values';

// test all screen sizes
screenSizes.forEach((size) => {
  test(`Landing - ${size.name}`, async ({ page }) => {
    // setup
    await page.setViewportSize(size);
    await page.goto('/');

    // check page
    await expect(page.locator('h1')).toContainText('Exciting news');
  });
});
