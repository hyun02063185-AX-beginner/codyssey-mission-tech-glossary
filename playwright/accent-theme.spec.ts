import { expect, test } from '@playwright/test';

const STORAGE_KEY = 'codyssey-accent-theme';

test('Accent Theme changes, persists, falls back safely, and does not change routes', async ({ page }) => {
  await page.goto('/#/');
  await expect(page.locator('html')).toHaveAttribute('data-accent-theme', 'forest');

  await page.getByLabel('색상 테마').selectOption('ocean');
  await expect(page.locator('html')).toHaveAttribute('data-accent-theme', 'ocean');
  expect(await page.evaluate(key => localStorage.getItem(key), STORAGE_KEY)).toBe('ocean');

  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-accent-theme', 'ocean');
  await page.goto('/#/terms/mac-operation');
  await expect(page.locator('html')).toHaveAttribute('data-accent-theme', 'ocean');
  await page.goto('/#/missions/preliminary-M03');
  await expect(page.locator('html')).toHaveAttribute('data-accent-theme', 'ocean');
  await page.goto('/#/maps/frontend?mission=main-m01');
  await expect(page.locator('html')).toHaveAttribute('data-accent-theme', 'ocean');
  await page.goto('/#/academic/operating-systems');
  await expect(page.locator('html')).toHaveAttribute('data-accent-theme', 'ocean');

  await page.evaluate(key => localStorage.setItem(key, 'unknown-theme'), STORAGE_KEY);
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-accent-theme', 'forest');
});

test('all preset choices remain available from the compact, keyboard-native selector', async ({ page }) => {
  await page.goto('/#/encyclopedia');
  const selector = page.getByLabel('색상 테마');
  await expect(selector.locator('option')).toHaveText(['Forest', 'Ocean', 'Indigo', 'Amber', 'Mono']);
  for (const theme of ['forest', 'ocean', 'indigo', 'amber', 'mono']) {
    await selector.selectOption(theme);
    await expect(page.locator('html')).toHaveAttribute('data-accent-theme', theme);
  }
});
