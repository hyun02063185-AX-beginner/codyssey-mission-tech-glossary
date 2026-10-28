// Load the built MV3 extension with real chrome.storage and its service worker.
// No stubs, injected term data, or replacement side-panel renderer are used.
import {chromium,expect} from '@playwright/test';
import {resolve} from 'node:path';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
const batchC=process.argv.includes('--fast-batch-c');
const batchB=process.argv.includes('--fast-batch-b');
const batchA=process.argv.includes('--fast-batch-a');
const out=batchC?'test-results/fast-batch-c-extension':batchB?'test-results/fast-batch-b-extension':batchA?'test-results/fast-batch-a-extension':'reports/glossary-visual/b6-1-p0-web';mkdirSync(out,{recursive:true});
const root=resolve('dist-extension'),book=JSON.parse(readFileSync(resolve(root,'openbook-main-m01.json'),'utf8'));
const terms=JSON.parse(readFileSync(resolve(root,'glossary.json'),'utf8'));
const context=await chromium.launchPersistentContext('',{channel:'chromium',headless:true,viewport:{width:390,height:844},args:[`--disable-extensions-except=${root}`,`--load-extension=${root}`]});
const result={status:'RUNNING',quickTerms:[],visualTerms:[],errors:[]};
try{
  let worker=context.serviceWorkers()[0];worker??=await context.waitForEvent('serviceworker');
  const page=await context.newPage();page.on('pageerror',error=>result.errors.push(error.message));
  await page.goto(new URL('sidepanel.html',worker.url()).href);await expect(page.locator('.req')).toHaveCount(book.requirements.length);await expect(page.locator('.quick a')).toHaveCount(23);
  for(const id of book.quick_terms){
    await page.locator('[data-tab="requirements"]').click();await page.locator(`.quick [data-term="${id}"]`).click();
    const item=terms.find(term=>term.id===id);await expect(page.locator('.result').first().locator(':scope > b')).toHaveText(item.termKo);
    await page.locator('.result').first().locator('.detail summary').click();
    await expect(page.locator('.result').first()).toContainText(book.quick_term_context[id].mission_relevance);
    await expect(page.locator('.result').first()).toContainText(item.easyExplanation);result.quickTerms.push(id);
  }
  for(const id of ['erd','foreign-key','join','cidr','ssh-key',...(batchC?['packet','responsive-web-design']:[]),...(batchB?['public-ip','private-ip']:[]),...(batchA?['primary-key','inner-join','left-join','dom','event-handler','generator']:[])]){
    const item=terms.find(term=>term.id===id);await page.locator('#q').fill(item.termKo);const card=page.locator('.result').first();await expect(card.locator(':scope > b')).toHaveText(item.termKo);await card.locator('.detail summary').click();
    await expect(card).not.toContainText('![');await expect(card).toContainText(item.easyExplanation);await expect(card).toContainText(item.technicalExplanation);await expect(card.locator('svg,img')).toHaveCount(0);
    if(id==='erd')await expect(card.locator('pre')).toContainText('student ||────o< enrollment >o────|| course');
    if(id==='join')await expect(card).toContainText('26행');
    if(!batchA&&!batchB&&!batchC&&['erd','foreign-key','join'].includes(id))await page.screenshot({path:`${out}/extension-${id}.png`,fullPage:true});
    const related=card.locator('[data-term]').first(),target=await related.getAttribute('data-term');await related.click();await expect(page.locator('.result').first().locator(':scope > b')).toHaveText(terms.find(term=>term.id===target).termKo);
    result.visualTerms.push(id);
  }
  await page.locator('#q').fill('<img src=x onerror=alert(1)>');await expect(page.locator('#results img')).toHaveCount(0);await expect(page.locator('.unknown b')).toHaveText('<img src=x onerror=alert(1)>');
  expect(result.errors).toEqual([]);result.status='PASS';result.browser=context.browser()?.version();console.log(JSON.stringify(result));
}catch(error){result.status='FAIL';result.error=error.stack;console.error(error);process.exitCode=1;}
finally{writeFileSync(`${out}/extension-results.json`,JSON.stringify(result,null,2));await context.close();}
