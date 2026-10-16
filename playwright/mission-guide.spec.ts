import { test, expect } from '@playwright/test';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const directory = 'content/mission-guides/main-m01/chapters';
const chapters = readdirSync(directory).filter(file => file.endsWith('.md')).sort();
const route = '/#/missions/main-M01/guide';

test('all nine original documents, images, code and navigation survive rendering', async ({ page }) => {
  for (let index = 0; index < chapters.length; index++) {
    const file = chapters[index];
    const source = readFileSync(join(directory, file), 'utf8').replace(/\r\n/g, '\n');
    await page.goto(`${route}/${file.replace('.md', '')}`);
    await expect(page.locator('.guide-prose h1')).toHaveText(source.match(/^# (.+)/)![1]);
    // Approved chapters also contain fenced code nested inside blockquotes.
    const codes = [...source.replace(/^> ?/gm, '').matchAll(/^```[^\n]*\n([\s\S]*?)^```/gm)].map(match => match[1]);
    expect((await page.locator('.guide-prose pre code').allTextContents()).map(code => code.replace(/\r\n/g, '\n'))).toEqual(codes);
    for (const image of await page.locator('.guide-prose img').all()) {
      await expect(image).toHaveJSProperty('complete', true);
      expect(await image.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
    }
    await expect(page.locator('.guide-sidebar [aria-current="page"]')).toHaveCount(1);
    if (index < 8) await expect(page.locator('.guide-pagination a').filter({ hasText: '다음 단원' })).toHaveAttribute('href', `#${route.slice(2)}/${chapters[index + 1].replace('.md', '')}`);
    await page.reload();
    await expect(page.locator('.guide-prose h1')).toBeVisible();
  }
});

for (const width of [360, 390, 768, 1024, 1280]) {
  for (const colorScheme of ['light', 'dark'] as const) {
    test(`${width}px ${colorScheme}: text, code and SVG fit`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme });
      for (const index of [0, 3, 8]) {
        await page.goto(`${route}/${chapters[index].replace('.md', '')}`);
        await expect(page.locator('.guide-prose h1')).toBeVisible();
        await page.evaluate(() => document.fonts.ready);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        if (index === 8) expect(await page.locator('.guide-prose img').first().evaluate((img: HTMLImageElement) => img.currentSrc.includes('wide'))).toBe(width >= 1024);
        await page.screenshot({ path: testInfo.outputPath(`chapter-${index + 1}-top.png`) });
        await page.locator('.guide-prose img').first().scrollIntoViewIfNeeded();
        await page.screenshot({ path: testInfo.outputPath(`chapter-${index + 1}-figure.png`) });
        if (index === 3) {
          await page.locator('.guide-prose pre').first().scrollIntoViewIfNeeded();
          await expect(page.locator('.guide-prose pre').first()).toHaveCSS('white-space', 'pre');
          await page.screenshot({ path: testInfo.outputPath('chapter-4-code.png') });
        }
      }
    });
  }
}

test('mission entry, anchors, terms, previous/next and existing routes', async ({ page }) => {
  await page.goto('/#/missions/main-M01');
  await page.getByRole('link', { name: '학습 가이드 읽기 →' }).click();
  await expect(page.locator('.guide-index nav li')).toHaveCount(9);
  await page.locator('.guide-index nav a').first().click();
  await page.locator('.guide-prose a').filter({ hasText: 'README' }).click();
  await expect(page.locator('[id="표기-규칙"]')).toBeInViewport();
  await page.goBack();
  await page.locator('.guide-prose a[href="#/terms/html"]').click();
  await expect(page.locator('main h1')).toContainText('HTML');
  await page.goBack();
  await page.locator('.guide-pagination a').filter({ hasText: '다음 단원' }).click();
  await expect(page.locator('.guide-prose h1')).toContainText('Chapter 2');
  await page.locator('.guide-pagination a').filter({ hasText: '이전 단원' }).click();
  await expect(page.locator('.guide-prose h1')).toContainText('Chapter 1');
  for (const path of ['/missions/main-M03/story', '/missions/main-M02', '/maps', '/terms']) {
    await page.goto(`/#${path}`);
    await expect(page.locator('main h1').first()).toBeVisible();
    await expect(page.locator('main')).not.toContainText('존재하지 않는');
  }
});
