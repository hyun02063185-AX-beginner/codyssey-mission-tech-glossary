const PENDING_QUERY_KEY='openbookPendingQuery';
const DIAGNOSTIC_KEY='openbookLookupDiagnostic';
const MENU_ID='lookup';
const normalizeQuery=value=>String(value||'').replace(/\s+/g,' ').trim();

async function registerLookupMenu(){
  await chrome.contextMenus.removeAll();
  await chrome.contextMenus.create({id:MENU_ID,title:'코디세이 사전에서 찾기',contexts:['selection'],enabled:true});
}
let menuRegistration=Promise.resolve();
const refreshLookupMenu=()=>menuRegistration=menuRegistration.then(registerLookupMenu).catch(registerLookupMenu);
chrome.sidePanel.setPanelBehavior({openPanelOnActionClick:true});
chrome.runtime.onInstalled.addListener(refreshLookupMenu);
chrome.runtime.onStartup.addListener(refreshLookupMenu);
refreshLookupMenu();

function buildPendingQueryPayload(rawQuery,source='context-menu'){
  const query=normalizeQuery(rawQuery);
  return query?{query,rawQuery:String(rawQuery||''),source,requestedAt:Date.now(),requestId:crypto.randomUUID()}:null;
}
async function savePendingQuery(rawSelectionText,source='context-menu'){
  const query=normalizeQuery(rawSelectionText);
  const diagnostic={rawSelectionText:String(rawSelectionText||''),normalizedQuery:query,source,recordedAt:Date.now()};
  if(!query){await chrome.storage.session.set({[DIAGNOSTIC_KEY]:{...diagnostic,storageWrite:false}});return null;}
  const pending=buildPendingQueryPayload(rawSelectionText,source);
  await chrome.storage.session.set({[PENDING_QUERY_KEY]:pending,[DIAGNOSTIC_KEY]:{...diagnostic,storageWrite:true,pendingQuery:query}});
  return pending;
}
async function isSidePanelOpen(){
  if(!chrome.runtime.getContexts)return false;
  return (await chrome.runtime.getContexts({contextTypes:['SIDE_PANEL']})).length>0;
}
async function openMainCodysseyPanel(){
  const tabs=await chrome.tabs.query({url:['https://usr.codyssey.kr/*']});
  const target=tabs.find(tab=>tab.windowId!==undefined);
  if(target)await chrome.sidePanel.open({windowId:target.windowId}).catch(()=>{});
}
async function handleContextSelection(info){
  if(info.menuItemId!==MENU_ID)return;
  const pending=await savePendingQuery(info.selectionText);
  if(pending&&!(await isSidePanelOpen()))await openMainCodysseyPanel();
}
chrome.contextMenus.onClicked.addListener(handleContextSelection);
chrome.runtime.onMessage.addListener((message,sender)=>{
  if(message.type==='lookup')savePendingQuery(message.query,'selection-helper');
  if(message.type==='OPENBOOK_CONTENT_SCRIPT_READY')chrome.storage.session.set({openbookContentReady:{origin:sender.origin||message.origin,frameId:sender.frameId||0,at:Date.now()}});
});
