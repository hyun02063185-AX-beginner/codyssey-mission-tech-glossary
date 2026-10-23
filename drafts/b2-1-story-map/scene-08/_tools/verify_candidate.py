"""Check draft references and a real existing teaching example. No runtime writes."""
import ast
import copy
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

DIR = Path(__file__).resolve().parents[1]
ROOT = DIR.parents[2]
OUTLINE = (DIR.parent / 'concept-map-outline.md').read_text()
REQUIRED_CARDS = {'C06', 'C07', 'C20', 'C11', 'C12', 'C30', 'C13', 'C16'}
TYPES = {'포함', '종류', '호출', '사용', '역할'}


def validate(d):
    assert d['status'] == 'design-candidate-not-runtime', 'candidate boundary'
    for group in ['nodes', 'relations', 'comparisons', 'teacherPaths', 'areas']:
        ids = [x['id'] for x in d[group]]
        assert len(ids) == len(set(ids)), 'duplicate ' + group
    all_ids = [x['id'] for group in ['nodes', 'relations', 'comparisons', 'teacherPaths', 'areas'] for x in d[group]]
    assert len(all_ids) == len(set(all_ids)), 'cross-group ID collision'
    nodes = {n['id']: n for n in d['nodes']}
    glossary = {t['id'] for t in json.loads((ROOT / 'src/data/generated/glossary.json').read_text())}
    for n in nodes.values():
        assert n['sceneIds'], 'missing scene'
        for scene_id in n['sceneIds']:
            assert scene_id in d['scenes'], 'unknown scene'
            assert (DIR / d['scenes'][scene_id]['file']).is_file(), 'missing scene file'
        assert n['area'] in {a['id'] for a in d['areas']}, 'unknown area'
        assert all(n[k] for k in ['easy', 'missionReason', 'codeClue']), 'missing panel field'
        g = n['glossary']
        assert g['routeStatus'] == 'unimplemented', 'route overclaim'
        assert g['mode'] in {'direct', 'extension', 'none'}, 'link mode'
        assert bool(g['termId']) == (g['mode'] != 'none'), 'link state'
        if g['termId']:
            assert g['termId'] in glossary, 'unknown termId'
            assert (ROOT / 'content/terms' / (g['termId'] + '.md')).is_file(), 'missing term content'
    assert nodes['package-init']['glossary']['termId'] is None, 'init.py wrong link'
    assert nodes['package-main']['glossary']['termId'] is None, 'main.py wrong link'
    for id in ['module', 'iterator', 'jsonl', 'decorator', 'validation']:
        assert nodes[id]['glossary']['mode'] == 'extension', 'extension boundary'
        assert nodes[id]['glossary']['warning'], 'missing warning'
    assert len(d['areas']) == 7, 'seven areas'
    representatives = [a['representativeNodeId'] for a in d['areas']]
    assert len(set(representatives)) == 7, 'duplicate representative'
    assert set(representatives) <= nodes.keys(), 'unknown representative'
    seen_edges = set()
    for r in d['relations']:
        assert r['from'] in nodes and r['to'] in nodes, 'unknown edge endpoint'
        assert r['from'] != r['to'], 'self edge'
        assert r['type'] in TYPES, 'comparison in graph'
        original = re.search(r'^\| ' + r['id'] + r' \|.*$', OUTLINE, re.M)
        assert original, 'new R ID'
        assert original.group().split('|')[4].strip() == r['type'], 'changed relation type'
        key = (r['from'], r['to'], r['type'])
        assert key not in seen_edges, 'duplicate semantic edge'
        seen_edges.add(key)
        assert r['label'] and r['scope'], 'missing scope'
        assert 'learningOrder' not in r and 'stepIndex' not in r, 'order mixed in relation'
    expected = {
        'R09': ('package', 'module', '포함'),
        'R13': ('package-main', 'entry', '역할'),
        'R15': ('ledger-cli-module', 'ledger-services-module', '사용'),
        'R22': ('iterable', 'iterator', '역할'),
        'R23': ('generator', 'iterator', '종류'),
        'R24': ('yield', 'generator', '역할'),
        'R27': ('wrapper', 'original', '호출'),
        'R28': ('type-hint', 'contract', '역할'),
        'R29': ('validation', 'argument', '역할'),
        'R41': ('iterator', 'iterable', '종류'),
        'R44': ('list-collect', 'iterator', '사용'),
    }
    by_id = {r['id']: r for r in d['relations']}
    for id, value in expected.items():
        r = by_id[id]
        assert (r['from'], r['to'], r['type']) == value, 'direction/scope ' + id
    assert REQUIRED_CARDS <= {c['id'] for c in d['comparisons']}, 'missing required card'
    seen_pairs = set()
    for c in d['comparisons']:
        assert re.search(r'^\| ' + c['id'] + r' \|', OUTLINE, re.M), 'new C ID'
        assert c['left'] in nodes and c['right'] in nodes, 'unknown comparison endpoint'
        assert c['left'] != c['right'], 'self comparison'
        pair = frozenset((c['left'], c['right']))
        assert pair not in seen_pairs, 'duplicate comparison'
        seen_pairs.add(pair)
        assert c['leftText'] and c['rightText'] and c['source'], 'missing comparison source'
        assert set(c['sceneIds']) <= d['scenes'].keys(), 'comparison scene'
    assert len(d['teacherPaths']) == 3, 'three paths'
    for p in d['teacherPaths']:
        assert p['kind'] == 'teacher-exploration-order', 'path kind'
        assert '실제 실행' in p['warning'], 'order warning'
        assert len(p['steps']) >= 5, 'incomplete path'
        for s in p['steps']:
            assert s['nodeId'] in nodes and s['prompt'], 'path step'
    ret = d['returnExample']
    assert ret['startNodeId'] == 'generator' and ret['selectedNodeId'] == 'iterator', 'return context'
    assert ret['nodeHistory'] == ['generator', 'iterator'], 'return history'


def check_demo():
    source = DIR.parent / 'scene-05/_tools/demo/jsonl_generator.py'
    lines = source.read_text().splitlines()
    assert lines[4] == 'def read_transactions(path):'
    assert lines[9].strip() == 'yield json.loads(line)'
    assert lines[12] == 'rows = read_transactions("transactions.jsonl")'
    assert lines[17] == 'total = 0' and lines[20] == 'print("합계:", total)'
    tree = ast.parse(source.read_text())
    f = next(n for n in tree.body if isinstance(n, ast.FunctionDef) and n.name == 'read_transactions')
    assert (f.lineno, f.end_lineno) == (5, 10)
    assert any(isinstance(n, ast.Yield) for n in ast.walk(f))
    # Extract only the existing function: do not import a module that executes IO at top level.
    with tempfile.TemporaryDirectory(prefix='b21-scene08-') as tmp:
        temp = Path(tmp)
        for name in ['jsonl_generator.py', 'transactions.jsonl', 'broken.jsonl']:
            shutil.copy(source.parent / name, temp / name)
        result = subprocess.run([sys.executable, '-I', 'jsonl_generator.py'], cwd=temp, text=True, capture_output=True, check=True)
        assert 'read_transactions() 호출 직후: generator' in result.stdout
        assert '합계: 13000' in result.stdout
        assert '파일 객체도 Iterator? iter(f) is f → True' in result.stdout
        import collections.abc
        import inspect
        import json as json_module
        ns = {'json': json_module}
        exec(compile(ast.Module(body=[f], type_ignores=[]), str(source), 'exec'), ns)
        g = ns['read_transactions'](temp / 'transactions.jsonl')
        assert inspect.isgenerator(g) and isinstance(g, collections.abc.Iterator)
        assert isinstance(g, collections.abc.Iterable) and iter(g) is g
        assert next(g)['id'] == 1 and next(g)['id'] == 2
        g.close()
    return 'existing Scene 05 source lines + AST + temp-copy execution + Generator/Iterator objects'


def check_ledger_sources():
    """Confirm cited implementation sources without executing or modifying ledger."""
    repo = Path(os.environ.get('LEDGER_REPO', str(Path.home() / 'm03-pocket-money-ledger')))
    if not (repo / '.git').exists():
        return '미검증: LEDGER_REPO 지정 필요'
    sha = subprocess.check_output(['git', '-C', str(repo), 'rev-parse', 'HEAD'], text=True).strip()
    assert sha == 'd14e812ca1e1caaa88fd23fae7029d95d560c2d9', 'ledger source version drift'
    def read(name):
        return ast.parse((repo / 'ledger' / name).read_text())
    main = read('__main__.py')
    assert any(isinstance(n, ast.Call) and isinstance(n.func, ast.Name) and n.func.id == 'main' for n in ast.walk(main))
    cli = read('cli.py')
    assert any(isinstance(n, ast.ImportFrom) and n.module == 'ledger.services' and any(a.name == 'LedgerService' for a in n.names) for n in ast.walk(cli))
    cmd_list = next(n for n in ast.walk(cli) if isinstance(n, ast.FunctionDef) and n.name == 'cmd_list')
    assert any(isinstance(n, ast.Call) and isinstance(n.func, ast.Attribute) and ast.unparse(n.func) == 'service.list_transactions' for n in ast.walk(cmd_list))
    services = read('services.py')
    list_transactions = next(n for n in ast.walk(services) if isinstance(n, ast.FunctionDef) and n.name == 'list_transactions')
    assert any(isinstance(n, ast.Call) and isinstance(n.func, ast.Attribute) and ast.unparse(n.func) == 'self.transactions.iter_all' for n in ast.walk(list_transactions))
    return 'd14e812: R14 call expression / R15 import / R17-R18 call expressions; no new runtime trace'


def main():
    d = json.loads((DIR / 'candidate-map.json').read_text())
    validate(d)
    mutations = []

    def mutate(name, change):
        invalid = copy.deepcopy(d)
        change(invalid)
        try:
            validate(invalid)
        except (AssertionError, KeyError):
            mutations.append(name)
        else:
            raise AssertionError('missed invalid candidate: ' + name)

    mutate('duplicate node', lambda x: x['nodes'].append(copy.deepcopy(x['nodes'][0])))
    mutate('unknown endpoint', lambda x: x['relations'][0].update(to='missing'))
    mutate('self edge', lambda x: x['relations'][0].update(to=x['relations'][0]['from']))
    mutate('comparison edge', lambda x: x['relations'][0].update(type='비교'))
    mutate('reversed R23', lambda x: next(r for r in x['relations'] if r['id'] == 'R23').update(**{'from': 'iterator', 'to': 'generator'}))
    mutate('new relation ID', lambda x: x['relations'][0].update(id='R50'))
    mutate('duplicate edge', lambda x: x['relations'][1].update(**{k: x['relations'][0][k] for k in ['from', 'to', 'type']}))
    mutate('unknown term', lambda x: x['nodes'][0]['glossary'].update(termId='does-not-exist'))
    mutate('wrong init link', lambda x: next(n for n in x['nodes'] if n['id'] == 'package-init')['glossary'].update(termId='init', mode='direct'))
    mutate('missing scene', lambda x: x['nodes'][0].update(sceneIds=[]))
    mutate('missing comparison', lambda x: x['comparisons'].pop(0))
    mutate('duplicate comparison pair', lambda x: x['comparisons'][1].update(left=x['comparisons'][0]['right'], right=x['comparisons'][0]['left']))
    mutate('order mixed into relation', lambda x: x['relations'][0].update(stepIndex=1))
    mutate('lost return start', lambda x: x['returnExample'].update(startNodeId='iterator'))
    demo = check_demo()
    ledger = check_ledger_sources()
    # Markdown links are local content references, not claims of live web routes.
    checked_links = 0
    for file in [DIR / 'script.md', DIR / 'design-notes.md', DIR / 'visual-qa.md']:
        if not file.exists():
            continue
        for target in re.findall(r'\]\(([^)]+)\)', file.read_text()):
            if re.match(r'https?://', target) or target.startswith('#'):
                continue
            assert (file.parent / target.split('#')[0]).exists(), (file, target)
            checked_links += 1
    html = (DIR / 'concept-map-preview.html').read_text()
    embedded = json.loads(re.search(r'<script id="candidate" type="application/json">(.*?)</script>', html, re.S).group(1))
    assert embedded == d, 'HTML data drift'
    assert 'fetch(' not in html and 'https://' not in html, 'unexpected external navigation/network'
    print(json.dumps(dict(result='PASS',nodes=len(d['nodes']),relations=len(d['relations']),comparisons=len(d['comparisons']),teacherPaths=3,mutationChecks=len(mutations),rejectedMutations=mutations,localLinks=checked_links,demo=demo,ledgerSources=ledger,python=sys.version.split()[0]), ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
