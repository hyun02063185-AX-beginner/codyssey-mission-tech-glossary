import { test, expect } from '@playwright/test';
import { readdirSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs';
const root = 'content/mission-guides/main-m03';
const chapters = readdirSync(`${root}/chapters`).sort();
const route = '/#/missions/main-M03/guide';
// Full run evidence is disposable and ignored; curated review files are promoted separately.
const evidence = 'test-results/b2-1-guide';
test.beforeEach(() => { mkdirSync(evidence, { recursive: true }); });
for (const width of [320, 360, 390, 768, 1024, 1280]) {
  test(`${width}: all chapters, SVG readability, navigation and screenshots`, async ({ page }) => {
    const metrics = [];
    await page.setViewportSize({ width, height: 900 });
    for (const [index, file] of chapters.entries()) {
      await page.goto(`${route}/${file.replace('.md', '')}`);
      const source = readFileSync(`${root}/chapters/${file}`, 'utf8');
      await expect(page.locator('.guide-prose h1')).toHaveText(source.match(/^# (.+)/)![1].replace(/`/g, ''));
      await page.evaluate(() => document.fonts.ready);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      const codes = [...source.replace(/^> ?/gm, '').replace(/\r\n/g, '\n').matchAll(/^```[^\n]*\n([\s\S]*?)^```/gm)].map(m => m[1]);
      expect((await page.locator('.guide-prose pre code').allTextContents()).map(c => c.replace(/\r\n/g, '\n'))).toEqual(codes);
      const img = page.locator('.guide-prose img').first();
      await expect(img).toHaveJSProperty('complete', true);
      expect(await img.evaluate((e: HTMLImageElement) => e.naturalWidth)).toBeGreaterThan(0);
      const bounds = await img.boundingBox();
      const actualFont = bounds!.width / (index === 8 && width >= 1024 ? 1000 : 360) * (index === 8 && width >= 1024 ? 20 : 18);
      expect(actualFont).toBeGreaterThanOrEqual(13);
      metrics.push({ chapter: index + 1, renderedWidth: bounds!.width, minimumFontPx: actualFont });
      if (index === 8) expect(await img.evaluate((e: HTMLImageElement) => e.currentSrc.includes('wide'))).toBe(width >= 1024);
      const original = page.locator('.guide-figure-actions a').first();
      const response = await page.request.get((await original.getAttribute('href'))!);
      expect(response.ok()).toBe(true);
      expect(await response.text()).toContain('<svg');
      if (index < 8) await expect(page.locator('.guide-pagination a').filter({ hasText: '다음 단원' })).toHaveAttribute('href', `#/missions/main-M03/guide/${chapters[index + 1].replace('.md', '')}`);
      await page.screenshot({ path: `${evidence}/${width}-chapter-${index + 1}.png`, fullPage: true });
      if (index === 0 || index === 8) await page.screenshot({ path: `${evidence}/${width}-chapter-${index + 1}-top.png` });
      await img.screenshot({ path: `${evidence}/${width}-v${index + 1}.png` });
    }
    writeFileSync(`${evidence}/${width}-metrics.json`, JSON.stringify(metrics, null, 2));
  });
}
test('SVG text unchanged, within boxes, no overlapping text', async ({ page }) => {
  for (const variant of ['mobile', 'desktop']) for (const file of readdirSync(`${root}/assets/${variant}`)) {
    const original = readFileSync(`${root}/assets/${file}`, 'utf8');
    const mobile = readFileSync(`${root}/assets/${variant}/${file}`, 'utf8');
    await page.setContent(original);
    const texts = await page.locator('text').allTextContents();
    await page.setContent(mobile);
    await page.evaluate(() => document.fonts.ready);
    expect(await page.locator('text').allTextContents()).toEqual(texts);
    const issues = await page.evaluate(() => {
      const svg = document.querySelector('svg')!;
      const rects = [...svg.children].filter(e => e.tagName === 'rect') as SVGRectElement[];
      const texts = [...svg.querySelectorAll('text')];
      const issues: string[] = [];
      for (const t of texts) {
        const b = t.getBBox();
        const x = +t.getAttribute('x')!, y = +t.getAttribute('y')!;
        const r = rects.filter(r => { const b = r.getBBox(); return x >= b.x && x <= b.x+b.width && y >= b.y && y <= b.y+b.height; }).at(-1)!.getBBox();
        if (b.x < r.x || b.x+b.width > r.x+r.width || b.y < r.y || b.y+b.height > r.y+r.height) issues.push(`outside box: ${t.textContent}`);
      }
      for (let i=0;i<texts.length;i++) for(let j=i+1;j<texts.length;j++) {
        const a=texts[i].getBBox(),b=texts[j].getBBox();
        if(a.x<b.x+b.width && a.x+a.width>b.x && a.y<b.y+b.height && a.y+a.height>b.y) issues.push(`overlap: ${texts[i].textContent} / ${texts[j].textContent}`);
      }
      return issues;
    });
    expect(issues, file).toEqual([]);
  }
});
test('entry, mobile navigation, related terms, documents and four persistent themes', async ({ page }) => {
  await page.setViewportSize({width:360,height:900});
  await page.goto('/#/missions/main-M03');
  await page.locator('[data-material="guide"] a').click();
  await expect(page.locator('.guide-index nav li')).toHaveCount(9);
  await page.locator('.guide-index nav a').first().click();
  const popupPromise = page.waitForEvent('popup');
  await page.locator('.guide-figure > a').first().click();
  const popup = await popupPromise;
  await popup.waitForLoadState();
  await expect(popup.locator('svg')).toBeVisible();
  await popup.close();
  await page.locator('.guide-mobile-nav summary').click();
  await page.locator('.guide-mobile-nav nav a').nth(7).click();
  await expect(page.locator('.guide-prose h1')).toContainText('Chapter 08');
  await page.locator('.guide-related a').first().click();
  await expect(page.locator('main')).not.toContainText('존재하지 않는');
  for (const width of [360,1280]) for (const theme of ['forest','indigo','paper','signal']) {
    await page.setViewportSize({width,height:900});
    await page.goto(`${route}/${chapters[0].replace('.md','')}`);
    await page.getByLabel('화면 테마').selectOption(theme);
    await page.locator('.guide-pagination a').filter({hasText:'다음 단원'}).click();
    await page.reload();
    await expect(page.locator('.guide-prose h1')).toContainText('Chapter 02');
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByLabel('화면 테마')).toHaveValue(theme);
    await page.screenshot({path:`${evidence}/${width}-theme-${theme}.png`});
  }
  for (const document of ['README','scenario','instructor']) {
    await page.goto(`${route}?document=${document}`);
    await expect(page.locator('.guide-prose h1')).toBeVisible();
  }
  for (const path of ['/missions','/terms','/missions/main-M01/guide']) {
    await page.goto(`/#${path}`); await expect(page.locator('main h1').first()).toBeVisible();
  }
});
