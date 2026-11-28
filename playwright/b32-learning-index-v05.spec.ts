import { mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test, type Page } from '@playwright/test';
import { parseStoryboardV05 } from '../src/b32Story/parseStoryboardV05';

test.skip(process.env.B32_V05 !== '1', 'Run with B32_V05=1 for the learning-index review edition.');

const story = '/#/missions/main-M06/story';
const lab = '/#/missions/main-M06/lab';
const storageKey = 'b32-v05-learning-index';
const source = readFileSync('content/mission-stories/main-m06/storyboard-v0.5.md', 'utf8');
const { intro, screens, scenes } = parseStoryboardV05(source);
const screenshotDir = process.env.B32_V05_QA_OUTPUT;

function storyUrl(id: string) {
  const [scene, screen] = id.slice(1).split('-');
  return `${story}?scene=${scene}&screen=${screen}`;
}

const slide = (page: Page) => page.locator('.b32-lesson');
const heading = (page: Page) => slide(page).getByRole('heading', { level: 1 });
const top = (page: Page) => page.getByRole('navigation', { name: '슬라이드 상단 탐색' });
const indexButton = (page: Page) => page.getByRole('button', { name: '학습 인덱스', exact: true });
const indexNav = (page: Page) => page.getByRole('navigation', { name: '학습 인덱스', exact: true });
const rail = (page: Page) => page.getByRole('navigation', { name: '학습 인덱스 레일' });
const drawer = (page: Page) => page.getByRole('dialog', { name: '학습 인덱스' });
const explanation = (page: Page) => page.locator('#b32-slide-explanation');
const pButton = (page: Page) => top(page).getByRole('button', { name: /설명 (보기|닫기)/ });
const diagram = (page: Page, id: string) => page.locator(`[data-diagram="${id}"]`);
const position = (page: Page) => page.locator('.b32-position-summary');

async function direct(page: Page, id: string) {
  await page.goto(storyUrl(id));
  await expect(slide(page)).toHaveAttribute('data-screen', id);
}

async function noOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
}

async function move(page: Page, direction: '이전' | '다음', id: string) {
  await top(page).getByRole('button', { name: direction, exact: true }).click();
  await expect(slide(page)).toHaveAttribute('data-screen', id);
}

test.beforeEach(async ({ page, baseURL }) => {
  await page.route('**/*', route => route.request().url().startsWith(`${baseURL}/`) ? route.continue() : route.abort());
});

test('로드맵의 Scene 6개와 원고 질문·목표·개념, 공통 소개·Lab 진입을 보존한다', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto(story);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(`B3-2 — ${intro.title}`);
  const roadmap = page.getByRole('region', { name: '학습 로드맵' });
  await expect(roadmap.locator('.b32-roadmap-scene')).toHaveCount(6);
  await expect(roadmap.getByRole('list', { name: '데이터 이동 순서' }).locator(':scope > li')).toHaveCount(4);
  for (const [id, scene] of Object.entries(scenes)) {
    const card = roadmap.locator('.b32-roadmap-scene').filter({ has: page.getByRole('heading', { name: scene.title, exact: true }) });
    await expect(card.getByText(scene.question, { exact: true })).toBeVisible();
    await expect(card.getByText(scene.goal, { exact: true })).toBeVisible();
    await expect(card.getByRole('list', { name: '핵심 개념' }).getByRole('listitem')).toHaveText(scene.concepts!);
    await expect(card.getByText(`화면 ${screens.filter(screen => screen.scene === id).length}개`, { exact: true })).toBeVisible();
  }
  await expect(page.getByRole('navigation', { name: 'Scene 목차' }).getByRole('link')).toHaveCount(6);
  await expect(page.getByRole('link', { name: 'Lab 목차' })).toHaveAttribute('href', /main-M06\/lab$/);
  await expect(page.getByRole('link', { name: '결과로 찾아보기' })).toHaveAttribute('href', /lab#/);
  await page.getByText('학습 목표와 강의 흐름', { exact: true }).click();
  await expect(page.locator('.mission-story-orientation ol > li')).toHaveCount(5);
  await expect(page.locator('.b32-intro-figure svg[data-state="all"]')).toHaveCount(1);
  await expect(page.getByText('Scene별 학습 질문과 도달 목표')).toHaveCount(0);
  await roadmap.getByRole('link', { name: /이 Scene 시작 · Scene 2/ }).click();
  await expect(slide(page)).toHaveAttribute('data-screen', 'S2-1');
  await page.goBack();
  await roadmap.getByText('화면 목록', { exact: false }).nth(3).click();
  await roadmap.getByRole('link', { name: /S4-5a · Temperature/ }).click();
  await expect(slide(page)).toHaveAttribute('data-screen', 'S4-5a');
});

test('360px 로드맵은 질문을 바로 보여 주고 목표·개념·화면 목록을 자세히에 둔다', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto(story);
  const roadmap = page.getByRole('region', { name: '학습 로드맵' });
  await expect(roadmap).toHaveAttribute('data-compact', 'true');
  await expect(roadmap.locator('details:not([open])')).toHaveCount(6);
  await page.evaluate(async () => { await document.fonts.ready; });
  const { height } = (await roadmap.boundingBox())!;
  console.log(`[R2] 360px 기본 학습 로드맵 높이 ${Math.round(height)}px`);
  expect(height).toBeLessThanOrEqual(1800);
  await noOverflow(page);
  for (const [id, scene] of Object.entries(scenes)) {
    const card = roadmap.locator('.b32-roadmap-scene').filter({
      has: page.getByRole('heading', { name: scene.title, exact: true }),
    });
    const details = card.locator('details');
    const goal = details.getByText(scene.goal, { exact: true });
    await expect(card.getByText(scene.question, { exact: true })).toBeVisible();
    await expect(card.getByText(`화면 ${screens.filter(screen => screen.scene === id).length}개`, { exact: true })).toBeVisible();
    await expect(card.getByRole('link', { name: /이 Scene 시작/ })).toBeVisible();
    await expect(goal).toHaveCount(1);
    await expect(goal).toBeHidden();
    await details.locator('summary').click();
    await expect(goal).toBeVisible();
    await expect(details.getByRole('list', { name: '핵심 개념' }).getByRole('listitem')).toHaveText(scene.concepts!);
    await expect(details.getByRole('link')).toHaveCount(screens.filter(screen => screen.scene === id).length);
    await details.locator('summary').click();
  }
  await roadmap.locator('.b32-roadmap-scene').nth(3).locator('summary').click();
  await roadmap.getByRole('link', { name: /S4-5a · Temperature/ }).click();
  await expect(slide(page)).toHaveAttribute('data-screen', 'S4-5a');
});

test('33개 직접 주소에서 제목·핵심 메시지·순서·위치 띠·인덱스 열기를 확인한다', async ({ page }) => {
  test.setTimeout(80_000);
  for (const [index, screen] of screens.entries()) {
    await direct(page, screen.id);
    await expect(page).toHaveTitle(`${screen.id} · ${screen.title}`);
    await expect(heading(page)).toHaveText(screen.message.replaceAll('`', ''));
    await expect(indexButton(page)).toBeVisible();
    await expect(top(page).getByLabel('현재 슬라이드')).toHaveText(`${index + 1} / ${screens.length}`);
    const inScene = screens.filter(item => item.scene === screen.scene);
    await expect(position(page)).toHaveText(
      `Scene ${screen.scene} / 6 · ${scenes[screen.scene].perspective} · 화면 ${inScene.indexOf(screen) + 1} / ${inScene.length} · 전체 ${index + 1} / 33`,
    );
    await expect(page.getByRole('navigation', { name: 'Scene 위치' }).locator('[aria-current="step"]'))
      .toHaveAccessibleName(new RegExp(`^Scene ${screen.scene} · `));
  }
});

test('고정 열은 열기·닫기, 키보드 탐색, 펼침, 이동, 재로드에서 동기화된다', async ({ page }) => {
  await page.setViewportSize({ width: 1000, height: 800 });
  await direct(page, 'S4-5a');
  await expect(indexNav(page)).toBeHidden();
  await indexButton(page).focus();
  await page.keyboard.press('Enter');
  await expect(indexNav(page).getByRole('heading', { name: '학습 인덱스' })).toBeFocused();
  await noOverflow(page);
  await expect(indexNav(page).locator('[aria-current="page"]')).toContainText('S4-5a');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('PageDown');
  await expect(slide(page)).toHaveAttribute('data-screen', 'S4-5a');
  await page.keyboard.press('Tab');
  await expect(indexNav(page).getByRole('button', { name: '모두 펼치기' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(indexNav(page).locator('.b32-index-scene-toggle[aria-expanded="true"]')).toHaveCount(6);
  await indexNav(page).getByRole('button', { name: '모두 접기' }).click();
  const scene4 = indexNav(page).getByRole('button', { name: /Scene 4 ·/ });
  await expect(scene4).toHaveAttribute('aria-expanded', 'false');
  await scene4.click();
  await expect(scene4).toHaveAttribute('aria-expanded', 'true');
  await indexNav(page).getByRole('link', { name: /S4-5b · Max Tokens/ }).focus();
  await page.keyboard.press('Enter');
  await expect(heading(page)).toBeFocused();
  await expect(indexNav(page).locator('[aria-current="page"]')).toContainText('S4-5b');
  await move(page, '다음', 'S4-6');
  await move(page, '이전', 'S4-5b');
  await expect(indexNav(page).locator('[aria-current="page"]')).toContainText('S4-5b');
  await page.getByRole('combobox', { name: 'Scene 선택' }).selectOption('5');
  await expect(slide(page)).toHaveAttribute('data-screen', 'S5-1');
  await expect(indexNav(page).getByRole('button', { name: /Scene 5 ·/ })).toHaveAttribute('aria-expanded', 'true');
  await expect(scene4).toHaveAttribute('aria-expanded', 'true');
  await page.reload();
  await expect(indexNav(page)).toBeVisible();
  await expect(indexNav(page).locator('.b32-index-scene-toggle[aria-expanded="true"]')).toHaveCount(1);
  await expect(indexNav(page).locator('[aria-current="page"]')).toContainText('S5-1');
  await indexNav(page).getByRole('button', { name: /Scene 5 ·/ }).focus();
  await page.keyboard.press('Escape');
  await expect(indexNav(page)).toBeHidden();
  await expect(indexButton(page)).toBeFocused();
  expect(await page.evaluate(key => localStorage.getItem(key), storageKey)).toBe('closed');
});

test('렌더를 기다리지 않은 상·하 버튼과 키보드 왕복이 최신 주소에서 이동한다', async ({ page }) => {
  const start = 'S4-5b';
  await direct(page, start);
  const expected = [storyUrl('S4-6').slice(1), storyUrl(start).slice(1)];
  for (const selector of ['.b32-top-controls', '.b32-lesson > .b32-controls']) {
    const hashes = await page.evaluate(controls => {
      const buttons = [...document.querySelectorAll<HTMLButtonElement>(`${controls} button`)];
      buttons.find(button => button.textContent?.trim() === '다음')!.click();
      const nextHash = location.hash;
      buttons.find(button => button.textContent?.trim() === '이전')!.click();
      return [nextHash, location.hash];
    }, selector);
    expect(hashes).toEqual(expected);
    await expect(slide(page)).toHaveAttribute('data-screen', start);
  }
  for (const keys of [['ArrowRight', 'ArrowLeft'], ['PageDown', 'PageUp']]) {
    const hashes = await heading(page).evaluate((element, sequence) => sequence.map(key => {
      element.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
      return location.hash;
    }), keys);
    expect(hashes).toEqual(expected);
    await expect(slide(page)).toHaveAttribute('data-screen', start);
  }
  await page.goBack();
  await expect(slide(page)).toHaveAttribute('data-screen', 'S4-6');
  await page.goForward();
  await expect(slide(page)).toHaveAttribute('data-screen', start);
});

test('각 Scene 첫 화면과 S4-5a·S4-5b에서 인덱스를 열고 닫는다', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  for (const id of [...Object.keys(scenes).map(scene => screens.find(screen => screen.scene === scene)!.id), 'S4-5a', 'S4-5b']) {
    await direct(page, id);
    await indexButton(page).click();
    await expect(indexNav(page)).toBeVisible();
    await expect(indexNav(page).locator('[aria-current="page"]')).toContainText(id);
    await indexNav(page).getByRole('button', { name: '닫기', exact: true }).click();
    await expect(indexButton(page)).toBeFocused();
  }
});

for (const [width, height] of [[1280, 720], [1440, 900]]) {
  test(`${width}×${height}에서 P와 인덱스 열·레일을 함께 쓴다`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await direct(page, 'S4-5a');
    await indexButton(page).click();
    await heading(page).focus();
    await page.keyboard.press('p');
    await expect(explanation(page)).toBeVisible();
    if (width < 1440) {
      await expect(rail(page)).toBeVisible();
      expect((await page.locator('.b32-index-aside').boundingBox())!.width).toBe(56);
      const before = (await slide(page).boundingBox())!.width;
      const railExpand = rail(page).getByRole('button', { name: '학습 인덱스 펼치기' });
      expect((await railExpand.boundingBox())!.height).toBeGreaterThanOrEqual(44);
      await railExpand.click();
      await expect(indexNav(page)).toBeVisible();
      await expect(indexNav(page).getByRole('heading')).toBeFocused();
      expect((await slide(page).boundingBox())!.width).toBe(before);
      await page.keyboard.press('Escape');
      await expect(indexNav(page)).toBeHidden();
      await expect(railExpand).toBeFocused();
    } else {
      await expect(rail(page)).toBeHidden();
      await expect(indexNav(page)).toBeVisible();
    }
    const middle = (await slide(page).boundingBox())!;
    const right = (await explanation(page).boundingBox())!;
    expect(right.x).toBeGreaterThanOrEqual(middle.x + middle.width);
    await expect(slide(page).locator('.b32-position li:last-child .b32-position-perspective')).toBeHidden();
    await noOverflow(page);
    await pButton(page).click();
    await expect(explanation(page)).toBeHidden();
    await expect(indexNav(page)).toBeVisible();
  });
}

for (const [width, height] of [[390, 844], [360, 800]]) {
  test(`${width}×${height} drawer의 초점·Esc·배경·선택·뒤로 가기`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await direct(page, 'S4-5a');
    const strip = page.getByRole('navigation', { name: 'Scene 위치' });
    const current = strip.locator('[aria-current="step"]');
    await expect(current.locator('.b32-position-perspective')).toBeHidden();
    await expect(current.locator('.b32-position-screen')).toHaveText('화면 6/9');
    await expect(position(page)).toContainText('Python과 외부 AI');
    const rows = await strip.getByRole('link').evaluateAll(links =>
      new Set(links.map(link => Math.round(link.getBoundingClientRect().top))).size,
    );
    expect(rows).toBeLessThanOrEqual(2);
    const originalLength = await page.evaluate(() => history.length);
    await indexButton(page).click();
    await expect(drawer(page)).toHaveAttribute('aria-modal', 'true');
    await expect(drawer(page).getByRole('heading')).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(drawer(page).getByRole('link', { name: '강의 소개와 학습 로드맵' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(drawer(page).getByRole('button', { name: '모두 펼치기' })).toBeFocused();
    await page.keyboard.press('p');
    await expect(explanation(page)).toBeHidden();
    await page.keyboard.press('Escape');
    await expect(drawer(page)).toBeHidden();
    await expect(indexButton(page)).toBeFocused();
    await indexButton(page).click();
    await page.mouse.click(width - 4, Math.round(height / 2));
    await expect(drawer(page)).toBeHidden();
    await expect(indexButton(page)).toBeFocused();
    expect(await page.evaluate(() => history.length)).toBe(originalLength);
    expect(await page.evaluate(key => localStorage.getItem(key), storageKey)).toBeNull();
    await indexButton(page).click();
    await drawer(page).getByRole('link', { name: /S4-5b/ }).click();
    await expect(drawer(page)).toBeHidden();
    await expect(slide(page)).toHaveAttribute('data-screen', 'S4-5b');
    await expect(heading(page)).toBeFocused();
    await indexButton(page).click();
    await page.goBack();
    await expect(slide(page)).toHaveAttribute('data-screen', 'S4-5a');
    await expect(drawer(page)).toBeHidden();
    await expect(heading(page)).toBeFocused();
    await noOverflow(page);
    await pButton(page).click();
    await indexButton(page).click();
    await page.keyboard.press('p');
    await page.keyboard.press('Escape');
    await expect(drawer(page)).toBeHidden();
    await expect(explanation(page)).toBeVisible();
  });
}

test('I7의 슬라이더·JSON과 화면 안 펼침 상태는 인덱스·P를 열고 닫아도 유지된다', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await direct(page, 'S4-5');
  const material = page.locator('.b32-integrated-material');
  await material.evaluate(element => element.setAttribute('data-qa-mounted', 'original'));
  const i7 = diagram(page, 'I7');
  const enabled = i7.getByRole('checkbox', { name: 'temperature 사용' });
  const slider = i7.getByRole('slider', { name: 'temperature' });
  await enabled.check();
  await slider.press('End');
  await i7.getByRole('button', { name: '범위 밖 입력 예시' }).click();
  await indexButton(page).click();
  await indexNav(page).getByRole('button', { name: '닫기', exact: true }).click();
  await pButton(page).click();
  await explanation(page).getByRole('button', { name: '화면 해설 닫기' }).click();
  await expect(material).toHaveAttribute('data-qa-mounted', 'original');
  await expect(enabled).toBeChecked();
  await expect(slider).toHaveValue('2');
  await expect(i7).toContainText('"temperature": 2');
  await expect(i7.getByRole('button', { name: '범위 밖 입력 예시' })).toHaveAttribute('aria-expanded', 'true');
  await enabled.uncheck();
  await expect(slider).toBeDisabled();
  await expect(i7).not.toContainText('"temperature": 2');
  await move(page, '다음', 'S4-5a');
  await move(page, '이전', 'S4-5');
  await expect(material).not.toHaveAttribute('data-qa-mounted', 'original');
  await expect(enabled).not.toBeChecked();
});

test('I4의 파일 stdout 상속·PIPE와 I5의 Git 네 사례를 보여 준다', async ({ page }) => {
  await direct(page, 'S3-4');
  const i4 = diagram(page, 'I4');
  await i4.getByRole('button', { name: '③ 출력을 파일로' }).click();
  await expect(i4).toHaveAttribute('data-state', 'redirect');
  await expect(i4).toContainText('python3 inherit.py > out.txt');
  await expect(i4).toContainText('화면 출력: 없음');
  await expect(i4).toContainText('같음: True');
  await move(page, '다음', 'S3-5');
  const i5 = diagram(page, 'I5');
  await expect(i5).toHaveAttribute('data-state', 'git-cases');
  for (const [label, code] of [['① 변경 없음', 0], ['② 변경 있음', 0], ['③ stderr에 진행 정보', 0], ['④ 실패', 128]] as const) {
    await i5.getByRole('button', { name: label }).click();
    await expect(i5.getByRole('button', { name: label })).toHaveAttribute('aria-pressed', 'true');
    await expect(i5.locator('dt').filter({ hasText: /^returncode$/ }).locator('xpath=following-sibling::dd[1]')).toHaveText(String(code));
  }
  await i5.getByRole('button', { name: '네 사례 나란히' }).click();
  for (const text of ['stdout이 비었지만 성공', 'stderr에 글이 있지만 성공', 'git clone practice copy', '실제 AI API 호출 없음']) {
    await expect(i5).toContainText(text);
  }
  await expect(i5.locator('dt').filter({ hasText: 'Python의 판단' })).toHaveCount(4);
  await expect(i5.locator('.b32-git-case:not([data-failed]) > .b32-diagram-plain > strong'))
    .toHaveText([/✓ 성공 · returncode 0/, /✓ 성공 · returncode 0/, /✓ 성공 · returncode 0/]);
  const failed = i5.locator('.b32-git-case[data-failed] > .b32-diagram-plain');
  await expect(failed.locator(':scope > strong')).toHaveText('④ ✕ 실패');
  await expect(failed).toHaveCSS('border-top-style', 'dashed');
});

test('I11의 범위·대표 값·표시 확률·비교·극한·커밋 예시를 확인한다', async ({ page }) => {
  await direct(page, 'S4-5a');
  const i11 = diagram(page, 'I11');
  const slider = i11.getByRole('slider', { name: 'temperature' });
  await expect(slider).toHaveValue('1');
  await i11.getByRole('button', { name: '0.2', exact: true }).click();
  await expect(slider).toHaveValue('0.2');
  await expect(i11.getByRole('region', { name: 'temperature 0.2 확률' })).toContainText('98.0%');
  await i11.getByRole('button', { name: '2.0', exact: true }).click();
  await expect(i11.getByRole('region', { name: 'temperature 2.0 확률' })).toContainText('40.0%');
  await i11.getByRole('button', { name: '0.2와 1.0 나란히 비교' }).click();
  await expect(i11.getByRole('region', { name: 'temperature 1.0 확률' })).toBeVisible();
  await expect(i11.getByRole('region', { name: 'temperature 0.2 확률' })).toBeVisible();
  await slider.press('Home');
  await expect(slider).toHaveAttribute('aria-valuetext', 'temperature 0 (극한)');
  await expect(i11).toContainText('가장 높은 후보만 고르는 극한');
  await i11.getByRole('button', { name: '초기화' }).click();
  await expect(slider).toHaveValue('1');
  await i11.getByRole('button', { name: '커밋 제목 예시' }).click();
  await expect(i11).toHaveAttribute('data-state', 'commit');
  await expect(i11).toContainText('변경에 없는 내용');
  await expect(i11).toContainText('교육용 시뮬레이션 · 실제 AI 출력·측정값이 아닙니다');
});

test('I12의 프리셋 7개, 추론 경계, 축소 동작 재생과 판정 출처를 확인한다', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await direct(page, 'S4-5b');
  const i12 = diagram(page, 'I12');
  const results = i12.getByRole('region', { name: 'Python 처리 결과' });
  const draft = i12.getByRole('region', { name: '생성 초안' });
  await expect(draft).toContainText('만든 단위 20 교육용 단위');
  for (const limit of [8, 20, 40, 48, 52, 57, 80]) {
    await i12.getByRole('button', { name: String(limit), exact: true }).click();
    await expect(draft).toContainText(`만든 단위 ${Math.min(57, limit)} 교육용 단위 / 한도 ${limit} 교육용 단위`);
    if (limit < 48) await expect(results).toContainText('필수 섹션(Why, What, How to Test)이 없습니다');
    else if (limit === 48) await expect(results).toContainText('각 PR 섹션에는 불릿이 필요합니다');
    else await expect(results.locator('mark')).toContainText('실행 권장');
    if (limit === 52) await expect(results).toContainText('검증 통과 ≠ 생성 완료');
    if (limit === 57) await expect(draft).toContainText('답변 완성 · 한도와 같은 양');
    if (limit === 80) await expect(draft).toContainText('답변 완성 · 한도 80 교육용 단위 중 57 교육용 단위만');
  }
  await i12.getByRole('button', { name: '생성 시작' }).click();
  await expect(results).toBeVisible();
  await expect(draft).not.toContainText('생성 중');
  await i12.getByRole('button', { name: '추론 모델 가정' }).click();
  await expect(draft).toContainText('만든 단위 50 교육용 단위');
  await expect(results).toContainText('검증 통과 ≠ 생성 완료');
  await i12.getByRole('button', { name: '20', exact: true }).click();
  await expect(i12).toContainText('추론(보이지 않음) 20 교육용 단위');
  const slider = i12.getByRole('slider', { name: '생성 한도' });
  await slider.fill('30');
  await expect(results).toContainText('응답 처리 단계에서 거부 · PR 형식 검사 전');
  await expect(results).toContainText('AI API 응답에 텍스트가 없습니다.');
  await slider.press('ArrowRight');
  await expect(draft).toContainText('만든 단위 1 교육용 단위');
  await expect(results).toContainText('필수 섹션');
  await expect(i12).toContainText('재현 · Claude 2026-11-28 (R9)');
  await expect(i12).toContainText('실제 AI API 호출 없음');
});

test('I12 재생 중 한도를 바꾸면 종료하고 같은 슬라이드의 인덱스는 값을 보존한다', async ({ page }) => {
  await direct(page, 'S4-5b');
  const i12 = diagram(page, 'I12');
  await i12.getByRole('button', { name: '80', exact: true }).click();
  await i12.getByRole('button', { name: '다시', exact: true }).click();
  await expect(i12.getByRole('region', { name: '생성 초안' })).toContainText('생성 중');
  await i12.getByRole('button', { name: '48', exact: true }).click();
  await indexButton(page).click();
  await indexNav(page).getByRole('button', { name: '닫기', exact: true }).click();
  await expect(i12.getByRole('slider', { name: '생성 한도' })).toHaveValue('48');
  await expect(i12.getByRole('region', { name: 'Python 처리 결과' })).toContainText('불릿이 필요합니다');
});

test('발표 기본 배치와 Dark/Light 저장을 확인한다', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await direct(page, 'S4-5');
  const surface = page.locator('.mission-presentation');
  await expect(surface).toHaveAttribute('data-presentation-theme', 'dark');
  await expect(indexNav(page)).toBeHidden();
  const title = (await slide(page).locator('.b32-slide-meta').boundingBox())!;
  const controls = (await top(page).boundingBox())!;
  expect(Math.abs(title.y + title.height / 2 - (controls.y + controls.height / 2))).toBeLessThan(4);
  const question = (await slide(page).locator('.b32-heading').boundingBox())!;
  const strip = (await slide(page).locator('.b32-position').boundingBox())!;
  const material = (await page.locator('.b32-integrated-material').boundingBox())!;
  expect(strip.y).toBeGreaterThanOrEqual(question.y + question.height);
  expect(strip.y + strip.height).toBeLessThan(material.y);
  await page.getByText('학습자료', { exact: true }).click();
  await page.getByRole('combobox', { name: '강의 화면 테마' }).selectOption('light');
  await expect(surface).toHaveAttribute('data-presentation-theme', 'light');
  expect(await page.evaluate(() => localStorage.getItem('codyssey-presentation-theme'))).toBe('light');
  await page.reload();
  await expect(surface).toHaveAttribute('data-presentation-theme', 'light');
});

for (const [width, height] of [[360, 800], [390, 844]]) {
  test(`${width}px에서 33화면과 열린 drawer에 문서 가로 넘침이 없다`, async ({ page }) => {
    test.setTimeout(100_000);
    await page.setViewportSize({ width, height });
    for (const { id } of screens) {
      await direct(page, id);
      await noOverflow(page);
      await indexButton(page).click();
      await expect(drawer(page)).toBeVisible();
      await noOverflow(page);
      await page.keyboard.press('Escape');
      await expect(drawer(page)).toBeHidden();
    }
  });
}

test('기존 Lab 왕복, 접미사 용어사전 복귀, 잘못된 주소 복구를 확인한다', async ({ page }) => {
  for (const [id, labId] of [['S4-6', '07'], ['S3-5', '04']]) {
    await direct(page, id);
    await pButton(page).click();
    await explanation(page).getByRole('link', { name: `상세 참고 · Lab ${labId}`, exact: true }).last().click();
    await expect(page).toHaveURL(new RegExp(`/lab/${labId}\\?from=${id}$`));
    await page.getByRole('link', { name: `← 스토리 ${id}으로 돌아가기` }).click();
    await expect(slide(page)).toHaveAttribute('data-screen', id);
    await expect(slide(page)).toContainText(`Lab ${labId}에서 돌아왔습니다`);
  }
  await direct(page, 'S4-5a');
  await page.getByText('관련 용어사전 · 학습가이드', { exact: true }).click();
  await page.getByRole('link', { name: 'temperature · 용어사전' }).click();
  await expect(page.getByRole('navigation', { name: 'B3-2 학습으로 복귀' })).toBeVisible();
  await page.getByRole('link', { name: '← B3-2 스토리의 이전 화면으로 돌아가기' }).click();
  await expect(slide(page)).toHaveAttribute('data-screen', 'S4-5a');
  await page.goto(`${lab}/07?from=S4-5b`);
  const labTerms = page.getByRole('heading', { name: '관련 용어', exact: true }).locator('xpath=..').getByRole('link');
  await labTerms.first().click();
  await page.getByRole('link', { name: '← B3-2 Lab의 이전 화면으로 돌아가기' }).click();
  await expect(page).toHaveURL(/\/lab\/07\?from=S4-5b$/);
  await page.getByRole('link', { name: '← 스토리 S4-5b으로 돌아가기' }).click();
  await expect(slide(page)).toHaveAttribute('data-screen', 'S4-5b');
  await page.goto(`${story}?scene=4&screen=5c`);
  await expect(page).toHaveURL(/scene=4&screen=1$/);
  await expect(slide(page)).toHaveAttribute('data-screen', 'S4-1');
  await expect(slide(page)).toContainText('잘못된 강의 주소를 복구했습니다');
});

test('선택한 대표 화면을 캡처한다', async ({ page }) => {
  test.skip(!screenshotDir, 'Set B32_V05_QA_OUTPUT to capture the visual review matrix.');
  test.setTimeout(60_000);
  mkdirSync(screenshotDir!, { recursive: true });
  for (const [width, height, theme, id, open] of [
    [1280, 720, 'dark', 'S4-5a', false], [1280, 720, 'light', 'S4-5b', true],
    [1000, 800, 'dark', 'S4-5b', true], [1000, 800, 'light', 'S4-5a', false],
    [390, 844, 'dark', 'S4-5a', true], [390, 844, 'light', 'S4-5b', false],
    [360, 800, 'dark', 'S4-5b', false], [360, 800, 'light', 'S4-5a', true],
  ] as const) {
    await page.setViewportSize({ width, height });
    await direct(page, id);
    await page.evaluate(({ theme, key }) => {
      localStorage.setItem('codyssey-presentation-theme', theme);
      localStorage.removeItem(key);
    }, { theme, key: storageKey });
    await page.reload();
    await expect(page.locator('.mission-presentation')).toHaveAttribute('data-presentation-theme', theme);
    if (open) {
      await indexButton(page).click();
      await expect(indexNav(page)).toBeVisible();
    }
    await noOverflow(page);
    await page.screenshot({ path: join(screenshotDir!, `${width}-${theme}-${id}-${open ? 'open' : 'closed'}.png`) });
  }
  await page.goto(story);
  await expect(page.getByRole('region', { name: '학습 로드맵' })).toBeVisible();
  await page.screenshot({ path: join(screenshotDir!, '360-intro-roadmap.png'), fullPage: true });
});
