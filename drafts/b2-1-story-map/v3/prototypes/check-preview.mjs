// Local QA only. Uses the repository's existing Playwright and installed Chrome.
import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const output = new URL('../qa/', import.meta.url);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: process.env.B21_BROWSER_CHANNEL || 'chrome', headless: true });
const results = [], errors = [], requests = [];
let assertions = 0;
function check(condition, label) { assertions++; if (!condition) throw new Error(label); }
try {
  for (const width of [1280, 390, 360]) {
    const context = await browser.newContext({ viewport: { width, height: width === 1280 ? 720 : 800 }, isMobile: width < 500, hasTouch: width < 500 });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (['error', 'warning'].includes(message.type())) errors.push(message.text()); });
    page.on('requestfailed', request => errors.push(request.url() + ': ' + request.failure()?.errorText));
    page.on('request', request => { if (/^https?:/.test(request.url())) requests.push(request.url()); });
    await page.goto(new URL('./scene-01-02.html', import.meta.url).href);
    for (const scene of [0, 1]) for (const screen of [0, 1]) {
      await page.locator(`[data-scene="${scene}"]`).click();
      await page.locator(`[data-screen="${screen}"]`).click();
      const steps = await page.locator('[data-stage]').count();
      const description = `${width}px scene-${scene + 1} screen-${screen + 1}`;
      check(await page.locator('#previous').isDisabled(), `${description}: first step boundary`);
      for (let step = 0; step < steps; step++) {
        await page.locator(`[data-stage="${step}"]`).click();
        check(await page.locator(`[data-stage="${step}"]`).getAttribute('aria-pressed') === 'true', `${description}: selected block ${step}`);
        check((await page.locator('#note-body').innerText()).length > 20, `${description}: real explanation`);
        const layout = await page.evaluate(() => {
          const visible = [...document.querySelectorAll('button, h1, .note, .recap, .visual')].filter(el => el.getBoundingClientRect().width > 0);
          return { width: innerWidth, scrollWidth: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight,
            outside: visible.filter(el => { const r = el.getBoundingClientRect(); return r.left < -1 || r.right > innerWidth + 1; }).map(el => el.tagName + ':' + el.textContent.slice(0, 40)) };
        });
        check(layout.scrollWidth <= width, `${description}: horizontal overflow ${layout.scrollWidth}`);
        check(layout.outside.length === 0, `${description}: clipped elements ${layout.outside.join(', ')}`);
        if (width === 1280) check(layout.height <= 720, `${description}: lecture screen height ${layout.height}`);
      }
      check(await page.locator('#next').isDisabled(), `${description}: last step boundary`);
      await page.locator('#previous').click();
      check((await page.locator('#step').innerText()).includes(`${steps - 1} /`), `${description}: previous step`);
      await page.locator('#next').click();
      check((await page.locator('#step').innerText()).includes(`${steps} /`), `${description}: next step`);
      await page.locator('[data-stage="0"]').focus();
      await page.keyboard.press('End');
      check(await page.locator('#next').isDisabled(), `${description}: End key`);
      await page.keyboard.press('Home');
      check(await page.locator('#previous').isDisabled(), `${description}: Home key`);
      await page.keyboard.press('ArrowRight');
      check((await page.locator('#step').innerText()).includes('2 /'), `${description}: arrow next`);
      await page.keyboard.press('ArrowLeft');
      check((await page.locator('#step').innerText()).includes('1 /'), `${description}: arrow previous`);
      await page.keyboard.press('Tab');
      check(await page.evaluate(() => document.activeElement?.tagName === 'BUTTON'), `${description}: Tab focus`);
      await page.keyboard.press('Enter');
      check((await page.locator('#step').innerText()).includes('2 /'), `${description}: keyboard select`);
      await page.keyboard.press('Space');
      check((await page.locator('#step').innerText()).includes('2 /'), `${description}: Space activation`);
      await page.locator('#deeper summary').click();
      check(await page.locator('#deeper-content').isVisible(), `${description}: deeper material`);
      await page.locator('#teacher summary').click();
      check(await page.locator('#teacher-content li').count() === 3, `${description}: three teacher sentences`);
      for (const href of await page.locator('.detail-content a').evaluateAll(links => links.map(link => link.getAttribute('href')))) {
        const { access } = await import('node:fs/promises');
        await access(fileURLToPath(new URL(href, new URL('./scene-01-02.html', import.meta.url))));
      }
      await page.locator('#deeper summary').click(); await page.locator('#teacher summary').click();
      await page.locator(`[data-stage="${scene === 0 ? 1 : screen === 1 ? 3 : 2}"]`).click();
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({ path: fileURLToPath(new URL(`scene-0${scene + 1}-${screen === 0 ? 'a' : 'b'}-${width}.png`, output)), fullPage: true });
      results.push({ width, scene: scene + 1, screen: screen + 1, steps, status: 'PASS' });
    }
    await context.close();
  }
  check(errors.length === 0, 'Browser errors/warnings: ' + errors.join('\n'));
  check(requests.length === 0, 'External requests: ' + requests.join('\n'));
  await writeFile(new URL('browser-results.json', output), JSON.stringify({ browser: browser.version(), transport: 'file://; standalone HTML', viewports: [1280, 390, 360], assertions, results, errors, externalRequests: requests }, null, 2) + '\n');
  console.log(`PASS ${results.length} screen/viewport combinations, ${assertions} assertions; browser errors/warnings 0; external requests 0`);
} finally { await browser.close(); }
