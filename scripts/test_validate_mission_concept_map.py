"""Runtime validator regressions: the eight reviewed design mutations."""
import copy
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
ROOT = Path(__file__).resolve().parents[1]
base = json.loads((ROOT / 'data/mission-story-maps/main-m05/concept-map.json').read_text())
def N(d, i): return next(n for n in d['nodes'] if n['id'] == i)
def V(d, i): return next(v for v in d['views'] if v['id'] == i)
muts = {
 'M1 기초 보기에 common 도메인 전체 포함(방문자·인터넷 고립)': lambda d: (V(d,'basics')['nodeDomains'].append('common'), V(d,'basics').pop('sharedNodeIds')),
 'M2 subnet을 aws:subnet에도 직접 연결(이중 소유)': lambda d: N(d,'aws:subnet')['termIds'].append('subnet'),
 'M3 기초 관계가 보기 밖 공통 노드(com:visitor)를 끝점으로 사용': lambda d: d['relations'].append({**copy.deepcopy(d['relations'][-1]), 'id':'BA99','from':'bas:http','to':'com:visitor','importance':'supplementary'}),
 'M4 appliedIn 대상이 지정한 보기에 없음': lambda d: N(d,'bas:tcp')['appliedIn'].append({'nodeId':'aws:security-group','view':'general','note':'x'}),
 'M5 CB02 두 노드를 관계선으로 연결': lambda d: d['relations'].append({**copy.deepcopy(d['relations'][-1]), 'id':'BA98','from':'bas:http','to':'bas:tcp','importance':'core','type':'연관'}),
 'M6 TCP→포트(BA10)를 core로(보충 끝점)': lambda d: next(r for r in d['relations'] if r['id']=='BA10').update(importance='core'),
 'M7 설명에 장면에 없는 주소(10.0.0.0/8)': lambda d: N(d,'bas:ip-address').update(description=N(d,'bas:ip-address')['description']+' 10.0.0.0/8'),
 'M8 sharedNodeIds에 AWS 노드': lambda d: V(d,'basics')['sharedNodeIds'].append('aws:vpc'),
}

class RuntimeValidatorTests(unittest.TestCase):
    def run_checker(self, data):
        with tempfile.TemporaryDirectory() as temp:
            path = Path(temp) / 'map.json'
            path.write_text(json.dumps(data, ensure_ascii=False))
            return subprocess.run([sys.executable, str(ROOT / 'scripts/validate_mission_concept_map.py'), str(path)], capture_output=True, text=True)

    def test_approved_data(self):
        result = self.run_checker(base)
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertIn('PASS', result.stdout)

    def test_missing_waypoint_and_mismatched_path_endpoints(self):
        for path in [['bas:http', 'missing:waypoint', 'bas:tcp'], ['bas:tcp', 'bas:http']]:
            with self.subTest(path=path):
                data = copy.deepcopy(base)
                data['relations'][-1]['path'] = path
                result = self.run_checker(data)
                self.assertEqual(result.returncode, 1)
                self.assertIn('FAIL ', result.stdout)
                self.assertNotIn('Traceback', result.stderr)

    def test_eight_design_mutations(self):
        expected = ['고립 노드', '딥링크가 모호', '보기에 없음', "보기 'general'에 없음", '같지 않음', '끝점이 보충', '그림에 없음', 'common 노드만']
        for (name, mutate), diagnostic in zip(muts.items(), expected):
            with self.subTest(name=name):
                data = copy.deepcopy(base)
                mutate(data)
                result = self.run_checker(data)
                self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
                self.assertIn('FAIL ', result.stdout)
                self.assertIn(diagnostic, result.stdout)
                self.assertNotIn('Traceback', result.stderr)
                print('DETECTED', name)

if __name__ == '__main__':
    unittest.main()
