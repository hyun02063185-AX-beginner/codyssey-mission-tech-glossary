#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Create browser-ready JSON from curated DB and authored Markdown."""
import json, re
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]; CUR=ROOT/'data/curated'; OUT=ROOT/'src/data/generated'; TERMS=ROOT/'content/terms'; WEB=ROOT/'content/webtoons'; IMAGE_DIR=ROOT/'public/webtoons'; OPENBOOK=ROOT/'content/peer-review/main-m01-openbook.yaml'
def sections(path):
    if not path.exists(): return {}
    text=path.read_text(); found=re.split(r'^## ', text, flags=re.M)[1:]; out={}
    for part in found:
        title, _, body=part.partition('\n'); out[title.strip()]=body.strip()
    return out
def main():
    master=json.loads((CUR/'glossary-master-v0.1.yaml').read_text())['terms']; mission_map=json.loads((CUR/'mission-term-map-v0.1.yaml').read_text())['missions']
    pilots=[]
    for p in sorted(WEB.iterdir()):
        if p.is_dir() and (p/'concept.md').exists():
            s=sections(p/'concept.md'); image=next((f for f in IMAGE_DIR.glob(f'{p.name}.*') if f.suffix.lower() in {'.webp','.png','.jpg','.jpeg'}),None) if IMAGE_DIR.exists() else None; pilots.append({'termId':p.name,'title':(p/'concept.md').read_text().splitlines()[0].removesuffix(' 웹툰 콘셉트').removeprefix('# '),'goal':s.get('학습 목표','').removeprefix('- '),'hasImage':bool(image),'imageSrc':f'webtoons/{image.name}' if image else ''})
    for t in master:
        s=sections(TERMS/f"{t['id']}.md"); t.update({'termKo':t.pop('term_ko'),'termEn':t.pop('term_en'),'missionRefs':t.pop('mission_refs'),'relatedTerms':t.pop('related_terms'),'contentStatus':t.pop('content_status'),'hasDetailedContent':bool(s),'hasWebtoon':any(x['termId']==t['id'] for x in pilots),'summary':s.get('한 줄 설명',''),'easyExplanation':s.get('쉽게 설명하면',''),'technicalExplanation':s.get('정확한 설명',''),'missionContext':s.get('이 미션에서는 왜 필요한가',''),'commonMisconceptions':s.get('흔한 오해',''),'peerReviewQuestions':s.get('동료평가 질문','')})
    openbook=json.loads(OPENBOOK.read_text()); ids={x['id'] for x in master}; assert len(ids)==len(master); assert all(r['source_status'] in {'direct','required','related'} for x in master for r in x['missionRefs']); assert all(x['termId'] in ids for x in pilots); assert all(x in ids for x in openbook['quick_terms']); assert all(x in ids for r in openbook['requirements'] for x in r['term_refs'])
    OUT.mkdir(parents=True,exist_ok=True); (OUT/'glossary.json').write_text(json.dumps(master,ensure_ascii=False)); (OUT/'missions.json').write_text(json.dumps(mission_map,ensure_ascii=False)); (OUT/'webtoons.json').write_text(json.dumps(pilots,ensure_ascii=False)); (OUT/'openbook-main-m01.json').write_text(json.dumps(openbook,ensure_ascii=False))
if __name__=='__main__': main()
