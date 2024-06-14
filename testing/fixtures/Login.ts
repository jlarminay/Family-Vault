/* eslint-disable no-undef */
import { expect } from '@playwright/test';

export default class Login {
  page: any;

  constructor(page: any) {
    this.page = page;
  }

  async login(credentials: { email: string; password: string }) {
    await this.page.goto('/login');

    // wait for load
    await this.page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    await this.page.waitForLoadState('load', { timeout: 30000 });
    await this.page.waitForLoadState('networkidle', { timeout: 5000 });

    // check page load
    await this.page.waitForURL('**/login');
    await expect(await this.page.locator('p', { hasText: 'Login' })).toBeVisible();

    // login
    await this.page.evaluate(
      (el: any) => {
        el.style.display = 'block';
      },
      await this.page.$('[test-label="loginWithCredentials"]'),
    );
    await this.page.locator('.q-btn', { hasText: 'Credentials' }).click();
    await this.page.locator('[test-label="email"]').fill(credentials.email);
    await this.page.locator('[test-label="password"]').fill(credentials.password);
    await this.page.locator('[test-label="submit"]').click();
    await this.page.waitForURL('**/dashboard');
    await expect(this.page.locator('h1', { hasText: 'Dashboard' })).toBeVisible();
  }
}
