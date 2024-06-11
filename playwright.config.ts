import { defineConfig, devices } from '@playwright/test';

// require('dotenv').config({ path: '.env' });

export default defineConfig({
  testDir: './testing/tests',
  testMatch: '*.spec.ts',
  outputDir: './testing/results',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  workers: process.env.AUTH_ORIGIN ? 3 : 2,
  retries: process.env.AUTH_ORIGIN ? 2 : 1,
  timeout: process.env.AUTH_ORIGIN ? 60000 : 60000, // ms
  maxFailures: process.env.AUTH_ORIGIN ? 3 : 3,
  reporter: [
    ['list'],
    [
      'html',
      {
        outputFolder: './testing/report',
        open: 'never',
      },
    ],
  ],

  use: {
    baseURL: `http://${process.env.AUTH_ORIGIN || 'localhost:3000'}`,
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
});
