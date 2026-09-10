#!/usr/bin/env python3
"""Build the auditable M01 Quick Terms inventory from existing source data.

This writes a derived artifact only.  The authored concept graph remains
data/knowledge-maps/main-m01/knowledge-map.json.
"""
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OPENBOOK = ROOT / "content/peer-review/main-m01-openbook.yaml"
MASTER = ROOT / "data/curated/glossary-master-v0.1.yaml"
MISSION_MAP = ROOT / "data/curated/mission-term-map-v0.1.yaml"
WEBTOONS = ROOT / "content/webtoons"
OUT = ROOT / "data/knowledge-maps/main-m01/term-inventory.json"


def main():
    openbook = json.loads(OPENBOOK.read_text(encoding="utf-8"))
    master = json.loads(MASTER.read_text(encoding="utf-8"))["terms"]
    mission_map = json.loads(MISSION_MAP.read_text(encoding="utf-8"))["missions"]["main/M01"]
    by_id = {term["id"]: term for term in master}
    refs_by_id = {}
    for ref in mission_map:
        refs_by_id.setdefault(ref["term_id"], []).append(ref)

    terms = []
    for term_id in openbook["quick_terms"]:
        term = by_id[term_id]
        refs = refs_by_id.get(term_id, [])
        # Quick Terms are the Open-book's canonical selection.  Preserve all
        # source-map records rather than guessing a single replacement label.
        source_relations = [
            {"relation": ref["source_status"], "context": ref["context"]}
            for ref in refs
        ]
        terms.append(
            {
                "termId": term_id,
                "termKo": term["term_ko"],
                "termEn": term["term_en"],
                "m01SourceRelations": source_relations,
                "m01Context": openbook["quick_term_context"][term_id]["mission_relevance"],
                "currentCategory": term["category"],
                "currentType": term["type"],
                "aliases": term["aliases"],
                "hasDetailedContent": (ROOT / "content/terms" / f"{term_id}.md").exists(),
                "currentWebtoon": {
                    "hasWebtoon": (WEBTOONS / term_id / "concept.md").exists(),
                    "status": term["webtoon"]["status"],
                },
            }
        )

    payload = {
        "artifactType": "derived-inventory",
        "missionId": "main-M01",
        "scope": "Open-book Quick Terms only; this does not replace the wider mission-term-map.",
        "generatedFrom": [
            "content/peer-review/main-m01-openbook.yaml",
            "data/curated/glossary-master-v0.1.yaml",
            "data/curated/mission-term-map-v0.1.yaml",
            "content/terms/<termId>.md",
            "content/webtoons/<termId>/concept.md",
        ],
        "termCount": len(terms),
        "terms": terms,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
