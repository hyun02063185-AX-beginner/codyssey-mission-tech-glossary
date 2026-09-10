import json, re
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]; CUR=ROOT/'data/curated'; OUT=ROOT/'src/data/generated'; TERMS=ROOT/'content/terms'; WEB=ROOT/'content/webtoons'; IMAGE_DIR=ROOT/'public/webtoons'; OPENBOOK=ROOT/'content/peer-review/main-m01-openbook.yaml'; REGISTRY=ROOT/'data/knowledge-maps/map-registry.json'; CLASSIFICATIONS=ROOT/'data/knowledge-maps/atlas/term-field-classification.json'
def sections(path):
    if not path.exists(): return {}
    text=path.read_text(encoding='utf-8'); found=re.split(r'^## ', text, flags=re.M)[1:]; out={}
    for part in found:
        title,_,body=part.partition('\n'); out[title.strip()]=body.strip()
    return out
def main():
    master=json.loads((CUR/'glossary-master-v0.1.yaml').read_text(encoding='utf-8'))['terms']; mission_map=json.loads((CUR/'mission-term-map-v0.1.yaml').read_text(encoding='utf-8'))['missions']; pilots=[]
    for p in sorted(WEB.iterdir()):
        if p.is_dir() and (p/'concept.md').exists():
            s=sections(p/'concept.md'); image=next((f for f in IMAGE_DIR.glob(f'{p.name}.*') if f.suffix.lower() in {'.webp','.png','.jpg','.jpeg'}),None) if IMAGE_DIR.exists() else None; pilots.append({'termId':p.name,'title':(p/'concept.md').read_text(encoding='utf-8').splitlines()[0].removesuffix(' 웹툰 콘셉트').removeprefix('# '),'goal':s.get('학습 목표','').removeprefix('- '),'hasImage':bool(image),'imageSrc':f'webtoons/{image.name}' if image else '','alt':s.get('대체 텍스트','').strip()})
    for t in master:
        s=sections(TERMS/f"{t['id']}.md"); related=[line.removeprefix('- ').strip() for line in s.get('관련 용어','').splitlines() if line.startswith('- ')]
        t.update({'termKo':t.pop('term_ko'),'termEn':t.pop('term_en'),'missionRefs':t.pop('mission_refs'),'relatedTerms':t.pop('related_terms'),'contentStatus':t.pop('content_status'),'hasDetailedContent':bool(s),'hasWebtoon':any(x['termId']==t['id'] for x in pilots),'summary':s.get('한 줄 설명',''),'easyExplanation':s.get('쉽게 설명하면',''),'technicalExplanation':s.get('정확한 설명',''),'howItWorks':s.get('동작 원리',''),'missionContext':s.get('이 미션에서는 왜 필요한가',''),'codeExample':re.sub(r'^```[a-zA-Z]*\s*\n|\n```\s*$','',s.get('코드 예','')),'limitationsOrEdgeCases':s.get('주의할 점 / 경계 조건',''),'detailRelatedTerms':related,'commonMisconceptions':s.get('흔한 오해',''),'comparisons':s.get('비슷한 개념과의 차이',''),'peerReviewQuestions':s.get('동료평가 질문','')})
    openbook=json.loads(OPENBOOK.read_text(encoding='utf-8')); ids={x['id'] for x in master}; assert len(ids)==len(master); assert all(r['source_status'] in {'direct','required','related'} for x in master for r in x['missionRefs']); assert all(x['termId'] in ids for x in pilots); assert all(x in ids for x in openbook['quick_terms']); assert all(x in ids for r in openbook['requirements'] for x in r['term_refs'])
    quick_context=openbook.get('quick_term_context',{}); required_context_fields={'quick_explanation','mission_relevance','screen_check','code_check','peer_question','common_trap','aliases'}; assert len(openbook['quick_terms'])==23; assert set(quick_context)==set(openbook['quick_terms'])
    for term_id, item in quick_context.items():
        assert set(item)==required_context_fields, f'{term_id}: unexpected quick context fields'; assert all(item[field] for field in required_context_fields-{'aliases'}), f'{term_id}: blank quick context field'
        normalized_aliases=[re.sub(r'[\s_-]+','',alias).lower() for alias in item['aliases']]; assert all(item['aliases']) and len(normalized_aliases)==len(set(normalized_aliases)), f'{term_id}: duplicate or blank alias'
    banned_placeholders={'미션에서 확인된 기술용어입니다.','코디세이 미션에서 반복해 쓰이는 핵심 개념입니다.','중요한 기술용어입니다.'}; assert not any(value in banned_placeholders for item in quick_context.values() for value in item.values() if isinstance(value,str))
    for term_id in openbook['quick_terms']:
        detail=sections(TERMS/f'{term_id}.md'); assert all(detail.get(field,'').strip() for field in {'한 줄 설명','쉽게 설명하면','정확한 설명','이 미션에서는 왜 필요한가','동료평가 질문'}), f'{term_id}: incomplete detailed content'
    registry=json.loads(REGISTRY.read_text(encoding='utf-8')); field_counts={};
    for item in json.loads(CLASSIFICATIONS.read_text(encoding='utf-8'))['classifications']: field_counts[item['primaryField']]=field_counts.get(item['primaryField'],0)+1
    generated_maps=[]; OUT.mkdir(parents=True,exist_ok=True)
    for entry in registry['maps']:
        generated=dict(entry); generated['fieldTermCount']=field_counts.get(entry['fieldId'],0)
        if entry['status']=='implemented':
            graph=json.loads((ROOT/entry['dataPath']).read_text(encoding='utf-8')); node_ids={node['id'] for node in graph['nodes']}; assert graph['mapId']==entry['mapId']; assert all(node.get('termId') in ids for node in graph['nodes'] if node.get('termId')); assert all(edge['from'] in node_ids and edge['to'] in node_ids for edge in graph['edges'])
            (OUT/f"{entry['mapId']}-knowledge-map.json").write_text(json.dumps(graph,ensure_ascii=False),encoding='utf-8'); generated['nodeCount']=len(graph['nodes']); generated['termIds']=[node['termId'] for node in graph['nodes'] if node.get('termId')]; generated['overlays']=[]
            for overlay_path in entry['overlayPaths']:
                overlay=json.loads((ROOT/overlay_path).read_text(encoding='utf-8')); assert overlay['mapId']==entry['mapId']; assert set(overlay['nodeIds']) <= node_ids; assert all(ref['termId'] in ids for ref in overlay['nodeRefs']); (OUT/f"{entry['mapId']}-overlay-{overlay['missionId']}.json").write_text(json.dumps(overlay,ensure_ascii=False),encoding='utf-8'); generated['overlays'].append({'missionId':overlay['missionId'],'termIds':[ref['termId'] for ref in overlay['nodeRefs']]})
        generated_maps.append(generated)
    (OUT/'glossary.json').write_text(json.dumps(master,ensure_ascii=False),encoding='utf-8'); (OUT/'missions.json').write_text(json.dumps(mission_map,ensure_ascii=False),encoding='utf-8'); (OUT/'webtoons.json').write_text(json.dumps(pilots,ensure_ascii=False),encoding='utf-8'); (OUT/'openbook-main-m01.json').write_text(json.dumps(openbook,ensure_ascii=False),encoding='utf-8'); (OUT/'map-registry.json').write_text(json.dumps({'schemaVersion':'1.0','maps':generated_maps},ensure_ascii=False),encoding='utf-8')
if __name__=='__main__': main()
