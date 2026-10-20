"""Only explicitly approved episodes become browser data; source images stay private to the repo."""
import json
import re
from pathlib import Path

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
        assert item['relatedTerms'] and all(link['termId'] in canonical_ids and link['label'].strip() for link in item['relatedTerms']), 'unknown related term'
        assert all(item.get('approval', {}).get(field) for field in ('date', 'content', 'publication')), 'missing Owner approval'
        assert (item['width'], item['height']) == (1536, 1024)
        assert [panel['number'] for panel in item['panels']] == [1, 2, 3, 4], 'expected four ordered panels'
        paths = [item[field] for field in ('imageSrc', 'mediumImageSrc', 'smallImageSrc')]
        for panel in item['panels']:
            assert panel['description'].strip() and len(panel['dialogue']) == 2
            assert all(speech['speaker'].strip() and speech['text'].strip() for speech in panel['dialogue'])
            assert (panel['width'], panel['height']) == (736, 480)
            paths.extend(panel[field] for field in ('imageSrc', 'smallImageSrc'))
        for path in paths:
            resolved = (public / path).resolve()
            assert resolved.is_relative_to(public) and path.startswith(f'webtoons/{item["id"]}/'), 'unsafe episode image path'
            assert resolved.is_file() and resolved.suffix == '.webp', f'missing webtoon image: {path}'
        published.append({key: value for key, value in item.items() if key not in {'approval', 'sourceDirectory'}})
    return published
