"""Mission-independent concept-map contracts. No AWS, B3-1 scene or legacy assumptions."""
TYPES = {'포함', '역할', '흐름', '대응', '연관', '선행'}


def validate_common(data, glossary):
    problems = []
    nodes = {n['id']: n for n in data['nodes']}
    rels = {r['id']: r for r in data['relations']}
    cards = {c['id']: c for c in data['contrasts']}
    scenes = {s['id'] for s in data['scenes']}
    regions = {r['id']:r for r in data['regions']}
    sources = {s['id'] for s in data['sources']}
    extensions = [e for n in data['nodes'] for e in n.get('extensions', [])]
    groups = [data['nodes'], data['relations'], data['contrasts'], extensions]
    ids = [item['id'] for group in groups for item in group]
    if len(ids) != len(set(ids)):
        problems.append('노드·관계·비교·확장 ID 중복')
    if len({n['label'] for n in data['nodes']}) != len(nodes):
        problems.append('노드 표시 이름 중복')
    term_owner = {}
    def terms(owner, values):
        for term in values:
            if term not in glossary or term in data['linkPolicy']['doNotAutoLink']:
                problems.append(f'{owner}: 연결할 수 없는 용어 {term}')
    for node in data['nodes']:
        if node['region'] not in regions or regions[node['region']]['domain'] != node['domain']:
            problems.append(f"{node['id']}: region/domain 불일치")
        if node['importance'] not in {'core', 'supplementary'}:
            problems.append(f"{node['id']}: importance 오류")
        terms(node['id'], node['termIds'] + node.get('relatedTermIds', []))
        for term in node['termIds']:
            if term in term_owner:
                problems.append(f'{term}: 중복 노드 용어')
            term_owner[term] = node['id']
        for extension in node.get('extensions', []):
            terms(extension['id'], extension['termIds'])
            if not extension.get('body') or not extension.get('title'):
                problems.append(f"{extension['id']}: 확장 설명 없음")
    seen = set()
    for rel in data['relations']:
        a, b = nodes.get(rel['from']), nodes.get(rel['to'])
        if not a or not b or a == b:
            problems.append(f"{rel['id']}: 끝점 오류")
            continue
        key = (rel['from'], rel['to'], rel['type'], rel['scope'])
        if key in seen:
            problems.append(f"{rel['id']}: 중복 관계")
        seen.add(key)
        if rel['type'] not in TYPES or rel['type'] == '선행':
            problems.append(f"{rel['id']}: 관계 유형 오류(학습 선행은 learningOrder)")
        if rel['importance'] == 'core' and rel['type'] != '흐름' and any(n['importance'] != 'core' for n in [a, b]):
            problems.append(f"{rel['id']}: 핵심 관계에 보충 끝점")
        if not rel.get('description') or not rel.get('source') or not set(rel['source']) <= sources:
            problems.append(f"{rel['id']}: 설명·근거 오류")
        terms(rel['id'], rel.get('relatedTermIds', []))
        if 'path' in rel and (rel['path'][0] != rel['from'] or rel['path'][-1] != rel['to'] or not set(rel['path']) <= nodes.keys() or len(rel.get('pathStepIds', [])) != len(rel['path'])-1):
            problems.append(f"{rel['id']}: 경로 오류")
    for item in data['nodes'] + data['relations'] + data['contrasts']:
        if not set(item['storyScenes']) <= scenes:
            problems.append(f"{item['id']}: Story 참조 오류")
    for card in data['contrasts']:
        if not set(card['nodeIds']) <= nodes.keys():
            problems.append(f"{card['id']}: 비교 끝점 오류")
        if any({r['from'], r['to']} <= set(card['nodeIds']) for r in data['relations']):
            problems.append(f"{card['id']}: 비교 카드에 직접 관계선")
    for item in data['learningOrder']:
        if not set(item['firstRefs'] + item['thenRefs']) <= (scenes | rels.keys() | cards.keys()):
            problems.append(f"{item['id']}: 학습 순서 참조 오류")
    for view in data['views']:
        members = {n['id'] for n in data['nodes'] if n['domain'] in view['nodeDomains'] or n['id'] in view.get('sharedNodeIds', [])}
        for full in [False, True]:
            visible = {id for id in members if full or nodes[id]['importance'] == 'core'}
            relations = [r for r in data['relations'] if r['scope'] in view['relationScopes'] and r['from'] in visible and r['to'] in visible and (full or r['importance'] == 'core')]
            used = {id for r in relations for id in [r['from'], r['to'], *r.get('path', [])]}
            if visible - used:
                problems.append(f"{view['id']}: 고립 노드 {sorted(visible-used)}")
    return problems
