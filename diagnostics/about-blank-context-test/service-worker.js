const MENU_ID='test-selection';

async function registerMenu(){
  await chrome.contextMenus.removeAll();
  await chrome.contextMenus.create({
    id:MENU_ID,
    title:'선택 문자열 테스트: %s',
    contexts:['selection'],
    enabled:true,
  });
}

chrome.runtime.onInstalled.addListener(registerMenu);
chrome.runtime.onStartup.addListener(registerMenu);
registerMenu();

chrome.contextMenus.onClicked.addListener(async(info,tab)=>{
  if(info.menuItemId!==MENU_ID)return;
  const received={
    selectionText:info.selectionText,
    pageUrl:info.pageUrl,
    frameUrl:info.frameUrl,
    tabId:tab?.id,
    windowId:tab?.windowId,
    receivedAt:Date.now(),
  };
  await chrome.storage.local.set({lastSelectionContextMenuEvent:received});
  console.log('Codyssey about:blank context-menu diagnostic',received);
});
