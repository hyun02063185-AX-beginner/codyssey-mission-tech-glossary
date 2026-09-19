#!/usr/bin/env python3
"""Build the Knowledge Encyclopedia graph from existing glossary/Atlas/map data plus data/encyclopedia authoring.

Reads only. Never writes into data/curated, content/, data/knowledge-maps or the
existing generated bundles. Output is deterministic (sorted, no timestamps) so a
rebuild without source changes produces no diff.
"""
import json
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MASTER = ROOT / "data/curated/glossary-master-v0.1.yaml"
GENERATED_GLOSSARY = ROOT / "src/data/generated/glossary.json"
TAXONOMY = ROOT / "data/knowledge-maps/atlas/field-taxonomy.json"
CLASSIFICATION = ROOT / "data/knowledge-maps/atlas/term-field-classification.json"
ROUTING = ROOT / "data/knowledge-maps/atlas/mission-map-routing.json"
MAP_DIR = ROOT / "data/knowledge-maps"
ENC = ROOT / "data/encyclopedia"
OUT = ROOT / "src/data/generated/encyclopedia-graph.json"

SOURCE_STATUS_ORDER = {"direct": 0, "required": 1, "related": 2}


def load(path):
    return json.loads(path.read_text(encoding="utf-8"))


def mission_key_to_id(course, mission):
    """('main', 'M01') -> 'main-m01'. The single normalization point for mission ids."""
    return f"{course}-{mission.lower()}"


def normalize_mission_ref(value, alias_index):
    """Accept any known mission notation and return the canonical encyclopedia id."""
    if value in alias_index:
        return alias_index[value]
    return None


def build_alias_index(missions):
    index = {}
    for mission in missions:
        index[mission["id"]] = mission["id"]
        for alias in mission.get("aliases", {}).values():
            index[alias] = mission["id"]
    return index


def read_maps():
    graphs = []
    for path in sorted(MAP_DIR.glob("*/knowledge-map.json")):
        graphs.append(load(path))
    return graphs


def main():
    master = load(MASTER)["terms"]
    detailed = {term["id"]: term for term in load(GENERATED_GLOSSARY)}
    taxonomy = load(TAXONOMY)
    classification = {row["termId"]: row for row in load(CLASSIFICATION)["classifications"]}
    routing = load(ROUTING)
    ontology = load(ENC / "relation-ontology.json")
    academic_doc = load(ENC / "academic-fields.json")
    mission_doc = load(ENC / "missions.json")
    role_doc = load(ENC / "roles.json")
    registry = load(ENC / "upstream-registry.json")
    clusters = [load(path) for path in sorted((ENC / "clusters").glob("*.json"))]

    relations = ontology["relations"]
    crosswalk = academic_doc["atlasCrosswalk"]
    academic_fields = {field["id"]: field for field in academic_doc["fields"]}
    missions = mission_doc["missions"]
    alias_index = build_alias_index(missions)

    # ---------------------------------------------------------------- academic
    overrides = {}
    for cluster in clusters:
        for term_id, value in cluster.get("academicOverrides", {}).items():
            overrides[term_id] = dict(value, cluster=cluster["clusterId"])

    def academic_for(term_id):
        row = classification.get(term_id)
        default = crosswalk.get(row["primaryField"]) if row else None
        override = overrides.get(term_id)
        if override:
            return {
                "primary": override["primary"],
                "secondary": override.get("secondary", []),
                "origin": "override",
                "reason": override.get("reason", ""),
                "cluster": override["cluster"],
            }
        return {"primary": default, "secondary": [], "origin": "crosswalk", "reason": "", "cluster": None}

    # ------------------------------------------------------------------ nodes
    nodes = {}
    term_missions = defaultdict(list)
    for term in master:
        term_id = term["id"]
        refs = []
        for ref in term["mission_refs"]:
            mission_id = mission_key_to_id(ref["course"], ref["mission"])
            refs.append({"missionId": mission_id, "sourceStatus": ref["source_status"]})
            term_missions[mission_id].append({"termId": term_id, "sourceStatus": ref["source_status"],
                                              "importance": ref.get("importance", term["importance"])})
        refs.sort(key=lambda r: (SOURCE_STATUS_ORDER[r["sourceStatus"]], r["missionId"]))
        row = classification.get(term_id, {})
        nodes[f"term:{term_id}"] = {
            "id": f"term:{term_id}",
            "kind": "term",
            "termId": term_id,
            "labelKo": term["term_ko"],
            "labelEn": term["term_en"],
            "importance": term["importance"],
            "field": {"primary": row.get("primaryField"), "secondary": row.get("secondaryFields", [])},
            "academic": academic_for(term_id),
            "missions": refs,
            "hasDetail": bool(detailed.get(term_id, {}).get("technicalExplanation")),
        }

    for field in taxonomy["fields"]:
        nodes[f"field:{field['id']}"] = {
            "id": f"field:{field['id']}",
            "kind": "field",
            "fieldId": field["id"],
            "labelEn": field["label"],
            "purpose": field["purpose"],
        }

    for field in academic_doc["fields"]:
        nodes[f"academic:{field['id']}"] = {
            "id": f"academic:{field['id']}",
            "kind": "academic",
            "academicId": field["id"],
            "labelKo": field["labelKo"],
            "labelEn": field["labelEn"],
            "academicKind": field["kind"],
            "parent": field["parent"],
            "prerequisiteFields": field["prerequisiteFields"],
            "note": field.get("note", ""),
        }

    routing_by_id = {row["missionId"]: row for row in routing["missions"]}
    for mission in missions:
        route = routing_by_id.get(mission["id"], {})
        nodes[f"mission:{mission['id']}"] = {
            "id": f"mission:{mission['id']}",
            "kind": "mission",
            "missionId": mission["id"],
            "order": mission["order"],
            "course": mission["course"],
            "titleKo": mission["titleKo"],
            "aliases": mission["aliases"],
            "academic": mission["academic"],
            "studyNext": mission["studyNext"],
            "primaryField": route.get("primaryContext", {}).get("fieldId"),
            "crossFieldLayers": route.get("crossFieldLayers", []),
            "maps": [item["mapId"] for item in route.get("maps", [])],
        }

    map_foundations = set()
    graphs = read_maps()
    for graph in graphs:
        for node in graph["nodes"]:
            if node.get("termId"):
                continue
            map_foundations.add(node["id"])
            nodes[node["id"]] = {
                "id": node["id"],
                "kind": "foundation",
                "origin": "map",
                "mapId": graph["mapId"],
                "labelEn": node["label"],
                "labelKo": node.get("labelKo", node["label"]),
                "rationale": node.get("foundationRationale", ""),
                "promotionCandidate": False,
            }

    for cluster in clusters:
        for node in cluster.get("foundationNodes", []):
            nodes[node["id"]] = {
                "id": node["id"],
                "kind": "foundation",
                "origin": "encyclopedia",
                "clusterId": cluster["clusterId"],
                "labelEn": node["labelEn"],
                "labelKo": node.get("labelKo", node["labelEn"]),
                "rationale": node["foundationRationale"],
                "promotionCandidate": node.get("promotionCandidate", False),
                "summary": node.get("summary", ""),
            }

    # ------------------------------------------------------------------ edges
    edges = []
    seen = {}
    excluded_self = []

    def edge_key(source, relation, target):
        if relations.get(relation, {}).get("symmetric"):
            a, b = sorted([source, target])
            return (a, relation, b)
        return (source, relation, target)

    def add_edge(source, relation, target, origin, payload):
        if source == target:
            # Owner decision U9: upstream self-references stay in the frozen map files but never
            # enter the Encyclopedia graph. They are recorded in data/encyclopedia/upstream-registry.json.
            excluded_self.append({"from": source, "relation": relation, "to": target, "origin": origin})
            return
        key = edge_key(source, relation, target)
        if key in seen:
            seen[key].setdefault("duplicateOf", []).append(origin)
            return
        row = {"from": source, "relation": relation, "to": target, "origin": origin}
        row.update(payload)
        edges.append(row)
        seen[key] = row

    for graph in graphs:
        for edge in graph["edges"]:
            add_edge(edge["from"], edge["relation"], edge["to"], f"map:{graph['mapId']}", {
                "reason": edge["reason"], "confidence": edge["confidence"],
                "evidenceType": edge["evidenceType"], "source": edge["source"]})

    for cluster in clusters:
        for edge in cluster.get("edges", []):
            add_edge(edge["from"], edge["relation"], edge["to"], f"cluster:{cluster['clusterId']}", {
                "reason": edge["reason"], "confidence": edge["confidence"],
                "evidenceType": edge["evidenceType"], "source": edge["source"]})

    # --------------------------------------------------------- derived edges
    derived = []
    for term in master:
        term_id = term["id"]
        node = nodes[f"term:{term_id}"]
        for ref in node["missions"]:
            derived.append({"from": f"term:{term_id}", "relation": "in_mission",
                            "to": f"mission:{ref['missionId']}", "sourceStatus": ref["sourceStatus"]})
        field = node["field"]["primary"]
        if field:
            derived.append({"from": f"term:{term_id}", "relation": "in_field",
                            "to": f"field:{field}", "role": "primary"})
        for secondary in node["field"]["secondary"]:
            derived.append({"from": f"term:{term_id}", "relation": "in_field",
                            "to": f"field:{secondary}", "role": "secondary"})
        academic = node["academic"]
        if academic["primary"]:
            derived.append({"from": f"term:{term_id}", "relation": "in_academic",
                            "to": f"academic:{academic['primary']}", "role": "primary",
                            "origin": academic["origin"]})
        for secondary in academic["secondary"]:
            derived.append({"from": f"term:{term_id}", "relation": "in_academic",
                            "to": f"academic:{secondary}", "role": "secondary",
                            "origin": academic["origin"]})

    related_pairs = set()
    for term_id, term in detailed.items():
        for other in term.get("detailRelatedTerms", []):
            if other == term_id or f"term:{other}" not in nodes:
                continue
            related_pairs.add(tuple(sorted([term_id, other])))
    for left, right in sorted(related_pairs):
        derived.append({"from": f"term:{left}", "relation": "related", "to": f"term:{right}"})

    # ------------------------------------------------------------------ paths
    paths = []
    for graph in graphs:
        for route in graph["learningRoutes"]:
            paths.append({"id": f"{graph['mapId']}:{route['id']}", "label": route["label"],
                          "why": route["description"], "steps": route["nodeIds"],
                          "origin": f"map:{graph['mapId']}", "scope": route["scope"]})
    for cluster in clusters:
        for path in cluster.get("paths", []):
            paths.append({"id": f"{cluster['clusterId']}:{path['id']}", "label": path["label"],
                          "why": path["why"], "steps": path["steps"],
                          "origin": f"cluster:{cluster['clusterId']}", "scope": "encyclopedia"})

    # --------------------------------------------------------------- indexes
    learn_first_relations = sorted(name for name, spec in relations.items() if spec["learnFirst"])
    learn_first = defaultdict(list)
    unlocks = defaultdict(list)
    for edge in edges:
        if edge["relation"] in learn_first_relations:
            learn_first[edge["from"]].append(edge["to"])
            unlocks[edge["to"]].append(edge["from"])

    reverse_index = defaultdict(list)
    for edge in edges:
        spec = relations.get(edge["relation"], {})
        if spec.get("symmetric") or not spec.get("reverse"):
            continue
        reverse_index[edge["to"]].append({"relation": spec["reverse"], "to": edge["from"]})

    by_academic = defaultdict(lambda: {"primary": [], "secondary": []})
    by_field = defaultdict(lambda: {"primary": [], "secondary": []})
    by_mission = defaultdict(list)
    for node in nodes.values():
        if node["kind"] != "term":
            continue
        academic = node["academic"]
        if academic["primary"]:
            by_academic[academic["primary"]]["primary"].append(node["termId"])
        for secondary in academic["secondary"]:
            by_academic[secondary]["secondary"].append(node["termId"])
        if node["field"]["primary"]:
            by_field[node["field"]["primary"]]["primary"].append(node["termId"])
        for secondary in node["field"]["secondary"]:
            by_field[secondary]["secondary"].append(node["termId"])
        for ref in node["missions"]:
            by_mission[ref["missionId"]].append({"termId": node["termId"], "sourceStatus": ref["sourceStatus"]})

    for field_id, field in academic_fields.items():
        count = len(by_academic[field_id]["primary"])
        status = "populated" if count >= 20 else "sparse" if count else "declared"
        nodes[f"academic:{field_id}"]["termCount"] = count
        nodes[f"academic:{field_id}"]["status"] = status

    by_role = {}
    for role in role_doc["roles"]:
        term_ids, academic_ids = [], []
        for entry in role["fields"]:
            term_ids.extend(by_field[entry["id"]]["primary"])
        for entry in role["academic"]:
            academic_ids.append(entry["id"])
        core_terms = sorted({t for t in term_ids if nodes[f"term:{t}"]["importance"] == "core"})
        by_role[role["id"]] = {"labelKo": role["labelKo"], "coverage": role["coverage"],
                               "fieldIds": [entry["id"] for entry in role["fields"]],
                               "academicIds": academic_ids,
                               "termCount": len(set(term_ids)), "coreTermIds": core_terms}

    # academic prerequisite closure (missions reuse it for "먼저 공부할 과목")
    def academic_closure(field_id, seen_fields=None):
        seen_fields = seen_fields or set()
        for parent in academic_fields.get(field_id, {}).get("prerequisiteFields", []):
            if parent in seen_fields:
                continue
            seen_fields.add(parent)
            academic_closure(parent, seen_fields)
        return seen_fields

    for mission in missions:
        node = nodes[f"mission:{mission['id']}"]
        node["prerequisiteAcademic"] = sorted(academic_closure(mission["academic"]["primary"]))
        refs = by_mission.get(mission["id"], [])
        node["termCount"] = len(refs)
        node["coreTermIds"] = sorted(
            row["termId"] for row in refs
            if row["sourceStatus"] == "direct" and nodes[f"term:{row['termId']}"]["importance"] == "core")

    payload = {
        "schemaVersion": "1.0",
        "artifactType": "generated-encyclopedia-graph",
        "generatedFrom": [
            "data/curated/glossary-master-v0.1.yaml",
            "src/data/generated/glossary.json",
            "data/knowledge-maps/atlas/*.json",
            "data/knowledge-maps/*/knowledge-map.json",
            "data/encyclopedia/**",
        ],
        "stats": {
            "terms": sum(1 for node in nodes.values() if node["kind"] == "term"),
            "academicFields": len(academic_fields),
            "missions": len(missions),
            "techFields": len(taxonomy["fields"]),
            "roles": len(role_doc["roles"]),
            "foundationNodes": sum(1 for node in nodes.values() if node["kind"] == "foundation"),
            "encyclopediaFoundations": sum(
                1 for node in nodes.values()
                if node["kind"] == "foundation" and node.get("origin") == "encyclopedia"),
            "authoredEdges": len(edges),
            "clusterEdges": sum(1 for edge in edges if edge["origin"].startswith("cluster:")),
            "derivedEdges": len(derived),
            "paths": len(paths),
            "clusters": len(clusters),
            "academicOverrides": len(overrides),
            "excludedSelfReferences": len(excluded_self),
            "upstreamRegistryEntries": len(registry["entries"]),
        },
        "excludedSelfReferences": sorted(excluded_self, key=lambda e: (e["origin"], e["from"])),
        "learnFirstRelations": learn_first_relations,
        "nodes": dict(sorted(nodes.items())),
        "edges": sorted(edges, key=lambda e: (e["from"], e["relation"], e["to"])),
        "derivedEdges": sorted(derived, key=lambda e: (e["from"], e["relation"], e["to"])),
        "paths": sorted(paths, key=lambda p: p["id"]),
        "indexes": {
            "learnFirst": {key: sorted(value) for key, value in sorted(learn_first.items())},
            "unlocks": {key: sorted(value) for key, value in sorted(unlocks.items())},
            "reverse": {key: sorted(value, key=lambda r: (r["relation"], r["to"]))
                        for key, value in sorted(reverse_index.items())},
            "byAcademic": {key: {"primary": sorted(value["primary"]), "secondary": sorted(value["secondary"])}
                           for key, value in sorted(by_academic.items())},
            "byField": {key: {"primary": sorted(value["primary"]), "secondary": sorted(value["secondary"])}
                        for key, value in sorted(by_field.items())},
            "byMission": {key: sorted(value, key=lambda r: (SOURCE_STATUS_ORDER[r["sourceStatus"]], r["termId"]))
                          for key, value in sorted(by_mission.items())},
            "byRole": dict(sorted(by_role.items())),
            "missionAliases": dict(sorted(alias_index.items())),
        },
    }

    OUT.parent.mkdir(parents=True, exist_ok=True)
    # Compact, like the other generated bundles: this file is build output, never hand-edited.
    OUT.write_text(json.dumps(payload, ensure_ascii=False) + "\n", encoding="utf-8")
    stats = payload["stats"]
    print(f"Encyclopedia graph: {stats['terms']} terms · {stats['academicFields']} academic · "
          f"{stats['missions']} missions · {stats['techFields']} fields · {stats['roles']} roles · "
          f"{stats['foundationNodes']} foundation ({stats['encyclopediaFoundations']} new)")
    print(f"Edges: {stats['authoredEdges']} authored ({stats['clusterEdges']} from clusters) · "
          f"{stats['derivedEdges']} derived · {stats['paths']} paths · "
          f"{stats['clusters']} clusters · {stats['academicOverrides']} academic overrides")
    if excluded_self:
        print(f"Excluded {len(excluded_self)} upstream self-reference(s) (U9): "
              + ", ".join(f"{e['from']} -{e['relation']}-> ({e['origin']})" for e in excluded_self))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
