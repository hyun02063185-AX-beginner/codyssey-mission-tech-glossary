import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
const URL = '/#/missions/main-M05/story-map/concepts';
const reportDir = process.env.B31_QA_OUTPUT ? `${process.env.B31_QA_OUTPUT}/map-interaction` : 'reports/b3-1-map-first/interaction';
mkdirSync(reportDir, { recursive: true });
const node = (page: Page, id: string) => page.locator(`[data-map-node="${id}"]`);
const panel = (page: Page) => page.locator('[data-detail-panel="open"]');
async function open(page: Page, query = '') {
  await page.goto(URL + query);
  await expect(page.locator('[data-map-node]').first()).toBeVisible();
}
async function explore(page: Page) {
  if (await page.locator('#cm-explore-tools').isHidden()) await page.getByRole('button', { name: '탐색 도구 펼치기', exact: true }).click();
}
async function searchSelect(page: Page, name: string) {
  await explore(page);
  await page.getByRole('searchbox', { name: '지도에서 찾기' }).fill(name);
  await page.locator('.cm-search-results').getByRole('button').first().click();
  await expect(panel(page)).toBeVisible();
}
async function whole(page: Page) { await page.getByRole('button', { name: '전체 보기', exact: true }).click(); }
async function noOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
}
async function cardUncovered(page: Page) {
  await expect.poll(() => page.evaluate(() => {
    const selected = document.querySelector('.map-node.is-selected')?.getBoundingClientRect();
    const canvas = document.querySelector('.map-canvas-shell')!.getBoundingClientRect();
    const sheet = document.querySelector('.map-detail-panel')?.getBoundingClientRect();
    if (!selected) return false;
    return selected.left >= canvas.left && selected.right <= canvas.right && selected.top >= canvas.top && selected.bottom <= canvas.bottom &&
      (!sheet || selected.right <= sheet.left || selected.left >= sheet.right || selected.bottom <= sheet.top || selected.top >= sheet.bottom);
  })).toBe(true);
}

test('mission entry, default core map, all three views and existing guide remain reachable', async ({ page }) => {
  await page.goto('/#/missions/main-M05');
  await expect(page.getByRole('link', { name: '학습 가이드 읽기 →' })).toBeVisible();
  await page.getByRole('link', { name: '인터랙티브 개념지도 바로 보기 →' }).click();
  await expect(page.locator('[data-map-node]')).toHaveCount(23);
  await expect(page.locator('.cm-edge-group[data-relation^="CR"]')).toHaveCount(5);
  await expect(panel(page)).toHaveCount(0);
  await page.getByRole('button', { name: '일반 네트워크', exact: true }).click();
  await expect(page.locator('[data-map-node]')).toHaveCount(26);
  await page.getByRole('button', { name: 'AWS 네트워크', exact: true }).click();
  await expect(page.locator('[data-map-node]')).toHaveCount(15);
  await page.getByRole('button', { name: '전체 관계', exact: true }).click();
  await explore(page);
  await page.getByRole('checkbox', { name: '보충 개념 함께 보기' }).check();
  await expect(page.locator('[data-map-node]')).toHaveCount(36);
  await page.reload();
  await expect(page.locator('[data-map-node]')).toHaveCount(36);
  await page.getByRole('link', { name: '← B3-1 미션' }).click();
  await page.getByRole('link', { name: '학습 가이드 읽기 →' }).click();
  await expect(page).toHaveURL(/\/guide$/);
});

test('firewall selection, role relationships, comparisons and close/reopen', async ({ page }) => {
  await open(page, '?view=general');
  await whole(page); await node(page, 'gen:firewall').click();
  await expect(node(page, 'gen:firewall')).toHaveClass(/is-selected/);
  for (const id of ['GN13', 'GN14', 'GN16']) await expect(page.locator(`[data-relation="${id}"] .map-edge`)).toHaveClass(/is-highlighted/);
  await expect(panel(page)).toContainText('B3-1에서는');
  await panel(page).locator('[data-panel-relation="GN14"]').click();
  await expect(panel(page)).toContainText('연결을 방화벽 규칙과 비교');
  await expect(page).toHaveURL(/rel=GN14/);
  await page.getByRole('button', { name: '상세 패널 닫기' }).click();
  await page.getByRole('button', { name: /설명 다시 열기/ }).click();
  await expect(panel(page)).toContainText('연결을 방화벽 규칙과 비교');
});

test('node and relationship details restore after reload; keyboard can choose relations', async ({ page }) => {
  await open(page, '?node=gen:access-control');
  await expect(node(page, 'gen:access-control')).toHaveClass(/is-selected/);
  const comparison = panel(page).locator('details').filter({ has: page.locator('summary', { hasText: '≈ 접근 통제' }) }).first();
  await comparison.locator('summary').click();
  const relButton = comparison.locator('[data-panel-relation="CR02"]');
  await relButton.focus(); await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/rel=CR02/);
  await expect(panel(page)).toContainText('공통점'); await expect(panel(page)).toContainText('차이점');
  await expect(panel(page)).toContainText('ENI마다');
  await page.reload(); await expect(panel(page)).toContainText('주의할 오해');
  await expect(page.locator('.map-node.is-highlighted')).toHaveCount(2);
  await open(page, '?rel=CR01'); await expect(panel(page)).toContainText('요청이 지나는 장비로 그리지 않는다');
});

test('preserves common selection, explains incompatible view changes, and supports history', async ({ page }) => {
  await open(page, '?node=com:public-ip');
  await page.getByRole('button', { name: 'AWS 네트워크', exact: true }).click();
  await expect(node(page, 'com:public-ip')).toHaveClass(/is-selected/);
  await open(page, '?node=gen:access-control');
  await page.getByRole('button', { name: 'AWS 네트워크', exact: true }).click();
  await expect(page.locator('.cm-notice')).toContainText('선택을 해제');
  await expect(panel(page)).toHaveCount(0);
  await expect(page).toHaveURL(/view=aws$/);
  await page.getByRole('button', { name: '비슷한 역할: Security Group →' }).click();
  await expect(node(page, 'aws:security-group')).toHaveClass(/is-selected/);
  await expect(page).toHaveURL(/view=aws&node=aws%3Asecurity-group$/);
  await page.goBack(); await expect(panel(page)).toHaveCount(0);
  await page.goBack(); await expect(node(page, 'gen:access-control')).toHaveClass(/is-selected/);
});

test('flow chips reveal every step, keep settings off the packet path and can be toggled', async ({ page }) => {
  await open(page);
  for (const [id, steps] of [['GF01', 5], ['GF02', 5], ['AF01', 4]] as const) {
    await explore(page);
    await page.locator('.map-route-chips button').nth(id === 'GF01' ? 0 : id === 'GF02' ? 1 : 2).click();
    await expect(page).toHaveURL(new RegExp(`flow=${id}`));
    await expect(page.locator(`[data-relation="${id}"].is-highlighted`)).toHaveCount(steps);
    await expect(panel(page).locator('.cm-flow-steps li')).toHaveCount(steps + 1);
    if (id !== 'AF01') await expect(node(page, 'gen:switch')).toBeAttached();
    else {
      await expect(node(page, 'aws:route-table')).not.toHaveClass(/is-highlighted/);
      await expect(node(page, 'aws:security-group')).not.toHaveClass(/is-highlighted/);
      await expect(panel(page)).toContainText('이 길을 가능하게 한 설정');
    }
  }
  await explore(page);
  await page.locator('.map-route-chips button').nth(2).click();
  await expect(panel(page)).toHaveCount(0);
  await expect(node(page, 'gen:switch')).toHaveCount(0);
});

test('all six contrast cards explain differences without misleading links', async ({ page }) => {
  for (const [id, card] of [['gen:border-router', 'CT01'], ['gen:dmz', 'CT02'], ['gen:routing', 'CT03'], ['aws:route-table', 'CT04'], ['gen:nat', 'CT05'], ['aws:igw', 'CT06']]) {
    await open(page, `?node=${encodeURIComponent(id)}`);
    const details = panel(page).locator(`[data-contrast="${card}"]`);
    await details.locator('summary').click();
    await expect(details.locator('p').first()).toBeVisible();
    await expect(panel(page).locator('.cm-scenes a').first()).toHaveAttribute('href', /\/story-map\?scene=scene-/);
  }
  await open(page, '?node=gen:nat');
  await expect(panel(page).locator('a[href*="/terms/nat-gateway"]')).toHaveCount(0);
  await open(page, '?node=aws:subnet');
  await expect(panel(page).locator('a[href^="#/terms/public-subnet?b31-map="]')).toHaveCount(1);
  await panel(page).getByRole('link', { name: 'Public Subnet · 상세 사전에서 보기 →' }).click();
  await expect(page).toHaveURL(/terms\/public-subnet\?b31-map=/);
});

test('deep links normalize precedence and recover invalid inputs', async ({ page }) => {
  await open(page, '?term=security-group');
  await expect(node(page, 'aws:security-group')).toHaveClass(/is-selected/);
  await expect(page).toHaveURL(/node=aws%3Asecurity-group/);
  await open(page, '?view=general&node=aws:region');
  await expect(node(page, 'aws:region')).toHaveClass(/is-selected/);
  await expect(page.locator('.cm-notice')).toContainText('전체 관계');
  await open(page, '?rel=CR03&node=gen:nat&flow=GF01');
  await expect(panel(page)).toContainText('공통점');
  await expect(page).not.toHaveURL(/node=/);
  for (const query of ['?node=bad', '?view=bad', '?rel=bad', '?flow=GN01', '?term=bad', '?more=bad']) {
    await open(page, query);
    await expect(page.locator('[data-map-node]')).toHaveCount(23);
    await expect(page.locator('.cm-notice')).toBeVisible();
    await expect(panel(page)).toHaveCount(0);
  }
});

test('actual relationship hit area opens its explanation', async ({ page }) => {
  await open(page); await whole(page);
  // Find an uncovered point on the real curve, not a synthetic DOM click.
  const point = await page.locator('[data-relation-hit="CR04"]').evaluate(element => {
    const path = element as SVGPathElement, matrix = path.getScreenCTM()!;
    for (let ratio = .2; ratio < .9; ratio += .05) {
      const point = path.getPointAtLength(path.getTotalLength() * ratio);
      const screen = new DOMPoint(point.x, point.y).matrixTransform(matrix);
      if (document.elementFromPoint(screen.x, screen.y) === path) return { x: screen.x, y: screen.y };
    }
    return null;
  });
  expect(point).toBeTruthy(); await page.mouse.click(point!.x, point!.y);
  await expect(page).toHaveURL(/rel=CR04/); await expect(panel(page)).toContainText('공통점');
});

test('loading the concept stylesheet preserves existing map interaction', async ({ page }) => {
  await open(page, '?node=gen:firewall');
  await page.getByRole('link', { name: '← B3-1 미션' }).click();
  await page.locator('.mission-knowledge > summary').click();
  await page.locator('a[href="#/maps/network-web-protocol?mission=main-m05"]').click();
  await expect(page.locator('.map-canvas')).toBeVisible(); await whole(page);
  await page.locator('[data-map-node]').first().click();
  await expect(page.locator('.map-node.is-selected')).toHaveCount(1);
  await expect(panel(page)).toBeVisible();
  await expect(page.locator('.map-node-label').first()).toHaveCSS('font-size', '10px');
  await page.getByRole('button', { name: '지도 확대' }).click();
});

test('selection sheet remains usable with touch events', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await open(page, '?view=general');
  await explore(page);
  await page.getByRole('button', { name: '목록으로 보기', exact: true }).tap();
  await page.locator('#cm-node-list').getByRole('button', { name: /^방화벽/ }).tap();
  await expect(panel(page)).toBeVisible(); await cardUncovered(page);
  await page.getByRole('button', { name: '상세 패널 닫기' }).tap();
  await page.getByRole('button', { name: /설명 다시 열기/ }).tap();
  await expect(panel(page)).toBeVisible();
  await noOverflow(page); await context.close();
});

test('keyboard node selection, Fit, zoom, pan, wheel and repeated transitions', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await open(page); await whole(page);
  await node(page, 'gen:firewall').focus(); await page.keyboard.press('Enter');
  await expect(node(page, 'gen:firewall')).toHaveClass(/is-selected/);
  await cardUncovered(page);
  const before = await page.locator('.map-canvas').getAttribute('viewBox');
  await page.getByRole('button', { name: '지도 확대' }).click();
  await expect(page.locator('.map-canvas')).not.toHaveAttribute('viewBox', before!);
  const zoom = await page.locator('.map-canvas').getAttribute('viewBox');
  // Short windows now scroll naturally; bring the drag target into the viewport.
  await page.locator('.map-canvas').scrollIntoViewIfNeeded();
  const box = (await page.locator('.map-canvas').boundingBox())!;
  await page.mouse.move(box.x + 8, box.y + box.height - 12); await page.mouse.down();
  await page.mouse.move(box.x + 80, box.y + box.height - 40, { steps: 5 }); await page.mouse.up();
  await expect(page.locator('.map-canvas')).not.toHaveAttribute('viewBox', zoom!);
  expect(await page.evaluate(() => window.getSelection()?.toString())).toBe('');
  const pan = await page.locator('.map-canvas').getAttribute('viewBox');
  await page.mouse.wheel(0, 300);
  await expect(page.locator('.map-canvas')).toHaveAttribute('viewBox', pan!);
  await page.getByRole('button', { name: '상세 패널 닫기' }).click();
  await page.getByRole('button', { name: /설명 다시 열기/ }).click(); await expect(panel(page)).toBeVisible();
  await panel(page).getByRole('button', { name: '선택 해제', exact: true }).click();
  for (let i = 0; i < 4; i++) {
    await page.getByRole('button', { name: '일반 네트워크', exact: true }).click();
    await searchSelect(page, '방화벽');
    await page.getByRole('button', { name: '전체 관계', exact: true }).click();
    await searchSelect(page, 'Security Group');
    await page.getByRole('button', { name: 'AWS 네트워크', exact: true }).click();
  }
  expect(errors).toEqual([]);
});

for (const width of [1280, 1000, 390, 360]) test(`${width}px visual QA, panel visibility, list and no overflow`, async ({ page }) => {
  mkdirSync(reportDir, { recursive: true });
  await page.setViewportSize({ width, height: width < 700 ? 844 : 900 });
  await open(page); await whole(page);
  await noOverflow(page);
  await page.screenshot({ path: `${reportDir}/${width}-overview.png`, fullPage: true, animations: 'disabled' });
  const canvasBefore = (await page.locator('.map-canvas').boundingBox())!;
  await explore(page);
  await page.getByRole('button', { name: '목록으로 보기', exact: true }).click();
  await page.locator('#cm-node-list').getByRole('button', { name: /^방화벽/ }).click();
  await expect(panel(page)).toBeVisible(); await cardUncovered(page); await noOverflow(page);
  const canvasAfter = (await page.locator('.map-canvas').boundingBox())!;
  expect(canvasAfter.width).toBeCloseTo(canvasBefore.width, 0);
  expect(canvasAfter.height).toBeCloseTo(canvasBefore.height, 0);
  if (width < 700) {
    expect((await panel(page).boundingBox())!.height).toBeLessThanOrEqual(844 * .43 + 1);
    await expect(panel(page).locator('.cm-detail-body')).toHaveCSS('overflow-y', 'auto');
  }
  await page.screenshot({ path: `${reportDir}/${width}-firewall.png`, fullPage: width >= 700, animations: 'disabled' });
  await page.getByRole('button', { name: '상세 패널 닫기' }).click();
  await page.getByRole('button', { name: /설명 다시 열기/ }).click(); await expect(panel(page)).toBeVisible();
});

test('desktop entry starts at readable text size; flow and comparison captures', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await open(page);
  await expect.poll(() => page.locator('.map-canvas').evaluate(element => {
    const svg = element as SVGSVGElement;
    return 16 * svg.getBoundingClientRect().width / svg.viewBox.baseVal.width;
  })).toBeGreaterThanOrEqual(13.9);
  await page.screenshot({ path: `${reportDir}/1280-reading.png`, animations: 'disabled' });
  await open(page, '?view=aws&flow=AF01');
  await expect(panel(page)).toBeVisible();
  await page.screenshot({ path: `${reportDir}/1280-aws-flow.png`, animations: 'disabled' });
  await open(page, '?rel=CR01');
  await expect(panel(page)).toContainText('공통점');
  await page.screenshot({ path: `${reportDir}/1280-routing-comparison.png`, animations: 'disabled' });
});
