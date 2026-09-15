#!/usr/bin/env python3
"""Validate completeness and batch invariants for the Sprint 7 content plan."""
from __future__ import annotations

import json
from collections import Counter
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
MASTER = ROOT / "data" / "curated" / "glossary-master-v0.1.yaml"
PLAN = ROOT / "data" / "reviews" / "content-tier-sprint7.json"
TERM_GUIDE = ROOT / "content" / "README.md"
COLLIDING_GUIDE = ROOT / "content" / "terms" / "README.md"


def main() -> int:
    canonical_ids = {term["id"] for term in json.loads(MASTER.read_text(encoding="utf-8"))["terms"]}
    plan = json.loads(PLAN.read_text(encoding="utf-8"))
    errors: list[str] = []
    items = plan.get("items", [])
    by_id = {item.get("term_id"): item for item in items}
    if len(by_id) != len(items):
        errors.append("duplicate term_id in items")
    if set(by_id) != canonical_ids:
        errors.append("items do not match the current canonical glossary exactly")
    for item in items:
        if item.get("tier") not in {"A", "B", "C"}:
            errors.append(f"{item.get('term_id')}: invalid tier")
        if not item.get("required_sections") or not item.get("required_depth"):
            errors.append(f"{item.get('term_id')}: missing depth contract")
        if item.get("content_state") not in {"detailed", "missing"}:
            errors.append(f"{item.get('term_id')}: invalid content state")
    if any(path.name == "README.md" for path in COLLIDING_GUIDE.parent.iterdir()):
        errors.append("content/terms/README.md must not exist; it collides with canonical readme.md on case-insensitive filesystems")
    if not TERM_GUIDE.is_file():
        errors.append("content/README.md directory guide is missing")
    planned = {item["term_id"] for item in items if item.get("content_state") == "missing"}
    batched: list[str] = []
    batch_for_term: dict[str, str] = {}
    for batch in plan.get("implementation_batches", []):
        term_ids = batch.get("term_ids", [])
        if not 40 <= len(term_ids) <= 50:
            errors.append(f"{batch.get('id')}: batch size {len(term_ids)} is outside 40–50")
        if batch.get("size") != len(term_ids):
            errors.append(f"{batch.get('id')}: declared size differs from term_ids")
        batched.extend(term_ids)
        batch_for_term.update({term_id: batch.get("id") for term_id in term_ids})
    if len(batched) != len(set(batched)):
        errors.append("a planned term appears in more than one batch")
    if set(batched) != planned:
        errors.append("implementation batches do not cover exactly the missing-content terms")
    for term_id, item in by_id.items():
        in_batch = term_id in set(batched)
        if item.get("content_state") == "missing" and (not in_batch or item.get("implementation_batch") != batch_for_term.get(term_id)):
            errors.append(f"{term_id}: missing content must have an implementation batch")
        if item.get("content_state") == "detailed" and (in_batch or item.get("implementation_batch") is not None):
            errors.append(f"{term_id}: detailed content must not be scheduled as new work")
    summary = plan.get("summary", {})
    if summary.get("canonical_count") != len(canonical_ids):
        errors.append("summary canonical_count is stale")
    if summary.get("planned_content_count") != len(planned):
        errors.append("summary planned_content_count is stale")
    tier_counts = dict(sorted(Counter(item["tier"] for item in items).items()))
    if summary.get("tier_counts") != tier_counts:
        errors.append("summary tier_counts is stale")
    if errors:
        for error in errors:
            print(f"ERROR: {error}")
        return 1
    print(f"Content tier plan: {len(items)} canonical · {len(planned)} planned · {len(plan['implementation_batches'])} valid batches")
    print("Tier counts: " + ", ".join(f"{tier}={count}" for tier, count in sorted(Counter(item['tier'] for item in items).items())))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
