import {chromium} from '@playwright/test';
import {mkdirSync,writeFileSync} from 'node:fs';
// Run against a separately served revision; screenshots are exact viewport PNGs.
const stage=process.argv[2]??'after',base=process.env.B31_UX_BASE??'http://127.0.0.1:4173';
const out=`reports/b3-1-slide-ux-final/${stage}`;
mkdirSync(out,{recursive:true});
const browser=await chromium.launch(),metrics=[];
for(const [width,height] of [[1280,720],[1024,768],[390,844]])for(const theme of ['light','dark']){
 const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
 await page.addInitScript(t=>localStorage.setItem('codyssey-presentation-theme',t),theme);
 for(const scene of ['slide-network','slide-packet','scene-02']){
  await page.goto(`${base}/#/missions/main-M05/story-map?scene=${scene}`);
  await page.locator(`.b31-current-scene[data-scene=${scene}]`).waitFor();await page.evaluate(()=>document.fonts.ready);
  if(scene==='scene-02'){
   await page.getByLabel('패킷 체험 테마').selectOption(theme);
   for(let i=0;i<16;i++)await page.getByRole('button',{name:'한 단계 진행',exact:true}).click();
   await page.locator(stage==='before'?'.pj-controls':'.pj-player-bar').evaluate(el=>el.scrollIntoView({block:'start'}));
  }else await page.evaluate(()=>scrollTo(0,0));
  await page.screenshot({path:`${out}/${width}x${height}-${theme}-${scene}.png`,animations:'disabled'});
  metrics.push({width,height,theme,scene,...await page.evaluate(()=>({scrollHeight:document.documentElement.scrollHeight,overflow:document.documentElement.scrollWidth>innerWidth+1,scrollY,rects:Object.fromEntries(['.pj-controls','.pj-map-scroll','.pj-information','.pj-nat'].map(s=>{const r=document.querySelector(s)?.getBoundingClientRect();return[s,r?{x:r.x,y:r.y,width:r.width,height:r.height}:null]}))}))});
  if(scene!=='scene-02'&&stage==='after'){
   await page.locator('.b31f-primary').evaluate(el=>el.scrollIntoView({block:'start'}));
   await page.screenshot({path:`${out}/${width}x${height}-${theme}-${scene}-visual.png`,animations:'disabled'});
  }
  if(scene==='scene-02'){
   if(width===390){await page.locator('.pj-decision').evaluate(el=>el.scrollIntoView({block:'start'}));await page.screenshot({path:`${out}/${width}x${height}-${theme}-${scene}-decision.png`,animations:'disabled'});}
   for(let i=16;i<21;i++)await page.getByRole('button',{name:'한 단계 진행',exact:true}).click();
   await page.locator(stage==='before'?'.pj-controls':'.pj-player-bar').evaluate(el=>el.scrollIntoView({block:'start'}));
   await page.screenshot({path:`${out}/${width}x${height}-${theme}-${scene}-routing.png`,animations:'disabled'});
  }
 }await page.close();
}
await browser.close();writeFileSync(`${out}/metrics.json`,JSON.stringify(metrics,null,2)+'\n');
