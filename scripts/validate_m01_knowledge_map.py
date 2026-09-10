#!/usr/bin/env python3
"""Validate the authored M01 concept graph and its derived inventory."""
import json
import sys
from collections import Counter
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
MAP_PATH = ROOT / "data/knowledge-maps/main-m01/knowledge-map.json"
INVENTORY_PATH = ROOT / "data/knowledge-maps/main-m01/term-inventory.json"
VALID_RELATIONS = {
    "is_a", "based_on", "defined_by", "provided_by", "uses",
    "interacts_with", "prerequisite", "cs_foundation", "evolved_from",
    "enabled_by", "compare_with", "mission_uses",
}
VALID_CONFIDENCE = {"HIGH", "MEDIUM", "LOW"}
VALID_EVIDENCE = {
    "mission-source", "official-standard", "official-documentation",
    "architectural-inference",
}


def fail(message):
    print(f"ERROR: {message}", file=sys.stderr)
    return 1


def main():
    graph = json.loads(MAP_PATH.read_text(encoding="utf-8"))
    inventory = json.loads(INVENTORY_PATH.read_text(encoding="utf-8"))
    errors = []
    nodes = graph.get("nodes", [])
    edges = graph.get("edges", [])
    node_ids = [node.get("id") for node in nodes]
    known = set(node_ids)
    if len(node_ids) != len(known): errors.append("duplicate node id")
    regions = {region["id"] for region in graph.get("regions", [])}
    inventory_ids = {term["termId"] for term in inventory.get("terms", [])}
    mission_ids = set()
    degree = Counter()
    for node in nodes:
        required = {"id", "label", "nodeOrigin", "layer", "primaryRegion", "summary"}
        missing = required - set(node)
        if missing: errors.append(f"{node.get('id')}: missing node fields {sorted(missing)}")
        if node.get("primaryRegion") not in regions: errors.append(f"{node.get('id')}: invalid region")
        if node.get("nodeOrigin") not in {"mission", "foundation"}: errors.append(f"{node.get('id')}: invalid origin")
        if node.get("nodeOrigin") == "mission":
            if not node.get("termId"): errors.append(f"{node.get('id')}: mission node missing termId")
            else: mission_ids.add(node["termId"])
        elif not node.get("foundationRationale"):
            errors.append(f"{node.get('id')}: foundation node missing rationale")
    seen_edges = set()
    for edge in edges:
        required = {"from", "to", "relation", "reason", "confidence", "evidenceType", "source"}
        missing = required - set(edge)
        if missing: errors.append(f"edge {edge.get('from')}->{edge.get('to')}: missing {sorted(missing)}")
        if edge.get("from") not in known: errors.append(f"unknown edge source: {edge.get('from')}")
        if edge.get("to") not in known: errors.append(f"unknown edge target: {edge.get('to')}")
        if edge.get("relation") not in VALID_RELATIONS: errors.append(f"invalid relation: {edge.get('relation')}")
        if edge.get("confidence") not in VALID_CONFIDENCE: errors.append(f"invalid confidence: {edge.get('confidence')}")
        if edge.get("evidenceType") not in VALID_EVIDENCE: errors.append(f"invalid evidence type: {edge.get('evidenceType')}")
        if not str(edge.get("source", "")).startswith(("http://", "https://", "repo:")):
            errors.append(f"edge {edge.get('from')}->{edge.get('to')}: source is not traceable")
        key = (edge.get("from"), edge.get("relation"), edge.get("to"))
        if key in seen_edges: errors.append(f"duplicate edge: {key}")
        seen_edges.add(key)
        degree[edge.get("from")] += 1; degree[edge.get("to")] += 1
    if mission_ids != inventory_ids:
        errors.append(f"mission term coverage mismatch: graph={sorted(mission_ids)}, inventory={sorted(inventory_ids)}")
    for node in nodes:
        if degree[node["id"]] == 0: errors.append(f"orphan node: {node['id']}")
    # The current map is intentionally acyclic.  A future historical or
    # reciprocal edge must be explicitly redesigned instead of silently
    # creating a circular learning path.
    adjacency = {node_id: [] for node_id in known}
    for edge in edges:
        if edge.get("from") in known and edge.get("to") in known:
            adjacency[edge["from"]].append(edge["to"])
    visiting, visited = set(), set()
    def visit(node_id):
        if node_id in visiting: return True
        if node_id in visited: return False
        visiting.add(node_id)
        cyclic = any(visit(target) for target in adjacency[node_id])
        visiting.remove(node_id); visited.add(node_id)
        return cyclic
    if any(visit(node_id) for node_id in known): errors.append("unintended directed cycle")
    if errors:
        for error in errors: fail(error)
        return 1
    print(f"M01 knowledge map valid: {len(nodes)} nodes, {len(edges)} edges, {len(mission_ids)} mission terms")
    print("Relations:", dict(sorted(Counter(edge["relation"] for edge in edges).items())))
    print("Confidence:", dict(sorted(Counter(edge["confidence"] for edge in edges).items())))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
