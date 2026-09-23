#!/usr/bin/env python3
"""Owner 검토용 Pilot 비교본을 만든다.

CURRENT 는 손으로 옮겨 적지 않는다. 언제나 `src/data/generated/glossary.json` 에서
읽어 화면에 보이는 순서 그대로 쓴다. 그래야 콘텐츠가 바뀌어도 비교본이 어긋나지 않는다.

PROPOSED 는 `data/reviews/learner-readability-pilot.json` 의 제안이며
`content/terms` 에 적용된 것이 아니다.

  python scripts/build_pilot_comparison.py            표준 출력
  python scripts/build_pilot_comparison.py --write    보고서 파일로 저장
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

# Windows 기본 콘솔은 cp949 라 본문의 —·… 같은 글자에서 UnicodeEncodeError 로 멈춘다.
# 분석 결과가 아니라 출력 경로의 문제이므로 여기서 출력만 utf-8 로 고정한다.
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parent.parent
GLOSSARY = ROOT / "src/data/generated/glossary.json"
PILOT = ROOT / "data/reviews/learner-readability-pilot.json"
OUT = ROOT / "reports/knowledge-encyclopedia/learner-pilot-comparison.md"

# 학습자 화면에 나오는 순서 그대로. App.tsx 의 렌더 순서와 같다.
SCREEN_ORDER = [
    ("summary", "한 줄 설명"),
    ("easyExplanation", "쉽게 설명하면"),
    ("technicalExplanation", "정확한 설명"),
    ("howItWorks", "동작 원리"),
    ("missionContext", "이 미션에서는 왜 필요한가"),
    ("codeExample", "코드 예"),
    ("limitationsOrEdgeCases", "주의할 점 / 경계 조건"),
    ("commonMisconceptions", "흔한 오해"),
    ("peerReviewQuestions", "동료평가 질문"),
]


def block(text: str, indent: str = "  ") -> str:
    return "\n".join(indent + line if line.strip() else "" for line in text.splitlines())


def render(pilot, term) -> list[str]:
    changed = {pilot["section"], *pilot.get("alsoProposed", {})}
    proposed = {pilot["section"]: pilot["proposed"], **pilot.get("alsoProposed", {})}

    out = [f"## {pilot['termId']} — {term['termKo']}", ""]
    out.append(f"`{pilot['domain']}` · 난이도 **{pilot['band']}** · "
               f"AI 판정 읽기 **{pilot['readability']}** / 이해 **{pilot['comprehension']}**")
    out += ["", f"**문제** — {pilot['problem']}", ""]

    out += ["### CURRENT — 지금 학습자가 보는 순서", "", "```"]
    for key, label in SCREEN_ORDER:
        value = (term.get(key) or "").strip()
        if not value:
            continue
        mark = "  ←  바뀜" if key in changed else ""
        out.append(f"[{label}]{mark}")
        out.append(block(value))
        out.append("")
    out += ["```", ""]

    out += ["### PROPOSED — 바뀌는 절만", "", "```"]
    for key, label in SCREEN_ORDER:
        if key not in proposed:
            continue
        out.append(f"[{label}]")
        out.append(block(proposed[key]))
        out.append("")
    out += ["```", ""]

    out += ["### CHANGE", ""]
    out += [f"- {line}" for line in pilot["change"]]
    out += ["", "### RISK — 이 제안이 잃을 수 있는 것", "", pilot["risk"], "",
            "### WHY", "", pilot["why"], "", "---", ""]
    return out


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--write", action="store_true")
    args = ap.parse_args()

    glossary = {t["id"]: t for t in json.loads(GLOSSARY.read_text(encoding="utf-8"))}
    doc = json.loads(PILOT.read_text(encoding="utf-8"))

    lines = [
        "# Pilot 비교본 — Owner 검토용",
        "",
        "> 이 파일은 `scripts/build_pilot_comparison.py` 가 만든다. 직접 고치지 않는다.",
        f"> CURRENT 는 `src/data/generated/glossary.json` 에서 읽고, PROPOSED 는 "
        f"`data/reviews/learner-readability-pilot.json` 의 제안이다.",
        f"> **`content/terms` 에 적용된 것이 아니다.**",
        "",
        f"Pilot **{len(doc['pilots'])}개**. 각 항목에 CURRENT · PROPOSED · CHANGE · RISK · WHY 가 있다.",
        "",
        "## 읽으면서 정할 것",
        "",
        "1. 어느 쪽이 **처음 읽었을 때** 더 잘 들어오는가?",
        "2. PROPOSED 가 너무 쉬워져 정확성을 잃지는 않았는가? (RISK 항목을 함께 본다)",
        "3. 설명이 교과서처럼 느껴지는 지점은 어디인가?",
        "4. 어디에서 읽다가 멈추게 되는가?",
        "5. 예시는 이해를 돕는가?",
        "6. 처음 보기와 상세 설명의 경계가 적절한가?",
        "7. 더 알고 싶을 때 다음 단계가 자연스러운가?",
        "",
        "점수를 매기지 않는다. **짧은 코멘트**가 더 쓸모 있다.",
        "",
        "---",
        "",
    ]

    for pilot in doc["pilots"]:
        term = glossary.get(pilot["termId"])
        if term is None:
            print(f"없는 용어: {pilot['termId']}", file=sys.stderr)
            return 1
        lines += render(pilot, term)

    text = "\n".join(lines)
    if args.write:
        OUT.write_text(text + "\n", encoding="utf-8")
        print(f"기록: {OUT.relative_to(ROOT)} ({len(doc['pilots'])}개)")
    else:
        print(text)
    return 0


if __name__ == "__main__":
    sys.exit(main())
