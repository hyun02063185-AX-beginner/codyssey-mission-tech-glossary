import {test,expect} from '@playwright/test';
import {readFileSync,mkdirSync} from 'node:fs';
const ids=['packet','responsive-web-design'];
const out='reports/glossary-visual/fast-batch-c';
const glossary=JSON.parse(readFileSync('src/data/generated/glossary.json','utf8'));
for(const width of [1280,390,360])for(const theme of ['forest','paper']){
  test(`${width} ${theme}: two terms, source sections, accessible figures and links`,async({page})=>{
    test.setTimeout(90000);await page.setViewportSize({width,height:844});
    const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
    for(const id of ids){
      await page.goto('/#/terms/'+id);await page.getByLabel('화면 테마',{exact:true}).selectOption(theme);
      const figure=page.locator('.rich-figure'),svg=figure.locator('svg');
      await expect(svg).toHaveCount(1);await expect(svg).toHaveAttribute('role','img');await expect(svg.locator('title')).not.toBeEmpty();
      expect(await svg.getAttribute('aria-label')||await svg.getAttribute('aria-labelledby')).toBeTruthy();
      await expect(figure.locator('figcaption')).toContainText(id==='packet'?'B3-1':'B1-1');
      await expect(svg.locator('desc')).not.toBeEmpty();
      await expect(figure).toHaveAttribute('data-variant',width<=700?'mobile':'desktop');
      const headings=readFileSync(`content/terms/${id}.md`,'utf8').split(/^## /m).slice(1).map(s=>s.split('\n')[0].trim()).filter(h=>h!=='관련 용어');
      expect(await page.locator('.term-rich-content h2').allTextContents()).toEqual(headings);
      await expect(page.locator('.term-rich-content')).not.toContainText('![');
      await page.evaluate(()=>document.fonts.ready);
      const metrics=await svg.evaluate(el=>{
        const root=el as SVGSVGElement,scale=root.getBoundingClientRect().width/root.viewBox.baseVal.width;
        const outside=[...root.querySelectorAll('text')].filter(t=>{const b=t.getBBox(),v=root.viewBox.baseVal;return b.x<0||b.y<0||b.x+b.width>v.width+1||b.y+b.height>v.height+1;}).map(t=>t.textContent);
        const boxes=[...root.querySelectorAll('text')].map(t=>({text:t.textContent,box:t.getBBox()})),overlaps:string[][]=[];
        for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){const a=boxes[i].box,b=boxes[j].box;if(Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x)>1&&Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y)>2)overlaps.push([boxes[i].text??'',boxes[j].text??'']);}
        const fonts=[...root.querySelectorAll('text')].map(t=>parseFloat(getComputedStyle(t).fontSize)*scale);
        const scroll=root.closest('.rich-svg-scroll')!;
        const rgb=(value:string)=>(value.match(/[\d.]+/g)??[]).slice(0,3).map(Number);
        const lum=(color:number[])=>color.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
        const backgrounds=[...root.querySelectorAll('rect,circle,polygon,path')].filter(el=>getComputedStyle(el).fill!=='none').map(el=>({box:el.getBoundingClientRect(),fill:rgb(getComputedStyle(el).fill)})).sort((a,b)=>a.box.width*a.box.height-b.box.width*b.box.height);
        const contrasts=[...root.querySelectorAll('text')].map(el=>{const b=el.getBoundingClientRect(),x=b.x+b.width/2,y=b.y+b.height/2,bg=backgrounds.find(r=>x>=r.box.x&&x<=r.box.x+r.box.width&&y>=r.box.y&&y<=r.box.y+r.box.height);if(!bg)return 21;const a=lum(rgb(getComputedStyle(el).fill)),c=lum(bg.fill);return (Math.max(a,c)+.05)/(Math.min(a,c)+.05);});
        return {overlaps,outside,contrast:Math.min(...contrasts),minFont:Math.min(...fonts),overflow:document.documentElement.scrollWidth>innerWidth+1,figureOverflow:scroll.scrollWidth>scroll.clientWidth+1,filter:getComputedStyle(root).filter};
      });
      expect(metrics.overlaps,id).toEqual([]);expect(metrics.outside,id).toEqual([]);expect(metrics.contrast,id).toBeGreaterThanOrEqual(4.5);expect(metrics.overflow).toBe(false);expect(metrics.figureOverflow).toBe(false);expect(metrics.minFont).toBeGreaterThanOrEqual(11);expect(metrics.filter).toBe('none');
      // Four representative figures only.
      if((width===1280&&theme==='forest')||(width===390&&theme==='paper')){
        mkdirSync(out,{recursive:true});await figure.screenshot({path:`${out}/${id}-${width}-${theme}.png`,animations:'disabled'});
      }
      const term=glossary.find((t:{id:string})=>t.id===id),target=term.detailRelatedTerms[0];
      await page.locator(`article a[href="#/terms/${target}"]`).last().click();await expect(page).toHaveURL(new RegExp(`terms/${target}$`));await expect(page.locator('article h1')).not.toBeEmpty();
    }
    for(const id of ['dom','generator','join','public-ip','cidr','ssh-key']){await page.goto('/#/terms/'+id);await expect(page.locator('.rich-figure svg')).toHaveCount(1);}
    expect(errors).toEqual([]);
  });
}
test('responsive breakpoint changes',async({page})=>{
  await page.goto('/#/terms/packet');
  for(const width of [701,700,390,1280]){await page.setViewportSize({width,height:844});await expect(page.locator('.rich-figure')).toHaveAttribute('data-variant',width<=700?'mobile':'desktop');}
});
