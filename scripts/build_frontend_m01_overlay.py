#!/usr/bin/env python3
"""Build the M01 overlay from existing Open-book and curated mission sources."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OPENBOOK = ROOT / "content/peer-review/main-m01-openbook.yaml"
MASTER = ROOT / "data/curated/glossary-master-v0.1.yaml"
MISSION_MAP = ROOT / "data/curated/mission-term-map-v0.1.yaml"
FIELD_MAP = ROOT / "data/knowledge-maps/frontend/knowledge-map.json"
OUT = ROOT / "data/knowledge-maps/frontend/overlays/main-m01.json"


def main():
    openbook = json.loads(OPENBOOK.read_text(encoding="utf-8"))
    master = {term["id"]: term for term in json.loads(MASTER.read_text(encoding="utf-8"))["terms"]}
    mission_refs = json.loads(MISSION_MAP.read_text(encoding="utf-8"))["missions"]["main/M01"]
    graph = json.loads(FIELD_MAP.read_text(encoding="utf-8"))
    graph_node_ids = {node["id"] for node in graph["nodes"]}
    routes = graph["learningRoutes"]
    refs_by_term = {}
    for ref in mission_refs:
        refs_by_term.setdefault(ref["term_id"], []).append(ref)

    node_refs = []
    for term_id in openbook["quick_terms"]:
        node_id = f"term:{term_id}"
        assert node_id in graph_node_ids, f"{term_id} missing from frontend map"
        source_relations = refs_by_term.get(term_id, [])
        relation = next((ref["source_status"] for ref in source_relations if ref["source_status"] == "direct"), source_relations[0]["source_status"] if source_relations else "related")
        node_refs.append({
            "nodeId": node_id,
            "termId": term_id,
            "relation": relation,
            "importance": master[term_id]["importance"],
            "missionContext": openbook["quick_term_context"][term_id]["mission_relevance"],
            "routeIds": [route["id"] for route in routes if node_id in route["nodeIds"]],
            "sourceRelations": [{"relation": ref["source_status"], "context": ref["context"]} for ref in source_relations],
        })

    payload = {
        "schemaVersion": "1.0",
        "artifactType": "derived-mission-overlay",
        "overlayId": "main-m01",
        "mapId": "frontend",
        "missionId": "main-m01",
        "label": "본과정 M01 관련 기술",
        "description": "Frontend 기술 지도에서 본과정 M01이 먼저 만나는 기술을 강조한다.",
        "generatedFrom": [
            "content/peer-review/main-m01-openbook.yaml",
            "data/curated/glossary-master-v0.1.yaml",
            "data/curated/mission-term-map-v0.1.yaml",
            "data/knowledge-maps/frontend/knowledge-map.json",
        ],
        "nodeCount": len(node_refs),
        "nodeIds": [ref["nodeId"] for ref in node_refs],
        "routeIds": [route["id"] for route in routes],
        "nodeRefs": node_refs,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
