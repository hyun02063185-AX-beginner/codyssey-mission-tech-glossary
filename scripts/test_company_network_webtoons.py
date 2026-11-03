"""Focused source-preservation and approved-publication contracts."""
import copy
import hashlib
import json
import unittest
from pathlib import Path
from PIL import Image
from webtoon_publication import approved_webtoons, validate_company_network_layout

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / 'content/webtoons/company-network'
SOURCE = json.loads((ROOT / 'content/webtoons/episodes.json').read_text())
NEW = [e for e in SOURCE['episodes'] if e.get('seriesId') == 'b31-company-network']
BASELINE = json.loads((CONTENT / 'existing-19-baseline.json').read_text())
IDS = {t['id'] for t in json.loads((ROOT / 'data/curated/glossary-master-v0.1.yaml').read_text())['terms']}

class CompanyNetworkTest(unittest.TestCase):
    def test_original_twelve_panels_match_manuscript(self):
        mapping = json.loads((CONTENT / 'source-map.json').read_text())
        self.assertEqual(len(NEW), 3)
        for episode, original in zip(NEW, mapping):
            self.assertEqual(episode['id'], original['episodeId'])
            self.assertEqual([p['number'] for p in episode['panels']], [1, 2, 3, 4])
            self.assertEqual(episode['coreSummary'], original['coreSummary'])
            self.assertEqual(episode['closingCopy'], original['closingCopy'])
            for panel, transcribed in zip(episode['panels'], original['panels']):
                for field in ('title', 'description', 'dialogue', 'visualInformation', 'concept'):
                    self.assertEqual(panel[field], transcribed[field])
                original_labels = [o['text'] for o in transcribed['textOverlays'] if o['kind'] == 'label']
                if episode['id'] == 'b31-network-suspicious-access-03' and panel['number'] == 4:
                    correction = episode['ownerCorrections'][0]
                    self.assertEqual((correction['panelNumber'], correction['field'], correction['original'], correction['replacement']),
                                     (4, 'nameplate', '김창현', '김정현'))
                    self.assertTrue(correction['date'] and correction['authorization'])
                    self.assertEqual(original_labels.count('김창현'), 1)
                    original_labels = ['김정현' if text == '김창현' else text for text in original_labels]
                self.assertEqual([o['text'] for o in panel['textOverlays'] if o['kind'] == 'label'], original_labels)
                self.assertEqual(panel.get('diagram'), transcribed.get('diagram'))
        for file, sha in BASELINE['originalSha256'].items():
            self.assertEqual(hashlib.sha256((ROOT / file).read_bytes()).hexdigest(), sha, file)

    def test_existing_nineteen_metadata_and_assets_unchanged(self):
        existing = SOURCE['episodes'][:19]
        self.assertEqual([e['id'] for e in existing], BASELINE['approvedIds'])
        digest = hashlib.sha256(json.dumps(existing, sort_keys=True, ensure_ascii=False).encode()).hexdigest()
        self.assertEqual(digest, BASELINE['manifestSha256'])
        for file, sha in BASELINE['files'].items():
            self.assertEqual(hashlib.sha256((ROOT / file).read_bytes()).hexdigest(), sha, file)

    def test_owner_approved_episodes_are_public_and_links_resolve(self):
        self.assertEqual([e['id'] for e in approved_webtoons(ROOT, IDS)], BASELINE['approvedIds'] + [e['id'] for e in NEW])
        for i, e in enumerate(NEW):
            self.assertEqual(e['status'], 'approved')
            self.assertTrue(all(e['approval'].get(key) for key in ('date','content','publication','reviewedCommit')))
            self.assertTrue((ROOT / 'public/webtoons' / e['id']).is_dir())
            self.assertTrue(all(t['termId'] in IDS for t in e['relatedTerms']))
            self.assertEqual(e.get('nextEpisodeId'), NEW[i+1]['id'] if i < 2 else None)

    def test_private_png_and_webp_dimensions(self):
        for e in NEW:
            directory = ROOT / e['sourceDirectory']
            for image in (directory / 'preview').glob('*.webp'):
                self.assertEqual(image.read_bytes(), (ROOT / 'public/webtoons' / e['id'] / image.name).read_bytes())
            for name, dimensions in [('art.png', (1536, 1024)), ('master.png', (1536, 1024))]:
                with Image.open(directory / name) as im: self.assertEqual(im.size, dimensions)
            for name, dimensions in [('full.webp',(1536,1024)), ('full-1024.webp',(1024,683)), ('full-768.webp',(768,512))]:
                with Image.open(directory / 'preview' / name) as im: self.assertEqual(im.size, dimensions)
            for number in range(1, 5):
                for name, dimensions in [(f'panel-{number}.png',(736,480)), (f'preview/panel-{number}.webp',(736,480)), (f'preview/panel-{number}-368.webp',(368,240))]:
                    with Image.open(directory / name) as im: self.assertEqual(im.size, dimensions)

    def test_variable_dialogue_layout_and_missing_overlay_rejection(self):
        for e in NEW: validate_company_network_layout(e)
        bad = copy.deepcopy(NEW[0])
        bad['panels'][0]['textOverlays'] = [o for o in bad['panels'][0]['textOverlays'] if o['kind'] != 'dialogue']
        with self.assertRaisesRegex(AssertionError, 'each original speech'):
            validate_company_network_layout(bad)

    def test_out_of_panel_overlay_is_rejected(self):
        bad = copy.deepcopy(NEW[0])
        bad['panels'][0]['textOverlays'][0]['x'] = 730
        with self.assertRaisesRegex(AssertionError, 'outside panel'):
            validate_company_network_layout(bad)

if __name__ == '__main__': unittest.main()
