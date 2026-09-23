#!/usr/bin/env python3
"""Term Specificity Audit — Swap Test 의 기계적 근사치.

용어 이름을 <T> 로 가린 뒤에도 같은 문장이 다른 용어에서 그대로 나오면,
그 문장은 이름만 갈아 끼운 틀이다. 이 검사는 "이 문장은 나쁘다"를 단정하지
않는다. **검토 후보를 고르는 도구**이며 결과는 절대 ERROR 로 쓰지 않는다
(Content Quality Cycle §5). 판단은 사람이 실제 문서를 열어서 한다.

  python scripts/audit_term_specificity.py            사람이 읽는 요약
  python scripts/audit_term_specificity.py --json     기계가 읽는 전체 결과
  python scripts/audit_term_specificity.py --term X   한 용어만
"""
from __future__ import annotations

import argparse
import collections
import json
import re
import sys
from pathlib import Path

# Windows 기본 콘솔은 cp949 라 본문의 —·… 같은 글자에서 UnicodeEncodeError 로 멈춘다.
# 분석 결과가 아니라 출력 경로의 문제이므로 여기서 출력만 utf-8 로 고정한다.
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parent.parent
TERMS = ROOT / "content" / "terms"

# 사람이 쓴 설명이 들어가는 절만 본다. '정확한 설명'은 정의라서 원래 용어마다 다르고,
# '관련 용어'는 목록이라 문장 검사의 대상이 아니다.
PROSE_SECTIONS = [
    "쉽게 설명하면",
    "이 미션에서는 왜 필요한가",
    "동작 원리",
    "주의할 점 / 경계 조건",
    "주의할 점",
    "기억할 경계",
    "언제 쓰나",
    "흔한 오해",
    "비슷한 개념과의 차이",
    "동료평가 질문",
]
# 코드 블록에 용어 이름만 들어 있으면 자리 표시다. 길이로는 재지 않는다 —
# 짧아도 제 몫을 하는 예제(`chmod 640 secrets.txt`)까지 결함으로 잡게 된다.
CODE_FENCE_RE = re.compile(r"^```[a-z]*\n|```$")
SECTION_RE = re.compile(r"^## ([^\n]+)\n(.*?)(?=\n## |\Z)", re.M | re.S)
FENCE_RE = re.compile(r"```.*?```", re.S)
PARTICLE_RE = re.compile(r"<T>(을\(를\)|은\(는\)|이\(가\)|을|를|은|는|이|가|의|에|와|과)?")


def parse(path: Path) -> dict:
    text = path.read_text(encoding="utf-8")
    # 코드 블록 안의 "## " 로 시작하는 줄이 절 제목으로 잘못 읽힌다.
    # 블록을 같은 길이의 '.' 로 가려 위치를 보존하고, 잘라 낼 때는 원본에서 꺼낸다.
    masked = FENCE_RE.sub(lambda m: "." * len(m.group(0)), text)
    doc = {
        m.group(1).strip(): text[m.start(2):m.end(2)].strip()
        for m in SECTION_RE.finditer(masked)
    }
    title = re.match(r"# ([^\n]+)", text)
    doc["_title"] = title.group(1).strip() if title else path.stem
    return doc


def shape(term_id: str, title: str, body: str) -> str:
    """용어를 가리키는 모든 표기를 <T> 로 바꿔 문장의 '틀'만 남긴다."""
    out = re.sub(r"\s+", " ", body)
    names = {title, term_id, term_id.replace("-", " "), *re.split(r"\s*/\s*", title)}
    for token in sorted((n for n in names if len(n) > 1), key=len, reverse=True):
        out = out.replace(token, "<T>")
    return PARTICLE_RE.sub("<T>", out)


def audit() -> dict:
    docs = {p.stem: parse(p) for p in sorted(TERMS.glob("*.md"))}
    shapes: dict[str, collections.Counter] = {s: collections.Counter() for s in PROSE_SECTIONS}
    owners: dict[tuple[str, str], list[str]] = collections.defaultdict(list)
    for term_id, doc in docs.items():
        for section in PROSE_SECTIONS:
            if not doc.get(section):
                continue
            key = shape(term_id, doc["_title"], doc[section])
            shapes[section][key] += 1
            owners[(section, key)].append(term_id)

    # '정확한 설명'이 '한 줄 설명'을 그대로 반복한 뒤 분야 공통 꼬리 한 문장을 붙인 형태.
    # 앞 문장이 용어마다 달라서 문장 틀 검사에는 걸리지 않지만, 더해진 내용이 없다.
    tails: collections.Counter = collections.Counter()
    restated: dict[str, int] = {}
    for term_id, doc in docs.items():
        summary, detail = doc.get("한 줄 설명", ""), doc.get("정확한 설명", "")
        if summary and detail.startswith(summary.rstrip(".")):
            tails[detail[len(summary):].strip()] += 1
    for term_id, doc in docs.items():
        summary, detail = doc.get("한 줄 설명", ""), doc.get("정확한 설명", "")
        if summary and detail.startswith(summary.rstrip(".")):
            restated[term_id] = tails[detail[len(summary):].strip()] - 1

    terms: dict[str, dict] = {}
    for term_id, doc in docs.items():
        shared = []
        for section in PROSE_SECTIONS:
            if not doc.get(section):
                continue
            key = shape(term_id, doc["_title"], doc[section])
            if shapes[section][key] > 1:
                shared.append({"section": section, "sharedWith": shapes[section][key] - 1})
        code = doc.get("코드 예")
        body = re.sub(r"[\s`]", "", CODE_FENCE_RE.sub("", (code or "").strip()))
        names = {re.sub(r"[\s`]", "", n) for n in (doc["_title"], term_id, term_id.replace("-", " "))}
        placeholder = bool(code) and (not body or body in names)
        terms[term_id] = {
            "title": doc["_title"],
            "sharedSections": shared,
            "codeState": "none" if not code else ("placeholder" if placeholder else "written"),
            "restatesSummary": restated.get(term_id),
        }

    groups = [
        {"section": section, "size": count, "shape": key[:160], "terms": owners[(section, key)]}
        for section in PROSE_SECTIONS
        for key, count in shapes[section].most_common()
        if count > 1
    ]
    groups.sort(key=lambda g: -g["size"])
    return {"terms": terms, "groups": groups}


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--json", action="store_true")
    ap.add_argument("--term")
    args = ap.parse_args()
    result = audit()

    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return 0
    if args.term:
        row = result["terms"].get(args.term)
        if not row:
            print(f"없는 용어: {args.term}")
            return 1
        print(f"{args.term} ({row['title']})  코드 예: {row['codeState']}")
        if row["restatesSummary"] is not None:
            print(f"  · 정확한 설명이 한 줄 설명을 되풀이 — 뒤 문장을 {row['restatesSummary']}개 용어와 공유")
        for s in row["sharedSections"]:
            print(f"  · {s['section']} — 같은 틀 {s['sharedWith']}개와 공유")
        if not row["sharedSections"]:
            print("  공유된 문장 틀 없음")
        return 0

    terms = result["terms"]
    flagged = [t for t, r in terms.items() if r["sharedSections"]]
    print(f"용어 {len(terms)}개 중 공유 문장 틀을 가진 용어 {len(flagged)}개")
    by_section: collections.Counter = collections.Counter()
    for row in terms.values():
        for s in row["sharedSections"]:
            by_section[s["section"]] += 1
    for section, n in by_section.most_common():
        print(f"  {section:<22} {n}")
    codes = collections.Counter(r["codeState"] for r in terms.values())
    print(f"\n코드 예 — 작성 {codes['written']} / 자리 표시 {codes['placeholder']} / 없음 {codes['none']}")
    shared_tail = [t for t, r in terms.items() if (r["restatesSummary"] or 0) > 0]
    restated = [t for t, r in terms.items() if r["restatesSummary"] is not None]
    print(f"정확한 설명이 한 줄 설명을 되풀이 — {len(restated)}개"
          f" (그중 뒤 문장까지 공유 {len(shared_tail)}개)")
    print("\n가장 큰 공유 묶음")
    for g in result["groups"][:8]:
        print(f"  [{g['size']:>3}] {g['section']} — {g['shape'][:88]}")
    print("\n이 결과는 검토 후보 목록이다. 실패 판정이 아니다.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
