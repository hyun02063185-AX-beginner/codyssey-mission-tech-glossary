import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

const route = '/#/missions/main-M05/story-map/concepts';
const dir = 'reports/b3-1-learning-palette';
async function choose(page: Page, id: string, label: string) {
  await page.getByRole('button', { name: '탐색 도구 펼치기', exact: true }).click();
  await page.getByRole('searchbox').fill(label);
  await page.locator('.cm-search-results').getByRole('button', { name: new RegExp(`^${label}`) }).click();
  await expect(page.locator(`[data-map-node="${id}"]`)).toHaveClass(/is-selected/);
}
async function measure(page: Page) {
  return page.locator('.mission-concept-map').evaluate(map => {
    const rgb = (value: string) => value.match(/[\d.]+/g)!.slice(0, 3).map(Number);
    const mix = (a: number[], b: number[], opacity: number) => a.map((v, i) => v * opacity + b[i] * (1 - opacity));
    const luminance = (color: number[]) => color.map(v => {
      v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4;
    }).reduce((sum, value, i) => sum + value * [.2126, .7152, .0722][i], 0);
    const contrast = (a: number[], b: number[]) => (Math.max(luminance(a), luminance(b)) + .05) / (Math.min(luminance(a), luminance(b)) + .05);
    const color = (selector: string, property: 'fill' | 'stroke' | 'color' | 'backgroundColor') => {
      const element = map.querySelector(selector);
      return element ? getComputedStyle(element)[property] : null;
    };
    const regions = [...map.querySelectorAll<SVGRectElement>('.map-region rect')].map(rect => ({
      x: rect.x.baseVal.value, y: rect.y.baseVal.value, width: rect.width.baseVal.value, height: rect.height.baseVal.value,
      fill: getComputedStyle(rect).fill,
    }));
    const canvas = color('.map-canvas-shell', 'backgroundColor')!;
    let text = Infinity, border = Infinity, edge = Infinity, prose = Infinity;
    for (const title of map.querySelectorAll('.map-region text')) {
      text = Math.min(text, contrast(rgb(getComputedStyle(title).fill), rgb(getComputedStyle(title.parentElement!.querySelector('rect')!).fill)));
    }
    for (const node of map.querySelectorAll<SVGGElement>('[data-map-node]')) {
      const opacity = Number(getComputedStyle(node).opacity);
      if (opacity < .9) continue; // Intentional dimming is separately tested on hover/focus.
      const matrix = node.transform.baseVal.consolidate()!.matrix;
      const region = regions.find(r => matrix.e >= r.x && matrix.e < r.x + r.width && matrix.f >= r.y && matrix.f < r.y + r.height)!;
      const background = rgb(region.fill), rect = node.querySelector('rect')!;
      const fill = rgb(getComputedStyle(rect).fill);
      for (const label of node.querySelectorAll('text')) text = Math.min(text,
        contrast(mix(rgb(getComputedStyle(label).fill), background, opacity), mix(fill, background, opacity)));
      if (node.classList.contains('is-selected')) {
        const stroke = rgb(getComputedStyle(rect).stroke);
        border = Math.min(contrast(stroke, fill), ...regions.map(r => contrast(stroke, rgb(r.fill))));
      }
    }
    let markersMatch = true;
    for (const path of map.querySelectorAll<SVGPathElement>('.map-edge.is-visible')) {
      const stroke = getComputedStyle(path).stroke;
      for (const attribute of ['marker-start', 'marker-end']) {
        const id = path.getAttribute(attribute)?.match(/#([^)]*)/)?.[1];
        if (id && getComputedStyle(document.getElementById(id)!.querySelector('path')!).fill !== stroke) markersMatch = false;
      }
      if (path.classList.contains('is-highlighted')) edge = Math.min(edge, ...regions.map(r => contrast(rgb(stroke), rgb(r.fill))));
    }
    const body = map.querySelector('.cm-detail-body');
    if (body) for (const element of body.querySelectorAll('h2, .map-detail-summary')) {
      prose = Math.min(prose, contrast(rgb(getComputedStyle(element).color), rgb(getComputedStyle(body).backgroundColor)));
    }
    const active = map.querySelector('.cm-views .is-active')!;
    const button = contrast(rgb(getComputedStyle(active).color), rgb(getComputedStyle(active).backgroundColor));
    const probe = document.createElement('span'); probe.style.color = 'var(--map-selection-border)'; map.append(probe);
    const themeBorder = getComputedStyle(probe).color; probe.remove();
    const geometry = JSON.stringify({ nodes: [...map.querySelectorAll('[data-map-node]')].map(n => [n.getAttribute('data-map-node'), n.getAttribute('transform')]),
      edges: [...map.querySelectorAll('.cm-edge-group')].map(e => [e.getAttribute('data-relation'), e.getAttribute('data-step'), e.querySelector('.map-edge')!.getAttribute('d')]) });
    return { palette: { canvas, regions: regions.map(r => r.fill), selectedFill: color('.map-node.is-selected rect', 'fill'),
      selectedText: color('.map-node.is-selected .map-node-label', 'fill'), selectedBorder: color('.map-node.is-selected rect', 'stroke'),
      themeBorder, panel: color('.cm-detail-body', 'backgroundColor') },
      canvasLuminance: luminance(rgb(canvas)), text, border: Number.isFinite(border) ? border : null,
      edge: Number.isFinite(edge) ? edge : null, prose: Number.isFinite(prose) ? prose : null, button,
      markersMatch, geometry, noOverflow: document.documentElement.scrollWidth <= innerWidth };
  });
}

for (const width of [1280, 1000, 390, 360]) for (const theme of ['forest', 'indigo', 'paper', 'signal']) {
  test(`${width}px ${theme}: bright learning palette, AA text and matching arrows in both OS modes`, async ({ page }) => {
    await mkdir(dir, { recursive: true });
    const baseline = new Map<string, Awaited<ReturnType<typeof measure>>>();
    const results = [];
    for (const colorScheme of ['light', 'dark'] as const) {
      await page.goto('about:blank');
      await page.setViewportSize({ width, height: width > 700 ? 900 : 844 });
      await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
      await page.goto(route);
      await page.getByLabel('화면 테마').selectOption(theme);
      await expect(page.locator('html')).toHaveAttribute('data-accent-theme', theme);
      await page.evaluate(() => document.fonts.ready);
      async function audit(state: string) {
        const sample = await measure(page);
        expect(sample.canvasLuminance).toBeGreaterThan(.95);
        expect(sample.text, `${state} text`).toBeGreaterThanOrEqual(4.5);
        expect(sample.button).toBeGreaterThanOrEqual(4.5);
        if (sample.border !== null) {
          expect(sample.border, `${state} border`).toBeGreaterThanOrEqual(3);
          expect(sample.palette.selectedBorder).toBe(sample.palette.themeBorder);
          await expect(page.locator('.map-node.is-selected .map-node-marker')).toContainText('선택');
        }
        if (sample.edge !== null) expect(sample.edge, `${state} edge`).toBeGreaterThanOrEqual(3);
        if (sample.prose !== null) expect(sample.prose).toBeGreaterThanOrEqual(4.5);
        expect(sample.markersMatch, `${state} arrow colour`).toBe(true);
        expect(sample.noOverflow).toBe(true);
        if (colorScheme === 'light') baseline.set(state, sample);
        else {
          expect(sample.palette).toEqual(baseline.get(state)!.palette);
          expect(sample.geometry).toBe(baseline.get(state)!.geometry);
        }
        const { geometry, ...summary } = sample;
        results.push({ colorScheme, state, ...summary });
        if (width === 1280 && colorScheme === 'light' && ['router', 'dmz', 'cross', 'subnet'].includes(state)) {
          await page.mouse.move(0, 0);
          await page.screenshot({ path: `${dir}/${width}-${theme}-${colorScheme}-after-${state}.png`, animations: 'disabled' });
        }
      }
      await audit('entry');
      await page.getByRole('button', { name: '지도 크게 보기', exact: true }).click();
      await page.getByRole('button', { name: '전체 보기', exact: true }).click();
      await audit('overview');
      for (const [id, label, state] of [['gen:border-router', '경계 라우터', 'router'], ['gen:firewall', '방화벽', 'firewall'], ['gen:dmz', 'DMZ', 'dmz']]) {
        await choose(page, id, label); await audit(state);
      }
      await page.goto(`${route}?rel=CR01`);
      await expect(page.locator('[data-relation="CR01"].is-highlighted')).toBeVisible();
      await audit('cross');
      await page.getByRole('button', { name: 'AWS 네트워크', exact: true }).click();
      await choose(page, 'aws:subnet', 'Public Subnet'); await audit('subnet');
      await page.getByRole('button', { name: '전체 관계', exact: true }).click();
      for (const [index, state] of ['request', 'response'].entries()) {
        await page.getByRole('button', { name: '탐색 도구 펼치기', exact: true }).click();
        await page.locator('.map-route-chips button').nth(index).click();
        await audit(state);
        if (width === 1280 && theme === 'forest' && colorScheme === 'light') {
          await page.screenshot({ path: `${dir}/1280-forest-light-after-${state}.png`, animations: 'disabled' });
        }
      }
    }
    await mkdir(dir, { recursive: true });
    await writeFile(`${dir}/contrast-${width}-${theme}.json`, JSON.stringify(results, null, 2) + '\n');
  });
}

test('live theme and OS switches preserve the learning surfaces, selection and world geometry', async ({ page }) => {
  await mkdir(dir, { recursive: true });
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'light' });
  await page.goto(`${route}?node=gen:firewall`);
  await expect(page.locator('.map-node.is-selected')).toBeVisible();
  const initial = await measure(page), borders = new Set<string>(), results = [];
  for (const theme of ['forest', 'indigo', 'paper', 'signal']) {
    await page.getByLabel('화면 테마').selectOption(theme);
    const modes = [];
    for (const colorScheme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme });
      const current = await measure(page);
      expect(current.palette.selectedBorder).toBe(current.palette.themeBorder);
      expect(current.palette.selectedFill).toBe(initial.palette.selectedFill);
      expect(current.palette.canvas).toBe(initial.palette.canvas);
      expect(current.geometry).toBe(initial.geometry);
      expect(current.markersMatch).toBe(true);
      modes.push(current.palette);
    }
    expect(modes[0]).toEqual(modes[1]);
    borders.add(modes[0].selectedBorder!);
    results.push({ theme, palette: modes[0], unchangedWorldGeometry: true, sameOsPalette: true });
  }
  expect(borders.size).toBe(4);
  await writeFile(`${dir}/theme-switch.json`, JSON.stringify(results, null, 2) + '\n');
});
