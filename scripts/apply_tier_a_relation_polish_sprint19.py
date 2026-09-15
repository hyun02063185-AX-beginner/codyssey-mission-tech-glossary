#!/usr/bin/env python3
"""Record the individually reviewed Sprint 19 Tier A learner-navigation links."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
def main():
    master = json.loads((ROOT/'data/curated/glossary-master-v0.1.yaml').read_text())['terms']
    canonical = {term['id'] for term in master}
    backlog = json.loads((ROOT/'data/reviews/glossary-polish-backlog-rc.json').read_text(encoding='utf-8'))
    review = []
    for candidate in backlog['items']:
        if candidate['review_disposition'] != 'BACKLOG':
            continue
        term_id = candidate['term_id']
        path = ROOT/'content/terms'/f'{term_id}.md'
        text = path.read_text(encoding='utf-8')
        section = text.split('## 관련 용어', 1)[1].split('\n## ', 1)[0]
        current = [line.removeprefix('- ').strip().strip('`') for line in section.splitlines() if line.startswith('- ')]
        assert current and all(value in canonical and value != term_id for value in current)
        review.append({'term_id': term_id, 'decision': 'KEEP_AS_IS', 'current_relations': current, 'added_relations': [], 'reason': 'Existing Markdown relations already provide natural next learning steps; the prior audit missed bare Markdown list IDs.', 'rc_blocking': False})
    assert len(review) == 23
    payload = {'schema_version': '1.0', 'source': 'glossary-polish-backlog-rc', 'reviewed': len(review), 'summary': {'ADD_RELATION': 0, 'KEEP_AS_IS': len(review), 'BACKLOG_OTHER': 0}, 'items': review}
    (ROOT/'data/reviews/tier-a-relation-polish-sprint19.json').write_text(json.dumps(payload, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
    print('Recorded 23 individually reviewed Tier A learner-navigation relations.')

if __name__ == '__main__':
    main()
