#!/usr/bin/env python3
"""Impact Review Gate — what did an Encyclopedia source change actually move?

The structural validator cannot see semantic leaks: an edge that is correct inside its
own cluster can push the wrong prerequisite into an unrelated mission (Expansion Cycle 1
found exactly that with input-validation / SQL injection reaching M03).

This script rebuilds nothing and judges nothing. It diffs the current graph against a
baseline revision and reports which missions, academic fields and learning paths moved,
so a reviewer reads only the affected ones instead of all sixteen missions.

    python scripts/report_encyclopedia_impact.py            # vs HEAD
    python scripts/report_encyclopedia_impact.py --base 538e1bb
    python scripts/report_encyclopedia_impact.py --json
"""
import argparse
import json
import subprocess
import sys
from collections import deque
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GRAPH = ROOT / "src/data/generated/encyclopedia-graph.json"
REL = "src/data/generated/encyclopedia-graph.json"


def load_current():
    return json.loads(GRAPH.read_text(encoding="utf-8"))


def load_baseline(ref):
    try:
        blob = subprocess.run(["git", "show", f"{ref}:{REL}"], cwd=ROOT, check=True,
                              capture_output=True).stdout.decode("utf-8")
    except subprocess.CalledProcessError:
        return None
    return json.loads(blob)


def label(graph, node_id):
    node = graph["nodes"].get(node_id, {})
    return node.get("labelKo") or node.get("labelEn") or node_id


def learn_first_map(graph):
    relations = set(graph["learnFirstRelations"])
    out = {}
    for edge in graph["edges"]:
        if edge["relation"] in relations:
            out.setdefault(edge["from"], set()).add(edge["to"])
    return out


def closure(start, adjacency):
    seen, queue, out = set(start), deque(start), []
    while queue:
        current = queue.popleft()
        for nxt in sorted(adjacency.get(current, ())):
            if nxt not in seen:
                seen.add(nxt)
                out.append(nxt)
                queue.append(nxt)
    return out


def mission_prerequisites(graph):
    """For every mission: the learn-first closure of its core terms, minus its own direct terms."""
    adjacency = learn_first_map(graph)
    result = {}
    for node in graph["nodes"].values():
        if node["kind"] != "mission":
            continue
        mission_id = node["missionId"]
        direct = {f"term:{row['termId']}"
                  for row in graph["indexes"]["byMission"].get(mission_id, [])
                  if row["sourceStatus"] == "direct"}
        seeds = [f"term:{t}" for t in node.get("coreTermIds", [])]
        result[mission_id] = {item for item in closure(seeds, adjacency) if item not in direct}
    return result


def edge_key(edge):
    return (edge["from"], edge["relation"], edge["to"])


def path_map(graph):
    return {path["id"]: path["steps"] for path in graph["paths"]}


def academic_of(graph, node_id):
    node = graph["nodes"].get(node_id, {})
    if node.get("kind") != "term":
        return None
    return node.get("academic", {}).get("primary")


def main():
    parser = argparse.ArgumentParser(description="Encyclopedia impact report")
    parser.add_argument("--base", default="HEAD", help="baseline git revision (default: HEAD)")
    parser.add_argument("--json", action="store_true", help="machine-readable output")
    args = parser.parse_args()

    if not GRAPH.exists():
        print("ERROR: encyclopedia-graph.json 이 없습니다. python scripts/build_encyclopedia_graph.py 를 먼저 실행하세요.")
        return 1
    current = load_current()
    baseline = load_baseline(args.base)
    if baseline is None:
        print(f"ERROR: '{args.base}' 리비전에서 {REL} 을 읽을 수 없습니다.\n"
              f"    조치: 이미 commit 된 리비전을 --base 로 지정하세요 (예: --base HEAD~1).")
        return 1

    new_nodes = sorted(set(current["nodes"]) - set(baseline["nodes"]))
    removed_nodes = sorted(set(baseline["nodes"]) - set(current["nodes"]))
    changed_nodes = sorted(
        node_id for node_id in set(current["nodes"]) & set(baseline["nodes"])
        if current["nodes"][node_id] != baseline["nodes"][node_id])

    current_edges = {edge_key(edge): edge for edge in current["edges"]}
    baseline_edges = {edge_key(edge): edge for edge in baseline["edges"]}
    new_edges = sorted(set(current_edges) - set(baseline_edges))
    removed_edges = sorted(set(baseline_edges) - set(current_edges))

    current_pre = mission_prerequisites(current)
    baseline_pre = mission_prerequisites(baseline)
    affected_missions = {}
    for mission_id in sorted(set(current_pre) | set(baseline_pre)):
        before, after = baseline_pre.get(mission_id, set()), current_pre.get(mission_id, set())
        if before == after:
            continue
        affected_missions[mission_id] = {
            "added": sorted(after - before),
            "removed": sorted(before - after),
        }

    current_paths, baseline_paths = path_map(current), path_map(baseline)
    new_paths = sorted(set(current_paths) - set(baseline_paths))
    removed_paths = sorted(set(baseline_paths) - set(current_paths))
    changed_paths = {}
    for path_id in sorted(set(current_paths) & set(baseline_paths)):
        if current_paths[path_id] != baseline_paths[path_id]:
            changed_paths[path_id] = {
                "before": baseline_paths[path_id], "after": current_paths[path_id],
                "lengthChange": len(current_paths[path_id]) - len(baseline_paths[path_id])}

    affected_academic = {}
    for node_id, node in current["nodes"].items():
        if node["kind"] != "academic":
            continue
        old = baseline["nodes"].get(node_id, {})
        if old.get("termCount") != node.get("termCount") or old.get("visibility") != node.get("visibility"):
            affected_academic[node["academicId"]] = {
                "termCount": [old.get("termCount"), node.get("termCount")],
                "visibility": [old.get("visibility"), node.get("visibility")]}

    # A newly introduced prerequisite whose academic home is outside the mission's allowed
    # academic scope is the shape of the M03/XSS leak. Flag it; do not judge it.
    #
    # U17: 허용 범위 = 미션이 선언한 학문 + Curriculum Baseline. baseline 은 과정 전체가
    # 전제하는 학문이라 미션마다 다시 적지 않는다. 좁은 계약은 '관계가 틀렸다'와 '배정이
    # 좁다'를 구분하지 못해, 세 Cycle 내내 같은 값을 supporting 에 더 적게 만들었다.
    baseline = set(current.get("policy", {}).get("curriculumBaseline", []))
    unexpected = []
    for mission_id, delta in affected_missions.items():
        node = current["nodes"].get(f"mission:{mission_id}", {})
        declared = ({node.get("academic", {}).get("primary")}
                    | set(node.get("academic", {}).get("supporting", [])) | baseline)
        for added in delta["added"]:
            home = academic_of(current, added)
            if home and home not in declared:
                unexpected.append({"missionId": mission_id, "node": added,
                                   "label": label(current, added), "academic": home,
                                   "missionAcademic": sorted(x for x in declared if x)})

    payload = {
        "base": args.base,
        "changedNodes": {"new": new_nodes, "removed": removed_nodes, "modified": changed_nodes},
        "changedEdges": {"new": [list(k) for k in new_edges], "removed": [list(k) for k in removed_edges]},
        "affectedMissions": affected_missions,
        "affectedAcademic": affected_academic,
        "affectedPaths": {"new": new_paths, "removed": removed_paths, "changed": changed_paths},
        "unexpectedCrossClusterEffects": unexpected,
    }
    if args.json:
        print(json.dumps(payload, ensure_ascii=False, indent=1))
        return 0

    def show(items, formatter=str, limit=12):
        if not items:
            return "    (없음)"
        rows = [f"    - {formatter(item)}" for item in items[:limit]]
        if len(items) > limit:
            rows.append(f"    … 외 {len(items) - limit}건")
        return "\n".join(rows)

    print(f"Encyclopedia Impact Report  (baseline: {args.base})")
    print("=" * 78)
    print(f"changed nodes: new {len(new_nodes)} · removed {len(removed_nodes)} · modified {len(changed_nodes)}")
    print(show(new_nodes + removed_nodes + changed_nodes, lambda n: f"{n}  {label(current, n)}"))
    print(f"\nchanged edges: new {len(new_edges)} · removed {len(removed_edges)}")
    print(show([("+", k) for k in new_edges] + [("-", k) for k in removed_edges],
               lambda item: f"{item[0]} {item[1][0]} -{item[1][1]}-> {item[1][2]}"))

    print(f"\naffected missions: {len(affected_missions)}")
    if affected_missions:
        for mission_id, delta in affected_missions.items():
            title = current["nodes"].get(f"mission:{mission_id}", {}).get("titleKo", "")
            print(f"    · {mission_id} {title}")
            if delta["added"]:
                print(f"        new prerequisites : {', '.join(label(current, n) for n in delta['added'])}")
            if delta["removed"]:
                print(f"        removed           : {', '.join(label(baseline, n) for n in delta['removed'])}")
    else:
        print("    (없음)")

    print(f"\naffected academic fields: {len(affected_academic)}")
    for academic_id, delta in affected_academic.items():
        print(f"    · {academic_id}: termCount {delta['termCount'][0]} → {delta['termCount'][1]}, "
              f"visibility {delta['visibility'][0]} → {delta['visibility'][1]}")
    if not affected_academic:
        print("    (없음)")

    print(f"\naffected learning paths: new {len(new_paths)} · removed {len(removed_paths)} · changed {len(changed_paths)}")
    print(show(new_paths + removed_paths, str))
    for path_id, delta in changed_paths.items():
        print(f"    ~ {path_id}  길이 {len(delta['before'])} → {len(delta['after'])} ({delta['lengthChange']:+d})")
        print(f"        before: {' → '.join(label(baseline, s) for s in delta['before'])}")
        print(f"        after : {' → '.join(label(current, s) for s in delta['after'])}")

    print(f"\nunexpected cross-cluster effects: {len(unexpected)}")
    if unexpected:
        print("    미션이 선언한 학문 밖에서 선수 학습이 새로 들어왔습니다. 의미 검토가 필요합니다.")
        for row in unexpected:
            print(f"    ! {row['missionId']} ← {row['label']} ({row['academic']}) "
                  f"/ 미션 학문: {', '.join(row['missionAcademic'])}")
        print("\n    다음 중 하나로 처리하세요.")
        print("      a) 관계 방향이 잘못된 경우 → cluster 의 edge 방향을 바로잡는다")
        print("      b) 관계는 맞고 미션 학문 배정이 좁은 경우 → missions.json 의 academic.supporting 을 넓힌다")
        print("      c) 의도한 연결인 경우 → Sprint report 에 근거를 남긴다")
    else:
        print("    (없음)")

    print("\n" + "=" * 78)
    print("이 보고서는 의미를 판정하지 않습니다. 영향받은 항목만 사람이 읽도록 좁혀 줍니다.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
