"""Content Quality 기준선 — 518개 전체 분류.

기준은 docs/knowledge-encyclopedia/08-content-quality-criteria.md 를 따른다.
기계가 판정할 수 있는 것만 기계로 판정하고, 나머지는 사람이 볼 목록으로 남긴다.
"""
import collections, json, pathlib, re, subprocess, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
AUDIT = json.loads(subprocess.run(
    [sys.executable, str(ROOT / 'scripts/audit_term_specificity.py'), '--json'],
    capture_output=True, text=True, encoding='utf-8', cwd=ROOT).stdout)['terms']
GLOSSARY = {t['id']: t for t in json.load(open(ROOT / 'src/data/generated/glossary.json', encoding='utf-8'))}
PREV = json.load(open(ROOT / 'data/reviews/r12-content-template-audit.json', encoding='utf-8'))

# 화면에 그대로 글자로 나가는 절. 코드 예는 <pre> 라 제외한다.
PROSE = ['summary', 'easyExplanation', 'technicalExplanation', 'howItWorks', 'missionContext',
         'limitationsOrEdgeCases', 'commonMisconceptions', 'peerReviewQuestions']
# 회차가 무엇을 요구하는지 단정하는 문장. 저장소의 Mission source(mission_refs 의
# source_status 와 context)와 대조하기 전까지는 사람이 확인할 목록으로 남긴다.
CLAIM = re.compile(r'이 회차(는|가)[^.]*(요구|명시|정하고|금지)')
# 생성기가 남긴 조사 자리 표시. 화면에서는 평문이라 괄호가 그대로 보인다.
PARTICLE = re.compile(r'(은|는|이|가|을|를|와|과|으로|로)\((은|는|이|가|을|를|와|과|으로|로)\)')

# 대조가 끝난 단정은 더 이상 '확인이 필요한' 상태가 아니다. 기록에 없는 새 단정만 걸린다.
REVIEW = json.load(open(ROOT / 'data/reviews/mission-claim-review.json', encoding='utf-8'))
REVIEWED = ({row['termId'] for row in REVIEW['changed']}
            | {row['termId'] for row in REVIEW['supported']})


def classify(term_id):
    row = AUDIT[term_id]
    reasons = []

    # CONFIRMED_DEFECT — 기준을 명확히 어긴 것
    if row['sharedSections']:
        reasons.append(('CONFIRMED_DEFECT', '다른 용어와 같은 문장 틀을 쓴다'))
    if (row['restatesSummary'] or 0) > 0:
        reasons.append(('CONFIRMED_DEFECT', '정확한 설명이 한 줄 설명을 되풀이하고 뒤 문장도 공유한다'))
    if row['codeState'] == 'placeholder':
        reasons.append(('CONFIRMED_DEFECT', '코드 예에 용어 이름만 들어 있다'))

    doc = GLOSSARY.get(term_id)
    if doc:
        # NEEDS_MINOR_EDITORIAL — 내용은 맞지만 화면에서 읽기에 거슬리는 것
        on_screen = [doc.get(f) or '' for f in PROSE]
        on_screen += [r.get('context') or '' for r in (doc.get('missionRefs') or [])]
        if any('`' in text for text in on_screen):
            reasons.append(('NEEDS_MINOR_EDITORIAL', '본문의 백틱이 화면에 글자로 그대로 보인다'))
        if any(PARTICLE.search(text) for text in on_screen):
            reasons.append(('NEEDS_MINOR_EDITORIAL', '"은(는)" 같은 괄호 조사 표기가 화면에 그대로 보인다'))
        if row['restatesSummary'] == 0:
            reasons.append(('NEEDS_MINOR_EDITORIAL', '정확한 설명이 한 줄 설명으로 시작한다(뒤 문장은 고유)'))
        # NEEDS_MANUAL_REVIEW — 사람이 원문과 대조해야 하는 것
        if CLAIM.search(doc.get('missionContext') or '') and term_id not in REVIEWED:
            reasons.append(('NEEDS_MANUAL_REVIEW',
                            '회차의 요구 사항을 단정한다. Mission source 와 대조가 필요하다'))

    order = ['CONFIRMED_DEFECT', 'NEEDS_MANUAL_REVIEW', 'NEEDS_MINOR_EDITORIAL']
    for level in order:
        picked = [r for lv, r in reasons if lv == level]
        if picked:
            return level, picked
    return 'CONTENT_OK', []


def main():
    rows = {}
    for term_id in sorted(AUDIT):
        status, reasons = classify(term_id)
        rows[term_id] = {
            'status': status,
            'reasons': reasons,
            'previousStatus': PREV['terms'].get(term_id, {}).get('status'),
            'category': PREV['terms'].get(term_id, {}).get('category'),
        }
    counts = collections.Counter(r['status'] for r in rows.values())
    moved = collections.Counter(
        (r['previousStatus'], r['status']) for r in rows.values() if r['previousStatus'])

    out = {
        'version': 1,
        'date': '2026-09-22',
        'cycle': 'Content Quality Completion',
        'criteria': 'docs/knowledge-encyclopedia/08-content-quality-criteria.md',
        'tool': 'scripts/audit_term_specificity.py',
        'note': ('CONFIRMED_DEFECT 는 기준을 명확히 어긴 것만 센다. '
                 'NEEDS_MANUAL_REVIEW 는 틀렸다는 뜻이 아니라 사람이 원문과 대조해야 한다는 뜻이다. '
                 '애매한 문서를 숫자를 맞추려고 CONTENT_OK 로 넘기지 않는다.'),
        'counts': dict(counts),
        'total': len(rows),
        'transitions': {f'{a} → {b}': n for (a, b), n in sorted(moved.items(), key=lambda x: -x[1])},
        'terms': rows,
    }
    path = ROOT / 'data/reviews/content-quality-baseline.json'
    path.write_text(json.dumps(out, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

    print(f'용어 {len(rows)}개')
    for status in ('CONTENT_OK', 'NEEDS_MINOR_EDITORIAL', 'NEEDS_MANUAL_REVIEW', 'CONFIRMED_DEFECT'):
        print(f'  {status:<24}{counts.get(status, 0)}')
    print('\n지난 회차 분류에서의 이동')
    for k, n in list(out['transitions'].items())[:8]:
        print(f'  {k:<34}{n}')
    print(f'\n기록: {path.relative_to(ROOT)}')


if __name__ == '__main__':
    main()
