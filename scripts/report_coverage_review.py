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

  Learning Path Coverage     경로를 가진 term / PATH_NEEDED 로 판정된 term
                             경로가 필요하다고 본 것 중 실제로 채워진 비율

판정 기록은 data/reviews/encyclopedia-learning-coverage.json 에 있고,
이미 경로를 가진 term 은 그 관계를 작성할 때 cluster review 를 거쳤으므로
여기서 자동으로 PATH_NEEDED + 경로 보유로 집계한다(artifact 의 implicit_review_rule).

사용법
------
    python scripts/report_coverage_review.py            # 사람이 읽는 표
    python scripts/report_coverage_review.py --json     # 기계 판독
    python scripts/report_coverage_review.py --unreviewed   # 아직 판정 안 한 것 목록
"""
import argparse
import json
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GRAPH = ROOT / "src/data/generated/encyclopedia-graph.json"
REVIEW = ROOT / "data/reviews/encyclopedia-learning-coverage.json"
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
    args = parser.parse_args()

    graph = json.loads(GRAPH.read_text(encoding="utf-8"))
    review = json.loads(REVIEW.read_text(encoding="utf-8"))
    judgments = review["judgments"]
    learn_first = graph["indexes"]["learnFirst"]

    rows = []
    for node in priority_terms(graph):
        term_id = node["termId"]
        has_path = bool(learn_first.get(node["id"]))
        if has_path:
            # 경로가 있다는 것은 그 관계를 작성하며 검토했다는 뜻이다(implicit_review_rule).
            status, basis = NEEDS_PATH, "path-authored"
        elif term_id in judgments:
            status, basis = judgments[term_id]["status"], "reviewed"
        else:
            status, basis = None, "not-reviewed"
        rows.append({"termId": term_id, "academic": node["academic"]["primary"],
                     "status": status, "basis": basis, "hasPath": has_path})

    total = len(rows)
    reviewed = [r for r in rows if r["status"]]
    needs_path = [r for r in reviewed if r["status"] == NEEDS_PATH]
    covered = [r for r in needs_path if r["hasPath"]]
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
        "learningPathCoveragePercent": round(len(covered) / len(needs_path) * 100, 1) if needs_path else 0,
        "legacyCoveragePercent": graph["stats"]["learningCoveragePercent"],
    }

    # 판정과 그래프가 어긋나면 어느 쪽이 낡은 것이다. 조용히 넘기지 않는다.
    conflicts = [term_id for term_id, row in judgments.items()
                 if row["status"] != NEEDS_PATH and learn_first.get(f"term:{term_id}")]
    stale = [term_id for term_id in judgments if f"term:{term_id}" not in graph["nodes"]]

    if args.json:
        print(json.dumps({"metrics": metrics, "conflicts": conflicts, "stale": stale,
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
    print(f"  PATH_NEEDED 중 경로 보유    {metrics['pathCovered']} / {metrics['pathNeeded']}"
          f"  ({metrics['learningPathCoveragePercent']}%)  <- Learning Path Coverage")
    print(f"  경로 미보유                 {metrics['pathMissing']}")
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
