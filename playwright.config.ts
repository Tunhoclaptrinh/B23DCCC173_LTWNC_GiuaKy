import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';

const systemChrome = '/opt/google/chrome/chrome';
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    viewport: { width: 1440, height: 1000 },
    locale: 'vi-VN',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    launchOptions: {
      executablePath:
        process.env.CHROME_EXECUTABLE_PATH ?? (existsSync(systemChrome) ? systemChrome : undefined),
      args: ['--no-sandbox', '--disable-dev-shm-usage'],
    },
  },
  webServer: {
    command:
      process.env.E2E_PREVIEW === '1'
        ? 'npm run preview -- --host 127.0.0.1 --port 4173 --strictPort'
        : 'npm run dev -- --host 127.0.0.1 --port 4173 --strictPort',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
});
