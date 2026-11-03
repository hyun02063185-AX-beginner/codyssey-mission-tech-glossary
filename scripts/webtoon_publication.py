"""Only explicitly approved episodes become browser data; source images stay private to the repo."""
import json
import re
from pathlib import Path

def validate_company_network_layout(item):
    """Only the opt-in source-preserving layout permits variable speech counts."""
    assert str(item.get('coreSummary', '')).strip() and str(item.get('closingCopy', '')).strip(), 'missing original footer'
    for panel in item['panels']:
        assert panel.get('title', '').strip(), 'missing original panel title'
        assert 1 <= len(panel['dialogue']) <= 3, 'invalid original dialogue count'
        overlays = panel.get('textOverlays', [])
        indices = []
        for overlay in overlays:
            assert overlay.get('kind') in {'dialogue', 'label'}, 'unknown text overlay'
            assert all(isinstance(overlay.get(key), (int, float)) for key in ('x', 'y', 'width', 'height')), 'invalid overlay bounds'
            assert 0 <= overlay['x'] and 0 <= overlay['y'] and overlay['width'] > 0 and overlay['height'] > 0, 'invalid overlay bounds'
            assert overlay['x'] + overlay['width'] <= 728 and overlay['y'] + overlay['height'] <= 472, 'overlay outside panel'
            if overlay['kind'] == 'dialogue':
                indices.append(overlay.get('dialogueIndex'))
            else:
                assert overlay.get('text', '').strip(), 'empty original label'
        assert sorted(indices) == list(range(len(panel['dialogue']))), 'each original speech needs exactly one overlay'

def approved_webtoons(root: Path, canonical_ids: set[str]):
    source = json.loads((root / 'content/webtoons/episodes.json').read_text(encoding='utf-8'))
    assert source['schemaVersion'] == 1
    episodes = source['episodes']
    episode_ids = [item['id'] for item in episodes]
    assert len(episode_ids) == len(set(episode_ids)), 'duplicate webtoon episode ID'
    published = []
    public = (root / 'public').resolve()
    for item in episodes:
        if item.get('status') != 'approved':
            continue
        assert re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', item['id']), 'invalid episode ID'
        for field in ('topic', 'title', 'summary', 'alt', 'definition', 'analogyLimit', 'revision'):
            assert str(item.get(field, '')).strip(), f'{item["id"]}: missing {field}'
        assert item.get('termId') is None or item['termId'] in canonical_ids, 'unknown primary term'
        assert all(link['termId'] in canonical_ids and link['label'].strip() for link in item['relatedTerms']), 'unknown related term'
        assert item['relatedTerms'] or (item.get('termId') is None and item.get('termLinkStatus') == 'unmapped-concept' and str(item.get('termLinkReason', '')).strip()), 'missing explicit unmapped concept reason'
        assert all(item.get('approval', {}).get(field) for field in ('date', 'content', 'publication')), 'missing Owner approval'
        assert (item['width'], item['height']) == (1536, 1024)
        assert [panel['number'] for panel in item['panels']] == [1, 2, 3, 4], 'expected four ordered panels'
        original_layout = item.get('templateVersion') == 'company-network-v1'
        if original_layout:
            validate_company_network_layout(item)
        paths = [item[field] for field in ('imageSrc', 'mediumImageSrc', 'smallImageSrc')]
        for panel in item['panels']:
            assert panel['description'].strip() and (original_layout or len(panel['dialogue']) == 2)
            assert all(speech['speaker'].strip() and speech['text'].strip() for speech in panel['dialogue'])
            assert (panel['width'], panel['height']) == (736, 480)
            paths.extend(panel[field] for field in ('imageSrc', 'smallImageSrc'))
        for path in paths:
            resolved = (public / path).resolve()
            assert resolved.is_relative_to(public) and path.startswith(f'webtoons/{item["id"]}/'), 'unsafe episode image path'
            assert resolved.is_file() and resolved.suffix == '.webp', f'missing webtoon image: {path}'
        published.append({key: value for key, value in item.items() if key not in {'approval', 'sourceDirectory'}})
    return published
