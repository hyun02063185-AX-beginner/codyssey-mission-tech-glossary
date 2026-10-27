# 제안 검증기 규칙의 변이 검사(설계 검증용).
# 실행: python3 -B -X utf8 mutations.py <work-dir> <repo-root>
#   <work-dir>/candidate-D.json : build_candidate.py 출력, <work-dir>/check_patched.py : 제안 검증기 사본
#   (현재 검증기에 proposed-patches/validator.patch를 적용한 파일), <work-dir>/run_checker.py : 이 폴더의 실행기
import json, copy, subprocess, sys
S, repo = sys.argv[1], sys.argv[2]
base = json.load(open(f'{S}/candidate-D.json', encoding='utf-8'))
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
for name, f in muts.items():
    d = copy.deepcopy(base); f(d)
    path = f'{S}/mut.json'; json.dump(d, open(path,'w',encoding='utf-8'), ensure_ascii=False)
    out = subprocess.run([sys.executable,'-B','-X','utf8',f'{S}/run_checker.py',f'{S}/check_patched.py',path,repo],capture_output=True,text=True).stdout
    fails = [l for l in out.splitlines() if l.startswith('FAIL')]
    print(('DETECTED' if fails else 'MISSED  '), name); [print('   ', l) for l in fails[:3]]
