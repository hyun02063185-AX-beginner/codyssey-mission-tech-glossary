#!/usr/bin/env python3
"""Build mission overlays for implemented Wave 1 field maps from canonical mission relations."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REGISTRY = ROOT / "data/knowledge-maps/map-registry.json"
MISSION_MAP = ROOT / "data/curated/mission-term-map-v0.1.yaml"
MASTER = ROOT / "data/curated/glossary-master-v0.1.yaml"


def mission_key(mission_id):
    course, mission = mission_id.split("-")
    return f"{course}/{mission.upper()}"


def main():
    registry = json.loads(REGISTRY.read_text(encoding="utf-8"))["maps"]
    mission_terms = json.loads(MISSION_MAP.read_text(encoding="utf-8"))["missions"]
    master = {term["id"]: term for term in json.loads(MASTER.read_text(encoding="utf-8"))["terms"]}
    for entry in registry:
        if entry["status"] != "implemented":
            continue
        graph_path = ROOT / entry["dataPath"]
        graph = json.loads(graph_path.read_text(encoding="utf-8"))
        graph_nodes = {node["id"]: node for node in graph["nodes"]}
        for mission_id in entry["availableMissions"]:
            if entry["mapId"] == "frontend" and mission_id == "main-m01":
                continue
            refs = {item["term_id"]: item for item in mission_terms[mission_key(mission_id)]}
            course, mission = mission_id.split("-")
            display_mission = f"{'본과정' if course == 'main' else '예비'} {mission.upper()}"
            node_refs = []
            for node_id, node in graph_nodes.items():
                term_id = node.get("termId")
                if not term_id or term_id not in refs:
                    continue
                ref = refs[term_id]
                route_ids = [route["id"] for route in graph["learningRoutes"] if node_id in route["nodeIds"]]
                node_refs.append({
                    "nodeId": node_id,
                    "termId": term_id,
                    "relation": ref["source_status"],
                    "importance": master[term_id]["importance"],
                    "missionContext": ref["context"],
                    "routeIds": route_ids,
                    "sourceRelations": [{"relation": ref["source_status"], "context": ref["context"]}],
                })
            payload = {
                "schemaVersion": "1.0", "artifactType": "derived-mission-overlay", "overlayId": mission_id,
                "mapId": entry["mapId"], "missionId": mission_id,
                "label": f"{display_mission} 관련 기술",
                "description": f"{entry['title']}에서 {display_mission}의 curated 기술을 강조한다.",
                "generatedFrom": ["data/curated/mission-term-map-v0.1.yaml", "data/curated/glossary-master-v0.1.yaml", entry["dataPath"]],
                "nodeCount": len(node_refs), "nodeIds": [item["nodeId"] for item in node_refs],
                "edgeIds": [], "routeIds": [route["id"] for route in graph["learningRoutes"] if any(node_id in {item["nodeId"] for item in node_refs} for node_id in route["nodeIds"])],
                "nodeRefs": node_refs,
            }
            overlay_path = ROOT / next(path for path in entry["overlayPaths"] if path.endswith(f"{mission_id}.json"))
            overlay_path.parent.mkdir(parents=True, exist_ok=True)
            overlay_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
