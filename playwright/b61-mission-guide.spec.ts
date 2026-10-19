import { expect, test } from '@playwright/test';

test('B6-1 mission opens ten chapters and keeps diagrams readable across layouts', async ({ page }) => {
  await page.goto('/#/missions/main-M11');
  await page.getByRole('link', { name: '학습 가이드 읽기 →' }).click();
  await expect(page.locator('.guide-index nav li')).toHaveCount(10);
  await page.locator('.guide-index nav a').first().click();
  await expect(page.locator('.guide-prose h1')).toContainText('Chapter 1');
  await page.locator('.guide-pagination a').filter({ hasText: '다음 단원' }).click();
  await expect(page.locator('.guide-prose h1')).toContainText('Chapter 2');
  for (let number = 1; number <= 10; number++) {
    const chapter = `${String(number).padStart(2, '0')}-${['database-basics', 'data-modeling', 'keys-relations', 'data-integrity', 'sql-queries', 'sql-joins', 'group-aggregation', 'subquery-index', 'update-delete', 'database-overview'][number - 1]}`;
    await page.goto(`/#/missions/main-M11/guide/${chapter}`);
    await expect(page.locator('.guide-prose h1')).toContainText(`Chapter ${number}`);
    for (const image of await page.locator('.guide-prose img').all()) {
      await expect(image).toHaveJSProperty('complete', true);
      expect(await image.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
    }
  }
  await page.goto('/#/missions/main-M11/guide/10-database-overview');
  await page.setViewportSize({ width: 390, height: 900 });
  await expect(page.locator('.guide-prose h1')).toContainText('Chapter 10');
  await expect(page.locator('.guide-prose img')).toHaveCount(1);
  await expect(page.locator('.guide-prose img').first()).toHaveJSProperty('complete', true);
  expect(await page.locator('.guide-prose img').first().evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
  expect(await page.locator('.guide-prose img').first().evaluate((img: HTMLImageElement) => img.currentSrc.includes('wide'))).toBe(false);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.locator('.guide-prose img').first().screenshot({ path: '../b61-mobile-figure.png' });
  await page.setViewportSize({ width: 1024, height: 900 });
  expect(await page.locator('.guide-prose img').first().evaluate((img: HTMLImageElement) => img.currentSrc.includes('wide'))).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.locator('.guide-prose img').first().screenshot({ path: '../b61-desktop-figure.png' });
});
