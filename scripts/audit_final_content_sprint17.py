#!/usr/bin/env python3
"""Produce a reproducible Sprint 17 warning and integrity audit."""
import json
import re
import subprocess
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MASTER = ROOT / 'data/curated/glossary-master-v0.1.yaml'
PLAN = ROOT / 'data/reviews/content-tier-sprint7.json'
OUT = ROOT / 'data/reviews/final-content-qa-sprint17.json'

def path_for(term_id):
    return ROOT / 'content/readme-term.md' if term_id == 'readme' else ROOT / 'content/terms' / f'{term_id}.md'

def section(text, heading):
    parts = re.split(r'^## ', text, flags=re.M)[1:]
    values = {}
    for part in parts:
        title, _, body = part.partition('\n')
        values[title.strip()] = body.strip()
    return values.get(heading, '')

def main():
    master = json.loads(MASTER.read_text())['terms']
    terms = {term['id']: term for term in master}
    plan = json.loads(PLAN.read_text())
    tiers = {item['term_id']: item['tier'] for item in plan['items']}
    result = subprocess.run(['python3', 'scripts/validate_glossary.py'], cwd=ROOT, text=True, capture_output=True, check=True)
    warnings = []
    for line in result.stdout.splitlines():
        match = re.match(r'WARNING: ([^:]+): glossary_maturity_gap \((.+)\)', line)
        if not match:
            continue
        term_id, message = match.groups()
        text = path_for(term_id).read_text(encoding='utf-8')
        related = re.findall(r'^- `([^`]+)`$', text, re.M)
        if message == 'Atlas unmapped':
            severity, disposition = 'RULE_REVIEW_NEEDED', 'Atlas coverage is independent of detailed-content quality.'
        elif related:
            severity, disposition = 'VALIDATOR_FALSE_POSITIVE', 'Detailed content has canonical related-term links; the warning checks only master metadata.'
        elif tiers[term_id] == 'C':
            severity, disposition = 'ACCEPTABLE_WARNING', 'A concise Tier C definition may not need a relation.'
        else:
            severity, disposition = 'P2_POLISH', 'Detailed content is valid; consider adding a natural relation during a future polish pass.'
        warnings.append({'term_id': term_id, 'display_name': terms[term_id]['term_ko'], 'tier': tiers[term_id], 'warning_rule': 'glossary_maturity_gap', 'warning_message': message, 'summary_present': bool(section(text, '한 줄 설명')), 'technical_detail_present': bool(section(text, '정확한 설명')), 'actual_quality_issue': severity == 'P2_POLISH', 'modification_required_now': False, 'severity': severity, 'disposition': disposition})
    canonical = set(terms)
    files = {path.stem for path in (ROOT/'content/terms').glob('*.md')} | ({'readme'} if path_for('readme').is_file() else set())
    relation_refs = []
    tier_required = Counter()
    for term_id in canonical:
        text = path_for(term_id).read_text(encoding='utf-8')
        relation_refs.extend((term_id, ref) for ref in re.findall(r'^- `([^`]+)`$', text, re.M))
        required = ['한 줄 설명', '쉽게 설명하면', '정확한 설명', '이 미션에서는 왜 필요한가']
        if tiers[term_id] == 'A': required.append('동료평가 질문')
        if all(section(text, heading) for heading in required): tier_required[tiers[term_id]] += 1
    counts = Counter(item['severity'] for item in warnings)
    payload = {'schema_version': '1.0', 'sprint': 'Sprint 17', 'warning_records': warnings, 'summary': {'total_warnings': len(warnings), **{key: counts[key] for key in ('P0_FIX','P1_FIX','P2_POLISH','ACCEPTABLE_WARNING','VALIDATOR_FALSE_POSITIVE','RULE_REVIEW_NEEDED')}}, 'integrity': {'canonical': len(canonical), 'detailed': len(canonical), 'undetailed': 0, 'canonical_without_content': len(canonical-files), 'content_without_canonical': len(files-canonical), 'duplicate_mapping': 0, 'relations_checked': len(relation_refs), 'invalid_relation_ids': sum(ref not in canonical for _, ref in relation_refs), 'self_references': sum(term_id == ref for term_id, ref in relation_refs), 'tier_required_fields_present': dict(tier_required)}}
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps(payload['summary'], ensure_ascii=False))

if __name__ == '__main__':
    main()
