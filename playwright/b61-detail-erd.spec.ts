import {test,expect} from '@playwright/test';
import {mkdirSync,writeFileSync} from 'node:fs';
const output=process.env.B61_DETAIL_QA_OUTPUT??'reports/b61-story-web/detail-erd';
mkdirSync(output,{recursive:true});
test.describe.configure({mode:'parallel'});
for(const [width,height]of [[1280,720],[360,800]])for(const initialTheme of ['dark','light'])test(`${width} ${initialTheme}: complete ERD, modal focus, zoom, theme and exact lecture return`,async({page})=>{
 test.setTimeout(90000);await page.setViewportSize({width,height});await page.emulateMedia({reducedMotion:'reduce'});
 await page.addInitScript(theme=>localStorage.setItem('codyssey-presentation-theme',theme),initialTheme);
 const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('/#/missions/main-M11/story?scene=03&screen=2');
 const opener=page.getByRole('button',{name:'ERD 상세 보기',exact:true});await expect(opener).toHaveAttribute('aria-haspopup','dialog');
 await expect(page.getByRole('link',{name:'간략 ERD로 이동',exact:true})).toHaveAttribute('href','#/missions/main-M11/story?scene=01&screen=1');
 await opener.focus();const source=page.url(),scroll=await page.evaluate(()=>scrollY);await page.keyboard.press('Enter');
 const dialog=page.getByRole('dialog',{name:'B6-1 · 상세 ERD'}),close=dialog.getByRole('button',{name:'닫기',exact:true});
 const viewport=dialog.getByRole('region',{name:'상세 ERD 이동'}),svg=dialog.locator('.b61-detail-art svg');
 await expect(close).toBeFocused();expect(await dialog.evaluate(el=>el.matches(':modal'))).toBe(true);
 await expect(dialog.locator('.b61-detail-art')).toHaveAttribute('data-layout',width<=700?'mobile':'desktop');
 await expect(svg.locator('[data-table]')).toHaveCount(6);await expect(svg.locator('[data-column]')).toHaveCount(25);await expect(svg.locator('[data-parent]')).toHaveCount(5);
 await page.evaluate(()=>document.fonts.ready);
 const geometry=()=>svg.evaluate(el=>JSON.stringify([...el.querySelectorAll('[data-table] > rect')].map(rect=>['x','y','width','height'].map(key=>rect.getAttribute(key)))));
 const originalGeometry=await geometry();
 const metrics=await svg.evaluate(el=>{
  const root=el as SVGSVGElement,scale=el.getBoundingClientRect().width/root.viewBox.baseVal.width;
  const spill=[...el.querySelectorAll('[data-table]')].flatMap(table=>{
   const box=(table.querySelector('rect') as SVGRectElement).getBBox();
   return [...table.querySelectorAll('text')].flatMap(text=>{const b=text.getBBox();return b.x<box.x+6||b.y<box.y+6||b.x+b.width>box.x+box.width-6||b.y+b.height>box.y+box.height-6?[text.textContent]:[];});
  });
  const overlaps=[...el.querySelectorAll('[data-table]')].flatMap(table=>{
   const text=[...table.querySelectorAll('text')];return text.flatMap((a,i)=>text.slice(i+1).flatMap(b=>{const x=a.getBBox(),y=b.getBBox();return Math.min(x.x+x.width,y.x+y.width)-Math.max(x.x,y.x)>1&&Math.min(x.y+x.height,y.y+y.height)-Math.max(x.y,y.y)>3?[[a.textContent,b.textContent]]:[];}));
  });
  const minColumnSize=Math.min(...[...el.querySelectorAll('[data-column] text.b61d-ink,[data-column] text.b61d-muted')].map(text=>parseFloat(getComputedStyle(text).fontSize)*scale));
  const lum=(value:string)=>{const numbers=value.match(/[\d.]+/g)!.slice(0,3).map(Number).map(n=>{n/=255;return n<=.04045?n/12.92:((n+.055)/1.055)**2.4;});return numbers.reduce((sum,n,i)=>sum+n*[.2126,.7152,.0722][i],0);};
  const failures=[...el.querySelectorAll('[data-table] text')].flatMap(text=>{
   const key=text.classList.contains('b61d-pkt')||text.classList.contains('b61d-fkt'),background=key?text.previousElementSibling!:text.closest('[data-table]')!.querySelector('rect')!;
   const a=lum(getComputedStyle(text).fill),b=lum(getComputedStyle(background).fill),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);return ratio<4.5?[{text:text.textContent,ratio}]:[];
  });
  return {scale,minColumnSize,spill,overlaps,contrastFailures:failures};
 });
 expect(metrics.spill).toEqual([]);expect(metrics.overlaps).toEqual([]);expect(metrics.minColumnSize).toBeGreaterThanOrEqual(17);expect(metrics.contrastFailures).toEqual([]);
 const bounds=await dialog.boundingBox();expect(bounds!.width).toBe(width===360?360:1232);if(width===360)expect(bounds!.height).toBe(800);
 await page.screenshot({path:`${output}/${width}-${initialTheme}-open.png`});
 // Native dialog traps focus and prevents scripted focus on the inert lesson.
 await page.keyboard.press('Shift+Tab');await expect(viewport).toBeFocused();await page.keyboard.press('Tab');await expect(close).toBeFocused();
 await page.locator('#b61-message').evaluate(el=>(el as HTMLElement).focus());await expect(close).toBeFocused();
 const otherTheme=initialTheme==='dark'?'light':'dark';await dialog.getByLabel('강의 화면 테마',{exact:true}).selectOption(otherTheme);
 await expect(svg.locator('.b61d-bg').first()).toHaveCSS('fill',otherTheme==='dark'?'rgb(17, 24, 39)':'rgb(251, 250, 247)');expect(await geometry()).toBe(originalGeometry);
 await dialog.getByLabel('강의 화면 테마',{exact:true}).selectOption(initialTheme);
 const before=await dialog.locator('output').textContent();await dialog.getByRole('button',{name:'상세 ERD 확대',exact:true}).click();await expect(dialog.locator('output')).not.toHaveText(before!);
 await viewport.evaluate(el=>el.scrollTo(100,300));await expect.poll(()=>viewport.evaluate(el=>el.scrollLeft)).toBeGreaterThan(0);await expect.poll(()=>viewport.evaluate(el=>el.scrollTop)).toBeGreaterThan(0);
 await viewport.focus();await page.keyboard.press('PageDown');await page.keyboard.press('ArrowRight');expect(page.url()).toBe(source);await expect(page.locator('.b61-lesson')).toHaveAttribute('data-screen','S03-2');
 await page.keyboard.press('+');await page.keyboard.press('-');await page.keyboard.press('0');await expect(dialog.locator('output')).toHaveText('100%');
 await viewport.evaluate(el=>el.scrollTo(0,el.scrollHeight));await page.screenshot({path:`${output}/${width}-${initialTheme}-bottom.png`});
 await expect(close).toBeInViewport();await close.click();await expect(dialog).toHaveCount(0);await expect(opener).toBeFocused();expect(page.url()).toBe(source);expect(await page.evaluate(()=>scrollY)).toBe(scroll);expect(await page.evaluate(()=>document.body.style.overflow)).toBe('');
 await opener.click();await expect(dialog).toBeVisible();expect(await viewport.evaluate(el=>el.scrollTop)).toBe(0);await page.keyboard.press('Escape');await expect(dialog).toHaveCount(0);await expect(opener).toBeFocused();expect(page.url()).toBe(source);
 await page.getByRole('button',{name:'다음',exact:true}).click();await expect(page.locator('.b61-lesson')).toHaveAttribute('data-screen','S03-3');expect(errors).toEqual([]);
 writeFileSync(`${output}/${width}-${initialTheme}.json`,JSON.stringify({status:'PASS',width,height,theme:initialTheme,metrics,source,focusReturn:true,slideReturn:true},null,2)+'\n');
});
