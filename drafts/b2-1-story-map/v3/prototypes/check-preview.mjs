// Standalone HTML QA. Existing repository Playwright + installed Chrome.
import { chromium } from '@playwright/test';
import { access, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const output=new URL('../qa/',import.meta.url);
await mkdir(output,{recursive:true});
const browser=await chromium.launch({channel:process.env.B21_BROWSER_CHANNEL||'chrome',headless:true});
const results=[],errors=[],externalRequests=[];
let assertions=0;
function check(ok,label){assertions++;if(!ok)throw Error(label);}
const plans=[{total:7,screens:[2,5]},{total:10,screens:[6,4]}];
try{
 for(const width of [1280,390,360]){
  const context=await browser.newContext({viewport:{width,height:width===1280?720:800},isMobile:width<500,hasTouch:width<500});
  const page=await context.newPage();
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(['error','warning'].includes(m.type()))errors.push(m.text());});
  page.on('requestfailed',r=>errors.push(r.url()+': '+r.failure()?.errorText));
  page.on('request',r=>{if(/^https?:/.test(r.url()))externalRequests.push(r.url());});
  await page.goto(new URL('./scene-01-02.html',import.meta.url).href);
  for(let scene=0;scene<plans.length;scene++){
   const plan=plans[scene];
   await page.locator(`[data-scene="${scene}"]`).click();
   check(await page.locator('#previous').isDisabled(),`${width} scene${scene+1}: first boundary`);
   let global=0;
   for(let screen=0;screen<plan.screens.length;screen++){
    for(let stage=0;stage<plan.screens[screen];stage++,global++){
     const label=`${width} scene${scene+1} screen${screen+1} stage${stage+1}`;
     check(await page.locator(`[data-screen="${screen}"]`).getAttribute('aria-pressed')==='true',label+': correct screen');
     check((await page.locator('#step').innerText()).includes(`${global+1} / ${plan.total}`),label+': progress');
     const last=global===plan.total-1;
     check(await page.locator('#recap').isVisible()===last,label+': questions and summary only at scene end');
     check(await page.locator('#answers').count()===(last?1:0),label+': answers unavailable before scene end');
     check(await page.locator('#lesson pre, #lesson ul').count()===0,label+': no code review or fixed three points');
     check((await page.locator('#note').innerText()).length>15,label+': current one-sentence explanation');
     check(!(await page.locator('#lesson').innerText()).includes('__init__'),label+': initialization detail outside main screen');
     if(scene===0&&screen===0){
      check(await page.getByRole('button',{name:/목록 보기 · 최대 5개/}).count()===1,label+': GUI example');
      check((await page.locator('.compare').innerText()).includes('python -m todo list --limit 5'),label+': matching CLI request');
      check(await page.locator('.compare-card code span').count()===4,label+': command wraps at block boundaries');
     }
     if(scene===0&&screen===1){
      check(JSON.stringify(await page.locator('.node .label').allTextContents())===JSON.stringify(['실행 도구','실행할 프로그램','할 일','조건']),label+': plain block names');
      check(await page.locator('#parse-row').isVisible()===last,label+': argparse integrated only at last step');
      check(await page.locator('.node.is-related').count()===(last?2:0),label+': parser highlights task and condition');
     }
     if(scene===1&&screen===0){
      const text=await page.locator('.roles').innerText();
      check(!/[0-9→←↔↑↓]/.test(text),label+': no numbers or arrows in responsibility diagram');
      check(JSON.stringify(await page.locator('.role code').allTextContents())===JSON.stringify(['models.py','repository.py','services.py','cli.py']),label+': real example filenames');
      const expected=['model','repository','service','cli','repository','cli'][stage];
      check(await page.locator(`.role[data-role="${expected}"]`).getAttribute('aria-pressed')==='true',label+': correct responsibility highlighted');
      check(await page.locator('.role[aria-pressed="true"]').count()===1,label+': only one responsibility selected');
     }
     const layout=await page.evaluate(()=>{
      const visible=[...document.querySelectorAll('button,h1,.note,.recap,.visual,.module,.entry')].filter(e=>e.getBoundingClientRect().width>0);
      return{width:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight,
       brokenLabels:[...document.querySelectorAll('.module code,.node code,.node .label,.compare-card code span')].filter(e=>e.scrollWidth>e.clientWidth+1||e.getBoundingClientRect().height>parseFloat(getComputedStyle(e).lineHeight)*1.1).map(e=>e.textContent),
       outside:visible.filter(e=>{const r=e.getBoundingClientRect();return r.left<-1||r.right>innerWidth+1;}).map(e=>e.textContent.slice(0,50))};
     });
     check(layout.width<=width,label+`: page overflow ${layout.width}`);
     check(!layout.outside.length,label+`: clipped content ${layout.outside}`);
     check(!layout.brokenLabels.length,label+`: split command/file labels ${layout.brokenLabels}`);
     if(width===1280)check(layout.height<=720,label+`: lecture height ${layout.height}`);
     if(stage===plan.screens[screen]-1||(scene===1&&screen===0&&stage===4)){
      await page.evaluate(()=>scrollTo(0,0));
      const name=scene===1&&screen===0&&stage===5?'scene-02-output':`scene-0${scene+1}-${screen===0?'a':'b'}`;
      await page.screenshot({path:fileURLToPath(new URL(`${name}-${width}.png`,output)),fullPage:true});
     }
     results.push({width,scene:scene+1,screen:screen+1,stage:stage+1,globalStep:global+1,height:layout.height,status:'PASS'});
     if(!last)await page.locator('#next').click();
    }
   }
   check(await page.locator('#next').isDisabled(),`${width} scene${scene+1}: final boundary`);
   check(await page.locator('#checks p').count()===2,`${width} scene${scene+1}: two questions`);
   check((await page.locator('#checks p').first().innerText()).startsWith('기본:'),`${width} scene${scene+1}: basic question`);
   check((await page.locator('#checks p').last().innerText()).startsWith('적용:'),`${width} scene${scene+1}: transfer question`);
   await page.locator('#previous').click();
   check(!await page.locator('#recap').isVisible(),`${width} scene${scene+1}: hide recap on return`);
   await page.locator('#question').focus();await page.keyboard.press('End');
   check(await page.locator('#recap').isVisible(),`${width} scene${scene+1}: End reaches scene last stage`);
   await page.locator('#deeper summary').first().click();await page.locator('#answers summary').click();
   check((await page.locator('#answers p').innerText()).length>20,`${width} scene${scene+1}: real answer`);
   if(scene===1)check((await page.locator('#deeper-content').innerText()).includes('__init__.py'),`${width}: init in optional supplement`);
   await page.locator('#deeper summary').first().click();
   for(let screen=0;screen<2;screen++){
    await page.locator(`[data-screen="${screen}"]`).click();
    await page.locator('#teacher summary').click();
    if(scene===0&&screen===1){await page.locator('[data-stage="3"]').click();check((await page.locator('#note').innerText()).includes('최대 다섯'),`${width}: direct condition selection`);}
    if(scene===1&&screen===1){await page.locator('[data-stage="2"]').click();check((await page.locator('#note').innerText()).startsWith('import'),`${width}: direct import selection`);await page.locator('[data-stage="3"]').click();check(await page.locator('#recap').isVisible(),`${width}: direct final selection`);}
    check(await page.locator('#teacher-content li').count()===3,`${width} scene${scene+1} screen${screen+1}: teacher support`);
    for(const href of await page.locator('.detail-content a').evaluateAll(a=>a.map(e=>e.getAttribute('href'))))await access(fileURLToPath(new URL(href,new URL('./scene-01-02.html',import.meta.url))));
    await page.locator('#teacher summary').click();
   }
   await page.locator('#question').focus();await page.keyboard.press('Home');
   check(await page.locator('#previous').isDisabled(),`${width} scene${scene+1}: Home resets scene`);
   await page.keyboard.press('ArrowRight');check((await page.locator('#step').innerText()).includes(`2 / ${plan.total}`),`${width} scene${scene+1}: arrow next`);
   await page.keyboard.press('ArrowLeft');check((await page.locator('#step').innerText()).includes(`1 / ${plan.total}`),`${width} scene${scene+1}: arrow previous`);
   await page.locator('[data-stage="0"]').focus();await page.keyboard.press('Tab');
   check(await page.evaluate(()=>document.activeElement?.getAttribute('data-stage')==='1'),`${width} scene${scene+1}: Tab navigation`);
   await page.keyboard.press('Enter');check((await page.locator('#step').innerText()).includes(`2 / ${plan.total}`),`${width} scene${scene+1}: Enter activation`);
   await page.keyboard.press('Space');check((await page.locator('#step').innerText()).includes(`2 / ${plan.total}`),`${width} scene${scene+1}: Space activation`);
   if(scene===1){
    await page.locator('[data-stage="4"]').click();check(await page.locator('[data-role="repository"]').getAttribute('aria-pressed')==='true',`${width}: storage situation click`);
    await page.locator('[data-stage="5"]').click();check(await page.locator('[data-role="cli"]').getAttribute('aria-pressed')==='true',`${width}: output situation click`);
   }
  }
  await context.close();
 }
 check(!errors.length,'Browser errors/warnings: '+errors.join('\n'));check(!externalRequests.length,'External requests');
 await writeFile(new URL('browser-results.json',output),JSON.stringify({version:'v3.1',browser:browser.version(),transport:'file:// standalone HTML',viewports:[1280,390,360],sceneStageCounts:[7,10],screenStageCounts:[[2,5],[6,4]],assertions,results,errors,externalRequests},null,2)+'\n');
 console.log(`PASS ${results.length} stage/viewport combinations, ${assertions} assertions; browser errors/warnings 0; external requests 0`);
}finally{await browser.close();}
