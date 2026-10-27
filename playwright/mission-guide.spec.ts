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
  await page.locator('[data-material="guide"] a').click();
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
    await expect(page.getByRole('heading',{level:1}).first()).toBeVisible();
    await expect(page.locator('body')).not.toContainText('존재하지 않는');
  }
});

for (const width of [390, 1280]) {
  for (const colorScheme of ['light', 'dark'] as const) {
    test(`${width}px ${colorScheme}: guide uses shared themes and preserves selection`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme });
      const palettes = new Set<string>();
      const tokens = ['--surface-page', '--surface-soft', '--surface-selected', '--text-primary', '--text-secondary', '--heading-color', '--accent-primary'];
      const palette = () => page.evaluate(keys => {
        const style = getComputedStyle(document.documentElement);
        return keys.map(key => style.getPropertyValue(key).trim());
      }, tokens);
      for (const theme of ['forest', 'indigo', 'paper', 'signal']) {
        // Capture the shared palette outside the guide so a guide-only override cannot pass.
        await page.goto('/#/terms/html');
        await page.getByLabel('화면 테마').selectOption(theme);
        const expected = await palette();
        palettes.add(JSON.stringify(expected));
        await page.goto(`${route}/${chapters[3].replace('.md', '')}`);
        await expect(page.locator('.guide-prose h1')).toBeVisible();
        await page.getByLabel('화면 테마').selectOption(theme === 'forest' ? 'signal' : 'forest');
        expect(await palette()).not.toEqual(expected);
        await page.getByLabel('화면 테마').selectOption(theme);
        expect(await palette()).toEqual(expected);
        const pairs = [
          ['body', 'backgroundColor', '--surface-page'],
          ['.guide-prose', 'color', '--text-primary'],
          ['.guide-prose h1', 'color', '--heading-color'],
          ['.guide-toolbar a', 'color', '--accent-primary'],
          ['.guide-headings', 'backgroundColor', '--surface-soft'],
          ['.guide-sidebar [aria-current=page]', 'backgroundColor', '--surface-selected'],
          ['.guide-prose pre', 'backgroundColor', '--surface-soft'],
          ['.guide-prose code', 'color', '--text-primary'],
          ['.guide-table th', 'backgroundColor', '--surface-soft'],
          ['.guide-prose blockquote', 'backgroundColor', '--surface-soft'],
        ];
        for (const [selector, property, token] of pairs) {
          const element = page.locator(selector).first();
          await expect(element).toBeAttached();
          expect(await element.evaluate((node, { property, token }) => {
            const probe = document.createElement('span');
            probe.style.color = `var(${token})`;
            node.appendChild(probe);
            const expectedColor = getComputedStyle(probe).color;
            probe.remove();
            return (getComputedStyle(node) as unknown as Record<string, string>)[property] === expectedColor;
          }, { property, token })).toBe(true);
        }
        await page.evaluate(() => document.fonts.ready);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        const contrastRatios = await page.evaluate(() => {
          const luminance = (color: string) => {
            const [r, g, b] = color.match(/[\d.]+/g)!.slice(0, 3).map(Number).map(value => {
              const c = value / 255;
              return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
            });
            return r * 0.2126 + g * 0.7152 + b * 0.0722;
          };
          return ['.guide-prose', '.guide-prose h1', '.guide-toolbar a', '.guide-prose pre code', '.guide-table th', '.guide-prose blockquote'].map(selector => {
            const node = document.querySelector(selector)!;
            let background: Element | null = node;
            while (background && getComputedStyle(background).backgroundColor === 'rgba(0, 0, 0, 0)') background = background.parentElement;
            const foreground = luminance(getComputedStyle(node).color);
            const surface = luminance(getComputedStyle(background!).backgroundColor);
            return { selector, ratio: (Math.max(foreground, surface) + 0.05) / (Math.min(foreground, surface) + 0.05) };
          });
        });
        for (const { selector, ratio } of contrastRatios) expect(ratio, selector).toBeGreaterThanOrEqual(4.5);
        await page.screenshot({ path: testInfo.outputPath(`${theme}-top.png`) });
        await page.locator('.guide-prose pre').first().scrollIntoViewIfNeeded();
        await page.screenshot({ path: testInfo.outputPath(`${theme}-code.png`) });
        await page.getByLabel('화면 테마').selectOption(theme);
        await page.locator('.guide-pagination a').filter({ hasText: '다음 단원' }).click();
        await expect(page.locator('.guide-prose h1')).toContainText('Chapter 5');
        await page.reload();
        await expect(page.getByLabel('화면 테마')).toHaveValue(theme);
        expect(await palette()).toEqual(expected);
        await page.emulateMedia({ colorScheme: colorScheme === 'dark' ? 'light' : 'dark' });
        expect(await palette()).toEqual(expected);
        await page.emulateMedia({ colorScheme });
        for (const path of ['/terms/html', '/maps/frontend?mission=main-m01']) {
          await page.goto(`/#${path}`);
          await expect(page.getByRole('heading',{level:1}).first()).toBeVisible();
          await expect(page.getByLabel('화면 테마')).toHaveValue(theme);
          expect(await palette()).toEqual(expected);
        }
      }
      expect(palettes.size).toBe(4);
    });
  }
}
