// Verify the applied Scene 04 fix against the exact U3-C source in installed Chrome.
import { chromium } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = resolve(root, 'node_modules/.cache/b21-u3-d');
await mkdir(output, { recursive: true });
const baseline = '3e177789252c0c071cce0420c09cdb37e7d4375b';
const path = 'drafts/b2-1-story-map/v3/teaching-preview/index.html';
const before = execFileSync('git', ['show', `${baseline}:${path}`], { cwd: root, encoding: 'utf8' });
const after = (await readFile(resolve(root, path), 'utf8')).replace(/\r\n/g, '\n');
const approvedCSS = '@media (max-width:360px){.mf>.pane{min-width:0}}\n';
if (after.replace(approvedCSS, '') !== before) throw Error('HTML changed beyond the approved CSS');
await writeFile(resolve(output, 'before.html'), before);
const browser = await chromium.launch({ channel: process.env.B21_BROWSER_CHANNEL || 'chrome', headless: true });
const results = [], failures = [];
let assertions = 0;
const check = (ok, label) => { assertions++; if (!ok) failures.push(label); };
async function metrics(page) {
  return page.evaluate(() => {
    const rect = e => { const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom}; };
    const panes=[...document.querySelectorAll('.mf>.pane')];
    const problems=[], overlaps=[];
    for(const pane of panes){
      const bounds=pane.getBoundingClientRect(),s=getComputedStyle(pane);
      for(const label of pane.querySelectorAll('.rec .no,.rec .mm,.rec .am')){
        const range=document.createRange();range.selectNodeContents(label);
        if([...range.getClientRects()].some(r=>r.left<bounds.left+parseFloat(s.borderLeftWidth)||r.right>bounds.right-parseFloat(s.borderRightWidth)))problems.push(label.textContent);
      }
      for(const row of pane.querySelectorAll('.rec')){
        const memo=row.querySelector('.mm')?.getBoundingClientRect(),amount=row.querySelector('.am')?.getBoundingClientRect();
        if(memo&&amount&&memo.right>amount.left)overlaps.push(row.textContent);
      }
    }
    const cards=panes.map(rect), grid=document.querySelector('.mf');
    return {documentWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth,innerWidth,columns:getComputedStyle(grid).gridTemplateColumns,gap:getComputedStyle(grid).gap,panes:cards,clippedText:problems,textOverlaps:overlaps,buttonsOverlap:cards[0].right>cards[1].x,stageText:document.querySelector('#stage').textContent,say:document.querySelector('#say').textContent};
  });
}
try {
  for (const width of [1280,390,360]) {
    const context=await browser.newContext({viewport:{width,height:width===1280?720:800},isMobile:width<640,hasTouch:width<640,deviceScaleFactor:1,reducedMotion:'reduce'});
    try {
      const a=await context.newPage(),b=await context.newPage();
      for(const step of [1,2,4]){
        await Promise.all([a.goto(pathToFileURL(resolve(output,'before.html')).href+`#4-${step}`),b.goto(pathToFileURL(resolve(root,path)).href+`#4-${step}`)]);
        await Promise.all([a.reload(),b.reload()]);
        await Promise.all([a.evaluate(()=>document.fonts.ready),b.evaluate(()=>document.fonts.ready)]);
        await Promise.all([a.mouse.move(0,0),b.mouse.move(0,0)]);
        const previous=await metrics(a),current=await metrics(b);
        const oldPNG=await a.screenshot({fullPage:true,animations:'disabled'}),newPNG=await b.screenshot({fullPage:true,animations:'disabled'});
        await writeFile(resolve(output,`${width}-04-${step}-before.png`),oldPNG);await writeFile(resolve(output,`${width}-04-${step}-after.png`),newPNG);
        const label=`${width} Scene 04-${step}`;
        check(current.documentWidth===width,label+' exact document width');
        check(!current.clippedText.length,label+' all record text inside pane');
        check(!current.textOverlaps.length,label+' memo and amount do not overlap');
        check(!current.buttonsOverlap,label+' buttons do not overlap');
        check(previous.stageText===current.stageText&&previous.say===current.say,label+' exact stage and sentence text');
        check(previous.panes.every((p,i)=>p.height===current.panes[i].height),label+' same pane heights');
        if(width!==360)check(oldPNG.equals(newPNG),label+' byte-identical full-page screenshot');
        results.push({width,step,before:previous,after:current,byteIdenticalScreenshot:oldPNG.equals(newPNG)});
      }
    } finally { await context.close(); }
  }
} finally {
  await browser.close();
  const report={status:failures.length?'FAIL':'PASS',browser:browser.version(),baseline,assertions,failures,results};
  await writeFile(resolve(output,'visuals.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({status:report.status,assertions,failures}));if(failures.length)process.exitCode=1;
}
