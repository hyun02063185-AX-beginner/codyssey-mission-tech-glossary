"""Reject semantic contract damage independently of React rendering."""
import copy
import json
from pathlib import Path
import unittest
from validate_b11_concept_map import validate

BASE = json.loads((Path(__file__).resolve().parents[1]/'data/mission-story-maps/main-m01/concept-map.json').read_text(encoding='utf-8'))


class B11ValidatorTests(unittest.TestCase):
    def test_approved_map(self):
        self.assertEqual(validate(BASE), [])

    def test_rejects_reviewed_mutations(self):
        def missing_term(d):
            d['nodes'][1]['termIds'] = ['nonexistent-term']
        def extension_term(d):
            next(n for n in d['nodes'] if n.get('extensions'))['extensions'][0]['termIds'] = ['nonexistent-term']
        def css_dom(d):
            next(r for r in d['relations'] if r['id']=='R10')['to'] = 'N11'
        def comparison_line(d):
            next(r for r in d['relations'] if r['id']=='R16')['to'] = 'N11'
        def supplementary_endpoint(d):
            next(n for n in d['nodes'] if n['id']=='N02')['importance'] = 'supplementary'
        def unknown_scene(d):
            d['nodes'][0]['storyScenes'] = ['S9-9']
        for mutation in [missing_term, extension_term, css_dom, comparison_line, supplementary_endpoint, unknown_scene]:
            with self.subTest(mutation=mutation.__name__):
                data=copy.deepcopy(BASE);mutation(data)
                self.assertTrue(validate(data))


if __name__=='__main__':
    unittest.main()
