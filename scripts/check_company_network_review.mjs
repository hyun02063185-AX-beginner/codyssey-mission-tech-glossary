// Focused browser QA against local preview or deployed Pages; read-only.
import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=JSON.parse(await fs.readFile(path.join(root,'content/webtoons/episodes.json'),'utf8'));
const episodes=source.episodes.filter(e=>e.seriesId==='b31-company-network');
const origin=(process.env.WEBTOON_REVIEW_ORIGIN||'http://127.0.0.1:5173').replace(/\/$/,'');
const publicOnly=process.env.WEBTOON_PUBLIC_ONLY==='1';
const browser=await chromium.launch({headless:true,executablePath:process.env.WEBTOON_CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
try{
 const page=await browser.newPage();
 const errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 for(const width of [1440,390,360]){
  await page.setViewportSize({width,height:900});
  if(!publicOnly){
  await page.goto(`${origin}/content/webtoons/company-network/review.html`);
  await page.evaluate(async()=>{await Promise.all([...document.images].map(image=>image.decode()))});
  assert.equal(await page.locator('article').count(),3);
  assert.equal(await page.locator('.mobile img').count(),12);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'review horizontal overflow');
  for(const episode of episodes){
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
  }
  await page.goto(`${origin}/#/webtoons`);
  await page.locator('.webtoon-episode-card').first().waitFor();
  assert.equal(await page.locator('.webtoon-episode-card').count(),22);
  for(const [index,episode] of episodes.entries()){
   await page.goto(`${origin}/#/webtoons`);
   const card=page.locator(`.webtoon-episode-card[href="#/webtoons?episode=${episode.id}"]`);
   await card.click();
   await page.getByRole('heading',{name:episode.title,exact:true}).waitFor();
   assert.equal(new URL(page.url()).hash,`#/webtoons?episode=${episode.id}`);
   const artwork=page.locator(width<=700?'.webtoon-panel-stack':'.webtoon-full-art');
   assert.equal(await artwork.locator('img').count(),width<=700?4:1);
   await artwork.locator('img').evaluateAll(async images=>{await Promise.all(images.map(i=>i.decode()))});
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'public reader horizontal overflow');
   for(const term of episode.relatedTerms){
    const link=page.locator(`.webtoon-next-links a[href="#/terms/${term.termId}?webtoon=${episode.id}"]`);
    assert.equal(await link.count(),1);
    if(width===1440){
     await link.click();await page.locator('.webtoon-quick-term').waitFor();
     await page.locator('.webtoon-quick-term .webtoon-back').click();await artwork.waitFor();
    }
   }
   const next=page.getByRole('link',{name:/^이어서 일반 회사망/});
   assert.equal(await next.count(),index<2?1:0);
   await fs.mkdir(path.join(root,'test-results/company-network'),{recursive:true});
   await artwork.screenshot({path:path.join(root,`test-results/company-network/published-${episode.id}-${width}.png`)});
   if(index<2){await next.click();await page.getByRole('heading',{name:episodes[index+1].title,exact:true}).waitFor()}
  }
  await page.goto(`${origin}/#/webtoons?episode=ai-model-role-01`);
  await page.locator('.webtoon-reader').waitFor();
  assert.equal(await page.locator(width<=700?'.webtoon-panel-stack img':'.webtoon-full-art img').count(),width<=700?4:1);
  assert.equal(await page.locator('.webtoon-reader img').evaluateAll(images=>images.every(i=>i.complete&&i.naturalWidth>0)),true);
  console.log(`PASS ${width}px: public 22, new 3 readers / 12 panels, related terms and next links, no overflow, existing reader`);
 }
 assert.deepEqual(errors,[]);
}finally{await browser.close()}
