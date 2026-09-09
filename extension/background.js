chrome.sidePanel.setPanelBehavior({openPanelOnActionClick:true});
chrome.runtime.onInstalled.addListener(()=>chrome.contextMenus.create({id:'lookup',title:'코디세이 사전에서 찾기',contexts:['selection']}));
const lookup=query=>chrome.storage.local.set({openbookSearch:query.trim()});
chrome.contextMenus.onClicked.addListener((info,tab)=>{
  if(info.menuItemId!=='lookup'||!info.selectionText)return;
  lookup(info.selectionText);
  if(tab?.windowId!==undefined)chrome.sidePanel.open({windowId:tab.windowId}).catch(()=>{});
});
chrome.runtime.onMessage.addListener((message,sender)=>{
  if(message.type==='lookup')lookup(message.query||'');
  if(message.type==='OPENBOOK_CONTENT_SCRIPT_READY')chrome.storage.session.set({openbookContentReady:{url:sender.url||message.url,origin:sender.origin||message.origin,frameId:sender.frameId||0,at:Date.now()}});
});
