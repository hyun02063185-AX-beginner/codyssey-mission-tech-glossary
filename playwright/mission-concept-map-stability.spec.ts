import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

async function tools(page: Page) {
  if (await page.locator('#cm-explore-tools').isHidden()) await page.getByRole('button', { name: '탐색 도구 펼치기', exact: true }).click();
}
async function choose(page: Page, id: string, label: string) {
  await tools(page);
  await page.getByRole('searchbox').fill(label);
  await page.locator('.cm-search-results').getByRole('button', { name: new RegExp(`^${label}`) }).click();
  await expect(page.locator(`[data-map-node="${id}"]`)).toHaveClass(/is-selected/);
  await expect.poll(() => page.evaluate(() => {
    const node = document.querySelector('.map-node.is-selected')!.getBoundingClientRect();
    const shell = document.querySelector('.map-canvas-shell')!.getBoundingClientRect();
    const panel = document.querySelector('.map-detail-panel')!.getBoundingClientRect();
    return node.left >= shell.left && node.right <= shell.right && node.top >= shell.top && node.bottom <= shell.bottom &&
      (node.right <= panel.left || node.left >= panel.right || node.bottom <= panel.top || node.top >= panel.bottom);
  })).toBe(true);
}
async function contrast(page: Page, selector: string) {
  return page.locator(selector).evaluate(node => {
    const luminance = (color: string) => {
      const rgb = color.match(/[\d.]+/g)!.slice(0, 3).map(Number).map(v => {
        v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4;
      });
      return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
    };
    const a = luminance(getComputedStyle(node.querySelector('.map-node-label')!).fill);
    const b = luminance(getComputedStyle(node.querySelector('rect')!).fill);
    return (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
  });
}

for (const width of [1280, 1000, 390, 360]) for (const colorScheme of ['light', 'dark'] as const) {
  test(`${width}px ${colorScheme}: fixed world coordinates/routes and accessible selection emphasis`, async ({ page }) => {
    await page.setViewportSize({ width, height: width > 700 ? 900 : 844 });
    await page.emulateMedia({ colorScheme });
    await page.goto('/#/missions/main-M05/story-map/concepts');
    await expect(page.locator('[data-map-node]')).toHaveCount(23);
    const seen = new Map<string, { nodes: Map<string, { x: number; y: number }>; routes: Map<string, string> }>();
    const states: string[] = [];
    let nodeChecks = 0, routeChecks = 0;
    async function audit(view: string, state: string) {
      const sample = await page.evaluate(() => ({
        nodes: [...document.querySelectorAll<SVGGElement>('[data-map-node]')].map(node => {
          const matrix = node.transform.baseVal.consolidate()!.matrix;
          return { id: node.dataset.mapNode!, x: matrix.e, y: matrix.f };
        }),
        routes: [...document.querySelectorAll<SVGGElement>('.cm-edge-group')].map(edge => ({
          id: `${edge.dataset.relation}:${edge.dataset.step ?? ''}`, path: edge.querySelector('.map-edge')!.getAttribute('d')!,
        })),
      }));
      const baseline = seen.get(view) ?? { nodes: new Map(), routes: new Map() };
      seen.set(view, baseline); states.push(`${view}/${state}`);
      for (const { id, x, y } of sample.nodes) {
        if (baseline.nodes.has(id)) { expect({ x, y }, `${view}/${state}/${id}`).toEqual(baseline.nodes.get(id)); nodeChecks++; }
        else baseline.nodes.set(id, { x, y });
      }
      for (const { id, path } of sample.routes) {
        if (baseline.routes.has(id)) { expect(path, `${view}/${state}/${id}`).toBe(baseline.routes.get(id)); routeChecks++; }
        else baseline.routes.set(id, path);
      }
    }
    await audit('all', 'entry');
    for (const [id, label] of [['gen:border-router', '경계 라우터'], ['gen:firewall', '방화벽'], ['gen:dmz', 'DMZ'], ['gen:public-web-server', '공개 웹 서버'], ['gen:switch', '스위치']]) {
      await choose(page, id, label); await audit('all', id);
      await expect(page.locator('.map-node.is-selected')).toHaveCSS('opacity', '1');
      expect(await contrast(page, '.map-node.is-selected')).toBeGreaterThanOrEqual(4.5);
      if (id === 'gen:dmz') await expect(page.locator('[data-map-node="aws:subnet"].is-contrast')).toHaveCSS('opacity', '0.95');
    }
    await choose(page, 'gen:firewall', '방화벽');
    const faded = page.locator('[data-map-node="com:visitor"]');
    await expect(faded).toHaveCSS('opacity', '0.25');
    expect(await faded.evaluate(node => getComputedStyle(node).pointerEvents)).not.toBe('none');
    await page.getByRole('button', { name: '상세 패널 닫기' }).click();
    await page.getByRole('button', { name: '전체 보기', exact: true }).click();
    await faded.hover(); await expect(faded).toHaveCSS('opacity', '1');
    expect(await contrast(page, '[data-map-node="com:visitor"]')).toBeGreaterThanOrEqual(4.5);
    await page.mouse.move(0, 0); await expect(faded).toHaveCSS('opacity', '0.25');
    await faded.click(); await expect(faded).toHaveClass(/is-selected/);
    await audit('all', 'click-faded');
    const keyboardNode = page.locator('[data-map-node="gen:dmz"]');
    await keyboardNode.focus(); await expect(keyboardNode).toHaveCSS('opacity', '1');
    await page.keyboard.press('Enter'); await expect(keyboardNode).toHaveClass(/is-selected/);
    await audit('all', 'keyboard-faded');
    await choose(page, 'gen:firewall', '방화벽');
    await page.locator('[data-panel-relation="GN14"]').click();
    await expect(page.locator('[data-relation="GN14"] .map-edge')).toHaveCSS('opacity', '1');
    await expect(page.locator('.map-node.is-highlighted').first()).toHaveCSS('opacity', '0.95');
    await expect(page.locator('[data-map-node="com:visitor"]')).toHaveCSS('opacity', '0.25');
    await audit('all', 'relation');
    await tools(page); await page.locator('.map-route-chips button').first().click();
    await expect(page.locator('[data-relation="GF01"].is-highlighted')).toHaveCount(5);
    await audit('all', 'flow');
    await page.locator('.cm-clear').click(); await audit('all', 'clear');
    expect(await page.locator('.map-node').evaluateAll(nodes => nodes.every(n => getComputedStyle(n).opacity === '1'))).toBe(true);
    for (const more of [true, false]) {
      await tools(page);
      await page.getByRole('checkbox', { name: '보충 개념 함께 보기' }).setChecked(more);
      await expect(page.locator('[data-map-node]')).toHaveCount(more ? 36 : 23);
      await audit('all', `more-${more}`);
      await page.getByRole('button', { name: '탐색 도구 닫기', exact: true }).click();
    }
    await page.getByRole('button', { name: '일반 네트워크', exact: true }).click();
    await expect(page.locator('[data-map-node]')).toHaveCount(26); await audit('general', 'entry');
    await choose(page, 'gen:firewall', '방화벽'); await audit('general', 'firewall');
    await choose(page, 'gen:switch', '스위치'); await audit('general', 'switch');
    await page.getByRole('button', { name: 'AWS 네트워크', exact: true }).click();
    await expect(page.locator('[data-map-node]')).toHaveCount(15); await audit('aws', 'entry');
    await tools(page); await page.locator('.map-route-chips button').first().click();
    await expect(page.locator('[data-relation="AF01"].is-highlighted')).toHaveCount(4); await audit('aws', 'flow');
    await page.getByRole('button', { name: '전체 관계', exact: true }).click();
    await audit('all', 'return');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await mkdir('reports/b3-1-stable-layout', { recursive: true });
    await writeFile(`reports/b3-1-stable-layout/stability-${width}-${colorScheme}.json`, JSON.stringify({
      width, colorScheme, states, nodeChecks, routeChecks, maxNodeDelta: 0, changedRoutes: 0,
    }, null, 2) + '\n');
  });
}
