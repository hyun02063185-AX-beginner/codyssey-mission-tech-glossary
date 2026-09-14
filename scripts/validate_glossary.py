#!/usr/bin/env python3
"""Validate canonical glossary curation and report non-blocking maturity gaps."""
import json
import re
import sys
import unicodedata
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MASTER = ROOT / "data/curated/glossary-master-v0.1.yaml"
MISSION_MAP = ROOT / "data/curated/mission-term-map-v0.1.yaml"
MISSION_LOCAL = ROOT / "data/curated/mission-local-terms-v0.1.json"
OPENBOOK = ROOT / "content/peer-review/main-m01-openbook.yaml"
CONNECTIONS = ROOT / "data/curated/concept-connections-v1.json"
ATLAS = ROOT / "data/knowledge-maps/atlas/term-field-classification.json"
MAP_ROOT = ROOT / "data/knowledge-maps"
EXTENSION_GLOSSARY = ROOT / "dist-extension/glossary.json"
EXTENSION_OPENBOOK = ROOT / "dist-extension/openbook-main-m01.json"

REQUIRED = {"id", "term_ko", "term_en", "aliases", "category", "type", "difficulty", "importance", "related_terms", "content_status", "webtoon", "mission_refs"}
VALID_STATUS = {"direct", "required", "related"}
ID_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
VALUE_LIKE = re.compile(r"^(?:\d+(?:\.\d+){1,3}(?::\d+)?|port\s*\d+|[A-Z][A-Z0-9_]*_[A-Z0-9_]+)$")

def norm(value):
    return re.sub(r"[\s_\-/().]+", "", unicodedata.normalize("NFKC", value).casefold())

def main():
    terms = json.loads(MASTER.read_text(encoding="utf-8"))["terms"]
    mission_map = json.loads(MISSION_MAP.read_text(encoding="utf-8"))["missions"]
    local = json.loads(MISSION_LOCAL.read_text(encoding="utf-8"))["terms"]
    openbook = json.loads(OPENBOOK.read_text(encoding="utf-8"))
    connections = json.loads(CONNECTIONS.read_text(encoding="utf-8"))["connections"]
    classifications = json.loads(ATLAS.read_text(encoding="utf-8"))["classifications"]
    errors, warnings = [], []
    ids = [term.get("id") for term in terms]
    canonical_ids = set(ids)
    if len(ids) != len(canonical_ids): errors.append("duplicate canonical id")
    local_ids = {term["id"] for term in local}
    if canonical_ids & local_ids: errors.append("mission-local contamination: canonical IDs also appear in mission-local store")

    labels, aliases = {}, {}
    for term in terms:
        missing = REQUIRED - set(term)
        if missing: errors.append(f"{term.get('id')}: missing required field(s): {', '.join(sorted(missing))}")
        if not ID_RE.fullmatch(str(term.get("id", ""))): errors.append(f"{term.get('id')}: invalid slug")
        for label in (term.get("term_ko", ""), term.get("term_en", "")):
            key = norm(label)
            if key in labels and labels[key] != term["id"]: errors.append(f"duplicate canonical label: {label}")
            labels[key] = term["id"]
        if VALUE_LIKE.fullmatch(str(term.get("term_en", "")).strip()): errors.append(f"{term['id']}: literal/value-like canonical")
        if not term.get("mission_refs"): warnings.append(f"{term['id']}: glossary_maturity_gap (no mission context)")
        if not (ROOT / "content/terms" / f"{term['id']}.md").exists(): warnings.append(f"{term['id']}: glossary_maturity_gap (no detailed description)")
        if not term.get("related_terms"): warnings.append(f"{term['id']}: glossary_maturity_gap (no related terms)")
        for related in term.get("related_terms", []):
            if related not in canonical_ids: errors.append(f"{term['id']}: broken related-term target {related}")
        seen_aliases = set()
        for alias in term.get("aliases", []):
            key = norm(alias)
            if not key: errors.append(f"{term['id']}: blank alias")
            if alias in seen_aliases: errors.append(f"{term['id']}: duplicate alias {alias!r}")
            seen_aliases.add(alias)
            owner = aliases.get(key)
            if owner and owner != term["id"]: errors.append(f"alias collision: {alias!r} belongs to {owner} and {term['id']}")
            if key in labels and labels[key] != term["id"]: errors.append(f"alias collision with canonical: {alias!r} -> {labels[key]}")
            aliases[key] = term["id"]
        for ref in term.get("mission_refs", []):
            if ref.get("source_status") not in VALID_STATUS: errors.append(f"{term['id']}: invalid mission mapping status")

    expected_map = defaultdict(list)
    for term in terms:
        for ref in term["mission_refs"]:
            expected_map[f"{ref['course']}/{ref['mission']}"].append((term["id"], ref["source_status"], ref["context"]))
    actual_map = defaultdict(list)
    for mission, refs in mission_map.items():
        for ref in refs:
            if ref.get("term_id") not in canonical_ids: errors.append(f"{mission}: broken canonical reference {ref.get('term_id')}")
            if ref.get("source_status") not in VALID_STATUS: errors.append(f"{mission}: invalid mission mapping")
            actual_map[mission].append((ref.get("term_id"), ref.get("source_status"), ref.get("context")))
    if {key: sorted(value) for key, value in expected_map.items()} != {key: sorted(value) for key, value in actual_map.items()}:
        errors.append("mission-term map is not synchronized with canonical mission references")

    for term_id, context in openbook.get("quick_term_context", {}).items():
        if term_id not in canonical_ids: errors.append(f"Open-book broken term reference: {term_id}")
        else:
            master_aliases = {norm(value) for value in next(term for term in terms if term["id"] == term_id)["aliases"]}
            missing = [value for value in context.get("aliases", []) if norm(value) not in master_aliases]
            if missing: errors.append(f"Open-book alias divergence for {term_id}: {missing}")

    connection_ids = [item.get("id") for item in connections]
    if len(connection_ids) != len(set(connection_ids)): errors.append("duplicate Concept Connection id")
    for connection in connections:
        required = {"id", "status", "title", "type", "question", "summary", "terms", "diagram", "sections", "misconceptions", "missionLinks"}
        if missing := required - set(connection): errors.append(f"{connection.get('id')}: missing Concept Connection field(s): {', '.join(sorted(missing))}")
        if connection.get("status") != "PUBLISHED": errors.append(f"{connection.get('id')}: unsupported Concept Connection status")
        term_ids = connection.get("terms", [])
        if len(term_ids) != len(set(term_ids)): errors.append(f"{connection.get('id')}: duplicate Concept Connection term")
        for term_id in term_ids:
            if term_id not in canonical_ids: errors.append(f"{connection.get('id')}: broken canonical term reference {term_id}")
        nodes = connection.get("diagram", {}).get("nodes", [])
        node_ids = [node.get("id") for node in nodes]
        if len(node_ids) != len(set(node_ids)): errors.append(f"{connection.get('id')}: duplicate diagram node")
        for node in nodes:
            if node.get("termId") and node["termId"] not in canonical_ids: errors.append(f"{connection.get('id')}: broken diagram canonical reference {node['termId']}")
            if not node.get("termId") and not node.get("label"): errors.append(f"{connection.get('id')}: diagram node missing label")
        for edge in connection.get("diagram", {}).get("edges", []):
            if edge.get("from") not in node_ids or edge.get("to") not in node_ids or not edge.get("label"): errors.append(f"{connection.get('id')}: invalid diagram relation")

    if EXTENSION_GLOSSARY.exists() and EXTENSION_OPENBOOK.exists():
        extension_ids = {item.get("id") for item in json.loads(EXTENSION_GLOSSARY.read_text(encoding="utf-8"))}
        if extension_ids != canonical_ids: errors.append("Chrome Open-book glossary data is not synchronized with canonical master")
        extension_book = json.loads(EXTENSION_OPENBOOK.read_text(encoding="utf-8"))
        for term_id in extension_book.get("quick_terms", []):
            if term_id not in canonical_ids: errors.append(f"Chrome Open-book broken term reference: {term_id}")

    classified = {item["termId"] for item in classifications}
    for term_id in canonical_ids - classified: errors.append(f"{term_id}: missing Atlas classification")
    for term_id in classified - canonical_ids: errors.append(f"Atlas broken term reference: {term_id}")
    mapped = set()
    for graph_path in MAP_ROOT.glob("*/knowledge-map.json"):
        graph = json.loads(graph_path.read_text(encoding="utf-8"))
        for node in graph.get("nodes", []):
            term_id = node.get("termId")
            if term_id:
                mapped.add(term_id)
                if term_id not in canonical_ids: errors.append(f"{graph_path}: broken Technology Atlas term reference {term_id}")
            elif node.get("nodeOrigin") == "foundation":
                key = norm(node.get("label", ""))
                if key in labels or key in aliases: errors.append(f"{graph_path}: duplicate foundation shadow {node.get('label')}")
    for term_id in canonical_ids - mapped: warnings.append(f"{term_id}: glossary_maturity_gap (Atlas unmapped)")

    for message in errors: print(f"ERROR: {message}")
    for message in warnings: print(f"WARNING: {message}")
    print(f"Glossary validation: {len(terms)} canonical · {len(local)} mission-local · {len(errors)} error(s) · {len(warnings)} warning(s)")
    return 1 if errors else 0

if __name__ == "__main__":
    raise SystemExit(main())
