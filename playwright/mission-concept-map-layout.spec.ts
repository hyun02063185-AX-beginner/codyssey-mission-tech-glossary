import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const route = '/#/missions/main-M05/story-map/concepts';
const dir = process.env.B31_QA_OUTPUT ? `${process.env.B31_QA_OUTPUT}/map-layout` : 'reports/b3-1-map-first';
mkdirSync(dir, { recursive: true });
const canvas = (page: Page) => page.locator('.map-canvas');
async function labelSize(page: Page) {
  return canvas(page).evaluate(element => {
    const svg = element as SVGSVGElement;
    return 16 * svg.getBoundingClientRect().width / svg.viewBox.baseVal.width;
  });
}
async function uncovered(page: Page) {
  await expect.poll(() => page.evaluate(() => {
    const node = document.querySelector('.map-node.is-selected')?.getBoundingClientRect();
    const shell = document.querySelector('.map-canvas-shell')?.getBoundingClientRect();
    const panel = document.querySelector('.map-detail-panel')?.getBoundingClientRect();
    const toolbar = document.querySelector('.cm-toolbar')?.getBoundingClientRect();
    const overlaps = (a: DOMRect, b: DOMRect) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
    return !!node && !!shell && !!toolbar && node.left >= shell.left && node.right <= shell.right && node.top >= shell.top && node.bottom <= shell.bottom && !overlaps(node, toolbar) && (!panel || !overlaps(node, panel));
  })).toBe(true);
}
async function settled(page: Page) {
  await expect.poll(async () => {
    const samples: string[] = [];
    for (let i = 0; i < 4; i++) { samples.push((await canvas(page).getAttribute('viewBox'))!); await page.waitForTimeout(60); }
    return new Set(samples).size;
  }).toBe(1);
}
async function fitInside(page: Page) {
  await page.getByRole('button', { name: '전체 보기', exact: true }).click();
  await expect.poll(() => page.evaluate(() => {
    const shell = document.querySelector('.map-canvas-shell')!.getBoundingClientRect();
    const panel = document.querySelector('.map-detail-panel')?.getBoundingClientRect();
    return [...document.querySelectorAll('.map-node')].every(element => {
      const node = element.getBoundingClientRect();
      return node.left >= shell.left && node.right <= shell.right && node.top >= shell.top && node.bottom <= shell.bottom &&
        (!panel || node.right <= panel.left || node.bottom <= panel.top || node.left >= panel.right || node.top >= panel.bottom);
    });
  })).toBe(true);
}

for (const width of [1280, 1000, 390, 360]) test(`${width}px map-first space, retained controls and focus mode`, async ({ page }) => {
  await page.setViewportSize({ width, height: width > 700 ? 900 : 844 });
  await page.goto(route); await expect(canvas(page)).toBeVisible();
  await expect.poll(() => labelSize(page)).toBeGreaterThanOrEqual(13.9);
  const rect = (await canvas(page).boundingBox())!;
  const toolbar = (await page.locator('.cm-toolbar').boundingBox())!;
  expect(rect.height).toBeGreaterThanOrEqual(width > 700 ? 600 : 500);
  expect(toolbar.height).toBeLessThan(width > 700 ? 75 : 110);
  if (width < 700) expect(rect.y).toBeLessThan(430);
  for (const name of ['지도 확대', '지도 축소', '읽기 크기', '전체 보기']) await expect(page.getByRole('button', { name, exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: '선택한 개념 설명', exact: true })).toBeVisible();
  const before = await canvas(page).getAttribute('viewBox');
  await page.getByRole('button', { name: '탐색 도구 펼치기', exact: true }).click();
  await expect(page.getByRole('searchbox')).toBeVisible();
  await expect(page.getByRole('button', { name: '목록으로 보기', exact: true })).toBeVisible();
  expect((await canvas(page).boundingBox())!.height).toBeCloseTo(rect.height, 0);
  await expect(canvas(page)).toHaveAttribute('viewBox', before!);
  await page.getByRole('button', { name: '탐색 도구 닫기', exact: true }).click();
  await page.goto(`${route}?node=gen:firewall`);
  await expect(page.locator('.map-detail-panel')).toBeVisible(); await uncovered(page);
  await page.getByRole('button', { name: '지도 확대' }).click();
  const zoom = await labelSize(page);
  const withPanel=(await canvas(page).boundingBox())!;
  await page.getByRole('button', { name: '지도 크게 보기', exact: true }).click();
  await expect(page.locator('.mission-concept-map')).toHaveClass(/is-focused/);
  await uncovered(page); await settled(page);
  await expect(page.locator('.map-detail-panel')).toHaveCount(0);
  const expanded=(await canvas(page).boundingBox())!;
  if(width>700)expect(expanded.width).toBeGreaterThan(withPanel.width+300);
  else expect(expanded.height).toBeGreaterThan(withPanel.height+300);
  expect(await labelSize(page)).toBeCloseTo(zoom, 1);
  await expect(page.locator('[data-relation="GN14"] .map-edge')).toHaveClass(/is-highlighted/);
  await page.screenshot({ path: `${dir}/${width}-focused.png`, animations: 'disabled' });
  await page.getByRole('button', { name: /설명 다시 열기/ }).click();
  await uncovered(page);
  await page.getByRole('button', { name: '일반 보기로 돌아가기', exact: true }).click();
  await uncovered(page); await settled(page);
  expect((await canvas(page).boundingBox())!.height).toBeCloseTo(withPanel.height, 0);
  expect(await labelSize(page)).toBeCloseTo(zoom, 1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});

test('resize, Fit and manual zoom remain stable while panel and view change', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(`${route}?node=com:public-ip`); await uncovered(page);
  await page.getByRole('button', { name: '지도 확대' }).click();
  const zoom = await labelSize(page);
  for (const [width, height] of [[1000, 650], [390, 844], [360, 650], [1280, 900]]) {
    await page.setViewportSize({ width, height }); await uncovered(page); await settled(page);
    expect(await labelSize(page)).toBeCloseTo(zoom, 1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  }
  await fitInside(page);
  await page.setViewportSize({ width: 1000, height: 650 }); await fitInside(page); await settled(page);
  await page.getByRole('button', { name: '상세 패널 닫기' }).click();
  await fitInside(page);
  await page.getByRole('button', { name: '일반 네트워크', exact: true }).click();
  await expect(page.locator('[data-map-node]')).toHaveCount(26);
  await page.getByRole('button', { name: 'AWS 네트워크', exact: true }).click();
  await expect(page.locator('[data-map-node]')).toHaveCount(15);
  await expect(page.locator('.map-node.is-selected')).toHaveAttribute('data-map-node', 'com:public-ip');
  await page.getByRole('button', { name: '읽기 크기' }).click(); await uncovered(page);
  expect(await labelSize(page)).toBeCloseTo(14, 1);
  expect(errors).toEqual([]);
});

test('collapsed tools report active flow and supplementary filter', async ({ page }) => {
  await page.goto(`${route}?flow=AF01&more=1`);
  await expect(page.locator('#cm-explore-tools')).toBeHidden();
  await expect(page.locator('.cm-active-tools')).toContainText('W1~W4');
  await expect(page.locator('.cm-active-tools')).toContainText('보충 개념 켜짐');
  await expect(page.locator('[data-map-node]')).toHaveCount(36);
  await expect(page.locator('[data-map-node="aws:security-group"]')).not.toHaveClass(/is-highlighted/);
  await page.getByRole('button', { name: '지도 크게 보기' }).click();
  await expect(page.locator('.cm-active-tools')).toContainText('W1~W4');
  await expect(page.locator('[data-relation="AF01"].is-highlighted')).toHaveCount(4);
  await page.getByRole('button', { name: '탐색 도구 펼치기', exact: true }).click();
  await page.getByRole('checkbox', { name: '보충 개념 함께 보기' }).uncheck();
  await page.getByRole('button', { name: '탐색 도구 닫기', exact: true }).click();
  await expect(page.locator('.cm-active-tools')).not.toContainText('보충 개념 켜짐');
  await expect(page.locator('.cm-active-tools')).toContainText('W1~W4');
  await page.keyboard.press('Escape');
  await expect(page.locator('.mission-concept-map')).not.toHaveClass(/is-focused/);
});
