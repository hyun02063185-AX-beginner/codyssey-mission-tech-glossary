"""B1-1 profile, layered on mission-independent map contracts."""
import json
import sys
from pathlib import Path
from mission_concept_map_common import validate_common

ROOT = Path(__file__).resolve().parents[1]


def validate(data):
    glossary = {t['id'] for t in json.loads((ROOT/'data/curated/glossary-master-v0.1.yaml').read_text(encoding='utf-8'))['terms']}
    problems = validate_common(data, glossary)
    counts = (len(data['nodes']), sum(n['importance']=='core' for n in data['nodes']), len(data['relations']), len(data['contrasts']), sum(len(n.get('extensions',[])) for n in data['nodes']))
    if counts != (17,14,21,4,5):problems.append(f'B1-1 개수 불일치: {counts}')
    if any(r['type'] not in {'역할','포함','연관'} for r in data['relations']):problems.append('B1-1 유형 오류')
    if any(r['from'] in {'N04','N05'} and r['to']=='N11' for r in data['relations']):problems.append('CSS → DOM 관계 금지')
    if len([s for s in data['scenes'] if s['id']!='intro']) != 12:problems.append('B1-1 화면 참조 개수 오류')
    layout=data['layout']
    if set(layout['positions']) != {n['id'] for n in data['nodes']} or set(layout['routes']) != {r['id'] for r in data['relations']}:problems.append('배치 참조 오류')
    for rel in data['relations']:
        for start,end in zip(layout['routes'][rel['id']],layout['routes'][rel['id']][1:]):
            if start[0]!=end[0] and start[1]!=end[1]:problems.append(f"{rel['id']}: 비직교 선")
            for node in data['nodes']:
                p=layout['positions'][node['id']];l,t,r,b=p['x'],p['y'],p['x']+p['width'],p['y']+p['height']
                if (start[0]==end[0] and l<start[0]<r and max(min(start[1],end[1]),t)<min(max(start[1],end[1]),b)) or (start[1]==end[1] and t<start[1]<b and max(min(start[0],end[0]),l)<min(max(start[0],end[0]),r)):problems.append(f"{rel['id']}: {node['id']}를 통과")
    return problems


if __name__=='__main__':
    path=Path(sys.argv[1]) if len(sys.argv)>1 else ROOT/'data/mission-story-maps/main-m01/concept-map.json'
    problems=validate(json.loads(path.read_text(encoding='utf-8')))
    print('\n'.join(problems) if problems else 'PASS B1-1: 14+3 nodes, 21 relations, 4 comparisons, 5 extensions; common contracts and routing')
    sys.exit(bool(problems))
