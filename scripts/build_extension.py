import json,shutil
from pathlib import Path
r=Path(__file__).resolve().parents[1];o=r/'dist-extension';o.mkdir(exist_ok=True)
for n in ['manifest.json','background.js','content.js','sidepanel.html','sidepanel.js']:shutil.copy2(r/'extension'/n,o/n)
for n in ['glossary.json','openbook-main-m01.json']:shutil.copy2(r/'src/data/generated'/n,o/n)
manifest=json.loads((o/'manifest.json').read_text(encoding='utf-8'))
assert manifest['manifest_version']==3 and '<all_urls>' not in manifest.get('host_permissions',[])
assert 'contextMenus' in manifest['permissions'] and 'sidePanel' in manifest['permissions']
openbook=json.loads((o/'openbook-main-m01.json').read_text(encoding='utf-8'))
assert len(openbook['quick_terms'])==23 and set(openbook['quick_terms'])==set(openbook['quick_term_context'])
background=(o/'background.js').read_text(encoding='utf-8'); sidepanel=(o/'sidepanel.js').read_text(encoding='utf-8')
assert "contexts:['selection'],enabled:true" in background and 'documentUrlPatterns' not in background and 'targetUrlPatterns' not in background
assert 'chrome.contextMenus.removeAll' in background and 'info.selectionText' in background and 'rawSelectionText' in background
assert 'chrome.storage.session.set' in background and 'chrome.runtime.getContexts' in background and "chrome.tabs.query({url:['https://usr.codyssey.kr/*']})" in background
assert 'quick_term_context' in sidepanel and 'chrome.storage.session.get' in sidepanel and 'chrome.storage.onChanged' in sidepanel
assert '상세 설명 보기' in sidepanel and 'detailRelatedTerms' in sidepanel
