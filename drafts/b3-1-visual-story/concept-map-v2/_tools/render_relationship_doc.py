"""02-relationship-design.md 생성.

설명 문장은 02-relationship-design.template.md에 있고, 관계·비교 카드·학습 순서 표는
concept-map-v2.json에서 뽑아 {{...}} 자리에 넣는다. 데이터를 고친 뒤 다시 실행한다.

실행: python -I -X utf8 render_relationship_doc.py
"""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(HERE, "..", "concept-map-v2.json")
LEGACY = os.path.join(HERE, "..", "..", "scene-04", "concept-map.json")
TEMPLATE = os.path.join(HERE, "02-relationship-design.template.md")
OUT = os.path.join(HERE, "..", "02-relationship-design.md")
SCENE = {"scene-01": "01", "scene-02": "02", "scene-03a": "03A", "scene-03b": "03B", "scene-04": "04"}


def cell(s):
    return str(s).replace("|", "\\|").replace("\n", " ")


def main():
    d = json.load(open(DATA, encoding="utf-8"))
    old = json.load(open(LEGACY, encoding="utf-8"))
    label = {n["id"]: n["label"] for n in d["nodes"]}
    out = {}
    for scope in ("general", "aws", "cross", "shared"):
        rows = ["| ID | 관계 | 유형 | 화면 이름 | 연결 이유 | 근거 | 장면 | 등급 |", "| --- | --- | --- | --- | --- | --- | --- | --- |"]
        for r in d["relations"]:
            if r["scope"] != scope:
                continue
            rel = f"{label[r['from']]} → {label[r['to']]}"
            if r.get("path"):
                rel += "<br>경로: " + " → ".join(label[x] for x in r["path"])
            rid = r["id"] + (f" ({r['legacyId']})" if r.get("legacyId") else "")
            rows.append(f"| {rid} | {cell(rel)} | {r['type']} | {cell(r['label'])} | {cell(r['description'])} | "
                        f"{', '.join('`' + s + '`' for s in r['source'])} | {' · '.join(SCENE[s] for s in r['storyScenes'])} | "
                        f"{'핵심' if r['importance'] == 'core' else '보충'} |")
        out[scope] = "\n".join(rows)
    out["cross_notes"] = "\n".join(
        f"| {r['id']} | {cell(r['comparisonNote']['same'])} | {cell(r['comparisonNote']['different'])} | {cell(r['comparisonNote'].get('caution', '—'))} |"
        for r in d["relations"] if r["scope"] == "cross")
    out["contrasts"] = "\n".join(
        f"| {c['id']} | {c['title']} | {' · '.join(label[n] for n in c['nodeIds'])}"
        f"{''.join(' · ' + x['label'] + '(B3-1에 없음)' for x in c.get('externalRefs', []))} | {cell(c['noLineReason'])} | {cell(c['explanation'])} |"
        for c in d["contrasts"])
    new_by_legacy = {x: n for n in d["nodes"] for x in n.get("legacyIds", [])}
    rows = []
    for n in old["nodes"]:
        new = new_by_legacy[n["id"]]
        if new["label"] != n["label"]:
            change = f"표시 이름 '{n['label']}' → '{new['label']}'" + ("" if new["domain"] == "aws" else f", {new['domain']} 노드로")
        else:
            change = "같은 대상" if new["domain"] == "aws" else f"같은 이름, {new['domain']} 노드로"
        rows.append(f"| 노드 `{n['id']}` | `{new['id']}` | {change} |")
    rows.append(f"| 경로 표시 `@internet` | `{new_by_legacy['@internet']['id']}` | 노드로 올림 |")
    out["legacy_nodes"] = "\n".join(rows)
    rel_by_legacy = {r["legacyId"]: r for r in d["relations"] if r.get("legacyId")}
    rows = []
    for r in old["relations"]:
        new = rel_by_legacy[r["id"]]
        same = new["type"] == r["type"] and new["description"].startswith(r["description"])
        rows.append(f"| 관계 {r['id']} | {new['id']} ({new['scope']}) | {'유형·설명 유지' if same else '설명 보완'}"
                    f"{'' if new['scope'] != 'shared' else ', 공통 주소 노드 사이의 shared 관계로'} |")
    out["legacy_rels"] = "\n".join(rows)
    out["learning"] = "\n".join(
        f"| {lo['id']} | {lo['first']} | {lo['then']} | {', '.join(lo['firstRefs'] + lo['thenRefs'])} |" for lo in d["learningOrder"])
    text = open(TEMPLATE, encoding="utf-8").read()
    for key, value in out.items():
        text = text.replace("{{" + key + "}}", value)
    if "{{" in text:
        raise SystemExit("채우지 못한 자리표시가 남음")
    open(OUT, "w", encoding="utf-8", newline="\n").write(text)
    print(f"wrote {os.path.relpath(OUT, HERE)}")


if __name__ == "__main__":
    main()
