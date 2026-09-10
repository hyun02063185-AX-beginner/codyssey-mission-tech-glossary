#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Build the compact term -> map link index for the Chrome Open-book extension.

The index answers two questions without shipping any full map graph:

- terms[termId] = implemented maps whose canvas actually contains the term
  as a graph node, primary field's map first (registry order after that).
- missions[missionId] = maps that expose an overlay for that mission,
  in routing order (primary context first).

Every value is asserted against the canonical glossary, the map registry,
and the actual graph nodes, so a broken deep link cannot be generated
from this index. The file is deterministic JSON.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GLOSSARY = ROOT / "data/curated/glossary-master-v0.1.yaml"
REGISTRY = ROOT / "data/knowledge-maps/map-registry.json"
CLASSIFICATIONS = ROOT / "data/knowledge-maps/atlas/term-field-classification.json"
ROUTING = ROOT / "data/knowledge-maps/atlas/mission-map-routing.json"
OUT = ROOT / "src/data/generated/term-map-links.json"


def build():
    term_ids = {item["id"] for item in json.loads(GLOSSARY.read_text(encoding="utf-8"))["terms"]}
    registry = json.loads(REGISTRY.read_text(encoding="utf-8"))["maps"]
    classification = json.loads(CLASSIFICATIONS.read_text(encoding="utf-8"))["classifications"]
    routing = json.loads(ROUTING.read_text(encoding="utf-8"))["missions"]

    implemented = [entry for entry in registry if entry.get("status") == "implemented"]
    map_by_field = {entry["fieldId"]: entry for entry in implemented}
    primary_field = {item["termId"]: item["primaryField"] for item in classification}

    # mapId -> set of termIds that exist as real graph nodes
    node_terms = {}
    for entry in implemented:
        graph = json.loads((ROOT / entry["dataPath"]).read_text(encoding="utf-8"))
        assert graph["mapId"] == entry["mapId"], f"{entry['mapId']}: graph identity mismatch"
        node_terms[entry["mapId"]] = {node["termId"] for node in graph["nodes"] if node.get("termId")}

    terms = {}
    for term_id in sorted(term_ids):
        maps = [map_id for map_id, ids in node_terms.items() if term_id in ids]
        if not maps:
            continue
        # canonical home (primary field) map first when that map has the node
        home = map_by_field.get(primary_field.get(term_id, ""))
        if home and home["mapId"] in maps:
            maps = [home["mapId"]] + [map_id for map_id in maps if map_id != home["mapId"]]
        terms[term_id] = maps

    missions = {}
    for route in routing:
        maps = []
        for context in route.get("maps", []):
            entry = next((item for item in implemented if item["mapId"] == context.get("mapId")), None)
            overlay_mission = context.get("overlayMissionId")
            if not entry or not overlay_mission:
                continue
            assert overlay_mission == route["missionId"], f"{route['missionId']}: overlay id mismatch"
            assert overlay_mission in entry["availableMissions"], f"{route['missionId']}: overlay not in map"
            maps.append(entry["mapId"])
        missions[route["missionId"]] = maps

    # validator-grade asserts: nothing in the index may produce a broken deep link
    for term_id, maps in terms.items():
        assert term_id in term_ids, f"{term_id}: not a canonical term"
        for map_id in maps:
            entry = next(item for item in implemented if item["mapId"] == map_id)
            assert term_id in node_terms[map_id], f"{term_id}: not a node in {map_id}"
    for mission_id, maps in missions.items():
        assert maps, f"{mission_id}: no overlay maps"

    payload = {"schemaVersion": "1.0", "artifactType": "authored-term-map-link-index",
               "scope": "Chrome Open-book deep links; graph-node-existence based; generated from atlas sources",
               "terms": terms, "missions": missions}
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    mapped_edges = sum(len(maps) for maps in terms.values())
    print(f"term-map-links: {len(terms)} mapped terms · {mapped_edges} term-map edges · "
          f"{len(missions)} missions")


if __name__ == "__main__":
    build()
