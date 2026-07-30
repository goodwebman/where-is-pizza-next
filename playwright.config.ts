import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';

const DATABASE_URL =
  process.env.E2E_DATABASE_URL ??
  process.env.TEST_DATABASE_URL ??
  process.env.DATABASE_URL!;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  // One retry everywhere: a single Node server under full parallelism
  // occasionally drops a connection, which says nothing about the code.
  retries: 1,
  workers: process.env.CI ? 2 : 4,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  globalSetup: './e2e/global-setup.ts',

  projects: [
    { name: 'setup', testMatch: /auth\.setup\.ts/ },
    {
      name: 'guest',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: /auth\.setup\.ts/,
    },
    {
      name: 'authed',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'e2e/.auth/user.json',
      },
      dependencies: ['setup'],
      testMatch: /.*\.authed\.spec\.ts/,
    },
  ],

  webServer: {
    // A production build, not `next dev`: ISR and route caching behave
    // differently in development, and those are part of what is under test.
    command: 'npm run build && npm run start',
    url: 'http://localhost:3000/api/health',
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
    env: {
      DATABASE_URL,
      DIRECT_DATABASE_URL: DATABASE_URL,
      JWT_SECRET: process.env.JWT_SECRET ?? 'e2e-secret-'.padEnd(48, 'x'),
      SITE_URL: 'http://localhost:3000',
    },
  },
});
