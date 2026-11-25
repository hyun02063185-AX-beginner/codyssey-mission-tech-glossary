import { expect, test, type Locator } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = 'content/mission-stories/main-m06';
const manuscript = readFileSync(`${root}/storyboard-v0.2-r1.md`, 'utf8').replace(/\r\n/g, '\n');
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

test('shows the r1 title, learning goals, prerequisites and four scene links', async ({ page }) => {
  await page.goto(base);
  await expect(page.getByRole('heading', { name: 'B3-2 — Python으로 외부 AI를 활용하는 방법' })).toBeVisible();
  await expect(page.getByText('Git 변경 내용을 설명하는 AI 도우미 만들기', { exact: true })).toBeVisible();
  await page.getByText('학습 목표와 강의 흐름').click();
  await expect(page.locator('.mission-story-orientation > ol > li')).toHaveCount(4);
  const goalLines = manuscript.match(/\*\*학습 목표\*\*\n\n((?:\d+\. .+\n)+)/)![1].trim().split('\n');
  await expect(page.locator('.mission-story-orientation > ol > li')).toHaveText(goalLines.map(line => line.slice(3)));
  await expect(page.getByText(/명령줄에서 프로그램을 실행해 본 경험과 Python 딕셔너리·리스트/)).toBeVisible();
  await expect(page.getByText('P', { exact: true })).toBeVisible();
  await expect(page.locator('.mission-story-scenes li')).toHaveCount(4);
  await expect(page.getByRole('link', { name: /Python과 외부 AI API의 요청·응답/ })).toHaveAttribute('href', '#/missions/main-M06/story?scene=3&screen=1');
});

test('shows revised learning checks and reveals answers only on request', async ({ page }) => {
  const checks = [
    ['1&screen=2', '이해 확인', /git status와 git diff는 각각/, /어떤 줄이 바뀌었는지/],
    ['3&screen=1', '이해 확인', /아직 Git에서 추적되지 않을 때/, /새 파일의 이름만/],
    ['3&screen=2', 'Scene 3 이해 확인', /작성 규칙·Git 문맥·API 키/, /choices\[0\]\.message\.content/],
    ['4&screen=2', '마무리 · 스스로 설명하기', /빈칸을 채워 전체 흐름/, /⑦ 사람/],
  ] as const;
  for (const [address, label, questionText, answerText] of checks) {
    await page.goto(`${base}?scene=${address}`);
    const review = page.locator('.b32-review');
    await expect(review).not.toContainText('학습자 접힘 설명');
    const check = review.locator(':scope > details').filter({ has: page.getByText(label, { exact: true }) });
    const question = check.getByText(questionText);
    const answer = check.locator('.b32-check-answer').getByText(answerText);
    await expect(question).toBeHidden();
    await check.getByText(label, { exact: true }).click();
    await expect(question).toBeVisible();
    await expect(answer).toBeHidden();
    const reveal = check.getByText('정답 보기', { exact: true });
    await reveal.focus();
    await page.keyboard.press('Enter');
    await expect(answer).toBeVisible();
    await page.keyboard.press('Enter');
    await expect(answer).toBeHidden();
  }
  await page.goto(`${base}?scene=2&screen=1`);
  const review = page.locator('.b32-review');
  await expect(review).not.toContainText('초안은 AI가 먼저 작성한 검토용 글입니다');
  await expect(review.getByText('발표자 노트 · 강사 스크립트', { exact: true })).toBeVisible();
  await expect(review.getByText('실제 시연 · 발표자 노트', { exact: true })).toBeVisible();
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
        expect(maxHeight).toBeCloseTo(viewport.height * 0.4, 1);
        expect(await slidePosition(art)).toEqual(initial);
        const panelBox = (await panel.boundingBox())!;
        expect(panelBox.y + panelBox.height).toBeCloseTo(viewport.height, 0);

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

      test('keeps the F6 result and F7 response readable with the explanation open', async ({ page }) => {
        const out = process.env.B32_R1_QA_OUTPUT;
        for (const [screen, figure, topics] of [
          [1, 'f6', ['excluded-context', 'prepared-context']],
          [2, 'f7', ['response-status', 'response-example']],
        ] as const) {
          await page.goto(`${base}?scene=3&screen=${screen}`);
          const art = page.locator('.b32-figure svg');
          await expect(art).toBeVisible();
          await page.evaluate(() => document.fonts.ready);
          await page.evaluate(() => { document.scrollingElement!.scrollTop = 0; });
          const before = await slidePosition(art);
          if (mobile) await page.getByRole('button', { name: '설명 보기' }).tap();
          else await page.keyboard.press('p');
          const panel = page.getByRole('region', { name: slides[screen + 3].title });
          await expect(panel).toBeVisible();
          expect(await slidePosition(art)).toEqual(before);
          const overlayTop = (await panel.boundingBox())!.y;
          const topicBoxes = () => Promise.all(topics.map(topic => art.locator(`[data-topic=${topic}]`).boundingBox()));

          if (mobile) {
            // On a narrow screen the learner scrolls the slide in the exposed area while the layer stays fixed.
            const lowestEdge = Math.max(...(await topicBoxes()).map(box => box!.y + box!.height));
            await page.mouse.move(8, Math.floor(overlayTop / 2));
            await page.mouse.wheel(0, Math.ceil(lowestEdge - overlayTop + 10));
            await expect.poll(async () => Math.max(...(await topicBoxes()).map(box => box!.y + box!.height)))
              .toBeLessThanOrEqual(overlayTop - 7);
            expect((await panel.boundingBox())!.y).toBe(overlayTop);
          }

          for (const box of await topicBoxes()) {
            expect(box!.y).toBeGreaterThanOrEqual(0);
            expect(box!.y + box!.height).toBeLessThanOrEqual(overlayTop);
          }
          if (screen === 2) {
            const contrast = await art.evaluate(svg => {
              const key = svg.querySelector('[data-response-example] tspan')!;
              const card = svg.querySelector('rect.b32s-box-r')!;
              const luminance = (color: string) => {
                const linear = color.match(/\d+/g)!.slice(0, 3).map(value => {
                  const s = Number(value) / 255;
                  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
                });
                return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
              };
              const a = luminance(getComputedStyle(key).fill) + 0.05;
              const b = luminance(getComputedStyle(card).fill) + 0.05;
              return Math.max(a, b) / Math.min(a, b);
            });
            expect(contrast).toBeGreaterThanOrEqual(4.5);
          }
          if (out) await page.screenshot({ path: join(out, `${viewport.width}-${theme}-${figure}-explanation.png`) });
          const readingPosition = await slidePosition(art);
          await page.keyboard.press('Escape');
          await expect(panel).toBeHidden();
          expect(await slidePosition(art)).toEqual(readingPosition);
        }
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

          if (slide.id === 'S2-2') {
            await expect(art).toContainText('재현: 안 0 · 밖 128');
            await expect(art).not.toContainText(/실제|CompletedProcess|check=False/);
          }
          if (slide.id === 'S3-1') {
            await expect(art).toContainText('넣지 않는 것');
            await expect(art).toContainText('가리고 계속');
            await expect(art).toContainText('전송 멈춤');
            await expect(art.locator('[data-topic=prepared-context]')).toContainText(/806자.*user/);
          }
          if (slide.id === 'S3-2') {
            const motion = await art.locator('path[data-transfer]').evaluateAll(paths => paths.map(node => {
              const path = node as SVGPathElement;
              const start = path.getPointAtLength(0), end = path.getPointAtLength(path.getTotalLength());
              return { direction: path.dataset.transfer, dx: end.x - start.x, dy: end.y - start.y, startY: start.y, endY: end.y, marker: getComputedStyle(path).markerEnd };
            }));
            expect(motion.map(item => item.direction)).toEqual(['request', 'response']);
            expect(motion[0][mobile ? 'dy' : 'dx']).toBeGreaterThan(0);
            if (mobile) {
              // Request points to the API between the two local Python boxes. Response points to the second Python box.
              expect(motion[1].dy).toBeGreaterThan(0);
              expect(motion[0].endY).toBeLessThan(motion[1].startY);
            } else {
              expect(motion[1].dx).toBeLessThan(0);
            }
            for (const arrow of motion) expect(arrow.marker).not.toBe('none');

            const responseLines = await art.locator('[data-response-example] text').allTextContents();
            const example = JSON.parse(responseLines.join('\n'));
            expect(example.choices[0].message.content).toBe('커밋 메시지 초안 …');
            await expect(art).toContainText('교육용 예시 · 원본 응답 미확보');
            await expect(art).toContainText('401·403 · 인증');
            await expect(art).toContainText('Authorization: Bearer ••••');
            await expect(art).toContainText('/v1/chat/completions');
            await expect(art).toContainText('딕셔너리 → JSON');
            await expect(art).toContainText('choices[0].message.content');
            await expect(art).not.toContainText('모델 실행 위치 미확인');
          }
          if (slide.id === 'S4-1') {
            await expect(art).toContainText('같은 Git 문맥이면 user는 같다');
            await expect(art).toContainText('system · 커밋 작성 규칙');
            await expect(art).toContainText('system · PR 작성 규칙');
            await expect(body).toContainText('원본 요청은 남아 있지 않아');
          }
          if (slide.id === 'S4-2') {
            await expect(body).toContainText('이제 처음 질문에 답할 수 있습니다');
            await expect(body).toContainText('마지막 판단은 사람이 합니다');
            await expect(art).not.toContainText('모델 실행 위치 미확인');
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
