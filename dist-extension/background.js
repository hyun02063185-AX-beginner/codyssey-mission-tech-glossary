const PENDING_QUERY_KEY='openbookPendingQuery';
chrome.sidePanel.setPanelBehavior({openPanelOnActionClick:true});
chrome.runtime.onInstalled.addListener(()=>chrome.contextMenus.create({id:'lookup',title:'코디세이 사전에서 찾기',contexts:['selection']}));
const normalizeQuery=value=>String(value||'').replace(/\s+/g,' ').trim();
const handoff=async(rawSelection,source='context-menu')=>{
  const query=normalizeQuery(rawSelection);
  if(!query)return null;
  const payload={query,source,requestedAt:Date.now(),requestId:crypto.randomUUID()};
  await chrome.storage.session.set({[PENDING_QUERY_KEY]:payload});
  return payload;
};
chrome.contextMenus.onClicked.addListener(async(info,tab)=>{
  if(info.menuItemId!=='lookup')return;
  const pending=await handoff(info.selectionText);
  if(pending&&tab?.windowId!==undefined)await chrome.sidePanel.open({windowId:tab.windowId}).catch(()=>{});
});
chrome.runtime.onMessage.addListener((message,sender)=>{
  if(message.type==='lookup')handoff(message.query,'selection-helper');
  if(message.type==='OPENBOOK_CONTENT_SCRIPT_READY')chrome.storage.session.set({openbookContentReady:{origin:sender.origin||message.origin,frameId:sender.frameId||0,at:Date.now()}});
});
