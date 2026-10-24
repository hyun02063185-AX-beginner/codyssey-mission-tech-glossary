// Real installed Chrome, private HashRouter and separate same-origin windows.
import {chromium,expect} from '@playwright/test';
import {createServer} from 'vite';
import {mkdir,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';
const root=fileURLToPath(new URL('../',import.meta.url));
let ownServer;
try {if(!(await fetch('http://127.0.0.1:4179/')).ok)throw Error('Unavailable');}
catch {ownServer=spawn(process.execPath,[root+'scripts/b21_preview.mjs'],{cwd:root,stdio:'ignore'});let ready=false;for(let i=0;i<100;i++){try{if((await fetch('http://127.0.0.1:4179/')).ok){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,100));}if(!ready)throw Error('Private Preview failed to start');}
const loader=await createServer({root,configFile:false,server:{middlewareMode:true,hmr:false,ws:false},appType:'custom',optimizeDeps:{noDiscovery:true,include:[]},logLevel:'error'});
const {scenes}=await loader.ssrLoadModule('/src/b21StoryV3/content/index.ts');
await loader.close();
const browser=await chromium.launch({channel:process.env.B21_BROWSER_CHANNEL||'chrome',headless:true});
const browserVersion=browser.version();
const context=await browser.newContext({viewport:{width:1280,height:900}});
const page=await context.newPage(),errors=[];context.on('page',p=>p.on('pageerror',e=>errors.push(e.message)));page.on('pageerror',e=>errors.push(e.message));
const base='http://127.0.0.1:4179/?view=v3-router#/missions/main-M03/story';
let checks=0;const passed=[];const check=(ok,label)=>{if(!ok)throw Error(label);checks++;};
const pos=async(p,sc,step)=>{await expect(p.locator('#pos')).toContainText(`Scene ${sc} · ${step} /`);checks++;};
const open=async(scene='01',step='1',tail='')=>{await page.goto(`${base}?scene=${scene}&step=${step}${tail}`);await page.reload();await page.locator('#stage > *').first().waitFor();};
try{
 await open();
 for(const s of scenes)for(const [i,t] of s.steps.entries()){
  await pos(page,s.id,i+1);const token=s.addressing==='id'?t.id:String(i+1);await expect(page).toHaveURL(new RegExp(`scene=${s.id}&step=${token}(?:$|&)`));
  if(s.id!=='08'||i!==s.steps.length-1)await page.locator('#next').click();
 }
 check(await page.locator('#next').isDisabled(),'end bounded');passed.push('128 sequential steps with REPLACE URLs');
 for(const s of scenes.slice(4,6))for(const [i,id] of s.legacy.entries()){
  await open(s.id,String(i+1));await expect(page).toHaveURL(new RegExp(`step=${id}$`));await pos(page,s.id,s.steps.findIndex(t=>t.id===id)+1);
 }
 passed.push('29 legacy numeric mappings');
 for(const bad of ['0','-1','999','NaN','Infinity','1.5','1e2','+1','%20','%ZZ','iterableX','https://evil.test','//evil.test','%00','%0A','[]','null','undefined','1/2','<script>','💥']){
  await open('06',bad);await pos(page,'06',1);await expect(page.locator('[role=status]')).toContainText('잘못된 강의 주소');await expect(page).toHaveURL(/scene=06&step=reassign$/);
 }
 passed.push('21 invalid URLs with visible recovery notice');
 await open('05','iterable','&back=6');await page.reload();await pos(page,'05',2);await expect(page.locator('#backMap')).toBeVisible();await page.locator('#backMap').click();await pos(page,'08',6);passed.push('refresh preserves semantic step and safe return');
 await open('08','6');const startLength=await page.evaluate(()=>history.state.idx);await page.locator('[data-focus-key="rev-05-iterable"]').click();await pos(page,'05',2);check((await page.evaluate(()=>history.state.idx))===startLength+1,'review PUSH');
 await expect(page).toHaveURL(/scene=05&step=iterable&back=6$/);await page.reload();await page.locator('#next').click();await pos(page,'05',3);check((await page.evaluate(()=>history.state.idx))===startLength+1,'next REPLACE');
 for(let i=0;i<3;i++){await page.goBack();await pos(page,'08',6);await page.goForward();await pos(page,'05',3);}
 await page.reload();await page.locator('#backMap').click();await pos(page,'08',6);await expect(page.locator('[data-focus-key="rev-05-iterable"]')).toBeFocused();
 passed.push('map review reload/back/forward x3 and return focus');
 await open();const before=await page.evaluate(()=>history.state.idx);await page.locator('#next').click();check(await page.evaluate(()=>history.state.idx)===before,'next replace');
 await page.locator('#tocBtn').click();await page.keyboard.press('ArrowRight');await pos(page,'01',2);await page.locator('#tocBody button').nth(60).click();await expect(page.locator('#q')).toBeFocused();check(await page.evaluate(()=>history.state.idx)===before+1,'toc PUSH');
 const tocPos=await page.locator('#pos').innerText();await page.reload();check(await page.locator('#pos').innerText()===tocPos,'TOC reload');await page.locator('#noteBtn').click();await page.keyboard.press('Escape');await expect(page.locator('#noteBtn')).toBeFocused();await page.keyboard.press('ArrowRight');await expect(page.locator('#pos')).not.toHaveText(tocPos);checks++;passed.push('TOC PUSH, keys REPLACE, reload, focus');
 await open('05','check');const popupEvent=context.waitForEvent('page');await page.locator('#presenterBtn').click();const presenter=await popupEvent;
 await expect(presenter.getByTestId('presenter-status')).toHaveText('투영 창과 연결됨');checks++;
 await expect(presenter.locator('h1')).toContainText('Scene 05');await expect(presenter.getByRole('button',{name:'답 공개 요청',exact:true})).toBeEnabled();
 check(await page.locator('#note.on').count()===0,'projector notes stay closed');await expect(presenter.locator('.b21-presenter-notes')).toContainText(scenes[4].steps[19].instructor.expected[0].a);checks++;
 await presenter.getByRole('button',{name:'답 공개 요청',exact:true}).click();await expect(page.locator('#stage .qa .a:visible')).not.toHaveCount(0);await expect(presenter.getByRole('button',{name:'답 숨기기 요청'})).toHaveAttribute('aria-pressed','true');
 await page.locator('[data-focus-key="reveal"]').click();await expect(presenter.getByRole('button',{name:'답 공개 요청',exact:true})).toHaveAttribute('aria-pressed','false');
 await presenter.getByRole('button',{name:'다음 단계',exact:true}).click();await pos(page,'05',21);await expect(presenter.locator('h1')).toContainText('· 21 /');
 await page.locator('#prev').click();await pos(page,'05',20);await expect(presenter.locator('h1')).toContainText('· 20 /');
 await presenter.reload();await expect(presenter.getByTestId('presenter-status')).toHaveText('투영 창과 연결됨');
 await page.reload();await expect(presenter.getByTestId('presenter-status')).toHaveText('투영 창과 연결됨');await page.locator('#next').click();await expect(presenter.locator('h1')).toContainText('· 21 /');
 // Send identical valid request twice: projector must advance exactly once.
 const session=new URL(presenter.url()).searchParams.get('sync');await presenter.evaluate(session=>{const c=new BroadcastChannel(`b21-u3-${session}`);const m={version:1,type:'request',id:'dedup-browser-test',command:'previous'};c.postMessage(m);c.postMessage(m);c.close();},session);
 await pos(page,'05',20);await expect(presenter.locator('h1')).toContainText('· 20 /');await presenter.waitForTimeout(250);await pos(page,'05',20);
 await presenter.evaluate(session=>{const c=new BroadcastChannel(`b21-u3-${session}`);c.postMessage({version:1,type:'state',payload:{route:{scene:0,step:0,back:null,presenter:false},reveal:true}});c.close();},session);await pos(page,'05',20);
 const isolated=await context.newPage();await isolated.goto('http://127.0.0.1:4179/?view=v3-router&sync=isolated-session-1234#/missions/main-M03/story?scene=01&step=1&view=presenter');await expect(isolated.getByRole('button',{name:'다음 단계',exact:true})).toBeDisabled();await isolated.close();
 await presenter.screenshot({path:root+'node_modules/.cache/b21-u3-presenter.png',fullPage:true});await presenter.close();await expect(page.locator('.b21-route-notice')).toContainText('강사 노트 서랍',{timeout:8000});await page.locator('#noteBtn').click();await expect(page.locator('#note')).toHaveClass(/on/);await page.keyboard.press('Escape');
 passed.push('presenter initial/reload/projector reload, bidirectional navigation/reveal, dedup, authority, scoped session, closed-window notes fallback');
 // Real blocked popup and unavailable BroadcastChannel branches.
 await page.evaluate(()=>window.open=()=>null);await page.locator('#presenterBtn').click();await expect(page.locator('.b21-route-notice')).toContainText('팝업이 차단');
 const disabled=await context.newPage();await disabled.addInitScript(()=>Object.defineProperty(window,'BroadcastChannel',{value:undefined}));await disabled.goto(base+'?scene=05&step=iterable');await expect(disabled.locator('.b21-route-notice')).toContainText('동기화');await disabled.locator('#noteBtn').click();await expect(disabled.locator('#note')).toHaveClass(/on/);await disabled.close();passed.push('popup block and missing BroadcastChannel fallback');
 for(const width of [1280,390,360]){await page.setViewportSize({width,height:width===1280?720:800});await open('05','iterable');check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'no overflow '+width);await page.screenshot({path:root+`node_modules/.cache/b21-u3-projector-${width}.png`,fullPage:true});}
 await page.goto('http://127.0.0.1:4179/');await expect(page.getByRole('button',{name:'v3 React 강의',exact:true})).toHaveAttribute('aria-pressed','true');await page.getByRole('button',{name:'Router 강의 테스트'}).click();await expect(page.frameLocator('iframe').locator('#presenterBtn')).toBeVisible();passed.push('private Preview default, Router entry, 1280/390/360');
 check(errors.length===0,'browser errors '+errors.join(';'));console.log(JSON.stringify({status:'PASS',browserVersion,checks,passed,errors}));
 await mkdir(root+'node_modules/.cache/b21-u3',{recursive:true});await writeFile(root+'node_modules/.cache/b21-u3/results.json',JSON.stringify({status:'PASS',browserVersion,checks,passed,errors},null,2));
}catch(e){console.error(JSON.stringify({status:'FAIL',checks,passed,errors,error:e.stack}));process.exitCode=1;}finally{await context.close();await browser.close();if(ownServer)ownServer.kill('SIGTERM');}
