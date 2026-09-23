#!/usr/bin/env python3
"""분야 검색 신호를 만든다.

학습자는 `보안`·`운영체제` 처럼 분야 이름으로 검색하는데 지금까지는 term 이름만
검색됐다. 이 빌더는 **새 taxonomy 를 만들지 않고** 기존 것 세 가지를 잇는다.

  glossary 의 category 14개        ← 이미 화면에 쓰이는 분류
  Atlas 의 term-field-classification ← term 이 어느 분야 지도에 사는가
  academic-fields 의 atlasCrosswalk  ← 그 분야가 어느 학문인가 (labelKo 가 이미 있다)

한국어 입력어만 `data/encyclopedia/field-search-labels.json` 에 손으로 적는다.
canonical term 에 alias 를 복제하지 않는다 — 분야 하나에 대해 한 번만 관리한다.

출력 `src/data/generated/field-search.json` 은 손으로 고치지 않는다.
"""
from __future__ import annotations

import collections
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LABELS = ROOT / "data/encyclopedia/field-search-labels.json"
GLOSSARY = ROOT / "src/data/generated/glossary.json"
CLASSIFICATION = ROOT / "data/knowledge-maps/atlas/term-field-classification.json"
ACADEMIC = ROOT / "data/encyclopedia/academic-fields.json"
REGISTRY = ROOT / "src/data/generated/map-registry.json"
OUT = ROOT / "src/data/generated/field-search.json"


def load(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def main() -> int:
    labels = load(LABELS)
    glossary = load(GLOSSARY)
    classification = {row["termId"]: row["primaryField"]
                      for row in load(CLASSIFICATION)["classifications"]}
    academic = load(ACADEMIC)
    crosswalk = academic["atlasCrosswalk"]
    academic_label = {field["id"]: field["labelKo"] for field in academic["fields"]}
    registry = {entry["fieldId"]: entry for entry in load(REGISTRY)["maps"]}

    errors: list[str] = []

    authored = {row["category"]: row for row in labels["categories"]}
    present = {term["category"] for term in glossary}
    for category in sorted(present - set(authored)):
        errors.append(f"glossary 에 있는 category 에 한국어 라벨이 없다: {category}")
    for category in sorted(set(authored) - present):
        errors.append(f"glossary 에 없는 category 가 라벨 파일에 있다: {category}")

    # alias 가 두 분야에 똑같이 들어가면 어느 쪽인지 말할 수 없다. 접두 겹침은 허용한다.
    seen: dict[str, str] = {}
    for category, row in authored.items():
        for alias in [row["labelKo"], *row["aliases"]]:
            key = alias.lower().strip()
            if not key:
                errors.append(f"{category}: 빈 alias")
            elif key in seen and seen[key] != category:
                errors.append(f"alias '{alias}' 가 {seen[key]} 와 {category} 양쪽에 있다")
            else:
                seen[key] = category

    if errors:
        for error in errors:
            print(f"field-search 오류: {error}", file=sys.stderr)
        return 1

    terms_by_category = collections.defaultdict(list)
    for term in glossary:
        terms_by_category[term["category"]].append(term["id"])

    fields = []
    for category in sorted(authored):
        row = authored[category]
        term_ids = terms_by_category[category]
        # 이 category 의 term 이 실제로 가장 많이 사는 Atlas 분야를 고른다.
        # 임의로 정하지 않고 분류 데이터에서 센다.
        counted = collections.Counter(classification[t] for t in term_ids if t in classification)
        if not counted:
            print(f"field-search 오류: {category} 의 term 이 Atlas 에 분류돼 있지 않다", file=sys.stderr)
            return 1
        atlas_field, share = counted.most_common(1)[0]
        academic_id = crosswalk.get(atlas_field)
        entry = registry.get(atlas_field, {})
        fields.append({
            "category": category,
            "labelKo": row["labelKo"],
            "aliases": [row["labelKo"], *row["aliases"]],
            "termCount": len(term_ids),
            # 화면에 내보내는 것은 한국어 라벨과 제목이고 id 는 링크에만 쓴다.
            "academicFieldId": academic_id,
            "academicLabelKo": academic_label.get(academic_id or ""),
            "mapId": entry.get("mapId") if entry.get("status") == "implemented" else None,
            "mapTitle": entry.get("title") if entry.get("status") == "implemented" else None,
            "evidence": {
                "atlasField": atlas_field,
                "atlasShare": f"{share}/{len(term_ids)}",
                "mapStatus": entry.get("status"),
            },
        })

    OUT.write_text(json.dumps({
        "schemaVersion": "1.0",
        "artifactType": "field-search",
        "generatedFrom": [
            "data/encyclopedia/field-search-labels.json",
            "src/data/generated/glossary.json",
            "data/knowledge-maps/atlas/term-field-classification.json",
            "data/encyclopedia/academic-fields.json",
            "src/data/generated/map-registry.json",
        ],
        "note": "생성물이다. 손으로 고치지 않는다. 한국어 입력어는 field-search-labels.json 에서 고친다.",
        "fields": fields,
    }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    linked = sum(1 for f in fields if f["mapId"])
    print(f"Field search: {len(fields)} categories · {sum(f['termCount'] for f in fields)} terms · "
          f"{sum(len(f['aliases']) for f in fields)} aliases · 지도 연결 {linked}/{len(fields)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
