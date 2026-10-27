"""Adapt the approved B1-1 design tables; never edit authored sources or B3-1 geometry."""
import heapq
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
STORY = ROOT / 'content/mission-stories/main-m01'


def build():
    design = (STORY / 'three-pillars-concept-map-design-v0.1.md').read_text(encoding='utf-8')
    storyboard = (STORY / 'storyboard-v0.2.md').read_text(encoding='utf-8')
    screens = json.loads((STORY / '_tools/screens.json').read_text(encoding='utf-8'))['screens']
    clean = lambda text: text.replace('**', '').replace('`', '').strip()
    def story_refs(text):
        text = re.sub(r'S([1-4])-([1-3])~S\1-([1-3])', lambda m: ', '.join(f'S{m[1]}-{i}' for i in range(int(m[2]),int(m[3])+1)), text)
        return (['intro'] if '인트로' in text else []) + re.findall(r'S[1-4]-[1-3]',text)
    rows = lambda start, end: [list(map(str.strip, row.strip('|').split('|'))) for row in design.split(start, 1)[1].split(end, 1)[0].splitlines() if re.match(r'^\| [NRCE]\d\d \|', row)]
    regions = [('center', '중심'), ('html', '축 HTML'), ('css', '축 CSS'), ('js', '축 JS'), ('browser', '브라우저')]
    region_ids = {label: id for id, label in regions}
    nodes = []
    for core, start, end in [(True, '### D.3.1 핵심 노드 14', '### D.3.2'), (False, '### D.3.2 보충 노드 3', '## D.4')]:
        for cells in rows(start, end):
            id, label, region, terms = cells[:4]
            related = cells[4] if core else ('`deployment`' if id == 'N17' else '')
            summary = clean(cells[-1])
            nodes.append(dict(id=id, label=label, domain='web', region=region_ids[region], order=len(nodes), conceptType='language' if id in ['N02', 'N04', 'N07'] else 'file' if id == 'N16' else 'software' if id == 'N10' else 'actor' if id == 'N13' else 'concept', importance='core' if core else 'supplementary', implementationStatus='educational-model', summary=summary, description=summary, termIds=re.findall(r'`([^`]+)`', terms.split('(related:')[0]), relatedTermIds=re.findall(r'`([^`]+)`', related), storyScenes=story_refs(cells[5] if core else cells[4])))
    by_label = {n['label']: n['id'] for n in nodes}
    by_label['링크·폼'] = 'N15'
    descriptions = {
        'R07': 'CSS는 화면 폭 같은 조건에 따라 다른 규칙을 적용해 반응형 웹을 구현한다.',
        'R08': "JavaScript로 함수를 써서 '이 버튼이 눌리면 실행해 달라'고 등록한 것이 이벤트 핸들러다.",
        'R09': '브라우저는 HTML 문서를 해석해 DOM이라는 문서 구조를 만든다. DOM을 만드는 것은 브라우저다. DOM은 HTML 파일 그 자체가 아니다. 파일과 DOM의 차이는 비교 카드 C01(index.html ≠ DOM).',
        'R10': 'CSS 규칙은 DOM 요소에 맞게 골라지고 계산되어 화면 모습에 반영된다. DOM 자체는 바꾸지 않는다. 선택자가 DOM 요소를 고르고, 브라우저가 요소마다 적용할 값을 계산한다. JavaScript가 class를 바꾸면 그 요소에 맞는 규칙이 달라질 뿐이다.',
        'R11': 'JavaScript는 DOM을 읽고, 필요하면 바꾼다.',
        'R12': '브라우저는 DOM을 바탕으로 화면을 그리고, DOM이 바뀌면 다시 그린다. 순서는 Story S3-2에서. 지도는 누가 누구와 어떤 관계인지만 보여 줍니다.',
    }
    relations = []
    for cells in rows('### D.4.1 관계 목록 21', '### D.4.2'):
        id, endpoints, kind, label, importance, meaning = cells
        a, b = map(str.strip, endpoints.split('→'))
        relations.append(dict(id=id, **{'from':by_label[a], 'to':by_label[b]}, type=kind, label=clean(label), importance='core' if importance == '핵심' else 'supplementary', scope='web', description=descriptions.get(id, f'{a} → {b}: {clean(label)}. {clean(meaning)}.'), source=['b11-design'], storyScenes=[s['id'] for s in screens if id in s['map']]))
    contrasts = [dict(id=c[0], title=clean(c[1]), nodeIds=re.findall(r'N\d\d', c[2]), noLineReason=clean(c[3]), explanation=clean(c[4]), storyScenes=story_refs(c[5])) for c in rows('**선 없는 비교 카드 4**', '### D.4.4')]
    for line in storyboard.splitlines():
        match = re.match(r'\*\*(E\d\d) · (.+?)\*\* \(노드 (N\d\d).*?\) — (.*)', line)
        if not match:
            continue
        id, title, owner, body = match.groups()
        terms = {'E01': [], 'E02': ['json'], 'E03': ['python', 'node-js'], 'E04': [], 'E05': ['fetch-api', 'http-request-response', 'rest-api']}[id]
        node = next(n for n in nodes if n['id'] == owner)
        node.setdefault('extensions', []).append(dict(id=id, title=title, termIds=terms, body=clean(body)))
    data = dict(mapId='b11-three-pillars', title='B1-1 문서·표현·기능 개념지도', question='웹페이지를 이루는 세 역할은 서로 어떤 관계이고, 브라우저 안에서 어떻게 하나의 화면이 될까?', nodes=nodes, relations=relations, contrasts=contrasts, regions=[dict(id=id, domain='web', label=label, description=label+'의 역할과 관계', order=i) for i, (id, label) in enumerate(regions)], views=[dict(id='all', label='세 가지 축', nodeDomains=['web'], relationScopes=['web'], initialImportance=['core'], description='문서·표현·기능과 브라우저의 관계')], scenes=[dict(id=s['id'], title=s['title'], order=i) for i,s in enumerate(screens)], sources=[dict(id='b11-design', label='승인된 B1-1 세 가지 축 설계 d76c0b4 · 원고 b4d21fb', kind='repository')], relationTypes=[dict(type='역할', description='A가 B라는 역할을 맡는다'),dict(type='포함', description='B는 A의 한 부분이거나 A를 구체화한 방식이다. 개념 포함이며 공간 배치가 아니다'),dict(type='연관', description='구성·구현 수단·바탕·계기·불러옴·공개: 이름표와 설명에 적는다')], learningOrder=[dict(id=f'L{i+1}', first=a, then=b, firstRefs=first, thenRefs=then) for i,(a,b,first,then) in enumerate([('HTML','시맨틱 HTML',['R01'],['R05']),('CSS','스타일 규칙 → 반응형 웹',['R02'],['R06','R07']),('사용자 이벤트','이벤트 핸들러 → DOM',['R14'],['R15','R11']),('HTML·스타일 규칙·DOM','화면 표시',['R09','R10'],['R12'])])], linkPolicy=dict(doNotAutoLink=[], conceptConnection=dict(id='')))
    data['relationTypes'] = {item['type']:item['description'] for item in data['relationTypes']}
    data['scenes'].insert(0,dict(id='intro',title='문서·표현·기능, 세 가지 축으로 이해하는 웹페이지',order=-1))
    data['layout'] = layout(nodes, relations)
    target = ROOT / 'data/mission-story-maps/main-m01/concept-map.json'
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps(data, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
    print('B1-1: 17 nodes, 21 relations, 4 contrasts, 5 extensions adapted from approved sources')


def layout(nodes, relations):
    # Three pillar headings share a baseline. Browser structure and rendering are
    # separate cards below them; no extra style-computation node is invented.
    xy = {'N01':(480,60),'N02':(80,250),'N03':(80,380),'N16':(80,510),'N14':(80,640),'N15':(80,770),'N04':(480,250),'N05':(480,380),'N06':(480,510),'N07':(880,250),'N09':(880,380),'N08':(880,510),'N10':(280,980),'N11':(580,980),'N12':(880,980),'N13':(1180,510),'N17':(1180,60)}
    positions = {id:dict(x=x,y=y,width=206,height=76) for id,(x,y) in xy.items()}
    boxes = [(x-12,y-12,x+218,y+88) for x,y in xy.values()]
    routes = {}
    usage = {}
    for rel in relations:
        a, b = positions[rel['from']], positions[rel['to']]
        if a['x'] == b['x']:
            downward = b['y'] > a['y']
            start=(a['x']+103,a['y']+(90 if downward else -14))
            end=(b['x']+103,b['y']+(-14 if downward else 90))
        else:
            right = b['x'] > a['x']
            start=(a['x']+(220 if right else -14),a['y']+38)
            end=(b['x']+(-14 if right else 220),b['y']+38)
        xs=sorted({20,1430,start[0],end[0],*[x for box in boxes for x in (box[0]-8,box[2]+8)]})
        ys=sorted({20,1100,start[1],end[1],*[y for box in boxes for y in (box[1]-8,box[3]+8)]})
        valid=lambda p: not any(l<p[0]<r and t<p[1]<d for l,t,r,d in boxes)
        clear=lambda p,q: not any((p[1]==q[1] and t<p[1]<d and max(min(p[0],q[0]),l)<min(max(p[0],q[0]),r)) or (p[0]==q[0] and l<p[0]<r and max(min(p[1],q[1]),t)<min(max(p[1],q[1]),d)) for l,t,r,d in boxes)
        begin=(xs.index(start[0]),ys.index(start[1]),0)
        heap=[(0,begin)]; costs={begin:0}; parent={}; last=None
        while heap:
            cost, cur=heapq.heappop(heap)
            if cost!=costs[cur]:continue
            i,j,direction=cur
            p=(xs[i],ys[j])
            if p==end:last=cur;break
            for di,dj,axis in [(1,0,1),(-1,0,1),(0,1,2),(0,-1,2)]:
                ni,nj=i+di,j+dj
                if not(0<=ni<len(xs) and 0<=nj<len(ys)):continue
                q=(xs[ni],ys[nj])
                if not valid(q) or not clear(p,q):continue
                edge=tuple(sorted((p,q)))
                new=cost+abs(p[0]-q[0])+abs(p[1]-q[1])+(30 if direction and direction!=axis else 0)+usage.get(edge,0)*60
                nxt=(ni,nj,axis)
                if new<costs.get(nxt,float('inf')):costs[nxt]=new;parent[nxt]=cur;heapq.heappush(heap,(new,nxt))
        assert last is not None, rel['id']
        points=[]
        while last!=begin:
            points.append([xs[last[0]],ys[last[1]]]);last=parent[last]
        points.append(list(start));points.reverse()
        for p,q in zip(points,points[1:]):
            edge=tuple(sorted((tuple(p),tuple(q))));usage[edge]=usage.get(edge,0)+1
        routes[rel['id']]=points
    region_boxes={'center':(450,20,970,160),'html':(50,210,266,660),'css':(450,210,266,410),'js':(850,210,266,410),'browser':(250,800,1170,300)}
    # This is an explanatory stage label from F6, not an eighteenth concept node.
    return dict(width=1450,height=1120,positions=positions,regions={id:dict(zip(['x','y','width','height'],box)) for id,box in region_boxes.items()},routes=routes,annotations=[dict(x=890,y=860,title='스타일 계산',caption='요소마다 값을 계산')])


if __name__ == '__main__':
    build()
