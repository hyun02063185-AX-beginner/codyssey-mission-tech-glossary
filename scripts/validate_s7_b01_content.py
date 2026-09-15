#!/usr/bin/env python3
"""Check that Sprint 8 implements exactly the planned S7-B01 depth contracts."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PLAN = ROOT / "data/reviews/content-tier-sprint7.json"
MASTER = ROOT / "data/curated/glossary-master-v0.1.yaml"
TERMS = ROOT / "content/terms"


def headings(path: Path) -> dict[str, str]:
    text = path.read_text(encoding="utf-8")
    return {
        title: body.strip()
        for title, body in re.findall(r"^## (.+?)\n(.*?)(?=^## |\Z)", text, re.MULTILINE | re.DOTALL)
    }


def main() -> int:
    plan = json.loads(PLAN.read_text(encoding="utf-8"))
    batch = next(item for item in plan["implementation_batches"] if item["id"] == "S7-B01")
    items = {item["term_id"]: item for item in plan["items"]}
    canonical_ids = {item["id"] for item in json.loads(MASTER.read_text(encoding="utf-8"))["terms"]}
    base = {"한 줄 설명", "쉽게 설명하면", "정확한 설명", "이 미션에서는 왜 필요한가", "코드 예", "관련 용어"}
    standard = base | {"주의할 점 / 경계 조건", "흔한 오해", "동료평가 질문"}
    deep = standard | {"동작 원리"}
    errors: list[str] = []
    for term_id in batch["term_ids"]:
        path = TERMS / f"{term_id}.md"
        if not path.exists():
            errors.append(f"{term_id}: missing content file")
            continue
        section_map = headings(path)
        required = deep if items[term_id]["tier"] == "A" else standard if items[term_id]["tier"] == "B" else base
        missing = sorted(section for section in required if not section_map.get(section))
        if missing:
            errors.append(f"{term_id}: missing required section(s): {', '.join(missing)}")
        related = [line.removeprefix("- ").strip().strip("`") for line in section_map.get("관련 용어", "").splitlines() if line.startswith("- ")]
        invalid = sorted(set(related) - canonical_ids)
        if invalid:
            errors.append(f"{term_id}: invalid related term(s): {', '.join(invalid)}")
        if "코디세이 미션에서 반복해 쓰이는 핵심 개념입니다." in path.read_text(encoding="utf-8"):
            errors.append(f"{term_id}: placeholder prose")
    if errors:
        for error in errors:
            print(f"ERROR: {error}")
        return 1
    counts = {tier: sum(items[term_id]["tier"] == tier for term_id in batch["term_ids"]) for tier in ("A", "B", "C")}
    print(f"S7-B01 content: {len(batch['term_ids'])} complete · A={counts['A']} B={counts['B']} C={counts['C']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
