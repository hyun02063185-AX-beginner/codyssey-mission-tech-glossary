"""Validate the runtime candidate with the unchanged design validator."""
import importlib.util
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CHECKER = ROOT / 'drafts/b3-1-visual-story/concept-map-v2/_tools/check_concept_map_v2.py'
spec = importlib.util.spec_from_file_location('concept_map_checker', CHECKER)
checker = importlib.util.module_from_spec(spec)
spec.loader.exec_module(checker)
checker.DATA = str(ROOT / 'data/mission-story-maps/main-m05/concept-map.json')
checker.main()
