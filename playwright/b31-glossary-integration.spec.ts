import {test,expect} from '@playwright/test';
import {mkdirSync,readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
const output='reports/b31-glossary-integration';mkdirSync(output,{recursive:true});
const terms=JSON.parse(readFileSync('src/data/generated/glossary.json','utf8')) as Array<{id:string;termKo:string;missionRefs:Array<{course:string;mission:string;source_status:string}>;hasDetailedContent:boolean}>;
const newIds=['ip-address','private-ip','packet','network-protocol'];

test('523 generated terms preserve every existing ID and approved B3-1 references',()=>{
 const old=JSON.parse(execFileSync('git',['show','8e58d32:src/data/generated/glossary.json'],{encoding:'utf8',maxBuffer:32*1024*1024})) as Array<{id:string}>;
 expect(old).toHaveLength(519);expect(terms).toHaveLength(523);expect(new Set(terms.map(t=>t.id)).size).toBe(523);
 expect(terms.filter(t=>!old.some(o=>o.id===t.id)).map(t=>t.id).sort()).toEqual([...newIds].sort());
 for(const t of old)expect(terms.some(n=>n.id===t.id),t.id).toBe(true);
 for(const id of newIds){const t=terms.find(t=>t.id===id)!;expect(t.hasDetailedContent).toBe(true);expect(t.missionRefs).toContainEqual(expect.objectContaining({course:'main',mission:'M05',source_status:'related'}));}
 for(const id of ['tcp','http','socket-port'])expect(terms.find(t=>t.id===id)!.missionRefs).toContainEqual(expect.objectContaining({course:'main',mission:'M05'}));
 const extension=JSON.parse(readFileSync('dist-extension/glossary.json','utf8'));expect(extension).toEqual(terms);
});

for(const width of [1280,390])test(`${width}: four new terms are searchable and their detailed pages render`,async({page})=>{
 await page.setViewportSize({width,height:width===1280?720:844});const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 for(const id of newIds){
  const term=terms.find(t=>t.id===id)!;await page.goto('/#/terms?q='+encodeURIComponent(term.termKo));
  const link=page.locator(`a.row[href="#/terms/${id}"]`);await expect(link).toBeVisible();await link.click();await expect(page.getByRole('heading',{level:1,exact:true,name:term.termKo})).toBeVisible();
  await expect(page.locator('main')).toContainText('B3-1');expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);
  await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:`${output}/${width}-${id}.png`});
  await page.goBack();await expect(page.locator('#q')).toHaveValue(term.termKo);
 }
 expect(errors).toEqual([]);
});

async function extensionPage(page:import('@playwright/test').Page){
 await page.addInitScript(()=>{
  Object.assign((window as any).chrome??((window as any).chrome={}),{storage:{local:{get:(_keys:unknown,done:(v:unknown)=>void)=>done({m01Checks:[]}),set:()=>{}},session:{get:(_keys:unknown,done:(v:unknown)=>void)=>done({})},onChanged:{addListener:()=>{}}},search:{query:()=>{}}});
 });
 await page.goto('/dist-extension/sidepanel.html');await page.locator('.progress').waitFor();await page.getByRole('button',{name:'용어검색',exact:true}).click();
}
test('built extension shows the loaded 523 count and searches new and existing terms',async({page})=>{
 await page.setViewportSize({width:390,height:844});await extensionPage(page);await expect(page.locator('#q')).toHaveAttribute('placeholder','523개 기술용어를 검색하세요');
 for(const id of [...newIds,'tcp']){
  const t=terms.find(t=>t.id===id)!;await page.locator('#q').fill(t.termKo);const result=page.locator('.result').filter({has:page.locator('b').filter({hasText:new RegExp('^'+t.termKo+'$')})}).first();
  await expect(result).toBeVisible();await result.locator('.detail>summary').click();await expect(result.locator('.detail')).toHaveAttribute('open','');
  await expect(result.getByRole('link',{name:'웹에서 자세히 보기 ↗',exact:true})).toHaveAttribute('href',new RegExp('/terms/'+id+'$'));
 }
 await page.locator('#q').fill('');
 await page.screenshot({path:`${output}/extension-523.png`});
 expect(readFileSync('dist-extension/sidepanel.js','utf8')).toBe(readFileSync('extension/sidepanel.js','utf8'));
});
test('built extension derives the hint from a different loaded data size',async({page})=>{
 await page.route('**/dist-extension/glossary.json',route=>route.fulfill({json:JSON.parse(readFileSync('dist-extension/glossary.json','utf8')).filter((t:{id:string})=>['ip-address','packet'].includes(t.id))}));
 await extensionPage(page);await expect(page.locator('#q')).toHaveAttribute('placeholder','2개 기술용어를 검색하세요');await page.locator('#q').fill('패킷');await expect(page.locator('.result').first()).toContainText('패킷');
});
