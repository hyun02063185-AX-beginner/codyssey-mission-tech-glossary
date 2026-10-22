"""concept-map.json 검사.

- 노드·관계 ID 중복, 관계 끝점 존재, 관계 유형이 여섯 가지 안, 고립 노드
- termIds·relatedTermIds가 용어사전(data/curated/glossary-master-v0.1.yaml)에 실제로 있는지
- 자동 연결 금지 ID(doNotAutoLink)가 노드에 쓰이지 않았는지
- 흐름 경로(path)의 노드가 존재하고 첫·끝 노드가 관계의 from·to와 같은지
- 학습 순서의 참조(장면·관계 ID)가 존재하고, 학습 선행이 관계 그래프에 섞이지 않았는지
- 관계가 Scene 03 concept-candidates.md(C1~C15)와 같은지: 끝점(노드 이름), 유형, 설명 문장(마크다운 표시 제거 후 비교)

실행: python3 -I check_data.py
"""
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", "..", ".."))
DATA = os.path.join(HERE, "..", "concept-map.json")
GLOSSARY = os.path.join(ROOT, "data", "curated", "glossary-master-v0.1.yaml")
CANDIDATES = os.path.join(HERE, "..", "..", "scene-03", "concept-candidates.md")
TYPES = {"포함", "선행", "역할", "흐름", "대응", "연관"}


def md_rows(path, section, prefix):
    text = open(path, encoding="utf-8").read()
    start = text.index(section)
    end = text.find("\n## ", start + 1)
    out = []
    for line in text[start:end].splitlines():
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if cells and re.fullmatch(prefix + r"\d+", cells[0]):
            out.append(cells)
    return out


def plain(s):
    return re.sub(r"[*`]", "", s).strip()


def main():
    d = json.load(open(DATA, encoding="utf-8"))
    glossary = {t["id"] for t in json.load(open(GLOSSARY, encoding="utf-8"))["terms"]}
    p = []
    nodes = {n["id"]: n for n in d["nodes"]}
    if len(nodes) != len(d["nodes"]):
        p.append("노드 ID 중복")
    rels = {r["id"]: r for r in d["relations"]}
    if len(rels) != len(d["relations"]):
        p.append("관계 ID 중복")
    labels = [n["label"] for n in d["nodes"]]
    if len(labels) != len(set(labels)):
        p.append("노드 표시 이름 중복(같은 기술이 두 번 정의됨)")
    scenes = {s["id"] for s in d["scenes"]}
    used = set()
    for r in d["relations"]:
        for k in ("from", "to"):
            if r[k] not in nodes:
                p.append(f"{r['id']}: {k} '{r[k]}' 노드 없음")
            used.add(r[k])
        if r["type"] not in TYPES:
            p.append(f"{r['id']}: 유형 '{r['type']}'이(가) 여섯 유형 밖")
        if r["type"] == "선행":
            p.append(f"{r['id']}: 학습 선행은 learningOrder로 관리")
        for s in r["scenes"]:
            if s not in scenes:
                p.append(f"{r['id']}: 장면 '{s}' 없음")
        if r["type"] == "대응" and not (r["from"].startswith("role:") and r["to"].startswith("b31:")):
            p.append(f"{r['id']}: 대응은 일반망 역할 노드 → AWS 노드여야 함(장비↔자원 동일시 방지)")
        if "path" in r:
            path = r["path"]
            if path[0] != r["from"] or path[-1] != r["to"]:
                p.append(f"{r['id']}: 경로의 처음·끝이 from·to와 다름")
            for step in path:
                if step.startswith("@"):
                    if step not in r.get("pathLabels", {}):
                        p.append(f"{r['id']}: 경로 표시 '{step}' 설명 없음")
                elif step not in nodes:
                    p.append(f"{r['id']}: 경로 노드 '{step}' 없음")
        for t in r.get("relatedTermIds", []):
            if t not in glossary:
                p.append(f"{r['id']}: 용어사전에 없는 ID '{t}'")
    for nid, n in nodes.items():
        if nid not in used:
            p.append(f"고립 노드: {nid}")
        for t in n["termIds"]:
            if t not in glossary:
                p.append(f"{nid}: 용어사전에 없는 ID '{t}'")
            if t in d["linkPolicy"]["doNotAutoLink"]:
                p.append(f"{nid}: 자동 연결 금지 ID '{t}'")
        for s in [n["firstScene"]] + n["storyScenes"]:
            if s not in scenes:
                p.append(f"{nid}: 장면 '{s}' 없음")
        if n["area"] not in {a["id"] for a in d["areas"]}:
            p.append(f"{nid}: 영역 '{n['area']}' 없음")
    for lo in d["learningOrder"]:
        for ref in lo["firstRefs"] + lo["thenRefs"]:
            if ref not in scenes and ref not in rels:
                p.append(f"{lo['id']}: 참조 '{ref}' 없음")
    # Scene 03 후보와 대조
    cand_nodes = {c[0]: c[1] for c in md_rows(CANDIDATES, "## 1. ", "N")}
    cand_rels = md_rows(CANDIDATES, "## 2. ", "C")
    name_of = {n["id"]: n["label"] for n in d["nodes"]}
    if sorted(cand_nodes.values()) != sorted(name_of.values()):
        p.append(f"Scene 03 후보 노드와 다름: {sorted(set(cand_nodes.values()) ^ set(name_of.values()))}")
    if len(cand_rels) != len(d["relations"]):
        p.append(f"Scene 03 후보 관계 수({len(cand_rels)})와 다름")
    for c in cand_rels:
        rid, a, b, kind, desc = c[0], c[1], c[2], c[3], c[4]
        r = rels.get(rid)
        if not r:
            p.append(f"{rid}: Scene 03 후보에 있으나 데이터에 없음")
            continue
        if (name_of.get(r["from"]), name_of.get(r["to"]), r["type"]) != (a, b, kind):
            p.append(f"{rid}: 끝점·유형이 Scene 03 후보와 다름")
        if plain(desc) != plain(r["description"]):
            p.append(f"{rid}: 설명이 Scene 03 후보와 다름")
    print(f"노드 {len(nodes)}개, 관계 {len(rels)}개, 학습 순서 {len(d['learningOrder'])}개")
    for kind in sorted(TYPES):
        ids = [r["id"] for r in d["relations"] if r["type"] == kind]
        if ids:
            print(f"  {kind} {len(ids)}: {', '.join(ids)}")
    linked = sorted({t for n in d["nodes"] for t in n["termIds"]})
    print(f"  연결한 용어사전 ID {len(linked)}개: {', '.join(linked)}")
    print(f"  용어사전 ID가 없는 노드: {', '.join(n['label'] for n in d['nodes'] if not n['termIds'])}")
    if p:
        print("\n".join("FAIL " + x for x in p))
        sys.exit(1)
    print("PASS ID 중복 없음 · 끝점 존재 · 유형 여섯 가지 안 · 고립 노드 없음 · 용어사전 ID 실재 · 학습 순서 분리 · Scene 03 후보 C1~C15와 일치")


if __name__ == "__main__":
    main()
