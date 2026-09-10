#!/usr/bin/env python3
"""Validate Atlas taxonomy, complete term classification, and mission matrix consistency."""
import json
import sys
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GLOSSARY = ROOT / "data/curated/glossary-master-v0.1.yaml"
ATLAS = ROOT / "data/knowledge-maps/atlas"
VALID_ROLES = {"core", "foundation", "boundary", "shared"}
VALID_CONFIDENCE = {"HIGH", "MEDIUM", "LOW"}
VALID_STATUS = {"direct", "required", "related"}


def main():
    glossary = json.loads(GLOSSARY.read_text(encoding="utf-8"))["terms"]
    taxonomy = json.loads((ATLAS / "field-taxonomy.json").read_text(encoding="utf-8"))
    classifications = json.loads((ATLAS / "term-field-classification.json").read_text(encoding="utf-8"))["classifications"]
    matrix = json.loads((ATLAS / "mission-field-matrix.json").read_text(encoding="utf-8"))["missions"]
    errors = []
    field_ids = {field["id"] for field in taxonomy["fields"]}
    glossary_ids = {term["id"] for term in glossary}
    classified_ids = [item.get("termId") for item in classifications]
    if len(classified_ids) != len(set(classified_ids)): errors.append("duplicate term classification")
    if set(classified_ids) != glossary_ids: errors.append("classification coverage does not equal canonical glossary")
    for item in classifications:
        if item.get("primaryField") not in field_ids: errors.append(f"{item.get('termId')}: unknown primary field")
        secondary = item.get("secondaryFields", [])
        if len(secondary) != len(set(secondary)): errors.append(f"{item.get('termId')}: duplicate secondary field")
        if item.get("primaryField") in secondary: errors.append(f"{item.get('termId')}: primary repeated as secondary")
        if any(field not in field_ids for field in secondary): errors.append(f"{item.get('termId')}: unknown secondary field")
        if item.get("mapRole") not in VALID_ROLES: errors.append(f"{item.get('termId')}: invalid map role")
        if item.get("confidence") not in VALID_CONFIDENCE: errors.append(f"{item.get('termId')}: invalid confidence")
        if not str(item.get("reason", "")).strip(): errors.append(f"{item.get('termId')}: missing reason")
    source_missions = defaultdict(set)
    for term in glossary:
        for ref in term["mission_refs"]:
            if ref["source_status"] not in VALID_STATUS: errors.append(f"{term['id']}: invalid mission source status")
            source_missions[f"{ref['course']}/{ref['mission']}"].add(term["id"])
    matrix_by_mission = {item.get("missionId"): item for item in matrix}
    if set(matrix_by_mission) != set(source_missions): errors.append("mission matrix coverage does not equal canonical mission references")
    by_term = {item["termId"]: item for item in classifications}
    for mission_id, term_ids in source_missions.items():
        item = matrix_by_mission.get(mission_id, {})
        if item.get("sourceTermCount") != len(term_ids): errors.append(f"{mission_id}: source term count mismatch")
        fields = item.get("fields", [])
        field_id_list = [field.get("fieldId") for field in fields]
        if not fields or item.get("primaryField") != field_id_list[0]: errors.append(f"{mission_id}: missing or inconsistent primary field")
        if field_id_list[1:] != item.get("secondaryFields", []): errors.append(f"{mission_id}: secondary field ordering mismatch")
        for field in fields:
            field_id = field.get("fieldId")
            if field_id not in field_ids: errors.append(f"{mission_id}: unknown matrix field")
            expected = {term_id for term_id in term_ids if field_id in [by_term[term_id]["primaryField"], *by_term[term_id]["secondaryFields"]]}
            if field.get("termCount") != len(expected): errors.append(f"{mission_id}/{field_id}: field term count mismatch")
            counts = field.get("sourceStatusCounts", {})
            if set(counts) != VALID_STATUS or sum(counts.values()) != len(expected): errors.append(f"{mission_id}/{field_id}: source status counts mismatch")
            if any(term_id not in expected for term_id in field.get("keyTerms", [])): errors.append(f"{mission_id}/{field_id}: key term outside field")
    if errors:
        for error in errors: print(f"ERROR: {error}", file=sys.stderr)
        return 1
    print(f"Technology Field Atlas valid: {len(field_ids)} fields · {len(classifications)} terms · {len(matrix)} missions")
    print("Primary fields:", dict(sorted(Counter(item["primaryField"] for item in classifications).items())))
    print("Confidence:", dict(sorted(Counter(item["confidence"] for item in classifications).items())))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
