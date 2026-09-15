#!/usr/bin/env python3
"""Turn Sprint 17 non-blocking P2 relation candidates into an RC backlog."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
AUDIT = ROOT / 'data/reviews/final-content-qa-sprint17.json'
OUT = ROOT / 'data/reviews/glossary-polish-backlog-rc.json'

def main():
    records = json.loads(AUDIT.read_text(encoding='utf-8'))['warning_records']
    reviewed = []
    for item in records:
        if item['severity'] != 'P2_POLISH':
            continue
        tier = item['tier']
        disposition = 'BACKLOG' if tier == 'A' else 'NO_CHANGE_NEEDED'
        reviewed.append({
            'term_id': item['term_id'],
            'tier': tier,
            'priority': 'P2',
            'review_disposition': disposition,
            'reason': 'No detailed navigation relation is present; this is non-blocking after full relation-integrity validation.',
            'recommended_improvement': 'Consider one contextually useful learning-navigation relation in a future scoped polish pass.' if disposition == 'BACKLOG' else 'No change: Tier B relation enrichment is optional when the definition is self-contained.',
            'rc_blocking': False,
        })
    payload = {
        'schema_version': '1.0',
        'source': 'final-content-qa-sprint17',
        'reviewed_p2_count': len(reviewed),
        'summary': {'FIX_NOW': 0, 'BACKLOG': sum(x['review_disposition'] == 'BACKLOG' for x in reviewed), 'NO_CHANGE_NEEDED': sum(x['review_disposition'] == 'NO_CHANGE_NEEDED' for x in reviewed)},
        'items': reviewed,
    }
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(payload['summary'])

if __name__ == '__main__':
    main()
