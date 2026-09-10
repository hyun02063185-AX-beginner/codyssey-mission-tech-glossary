#!/usr/bin/env python3
"""Validate a field knowledge map and its mission overlays."""
import json
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MAP_PATH = ROOT / "data/knowledge-maps/frontend/knowledge-map.json"
OVERLAY_DIR = ROOT / "data/knowledge-maps/frontend/overlays"
OPENBOOK_PATH = ROOT / "content/peer-review/main-m01-openbook.yaml"
LEGACY_DIR = ROOT / "data/knowledge-maps/main-m01"
VALID_RELATIONS = {"is_a", "based_on", "defined_by", "provided_by", "uses", "interacts_with", "prerequisite", "cs_foundation", "evolved_from", "enabled_by", "compare_with", "mission_uses"}
VALID_CONFIDENCE = {"HIGH", "MEDIUM", "LOW"}
VALID_EVIDENCE = {"mission-source", "official-standard", "official-documentation", "architectural-inference"}
VALID_ORIGINS = {"field", "foundation"}
VALID_ROLES = {"core", "foundation", "boundary"}
VALID_MISSION_RELATIONS = {"direct", "required", "related"}


def main():
    graph = json.loads(MAP_PATH.read_text(encoding="utf-8"))
    overlays = [json.loads(path.read_text(encoding="utf-8")) for path in sorted(OVERLAY_DIR.glob("*.json"))]
    errors, degree = [], Counter()
    nodes, edges = graph.get("nodes", []), graph.get("edges", [])
    node_ids = [node.get("id") for node in nodes]
    known_nodes = set(node_ids)
    regions = {region["id"] for region in graph.get("regions", [])}
    if graph.get("mapId") != "frontend": errors.append("mapId must be frontend")
    if len(node_ids) != len(known_nodes): errors.append("duplicate node id")
    for node in nodes:
        required = {"id", "label", "nodeOrigin", "nodeRole", "layer", "primaryRegion", "summary"}
        missing = required - set(node)
        if missing: errors.append(f"{node.get('id')}: missing node fields {sorted(missing)}")
        if node.get("primaryRegion") not in regions: errors.append(f"{node.get('id')}: invalid region")
        if node.get("nodeOrigin") not in VALID_ORIGINS: errors.append(f"{node.get('id')}: invalid origin")
        if node.get("nodeRole") not in VALID_ROLES: errors.append(f"{node.get('id')}: invalid nodeRole")
        if node.get("nodeRole") == "foundation" and not node.get("foundationRationale"):
            errors.append(f"{node.get('id')}: foundation role missing rationale")
        if node.get("termId") and node["id"] != f"term:{node['termId']}":
            errors.append(f"{node.get('id')}: invalid termId binding")
    route_ids = [route.get("id") for route in graph.get("learningRoutes", [])]
    if len(route_ids) != len(set(route_ids)): errors.append("duplicate learning route id")
    for route in graph.get("learningRoutes", []):
        if not route.get("id") or not route.get("label") or not route.get("description") or route.get("scope") not in {"field", "mission"}:
            errors.append("learning route missing required field")
        if len(route.get("nodeIds", [])) < 2: errors.append(f"learning route {route.get('id')}: fewer than two nodes")
        if any(node_id not in known_nodes for node_id in route.get("nodeIds", [])): errors.append(f"learning route {route.get('id')}: unknown node")
    seen_edges = set()
    for edge in edges:
        required = {"from", "to", "relation", "reason", "confidence", "evidenceType", "source"}
        if required - set(edge): errors.append(f"edge {edge.get('from')}->{edge.get('to')}: missing required field")
        if edge.get("from") not in known_nodes: errors.append(f"unknown edge source: {edge.get('from')}")
        if edge.get("to") not in known_nodes: errors.append(f"unknown edge target: {edge.get('to')}")
        if edge.get("relation") not in VALID_RELATIONS: errors.append(f"invalid relation: {edge.get('relation')}")
        if edge.get("confidence") not in VALID_CONFIDENCE: errors.append(f"invalid confidence: {edge.get('confidence')}")
        if edge.get("evidenceType") not in VALID_EVIDENCE: errors.append(f"invalid evidence type: {edge.get('evidenceType')}")
        if not str(edge.get("source", "")).startswith(("http://", "https://", "repo:")): errors.append("edge source is not traceable")
        key = (edge.get("from"), edge.get("relation"), edge.get("to"))
        if key in seen_edges: errors.append(f"duplicate edge: {key}")
        seen_edges.add(key); degree[edge.get("from")] += 1; degree[edge.get("to")] += 1
    for node in nodes:
        if degree[node["id"]] == 0: errors.append(f"orphan node: {node['id']}")
    overlay_ids = [overlay.get("overlayId") for overlay in overlays]
    if len(overlay_ids) != len(set(overlay_ids)): errors.append("duplicate overlay id")
    for overlay in overlays:
        required = {"overlayId", "mapId", "missionId", "nodeIds", "routeIds", "nodeRefs"}
        if required - set(overlay): errors.append(f"overlay {overlay.get('overlayId')}: missing required field")
        if overlay.get("mapId") != graph.get("mapId"): errors.append(f"overlay {overlay.get('overlayId')}: wrong mapId")
        overlay_nodes = overlay.get("nodeIds", [])
        if len(overlay_nodes) != len(set(overlay_nodes)): errors.append(f"overlay {overlay.get('overlayId')}: duplicate node ref")
        if any(node_id not in known_nodes for node_id in overlay_nodes): errors.append(f"overlay {overlay.get('overlayId')}: unknown node")
        if any(route_id not in route_ids for route_id in overlay.get("routeIds", [])): errors.append(f"overlay {overlay.get('overlayId')}: unknown route")
        refs = overlay.get("nodeRefs", [])
        if {ref.get("nodeId") for ref in refs} != set(overlay_nodes): errors.append(f"overlay {overlay.get('overlayId')}: nodeRefs coverage mismatch")
        for ref in refs:
            if ref.get("relation") not in VALID_MISSION_RELATIONS: errors.append(f"overlay {overlay.get('overlayId')}: invalid mission relation")
            if ref.get("nodeId") != f"term:{ref.get('termId')}": errors.append(f"overlay {overlay.get('overlayId')}: invalid term binding")
            if any(route_id not in route_ids for route_id in ref.get("routeIds", [])): errors.append(f"overlay {overlay.get('overlayId')}: unknown node route")
    m01 = next((overlay for overlay in overlays if overlay.get("missionId") == "main-m01"), None)
    if not m01: errors.append("main-m01 overlay missing")
    else:
        quick_terms = set(json.loads(OPENBOOK_PATH.read_text(encoding="utf-8"))["quick_terms"])
        if {ref.get("termId") for ref in m01["nodeRefs"]} != quick_terms: errors.append("main-m01 overlay Quick Term coverage mismatch")
    if LEGACY_DIR.exists(): errors.append("stale legacy data/knowledge-maps/main-m01 path")
    if errors:
        for error in errors: print(f"ERROR: {error}", file=sys.stderr)
        return 1
    print(f"Knowledge map valid: {graph['mapId']} · {len(nodes)} nodes · {len(edges)} edges · {len(overlays)} overlays")
    print("Roles:", dict(sorted(Counter(node["nodeRole"] for node in nodes).items())))
    print("Relations:", dict(sorted(Counter(edge["relation"] for edge in edges).items())))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
