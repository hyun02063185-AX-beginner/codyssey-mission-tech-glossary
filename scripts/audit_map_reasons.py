#!/usr/bin/env python3
"""EX03 — 학습자 화면에 닿는 edge reason 감사.

선수학습 화면은 learn-first 관계의 `reason` 을 그대로 내보낸다. 그 문장이 동결된
knowledge map 에서 온 것이면 우리가 고칠 수 없으므로 감사 대상이 된다.
`data/encyclopedia/map-edge-corrections.json` 으로 대신한 것은 Encyclopedia 출처가
되므로 감사 대상에서 빠진다.

  python scripts/audit_map_reasons.py            사람이 읽는 요약
  python scripts/audit_map_reasons.py --write    data/reviews/ex03-map-reason-audit.json 갱신
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
GRAPH = ROOT / "src/data/generated/encyclopedia-graph.json"
CORRECTIONS = ROOT / "data/encyclopedia/map-edge-corrections.json"
OUT = ROOT / "data/reviews/ex03-map-reason-audit.json"

# 유지보수자에게 하는 말은 학습자 화면에 나가면 안 된다 (Cycle 지침 §4).
INTERNAL = re.compile(r"Sprint|Owner Gate|upstream-registry|EX0\d|U1\d\b|R12\b"
                      r"|data/|content/|scripts/|\.json\b|\bmap:|\bcluster:")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--write", action="store_true")
    args = ap.parse_args()

    graph = json.loads(GRAPH.read_text(encoding="utf-8"))
    doc = json.loads(CORRECTIONS.read_text(encoding="utf-8"))
    learn_first = set(graph["learnFirstRelations"])

    on_screen = [e for e in graph["edges"] if e["relation"] in learn_first]
    from_map = [e for e in on_screen if e["origin"].startswith("map:")]
    corrected = [e for e in on_screen if e["origin"] == "encyclopedia:map-correction"]

    kept = {(k["edge"]["from"], k["edge"]["relation"], k["edge"]["to"])
            for k in doc.get("keptAsIs", [])}
    kept_rows = [e for e in from_map if (e["from"], e["relation"], e["to"]) in kept]

    leaks = [e for e in on_screen if INTERNAL.search(e.get("reason", ""))]

    result = {
        "version": 2,
        "date": "2026-09-23",
        "registryEntry": doc["registryEntry"],
        "scope": "learn-first 관계에 붙어 선수학습 화면에 그대로 나가는 reason 전부",
        "method": ("encyclopedia-graph.json 의 authored edge 중 relation 이 learn-first 인 것을 모은다. "
                   "origin 이 map: 이면 동결 자료라 감사 대상이고, "
                   "encyclopedia:map-correction 이면 이번에 대신 쓴 문장이다."),
        "counts": {
            "onScreen": len(on_screen),
            "fromFrozenMap": len(from_map),
            "correctedInEncyclopedia": len(corrected),
            "keptAsIsAfterSwapTest": len(kept_rows),
            "internalVocabularyLeaks": len(leaks),
        },
        "corrections": [
            {
                "verdict": c["verdict"],
                "defect": c["defect"],
                "was": c["supersedes"],
                "now": {k: c["edge"][k] for k in ("from", "relation", "to", "reason")},
                "note": c["review"]["note"],
            }
            for c in doc["corrections"]
        ],
        "keptAsIs": doc.get("keptAsIs", []),
        "remainingFromFrozenMap": sorted(
            ({"from": e["from"], "relation": e["relation"], "to": e["to"],
              "origin": e["origin"], "reason": e["reason"]} for e in from_map),
            key=lambda r: (r["origin"], r["from"])),
    }

    if args.write:
        OUT.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    c = result["counts"]
    print(f"화면에 닿는 learn-first reason {c['onScreen']}건")
    print(f"  동결 map 출처               {c['fromFrozenMap']}")
    print(f"  Encyclopedia 가 대신 쓴 것  {c['correctedInEncyclopedia']}")
    print(f"  Swap Test 통과로 그대로 둔 것 {c['keptAsIsAfterSwapTest']}")
    print(f"  내부 관리 표현 누출          {c['internalVocabularyLeaks']}")
    if leaks:
        for e in leaks:
            print(f"    · {e['from']} -{e['relation']}-> {e['to']}: {e['reason'][:70]}")
        return 1
    if args.write:
        print(f"\n기록: {OUT.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
