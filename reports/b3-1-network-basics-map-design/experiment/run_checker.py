"""검증기 사본을 저장소 경로 기준으로 실행한다. 실행: python3 -B -X utf8 run_checker.py <checker.py> <data.json> <repo-root>"""
import importlib.util, os, sys
path, data, repo = sys.argv[1], sys.argv[2], sys.argv[3]
spec = importlib.util.spec_from_file_location('c', path); c = importlib.util.module_from_spec(spec); spec.loader.exec_module(c)
c.HERE = os.path.join(repo, 'drafts/b3-1-visual-story/concept-map-v2/_tools')
c.ROOT = repo
c.LEGACY = os.path.join(repo, 'drafts/b3-1-visual-story/scene-04/concept-map.json')
c.GLOSSARY = os.path.join(repo, 'data/curated/glossary-master-v0.1.yaml')
c.DATA = data
try: c.main()
except SystemExit as e: print('EXIT', e.code)
