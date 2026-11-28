import { defineConfig } from '@playwright/test';

const v05 = process.env.B32_V05 === '1';
const port = Number(process.env.PLAYWRIGHT_PORT ?? (v05 ? 4176 : 4173));
const integrated = process.env.B32_V04 === '1';
const mode = v05 ? ' --mode b32-v05' : integrated ? ' --mode b32-v04' : process.env.B32_REVIEW === '1' ? ' --mode b32-review' : '';
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: './playwright',
  use: { baseURL, headless: true, channel: process.env.PLAYWRIGHT_CHANNEL },
  webServer: { command: `npx vite --host 127.0.0.1 --port ${port} --strictPort${mode}`, url: baseURL, reuseExistingServer: !process.env.CI && !integrated && !v05 },
});
