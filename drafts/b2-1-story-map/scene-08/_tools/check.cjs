// Local design model QA and PNGs. No development server or public route edits.
const fs = require('fs');
const path = require('path');
const assert = require('node:assert/strict');
const { pathToFileURL } = require('url');
const { chromium } = require(process.env.PLAYWRIGHT || path.resolve(__dirname, '../../../../node_modules/playwright'));
const DIR = path.resolve(__dirname, '..');
const OUT = path.join(DIR, 'preview');
const checks = [];
function ok(condition, name) { assert.ok(condition, name); checks.push(name); }

async function geometry(page, label) {
  const errors = await page.evaluate(() => {
    const errors = [];
    if (document.documentElement.scrollWidth > innerWidth + 1) errors.push('horizontal overflow');
    const visible = e => e.getClientRects().length && getComputedStyle(e).visibility !== 'hidden';
    for (const e of document.querySelectorAll('button,select')) {
      if (!visible(e)) continue;
      const b = e.getBoundingClientRect();
      if (b.height < 43.5) errors.push('small target ' + e.id + ' ' + e.textContent.slice(0, 25));
      if (b.left < -1 || b.right > innerWidth + 1) errors.push('offscreen control ' + e.id);
      if (e.tagName === 'BUTTON' && e.scrollWidth > e.clientWidth + 2) errors.push('button text overflow ' + e.textContent);
    }
    for (const e of document.querySelectorAll('h1,h2,h3,p,.scope,.edge,.area,section')) {
      if (!e.classList.contains('sr') && visible(e) && e.scrollWidth > e.clientWidth + 2) errors.push('text/container overflow ' + e.tagName + ' ' + e.id);
    }
    return errors;
  });
  ok(errors.length === 0, label + ': geometry ' + errors.join(' / '));
}

async function screenshot(page, name) { await page.screenshot({ path: path.join(OUT, name + '.png'), fullPage: true }); }

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch(process.env.PW_CHANNEL ? { channel: process.env.PW_CHANNEL } : {});
  const errors = [];
  try {
    for (const width of [1280, 1000, 390, 360]) {
      for (const font of ['story', 'fallback']) {
        const page = await browser.newPage({ viewport: { width, height: 900 } });
        page.on('pageerror', e => errors.push(String(e)));
        await page.goto(pathToFileURL(path.join(DIR, 'concept-map-preview.html')).href);
        await page.evaluate(() => document.fonts.ready);
        if (font === 'fallback') await page.addStyleTag({ content: 'body{font-family:Arial,"Apple SD Gothic Neo",sans-serif!important}' });
        else ok(await page.evaluate(() => document.fonts.check('16px Story')), width + ': Story font ready');
        const label = width + '/' + font;
        ok(await page.locator('#areas .area:visible').count() === 7, label + ': first screen 7 representatives');
        ok(await page.locator('[data-relation]').count() === 0, label + ': no initial edges');
        await geometry(page, label + ' overview');
        if (font === 'story') await screenshot(page, (width > 760 ? 'desktop-' : 'mobile-') + width + '-overview');
        await page.locator('#area-generator').click();
        const rels = await page.locator('[data-relation]').evaluateAll(es => es.map(e => e.dataset.relation));
        ok(JSON.stringify(rels) === JSON.stringify(['R23', 'R24']), label + ': only Generator direct edges');
        ok(await page.locator('#detailPane').textContent().then(t => t.includes('list(Generator)') && t.includes('R44')), label + ': storage explanation separate');
        await geometry(page, label + ' Generator');
        if (font === 'story') await screenshot(page, (width > 760 ? 'desktop-' : 'mobile-') + width + '-generator');
        // Select Iterator via an actual endpoint, then filter by semantic type.
        await page.locator('[data-relation=R23] [data-endpoint=iterator]').click();
        await page.selectOption('#filter', '종류');
        ok(await page.locator('[data-relation]').count() === 2, label + ': Iterator kind edges R23/R41');
        const filtered = await page.locator('[data-relation]').evaluateAll(es => es.map(e => e.dataset.relation));
        ok(filtered.includes('R41') && !filtered.includes('R22'), label + ': role and kind remain distinct');
        if (width <= 760) await page.locator('[data-tab=detail]').click();
        await geometry(page, label + ' Iterator detail');
        if (font === 'story' && width === 390) await screenshot(page, 'mobile-390-iterator-detail');
        const before = await page.evaluate(() => window.scene08Model.state());
        await page.locator('#sampleGlossary').click();
        const savedScroll = await page.evaluate(() => window.scene08Model.returnSnapshot());
        ok(await page.locator('#glossaryView').isVisible(), label + ': sample glossary view');
        ok((await page.locator('#glossaryBody').textContent()).includes('iterator'), label + ': exact termId shown');
        await geometry(page, label + ' sample glossary');
        await page.locator('#backMap').click();
        assert.deepEqual(await page.evaluate(() => window.scene08Model.state()), before);
        checks.push(label + ': exact map context round trip');
        ok(await page.locator('#detailPane').evaluate(e => e.scrollTop) === savedScroll.panelScroll, label + ': panel scroll restored');
        ok(await page.evaluate(() => window.scrollY) === savedScroll.windowScroll, label + ': map scroll restored');
        await page.locator('#guided').click();
        if (width <= 760) await page.locator('[data-tab=detail]').click();
        const guidedBefore = await page.evaluate(() => window.scene08Model.state());
        await page.locator('#sampleGlossary').click();
        await page.locator('#backMap').click();
        assert.deepEqual(await page.evaluate(() => window.scene08Model.state()), guidedBefore);
        checks.push(label + ': guided glossary round trip');
        for (const id of ['P1', 'P2', 'P3']) {
          await page.selectOption('#path', id);
          const states = await page.evaluate(() => window.scene08Model.data.teacherPaths.find(p => p.id === window.scene08Model.state().path).steps);
          for (let i = 0; i < states.length; i++) {
            const s = await page.evaluate(() => window.scene08Model.state());
            ok(s.selected === states[i].nodeId && s.step === i, label + ': ' + id + ' step ' + i);
            if (i < states.length - 1) await page.locator('#next').click();
          }
          ok(await page.locator('#next').isDisabled(), label + ': path ends without auto-run');
          await geometry(page, label + ' ' + id);
        }
        const last = await page.evaluate(() => window.scene08Model.state());
        await page.locator('#free').click();
        ok((await page.evaluate(() => window.scene08Model.state())).selected === 'iterator', label + ': saved free exploration restored');
        await page.locator('#guided').click();
        const resumed = await page.evaluate(() => window.scene08Model.state());
        ok(resumed.path === last.path && resumed.step === last.step, label + ': teacher progress restored');
        await page.locator('#free').click();
        if (width <= 760) await page.locator('[data-tab=compare]').click();
        const cards = await page.evaluate(() => window.scene08Model.data.comparisons.map(c => c.id));
        for (const id of cards) {
          await page.selectOption('#comparisonSelect', id);
          ok(await page.locator('#comparison').getAttribute('data-comparison') === id, label + ': comparison ' + id);
          await geometry(page, label + ' ' + id);
        }
        if (font === 'story' && [1280, 390].includes(width)) {
          await page.selectOption('#comparisonSelect', 'C16');
          await screenshot(page, (width > 760 ? 'desktop-' : 'mobile-') + width + '-comparison');
        }
        // Entire Scene -> Generator -> Iterator -> glossary -> map -> Generator -> Scene sequence.
        await page.locator('#sampleStart').click();
        await page.locator('#sceneScroll').evaluate(e => e.scrollTop = 160);
        const scroll = await page.locator('#sceneScroll').evaluate(e => e.scrollTop);
        await page.locator('#sceneMapTrigger').click();
        await page.locator('[data-relation=R23] [data-endpoint=iterator]').click();
        if (width <= 760) await page.locator('[data-tab=detail]').click();
        await page.locator('#sampleGlossary').click();
        await page.locator('#backMap').click();
        if (width <= 760) await page.locator('[data-tab=relations]').click();
        await page.locator('#nodeBack').click();
        ok((await page.evaluate(() => window.scene08Model.state())).selected === 'generator', label + ': original Generator context');
        if (width <= 760) await page.locator('[data-tab=detail]').click();
        await page.locator('#returnScene').click();
        ok(await page.locator('#sceneView').isVisible(), label + ': back to sample Scene');
        ok(await page.locator('#sceneScroll').evaluate(e => e.scrollTop) === scroll, label + ': Scene scroll restored');
        ok(await page.evaluate(() => document.activeElement.id) === 'sceneMapTrigger', label + ': Scene focus restored');
        // Keyboard controls (including activation) and visible focus style.
        await page.keyboard.press('Enter');
        ok(await page.locator('#mapView').isVisible(), label + ': keyboard activates map trigger');
        await page.locator('#free').focus();
        await page.keyboard.press('Tab');
        ok(await page.evaluate(() => document.activeElement.id) === 'guided', label + ': keyboard next control');
        // Long labels and scope qualifications outside the guided routes also need layout QA.
        if (font === 'story' && [1280, 390].includes(width)) {
          const ids = await page.evaluate(() => window.scene08Model.data.nodes.map(n => n.id));
          for (const id of ids) {
            if (width <= 760) await page.locator('[data-tab=areas]').click();
            await page.locator('#areasPane details').evaluate(e => e.open = true);
            await page.selectOption('#allNodes', id);
            const expected = await page.evaluate(id => window.scene08Model.data.relations.filter(r => r.from === id || r.to === id).map(r => r.id), id);
            const actual = await page.locator('[data-relation]').evaluateAll(es => es.map(e => e.dataset.relation));
            assert.deepEqual(actual, expected);
            checks.push(label + ': all-node relation parity ' + id);
            await geometry(page, label + ' node ' + id);
            if (width <= 760) await page.locator('[data-tab=detail]').click();
            await geometry(page, label + ' detail ' + id);
          }
        }
        await page.close();
      }
    }
    ok(errors.length === 0, 'no browser page errors');
    const report = { result: 'PASS', browser: await browser.version(), widths: [1280, 1000, 390, 360], fonts: ['Pretendard Variable (Story)', 'Arial / Apple SD Gothic Neo fallback'], checks: checks.length, scope: 'local design model only; actual service routes/browser history unimplemented', checksPassed: checks };
    fs.writeFileSync(path.join(OUT, 'qa-results.json'), JSON.stringify(report, null, 2) + '\n');
    console.log(JSON.stringify({ result: report.result, checks: report.checks, browser: report.browser, screenshots: fs.readdirSync(OUT).filter(x => x.endsWith('.png')).length }));
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
