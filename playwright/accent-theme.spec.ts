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
  await expect(selector.locator('option')).toHaveText(['Forest', 'Indigo', 'Paper', 'Signal']);
  for (const theme of ['forest', 'indigo', 'paper', 'signal']) {
    await selector.selectOption(theme);
    await expect(page.locator('html')).toHaveAttribute('data-accent-theme', theme);
  }
});

test('Visual Themes change Map chrome while preserving its data color contract', async ({ page }) => {
  await page.goto('/#/maps/frontend?mission=main-m01');
  const forest = await page.locator('.map-stage').evaluate(node => getComputedStyle(node).backgroundColor);
  const regionFill = await page.locator('.map-region rect').first().evaluate(node => getComputedStyle(node).fill);
  const relationStroke = await page.locator('.map-edge').first().evaluate(node => getComputedStyle(node).stroke);
  const foundationFill = await page.locator('.map-node.foundation rect').first().evaluate(node => getComputedStyle(node).fill);
  const boundaryFill = await page.locator('.map-node.boundary rect').first().evaluate(node => getComputedStyle(node).fill);

  await page.getByLabel('화면 테마').selectOption('indigo');
  const indigo = await page.locator('.map-stage').evaluate(node => getComputedStyle(node).backgroundColor);
  expect(indigo).not.toBe(forest);
  expect(await page.locator('.map-region rect').first().evaluate(node => getComputedStyle(node).fill)).toBe(regionFill);

  await page.getByLabel('화면 테마').selectOption('paper');
  const paper = await page.locator('.map-stage').evaluate(node => getComputedStyle(node).backgroundColor);
  expect(paper).not.toBe(forest);
  expect(paper).not.toBe(indigo);

  await page.getByLabel('화면 테마').selectOption('signal');
  const signal = await page.locator('.map-stage').evaluate(node => getComputedStyle(node).backgroundColor);
  expect(signal).not.toBe(forest);
  expect(await page.locator('.map-region rect').first().evaluate(node => getComputedStyle(node).fill)).toBe(regionFill);
  expect(await page.locator('.map-edge').first().evaluate(node => getComputedStyle(node).stroke)).toBe(relationStroke);
  expect(await page.locator('.map-node.foundation rect').first().evaluate(node => getComputedStyle(node).fill)).toBe(foundationFill);
  expect(await page.locator('.map-node.boundary rect').first().evaluate(node => getComputedStyle(node).fill)).toBe(boundaryFill);
});

test('Forest and Indigo use distinct loaded heading fonts while preserving the readable body face', async ({ page }) => {
  await page.goto('/#/terms/redis');
  const selector = page.getByLabel('화면 테마');
  await selector.selectOption('forest');
  const forestHeading = await page.locator('h1').evaluate(node => getComputedStyle(node).fontFamily);
  const forestBody = await page.locator('article').evaluate(node => getComputedStyle(node).fontFamily);

  await selector.selectOption('indigo');
  await page.evaluate(() => document.fonts.load('700 32px "IBM Plex Sans KR"', '기술 Redis 2026'));
  const indigoHeading = await page.locator('h1').evaluate(node => getComputedStyle(node).fontFamily);
  const indigoBody = await page.locator('article').evaluate(node => getComputedStyle(node).fontFamily);

  expect(forestHeading).toContain('Pretendard VF');
  expect(indigoHeading).toContain('IBM Plex Sans KR');
  expect(forestHeading).not.toBe(indigoHeading);
  expect(forestBody).toContain('Pretendard VF');
  expect(indigoBody).toContain('Pretendard VF');
});
