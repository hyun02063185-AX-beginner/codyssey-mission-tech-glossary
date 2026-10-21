// npm run build; npx vite preview --host 127.0.0.1 --port 4318
import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
const base=process.env.WEBTOON_QA_URL||'http://127.0.0.1:4318/';
const output=path.resolve(process.env.WEBTOON_QA_OUTPUT||'work/webtoon-qa');
await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,...(process.env.WEBTOON_CHROME_PATH?{executablePath:process.env.WEBTOON_CHROME_PATH}:{})});
const errors=[];const checks=[];
const assert=(condition,message)=>{if(!condition)throw new Error(message)};
const legacy=['local-storage','javascript','dom','defer','fetch-api'];
const episodes=[['ai-model-role-01','model',true],['prompt-request-01','prompt',true],['abstraction-coffee-01','abstraction',false],['algorithm-sandwich-01','algorithm',false],['llm-firstday-01','llm',true],['cloud-compute-bill-01','cloud',false],['terminal-bus-01','terminal',true],['game-engine-oil-01','game-engine',false],['git-final-01','git',true],['shell-seashell-01','shell',true],['cache-menu-01','cache',true],['docker-image-photo-01','docker-image',true],['github-team-01','github',true],['authentication-login-01','authentication',true],['authorization-edit-01','authorization',true],['server-request-01','server',false],['database-records-01','database',false],['api-map-01','api',false],['open-source-font-01','open-source',false]];
async function ready(page){
 // Full-page captures include offscreen cards; request their lazy images explicitly for QA.
 await page.locator('img[loading="lazy"]').evaluateAll(images=>images.forEach(image=>{image.loading='eager'}));
 await page.waitForFunction(()=>[...document.images].filter(image=>image.getBoundingClientRect().width>0).every(image=>image.complete&&image.naturalWidth>0));
 await page.evaluate(()=>document.fonts.ready);
 await page.evaluate(async()=>{await Promise.all([...document.images].filter(image=>image.getBoundingClientRect().width>0).map(image=>image.decode()));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)});
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'horizontal page overflow');
}
try{
 for(const width of [1440,390,375,360]){
  const page=await browser.newPage({viewport:{width,height:1000},deviceScaleFactor:1});
  page.on('pageerror',error=>errors.push(String(error)));
  page.on('console',message=>{if(message.type()==='error')errors.push(message.text())});
  page.on('response',response=>{if(response.status()>=400)errors.push(`${response.status()} ${response.url()}`)});
  await page.goto(base+'#/webtoons');await ready(page);
  assert(await page.locator('.webtoon-episode-card').count()===19,'expected exactly nineteen public stories');
  assert(!await page.getByText('이미지 준비 중',{exact:true}).count(),'candidates leaked into the public catalogue');
  if(width===1440)await page.screenshot({path:path.join(output,'catalog-desktop.png'),fullPage:true});
  await page.locator('.webtoon-episode-card').first().focus();await page.keyboard.press('Enter');await ready(page);
  assert(page.url().includes('episode=ai-model-role-01'),'keyboard did not open model');
  for(const [id,name,linked] of episodes){
   await page.goto(base+'#/webtoons?episode='+id);await ready(page);
   const panels=await page.locator('.webtoon-panel-stack img').count();
   assert(width<=700?panels===4:await page.locator('.webtoon-full-art img').count()===1,'wrong responsive reading layout');
   if(width===1440||width===390)await page.screenshot({path:path.join(output,`${name}-${width}.png`),fullPage:true});
   await page.locator('.webtoon-transcript summary').click();
   assert(await page.locator('.webtoon-transcript li').count()===4,'incomplete transcript');
   assert(await page.locator('.webtoon-dialogue').count()===8,'incomplete dialogue');
   if(linked){
   await page.locator('.webtoon-next-links a').first().click();await ready(page);
   assert(await page.locator('.webtoon-quick-term').count()===1,'reader did not reach the simple dictionary bridge');
   assert(await page.locator('.term-map-entry').count()===0,'bridge jumped directly to map UI');
   await page.locator('.webtoon-back').click();await ready(page);
   assert(page.url().includes(id),'dictionary bridge lost episode context');
   }else assert(await page.locator('.webtoon-next-links a').count()===0,'unmapped concept has an invented dictionary link');
  }
  await page.goto(base+'#/');await ready(page);
  assert(await page.locator('.webtoon-home .webtoon-episode-card').count()===19,'home has stale webtoon count');
  checks.push({width,passed:true,layout:width<=700?'four sequential panels':'2x2 full sheet'});
  await page.close();
 }
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 for(const id of legacy){await page.goto(base+'#/terms/'+id);await ready(page);assert(await page.locator('.webtoon-term-entry,.webtoon img').count()===0,`archived story still visible: ${id}`)}
 await page.goto(base+'#/terms?toon=yes');await ready(page);assert(await page.locator('.terms-page .row').count()===11,'webtoon filter does not match published related terms');
 await page.goto(base+'#/webtoons?episode=missing');assert(await page.getByRole('heading',{name:'웹툰을 찾지 못했어요'}).count()===1,'unknown episode has no recovery');
 await page.close();
 assert(errors.length===0,errors.join('\n'));
 await fs.writeFile(path.join(output,'qa-result.json'),JSON.stringify({base,checks,archivedTerms:legacy,errors,passed:true},null,2));
 console.log(`PASS: ${checks.length} viewports, nineteen episodes, transcripts, keyboard, dictionary bridges, unlinked concepts, archives and filters. ${errors.length} browser/network errors.`);
}finally{await browser.close()}
