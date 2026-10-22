"""concept-map-v2.json 검사.

- ID 중복(노드·관계·비교 카드), 표시 이름 중복, 관계 끝점 존재, 유형이 여섯 가지 안, 선행 미사용
- scope와 끝점 domain의 일치: general(general·common), aws(aws·common), cross(general → aws, 대응만), shared(common끼리)
- 대응은 교차 관계에서만, 끝점에 장비(device)를 쓰지 않음
- 흐름 경로: 노드 존재, 처음·끝 = from·to, 경로 노드의 domain이 scope와 맞음
- termIds·relatedTermIds가 용어사전(data/curated/glossary-master-v0.1.yaml)에 있고, 자동 연결 금지 ID를 쓰지 않음
- 장면 ID 존재, 일반망 예시 노드에 03-B가 없고 AWS 노드에 01·02가 없음
- implementationStatus: AWS 노드는 b31-deployed만, general-example은 일반망 노드만
- B3-1에 없는 구성(NAT Gateway·로드 밸런서·RDS·Elastic IP 등)이 노드로 들어가지 않음
- 공개하지 않는 값(공인 주소·작업자 IP·사설 IP 실제값·리소스 ID·계정 ID)이 없음
- 보기별(전체·일반망·AWS × 핵심만·보충 포함) 고립 노드
- 비교 카드·학습 순서·linkPolicy 참조 존재
- 이전 Scene 04(concept-map.json) 노드 14개·관계 C1~C15가 모두 legacyIds·legacyId로 이어짐
- 데이터에 적은 IP 주소·주소 범위가 Scene 01~03 그림(노트북용 SVG 글자)에 실제로 있음
- 한 용어사전 ID를 두 노드가 함께 쓰지 않음(?term= 딥링크)

실행: python -I -X utf8 check_concept_map_v2.py
"""
import html
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", "..", ".."))
DATA = os.path.join(HERE, "..", "concept-map-v2.json")
LEGACY = os.path.join(HERE, "..", "..", "scene-04", "concept-map.json")
GLOSSARY = os.path.join(ROOT, "data", "curated", "glossary-master-v0.1.yaml")
SCENE_SVGS = ["scene-01/enterprise-network-desktop.svg", "scene-02/request-response-desktop.svg",
              "scene-03/network-aws-overview-desktop.svg", "scene-03/network-aws-access-desktop.svg"]
TYPES = {"포함", "선행", "역할", "흐름", "대응", "연관"}
SCOPE_DOMAINS = {"general": {"general", "common"}, "aws": {"aws", "common"}, "shared": {"common"}}
NOT_IN_B31 = re.compile(r"NAT Gateway|로드 밸런서|Load Balancer|ELB|RDS|Elastic IP|EIP|NACL|EBS|IAM", re.I)
SECRETS = re.compile(r"13\.125\.|10\.0\.1\.149|121\.135\.|345471468876|\b(vpc|subnet|igw|rtb|sg|eni|i|vol)-0[0-9a-f]{6,}")


def main():
    d = json.load(open(DATA, encoding="utf-8"))
    raw = open(DATA, encoding="utf-8").read()
    glossary = {t["id"] for t in json.load(open(GLOSSARY, encoding="utf-8"))["terms"]}
    p = []
    nodes = {n["id"]: n for n in d["nodes"]}
    rels = {r["id"]: r for r in d["relations"]}
    cts = {c["id"]: c for c in d["contrasts"]}
    scenes = {s["id"] for s in d["scenes"]}
    regions = {r["id"]: r for r in d["regions"]}
    no_link = set(d["linkPolicy"]["doNotAutoLink"])
    if len(nodes) != len(d["nodes"]):
        p.append("노드 ID 중복")
    if len(rels) != len(d["relations"]):
        p.append("관계 ID 중복")
    if len(cts) != len(d["contrasts"]):
        p.append("비교 카드 ID 중복")
    if set(nodes) & set(rels) or set(rels) & set(cts):
        p.append("노드·관계·비교 카드 사이 ID 충돌")
    labels = [n["label"] for n in d["nodes"]]
    if len(labels) != len(set(labels)):
        p.append("노드 표시 이름 중복(같은 기술이 두 번 정의됨)")
    for m in SECRETS.finditer(raw):
        p.append(f"공개하지 않는 값이 들어 있음: '{m.group(0)}'")

    def check_terms(owner, ids):
        for t in ids:
            if t not in glossary:
                p.append(f"{owner}: 용어사전에 없는 ID '{t}'")
            if t in no_link:
                p.append(f"{owner}: 자동 연결 금지 ID '{t}'")

    for nid, n in nodes.items():
        prefix = {"general": "gen:", "aws": "aws:", "common": "com:"}.get(n["domain"])
        if not prefix or not nid.startswith(prefix):
            p.append(f"{nid}: domain '{n['domain']}'과 ID 접두어가 맞지 않음")
        if n["region"] not in regions or regions[n["region"]]["domain"] != n["domain"]:
            p.append(f"{nid}: region '{n['region']}'이 없거나 domain이 다름")
        if n["importance"] not in {"core", "supplementary"}:
            p.append(f"{nid}: importance '{n['importance']}'")
        if n["implementationStatus"] not in d["implementationStatuses"]:
            p.append(f"{nid}: implementationStatus '{n['implementationStatus']}'")
        if n["domain"] == "aws" and n["implementationStatus"] != "b31-deployed":
            p.append(f"{nid}: AWS 노드는 B3-1에서 실제로 만든 것만")
        if n["implementationStatus"] == "general-example" and n["domain"] != "general":
            p.append(f"{nid}: general-example은 일반망 노드만")
        if NOT_IN_B31.search(n["label"]):
            p.append(f"{nid}: B3-1에 없는 구성 '{n['label']}'이 노드로 들어감")
        for s in n["storyScenes"]:
            if s not in scenes:
                p.append(f"{nid}: 장면 '{s}' 없음")
        if n["domain"] == "general" and "scene-03b" in n["storyScenes"]:
            p.append(f"{nid}: 일반망 노드가 03-B(B3-1 접속 조건)에 등장한다고 기록됨")
        if n["domain"] == "aws" and {"scene-01", "scene-02"} & set(n["storyScenes"]):
            p.append(f"{nid}: AWS 노드가 Scene 01·02(일반망)에 등장한다고 기록됨")
        check_terms(nid, n["termIds"] + n.get("relatedTermIds", []))

    term_owner = {}
    for n in d["nodes"]:
        for t in n["termIds"]:
            if t in term_owner:
                p.append(f"{n['id']}: 용어사전 ID '{t}'를 {term_owner[t]}도 씀(?term= 딥링크가 모호해짐)")
            term_owner[t] = n["id"]

    seen = set()
    for r in d["relations"]:
        rid = r["id"]
        a, b = nodes.get(r["from"]), nodes.get(r["to"])
        if not a or not b:
            p.append(f"{rid}: 끝점 노드 없음 ({r['from']} → {r['to']})")
            continue
        key = (r["from"], r["to"], r["type"], r["scope"])
        if key in seen:
            p.append(f"{rid}: 같은 끝점·유형·범위의 관계가 또 있음")
        seen.add(key)
        if r["type"] not in TYPES:
            p.append(f"{rid}: 유형 '{r['type']}'이(가) 여섯 유형 밖")
        if r["type"] == "선행":
            p.append(f"{rid}: 학습 선행은 learningOrder로 관리")
        if r["importance"] not in {"core", "supplementary"}:
            p.append(f"{rid}: importance '{r['importance']}'")
        if r["importance"] == "core" and "supplementary" in (a["importance"], b["importance"]) and r["type"] != "흐름":
            p.append(f"{rid}: 핵심 관계의 끝점이 보충 노드")
        if not r.get("description") or not r.get("source"):
            p.append(f"{rid}: 연결 이유(description) 또는 근거(source) 없음")
        for s in r["source"]:
            if s not in {x["id"] for x in d["sources"]}:
                p.append(f"{rid}: 근거 '{s}' 없음")
        for s in r["storyScenes"]:
            if s not in scenes:
                p.append(f"{rid}: 장면 '{s}' 없음")
        sc = r["scope"]
        if sc == "cross":
            if (a["domain"], b["domain"]) != ("general", "aws"):
                p.append(f"{rid}: 교차 관계는 일반망 → AWS 방향")
            if r["type"] != "대응":
                p.append(f"{rid}: 교차 관계는 대응만")
            if "device" in (a["conceptType"], b["conceptType"]):
                p.append(f"{rid}: 대응에 장비 노드를 쓰지 않음(장비 ↔ 자원 동일시 방지)")
            cn = r.get("comparisonNote", {})
            if not (cn.get("same") and cn.get("different")):
                p.append(f"{rid}: 교차 관계에 공통점·차이점(comparisonNote) 없음")
        elif sc in SCOPE_DOMAINS:
            if not {a["domain"], b["domain"]} <= SCOPE_DOMAINS[sc]:
                p.append(f"{rid}: scope '{sc}'인데 끝점 domain이 {a['domain']}·{b['domain']}")
            if r["type"] == "대응":
                p.append(f"{rid}: 대응은 교차 관계에서만")
        else:
            p.append(f"{rid}: scope '{sc}'")
        if sc == "general" and {a["domain"], b["domain"]} == {"common"}:
            p.append(f"{rid}: common끼리의 관계는 shared")
        if r["type"] == "흐름":
            path = r.get("path", [])
            if not path or path[0] != r["from"] or path[-1] != r["to"]:
                p.append(f"{rid}: 경로의 처음·끝이 from·to와 다름")
            for step in path:
                if step not in nodes:
                    p.append(f"{rid}: 경로 노드 '{step}' 없음")
                elif sc in SCOPE_DOMAINS and nodes[step]["domain"] not in SCOPE_DOMAINS[sc]:
                    p.append(f"{rid}: 경로 노드 '{step}'의 domain이 scope '{sc}' 밖")
            if len(r.get("pathStepIds", [])) != len(path) - 1:
                p.append(f"{rid}: pathStepIds 수가 구간 수와 다름")
        check_terms(rid, r.get("relatedTermIds", []))

    for c in d["contrasts"]:
        for nid in c["nodeIds"]:
            if nid not in nodes:
                p.append(f"{c['id']}: 노드 '{nid}' 없음")
        for x in c.get("externalRefs", []):
            if x.get("termId") and x["termId"] not in glossary:
                p.append(f"{c['id']}: 용어사전에 없는 ID '{x['termId']}'")
        pair = set(c["nodeIds"][:2])
        for r in d["relations"]:
            if {r["from"], r["to"]} == pair:
                p.append(f"{c['id']}: '같지 않음' 카드의 두 노드가 관계선 {r['id']}로 이어짐")
    refs = scenes | set(rels) | set(cts)
    for lo in d["learningOrder"]:
        for ref in lo["firstRefs"] + lo["thenRefs"]:
            if ref not in refs:
                p.append(f"{lo['id']}: 참조 '{ref}' 없음")

    # 보기별 고립 노드
    views = {}
    for v in d["views"]:
        for mode in ("core", "full"):
            imp = {"core"} if mode == "core" else {"core", "supplementary"}
            vn = {nid for nid, n in nodes.items() if n["domain"] in v["nodeDomains"] and n["importance"] in imp}
            # 핵심만 보기에서는 핵심 관계만 그린다(03-interaction-spec 4절)
            vr = [r for r in d["relations"] if r["scope"] in v["relationScopes"] and r["from"] in vn and r["to"] in vn
                  and r["importance"] in imp]
            # 흐름 경로가 지나는 노드(예: 인터넷)도 그 흐름을 고르면 강조되므로 연결된 것으로 본다
            used = {x for r in vr for x in [r["from"], r["to"]] + [s for s in r.get("path", []) if s in vn]}
            iso = sorted(vn - used)
            views[(v["id"], mode)] = (len(vn), len(vr), iso)
            if iso:
                p.append(f"보기 {v['id']}·{mode}: 고립 노드 {', '.join(iso)}")

    # 장면과의 일치: 데이터에 적은 주소·주소 범위는 Scene 01~03 그림에 실제로 있는 값이어야 한다
    scene_text = ""
    for name in SCENE_SVGS:
        svg = open(os.path.join(HERE, "..", "..", name), encoding="utf-8").read()
        scene_text += " ".join(html.unescape(re.sub(r"<[^>]+>", "", t)) for t in re.findall(r"<text[^>]*>(.*?)</text>", svg, re.S))
    addrs = sorted(set(re.findall(r"\b\d{1,3}(?:\.\d{1,3}){3}(?:/\d{1,2})?", raw)))
    for a in addrs:
        if a not in scene_text:
            p.append(f"주소 '{a}'가 Scene 01~03 그림에 없음")

    # 이전 Scene 04와 대조
    old = json.load(open(LEGACY, encoding="utf-8"))
    new_legacy_nodes = {x for n in d["nodes"] for x in n.get("legacyIds", [])}
    for n in old["nodes"]:
        if n["id"] not in new_legacy_nodes:
            p.append(f"이전 노드 {n['id']}가 새 노드로 이어지지 않음")
    new_legacy_rels = {r.get("legacyId") for r in d["relations"]}
    for r in old["relations"]:
        if r["id"] not in new_legacy_rels:
            p.append(f"이전 관계 {r['id']}가 새 관계로 이어지지 않음")

    # 출력
    by_domain = {}
    for n in d["nodes"]:
        by_domain.setdefault(n["domain"], [0, 0])[0 if n["importance"] == "core" else 1] += 1
    print(f"노드 {len(nodes)}개 (핵심 {sum(v[0] for v in by_domain.values())} · 보충 {sum(v[1] for v in by_domain.values())})")
    for dom, (c, s) in sorted(by_domain.items()):
        print(f"  {dom}: 핵심 {c}, 보충 {s}")
    print(f"관계 {len(rels)}개")
    for sc in ("general", "aws", "cross", "shared"):
        rs = [r for r in d["relations"] if r["scope"] == sc]
        kinds = {}
        for r in rs:
            kinds[r["type"]] = kinds.get(r["type"], 0) + 1
        core = sum(r["importance"] == "core" for r in rs)
        print(f"  {sc}: {len(rs)} (핵심 {core} · 보충 {len(rs) - core}) " + ", ".join(f"{k} {v}" for k, v in sorted(kinds.items())))
    print(f"비교 카드 {len(cts)}개, 학습 순서 {len(d['learningOrder'])}개")
    for (vid, mode), (nn, nr, iso) in views.items():
        print(f"  보기 {vid:<7} {mode:<4}: 노드 {nn}, 관계 {nr}, 고립 {len(iso)}")
    linked = sorted({t for n in d["nodes"] for t in n["termIds"]})
    print(f"  연결한 용어사전 ID {len(linked)}개: {', '.join(linked)}")
    print(f"  용어사전 ID가 없는 노드 {sum(1 for n in d['nodes'] if not n['termIds'])}개")
    if p:
        print("\n".join("FAIL " + x for x in p))
        sys.exit(1)
    print("PASS ID·끝점·유형·범위·흐름 경로·용어사전 ID·장면·구현 상태·비공개 값·보기별 고립·비교 카드·이전 Scene 04 대조")


if __name__ == "__main__":
    main()
