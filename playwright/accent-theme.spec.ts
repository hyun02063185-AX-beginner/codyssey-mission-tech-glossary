import { expect, test } from '@playwright/test';

const STORAGE_KEY = 'codyssey-accent-theme';

test('Accent Theme changes, persists, falls back safely, and does not change routes', async ({ page }) => {
  await page.goto('/#/');
  await expect(page.locator('html')).toHaveAttribute('data-accent-theme', 'forest');

  await page.getByLabel('화면 테마').selectOption('indigo');
  await expect(page.locator('html')).toHaveAttribute('data-accent-theme', 'indigo');
  expect(await page.evaluate(key => localStorage.getItem(key), STORAGE_KEY)).toBe('indigo');

  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-accent-theme', 'indigo');
  await page.goto('/#/terms/mac-operation');
  await expect(page.locator('html')).toHaveAttribute('data-accent-theme', 'indigo');
  await page.goto('/#/missions/preliminary-M03');
  await expect(page.locator('html')).toHaveAttribute('data-accent-theme', 'indigo');
  await page.goto('/#/maps/frontend?mission=main-m01');
  await expect(page.locator('html')).toHaveAttribute('data-accent-theme', 'indigo');
  await page.goto('/#/academic/operating-systems');
  await expect(page.locator('html')).toHaveAttribute('data-accent-theme', 'indigo');

  await page.evaluate(key => localStorage.setItem(key, 'unknown-theme'), STORAGE_KEY);
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-accent-theme', 'forest');
});

test('all preset choices remain available from the compact, keyboard-native selector', async ({ page }) => {
  await page.goto('/#/encyclopedia');
  const selector = page.getByLabel('화면 테마');
  await expect(selector.locator('option')).toHaveText(['Forest', 'Indigo', 'Paper']);
  for (const theme of ['forest', 'indigo', 'paper']) {
    await selector.selectOption(theme);
    await expect(page.locator('html')).toHaveAttribute('data-accent-theme', theme);
  }
});

test('Visual Themes change Map chrome while preserving its data color contract', async ({ page }) => {
  await page.goto('/#/maps/frontend?mission=main-m01');
  const forest = await page.locator('.map-stage').evaluate(node => getComputedStyle(node).backgroundColor);
  const regionFill = await page.locator('.map-region rect').first().evaluate(node => getComputedStyle(node).fill);

  await page.getByLabel('화면 테마').selectOption('indigo');
  const indigo = await page.locator('.map-stage').evaluate(node => getComputedStyle(node).backgroundColor);
  expect(indigo).not.toBe(forest);
  expect(await page.locator('.map-region rect').first().evaluate(node => getComputedStyle(node).fill)).toBe(regionFill);

  await page.getByLabel('화면 테마').selectOption('paper');
  const paper = await page.locator('.map-stage').evaluate(node => getComputedStyle(node).backgroundColor);
  expect(paper).not.toBe(forest);
  expect(paper).not.toBe(indigo);
});
