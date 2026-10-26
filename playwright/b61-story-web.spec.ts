import {test,expect} from '@playwright/test';
import {mkdirSync,writeFileSync} from 'node:fs';
import {screens} from '../src/b61Story/content';
import {screenHref} from '../src/b61Story/navigation';
test.describe.configure({mode:'parallel'});
const output=process.env.B61_QA_OUTPUT??'reports/b61-story-web';mkdirSync(output,{recursive:true});
for(const [width,height]of [[1280,720],[1000,720],[360,800],[390,844]])for(const theme of ['dark','light'])test(`${width} ${theme}: B6-1 approved screens, diagrams, URLs and learning returns`,async({page})=>{
 test.setTimeout(150000);page.setDefaultTimeout(10000);await page.setViewportSize({width,height});await page.emulateMedia({reducedMotion:'reduce'});
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/#/missions/main-M11');
 await expect(page.locator('[data-material="story"] a')).toHaveAttribute('href','#/missions/main-M11/story');
 await expect(page.locator('[data-material="concepts"] a')).toHaveCount(0);await expect(page.locator('[data-material="guide"] a')).toHaveAttribute('href','#/missions/main-M11/guide');
 await page.locator('[data-material="story"] a').click();await expect(page.locator('.mission-story-scenes li')).toHaveCount(4);await expect(page.locator('.b61-lesson')).toHaveCount(0);
 if(theme==='dark')await page.screenshot({path:`${output}/${width}-overview.png`,fullPage:true});
 await page.getByRole('link',{name:'강의 시작하기 →',exact:true}).click();await expect(page.locator('.mission-presentation')).toHaveAttribute('data-presentation-theme','dark');
 await page.locator('.learning-focus-menu summary').click();await page.getByLabel('강의 화면 테마',{exact:true}).selectOption(theme);await page.keyboard.press('Escape');
 const metrics:unknown[]=[],positions=new Map<string,string>();
 for(const [index,screen]of screens.entries()){
  await expect(page.locator('.b61-lesson')).toHaveAttribute('data-screen',screen.id);await expect(page.locator('#b61-message')).toHaveText(screen.message);await expect(page.locator('.b61-caption')).toHaveText(screen.caption);
  await expect(page).toHaveURL(new RegExp(screenHref(index).replace(/[?]/g,'\\?')+'$'));await expect(page.locator('.mission-story-overview')).toHaveCount(0);
  await page.evaluate(()=>document.fonts.ready);
  if(screen.diagram){
   await expect(page.locator('.b61-art-frame')).toHaveAttribute('data-layout',width<900?'mobile':'desktop');
   const svg=page.locator('.b61-art-host svg');await expect(svg).toHaveAttribute('data-state',screen.state!);
   const measured=await svg.evaluate(el=>{
    const svg=el as SVGSVGElement,r=el.getBoundingClientRect(),texts=[...el.querySelectorAll('text')].filter(n=>n.getBoundingClientRect().width>0&&!n.closest('[class*="b61s-deco"]'));
    const rgb=(v:string)=>v.match(/[\d.]+/g)?.slice(0,3).map(Number);
    const lum=(v:number[])=>v.map(n=>{n/=255;return n<=.04045?n/12.92:((n+.055)/1.055)**2.4;}).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0);
    const opacity=(n:Element)=>{let value=1;for(let p:Element|null=n;p&&p!==el;p=p.parentElement)value*=Number(getComputedStyle(p).opacity);return value;};
    const boxes=[...el.querySelectorAll('rect,circle')].filter(n=>n.getBoundingClientRect().width>0&&opacity(n)>.99&&rgb(getComputedStyle(n).fill)).map(n=>({r:n.getBoundingClientRect(),fill:rgb(getComputedStyle(n).fill)!})).sort((a,b)=>a.r.width*a.r.height-b.r.width*b.r.height);
    const contrastFailures=texts.filter(n=>opacity(n)>.99).flatMap(n=>{const rect=n.getBoundingClientRect(),x=rect.x+rect.width/2,y=rect.y+rect.height/2,bg=boxes.find(b=>x>=b.r.left&&x<=b.r.right&&y>=b.r.top&&y<=b.r.bottom);const ink=rgb(getComputedStyle(n).fill);if(!bg||!ink)return [];
      const a=lum(ink),b=lum(bg.fill),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05),size=parseFloat(getComputedStyle(n).fontSize)*r.width/svg.viewBox.baseVal.width,large=size>=24||size>=18.66&&Number(getComputedStyle(n).fontWeight)>=700;
      return ratio<(large?3:4.5)?[{text:n.textContent,ratio,size}]:[];
    });
    return {contrastFailures,width:r.width,height:r.height,minText:Math.min(...texts.map(n=>parseFloat(getComputedStyle(n).fontSize)*r.width/svg.viewBox.baseVal.width)),positions:JSON.stringify([...el.querySelectorAll('rect.b61s-box')].map(n=>['x','y','width','height'].map(a=>n.getAttribute(a)))),overflow:texts.filter(n=>{const b=n.getBBox();return b.x<-1||b.y<-1||b.x+b.width>svg.viewBox.baseVal.width+1||b.y+b.height>svg.viewBox.baseVal.height+1;}).map(n=>n.textContent)};
   });
   expect(measured.minText).toBeGreaterThanOrEqual(13.99);expect(measured.overflow).toEqual([]);expect(measured.contrastFailures).toEqual([]);
   if(screen.diagram==='erd-story'){if(positions.has('erd'))expect(measured.positions).toBe(positions.get('erd'));else positions.set('erd',measured.positions);}
   if(screen.state==='read'||screen.state==='join'||screen.state==='return'){
    const highlighted=await svg.locator(`[class*="b61s-hi-${screen.state}"] ${screen.state==='return'?'.b61s-rel':'.b61s-box'}`).evaluateAll(els=>els.map(el=>getComputedStyle(el).strokeWidth));expect(highlighted.length).toBeGreaterThan(0);expect(highlighted.every(w=>w===(screen.state==='return'?'5px':'4px'))).toBe(true);
   }
   metrics.push({id:screen.id,...measured});
  }else await expect(page.locator('.b61-art-host')).toHaveCount(0);
  if(screen.id==='S03-2')await expect(page.locator('.b61-result')).toBeVisible({visible:width<900});
  else await expect(page.locator('.b61-result')).toHaveCount(0);
  if(screen.id==='S01-3')await expect(page.locator('.b61-art-host svg')).toHaveAttribute('aria-label',/다대다\(N\) 관계는 연결 테이블로 표현할 수 있다\./);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  if((width===1280||width===360)&&['S01-1','S01-3','S02-3','S03-1','S03-2','S03-3','S04-1','S04-2','S04-3'].includes(screen.id)||theme==='dark'&&screen.id==='S03-2')await page.screenshot({path:`${output}/${width}-${theme}-${screen.id}.png`,fullPage:true});
  if(index===0)await expect(page.getByRole('button',{name:'이전',exact:true})).toBeDisabled();
  if(index<screens.length-1)await page.getByRole('button',{name:'다음',exact:true}).click();
 }
 await expect(page.getByRole('button',{name:'다음',exact:true})).toBeDisabled();
 await page.getByRole('button',{name:'이전',exact:true}).click();await expect(page.locator('.b61-lesson')).toHaveAttribute('data-screen','S04-2');
 await page.goBack();await expect(page.locator('.b61-lesson')).toHaveAttribute('data-screen','S04-3');await page.goForward();await page.reload();await expect(page.locator('.b61-lesson')).toHaveAttribute('data-screen','S04-2');await expect(page.locator('.mission-presentation')).toHaveAttribute('data-presentation-theme',theme);
 await page.getByLabel('Scene 선택',{exact:true}).selectOption('02');await expect(page.locator('.b61-lesson')).toHaveAttribute('data-screen','S02-1');
 await page.getByRole('link',{name:'전체 ERD',exact:true}).click();await expect(page.locator('.b61-lesson')).toHaveAttribute('data-screen','S01-1');await page.goBack();await expect(page.locator('.b61-lesson')).toHaveAttribute('data-screen','S02-1');
 await page.goto('/#'+screenHref(7));await page.reload();await expect(page.locator('.b61-art-host svg')).toHaveAttribute('data-state','join');const source=page.url();
 await page.locator('.learning-focus-menu summary').click();await page.locator('.learning-focus-menu').getByRole('link',{name:'학습가이드',exact:true}).click();
 await expect(page.locator('.guide-index nav li')).toHaveCount(10);await page.locator('.guide-index nav a').first().click();await page.reload();await expect(page.locator('.b61-story-return a')).toBeVisible();await page.locator('.b61-story-return a').click();await expect(page).toHaveURL(source);
 await page.locator('.learning-focus-menu summary').click();await page.getByRole('link',{name:'이 Scene 학습가이드',exact:true}).click();await expect(page.locator('.guide-prose h1')).toContainText('Chapter 6');await page.locator('.b61-story-return a').click();await expect(page).toHaveURL(source);
 await page.locator('.learning-focus-back').click();await expect(page.locator('[data-material="story"]')).toBeVisible();await page.goBack();await expect(page).toHaveURL(source);
 await page.goto('/#/missions/main-M11/story?scene=03&screen=999&returnUrl=https://evil.test');await expect(page).toHaveURL(/scene=03&screen=1$/);await expect(page.getByRole('status')).toContainText('주소를 복구');
 await page.locator('.learning-focus-menu summary').click();await page.getByRole('link',{name:'강의 소개 보기',exact:true}).click();await page.locator('.mission-story-scenes a').last().click();await expect(page.locator('.b61-lesson')).toHaveAttribute('data-screen','S04-1');
 expect(errors).toEqual([]);writeFileSync(`${output}/${width}-${theme}.json`,JSON.stringify({status:'PASS',width,height,theme,metrics},null,2));
});

test('B6-1 inherits an existing Light presentation preference and persists subsequent changes',async({page})=>{
 await page.goto('/#/missions/main-M03/story?scene=01&step=1');await page.locator('.learning-focus-menu summary').click();await page.getByLabel('강의 화면 테마',{exact:true}).selectOption('light');
 await page.goto('/#/missions/main-M11/story');await page.getByRole('link',{name:'강의 시작하기 →',exact:true}).click();await expect(page.locator('.mission-presentation')).toHaveAttribute('data-presentation-theme','light');await expect(page.locator('.b61-art-host svg .b61s-bg')).toHaveCSS('fill','rgb(251, 250, 247)');
 await page.locator('.learning-focus-menu summary').click();await page.getByLabel('강의 화면 테마',{exact:true}).selectOption('dark');await page.reload();await expect(page.locator('.mission-presentation')).toHaveAttribute('data-presentation-theme','dark');
});


test('responsive SVG switches by available space and restores desktop after resizing',async({page})=>{
 await page.goto('/#'+screenHref(7));
 for(const [width,layout]of [[950,'mobile'],[1000,'desktop'],[390,'mobile'],[1280,'desktop']] as const){
  await page.setViewportSize({width,height:800});await expect(page.locator('.b61-art-frame')).toHaveAttribute('data-layout',layout);await expect(page.locator('.b61-art-host svg')).toHaveAttribute('data-state','join');
  await expect(page.locator('.b61-result')).toBeVisible({visible:layout==='mobile'});
  if(layout==='mobile')expect((await page.locator('.b61-art-host').boundingBox())!.width).toBeLessThanOrEqual(420);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
});
