// Regenerate the approved masters/panels from retained art + the same versioned layout.
// This is an authoring command, never part of the normal app build.
import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=JSON.parse(await fs.readFile(path.join(root,'content/webtoons/episodes.json'),'utf8'));
const css=await fs.readFile(path.join(root,'content/webtoons/template-v1.css'),'utf8');
const escape=text=>text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const format=text=>['AI 모델','프롬프트','배운 패턴','추상화','알고리즘'].reduce((result,key)=>result.replaceAll(key,`<b>${key}</b>`),escape(text));
const requested=new Set(process.argv.slice(2));
const browser=await chromium.launch({headless:true,...(process.env.WEBTOON_CHROME_PATH?{executablePath:process.env.WEBTOON_CHROME_PATH}:{})});
try{
 const page=await browser.newPage({viewport:{width:1536,height:1024},deviceScaleFactor:1});
 for(const episode of source.episodes.filter(item=>item.status==='approved'&&(!requested.size||requested.has(item.id)))){
  const directory=path.join(root,episode.sourceDirectory);
  const short=episode.id.startsWith('prompt-')?'prompt':'model';
  const art=(await fs.readFile(path.join(directory,'art.png'))).toString('base64');
  const panels=episode.panels.map((panel,index)=>`<section class="panel"><div class="scene" style="--x:${index%2?'100%':'0%'};--y:${index>1?'100%':'0%'}"></div><span class="number">${panel.number}</span>${panel.dialogue.map((speech,i)=>`<div class="bubble ${i?'right':'left'}"><span>${format(speech.text)}</span></div>`).join('')}</section>`).join('');
  await page.setContent(`<!doctype html><html lang="ko"><meta charset="utf-8"><style>${css}.scene{background-image:url(data:image/png;base64,${art});${episode.artFit==='contain-scene'?'height:calc(100% - 80px)':''}}</style><div class="comic episode-${short}">${panels}</div></html>`);
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForFunction(()=>[...document.images].every(image=>image.complete));
  await page.waitForTimeout(200);
  await page.screenshot({path:path.join(directory,'master.png')});
  for(let i=0;i<4;i++)await page.locator('.panel').nth(i).screenshot({path:path.join(directory,`panel-${i+1}.png`)});
  console.log(`${episode.id}: master and four panels rendered`);
 }
}finally{await browser.close()}
