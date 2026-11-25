import { expect, test, type Locator } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = 'content/mission-stories/main-m06';
const manuscript = readFileSync(`${root}/storyboard-v0.2.md`, 'utf8').replace(/\r\n/g, '\n');
const guideHrefs = Object.fromEntries([...manuscript.matchAll(/^\[(g\d+)\]: (https:\/\/\S+)$/gm)]
  .map(([, key, href]) => [key, href]));
const slides = [...manuscript.matchAll(/^### (S(\d)-(\d)) · (.+)\n[\s\S]*?^\*\*화면 해설\*\*\n\n(.+)\n\n\*\*더 읽기\*\* (.+)$/gm)]
  .map(([, id, scene, screen, title, explanation, furtherReading]) => ({
    id, scene, screen, title, explanation: explanation.replace(/`/g, ''),
    guides: [...furtherReading.matchAll(/\[([^\]]+)\]\[(g\d+)\]/g)]
      .map(([, label, key]) => ({ label, href: guideHrefs[key] })),
  }));
const base = '/#/missions/main-M06/story';
const viewports = [
  { width: 1280, height: 720 }, { width: 1000, height: 720 },
  { width: 360, height: 800 }, { width: 390, height: 844 },
];

function slidePosition(art: Locator) {
  return art.evaluate(svg => ({ scrollY: window.scrollY, figure: svg.getBoundingClientRect().toJSON() }));
}

test('shows the v0.2 title, subtitle, goals and four scene links', async ({ page }) => {
  await page.goto(base);
  await expect(page.getByRole('heading', { name: 'B3-2 — Python으로 외부 AI를 활용하는 방법' })).toBeVisible();
  await expect(page.getByText('Git 변경 내용을 설명하는 AI 도우미 만들기', { exact: true })).toBeVisible();
  await page.getByText('학습 목표와 강의 흐름').click();
  await expect(page.locator('.mission-story-orientation > ol > li')).toHaveCount(4);
  await expect(page.locator('.mission-story-orientation > ol > li').first()).toContainText('외부 AI API로 보내는 요청');
  await expect(page.locator('.mission-story-scenes li')).toHaveCount(4);
  await expect(page.getByRole('link', { name: /Python과 외부 AI API의 요청·응답/ })).toHaveAttribute('href', '#/missions/main-M06/story?scene=3&screen=1');
});

for (const viewport of viewports) {
  for (const theme of ['dark', 'light']) {
    test.describe(`${viewport.width}×${viewport.height} ${theme}`, () => {
      const mobile = viewport.width < 900;
      test.use({ viewport, isMobile: mobile, hasTouch: mobile });

      test.beforeEach(async ({ page }) => {
        await page.addInitScript(theme => localStorage.setItem('codyssey-presentation-theme', theme), theme);
      });

      test('keeps the slide in place and scrolls within the fixed explanation', async ({ page }) => {
        await page.goto(`${base}?scene=3&screen=2`);
        await expect(page.locator('.mission-presentation')).toHaveAttribute('data-presentation-theme', theme);
        const panel = page.locator('#b32-slide-explanation');
        const body = panel.getByRole('region', { name: '해설 본문' });
        const close = panel.getByRole('button', { name: '화면 해설 닫기' });
        const toggle = page.getByRole('button', { name: '설명 보기' });
        const art = page.locator('.b32-lesson .b32-figure svg');

        await expect(art).toBeVisible();
        await page.evaluate(() => document.fonts.ready);
        await expect(panel).toBeHidden();

        const initial = await slidePosition(art);
        if (mobile) await toggle.tap();
        else await page.keyboard.press('p');
        await expect(panel).toBeVisible();
        await expect(page.getByRole('button', { name: '설명 닫기' })).toHaveAttribute('aria-expanded', 'true');
        await expect(panel).toHaveCSS('position', 'fixed');
        const maxHeight = await panel.evaluate(element => parseFloat(getComputedStyle(element).maxHeight));
        expect(maxHeight).toBeGreaterThanOrEqual(viewport.height * (mobile ? 0.55 : 0.40));
        expect(maxHeight).toBeLessThanOrEqual(viewport.height * (mobile ? 0.60 : 0.45));
        expect(await slidePosition(art)).toEqual(initial);
        const panelBox = (await panel.boundingBox())!;
        expect(panelBox.y + panelBox.height).toBeCloseTo(viewport.height, 0);

        const out = process.env.B32_V02_QA_OUTPUT;
        const capturePath = out && join(out, `${viewport.width}-${theme}-api-open-viewport.png`);
        if (capturePath && !mobile) await page.screenshot({ path: capturePath });

        if (mobile) await close.tap();
        else await close.click();
        await expect(panel).toBeHidden();
        await expect(toggle).toBeFocused();
        expect(await slidePosition(art)).toEqual(initial);

        // Exercise focus restoration when the explanation toggle is above the viewport.
        await page.evaluate(offset => { document.scrollingElement!.scrollTop = offset; }, mobile ? 230 : 175);
        const scrolled = await slidePosition(art);
        expect(scrolled.scrollY).toBeGreaterThan(0);
        expect(scrolled.scrollY).toBeLessThan(await page.evaluate(() =>
          document.scrollingElement!.scrollHeight - document.scrollingElement!.clientHeight));
        await expect(toggle).not.toBeInViewport();
        await page.keyboard.press('p');
        await expect(panel.getByRole('heading')).toBeFocused();
        expect(await slidePosition(art)).toEqual(scrolled);
        expect(await panel.boundingBox()).toEqual(panelBox);
        expect(Math.max(scrolled.figure.y, 0)).toBeLessThan(panelBox.y);
        expect(scrolled.figure.bottom).toBeGreaterThan(0);
        if (capturePath && mobile) await page.screenshot({ path: capturePath });
        await page.keyboard.press('Shift+P');
        await expect(panel).toBeHidden();
        await expect(toggle).toBeFocused();
        expect(await slidePosition(art)).toEqual(scrolled);

        await page.keyboard.press('p');
        if (mobile) await close.tap();
        else await close.click();
        await expect(panel).toBeHidden();
        expect(await slidePosition(art)).toEqual(scrolled);

        await page.keyboard.press('p');
        await expect(panel).toBeVisible();
        expect(await slidePosition(art)).toEqual(scrolled);
        await expect(body).toHaveCSS('overscroll-behavior-y', 'contain');
        const maxScroll = await body.evaluate(element => {
          const paragraph = element.querySelector('p')!;
          // Repeat an authored paragraph to overflow the panel at every viewport width.
          for (let i = 0; i < 8; i++) paragraph.after(paragraph.cloneNode(true));
          return element.scrollHeight - element.clientHeight;
        });
        expect(maxScroll).toBeGreaterThan(0);
        const scrollBox = (await body.boundingBox())!;
        await page.mouse.move(scrollBox.x + scrollBox.width / 2, scrollBox.y + scrollBox.height / 2);
        await page.mouse.wheel(0, maxScroll + 100);
        await expect(body).toHaveJSProperty('scrollTop', maxScroll);
        expect(await slidePosition(art)).toEqual(scrolled);

        // Wait for a second wheel gesture at the bottom to reach the browser's scroll handler.
        await body.evaluate(element => {
          element.addEventListener('wheel', () => {
            requestAnimationFrame(() => requestAnimationFrame(() => element.setAttribute('data-wheel-complete', 'true')));
          }, { once: true });
        });
        await page.mouse.wheel(0, 350);
        await expect(body).toHaveAttribute('data-wheel-complete', 'true');
        await expect(body).toHaveJSProperty('scrollTop', maxScroll);
        expect(await slidePosition(art)).toEqual(scrolled);
        await expect(close).toBeInViewport({ ratio: 1 });

        await page.keyboard.press('Escape');
        await expect(panel).toBeHidden();
        await expect(toggle).toBeFocused();
        expect(await slidePosition(art)).toEqual(scrolled);
      });

      test('preserves all eight explanations and guide links and closes on navigation', async ({ page }) => {
        test.setTimeout(60000);
        const errors: string[] = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.goto(`${base}?scene=1&screen=1`);
        await expect(page.locator('.mission-presentation')).toHaveAttribute('data-presentation-theme', theme);
        const panel = page.locator('#b32-slide-explanation');
        const body = panel.getByRole('region', { name: '해설 본문' });
        const bottom = page.getByRole('navigation', { name: 'B3-2 강의 조작' });
        const top = page.getByRole('navigation', { name: '슬라이드 상단 탐색' });
        const art = page.locator('.b32-lesson .b32-figure svg');
        const journey = page.locator('.b32-journey svg');
        const heading = page.locator('#b32-message');
        const lesson = page.locator('.b32-lesson');

        expect(slides).toHaveLength(8);
        for (const [index, slide] of slides.entries()) {
          await expect(page).toHaveURL(new RegExp(`scene=${slide.scene}&screen=${slide.screen}$`));
          await expect(lesson).toHaveAttribute('data-screen', slide.id);
          await expect(panel).toBeHidden();
          await expect(heading).toBeFocused();
          await expect(top.getByLabel('현재 슬라이드')).toHaveText(`${index + 1} / 8`);
          await expect(journey).toHaveAttribute('data-state', 's' + slide.scene);
          await expect(art).toBeVisible();
          expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width);
          await page.evaluate(() => document.fonts.ready);
          const before = await slidePosition(art);
          await page.keyboard.press('p');
          await expect(panel.getByRole('heading', { name: slide.title, exact: true })).toBeFocused();
          expect(await slidePosition(art)).toEqual(before);
          await expect(body.locator('p')).toHaveText(slide.explanation);
          await expect(body.getByRole('link')).toHaveCount(slide.guides.length);
          for (const { label, href } of slide.guides) {
            await expect(body.getByRole('link', { name: `${label} ↗`, exact: true })).toHaveAttribute('href', href);
          }

          if (slide.id === 'S3-2') {
            const motion = await art.locator('path[data-transfer]').evaluateAll(paths => paths.map(node => {
              const path = node as SVGPathElement;
              const start = path.getPointAtLength(0), end = path.getPointAtLength(path.getTotalLength());
              return { direction: path.dataset.transfer, dx: end.x - start.x, dy: end.y - start.y, marker: getComputedStyle(path).markerEnd };
            }));
            expect(motion.map(item => item.direction)).toEqual(['request', 'response']);
            expect(motion[0][mobile ? 'dy' : 'dx']).toBeGreaterThan(0);
            expect(motion[1][mobile ? 'dy' : 'dx']).toBeLessThan(0);
            for (const arrow of motion) expect(arrow.marker).not.toBe('none');
          }
          if (index < slides.length - 1) {
            const next = top.getByRole('button', { name: '다음' });
            if (mobile) await next.tap();
            else await next.click();
          }
        }

        const previous = top.getByRole('button', { name: '이전' });
        if (mobile) await previous.tap();
        else await previous.click();
        await expect(lesson).toHaveAttribute('data-screen', 'S4-1');
        await expect(panel).toBeHidden();

        await page.keyboard.press('p');
        await expect(panel).toBeVisible();
        await page.goBack();
        await expect(lesson).toHaveAttribute('data-screen', 'S4-2');
        await expect(panel).toBeHidden();

        await page.keyboard.press('p');
        await expect(panel).toBeVisible();
        await page.goForward();
        await expect(lesson).toHaveAttribute('data-screen', 'S4-1');
        await expect(panel).toBeHidden();

        await page.keyboard.press('p');
        await expect(panel).toBeVisible();
        await bottom.getByLabel('Scene 선택').selectOption('3');
        await expect(lesson).toHaveAttribute('data-screen', 'S3-1');
        await expect(panel).toBeHidden();

        await page.keyboard.press('p');
        await expect(panel).toBeVisible();
        await page.goto(`${base}?scene=3&screen=2`);
        await expect(lesson).toHaveAttribute('data-screen', 'S3-2');
        await expect(panel).toBeHidden();

        await page.keyboard.press('p');
        await expect(panel).toBeVisible();
        await page.reload();
        await expect(lesson).toHaveAttribute('data-screen', 'S3-2');
        await expect(panel).toBeHidden();
        expect(errors).toEqual([]);
      });
    });
  }
}
