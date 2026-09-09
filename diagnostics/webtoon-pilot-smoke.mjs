// Webtoon Pilot 브라우저 스모크 테스트.
// 사용법: npm run build && npx vite preview --port 4173 (별도 터미널) 후 `node diagnostics/webtoon-pilot-smoke.mjs`
// 확인: 홈·용어·미션·오픈북 라우트, 웹툰 이미지 로딩, 가로 오버플로, 콘솔 에러, 검색, /webtoons→상세 이동 (desktop 1440 / mobile 390)
import { chromium } from 'playwright';

const BASE = 'http://localhost:4173/';
const check = async (page, errors) => {
  await page.evaluate(async () => {
    for (const img of document.querySelectorAll('img')) img.scrollIntoView({ block: 'center' });
  });
  await page.waitForLoadState('networkidle');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (overflow > 1) errors.push(`horizontal overflow ${overflow}px on ${page.url()}`);
  const broken = await page.$$eval('img', els => els
    .filter(el => el.complete && el.naturalWidth === 0)
    .map(el => el.getAttribute('src')));
  if (broken.length) errors.push(`broken images on ${page.url()}: ${broken.join(',')}`);
  return await page.textContent('body');
};

const routes = [
  ['#/', ['웹툰으로 이해하기', '코디세이 기술용어 사전']],
  ['#/terms', ['용어 탐색']],
  ['#/terms/local-storage', ['웹툰으로 이해하기', '웃었으면 됐고, 이제 진짜 뜻을 봅시다.', '흔한 오해']],
  ['#/terms/javascript', ['웹툰으로 이해하기', '웃었으면 됐고, 이제 진짜 뜻을 봅시다.']],
  ['#/terms/dom', ['웹툰으로 이해하기', '웃었으면 됐고, 이제 진짜 뜻을 봅시다.']],
  ['#/terms/defer', ['웹툰으로 이해하기', '웃었으면 됐고, 이제 진짜 뜻을 봅시다.']],
  ['#/terms/fetch-api', ['웹툰으로 이해하기', '웃었으면 됐고, 이제 진짜 뜻을 봅시다.']],
  ['#/webtoons', ['후속 후보', '이미지 준비 중', 'localStorage', 'JavaScript', 'DOM', 'defer', 'fetch']],
  ['#/missions', ['미션별 탐색', '본과정', '예비과정']],
  ['#/missions/main-M01', ['미션에 직접 등장']],
  ['#/openbook/main-m01', ['동료평가 오픈북']],
];
const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

let failures = 0;
for (const vp of viewports) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(`console error on ${page.url()}: ${m.text()}`); });
  page.on('pageerror', e => errors.push(`pageerror: ${e}`));
  for (const [hash, expected] of routes) {
    await page.goto(BASE + hash, { waitUntil: 'load' });
    const body = await check(page, errors);
    for (const text of expected) if (body && !body.includes(text)) errors.push(`missing text "${text}" on ${hash}`);
  }
  // search flow
  await page.goto(BASE + '#/terms');
  await page.fill('#q', 'localStorage');
  await page.click('button:has-text("찾기")');
  await page.waitForLoadState('networkidle');
  const body = await page.textContent('body');
  if (!body.includes('Web Storage / localStorage')) errors.push('search flow failed: no localStorage result');
  // webtoons -> detail navigation
  await page.goto(BASE + '#/webtoons');
  await page.click('.webtoon-card >> nth=0');
  await page.waitForURL('**/terms/**');
  await page.waitForSelector('.webtoon img', { timeout: 5000 });
  if (!page.url().includes('/terms/')) errors.push(`webtoons->detail navigation failed: ${page.url()}`);
  const detailBody = await check(page, errors);
  if (!detailBody.includes('웃었으면 됐고, 이제 진짜 뜻을 봅시다.')) errors.push('detail via webtoons missing transition copy');
  const passed = errors.length === 0;
  failures += passed ? 0 : 1;
  console.log(`[${vp.name}] ${passed ? 'PASS' : 'FAIL'}${errors.length ? '\n  ' + errors.join('\n  ') : ''}`);
  await browser.close();
}
process.exit(failures ? 1 : 0);
