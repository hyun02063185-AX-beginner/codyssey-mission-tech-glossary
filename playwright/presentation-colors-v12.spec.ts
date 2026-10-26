import {test,expect} from '@playwright/test';
import {writeFileSync,mkdirSync} from 'node:fs';
import {scene01} from '../src/b21StoryV3/content/scene01';
import {scene02} from '../src/b21StoryV3/content/scene02';
import {scene03} from '../src/b21StoryV3/content/scene03';
import {scene04} from '../src/b21StoryV3/content/scene04';
import {scene05} from '../src/b21StoryV3/content/scene05';
import {scene06} from '../src/b21StoryV3/content/scene06';
import {scene07} from '../src/b21StoryV3/content/scene07';
import {scene08} from '../src/b21StoryV3/content/scene08';
const scenes=[scene01,scene02,scene03,scene04,scene05,scene06,scene07,scene08];
test.describe.configure({mode:'parallel'});
const out='reports/mission-story-ui-v12';mkdirSync(out,{recursive:true});
for(const width of [1280,360])test(`${width}: Dark/Light contrast and unchanged geometry across 128 steps`,async({page})=>{
 test.setTimeout(240000);await page.setViewportSize({width,height:width===1280?720:800});await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/#/missions/main-M03/story');await page.evaluate(()=>localStorage.setItem('codyssey-presentation-theme','dark'));
 const geometries=new Map<string,string>(),rows:unknown[]=[],failures:unknown[]=[];
 for(const theme of ['dark','light']){
  await page.evaluate(theme=>localStorage.setItem('codyssey-presentation-theme',theme),theme);await page.reload();
  for(const scene of scenes)for(const [index,step]of scene.steps.entries()){
   const key=`${scene.id}-${step.id}`,token=scene.addressing==='id'?step.id:String(index+1);
   await page.goto(`/#/missions/main-M03/story?scene=${scene.id}&step=${token}`);await expect(page.locator('#pos')).toContainText(`Scene ${scene.id} · ${index+1} /`);await page.evaluate(()=>document.fonts.ready);
   await expect(page.locator('.mission-presentation')).toHaveAttribute('data-presentation-theme',theme);
   const metrics=await page.locator('.b21t').evaluate(el=>JSON.stringify(['.app','#q','#stage','#say','#stage *'].flatMap(sel=>[...el.querySelectorAll(sel)]).map(n=>{const s=getComputedStyle(n),r=n.getBoundingClientRect(),round=(v:number)=>Math.round(v*100)/100;return [n.tagName,round(r.width),round(r.height),s.fontFamily,s.fontSize,s.fontWeight,s.lineHeight];})));
   if(theme==='dark')geometries.set(key,metrics);else expect(metrics,`${width} ${key} theme geometry`).toBe(geometries.get(key));
   {
    const bad=await page.locator('.b21t #stage,.b21t #q,.b21t #say').evaluateAll(roots=>{
     const luminance=(rgb:number[])=>rgb.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0);
     const rgb=(color:string)=>color.match(/[\d.]+/g)!.map(Number);
     const failures:unknown[]=[];
     for(const root of roots)for(const el of [root,...root.querySelectorAll('*')]){
      const s=getComputedStyle(el),r=el.getBoundingClientRect();if(!r.width||!r.height||s.visibility!=='visible'||!Array.from(el.childNodes).some(n=>n.nodeType===3&&n.textContent?.trim())||el.closest('.dim,.off,[aria-disabled=true],button:disabled'))continue;
      let opacity=1;for(let p:Element|null=el;p;p=p.parentElement)opacity*=Number(getComputedStyle(p).opacity);if(opacity<.99)continue;
      let background:number[]|null=null;for(let p:Element|null=el;p;p=p.parentElement){const c=rgb(getComputedStyle(p).backgroundColor),box=p.getBoundingClientRect(),cx=r.x+r.width/2,cy=r.y+r.height/2;if(cx<box.left||cx>box.right||cy<box.top||cy>box.bottom)continue;if(c.length<4||c[3]===1){background=c.slice(0,3);break;}}
      if(!background)continue;const ink=luminance(rgb(s.color).slice(0,3)),paper=luminance(background),ratio=(Math.max(ink,paper)+.05)/(Math.min(ink,paper)+.05),large=parseFloat(s.fontSize)>=24||parseFloat(s.fontSize)>=18.66&&Number(s.fontWeight)>=700;
      if(ratio<(large?3:4.5))failures.push({text:el.textContent?.trim().slice(0,90),class:el.className,ink:s.color,background,ratio,size:s.fontSize});
     }
     return failures;
    });
    if(bad.length)failures.push({key,theme,bad});
    if(theme==='dark'&&index===0)await page.screenshot({path:`${out}/${width}-scene-${scene.id}-dark.png`,fullPage:true});
    rows.push({key,theme,contrastFailures:bad.length});
   }
  }
 }
 writeFileSync(`${out}/${width}-slide-colors.json`,JSON.stringify({width,steps:geometries.size,failures,rows},null,2));expect(failures).toEqual([]);
});
