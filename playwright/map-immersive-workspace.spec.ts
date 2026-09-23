import { expect, test } from '@playwright/test';

// V1.1 · 실제 사용에서 확인된 세 가지 문제에 대한 회귀 방지다.
//   UE-01 지도를 끌면 노드 글자가 선택된다
//   UE-02 지도가 일반 페이지 폭에 갇혀 모니터를 못 쓴다
//   UE-03 전체를 보는 것과 글자를 읽는 것이 같은 배율에서 싸운다

const MAP = '/#/maps/frontend?mission=main-m01';

function scale(page: import('@playwright/test').Page) {
  return page.locator('.map-canvas').evaluate(node => {
    const svg = node as unknown as SVGSVGElement;
    return svg.getBoundingClientRect().width / Number(svg.getAttribute('viewBox')!.split(' ')[2]);
  });
}

test('UE-01 — 지도를 끌어도 글자가 선택되지 않는다', async ({ page }) => {
  await page.goto(MAP);
  const canvas = page.locator('.map-canvas');
  await expect(canvas).toBeVisible();
  await expect(canvas).toHaveCSS('user-select', 'none');
  const box = (await canvas.boundingBox())!;
  await page.mouse.move(box.x + 30, box.y + box.height - 30);
  await page.mouse.down();
  for (const [dx, dy] of [[90, -40], [180, -90], [260, -30]]) {
    await page.mouse.move(box.x + 30 + dx, box.y + box.height - 30 + dy);
  }
  await page.mouse.up();
  expect(await page.evaluate(() => window.getSelection()?.toString() ?? '')).toBe('');
});

test('UE-01 — 설명 패널의 문장은 그대로 복사할 수 있다', async ({ page }) => {
  await page.goto(MAP);
  await page.getByRole('button', { name: '전체 보기' }).click();
  await page.locator('[data-map-node]').first().click();
  const summary = page.locator('.map-detail-panel .map-detail-summary');
  await expect(summary).toBeVisible();
  await expect(summary).toHaveCSS('user-select', 'text');
});

test('UE-02 — 지도가 페이지 폭이 아니라 화면을 쓴다', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.goto(MAP);
  const canvas = page.locator('.map-canvas');
  await expect(canvas).toBeVisible();
  const measured = await page.evaluate(() => {
    const svg = document.querySelector('.map-canvas')!.getBoundingClientRect();
    return { width: svg.width, bottom: svg.bottom, viewportWidth: document.documentElement.clientWidth, viewportHeight: document.documentElement.clientHeight };
  });
  // 예전에는 1280px 로 잘렸다. 이제는 화면 폭을 따라간다.
  expect(measured.width).toBeGreaterThan(1400);
  // 지도를 보려고 스크롤할 필요가 없어야 한다.
  expect(measured.bottom).toBeLessThanOrEqual(measured.viewportHeight + 1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});

test('UE-03 — 읽기 크기와 전체 보기는 서로 다른 배율이다', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.goto(MAP);
  await expect(page.locator('.map-canvas')).toBeVisible();
  const reading = await scale(page);
  // 읽기 크기에서 노드 label(10px)이 화면에서 12px 이상으로 그려져야 한다.
  expect(reading * 10).toBeGreaterThanOrEqual(12);

  await page.getByRole('button', { name: '전체 보기' }).click();
  const fit = await scale(page);
  expect(fit).toBeLessThan(reading);
  // 전체 보기의 목적은 구조를 다 보는 것이다 — 노드가 하나도 밖으로 나가면 안 된다.
  expect(await page.evaluate(() => {
    const canvas = document.querySelector('.map-canvas')!.getBoundingClientRect();
    return [...document.querySelectorAll('.map-node')].every(node => {
      const rect = node.getBoundingClientRect();
      return rect.top >= canvas.top - 1 && rect.bottom <= canvas.bottom + 1 && rect.left >= canvas.left - 1 && rect.right <= canvas.right + 1;
    });
  })).toBe(true);

  await page.getByRole('button', { name: '읽기 크기' }).click();
  expect(await scale(page)).toBeCloseTo(reading, 2);
});

test('상세 패널이 열려도 지도가 줄어들지 않는다', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.goto(MAP);
  const canvas = page.locator('.map-canvas');
  await expect(canvas).toBeVisible();
  const before = (await canvas.boundingBox())!;
  await page.getByRole('button', { name: '전체 보기' }).click();
  await page.locator('[data-map-node]').first().click();
  await expect(page.locator('[data-detail-panel="open"]')).toBeVisible();
  const after = (await canvas.boundingBox())!;
  expect(after.width).toBeCloseTo(before.width, 0);
  expect(after.height).toBeCloseTo(before.height, 0);
});

test('deep link 한 노드가 화면 안에 들어온다', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.goto('/#/maps/frontend?mission=main-m01&term=local-storage');
  await expect(page.locator('[data-detail-panel="open"]')).toBeVisible();
  expect(await page.evaluate(() => {
    const canvas = document.querySelector('.map-canvas')!.getBoundingClientRect();
    const node = document.querySelector('.map-node.is-selected')!.getBoundingClientRect();
    return node.top >= canvas.top && node.bottom <= canvas.bottom && node.left >= canvas.left && node.right <= canvas.right;
  })).toBe(true);
});

test('몰입 layout 이 지도 밖의 화면을 바꾸지 않는다', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 });
  for (const route of ['/#/', '/#/terms', '/#/encyclopedia', '/#/academic/operating-systems']) {
    await page.goto(route);
    const main = await page.evaluate(() => {
      const element = document.querySelector('main')!;
      return { maxWidth: getComputedStyle(element).maxWidth, overflow: getComputedStyle(document.getElementById('root')!).overflow };
    });
    expect(main.maxWidth, route).toBe('980px');
    expect(main.overflow, route).toBe('visible');
  }
});

test('좁은 화면은 기존 지도 동작을 유지한다', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(MAP);
  await expect(page.locator('.map-canvas')).toBeVisible();
  const mobile = await page.evaluate(() => ({
    mainMaxWidth: getComputedStyle(document.querySelector('main')!).maxWidth,
    rootOverflow: getComputedStyle(document.getElementById('root')!).overflow,
    viewBox: document.querySelector('.map-canvas')!.getAttribute('viewBox'),
    noOverflow: document.documentElement.scrollWidth <= document.documentElement.clientWidth,
  }));
  expect(mobile.mainMaxWidth).toBe('980px');
  expect(mobile.rootOverflow).toBe('visible');
  expect(mobile.viewBox).toBe('0 0 1280 900');
  expect(mobile.noOverflow).toBe(true);
});
