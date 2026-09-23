#!/usr/bin/env python3
"""학습자 테스트 배치표와 관찰 기록지를 만든다.

순서 효과를 줄이는 것이 목적이다(Calibration Cycle §8). 통계를 만들려는 것이 아니라
같은 사람이 같은 용어의 두 판본을 연달아 보지 않게 하고, 판본이 참여자마다 엇갈리게 한다.

배치가 규칙을 지키는지 스스로 검사한다. 어기면 멈춘다.

  python scripts/build_learner_test_plan.py            검사만
  python scripts/build_learner_test_plan.py --write    기록지 파일 생성
"""
from __future__ import annotations

import argparse
import collections
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
PILOT = ROOT / "data/reviews/learner-readability-pilot.json"
SAMPLE = ROOT / "data/reviews/learner-readability-sample.json"
OUT_PLAN = ROOT / "data/reviews/learner-test-plan.json"
OUT_SHEET = ROOT / "reports/knowledge-encyclopedia/learner-observation-sheet.md"

# 참여자별 읽을 순서. C = CURRENT, P = PROPOSED.
# 판본이 번갈아 나오게 해 "앞에 본 쪽이 유리해지는" 효과를 줄인다.
ALLOCATION = {
    "P1": [("mysql", "C"), ("variable", "P"), ("commit", "C"), ("process", "P"), ("tcp", "C")],
    "P2": [("mysql", "P"), ("variable", "C"), ("commit", "P"), ("process", "C"), ("tcp", "P")],
    "P3": [("dom-update", "C"), ("o-constant-time", "P"), ("temperature", "C"), ("json-web-token", "P")],
    "P4": [("dom-update", "P"), ("o-constant-time", "C"), ("temperature", "P"), ("json-web-token", "C")],
}
# 참여자가 둘뿐일 때의 축소안. 다섯 용어만 두 판본으로 본다.
FALLBACK = ["P1", "P2"]

# 관찰이 들어오기 전에는 전부 UNJUDGED 다. AI 가 스스로 지지됐다고 적지 않는다.
HYPOTHESES = {
    "note": "판정할 값은 SUPPORTED_BY_HUMAN_TEST / PARTIALLY_SUPPORTED / NOT_SUPPORTED 다.",
    "firstSentenceInversion": {
        "claim": "쉬운 설명을 먼저 주면 이해가 개선된다",
        "scope": "519개 중 333건",
        "testedBy": ["mysql", "commit", "variable", "dom-update", "process", "tcp", "json-web-token"],
        "verdict": "UNJUDGED", "evidence": []},
    "midDifficulty": {
        "claim": "기본이라고 보고 압축한 중간 난이도 설명이 오히려 더 많은 선수지식을 요구한다",
        "scope": "Discovery 표본에서 mid 5/10 PASS (basic 7/8, hard 12/18)",
        "testedBy": ["variable", "commit", "dom-update", "o-constant-time", "temperature"],
        "verdict": "UNJUDGED", "evidence": []},
    "mixedStyle": {
        "claim": "한 문서 안의 존댓말·평서체 혼용이 읽기를 끊는다",
        "scope": "519개 중 340건",
        "limitation": "이번 Pilot 은 문체를 조작하지 않고 기존 문체에 맞췄다. "
                      "두 판본 비교로는 가를 수 없고 CONFUSION_POINT 의 간접 관찰만 가능하다.",
        "testedBy": ["CONFUSION_POINT 에 문체 전환 지점이 반복해 나오는지"],
        "verdict": "UNJUDGED", "evidence": []},
    "nounPhraseEnding": {
        "claim": "명사구로 끝나는 한 줄 설명이 문장보다 덜 읽힌다",
        "scope": "519개 중 349건",
        "testedBy": ["mysql", "commit", "dom-update"],
        "verdict": "UNJUDGED", "evidence": []},
}


def verify(allocation, terms, bands):
    problems = []
    seen = collections.defaultdict(set)
    for person, rows in allocation.items():
        names = [t for t, _ in rows]
        if len(names) != len(set(names)):
            problems.append(f"{person}: 같은 용어를 두 번 본다")
        versions = [v for _, v in rows]
        for i in range(len(versions) - 1):
            if versions[i] == versions[i + 1] and len(set(versions)) == 1:
                problems.append(f"{person}: 판본이 한쪽으로만 몰려 있다")
                break
        for term, version in rows:
            if version in seen[term]:
                problems.append(f"{term}: {version} 판본이 두 번 배정됐다")
            seen[term].add(version)
    for term in terms:
        if seen[term] != {"C", "P"}:
            problems.append(f"{term}: 두 판본이 모두 배정되지 않았다 ({sorted(seen[term])})")
    covered = {t for rows in allocation.values() for t, _ in rows}
    if covered != set(terms):
        problems.append(f"배정되지 않은 용어: {sorted(set(terms) - covered)}")
    return problems


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--write", action="store_true")
    args = ap.parse_args()

    pilot = json.loads(PILOT.read_text(encoding="utf-8"))
    sample = json.loads(SAMPLE.read_text(encoding="utf-8"))
    terms = pilot["learnerTestSet"]["terms"]
    reviews = sample["reviews"]
    bands = {t: reviews[t]["band"] for t in terms}
    domains = {t: reviews[t]["domain"] for t in terms}

    problems = verify(ALLOCATION, terms, bands)
    if problems:
        for p in problems:
            print(f"배치 오류: {p}", file=sys.stderr)
        return 1

    readings = sum(len(v) for v in ALLOCATION.values())
    print(f"용어 {len(terms)} · 참여자 {len(ALLOCATION)} · 읽기 {readings}회")
    print(f"난이도 {dict(collections.Counter(bands.values()))} · 도메인 {len(set(domains.values()))}개")
    for person, rows in ALLOCATION.items():
        mix = collections.Counter(bands[t] for t, _ in rows)
        print(f"  {person}  " + " · ".join(f"{t}({v})" for t, v in rows))
        print(f"      난이도 {dict(mix)}")
    print("\n배치 규칙 검사 통과 — 같은 사람이 같은 용어의 두 판본을 보지 않고, "
          "모든 용어가 두 판본으로 읽힌다.")

    if not args.write:
        return 0

    # 사람이 채운 관찰은 절대 덮어쓰지 않는다. 다시 만들어도 남는다.
    existing = json.loads(OUT_PLAN.read_text(encoding="utf-8")) if OUT_PLAN.exists() else {}
    observations = existing.get("observations", [])

    ai = {t: {"band": reviews[t]["band"],
              "aiReadability": reviews[t]["readability"],
              "aiComprehension": reviews[t]["comprehension"],
              "autoFlags": reviews[t]["autoFlags"],
              "mainIssue": reviews[t]["mainIssue"],
              # 사람이 CURRENT 판본에서 막힐 것인가에 대한 AI 의 예측.
              # 관찰 전에 적어 두어야 나중에 유리하게 맞추지 않는다.
              "prediction": "STUCK" if reviews[t]["comprehension"] != "PASS" else "OK"}
          for t in terms}

    plan = {
        "version": 1,
        "date": "2026-09-24",
        "cycle": "Learner Comprehension Human Calibration",
        "status": "RUN" if observations else "NOT_YET_RUN",
        "note": [
            "실제 학습자 테스트는 아직 수행하지 않았다. 아래는 배치와 기록 틀이다.",
            "formative test 다. 통계를 내려는 것이 아니라 소수에서 반복되는 이해 실패를 찾는다.",
            "관찰이 들어오기 전에는 어떤 가설도 지지됐다고 판정하지 않는다.",
            "이 파일을 다시 만들어도 observations 와 hypotheses 의 판정은 덮어쓰지 않는다.",
        ],
        "terms": [{"termId": t, "band": bands[t], "domain": domains[t]} for t in terms],
        "distribution": pilot["learnerTestSet"]["distribution"],
        "allocation": {p: [{"termId": t, "version": "CURRENT" if v == "C" else "PROPOSED"}
                           for t, v in rows] for p, rows in ALLOCATION.items()},
        "fallbackIfTwoParticipants": FALLBACK,
        "questions": pilot["learnerTestSet"]["questions"],
        "method": pilot["learnerTestSet"]["method"],
        "aiPredictions": {
            "note": [
                "관찰이 들어오기 전에 AI 판정을 먼저 적어 둔다. 나중에 맞춰 보기 위해서다.",
                "prediction STUCK = 사람이 CURRENT 판본에서 막힐 것이라고 본 것.",
                "목표는 AI 정답률이 아니라 518개 검토에 쓸 수 있는 신호를 가려내는 것이다.",
            ],
            "perTerm": ai,
            "summary": {
                "predictStuck": sorted(t for t, v in ai.items() if v["prediction"] == "STUCK"),
                "predictOk": sorted(t for t, v in ai.items() if v["prediction"] == "OK"),
            },
            "comparisonSlots": existing.get("aiPredictions", {}).get("comparisonSlots", {
                "aiFrictionAndHumanStuck": [], "aiPassButHumanFailed": [],
                "aiFlaggedButHumanFine": [], "bothPass": []}),
        },
        "hypotheses": existing.get("hypotheses", HYPOTHESES),
        "observations": observations,
    }
    OUT_PLAN.write_text(json.dumps(plan, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    lines = [
        "# 학습자 관찰 기록지",
        "",
        "> `scripts/build_learner_test_plan.py` 가 만든다. 직접 고치지 않는다.",
        "> **아직 아무도 테스트하지 않았다.** 관찰이 들어오면 "
        "`data/reviews/learner-test-plan.json` 의 `observations` 에 넣는다.",
        "",
        "## 진행 방법",
        "",
    ]
    lines += [f"- {m}" for m in plan["method"]]
    lines += [
        "",
        "## 물어볼 것",
        "",
    ]
    lines += [f"{i}. {q}" for i, q in enumerate(plan["questions"], 1)]
    lines += [
        "",
        "**3번이 핵심이다.** 문장을 그대로 기억했는지가 아니라 자기 말로 다시 만들 수 "
        "있는지를 본다. 전문용어를 못 써도 개념을 설명하면 PASS 다. 반대로 원문을 "
        "되풀이하면서 뜻을 설명하지 못하면 PASS 가 아니다.",
        "",
        "## 배치",
        "",
        "| 참여자 | 순서 |",
        "| --- | --- |",
    ]
    for person, rows in ALLOCATION.items():
        cells = " → ".join(f"`{t}` {'현재' if v == 'C' else '제안'}" for t, v in rows)
        lines.append(f"| **{person}** | {cells} |")
    lines += [
        "",
        f"참여자가 둘뿐이면 **{' · '.join(FALLBACK)}** 만 진행한다. "
        f"용어 5개가 두 판본으로 읽힌다.",
        "",
        "---",
        "",
        "## 기록지",
        "",
    ]
    for person, rows in ALLOCATION.items():
        lines += [f"### {person}", ""]
        for term, version in rows:
            lines += [
                "```",
                f"TERM              {term}  ({bands[term]} · {domains[term]})",
                f"VERSION           {'CURRENT' if version == 'C' else 'PROPOSED'}",
                "",
                "RESTATE           PASS / PARTIAL / FAIL",
                "  (자기 말로 옮긴 문장을 그대로 받아 적는다)",
                "  ",
                "",
                "WHY               PASS / PARTIAL / FAIL",
                "  ",
                "",
                "UNKNOWN_WORDS     ",
                "",
                "CONFUSION_POINT   (읽다가 멈춘 문장)",
                "  ",
                "",
                "EXAMPLE_HELPED    YES / NO / N/A",
                "",
                "OBSERVER_NOTE     ",
                "  ",
                "```",
                "",
            ]
    lines += [
        "---",
        "",
        "개인정보는 적지 않는다. 참여자는 P1~P4 로만 구분한다.",
        "",
    ]
    OUT_SHEET.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"\n기록: {OUT_PLAN.relative_to(ROOT)} · {OUT_SHEET.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
