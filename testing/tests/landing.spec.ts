import { test, expect } from '@playwright/test';
import { screenSizes } from '../values';
import Login from '../fixtures/Login';

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
    const login = new Login(page);

    // login
    await login.login({ email: 'test@email.com', password: 'Password1' });

    await expect(page.locator('h1', { hasText: 'Dashboard' })).toBeVisible();
  });
});
