import {expect} from '@playwright/test';
export async function explorerMenu(page){const menu=page.locator('.b21ce-menu');if(await menu.getAttribute('open')===null)await menu.locator('summary').click();}
export async function explorerPanel(page,tab='상세'){
 if(!await page.locator('.b21ce-panel').isVisible())await page.locator('.b21ce-panel-toggle').click();
 await page.getByRole('tab',{name:tab,exact:true}).click();
}
export async function explorerSelect(page,id,detail=true){
 await page.getByLabel('모든 개념 찾기',{exact:true}).selectOption(id);
 await expect(page.locator(`[data-explorer-node="${id}"]`)).toHaveAttribute('aria-pressed','true');
 if(detail)await explorerPanel(page);
}
