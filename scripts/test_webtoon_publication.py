import copy
import json
import tempfile
import unittest
from pathlib import Path
from webtoon_publication import approved_webtoons

ROOT=Path(__file__).resolve().parents[1]
SOURCE=json.loads((ROOT/'content/webtoons/episodes.json').read_text(encoding='utf-8'))
IDS={term['id'] for term in json.loads((ROOT/'data/curated/glossary-master-v0.1.yaml').read_text(encoding='utf-8'))['terms']}

class WebtoonPublicationTest(unittest.TestCase):
    def temporary_source(self,mutate):
        temporary=tempfile.TemporaryDirectory()
        self.addCleanup(temporary.cleanup)
        root=Path(temporary.name)
        (root/'content/webtoons').mkdir(parents=True)
        source=copy.deepcopy(SOURCE)
        mutate(source)
        (root/'content/webtoons/episodes.json').write_text(json.dumps(source),encoding='utf-8')
        return root

    def test_real_approved_episodes_resolve(self):
        self.assertEqual([episode['id'] for episode in approved_webtoons(ROOT,IDS)],['ai-model-role-01','prompt-request-01','abstraction-coffee-01','algorithm-sandwich-01'])

    def test_unlinked_concept_requires_explicit_reason(self):
        def mutate(source):
            source['episodes'][0].update(termId=None,relatedTerms=[])
        with self.assertRaisesRegex(AssertionError,'unmapped concept'):
            approved_webtoons(self.temporary_source(mutate),IDS)

    def test_draft_images_never_publish(self):
        def mutate(source):
            for episode in source['episodes']:episode['status']='draft'
        self.assertEqual(approved_webtoons(self.temporary_source(mutate),IDS),[])

    def test_missing_owner_publication_approval_fails_closed(self):
        def mutate(source):source['episodes'][0]['approval'].pop('publication')
        with self.assertRaisesRegex(AssertionError,'Owner approval'):
            approved_webtoons(self.temporary_source(mutate),IDS)

    def test_unknown_canonical_link_is_rejected(self):
        def mutate(source):source['episodes'][0]['relatedTerms'][0]['termId']='not-a-canonical-term'
        with self.assertRaisesRegex(AssertionError,'related term'):
            approved_webtoons(self.temporary_source(mutate),IDS)

    def test_nonpublic_path_is_rejected(self):
        def mutate(source):source['episodes'][0]['imageSrc']='../content/webtoons/archive/dom.webp'
        with self.assertRaisesRegex(AssertionError,'unsafe episode image path'):
            approved_webtoons(self.temporary_source(mutate),IDS)

if __name__=='__main__':unittest.main()
