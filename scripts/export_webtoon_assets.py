"""Authoring only: python -m pip install Pillow, then run after the browser renderer."""
import json
import sys
from pathlib import Path
from PIL import Image

root=Path(__file__).resolve().parents[1]
source=json.loads((root/'content/webtoons/episodes.json').read_text(encoding='utf-8'))
for episode in source['episodes']:
    if episode.get('status')!='approved': continue
    if len(sys.argv)>1 and episode['id'] not in sys.argv[1:]: continue
    directory=root/episode['sourceDirectory']
    target=root/'public/webtoons'/episode['id']
    target.mkdir(parents=True,exist_ok=True)
    full=Image.open(directory/'master.png').convert('RGB')
    for name,width in [('full.webp',1536),('full-1024.webp',1024),('full-768.webp',768)]:
        full.resize((width,round(width*full.height/full.width)),Image.Resampling.LANCZOS).save(target/name,quality=94,method=6)
    for number in range(1,5):
        panel=Image.open(directory/f'panel-{number}.png').convert('RGB')
        panel.save(target/f'panel-{number}.webp',quality=94,method=6)
        panel.resize((368,240),Image.Resampling.LANCZOS).save(target/f'panel-{number}-368.webp',quality=94,method=6)
    print(episode['id'],sum(file.stat().st_size for file in target.iterdir()),'bytes')
