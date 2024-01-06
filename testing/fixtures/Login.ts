/* eslint-disable no-undef */
import { expect } from '@playwright/test';

exports.Login = class Login {
  page: any;

  constructor(page: any) {
    this.page = page;
  }

  async login(loginValues: any) {
    await this.page.goto('/landing');

    // wait for load
    await this.page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    await this.page.waitForLoadState('load', { timeout: 30000 });
    await this.page.waitForLoadState('networkidle', { timeout: 5000 });

    // check page load
    await this.page.waitForURL('**/landing');
    await expect(await this.page.innerText('h1')).toContain('Register');

    // login
    await this.page.locator('[test-label="loginButton"]').click();
    await this.page.locator('input#username').fill(loginValues.email);
    await this.page.locator('input#password').fill(loginValues.password);
    await this.page.locator('button[type="submit"][name="action"]').last().click();
    await this.page.waitForURL('**/home');
  }
};
