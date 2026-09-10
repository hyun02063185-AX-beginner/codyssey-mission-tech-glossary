#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Create browser-ready JSON from curated DB and authored Markdown."""
import json, re
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]; CUR=ROOT/'data/curated'; OUT=ROOT/'src/data/generated'; TERMS=ROOT/'content/terms'; WEB=ROOT/'content/webtoons'; IMAGE_DIR=ROOT/'public/webtoons'; OPENBOOK=ROOT/'content/peer-review/main-m01-openbook.yaml'; M01_MAP=ROOT/'data/knowledge-maps/main-m01/knowledge-map.json'
def sections(path):
    if not path.exists(): return {}
    text=path.read_text(encoding='utf-8'); found=re.split(r'^## ', text, flags=re.M)[1:]; out={}
    for part in found:
        title, _, body=part.partition('\n'); out[title.strip()]=body.strip()
    return out
def main():
    master=json.loads((CUR/'glossary-master-v0.1.yaml').read_text(encoding='utf-8'))['terms']; mission_map=json.loads((CUR/'mission-term-map-v0.1.yaml').read_text(encoding='utf-8'))['missions']
    pilots=[]
    for p in sorted(WEB.iterdir()):
        if p.is_dir() and (p/'concept.md').exists():
            s=sections(p/'concept.md'); image=next((f for f in IMAGE_DIR.glob(f'{p.name}.*') if f.suffix.lower() in {'.webp','.png','.jpg','.jpeg'}),None) if IMAGE_DIR.exists() else None; pilots.append({'termId':p.name,'title':(p/'concept.md').read_text(encoding='utf-8').splitlines()[0].removesuffix(' 웹툰 콘셉트').removeprefix('# '),'goal':s.get('학습 목표','').removeprefix('- '),'hasImage':bool(image),'imageSrc':f'webtoons/{image.name}' if image else '','alt':s.get('대체 텍스트','').strip()})
    for t in master:
        s=sections(TERMS/f"{t['id']}.md"); related=[line.removeprefix('- ').strip() for line in s.get('관련 용어','').splitlines() if line.startswith('- ')]
        t.update({'termKo':t.pop('term_ko'),'termEn':t.pop('term_en'),'missionRefs':t.pop('mission_refs'),'relatedTerms':t.pop('related_terms'),'contentStatus':t.pop('content_status'),'hasDetailedContent':bool(s),'hasWebtoon':any(x['termId']==t['id'] for x in pilots),'summary':s.get('한 줄 설명',''),'easyExplanation':s.get('쉽게 설명하면',''),'technicalExplanation':s.get('정확한 설명',''),'howItWorks':s.get('동작 원리',''),'missionContext':s.get('이 미션에서는 왜 필요한가',''),'codeExample':re.sub(r'^```[a-zA-Z]*\s*\n|\n```\s*$','',s.get('코드 예','')),'limitationsOrEdgeCases':s.get('주의할 점 / 경계 조건',''),'detailRelatedTerms':related,'commonMisconceptions':s.get('흔한 오해',''),'comparisons':s.get('비슷한 개념과의 차이',''),'peerReviewQuestions':s.get('동료평가 질문','')})
    openbook=json.loads(OPENBOOK.read_text(encoding='utf-8')); knowledge_map=json.loads(M01_MAP.read_text(encoding='utf-8')); ids={x['id'] for x in master}; assert len(ids)==len(master); assert all(r['source_status'] in {'direct','required','related'} for x in master for r in x['missionRefs']); assert all(x['termId'] in ids for x in pilots); assert all(x in ids for x in openbook['quick_terms']); assert all(x in ids for r in openbook['requirements'] for x in r['term_refs'])
    quick_context=openbook.get('quick_term_context',{}); required_context_fields={'quick_explanation','mission_relevance','screen_check','code_check','peer_question','common_trap','aliases'}; assert len(openbook['quick_terms'])==23; assert set(quick_context)==set(openbook['quick_terms'])
    for term_id, item in quick_context.items():
        assert set(item)==required_context_fields, f'{term_id}: unexpected quick context fields'
        assert all(item[field] for field in required_context_fields-{'aliases'}), f'{term_id}: blank quick context field'
        normalized_aliases=[re.sub(r'[\s_-]+','',alias).lower() for alias in item['aliases']]
        assert all(item['aliases']) and len(normalized_aliases)==len(set(normalized_aliases)), f'{term_id}: duplicate or blank alias'
    banned_placeholders={'미션에서 확인된 기술용어입니다.','코디세이 미션에서 반복해 쓰이는 핵심 개념입니다.','중요한 기술용어입니다.'}
    assert not any(value in banned_placeholders for item in quick_context.values() for value in item.values() if isinstance(value,str))
    for term_id in openbook['quick_terms']:
        detail=sections(TERMS/f'{term_id}.md')
        assert all(detail.get(field,'').strip() for field in {'한 줄 설명','쉽게 설명하면','정확한 설명','이 미션에서는 왜 필요한가','동료평가 질문'}), f'{term_id}: incomplete detailed content'
    mission_nodes=[node for node in knowledge_map['nodes'] if node['nodeOrigin']=='mission']; assert {node['termId'] for node in mission_nodes}==set(openbook['quick_terms']); assert all(edge['from'] in {node['id'] for node in knowledge_map['nodes']} and edge['to'] in {node['id'] for node in knowledge_map['nodes']} for edge in knowledge_map['edges'])
    OUT.mkdir(parents=True,exist_ok=True); (OUT/'glossary.json').write_text(json.dumps(master,ensure_ascii=False), encoding='utf-8'); (OUT/'missions.json').write_text(json.dumps(mission_map,ensure_ascii=False), encoding='utf-8'); (OUT/'webtoons.json').write_text(json.dumps(pilots,ensure_ascii=False), encoding='utf-8'); (OUT/'openbook-main-m01.json').write_text(json.dumps(openbook,ensure_ascii=False), encoding='utf-8'); (OUT/'m01-knowledge-map.json').write_text(json.dumps(knowledge_map,ensure_ascii=False), encoding='utf-8')
if __name__=='__main__': main()
