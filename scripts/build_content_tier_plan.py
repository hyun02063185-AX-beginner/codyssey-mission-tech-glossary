#!/usr/bin/env python3
"""Build the Sprint 7 full glossary content-tier and delivery-batch plan."""
from __future__ import annotations

import json
from collections import Counter
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
MASTER = ROOT / "data" / "curated" / "glossary-master-v0.1.yaml"
DETAILS = ROOT / "content" / "terms"
OUTPUT = ROOT / "data" / "reviews" / "content-tier-sprint7.json"

# These are concepts whose explanation must carry the learner across a boundary
# (security, state, lifecycle, execution, or algorithmic trade-off).  The list
# is deliberately small: membership raises a term to A, but never lowers it.
DEEP_BOUNDARY_IDS = {
    "acid", "ai-model", "amortized-complexity", "asgi", "asynchronous-data-fetching",
    "asynchronous-programming", "authentication", "authentication-token", "authorization",
    "back-populates", "base-image", "bfs", "bidirectional-relationship", "big-o-notation",
    "binary-search-tree", "branch", "branch-pointer", "browser-rendering", "cache",
    "cache-eviction", "callback", "cardinality", "cascade-delete-policy", "cgroup", "cidr",
    "client-side-route", "client-side-routing", "client-side-storage", "collision", "concurrency",
    "content-addressable-storage", "controlled-input", "convolution", "cookie", "cors",
    "csrf", "css-cascade", "css-flexbox", "css-grid", "custom-hook", "cycle", "data-integrity",
    "data-masking", "database-index", "database-session", "deadlock", "dependency-injection",
    "deque", "dfs", "directed-acyclic-graph", "directed-graph", "docker", "docker-container",
    "docker-image", "dockerfile", "dom", "domain-name-system", "erd", "event-loop",
    "event-propagation", "exception-handling", "fetch-api", "file-permission", "floating-point",
    "foreign-key", "form-validation", "function", "graph-traversal", "hash-function", "hash-map",
    "heap-property", "http", "http-request-response", "https", "iam-role", "identity-and-access-management",
    "inference", "input-validation", "join", "json", "json-web-token", "kernel", "least-privilege",
    "least-recently-used", "lock", "login-session", "many-to-many", "many-to-one", "memoization",
    "memory-leak", "merge", "merge-conflict", "middleware", "min-heap", "mutex", "nginx",
    "normalization", "oauth-2-0", "object-relational-mapping", "one-to-many-relationship", "output-validation",
    "password-hashing", "persistence", "port-mapping", "primary-key", "process", "promise", "queue",
    "race-condition", "rbac", "react-context", "react-props", "react-router", "react-state", "recursion",
    "referential-integrity", "refresh-token", "relational-database", "remote", "repository", "rest-api",
    "schema", "separation-of-concerns", "serialization", "server-side-rendering", "single-page-application",
    "sorting-algorithm", "sql", "sql-injection", "sqlalchemy", "sqlalchemy-orm", "sqlalchemy-relationship",
    "sqlalchemy-session", "ssh", "stack", "stack-trace", "state-change", "state-transition", "subnet",
    "tcp", "thread", "time-complexity", "time-to-live", "tls-certificate", "topological-sort", "transaction",
    "unique-constraint", "use-state", "useeffect", "variable", "virtual-dom-rendering", "virtual-private-cloud",
    "volume", "xss",
}

REFERENCE_TYPES = {"command", "source-file", "config"}
REFERENCE_IDS = {
    "755-644", "aws-free-tier", "codeowners", "commit-subcommand", "docker-attach", "docker-exec",
    "docker-info", "docker-logs", "docker-ps-docker-ps-a", "docker-stats", "exit-status-1", "git-config-list",
    "git-status", "main-py", "port-22-ssh", "port-80-http", "ps", "ps-l", "readme", "requirements-txt",
    "top", "top-h", "ufw", "visual-studio-code",
}

TIER_SPECS = {
    "A": {
        "name": "Deep learning concept",
        "required_depth": "Quick + Mission + Deep: causal flow or comparison, concrete code/command or scenario, boundary/edge case, misconception, related-term path, peer-review question.",
        "required_sections": ["summary", "easy_explanation", "technical_explanation", "mission_context", "how_it_works", "code_or_scenario", "limitations_or_edge_cases", "common_misconceptions", "related_terms", "peer_review_questions"],
    },
    "B": {
        "name": "Standard mission concept",
        "required_depth": "Quick + Mission + focused Deep: precise definition, one representative example, one applicable boundary or comparison, related terms when they clarify use.",
        "required_sections": ["summary", "easy_explanation", "technical_explanation", "mission_context", "code_or_scenario", "boundary_or_comparison", "related_terms", "peer_review_questions"],
    },
    "C": {
        "name": "Reference/supporting term",
        "required_depth": "Quick reference: precise one-paragraph definition, mission cue, and syntax/command/value example only when useful. Do not pad it with a generic Deep section.",
        "required_sections": ["summary", "easy_explanation", "technical_explanation", "mission_context", "focused_example_or_usage_note", "related_terms_if_needed"],
    },
}

# The groups are intentionally delivery-sized, not merely category-sized.  Their
# order is the agreed implementation order; each missing canonical is assigned
# exactly once by the selectors below.
BATCH_SPECS = (
    ("S7-B01", "Programming foundations and execution", (("Programming", 44),)),
    ("S7-B02", "Web rendering, interaction, and React", (("Web", None),)),
    ("S7-B03", "Security, identity, and safe request handling", (("Security", None),)),
    ("S7-B04", "Database modeling and data lifecycle", (("Database", None), ("Data", 9))),
    ("S7-B05", "Linux runtime and operations", (("Linux / OS", None),)),
    ("S7-B06", "Git history and collaboration", (("Git / Collaboration", None),)),
    ("S7-B07", "Network, backend, and deployment path", (("Network", None), ("Backend", None), ("Server / Infrastructure", None), ("Container", 5))),
    ("S7-B08", "Algorithms, data structures, and remaining language mechanics", (("Algorithms / Data Structures", None), ("Programming", None))),
    ("S7-B09", "AI/data tools and remaining infrastructure references", (("AI / Hardware", None), ("Container", None), ("Data", None), ("Tools", None), ("API", None))),
)


def detail_exists(term_id: str) -> bool:
    if term_id == "readme":
        return (ROOT / "content" / "readme-term.md").is_file()
    return (DETAILS / f"{term_id}.md").is_file()


def style_for(term: dict) -> str:
    if term["type"] == "command":
        return "command walkthrough"
    if term["type"] in {"protocol", "API"} or term["category"] == "Network":
        return "layered request/response flow"
    if term["category"] == "Security":
        return "threat boundary and safe-use scenario"
    if term["category"] == "Algorithms / Data Structures":
        return "input-to-result walkthrough with trade-off"
    if term["category"] == "Database":
        return "data-model example and constraint/lifecycle boundary"
    if term["category"] == "Git / Collaboration":
        return "before/after repository scenario"
    if term["category"] in {"Container", "Linux / OS", "Server / Infrastructure"}:
        return "runtime boundary and operational scenario"
    if term["category"] == "Web":
        return "browser/component flow"
    if term["category"] == "AI / Hardware":
        return "pipeline or trade-off explanation"
    return "small code or state walkthrough"


def classify(term: dict) -> tuple[str, list[str]]:
    """Return an explanation tier and auditable, data-derived rationale."""
    refs = term["mission_refs"]
    reasons: list[str] = []
    score = 0
    if term["importance"] == "core":
        score += 2
        reasons.append("core mission importance")
    if any(ref["source_status"] == "direct" for ref in refs):
        score += 1
        reasons.append("appears directly in a mission")
    if len(refs) > 1:
        score += 1
        reasons.append("reused across mission contexts")
    if term["difficulty"] >= 3:
        score += 1
        reasons.append("higher conceptual difficulty")
    if len(term["related_terms"]) >= 3:
        score += 1
        reasons.append("already has a multi-term learning path")
    if term["id"] in DEEP_BOUNDARY_IDS:
        score += 3
        reasons.append("requires a causal, security, lifecycle, or trade-off boundary")
    if term["id"] in REFERENCE_IDS or term["type"] in REFERENCE_TYPES:
        reasons.append("narrow command/configuration/reference scope")
        return "C", reasons
    if score >= 5:
        return "A", reasons
    if score >= 2:
        return "B", reasons
    reasons.append("single-context supporting vocabulary")
    return "C", reasons


def priority_key(item: dict) -> tuple[int, int, int, str]:
    # A content comes first inside a batch, then direct/core/reused terms.  The
    # id is the final stable tie-breaker, so future regeneration is predictable.
    tier_rank = {"A": 0, "B": 1, "C": 2}[item["tier"]]
    direct_rank = 0 if "appears directly in a mission" in item["rationale"] else 1
    core_rank = 0 if "core mission importance" in item["rationale"] else 1
    return tier_rank, direct_rank, core_rank, item["term_id"]


def build_batches(items: list[dict]) -> list[dict]:
    remaining = {item["term_id"]: item for item in items if item["content_state"] == "missing"}
    batches = []
    for batch_id, title, selectors in BATCH_SPECS:
        selected: list[dict] = []
        for category, limit in selectors:
            matches = sorted((item for item in remaining.values() if item["category"] == category), key=priority_key)
            if limit is not None:
                matches = matches[:limit]
            selected.extend(matches)
            for item in matches:
                del remaining[item["term_id"]]
        if not 40 <= len(selected) <= 50:
            raise ValueError(f"{batch_id} has {len(selected)} terms; delivery batches must contain 40–50")
        tier_counts = Counter(item["tier"] for item in selected)
        batches.append({
            "id": batch_id,
            "title": title,
            "size": len(selected),
            "tier_counts": dict(sorted(tier_counts.items())),
            "term_ids": [item["term_id"] for item in selected],
        })
        for item in selected:
            item["implementation_batch"] = batch_id
    if remaining:
        raise ValueError(f"unassigned missing-content term(s): {', '.join(sorted(remaining))}")
    return batches


def build() -> dict:
    terms = json.loads(MASTER.read_text(encoding="utf-8"))["terms"]
    items = []
    for term in terms:
        tier, rationale = classify(term)
        content_state = "detailed" if detail_exists(term["id"]) else "missing"
        items.append({
            "term_id": term["id"],
            "display_name": term["term_ko"],
            "category": term["category"],
            "content_state": content_state,
            "tier": tier,
            "required_depth": TIER_SPECS[tier]["required_depth"],
            "required_sections": TIER_SPECS[tier]["required_sections"],
            "recommended_style": style_for(term),
            "rationale": rationale,
            "content_path_note": None,
            "implementation_batch": None,
        })
    batches = build_batches(items)
    tier_counts = Counter(item["tier"] for item in items)
    existing_tier_counts = Counter(item["tier"] for item in items if item["content_state"] == "detailed")
    planned_tier_counts = Counter(item["tier"] for item in items if item["content_state"] == "missing")
    return {
        "version": "sprint7",
        "date": "2026-09-15",
        "basis_commit": "09b6036",
        "scope": "Full 519-canonical explanation-depth classification and fixed 40–50 term implementation batches. This is a planning artifact; it does not change canonical terms or create the remaining content.",
        "classification_method": "Tier is assigned from mission importance/directness/reuse, conceptual difficulty, current related-term path, and an explicit boundary-concept override. Narrow commands, config files, literal examples, and product/reference entries stay Tier C unless a later review records a learner-risk exception.",
        "non_term_files_excluded_from_content_count": [],
        "tier_definitions": TIER_SPECS,
        "summary": {
            "canonical_count": len(items),
            "existing_detailed_content_count": sum(item["content_state"] == "detailed" for item in items),
            "planned_content_count": sum(item["content_state"] == "missing" for item in items),
            "tier_counts": dict(sorted(tier_counts.items())),
            "existing_detailed_tier_counts": dict(sorted(existing_tier_counts.items())),
            "planned_tier_counts": dict(sorted(planned_tier_counts.items())),
            "batch_count": len(batches),
            "batch_size_range": {"min": min(batch["size"] for batch in batches), "max": max(batch["size"] for batch in batches)},
        },
        "items": sorted(items, key=lambda item: item["term_id"]),
        "implementation_batches": batches,
    }


if __name__ == "__main__":
    plan = build()
    OUTPUT.write_text(json.dumps(plan, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {OUTPUT.relative_to(ROOT)}: {plan['summary']['canonical_count']} canonical / {plan['summary']['planned_content_count']} planned")
