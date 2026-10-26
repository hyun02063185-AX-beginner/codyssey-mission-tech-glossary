import {test,expect} from '@playwright/test';
import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
const output='reports/b31-network-foundations';mkdirSync(output,{recursive:true});
const story='/#/missions/main-M05/story-map',scenes=['scene-01','scene-02','scene-03a','scene-03b','scene-04'];
test.describe.configure({mode:'parallel'});
for(const [width,height] of [[1280,720],[1000,720],[360,800],[390,844]])for(const theme of ['dark','light'])test(`${width} ${theme}: readable cards, figures, comparison and lecture lifecycle`,async({page})=>{
 test.setTimeout(120000);await page.setViewportSize({width,height});const errors:string[]=[],metrics:unknown[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(story);await expect(page.locator('.mission-story-scenes li')).toHaveCount(5);await expect(page.locator('.mission-presentation')).toHaveCount(0);
 await page.getByRole('link',{name:'강의 시작하기 →',exact:true}).click();await expect(page.locator('.mission-presentation')).toHaveAttribute('data-presentation-theme','dark');
 await page.locator('.learning-focus-menu summary').click();await page.getByLabel('강의 화면 테마',{exact:true}).selectOption(theme);await page.keyboard.press('Escape');
 for(const [index,scene] of scenes.entries()){
  await expect(page.locator('.b31-current-scene')).toHaveAttribute('data-scene',scene);await expect(page.getByLabel('Scene 선택',{exact:true})).toHaveValue(scene);
  if(['scene-01','scene-02','scene-03b'].includes(scene)){
   const card=page.locator('[data-foundation-card]');await expect(card).not.toHaveAttribute('open');await expect(card.locator('summary').first()).toHaveCSS('min-height','64px');
   if(scene==='scene-01'&&theme==='dark')await page.screenshot({path:`${output}/${width}-collapsed.png`});
   await card.locator('summary').first().focus();await page.keyboard.press('Enter');await expect(card).toHaveAttribute('open','');
   await expect(card.locator('.b31f-checks li')).toHaveCount(2);
   if(scene==='scene-02'){
    await expect(card.locator('.b31f-protocol-note')).toContainText('HTTP · TCP 80');await expect(card.locator('.b31f-protocol-note')).toContainText('HTTPS · TCP 443');
    await expect(card.locator('[data-layer="http"]')).toContainText('요청 일부');
    await expect(card.locator('[data-layer="ip"] > .b31f-fields')).not.toContainText('포트');
   }
   const measured=await card.evaluate(el=>{
    const luminance=(c:string)=>{const v=c.match(/[\d.]+/g)!.slice(0,3).map(Number).map(x=>{x/=255;return x<=.04045?x/12.92:((x+.055)/1.055)**2.4;});return v[0]*.2126+v[1]*.7152+v[2]*.0722;};
    const text=[...el.querySelectorAll('p,code,dt,dd,th,td,caption')].filter(n=>n.getBoundingClientRect().height>0);
    const failures=text.flatMap(n=>{const s=getComputedStyle(n);let p:Element|null=n,bg='';while(p){bg=getComputedStyle(p).backgroundColor;if(!['transparent','rgba(0, 0, 0, 0)'].includes(bg))break;p=p.parentElement;}const a=luminance(s.color),b=luminance(bg),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);return ratio<4.5?[{text:n.textContent,ratio}]:[];});
    return {minText:Math.min(...text.map(n=>parseFloat(getComputedStyle(n).fontSize))),overflow:document.documentElement.scrollWidth>innerWidth,contrastFailures:failures,tableOverflow:el.querySelector('.b31f-table-wrap')?el.querySelector('.b31f-table-wrap')!.scrollWidth>el.querySelector('.b31f-table-wrap')!.clientWidth:false};
   });expect(measured.minText).toBeGreaterThanOrEqual(14);expect(measured.overflow).toBe(false);expect(measured.tableOverflow).toBe(false);expect(measured.contrastFailures).toEqual([]);metrics.push({scene,...measured});
   await card.screenshot({path:`${output}/${width}-${theme}-${scene}.png`});
   await card.locator('.b31f-answers>summary').click();await expect(card.locator('.b31f-answers li')).toHaveCount(2);await card.locator('.b31f-answers>summary').click();
   await card.locator('summary').first().focus();await page.keyboard.press('Space');await expect(card).not.toHaveAttribute('open');
  }else await expect(page.locator('[data-foundation-card]')).toHaveCount(0);
  if(index<4){
   await page.getByRole('button',{name:'그림 확대하기',exact:true}).click();await expect(page.getByRole('dialog')).toBeVisible();await page.keyboard.press('Escape');
   if(scene==='scene-02'){await page.getByRole('button',{name:'요청 강조',exact:true}).click();await expect(page.locator('.b31-story-art [data-flow="R1"]')).toHaveCSS('opacity','0.12');}
   await page.locator('[rel=next]').click();
  }
 }
 await page.getByRole('link',{name:'B3-1 미션으로 돌아가기',exact:true}).click();await expect(page.locator('[data-material="story"]')).toBeVisible();expect(errors).toEqual([]);
 writeFileSync(`${output}/${width}-${theme}-metrics.json`,JSON.stringify({errors,metrics},null,2));
});

test('existing source baseline remains fixed at 71b8784, with no map or glossary expansion',()=>{
 test.setTimeout(120000);
 const paths=['src/b31StoryMapContent.ts','drafts/b3-1-visual-story','src/missionConceptMap','data/mission-story-maps/main-m05','data/curated','content/mission-guides/main-m05','src/b21ConceptExplorer','src/b61ConceptMap','src/b61Story'];
 const files=execFileSync('git',['ls-tree','-r','--name-only','71b8784','--',...paths],{encoding:'utf8'}).trim().split('\n');
 for(const file of files){const before=execFileSync('git',['show',`71b8784:${file}`],{encoding:'utf8'}).replace(/\r\n/g,'\n'),after=readFileSync(file,'utf8').replace(/\r\n/g,'\n');expect(after,file).toBe(before);}
 writeFileSync(`${output}/protected-sources.json`,JSON.stringify({baseline:'71b8784',files,normalization:'CRLF → LF; content must be identical'},null,2));
});

test('card links keep existing map views and Story return; presentation stays off maps',async({page})=>{
 for(const scene of ['scene-01','scene-02','scene-03b']){
  await page.goto(story+'?scene='+scene);await page.locator('.b31f-card>summary').click();await page.locator('.b31f-links a').first().click();
  await expect(page.locator('.map-canvas')).toBeVisible();await expect(page.locator('.mission-presentation')).toHaveCount(0);
  await page.locator('.learning-focus-menu summary').click();await page.getByRole('link',{name:'미션 스토리',exact:true}).click();await expect(page.locator('.b31-current-scene')).toHaveAttribute('data-scene',scene);
  await page.locator('.b31f-card>summary').click();await page.locator('.b31f-links a[href^="#/terms/"]').first().click();await page.getByRole('link',{name:'← B3-1 개념지도로 돌아가기',exact:true}).click();
  await page.locator('.learning-focus-menu summary').click();await page.getByRole('link',{name:'미션 스토리',exact:true}).click();await expect(page.locator('.b31-current-scene')).toHaveAttribute('data-scene',scene);
 }
 await page.locator('.learning-focus-menu summary').click();await page.getByLabel('강의 화면 테마',{exact:true}).selectOption('light');await page.keyboard.press('Escape');await page.reload();await expect(page.locator('.mission-presentation')).toHaveAttribute('data-presentation-theme','light');
});
