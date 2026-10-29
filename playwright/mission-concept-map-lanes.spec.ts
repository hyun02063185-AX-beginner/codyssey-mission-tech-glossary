import { expect, test } from '@playwright/test';

for (const width of [1280, 1000, 390, 360]) test(`${width}px detail header stays separate during body scroll and selection changes`, async ({ page }) => {
  await page.setViewportSize({ width, height: width > 700 ? 900 : 844 });
  await page.goto('/#/missions/main-M05/story-map/concepts?node=gen:firewall');
  const panel = page.locator('.map-detail-panel'), header = panel.locator('.map-detail-panel-header');
  const body = panel.locator('.cm-detail-body');
  await expect(body).toBeVisible();
  // Inspect the actual rounded SVG paths, including corners between the tested
  // orthogonal segments. Screen visibility is deliberately irrelevant here.
  expect(await page.locator('.map-canvas').evaluate(svg => {
    const cards = [...svg.querySelectorAll<SVGGElement>('[data-map-node]')].map(node => {
      const matrix = node.transform.baseVal.consolidate()!.matrix, rect = node.querySelector('rect')!;
      return { x: matrix.e, y: matrix.f, width: rect.width.baseVal.value, height: rect.height.baseVal.value };
    });
    for (const path of svg.querySelectorAll<SVGPathElement>('.map-edge.is-visible')) {
      const length = path.getTotalLength();
      for (let distance = 0; distance <= length; distance += 4) {
        const p = path.getPointAtLength(distance);
        if (cards.some(c => p.x > c.x - 2 && p.x < c.x + c.width + 2 && p.y > c.y - 2 && p.y < c.y + c.height + 2)) return false;
      }
    }
    return true;
  })).toBe(true);
  await panel.scrollIntoViewIfNeeded();
  const before = (await header.boundingBox())!;
  await body.focus();
  await page.keyboard.press('End');
  await expect.poll(() => body.evaluate(element => element.scrollTop)).toBeGreaterThan(100);
  const after = (await header.boundingBox())!, bodyBox = (await body.boundingBox())!;
  expect(after.y).toBeCloseTo(before.y, 0);
  expect(bodyBox.y).toBeCloseTo(after.y + after.height, 0);
  expect(await panel.evaluate(element => element.scrollTop)).toBe(0);
  const headerStyle = await header.evaluate(element => {
    const style = getComputedStyle(element), token = style.getPropertyValue('--surface-soft').trim();
    const probe = document.createElement('span');
    probe.style.backgroundColor = 'var(--surface-soft)';
    probe.style.position = 'absolute';
    element.append(probe);
    const expected = getComputedStyle(probe).backgroundColor;
    probe.remove();
    const luminance = (color: string) => color.match(/[\d.]+/g)!.slice(0, 3).map(Number).map(value => {
      value /= 255; return value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4;
    }).reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0);
    const background = style.backgroundColor, color = style.color, a = luminance(background), b = luminance(color);
    return { token, expected, background, color, contrast: (Math.max(a, b) + .05) / (Math.min(a, b) + .05) };
  });
  expect(headerStyle.token).not.toBe('');
  await expect(header).toHaveCSS('background-color', headerStyle.expected);
  expect(headerStyle.background).not.toMatch(/^rgba\(/);
  expect(headerStyle.contrast).toBeGreaterThanOrEqual(4.5);
  test.info().annotations.push({ type: 'header-token-contrast', description: JSON.stringify(headerStyle) });
  await expect(panel).toHaveCSS('isolation', 'isolate');
  expect(await header.evaluate(element => {
    const r = element.getBoundingClientRect();
    return element.contains(document.elementFromPoint(r.left + 8, r.bottom - 1));
  })).toBe(true);
  // Selection from within the scrolled body resets that body, preserving the shell.
  await body.locator('[data-panel-relation="GN14"]').click();
  await expect(page).toHaveURL(/rel=GN14/);
  await expect.poll(() => body.evaluate(element => element.scrollTop)).toBe(0);
  await body.getByRole('button', { name: '선택 해제', exact: true }).click();
  await expect(panel).toHaveCount(0);
  await page.getByRole('button', { name: '전체 보기', exact: true }).click();
  await page.locator('[data-map-node="gen:firewall"]').focus();
  await page.keyboard.press('Enter');
  await expect(body).toBeVisible();
  expect(await body.evaluate(element => element.scrollTop)).toBe(0);
  await page.getByRole('button', { name: '상세 패널 닫기' }).click();
  await page.getByRole('button', { name: /설명 다시 열기/ }).click();
  await expect(header).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
