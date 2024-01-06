/* eslint-disable no-undef */
import { expect } from '@playwright/test';
var shell = require('shelljs');

exports.Helpers = class Helpers {
  page: any;

  constructor(page: any) {
    this.page = page;
  }

  async dropdown(target: string, values: Array<string>) {
    await this.page.locator(target).click();
    await expect(this.page.locator('[role="listbox"]')).toBeVisible();
    for (let val of values) {
      await this.page.locator('[role="listbox"] span', { hasText: val }).click();
    }
    if (values.length > 1) {
      // if multiple, we click the field again to deselect
      await this.page.locator(target).click({ position: { x: 0, y: 0 } });
    }
    await expect(this.page.locator('[role="listbox"]')).toBeHidden();
  }

  async waitForToaster(timeout = 1000) {
    await this.page.locator('.c-toast[role="alert"]').click();
    await this.page.waitForTimeout(timeout);
  }

  async goto(targetUrl: string) {
    await this.page.goto(targetUrl);

    // wait for load
    await this.page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    await this.page.waitForLoadState('load', { timeout: 30000 });
    await this.page.waitForLoadState('networkidle', { timeout: 5000 });
    await this.page.waitForURL(`**${targetUrl}`);
  }
};
