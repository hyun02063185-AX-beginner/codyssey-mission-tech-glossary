#!/usr/bin/env python3
"""Apply durable canonical-id migrations to generated Technology Atlas maps.

Authored map builders intentionally focus on readable concept declarations.  This
post-build curation step keeps their generated graph bindings aligned with the
canonical glossary without turning mission-local vocabulary into canonical map
nodes.  It is idempotent and runs as part of ``npm run data:build``.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MAP_ROOT = ROOT / "data" / "knowledge-maps"
MASTER = ROOT / "data" / "curated" / "glossary-master-v0.1.yaml"

# Source ID -> surviving canonical ID.  Aliases preserve lookup for the source
# spelling while graphs always deep-link to the survivor.
MERGES = {
    "arm64-x86-64": "cpu-architecture",
    "data-json": "json",
    "http-request": "http-request-response",
    "o": "time-complexity",
    "remote-repository": "remote",
    "serialize-deserialize": "serialization",
    "expiration": "time-to-live",
}

# These names remain available in data/curated/mission-local-terms-v0.1.json,
# but are intentionally not canonical graph terms.  A foundation node retains
# the explanatory place in a map when an authored map needs that context.
MISSION_LOCAL = {
    "ancestors-command", "branch-command", "commit-command", "dbsize-command",
    "del-command", "exists-command", "expire-command", "get-command",
    "init-command", "keys-command", "log-command", "path-command",
    "search-command", "set-command", "switch-command", "auth-layer",
    "components-directory", "css-directory", "hooks-directory", "images-directory",
    "javascript-directory", "lib-directory", "pages-directory", "template-directory",
    "model-layer", "repository-layer", "router-layer", "service-layer",
    "monitor-sh", "code-block", "evidence-logs", "result-report", "description",
    "aws-seoul-region", "cpu-max-occupy", "deployment-url", "git-repository-url",
    "hello-world", "help-option", "listen-address", "memory-limit", "memoryguard",
    "multi-thread-enable", "pattern", "screenshot", "tcp-port-20022",
}

# These nodes used to be map-only foundations even though canonical terms now
# exist.  Bind them to canonical routes so Atlas and Open-book never present a
# shadow duplicate with a dead glossary path.
SHADOWS = {
    "foundation:promise": "promise",
    "foundation:http": "http",
    "foundation:cookie": "cookie",
    "foundation:callback-pattern": "callback",
}

def replace_id(value, old, new):
    return value.replace(f"term:{old}", f"term:{new}") if isinstance(value, str) else value

def foundation_id(term_id):
    return f"foundation:mission-local-{term_id}"

def dedupe(items):
    out = []
    for item in items:
        if item not in out:
            out.append(item)
    return out

def migrate_graph(graph, terms):
    nodes = graph["nodes"]
    for node in nodes:
        target = SHADOWS.get(node["id"])
        if not target:
            continue
        old = node["id"]
        node.update({"id": f"term:{target}", "termId": target,
                     "label": terms[target]["term_en"], "labelKo": terms[target]["term_ko"],
                     "nodeOrigin": "field"})
        if node.get("nodeRole") == "foundation":
            node["foundationRationale"] = "A canonical foundation term reused by this field map."
        else:
            node.pop("foundationRationale", None)
        for route in graph["learningRoutes"]:
            route["nodeIds"] = [f"term:{target}" if item == old else item for item in route["nodeIds"]]
        for edge in graph["edges"]:
            edge["from"] = f"term:{target}" if edge["from"] == old else edge["from"]
            edge["to"] = f"term:{target}" if edge["to"] == old else edge["to"]
    for old, new in MERGES.items():
        source = next((node for node in nodes if node.get("termId") == old), None)
        if not source:
            continue
        target = next((node for node in nodes if node.get("termId") == new), None)
        for route in graph["learningRoutes"]:
            route["nodeIds"] = dedupe(replace_id(item, old, new) for item in route["nodeIds"])
        for edge in graph["edges"]:
            edge["from"] = replace_id(edge["from"], old, new)
            edge["to"] = replace_id(edge["to"], old, new)
        if target:
            nodes.remove(source)
        else:
            source.update({"id": f"term:{new}", "termId": new,
                           "label": terms[new]["term_en"], "labelKo": terms[new]["term_ko"]})
    seen = set()
    graph["edges"] = [edge for edge in graph["edges"]
                      if not ((key := (edge["from"], edge["relation"], edge["to"])) in seen or seen.add(key))]

    for node in nodes:
        term_id = node.get("termId")
        if term_id not in MISSION_LOCAL:
            continue
        node.pop("termId", None)
        node["id"] = foundation_id(term_id)
        node["nodeOrigin"] = "foundation"
        node["nodeRole"] = "foundation"
        node["foundationRationale"] = "Mission-local vocabulary is retained as map context, not as a canonical glossary term."
    for term_id in MISSION_LOCAL:
        old, new = f"term:{term_id}", foundation_id(term_id)
        for route in graph["learningRoutes"]:
            route["nodeIds"] = dedupe(new if item == old else item for item in route["nodeIds"])
        for edge in graph["edges"]:
            edge["from"] = new if edge["from"] == old else edge["from"]
            edge["to"] = new if edge["to"] == old else edge["to"]
    for node in nodes:
        if node.get("nodeRole") == "foundation" and not node.get("foundationRationale"):
            node["foundationRationale"] = "A foundational concept used to connect this field map."
    for edge in graph["edges"]:
        if edge["from"] == "term:async-await" and edge["to"] == "term:callback":
            edge["relation"] = "compare_with"
            edge["reason"] = "async/await와 callback은 비동기 흐름을 표현하는 방식으로 비교할 수 있지만, 하나가 다른 하나에서 직접 진화했다는 단일 계보는 아니다."

def migrate_overlay(overlay):
    refs = []
    for ref in overlay.get("nodeRefs", []):
        term_id = ref.get("termId")
        if term_id in MISSION_LOCAL:
            continue
        if term_id in MERGES:
            ref["termId"] = MERGES[term_id]
            ref["nodeId"] = f"term:{MERGES[term_id]}"
        if ref not in refs:
            refs.append(ref)
    overlay["nodeRefs"] = refs
    overlay["nodeIds"] = [ref["nodeId"] for ref in refs]

def main():
    terms = {item["id"]: item for item in json.loads(MASTER.read_text(encoding="utf-8"))["terms"]}
    for graph_path in MAP_ROOT.glob("*/knowledge-map.json"):
        graph = json.loads(graph_path.read_text(encoding="utf-8"))
        migrate_graph(graph, terms)
        graph_path.write_text(json.dumps(graph, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        for overlay_path in graph_path.parent.glob("overlays/*.json"):
            overlay = json.loads(overlay_path.read_text(encoding="utf-8"))
            migrate_overlay(overlay)
            overlay_path.write_text(json.dumps(overlay, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

if __name__ == "__main__":
    main()
