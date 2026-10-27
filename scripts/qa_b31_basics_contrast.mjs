import {chromium} from '@playwright/test';
import {writeFileSync} from 'node:fs';
const browser=await chromium.launch({channel:'chrome'}), results=[];
try {
 for(const theme of ['forest','indigo','paper','signal']) for(const colorScheme of ['light','dark']) {
  const context=await browser.newContext({viewport:{width:1280,height:900},colorScheme});
  const page=await context.newPage();
  await page.goto(`${process.env.B31_QA_URL??'http://127.0.0.1:4182'}/#/missions/main-M05/story-map/concepts?view=basics&node=bas:tcp`);
  await page.locator('.learning-focus-menu summary').click();
  await page.getByLabel('화면 테마',{exact:true}).selectOption(theme);
  await page.locator('.learning-focus-menu summary').click();
  const measurements=await page.evaluate(()=>{
   const rgb=s=>s.match(/[\d.]+/g).slice(0,3).map(Number);
   const luminance=s=>rgb(s).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0);
   const contrast=(fg,bg)=>{const a=luminance(fg),b=luminance(bg);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);};
   const background=el=>{for(let p=el;p;p=p.parentElement){const c=getComputedStyle(p).backgroundColor;if(c!=='transparent'&&c!=='rgba(0, 0, 0, 0)')return c;}return 'rgb(255,255,255)';};
   const html=[...document.querySelectorAll('.cm-views button,.cm-detail-body h2,.cm-detail-body h3,.cm-detail-body p,.cm-applied button')].filter(el=>el.getBoundingClientRect().height>0).map(el=>({text:el.textContent,ratio:contrast(getComputedStyle(el).color,background(el))}));
   const svg=[...document.querySelectorAll('.map-node.is-selected,.map-node.is-highlighted,.map-node.is-contrast')].flatMap(el=>[...el.querySelectorAll('text')].map(t=>({text:t.textContent,ratio:contrast(getComputedStyle(t).fill,getComputedStyle(el.querySelector('rect')).fill)})));
   const regions=[...document.querySelectorAll('.map-region')].map(el=>({text:el.querySelector('text').textContent,ratio:contrast(getComputedStyle(el.querySelector('text')).fill,getComputedStyle(el.querySelector('rect')).fill)}));
   return {html,svg,regions};
  });
  const failures=Object.entries(measurements).flatMap(([kind,items])=>items.filter(i=>i.ratio<4.5).map(i=>({kind,...i})));
  results.push({theme,colorScheme,minContrast:Math.min(...Object.values(measurements).flat().map(i=>i.ratio)),failures});
  await context.close();
 }
} finally {await browser.close();}
writeFileSync('reports/b3-1-network-basics-map-web/contrast.json',JSON.stringify(results,null,2)+'\n');
console.log(JSON.stringify(results,null,2));
if(results.some(r=>r.failures.length))process.exitCode=1;
