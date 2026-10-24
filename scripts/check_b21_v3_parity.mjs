// The acceptance contract is fixed in src/b21StoryV3/components/U2-QA.md.
import { chromium } from '@playwright/test';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { createServer } from 'vite';
import { fileURLToPath } from 'node:url';
import { resolve, join } from 'node:path';
import { inflateSync } from 'node:zlib';

const root=fileURLToPath(new URL('../',import.meta.url));
const output=resolve(root,'node_modules/.cache/b21-v3-parity');
await mkdir(output,{recursive:true});
const htmlURL=new URL('../drafts/b2-1-story-map/v3/teaching-preview/index.html',import.meta.url).href;
const mobileCSS=(await readFile(resolve(root,'src/b21StoryV3/b21StoryV3.css'),'utf8')).split('/* U2 intentional mobile changes:')[1];
const adjustment='/* U2 intentional mobile changes:'+mobileCSS;
const channel=process.env.B21_BROWSER_CHANNEL||'chrome';
const hostCSS=(await Promise.all(['src/styles.css','src/repair.css'].map(path=>readFile(resolve(root,path),'utf8')))).join('\n').replaceAll('url("./assets/','url("http://127.0.0.1:4179/@fs/'+root+'/src/assets/');
// Self-contained PNG decoder for Chrome's 8-bit RGB/RGBA screenshots, all PNG row filters.
function png(buffer){
 let width,height,bpp,idat=[];
 for(let p=8;p<buffer.length;){const n=buffer.readUInt32BE(p),type=buffer.toString('ascii',p+4,p+8),data=buffer.subarray(p+8,p+8+n);p+=n+12;
  if(type==='IHDR'){width=data.readUInt32BE(0);height=data.readUInt32BE(4);bpp=data[9]===6?4:data[9]===2?3:0;if(data[8]!==8||!bpp)throw Error('Unsupported screenshot PNG');}
  if(type==='IDAT')idat.push(data);
 }
 const raw=inflateSync(Buffer.concat(idat)),stride=width*bpp,pixels=Buffer.alloc(stride*height);let p=0;
 const paeth=(a,b,c)=>{const v=a+b-c,pa=Math.abs(v-a),pb=Math.abs(v-b),pc=Math.abs(v-c);return pa<=pb&&pa<=pc?a:pb<=pc?b:c;};
 for(let y=0;y<height;y++){const f=raw[p++];for(let x=0;x<stride;x++){const i=y*stride+x,a=x>=bpp?pixels[i-bpp]:0,b=y?pixels[i-stride]:0,c=y&&x>=bpp?pixels[i-stride-bpp]:0;pixels[i]=(raw[p++]+(f===0?0:f===1?a:f===2?b:f===3?Math.floor((a+b)/2):paeth(a,b,c)))&255;}}
 return {width,height,bpp,pixels};
}
function difference(a,b){const x=png(a),y=png(b);if(x.width!==y.width||x.height!==y.height)throw Error('Screenshot size mismatch');let changed=0;for(let i=0;i<x.width*x.height;i++){let differs=false;for(let c=0;c<3;c++)if(Math.abs(x.pixels[i*x.bpp+c]-y.pixels[i*y.bpp+c])>16)differs=true;if(differs)changed++;}return changed/(x.width*x.height);}
let assertions=0;const errors=[],external=[],failures=[],screens=[],scroll=[];
const check=(ok,message)=>{assertions++;if(!ok){failures.push(message);throw Error(message);}};
const norm=s=>s.replace(/\s+/g,' ').trim();
let ownServer;
try{const response=await fetch('http://127.0.0.1:4179/');if(!response.ok)throw Error('Unavailable');}
catch{ownServer=spawn(process.execPath,[resolve(root,'scripts/b21_preview.mjs')],{cwd:root,stdio:'ignore'});for(let i=0;i<100;i++){try{if((await fetch('http://127.0.0.1:4179/')).ok)break;}catch{}await new Promise(r=>setTimeout(r,100));}}
const loader=await createServer({root,configFile:false,server:{middlewareMode:true,hmr:false,ws:false},appType:'custom',optimizeDeps:{noDiscovery:true,include:[]},logLevel:'error'});
const {scenes}=await loader.ssrLoadModule('/src/b21StoryV3/content/index.ts');
const browser=await chromium.launch({channel,headless:true});
const sample=process.env.B21_V3_CASES?.split(',');
const summary={status:'RUNNING',mode:sample?'sample':'full',criteria:{channelThreshold:16,maxPixelRatio:0.001},screens,scroll,failures,errors,external};
const shot=async p=>{await p.mouse.move(0,0);return p.screenshot({animations:'disabled',caret:'hide'});};
const snapshot=async p=>p.evaluate(()=>{
 const text=id=>{const node=document.getElementById(id).cloneNode(true);if(id==='stage')for(const row of node.querySelectorAll('table,thead,tbody,tr'))for(const child of [...row.childNodes])if(child.nodeType===3&&!child.textContent.trim())child.remove();return node.textContent.replace(/\s+/g,' ').trim();};
 return {q:text('q'),pos:text('pos'),say:text('say'),stage:text('stage'),note:text('noteBody'),tag:text('tag'),
  emphasis:[...document.querySelectorAll('#stage [aria-pressed],#stage .on,#stage .sel,#stage .mark,#stage .cur,#stage .new,#stage .upd,#stage .del')].map(e=>({tag:e.tagName,cls:e.className,pressed:e.getAttribute('aria-pressed'),text:e.textContent.replace(/\s+/g,' ').trim()}))};
});
try{
 for(const width of [1280,390,360]){
  const context=await browser.newContext({viewport:{width,height:width===1280?720:800},deviceScaleFactor:1,reducedMotion:'reduce'});
  const a=await context.newPage(),b=await context.newPage();
  b.on('pageerror',e=>errors.push(e.message));b.on('console',m=>{if(['error','warning'].includes(m.type()))errors.push(m.text());});
  b.on('request',r=>{if(/^https?:/.test(r.url())&&!r.url().startsWith('http://127.0.0.1:4179/'))external.push(r.url());});
  const open=async(sc,i)=>{
   const scene=scenes[sc],token=scene.addressing==='id'?scene.steps[i].id:String(i+1);
   await Promise.all([a.goto(`${htmlURL}#${sc+1}-${token}`),b.goto(`http://127.0.0.1:4179/?view=v3&scene=${scene.id}&step=${token}`)]);
   await a.reload();
   await Promise.all([a.evaluate(()=>document.fonts.ready),b.evaluate(()=>document.fonts.ready)]);
   await b.locator('#stage > *').first().waitFor();
   await b.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
  };
  for(const [sc,scene] of scenes.entries())for(const [i,step] of scene.steps.entries()){
   const key=`${scene.id}:${i+1}`;if(sample&&!sample.includes(key))continue;
   await open(sc,i);const name=`${width}-${scene.id}-${i+1}`;
   const original=await shot(a);await writeFile(join(output,`${name}-original.png`),original);
   if(width<641){await a.evaluate(()=>document.body.classList.add('b21t'));await a.addStyleTag({content:adjustment});}
   const reference=await snapshot(a),actual=await snapshot(b);
   for(const field of Object.keys(reference))check(JSON.stringify(actual[field])===JSON.stringify(reference[field]),`${name}: ${field} mismatch\n${JSON.stringify(actual[field])}\n${JSON.stringify(reference[field])}`);
   const referencePNG=await shot(a),reactPNG=await shot(b);const ratio=difference(referencePNG,reactPNG);
   await writeFile(join(output,`${name}-reference.png`),referencePNG);await writeFile(join(output,`${name}-react.png`),reactPNG);
   screens.push({width,scene:scene.id,step:i+1,pixelRatio:ratio,intentionalMobileRatio:width<641?difference(original,referencePNG):0});
   check(ratio<=0.001,`${name}: screenshot difference ${ratio} > 0.001`);
   const metrics=await b.evaluate(()=>{
    const visible=e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return r.width>0&&r.height>0&&s.visibility!=='hidden'&&s.display!=='none'&&r.right>0&&r.left<innerWidth;};
    const buttons=[...document.querySelectorAll('#stage button:not([aria-disabled="true"])')].filter(visible);
    const small=buttons.filter(e=>{const r=e.getBoundingClientRect();return r.width<43.99||r.height<43.99;}).map(e=>[e.textContent,e.getBoundingClientRect().width,e.getBoundingClientRect().height]);
    const tiny=[...document.querySelectorAll('#stage *')].filter(e=>visible(e)&&[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())&&parseFloat(getComputedStyle(e).fontSize)<12).map(e=>[e.textContent,getComputedStyle(e).fontSize]);
    const clipped=[...document.querySelectorAll('#stage code,#stage .fn,#stage .ko,#stage .lbl,#stage .am,#stage .mm,#stage th,#stage td')].filter(e=>visible(e)&&e.scrollWidth>e.clientWidth+1).map(e=>e.textContent);
    const stage=document.getElementById('stage').getBoundingClientRect(),fig=document.querySelector('#stage > *').getBoundingClientRect();
    return {overflow:document.documentElement.scrollWidth>innerWidth,height:document.documentElement.scrollHeight,small,tiny,clipped,inside:fig.top>=stage.top-1&&fig.bottom<=stage.bottom+1};
   });
   check(!metrics.overflow,`${name}: horizontal overflow`);check(!metrics.clipped.length,`${name}: clipped ${metrics.clipped}`);
   if(width===1280){check(metrics.height<=720,`${name}: PC scroll`);check(metrics.inside,`${name}: stage overlap`);}
   else {check(!metrics.small.length,`${name}: touch targets ${JSON.stringify(metrics.small)}`);check(!metrics.tiny.length,`${name}: tiny labels ${JSON.stringify(metrics.tiny)}`);if(metrics.height>800){
     const wholeA=await a.screenshot({fullPage:true,animations:'disabled',caret:'hide'}),wholeB=await b.screenshot({fullPage:true,animations:'disabled',caret:'hide'});
     await writeFile(join(output,`${name}-full-reference.png`),wholeA);await writeFile(join(output,`${name}-full-react.png`),wholeB);
     const fullRatio=difference(wholeA,wholeB);check(fullRatio<=0.001,`${name}: full mobile page difference ${fullRatio}`);scroll.push({name,height:metrics.height,pixelRatio:fullRatio});
    }}
   if(step.reveal){
    const revealA=a.locator('#stage [data-reveal]'),revealB=b.locator('#stage [data-focus-key="reveal"]');
    check(await revealB.count()===1,`${name}: reveal control`);await revealA.click();await revealB.click();
    check(norm(await a.locator('#stage').innerText())===norm(await b.locator('#stage').innerText()),`${name}: disclosed answer text`);
    const revealRatio=difference(await shot(a),await shot(b));check(revealRatio<=0.001,`${name}: disclosed answer screenshot ${revealRatio}`);
   }
   if(i===0){
    await a.locator('#noteBtn').click();await b.locator('#noteBtn').click();
    await a.locator('#note.on').waitFor();await b.locator('#note.on').waitFor();
    const noteRatio=difference(await shot(a),await shot(b));check(noteRatio<=0.001,`${name}: note drawer screenshot ${noteRatio}`);
    await a.keyboard.press('Escape');await b.keyboard.press('Escape');
   }
   if(sample)console.log('sample PASS',name,ratio);
  }
  if(!sample){
   // Every step is reached with React's next control, including scene boundaries.
   await b.goto('http://127.0.0.1:4179/?view=v3');await b.locator('#stage > *').first().waitFor();
   for(const [sc,s]of scenes.entries())for(const [i,t]of s.steps.entries()){
    check((await b.locator('#pos').innerText()).startsWith(`Scene ${s.id} · ${i+1} / ${s.steps.length}`),`${width}: sequential ${s.id}:${i+1}`);
    if(sc!==7||i!==s.steps.length-1)await b.locator('#next').click();
   }
   check(await b.locator('#next').isDisabled(),`${width}: last next disabled`);
   await open(0,0);await b.locator('#tocBtn').click();check(await b.locator('#tocBody button').count()===128,`${width}: 128 TOC entries`);
   await b.keyboard.press('ArrowRight');check((await b.locator('#pos').innerText()).startsWith('Scene 01 · 1 /'),`${width}: TOC suppresses arrows`);
   await b.locator('#tocBody button').nth(60).click();check(await b.locator('#q').evaluate(e=>e===document.activeElement),`${width}: TOC restores question focus`);
   await b.locator('#noteBtn').click();await b.keyboard.press('Escape');check(await b.locator('#noteBtn').evaluate(e=>e===document.activeElement),`${width}: notes Escape focus`);
   await open(0,2);await b.locator('[data-focus-key="part-python"]').click();check((await b.locator('#pos').innerText()).includes('· 4 /'),`${width}: direct selection`);await b.locator('[data-focus-key="part-python"]').click();check((await b.locator('#pos').innerText()).includes('· 3 /'),`${width}: selection toggles home`);
   await b.keyboard.press('End');check((await b.locator('#pos').innerText()).includes('· 13 /'),`${width}: End`);await b.keyboard.press('Home');check((await b.locator('#pos').innerText()).includes('· 1 /'),`${width}: Home`);
   await open(4,19);await b.locator('[data-focus-key="reveal"]').click();await b.locator('#prev').click();await b.locator('#next').click();check(await b.locator('#stage .qa .a:visible').count()===0,`${width}: answers reset`);
   await open(7,8);await b.locator('[data-focus-key="type-R09"]').click();await b.keyboard.press('ArrowRight');check((await b.locator('#pos').innerText()).startsWith('Scene 08 · 11 /'),`${width}: keys after replaced figure controls`);
   await open(4,19);await b.locator('[data-focus-key="reveal"]').click();await b.keyboard.press('ArrowRight');await b.keyboard.press('ArrowRight');check((await b.locator('#pos').innerText()).startsWith('Scene 05 · 22 /'),`${width}: keys after a control unmounts`);
   await open(7,5);await b.locator('[data-focus-key="rev-05-iterable"]').click();check((await b.locator('#pos').innerText()).startsWith('Scene 05 · 2 /'),`${width}: map review`);await b.locator('#backMap').click();check((await b.locator('#pos').innerText()).startsWith('Scene 08 · 6 /'),`${width}: state-only map return`);
   // Actual Owner Preview entry and both version/width selectors.
   await b.goto('http://127.0.0.1:4179/');await b.getByRole('button',{name:'v3 React 강의',exact:true}).click();await b.frameLocator('iframe').locator('.b21t #stage').waitFor();
   for(const value of [1280,390,360]){await b.getByRole('button',{name:`${value===1280?'PC':'모바일'} ${value}px`,exact:true}).click();check(await b.locator('iframe').evaluate((e,w)=>e.getBoundingClientRect().width===w,value),`${width}: Preview width ${value}`);}
   await b.getByLabel('v3 장면',{exact:true}).selectOption('4');await b.getByLabel('v3 단계',{exact:true}).selectOption('1');await b.frameLocator('iframe').locator('#pos').filter({hasText:'Scene 05 · 2 / 22'}).waitFor();check(true,`${width}: Owner scene/step selects actual React entry`);
   await b.getByRole('button',{name:'기존 Foundation',exact:true}).click();check((await b.locator('iframe').getAttribute('src')).includes('view=scene'),`${width}: Foundation remains selectable`);
   check(await b.getByLabel('장면 바로 열기').locator('option:not([disabled])').count()===9,`${width}: Foundation retains all nine units`);
   await b.getByLabel('장면 바로 열기').selectOption('scene-03a');await b.frameLocator('iframe').locator('.b21-story-foundation').waitFor();check((await b.locator('iframe').getAttribute('src')).includes('scene-03a'),`${width}: Foundation 03a selection`);
   await open(0,2);const clean=await shot(b);await b.addStyleTag({content:hostCSS+'\nbody{font-weight:430;line-height:1.72;letter-spacing:-.008em}h1{font:italic 60px serif;color:red;background:purple;margin:50px}button{font:50px serif;color:red;background:purple;border:20px solid red;padding:30px}'});await b.evaluate(()=>document.fonts.ready);check(difference(clean,await shot(b))<=0.001,`${width}: global author CSS cannot alter lesson`);
  }
  await context.close();console.log('width completed',width);
 }
 check(!errors.length,`browser errors/warnings ${JSON.stringify(errors)}`);check(!external.length,`external requests ${external}`);
 if(!sample)check(screens.length===384,'384 screenshots compared');summary.status='PASS';
}catch(error){summary.status='FAIL';if(!failures.includes(error.message))failures.push(error.stack??error.message);process.exitCode=1;}
finally{await browser.close();await loader.close();if(ownServer)ownServer.kill('SIGTERM');summary.assertions=assertions;await writeFile(join(output,'results.json'),JSON.stringify(summary,null,2));console.log(JSON.stringify({status:summary.status,mode:summary.mode,screens:screens.length,assertions,failures,errors,output}));}
