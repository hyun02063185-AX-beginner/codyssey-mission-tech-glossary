import json,shutil,subprocess
from pathlib import Path
r=Path(__file__).resolve().parents[1];o=r/'dist-extension';o.mkdir(exist_ok=True)
for n in ['manifest.json','background.js','content.js','sidepanel.html','sidepanel.js']:shutil.copy2(r/'extension'/n,o/n)
for n in ['glossary.json','openbook-main-m01.json','term-map-links.json']:shutil.copy2(r/'src/data/generated'/n,o/n)
# Public web / atlas deep-link helper: single source of truth in src/publicWebLinks.ts,
# compiled to a plain-script browser global so the side panel stays CSP-safe.
subprocess.run(['node','-e',"const{buildSync}=require('esbuild');buildSync({entryPoints:['src/publicWebLinks.ts'],bundle:true,format:'iife',globalName:'PublicWebLinks',outfile:'dist-extension/publicWebLinks.js',logLevel:'silent'})"],cwd=r,check=True)
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
# deep-link integration contract
assert 'PublicWebLinks' in sidepanel and 'term-map-links.json' in sidepanel
assert 'buildTermDetailUrl' in sidepanel and 'resolveTechnologyMap' in sidepanel and 'buildTechnologyMapUrl' in sidepanel
assert '웹에서 자세히 보기' in sidepanel and '기술 지도에서 보기' in sidepanel and 'target="_blank"' in sidepanel
index=json.loads((o/'term-map-links.json').read_text(encoding='utf-8'))
assert index['schemaVersion']=='1.0' and 'terms' in index and 'missions' in index and index['missions'].get('main-m01')==['frontend']
links=(o/'publicWebLinks.js').read_text(encoding='utf-8')
assert 'PublicWebLinks' in links and 'hyun02063185-ax-beginner.github.io' in links
print('[build:extension] deep-link artifacts: publicWebLinks.js + term-map-links.json OK')
