#!/usr/bin/env python3
"""Priority Learning Term 의 검토 현황을 계산한다.

왜 따로 계산하는가
------------------
`204 / 300 = 68.0%` 같은 legacy metric 은 유용하지만 한 가지를 말하지 못한다.
분모 300 전체가 반드시 선수 관계를 가져야 하는 것은 아니다. SQL·테이블·프로세스처럼
그 영역의 출발점인 개념은 앞에 둘 것이 없는 것이 정상이고, 숫자를 올리려고 억지로
선행을 붙이면 데이터가 나빠진다.

그래서 두 단계로 나눈다.

  Priority Review Coverage   판정을 마친 term / 전체 priority term
                             '왜 경로가 없는지 모르는 상태'가 얼마나 남았는가

  Pre-Authoring Path Coverage  판정 당시 이미 경로가 있던 term / PATH_NEEDED
                               판정과 작성을 구분해 본 수치

  Final Path Coverage          지금 경로를 가진 term / PATH_NEEDED
                               작업까지 끝낸 뒤의 비율

  Unresolved Rate              DEFERRED / 전체 priority term

Pre-Authoring 과 Final 을 나란히 두는 이유는 Final 100% 가 측정 결과가 아니라
'판정 직후 바로 작성했다'는 작업 방식의 결과일 수 있기 때문이다. 둘의 차이가
이번 작업에서 새로 이은 양이다.

판정 기록은 data/reviews/encyclopedia-learning-coverage.json 에 있고,
이미 경로를 가진 term 은 그 관계를 작성할 때 cluster review 를 거쳤으므로
여기서 자동으로 PATH_NEEDED + 경로 보유로 집계한다(artifact 의 implicit_review_rule).

사용법
------
    python scripts/report_coverage_review.py            # 사람이 읽는 표
    python scripts/report_coverage_review.py --json     # 기계 판독
    python scripts/report_coverage_review.py --unreviewed   # 아직 판정 안 한 것 목록
    python scripts/report_coverage_review.py --freeze       # baseline artifact 재생성

--freeze 가 쓰는 파일은 **생성물**이다. 손으로 고치지 않는다. 판정을 바꾸려면
data/reviews/encyclopedia-learning-coverage.json 을 고치고 다시 생성한다.
"""
import argparse
import json
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GRAPH = ROOT / "src/data/generated/encyclopedia-graph.json"
REVIEW = ROOT / "data/reviews/encyclopedia-learning-coverage.json"
BASELINE = ROOT / "data/reviews/encyclopedia-learning-coverage-baseline.json"
NEEDS_PATH = "PATH_NEEDED"


def priority_terms(graph):
    """빌더의 Learning Coverage 와 똑같은 분모. 수동 flag 없이 기존 파생 데이터에서만 만든다."""
    nodes = graph["nodes"]
    return [
        node for node in nodes.values()
        if node["kind"] == "term" and node.get("importance") == "core"
        and any(ref["sourceStatus"] in ("direct", "required") for ref in node.get("missions", []))
        and node["academic"]["primary"]
        and nodes[f"academic:{node['academic']['primary']}"]["visibility"] == "active"
    ]


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--json", action="store_true")
    parser.add_argument("--unreviewed", action="store_true", help="아직 판정하지 않은 term 을 학문별로 나열한다.")
    parser.add_argument("--freeze", action="store_true", help="baseline artifact 를 다시 생성한다.")
    args = parser.parse_args()

    graph = json.loads(GRAPH.read_text(encoding="utf-8"))
    review = json.loads(REVIEW.read_text(encoding="utf-8"))
    judgments = review["judgments"]
    learn_first = graph["indexes"]["learnFirst"]

    rows = []
    for node in priority_terms(graph):
        term_id = node["termId"]
        has_path = bool(learn_first.get(node["id"]))
        if term_id in judgments:
            row = judgments[term_id]
            status, basis, at_judgment = row["status"], "reviewed", bool(row.get("pathAtJudgment"))
        elif has_path:
            # 경로가 있다는 것은 그 관계를 작성하며 검토했다는 뜻이다(implicit_review_rule).
            # 그 경로는 이 판정 모델이 생기기 전에 이미 있었으므로 판정 당시 보유로 센다.
            status, basis, at_judgment = NEEDS_PATH, "path-authored", True
        else:
            status, basis, at_judgment = None, "not-reviewed", False
        rows.append({"termId": term_id, "academic": node["academic"]["primary"],
                     "status": status, "basis": basis, "hasPath": has_path,
                     "pathAtJudgment": at_judgment})

    total = len(rows)
    reviewed = [r for r in rows if r["status"]]
    needs_path = [r for r in reviewed if r["status"] == NEEDS_PATH]
    covered = [r for r in needs_path if r["hasPath"]]
    pre_authored = [r for r in needs_path if r["pathAtJudgment"]]
    counts = Counter(r["status"] for r in reviewed)
    metrics = {
        "priorityTotal": total,
        "reviewed": len(reviewed),
        "priorityReviewCoveragePercent": round(len(reviewed) / total * 100, 1) if total else 0,
        "pathNeeded": counts[NEEDS_PATH],
        "validRoot": counts["VALID_ROOT"],
        "noPrerequisiteNeeded": counts["NO_PREREQUISITE_NEEDED"],
        "deferred": counts["DEFERRED"],
        "notReviewed": total - len(reviewed),
        "pathCovered": len(covered),
        "pathMissing": len(needs_path) - len(covered),
        "pathAlreadyConnectedAtJudgment": len(pre_authored),
        "preAuthoringPathCoveragePercent": round(len(pre_authored) / len(needs_path) * 100, 1) if needs_path else 0,
        "newPathAuthored": len(covered) - len(pre_authored),
        "finalPathCoveragePercent": round(len(covered) / len(needs_path) * 100, 1) if needs_path else 0,
        "unresolvedRatePercent": round(counts["DEFERRED"] / total * 100, 1) if total else 0,
        "legacyCoveragePercent": graph["stats"]["learningCoveragePercent"],
    }

    # 판정과 그래프가 어긋나면 어느 쪽이 낡은 것이다. 조용히 넘기지 않는다.
    conflicts = [term_id for term_id, row in judgments.items()
                 if row["status"] != NEEDS_PATH and learn_first.get(f"term:{term_id}")]
    stale = [term_id for term_id in judgments if f"term:{term_id}" not in graph["nodes"]]

    breakdown = {}
    for field in sorted({r["academic"] for r in rows}):
        field_rows = [r for r in rows if r["academic"] == field]
        counter = Counter(r["status"] or "NOT_REVIEWED" for r in field_rows)
        breakdown[field] = {
            "total": len(field_rows),
            "pathNeeded": counter[NEEDS_PATH],
            "validRoot": counter["VALID_ROOT"],
            "noPrerequisiteNeeded": counter["NO_PREREQUISITE_NEEDED"],
            "deferred": counter["DEFERRED"],
            "notReviewed": counter["NOT_REVIEWED"],
            "pathMissing": sum(1 for r in field_rows if r["status"] == NEEDS_PATH and not r["hasPath"]),
        }
    unresolved = sorted(
        [{"termId": r["termId"], "academic": r["academic"], "status": r["status"],
          "reason": judgments.get(r["termId"], {}).get("reason", "")}
         for r in rows if r["status"] == "DEFERRED" or r["status"] is None
         or (r["status"] == NEEDS_PATH and not r["hasPath"])],
        key=lambda r: (r["academic"], r["termId"]))

    if args.freeze:
        if conflicts or stale:
            print("ERROR: 충돌이 있는 상태로는 baseline 을 생성하지 않습니다.")
            return 1
        BASELINE.write_text(json.dumps({
            "artifactType": "generated-learning-coverage-baseline",
            "generatedBy": "scripts/report_coverage_review.py --freeze",
            "generatedFrom": ["src/data/generated/encyclopedia-graph.json",
                              "data/reviews/encyclopedia-learning-coverage.json"],
            "doNotEditByHand": "판정을 바꾸려면 encyclopedia-learning-coverage.json 을 고치고 다시 생성하세요.",
            "reviewVersion": review["version"],
            "basisCommit": review["basis_commit"],
            "metrics": metrics,
            "academicBreakdown": breakdown,
            "unresolved": unresolved,
        }, ensure_ascii=False, indent=2) + chr(10), encoding="utf-8")
        print(f"baseline 생성: {BASELINE.relative_to(ROOT)}")
        print(f"  review {metrics['priorityReviewCoveragePercent']}% · "
              f"pre-authoring {metrics['preAuthoringPathCoveragePercent']}% · "
              f"final {metrics['finalPathCoveragePercent']}% · unresolved {len(unresolved)}")
        return 0

    if args.json:
        print(json.dumps({"metrics": metrics, "academicBreakdown": breakdown,
                          "unresolved": unresolved, "conflicts": conflicts, "stale": stale,
                          "rows": sorted(rows, key=lambda r: (r["academic"], r["termId"]))},
                         ensure_ascii=False, indent=1))
        return 1 if conflicts or stale else 0

    print("Priority Learning Term 검토 현황")
    print("=" * 78)
    print(f"  전체 priority term          {metrics['priorityTotal']}")
    print(f"  판정 완료                   {metrics['reviewed']}  ({metrics['priorityReviewCoveragePercent']}%)  <- Priority Review Coverage")
    print(f"    PATH_NEEDED               {metrics['pathNeeded']}")
    print(f"    VALID_ROOT                {metrics['validRoot']}")
    print(f"    NO_PREREQUISITE_NEEDED    {metrics['noPrerequisiteNeeded']}")
    print(f"    DEFERRED                  {metrics['deferred']}")
    print(f"  미검토                      {metrics['notReviewed']}")
    print()
    print(f"  PATH_NEEDED                 {metrics['pathNeeded']}")
    print(f"    판정 당시 이미 경로 보유    {metrics['pathAlreadyConnectedAtJudgment']}"
          f"  ({metrics['preAuthoringPathCoveragePercent']}%)  <- Pre-Authoring Path Coverage")
    print(f"    이번에 새로 이은 것         {metrics['newPathAuthored']}")
    print(f"    최종 경로 보유              {metrics['pathCovered']}"
          f"  ({metrics['finalPathCoveragePercent']}%)  <- Final Path Coverage")
    print(f"  경로 미보유                 {metrics['pathMissing']}")
    print(f"  Unresolved Rate             {metrics['unresolvedRatePercent']}%  (DEFERRED / 전체)")
    print()
    print(f"  (참고) legacy coverage      {metrics['legacyCoveragePercent']}%  = 경로 보유 / 전체 priority")
    print("=" * 78)

    by_field = defaultdict(Counter)
    for row in rows:
        by_field[row["academic"]][row["status"] or "NOT_REVIEWED"] += 1
    print(f"{'academic':<26}{'total':>6}{'reviewed':>10}{'root':>6}{'no-pre':>8}{'defer':>7}{'miss':>6}{'unrev':>7}")
    for field, counter in sorted(by_field.items(), key=lambda kv: -sum(kv[1].values())):
        field_rows = [r for r in rows if r["academic"] == field]
        missing = sum(1 for r in field_rows if r["status"] == NEEDS_PATH and not r["hasPath"])
        print(f"{field:<26}{len(field_rows):>6}{len(field_rows) - counter['NOT_REVIEWED']:>10}"
              f"{counter['VALID_ROOT']:>6}{counter['NO_PREREQUISITE_NEEDED']:>8}"
              f"{counter['DEFERRED']:>7}{missing:>6}{counter['NOT_REVIEWED']:>7}")

    if args.unreviewed:
        print("\n아직 판정하지 않은 term")
        for field in sorted({r["academic"] for r in rows if r["basis"] == "not-reviewed"}):
            names = sorted(r["termId"] for r in rows if r["academic"] == field and r["basis"] == "not-reviewed")
            print(f"  {field} ({len(names)}): {', '.join(names)}")

    if conflicts:
        print("\nERROR: 판정과 그래프가 어긋납니다. PATH_NEEDED 가 아닌데 선수 경로가 생겼습니다.")
        for term_id in conflicts:
            print(f"  - {term_id}: {judgments[term_id]['status']}")
        print("  조치: 판정을 PATH_NEEDED 로 고치거나, 그 edge 가 맞는지 다시 보세요.")
    if stale:
        print(f"\nERROR: canonical 에 없는 term 을 판정했습니다: {stale}")
    return 1 if conflicts or stale else 0


if __name__ == "__main__":
    raise SystemExit(main())
