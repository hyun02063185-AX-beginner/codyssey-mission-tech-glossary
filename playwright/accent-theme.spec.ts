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

  for (const legacyTheme of ['ocean', 'amber', 'mono']) {
    await page.evaluate(([key, value]) => localStorage.setItem(key, value), [STORAGE_KEY, legacyTheme]);
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-accent-theme', 'forest');
  }
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

test('all visual themes apply their intended Korean-capable typography roles', async ({ page }) => {
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

  await selector.selectOption('paper');
  const paperHeading = await page.locator('h1').evaluate(node => getComputedStyle(node).fontFamily);
  const paperBody = await page.locator('article').evaluate(node => getComputedStyle(node).fontFamily);
  expect(paperHeading).toContain('ui-serif');
  expect(paperBody).toContain('Pretendard VF');

  await selector.selectOption('signal');
  await page.evaluate(() => document.fonts.load('700 32px "IBM Plex Sans KR"', '기술 Redis 2026'));
  const signalHeading = await page.locator('h1').evaluate(node => getComputedStyle(node).fontFamily);
  const signalBody = await page.locator('article').evaluate(node => getComputedStyle(node).fontFamily);
  expect(signalHeading).toContain('IBM Plex Sans KR');
  expect(signalBody).toContain('Pretendard VF');
});

test('Map node interaction stays quieter than the theme chrome in every visual theme', async ({ page }) => {
  for (const theme of ['forest', 'indigo', 'paper', 'signal']) {
    await page.goto('/#/maps/data-database?mission=preliminary-m03');
    await page.getByLabel('화면 테마').selectOption(theme);
    await page.mouse.move(0, 0);
    const node = page.locator('.map-node.core').first();
    await expect(node).toBeVisible();
    const baseFill = await node.locator('rect').evaluate(element => getComputedStyle(element).fill);
    await node.hover();
    const hoverFill = await node.locator('rect').evaluate(element => getComputedStyle(element).fill);
    expect(hoverFill).not.toBe(baseFill);

    await node.click();
    await expect(page.locator('[data-detail-panel="open"]')).toBeVisible();
    await page.waitForTimeout(180);
    const selected = await node.locator('rect').evaluate(element => {
      const resolve = (token: string) => {
        const probe = document.createElement('i');
        probe.style.color = `var(${token})`;
        document.body.append(probe);
        const color = getComputedStyle(probe).color;
        probe.remove();
        return color;
      };
      return { fill: getComputedStyle(element).fill, stroke: getComputedStyle(element).stroke, selectionBorder: resolve('--map-selection-border'), accent: resolve('--accent-primary') };
    });
    expect(selected.fill).not.toBe(baseFill);
    expect(selected.fill).not.toBe(selected.accent);
    expect(selected.stroke).toBe(selected.selectionBorder);
    await expect(node.locator('.map-node-label').first()).toHaveCSS('fill', 'rgb(23, 33, 43)');
    const highlightedEdge = page.locator('.map-edge.is-highlighted').first();
    await expect(highlightedEdge).toBeVisible();
    const edge = await highlightedEdge.evaluate(element => ({ stroke: getComputedStyle(element).stroke, width: getComputedStyle(element).strokeWidth, opacity: getComputedStyle(element).opacity }));
    expect(edge.width).toBe('2.15px');
    expect(edge.opacity).toBe('0.82');
  }
});
