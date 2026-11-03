// Focused browser QA against the local dev server; no publication or approval.
import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=JSON.parse(await fs.readFile(path.join(root,'content/webtoons/episodes.json'),'utf8'));
const drafts=source.episodes.filter(e=>e.seriesId==='b31-company-network');
const origin=process.env.WEBTOON_REVIEW_ORIGIN||'http://127.0.0.1:5173';
const browser=await chromium.launch({headless:true,executablePath:process.env.WEBTOON_CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
try{
 const page=await browser.newPage();
 const errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 for(const width of [1440,390,360]){
  await page.setViewportSize({width,height:900});
  await page.goto(`${origin}/content/webtoons/company-network/review.html`);
  await page.evaluate(async()=>{await Promise.all([...document.images].map(image=>image.decode()))});
  assert.equal(await page.locator('article').count(),3);
  assert.equal(await page.locator('.mobile img').count(),12);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'review horizontal overflow');
  for(const episode of drafts){
   await page.locator(`nav a[href="#${episode.id}"]`).click();
   assert.equal(new URL(page.url()).hash,`#${episode.id}`);
   const article=page.locator(`#${episode.id}`);
   assert.equal(await article.locator('.desktop').evaluate(image=>image.naturalWidth),1536);
   assert.equal(await article.locator('.mobile img').first().evaluate(image=>image.naturalWidth),736);
   const sizes=await article.locator('.mobile img').evaluateAll(images=>images.map(i=>({width:i.clientWidth,height:i.clientHeight})));
   assert(sizes.every(s=>s.width<=368&&Math.abs(s.height/s.width-480/736)<.01));
   // Captures stay ignored under test-results; source masters are the retained deliverables.
   await fs.mkdir(path.join(root,'test-results/company-network'),{recursive:true});
   await article.locator(width>700?'.desktop':'.mobile').screenshot({path:path.join(root,`test-results/company-network/${episode.id}-${width}.png`)});
  }
  await page.goto(`${origin}/#/webtoons`);
  await page.locator('.webtoon-episode-card').first().waitFor();
  assert.equal(await page.locator('.webtoon-episode-card').count(),19);
  for(const episode of drafts){
   assert.equal(await page.locator(`a[href*="${episode.id}"]`).count(),0);
   await page.goto(`${origin}/#/webtoons?episode=${episode.id}`);
   await page.getByRole('heading',{name:'웹툰을 찾지 못했어요'}).waitFor();
  }
  await page.goto(`${origin}/#/webtoons?episode=ai-model-role-01`);
  await page.locator('.webtoon-reader').waitFor();
  assert.equal(await page.locator(width<=700?'.webtoon-panel-stack img':'.webtoon-full-art img').count(),width<=700?4:1);
  assert.equal(await page.locator('.webtoon-reader img').evaluateAll(images=>images.every(i=>i.complete&&i.naturalWidth>0)),true);
  console.log(`PASS ${width}px: private 3 episodes / 12 panels, no overflow, public 19, draft URLs closed, existing reader`);
 }
 assert.deepEqual(errors,[]);
}finally{await browser.close()}
