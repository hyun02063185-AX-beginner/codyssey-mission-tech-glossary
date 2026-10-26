import {test,expect} from '@playwright/test';
import {mkdirSync,writeFileSync} from 'node:fs';
test.describe.configure({mode:'parallel'});
const out='reports/mission-story-ui-v12';mkdirSync(out,{recursive:true});
const b2='/missions/main-M03/story',b3='/missions/main-M05/story-map';
const sizes=[[1280,720],[1000,720],[360,800],[390,844]];
async function presentation(page:import('@playwright/test').Page,theme:string){
 await page.locator('.learning-focus-menu summary').click();await page.getByLabel('강의 화면 테마',{exact:true}).selectOption(theme);await page.keyboard.press('Escape');
}
for(const [width,height]of sizes)for(const os of ['light','dark']as const)test(`${width} ${os}: shared overview, lecture state, themes and returns`,async({page,context})=>{
 test.setTimeout(120000);page.setDefaultTimeout(10000);await page.setViewportSize({width,height});await page.emulateMedia({colorScheme:os,reducedMotion:'reduce'});
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));let design:string|undefined;
 for(const [name,path,count]of [['b2',b2,8],['b3',b3,5]]as const){
  await page.goto('/#'+path);await expect(page.locator('.mission-story-overview')).toBeVisible();
  await expect(page.locator('.mission-story-scenes li')).toHaveCount(count);
  const columns=await page.locator('.mission-story-scenes ol').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length);expect(columns).toBe(width>700?(width>=1200?5:4):2);await expect(page.locator('.b21t,.b31-current-scene')).toHaveCount(0);
  expect(new URL(page.url()).hash).toBe('#'+path);await page.reload();await expect(page.locator('.mission-story-overview')).toBeVisible();
  const current=await page.locator('.mission-story-overview').evaluate(el=>{const s=getComputedStyle(el),h=getComputedStyle(el.querySelector('h1')!),a=getComputedStyle(el.querySelector('.mission-story-scenes a')!);return JSON.stringify({padding:s.padding,font:s.fontFamily,headingFont:h.font,font:a.font,cardPadding:a.padding,cardRadius:a.borderRadius});});
  if(design)expect(current).toBe(design);else design=current;
  await page.getByText('학습 목표와 강의 흐름',{exact:true}).click();await expect(page.locator('.mission-story-orientation')).toHaveAttribute('open','');await page.getByText('학습 목표와 강의 흐름',{exact:true}).click();
  if(os==='light')await page.screenshot({path:`${out}/${width}-${name}-overview.png`,fullPage:true});
  await page.getByRole('link',{name:'강의 시작하기 →',exact:true}).click();await expect(page.locator('.mission-story-overview')).toHaveCount(0);
  if(name==='b2'){
   await expect(page.locator('#pos')).toContainText('Scene 01 · 1 /');await expect(page.locator('.mission-presentation')).toHaveAttribute('data-presentation-theme','dark');await expect(page.locator('.b21t')).toHaveCSS('background-color','rgb(17, 24, 39)');
   if(os==='light')await page.screenshot({path:`${out}/${width}-b2-dark.png`,fullPage:true});
   if(os==='dark'&&(width===1280||width===360)){
    await page.locator('.learning-focus-menu summary').click();await page.locator('.learning-focus-menu>div').screenshot({path:`${out}/${width}-presentation-menu-dark-os.png`});await page.keyboard.press('Escape');
   }
   const geometry=()=>page.locator('.b21t').evaluate(el=>JSON.stringify(['.app','#q','#stage','#say'].map(sel=>{const n=el.querySelector(sel)!,r=n.getBoundingClientRect(),s=getComputedStyle(n);return {sel,width:r.width,height:r.height,font:s.fontFamily,size:s.fontSize,weight:s.fontWeight,lineHeight:s.lineHeight};})));
   const dark=await geometry();await presentation(page,'light');expect(await geometry()).toBe(dark);await expect(page.locator('.b21t')).toHaveCSS('background-color','rgb(251, 250, 247)');
   if(os==='light')await page.screenshot({path:`${out}/${width}-b2-light.png`,fullPage:true});
   await page.reload();await expect(page.locator('.mission-presentation')).toHaveAttribute('data-presentation-theme','light');
   await page.locator('#next').click();await expect(page.locator('#pos')).toContainText('Scene 01 · 2 /');
   await page.goto('/#'+b2+'?scene=05&step=iterable');await expect(page.locator('#pos')).toContainText('Scene 05 · 2 /');await page.reload();await expect(page.locator('#pos')).toContainText('Scene 05 · 2 /');
   await presentation(page,'dark');
   // Site theme can change without changing the presentation palette or route.
   const address=page.url();await page.locator('.learning-focus-menu summary').click();await page.getByLabel('화면 테마',{exact:true}).selectOption('paper');await page.keyboard.press('Escape');await expect(page.locator('.b21t')).toHaveCSS('background-color','rgb(17, 24, 39)');expect(page.url()).toBe(address);
   const next=await context.newPage();await next.goto('/#'+b2+'?scene=06&step=all');await expect(next.locator('.mission-presentation')).toHaveAttribute('data-presentation-theme','dark');await next.close();
   await page.locator('.learning-focus-menu summary').click();await page.getByRole('link',{name:'강의 소개 보기',exact:true}).click();await page.locator('.mission-story-scenes a').last().click();await expect(page.locator('#pos')).toContainText('Scene 08 · 1 /');
  }else{
   await expect(page.locator('.b31-current-scene')).toHaveAttribute('data-scene','scene-01');await expect(page.locator('.mission-story-scenes')).toHaveCount(0);await expect(page.locator('.mission-presentation')).toHaveAttribute('data-presentation-theme','dark');
   await page.getByLabel('Scene 선택',{exact:true}).selectOption('scene-02');await expect(page.locator('.b31-current-scene')).toHaveAttribute('data-scene','scene-02');await page.reload();await expect(page.locator('.b31-current-scene')).toHaveAttribute('data-scene','scene-02');
   await page.getByRole('button',{name:'요청 강조',exact:true}).click();await expect(page.locator('.b31-story-art [data-flow="R1"]')).toHaveCSS('opacity','0.12');
   if(os==='light')await page.screenshot({path:`${out}/${width}-b3-lecture.png`,fullPage:true});
   await page.getByRole('link',{name:'관련 개념을 지도에서 보기 →',exact:true}).click();await expect(page.locator('.map-canvas')).toBeVisible();await expect(page.locator('[data-presentation-theme]')).toHaveCount(0);await page.locator('.learning-focus-menu summary').click();await page.locator('.learning-focus-menu').getByRole('link',{name:'미션 스토리',exact:true}).click();await expect(page.locator('.b31-current-scene')).toHaveAttribute('data-scene','scene-02');
   await page.getByRole('link',{name:'← 강의 소개',exact:true}).click();await page.locator('.mission-story-scenes a').last().click();await expect(page.locator('.b31-current-scene')).toHaveAttribute('data-scene','scene-04');
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  // Reset site palette so the two overview styles are compared in the same theme.
  await page.locator('.learning-focus-menu summary').click();await page.getByLabel('화면 테마',{exact:true}).selectOption('forest');await page.keyboard.press('Escape');
 }
 expect(errors).toEqual([]);writeFileSync(`${out}/${width}-${os}.json`,JSON.stringify({status:'PASS',width,height,os,overviewDesign:JSON.parse(design!)},null,2));
});

test('presentation choice reaches presenter and later lectures; blocked storage has a usable fallback',async({page,context})=>{
 test.setTimeout(60000);
 await page.goto('/#'+b2+'?scene=05&step=check');
 const popup=context.waitForEvent('page');await page.locator('#presenterBtn').click();const presenter=await popup;
 await expect(presenter.getByTestId('presenter-status')).toHaveText('투영 창과 연결됨');
 await presentation(page,'light');await expect(presenter.locator('.mission-presentation')).toHaveAttribute('data-presentation-theme','light');
 const later=await context.newPage();await later.goto('/#'+b2+'?scene=07&step=1');await expect(later.locator('.mission-presentation')).toHaveAttribute('data-presentation-theme','light');await later.close();
 await presentation(page,'dark');await expect(presenter.locator('.mission-presentation')).toHaveAttribute('data-presentation-theme','dark');
 await presenter.getByRole('button',{name:'다음 단계',exact:true}).click();await expect(page.locator('#pos')).toContainText('Scene 05 · 21 /');await presenter.close();
 const blocked=await context.newPage();await blocked.addInitScript(()=>{
  const get=Storage.prototype.getItem,set=Storage.prototype.setItem;
  Storage.prototype.getItem=function(key){if(key==='codyssey-presentation-theme')throw new DOMException('blocked','SecurityError');return get.call(this,key);};
  Storage.prototype.setItem=function(key,value){if(key==='codyssey-presentation-theme')throw new DOMException('blocked','SecurityError');set.call(this,key,value);};
 });
 await blocked.goto('/#'+b2+'?scene=01&step=1');await expect(blocked.locator('.mission-presentation')).toHaveAttribute('data-presentation-theme','dark');
 await presentation(blocked,'light');await expect(blocked.locator('.mission-presentation')).toHaveAttribute('data-presentation-theme','light');await blocked.reload();await expect(blocked.locator('.mission-presentation')).toHaveAttribute('data-presentation-theme','dark');await blocked.close();
});
