import json,shutil
from pathlib import Path
r=Path(__file__).resolve().parents[1];o=r/'dist-extension';o.mkdir(exist_ok=True)
for n in ['manifest.json','background.js','content.js','sidepanel.html','sidepanel.js']:shutil.copy2(r/'extension'/n,o/n)
for n in ['glossary.json','openbook-main-m01.json']:shutil.copy2(r/'src/data/generated'/n,o/n)
json.loads((o/'manifest.json').read_text())
