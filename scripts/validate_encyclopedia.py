#!/usr/bin/env python3
"""Quality Harness for the Knowledge Encyclopedia.

Checks structure only. It never judges whether a relation is semantically right —
that is a reviewer's job (docs/knowledge-encyclopedia/06-agent-governance-model.md).

Every failure message says what is wrong, where it lives, and how to fix it.
"""
import json
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from validate_knowledge_map import RELATIONS as MAP_RELATIONS  # vocabulary SSOT

ENC = ROOT / "data/encyclopedia"
GRAPH = ROOT / "src/data/generated/encyclopedia-graph.json"
MASTER = ROOT / "data/curated/glossary-master-v0.1.yaml"
TAXONOMY = ROOT / "data/knowledge-maps/atlas/field-taxonomy.json"
ROUTING = ROOT / "data/knowledge-maps/atlas/mission-map-routing.json"
TERMS_DIR = ROOT / "content/terms"

EVIDENCE = {"mission-source", "official-standard", "official-documentation", "architectural-inference"}
CONFIDENCE = {"HIGH", "MEDIUM", "LOW"}
NAMESPACES = ("term:", "foundation:", "academic:", "mission:", "field:")
RC1 = {"canonical": 519, "detailed": 519}


def load(path):
    return json.loads(path.read_text(encoding="utf-8"))


def main():
    errors, warnings = [], []

    def err(where, what, how):
        errors.append(f"{where}\n    문제: {what}\n    조치: {how}")

    def warn(where, what, how):
        warnings.append(f"{where}\n    확인: {what}\n    조치: {how}")

    if not GRAPH.exists():
        print("ERROR: src/data/generated/encyclopedia-graph.json 이 없습니다.\n"
              "    조치: python scripts/build_encyclopedia_graph.py 를 먼저 실행하세요.")
        return 1

    master = load(MASTER)["terms"]
    canonical = {term["id"] for term in master}
    taxonomy = {field["id"] for field in load(TAXONOMY)["fields"]}
    routing_ids = {row["missionId"] for row in load(ROUTING)["missions"]}
    ontology = load(ENC / "relation-ontology.json")
    academic_doc = load(ENC / "academic-fields.json")
    mission_doc = load(ENC / "missions.json")
    role_doc = load(ENC / "roles.json")
    clusters = [(path.name, load(path)) for path in sorted((ENC / "clusters").glob("*.json"))]
    graph = load(GRAPH)

    relations = ontology["relations"]
    academic_ids = {field["id"] for field in academic_doc["fields"]}
    mission_ids = {mission["id"] for mission in mission_doc["missions"]}

    # 1. relation vocabulary is a subset of the existing map validator's set -----
    for name in relations:
        if name not in MAP_RELATIONS:
            err("data/encyclopedia/relation-ontology.json",
                f"relation '{name}' 은 기존 어휘(scripts/validate_knowledge_map.py :: RELATIONS)에 없습니다.",
                "새 relation type 신설은 Owner Gate 승인 사항입니다. 기존 12종 중에서 고르세요.")
    for name in sorted(MAP_RELATIONS - set(relations)):
        warn("data/encyclopedia/relation-ontology.json",
             f"relation '{name}' 이 map 어휘에는 있으나 의미 정의가 없습니다.",
             "cluster에서 이 relation을 쓸 계획이면 relation-ontology.json 에 항목을 추가하세요.")
    authorable = {name for name, spec in relations.items() if spec.get("authorable")}
    symmetric = {name for name, spec in relations.items() if spec.get("symmetric")}

    # 2. academic taxonomy -------------------------------------------------------
    seen_academic = set()
    for field in academic_doc["fields"]:
        if field["id"] in seen_academic:
            err("data/encyclopedia/academic-fields.json",
                f"학문 id '{field['id']}' 가 중복입니다.", "id 를 유일하게 고치세요.")
        seen_academic.add(field["id"])
        if field["kind"] not in {"academic", "applied"}:
            err("data/encyclopedia/academic-fields.json",
                f"'{field['id']}' 의 kind '{field['kind']}' 가 잘못되었습니다.",
                "kind 는 'academic' 또는 'applied' 여야 합니다.")
        for ref in field["prerequisiteFields"]:
            if ref not in academic_ids:
                err("data/encyclopedia/academic-fields.json",
                    f"'{field['id']}'.prerequisiteFields 의 '{ref}' 가 정의되지 않은 학문입니다.",
                    "fields 에 해당 학문을 추가하거나 오타를 고치세요.")
        if field["parent"] and field["parent"] not in academic_ids:
            err("data/encyclopedia/academic-fields.json",
                f"'{field['id']}'.parent '{field['parent']}' 가 정의되지 않았습니다.", "parent 를 고치세요.")

    def find_cycle(edges_map):
        state, stack = {}, []

        def visit(node):
            if state.get(node) == "done":
                return None
            if state.get(node) == "open":
                return stack[stack.index(node):] + [node]
            state[node] = "open"
            stack.append(node)
            for nxt in edges_map.get(node, []):
                found = visit(nxt)
                if found:
                    return found
            stack.pop()
            state[node] = "done"
            return None

        for node in sorted(edges_map):
            found = visit(node)
            if found:
                return found
        return None

    cycle = find_cycle({f["id"]: f["prerequisiteFields"] for f in academic_doc["fields"]})
    if cycle:
        err("data/encyclopedia/academic-fields.json",
            f"학문 선수 순서에 순환이 있습니다: {' -> '.join(cycle)}",
            "순환에 포함된 prerequisiteFields 중 하나를 제거하세요.")
    parent_cycle = find_cycle({f["id"]: [f["parent"]] for f in academic_doc["fields"] if f["parent"]})
    if parent_cycle:
        err("data/encyclopedia/academic-fields.json",
            f"parent 계층에 순환이 있습니다: {' -> '.join(parent_cycle)}", "parent 중 하나를 null 로 바꾸세요.")

    crosswalk = academic_doc["atlasCrosswalk"]
    for atlas_field, target in crosswalk.items():
        if atlas_field not in taxonomy:
            err("data/encyclopedia/academic-fields.json",
                f"atlasCrosswalk 의 '{atlas_field}' 는 Atlas field 가 아닙니다.",
                "data/knowledge-maps/atlas/field-taxonomy.json 의 id 를 사용하세요.")
        if target not in academic_ids:
            err("data/encyclopedia/academic-fields.json",
                f"atlasCrosswalk['{atlas_field}'] 의 '{target}' 가 정의되지 않은 학문입니다.", "학문 id 를 고치세요.")
    for missing in sorted(taxonomy - set(crosswalk)):
        err("data/encyclopedia/academic-fields.json",
            f"Atlas field '{missing}' 의 학문 기본값이 없습니다.",
            "atlasCrosswalk 에 항목을 추가하세요. 12개 field 모두 기본값이 있어야 합니다.")

    # 3. missions ---------------------------------------------------------------
    master_keys = {f"{ref['course']}/{ref['mission']}" for term in master for ref in term["mission_refs"]}
    seen_missions, seen_orders, alias_owner = set(), {}, {}
    for mission in mission_doc["missions"]:
        where = f"data/encyclopedia/missions.json :: {mission['id']}"
        if mission["id"] in seen_missions:
            err(where, "미션 id 가 중복입니다.", "id 를 유일하게 고치세요.")
        seen_missions.add(mission["id"])
        if mission["id"] not in routing_ids:
            err(where, f"'{mission['id']}' 가 mission-map-routing.json 에 없습니다.",
                "정규 미션 id 는 routing 의 missionId 와 같아야 합니다(예: main-m01).")
        if mission["order"] in seen_orders:
            err(where, f"order {mission['order']} 가 '{seen_orders[mission['order']]}' 와 겹칩니다.",
                "order 는 미션마다 유일해야 합니다.")
        seen_orders[mission["order"]] = mission["id"]
        for kind, alias in mission["aliases"].items():
            if alias in alias_owner and alias_owner[alias] != mission["id"]:
                err(where, f"alias '{alias}' 가 '{alias_owner[alias]}' 와 충돌합니다.", "alias 를 고치세요.")
            alias_owner[alias] = mission["id"]
        if mission["aliases"]["master"] not in master_keys:
            err(where, f"master alias '{mission['aliases']['master']}' 로 등록된 term 이 없습니다.",
                "glossary-master 의 course/mission 표기(main/M01 형식)와 맞추세요.")
        expected_route = f"{mission['course']}-{mission['id'].split('-')[1].upper()}"
        if mission["aliases"]["route"] != expected_route:
            err(where, f"route alias '{mission['aliases']['route']}' 가 실제 웹 라우트와 다릅니다.",
                f"src/App.tsx 의 #/missions/<course>-M<NN> 규칙에 따라 '{expected_route}' 이어야 합니다.")
        for key in ("primary",):
            if mission["academic"][key] not in academic_ids:
                err(where, f"academic.{key} '{mission['academic'][key]}' 가 정의되지 않은 학문입니다.",
                    "academic-fields.json 의 id 를 사용하세요.")
        for ref in mission["academic"]["supporting"]:
            if ref not in academic_ids:
                err(where, f"academic.supporting 의 '{ref}' 가 정의되지 않은 학문입니다.", "학문 id 를 고치세요.")
        if mission["academic"]["primary"] in mission["academic"]["supporting"]:
            err(where, "primary 학문이 supporting 에도 들어 있습니다.", "supporting 에서 제거하세요.")
        for ref in mission["studyNext"]["missions"]:
            if ref not in mission_ids:
                err(where, f"studyNext.missions 의 '{ref}' 가 정의되지 않은 미션입니다.", "미션 id 를 고치세요.")
        for ref in mission["studyNext"]["academic"]:
            if ref not in academic_ids:
                err(where, f"studyNext.academic 의 '{ref}' 가 정의되지 않은 학문입니다.", "학문 id 를 고치세요.")
        blob = json.dumps(mission, ensure_ascii=False)
        leaked = sorted({tid for tid in canonical if f'"{tid}"' in blob})
        if leaked:
            err(where, f"미션 항목에 term id 가 들어 있습니다: {leaked[:5]}",
                "미션의 term 목록은 glossary-master 의 mission_refs 가 원본입니다. 여기에 적지 마세요.")
    for missing in sorted(routing_ids - seen_missions):
        err("data/encyclopedia/missions.json", f"미션 '{missing}' 의 메타데이터가 없습니다.",
            "16개 미션 모두 항목이 있어야 합니다.")

    # 4. roles ------------------------------------------------------------------
    seen_roles = set()
    for role in role_doc["roles"]:
        where = f"data/encyclopedia/roles.json :: {role['id']}"
        if role["id"] in seen_roles:
            err(where, "직무 id 가 중복입니다.", "id 를 유일하게 고치세요.")
        seen_roles.add(role["id"])
        if role["coverage"] not in role_doc["coverageLevels"]:
            err(where, f"coverage '{role['coverage']}' 가 정의되지 않았습니다.",
                f"{sorted(role_doc['coverageLevels'])} 중 하나를 쓰세요.")
        for entry in role["fields"]:
            if entry["id"] not in taxonomy:
                err(where, f"fields 의 '{entry['id']}' 가 Atlas field 가 아닙니다.",
                    "field-taxonomy.json 의 id 를 사용하세요.")
            if entry["weight"] not in {"core", "supporting"}:
                err(where, f"weight '{entry['weight']}' 가 잘못되었습니다.", "core 또는 supporting 만 허용됩니다.")
        for entry in role["academic"]:
            if entry["id"] not in academic_ids:
                err(where, f"academic 의 '{entry['id']}' 가 정의되지 않은 학문입니다.", "학문 id 를 고치세요.")

    # 5. clusters ---------------------------------------------------------------
    nodes = graph["nodes"]
    map_foundation_ids = {nid for nid, node in nodes.items()
                          if node["kind"] == "foundation" and node.get("origin") == "map"}
    cluster_ids = set()
    authored_pairs = {}
    for filename, cluster in clusters:
        where = f"data/encyclopedia/clusters/{filename}"
        if cluster["clusterId"] in cluster_ids:
            err(where, f"clusterId '{cluster['clusterId']}' 가 중복입니다.", "clusterId 를 유일하게 고치세요.")
        cluster_ids.add(cluster["clusterId"])

        for node in cluster.get("foundationNodes", []):
            nid = node["id"]
            if not nid.startswith("foundation:"):
                err(where, f"foundation node id '{nid}' 에 접두사가 없습니다.", "'foundation:<slug>' 형식을 쓰세요.")
            if nid in map_foundation_ids:
                err(where, f"'{nid}' 는 기존 knowledge map 의 foundation node 와 id 가 같습니다.",
                    "다른 slug 를 쓰거나, 같은 개념이면 기존 node 를 그대로 참조하세요.")
            if not node.get("foundationRationale"):
                err(where, f"'{nid}' 에 foundationRationale 이 없습니다.",
                    "왜 canonical 이 아니라 foundation 인지 한 문장으로 적으세요.")
            slug = nid.split(":", 1)[1]
            if slug in canonical:
                err(where, f"'{nid}' 와 같은 이름의 canonical term 이 이미 있습니다.",
                    f"foundation 대신 term:{slug} 를 사용하세요 (FD-03).")

        for term_id, value in cluster.get("academicOverrides", {}).items():
            if term_id not in canonical:
                err(where, f"academicOverrides 의 '{term_id}' 가 canonical term 이 아닙니다.",
                    "glossary-master 의 term id 를 사용하세요.")
            if value["primary"] not in academic_ids:
                err(where, f"academicOverrides['{term_id}'].primary '{value['primary']}' 가 없는 학문입니다.",
                    "학문 id 를 고치세요.")
            for ref in value.get("secondary", []):
                if ref not in academic_ids:
                    err(where, f"academicOverrides['{term_id}'].secondary 의 '{ref}' 가 없는 학문입니다.",
                        "학문 id 를 고치세요.")
            if not value.get("reason"):
                err(where, f"academicOverrides['{term_id}'] 에 reason 이 없습니다.",
                    "기본 crosswalk 를 뒤집는 이유를 한 문장으로 적으세요.")

        for edge in cluster.get("edges", []):
            label = f"{edge.get('from')} -{edge.get('relation')}-> {edge.get('to')}"
            if edge.get("relation") not in authorable:
                err(where, f"{label}: relation '{edge.get('relation')}' 은 직접 작성할 수 없습니다.",
                    f"작성 가능한 relation: {sorted(authorable)}")
                continue
            for side in ("from", "to"):
                ref = edge[side]
                if not ref.startswith(NAMESPACES):
                    err(where, f"{label}: {side} '{ref}' 에 네임스페이스가 없습니다.",
                        "term:, foundation:, academic:, mission:, field: 중 하나로 시작해야 합니다.")
                elif ref not in nodes:
                    hint = ("canonical term id 를 확인하세요." if ref.startswith("term:")
                            else "같은 cluster 의 foundationNodes 에 선언했는지 확인하세요.")
                    err(where, f"{label}: {side} '{ref}' 가 그래프에 없는 node 입니다.", hint)
            if edge["from"] == edge["to"]:
                err(where, f"{label}: 자기 자신을 가리킵니다.", "from 과 to 를 다르게 하세요.")
            if edge.get("confidence") not in CONFIDENCE:
                err(where, f"{label}: confidence '{edge.get('confidence')}' 가 잘못되었습니다.",
                    f"{sorted(CONFIDENCE)} 중 하나를 쓰세요.")
            if edge.get("evidenceType") not in EVIDENCE:
                err(where, f"{label}: evidenceType '{edge.get('evidenceType')}' 가 잘못되었습니다.",
                    f"{sorted(EVIDENCE)} 중 하나를 쓰세요.")
            if not str(edge.get("source", "")).startswith(("http://", "https://")):
                err(where, f"{label}: source 가 URL 이 아닙니다.", "근거 문서의 http(s) URL 을 적으세요.")
            if not edge.get("reason"):
                err(where, f"{label}: reason 이 비어 있습니다.", "왜 이 관계가 성립하는지 한 문장으로 적으세요.")
            key = (tuple(sorted([edge["from"], edge["to"]])) if edge["relation"] in symmetric
                   else (edge["from"], edge["to"]), edge["relation"])
            if key in authored_pairs:
                err(where, f"{label}: '{authored_pairs[key]}' 에 이미 있는 관계입니다.",
                    "중복 edge 를 삭제하세요. 대칭 relation 은 방향을 바꿔도 같은 관계입니다.")
            authored_pairs[key] = where

    # 6. graph integrity --------------------------------------------------------
    for nid, node in nodes.items():
        if not nid.startswith(NAMESPACES):
            err("encyclopedia-graph.json", f"node id '{nid}' 의 네임스페이스가 잘못되었습니다.",
                "빌더의 node 생성 규칙을 확인하세요.")
        if node["kind"] == "term" and node["termId"] not in canonical:
            err("encyclopedia-graph.json", f"'{nid}' 가 canonical 에 없는 term 을 가리킵니다.",
                "glossary-master 와 동기화하세요.")

    def report(edge, what, how):
        """Upstream (frozen knowledge-map) defects cannot be fixed here — warn with provenance.

        Anything the Encyclopedia itself authored is an error we must fix.
        """
        where = "encyclopedia-graph.json"
        if edge["origin"].startswith("map:"):
            warn(where, f"UPSTREAM(변경 금지 영역) {what}",
                 f"출처 {edge['origin']} 는 동결된 knowledge map 입니다. "
                 f"수정은 Owner Gate 승인 사항이므로 Encyclopedia 에서 고치지 않습니다. {how}")
        else:
            err(where, what, f"출처: {edge['origin']}. {how}")

    map_edge_keys = set()
    upstream_defects = []
    for edge in graph["edges"]:
        label = f"{edge['from']} -{edge['relation']}-> {edge['to']}"
        if edge["from"] not in nodes or edge["to"] not in nodes:
            report(edge, f"{label}: 존재하지 않는 node 를 가리킵니다.", "node id 를 확인하세요.")
        if edge["from"] == edge["to"]:
            report(edge, f"{label}: self-reference 입니다.", "from 과 to 를 다르게 하세요.")
            if edge["origin"].startswith("map:"):
                upstream_defects.append(f"self-reference {label} ({edge['origin']})")
        key = (tuple(sorted([edge["from"], edge["to"]])) if edge["relation"] in symmetric
               else (edge["from"], edge["to"]), edge["relation"])
        if key in map_edge_keys:
            report(edge, f"{label}: 중복 edge 입니다.", "중복 선언을 제거하세요.")
        map_edge_keys.add(key)
        if "duplicateOf" in edge:
            err("encyclopedia-graph.json",
                f"{label}: 같은 관계가 {edge['duplicateOf']} 에도 있습니다.",
                "cluster 에서 중복 선언을 제거하세요. 기존 map edge 는 그대로 재사용됩니다.")

    learn_first = {name for name, spec in relations.items() if spec["learnFirst"]}
    learn_map = defaultdict(list)
    learn_origin = {}
    for edge in graph["edges"]:
        if edge["relation"] not in learn_first or edge["from"] == edge["to"]:
            continue  # self-loops are reported above; excluding them keeps cycle output readable
        learn_map[edge["from"]].append(edge["to"])
        learn_origin[(edge["from"], edge["to"])] = edge["origin"]
    cycle = find_cycle(learn_map)
    if cycle:
        origins = {learn_origin.get((cycle[i], cycle[i + 1]), "?") for i in range(len(cycle) - 1)}
        trail = " -> ".join(cycle)
        if all(origin.startswith("map:") for origin in origins):
            warn("encyclopedia-graph.json",
                 f"UPSTREAM(변경 금지 영역) 선수학습 순환: {trail}",
                 f"모든 edge 가 동결된 map({sorted(origins)}) 소속이라 여기서 고치지 않습니다. Owner Gate 로 보고하세요.")
        else:
            err("encyclopedia-graph.json",
                f"선수학습 관계에 순환이 있습니다: {trail} (출처 {sorted(origins)})",
                "cluster 에서 만든 prerequisite/based_on/is_a/cs_foundation edge 중 하나의 방향을 바로잡으세요.")

    # 7. paths must be backed by edges -----------------------------------------
    adjacency = defaultdict(set)
    for edge in graph["edges"]:
        adjacency[edge["from"]].add(edge["to"])
        adjacency[edge["to"]].add(edge["from"])
    for path in graph["paths"]:
        if not path["origin"].startswith("cluster:"):
            continue
        for index in range(len(path["steps"]) - 1):
            left, right = path["steps"][index], path["steps"][index + 1]
            for step in (left, right):
                if step not in nodes:
                    err("encyclopedia cluster path", f"경로 '{path['id']}' 의 단계 '{step}' 가 없는 node 입니다.",
                        "node id 를 고치거나 해당 node 를 선언하세요.")
            if right not in adjacency[left]:
                err("encyclopedia cluster path",
                    f"경로 '{path['id']}': '{left}' 와 '{right}' 사이에 edge 가 없습니다.",
                    "두 단계를 잇는 edge 를 cluster 의 edges 에 먼저 추가하세요 (경로는 관계를 새로 주장하지 않습니다).")

    # 8. derivation rules -------------------------------------------------------
    for filename, cluster in clusters:
        blob = json.dumps(cluster, ensure_ascii=False)
        for forbidden in ("\"related\"", "\"in_mission\"", "\"in_field\"", "\"in_academic\""):
            if f"\"relation\": {forbidden}" in blob:
                err(f"data/encyclopedia/clusters/{filename}",
                    f"파생 전용 relation {forbidden} 을 직접 작성했습니다.",
                    "이 관계는 빌더가 기존 데이터에서 만듭니다. cluster 에서 삭제하세요.")

    # 9. RC1 regression ---------------------------------------------------------
    detailed = sum(1 for term in master if (TERMS_DIR / f"{term['id']}.md").exists()
                   or term["id"] == "readme")
    if len(canonical) != RC1["canonical"]:
        err("RC1 regression", f"canonical 이 {len(canonical)} 개입니다 (기대 {RC1['canonical']}).",
            "Knowledge Encyclopedia 작업은 canonical 을 바꾸지 않습니다. 변경을 되돌리세요.")
    if detailed != RC1["detailed"]:
        err("RC1 regression", f"상세 콘텐츠가 {detailed} 개입니다 (기대 {RC1['detailed']}).",
            "content/terms 를 변경하지 마세요.")
    if graph["stats"]["terms"] != len(canonical):
        err("RC1 regression", "그래프의 term 수가 canonical 수와 다릅니다.",
            "빌더를 다시 실행하세요: python scripts/build_encyclopedia_graph.py")

    for message in errors:
        print(f"ERROR: {message}")
    for message in warnings:
        print(f"WARNING: {message}")
    if upstream_defects:
        print("\nUPSTREAM DEFECTS (Owner Gate 보고 대상, 이번 작업에서 수정하지 않음):")
        for defect in upstream_defects:
            print(f"  - {defect}")
    stats = graph["stats"]
    print(f"Encyclopedia validation: {stats['terms']} terms · {stats['academicFields']} academic · "
          f"{stats['missions']} missions · {stats['roles']} roles · {stats['clusters']} clusters · "
          f"{stats['authoredEdges']} authored edges · {stats['derivedEdges']} derived · "
          f"{len(errors)} error(s) · {len(warnings)} warning(s)")
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
