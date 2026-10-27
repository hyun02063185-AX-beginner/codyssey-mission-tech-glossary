import {test,expect} from '@playwright/test';
import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
const out='reports/glossary-visual/b6-1-p0-web';mkdirSync(out,{recursive:true});
const terms=['erd','foreign-key','join','cidr','ssh-key'];
const sourceSections=(id:string)=>readFileSync(`content/terms/${id}.md`,'utf8').split(/^## /m).slice(1).map(part=>part.split('\n')[0].trim());
test.describe.configure({mode:'parallel'});
for(const [width,height]of [[1280,720],[1000,720],[390,844],[360,800]])for(const theme of ['forest','indigo','paper','signal'])for(const colorScheme of ['light','dark'] as const){
  test(`${width} ${theme} OS-${colorScheme}: approved figures, full text, responsive and legacy`,async({page})=>{
    test.setTimeout(90000);await page.setViewportSize({width,height});await page.emulateMedia({colorScheme,reducedMotion:'reduce'});
    const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));page.on('requestfailed',request=>errors.push(request.url()+': '+request.failure()?.errorText));page.on('response',response=>{if(response.status()>=400)errors.push(`${response.status()} ${response.url()}`);});
    const metrics=[];
    for(const id of terms){
      await page.goto('/#/terms/'+id);await page.getByLabel('화면 테마',{exact:true}).selectOption(theme);await expect(page.locator('.rich-figure svg')).toHaveCount(1);await page.evaluate(()=>document.fonts.ready);await page.waitForLoadState('networkidle');await page.addStyleTag({content:'html{scroll-behavior:auto!important}'});
      const figure=page.locator('.rich-figure'),svg=figure.locator('svg');await expect(svg).toHaveAttribute('role','img');await expect(svg.locator('title')).not.toBeEmpty();
      const responsive=['erd','foreign-key','join'].includes(id);await expect(figure).toHaveAttribute('data-variant',responsive?(width<=700?'mobile':'desktop'):'legacy');
      if(responsive){
        await expect(svg.locator('desc')).not.toBeEmpty();await expect(figure.locator('figcaption')).toContainText('B6-1 사례');
        expect(await figure.locator('figcaption').evaluate(el=>getComputedStyle(el,'::after').content)).toBe('none');
        const headings=await page.locator('.term-rich-content h2').allTextContents();expect(headings).toEqual(sourceSections(id).filter(heading=>heading!=='관련 용어'));
        await expect(page.locator('.term-rich-content')).not.toContainText('![');await expect(page.locator('.term-rich-content')).toContainText('흔한 오해');await expect(page.locator('.term-rich-content')).toContainText('동료평가 질문');
      }else if(width<=700)expect(await figure.locator('figcaption').evaluate(el=>getComputedStyle(el,'::after').content)).toContain('좌우로');
      const measured=await svg.evaluate(svg=>{
        const root=svg as SVGSVGElement,vb=root.viewBox.baseVal,scale=root.getBoundingClientRect().width/vb.width;
        const texts=[...root.querySelectorAll('text')].filter(t=>t.textContent?.trim()).map(t=>{const b=t.getBBox();return {s:t.textContent,x:b.x,y:b.y,w:b.width,h:b.height,fs:parseFloat(t.getAttribute('font-size')??getComputedStyle(t).fontSize)};});
        const outside=texts.filter(b=>b.x<0||b.y<0||b.x+b.w>vb.width||b.y+b.h>vb.height).map(b=>b.s),overlaps=[];
        for(let i=0;i<texts.length;i++)for(let j=i+1;j<texts.length;j++){const a=texts[i],b=texts[j];if(Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x)>1&&Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y)>2)overlaps.push([a.s,b.s]);}
        const rgb=(value:string)=>(value.match(/[\d.]+/g)??[]).slice(0,3).map(Number),lum=(color:number[])=>color.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
        const backgrounds=[...root.querySelectorAll('rect')].filter(el=>getComputedStyle(el).fill!=='none').map(el=>({box:(el as SVGGraphicsElement).getBBox(),fill:rgb(getComputedStyle(el).fill)})).sort((a,b)=>a.box.width*a.box.height-b.box.width*b.box.height);
        const contrast=[...root.querySelectorAll('text')].map(el=>{const b=el.getBBox(),x=b.x+b.width/2,y=b.y+b.height/2,bg=backgrounds.find(item=>x>=item.box.x&&x<=item.box.x+item.box.width&&y>=item.box.y&&y<=item.box.y+item.box.height);if(!bg)return 21;const a=lum(rgb(getComputedStyle(el).fill)),c=lum(bg.fill);return (Math.max(a,c)+.05)/(Math.min(a,c)+.05);});
        const scroll=root.closest('.rich-svg-scroll')!;
        return {viewBox:[vb.width,vb.height],width:root.getBoundingClientRect().width,minFontPx:Math.min(...texts.map(t=>t.fs*scale)),outside,overlaps,minContrast:Math.min(...contrast),figureScroll:scroll.scrollWidth>scroll.clientWidth+1,pageOverflow:document.documentElement.scrollWidth>innerWidth+1};
      });
      expect(measured.pageOverflow).toBe(false);
      if(responsive){expect(measured.outside).toEqual([]);expect(measured.overlaps).toEqual([]);expect(measured.figureScroll).toBe(false);expect(measured.minContrast).toBeGreaterThanOrEqual(4.5);expect(measured.minFontPx).toBeGreaterThanOrEqual(11);}
      metrics.push({id,...measured});
      if(colorScheme==='light'&&theme==='forest'&&[1280,390].includes(width))await page.screenshot({animations:'disabled',path:`${out}/${id}-${width}-forest.png`,fullPage:true});
      if(colorScheme==='light'&&responsive&&(theme==='forest'||(width===1280&&theme!=='forest')))await figure.screenshot({animations:'disabled',path:`${out}/${id}-${width}-${theme}-figure.png`});
    }
    expect(errors).toEqual([]);writeFileSync(`${out}/metrics-${width}-${theme}-${colorScheme}.json`,JSON.stringify(metrics,null,2));
  });
}
test('700px breakpoint, search and related terms',async({page})=>{
  await page.goto('/#/terms/join');for(const [width,variant]of [[701,'desktop'],[700,'mobile'],[360,'mobile'],[1000,'desktop']] as const){await page.setViewportSize({width,height:800});await expect(page.locator('.rich-figure')).toHaveAttribute('data-variant',variant);await expect(page.locator('.rich-figure svg')).toHaveCount(1);}
  await expect(page.locator('.term-rich-content')).toContainText('ORDER BY');await expect(page.locator('.term-rich-content .code')).toContainText('SELECT orders.id, users.name');
  await page.locator('article').getByRole('link',{name:'#외래 키',exact:true}).click();await expect(page).toHaveURL(/terms\/foreign-key$/);await expect(page.locator('.term-rich-content')).toContainText('PRAGMA foreign_keys = ON');
  await page.goto('/#/terms');await page.getByLabel('기술 용어 검색').fill('ERD');await page.getByRole('button',{name:'검색',exact:true}).click();await page.locator('.row').filter({hasText:'ERD'}).first().click();await expect(page).toHaveURL(/terms\/erd$/);await expect(page.locator('.rich-figure svg')).toBeVisible();
});
