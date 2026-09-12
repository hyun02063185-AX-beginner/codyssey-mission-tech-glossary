import { expect, test } from '@playwright/test';

const mapIds = ['frontend', 'backend-server-api', 'data-database', 'linux-runtime', 'devops-infrastructure', 'git-collaboration', 'security-identity', 'algorithms-data-structures', 'network-web-protocol', 'ai-ml-computing'];

function viewBox(page: import('@playwright/test').Page) {
  return page.locator('.map-canvas').getAttribute('viewBox');
}

test('wheel scrolls the page without changing the map viewport', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('/#/maps/frontend?mission=main-m01');
  const canvas = page.locator('.map-canvas');
  await expect(canvas).toBeVisible();
  const before = await viewBox(page);
  await canvas.hover();
  await page.mouse.wheel(0, 900);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  await expect(viewBox(page)).resolves.toBe(before);
  expect(errors).not.toContainEqual(expect.stringContaining('Unable to preventDefault'));
});

test('repeated pan, controls, selection, and routes keep the map rendered', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('/#/maps/frontend?mission=main-m01');
  const canvas = page.locator('.map-canvas');
  await canvas.scrollIntoViewIfNeeded();
  const box = await canvas.boundingBox();
  if (!box) throw new Error('Map canvas did not have a bounding box');
  for (let index = 0; index < 8; index += 1) {
    await page.mouse.move(box.x + 8, box.y + 90);
    await page.mouse.down();
    await page.mouse.move(box.x + 70 + index * 4, box.y + 125 + index * 3);
    await page.mouse.up();
  }
  await page.getByRole('button', { name: '지도 확대' }).click();
  await page.getByRole('button', { name: '지도 축소' }).click();
  await page.getByRole('button', { name: '맞춤' }).click();
  await page.locator('[data-map-node]').first().click();
  await expect(page.locator('.map-node.is-selected')).toHaveCount(1);
  await expect(page.locator('[data-detail-panel="open"]')).toBeVisible();
  const dimmedNode = page.locator('.map-canvas.has-focus .map-node:not(.is-highlighted):not(.is-selected):not(.is-overlay)').first();
  await expect(dimmedNode).toHaveCSS('opacity', '0.58');
  await expect(page.locator('.map-canvas.has-focus .map-node.is-overlay:not(.is-highlighted):not(.is-selected)').first()).toHaveCSS('opacity', '0.62');
  await expect(page.locator('.map-region').first()).toHaveCSS('opacity', '1');
  await page.locator('.map-route-chips button').first().click();
  await expect(canvas).toBeVisible();
  expect(errors).toEqual([]);
});

test('selected Boundary text stays dark and the desktop panel overlays the full map', async ({ page }) => {
  await page.goto('/#/maps/frontend?mission=main-m01');
  const workspace = page.locator('.map-workspace');
  const canvas = page.locator('.map-canvas');
  await expect(canvas).toBeVisible();
  const before = await workspace.boundingBox();
  await page.locator('.map-node.boundary').first().click();
  const panel = page.locator('[data-detail-panel="open"]');
  await expect(panel).toBeVisible();
  await expect(page.locator('.map-node.boundary.is-selected .map-node-label').first()).toHaveCSS('fill', 'rgb(23, 33, 43)');
  await expect(page.locator('.map-node.boundary.is-selected .map-node-layer')).toHaveCSS('fill', 'rgb(97, 112, 103)');
  const after = await workspace.boundingBox();
  expect(before?.width).toBeTruthy();
  expect(after?.width).toBeGreaterThanOrEqual((before?.width ?? 0) - 1);
  await page.getByRole('button', { name: '상세 패널 닫기' }).click();
  await expect(panel).toHaveCount(0);
  await page.locator('[data-map-node]').nth(1).click();
  await expect(panel).toBeVisible();
});

test('mobile selection uses an overlay bottom sheet without page overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#/maps/frontend?mission=main-m01');
  await page.locator('.map-node.boundary').first().click();
  const panel = page.locator('[data-detail-panel="open"]');
  await expect(panel).toBeVisible();
  await expect(panel).toHaveCSS('position', 'absolute');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});

test('all generic field maps load', async ({ page }) => {
  for (const mapId of mapIds) {
    await page.goto(`/#/maps/${mapId}`);
    await expect(page.locator('.map-canvas')).toBeVisible();
  }
});
