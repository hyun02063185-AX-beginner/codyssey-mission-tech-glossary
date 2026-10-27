"""B3-1 네트워크 기초 보기 설계 후보 데이터를 만든다(설계 검증용, 프로덕션 데이터 아님).

입력: data/mission-story-maps/main-m05/concept-map.json (읽기만 한다)
출력: <out>/phase1.json      1차 — 기존 노드 용어 링크만 보강
      <out>/candidate-A.json 2차 3열 — [주소와 구역 | 공통 | 패킷과 프로토콜]
      <out>/candidate-B.json 2차 3열 — [공통 | 주소와 구역 | 패킷과 프로토콜]
      <out>/candidate-C.json 2차 4열 — [공통 | 주소와 구역 | 패킷과 프로토콜 | IP·TCP·HTTP의 역할]
      <out>/candidate-D.json 2차 4열 — [주소와 구역 | 공통 | 패킷과 프로토콜 | IP·TCP·HTTP의 역할]
      노드·관계·비교·학습 순서는 네 후보가 같고 영역(열) 배치만 다르다.

실행: python3 -I -X utf8 build_candidate.py <repo-root> <out-dir>
"""
import copy
import json
import os
import sys

ROOT, OUT = sys.argv[1], sys.argv[2]
SOURCE = os.path.join(ROOT, "data/mission-story-maps/main-m05/concept-map.json")


def node(d, nid):
    return next(n for n in d["nodes"] if n["id"] == nid)


def phase1(base):
    d = copy.deepcopy(base)
    node(d, "com:private-ip")["termIds"] = ["private-ip"]
    node(d, "com:private-ip")["relatedTermIds"] = ["ip-address"]
    node(d, "com:public-ip")["relatedTermIds"] = ["ip-address"]
    node(d, "com:port")["relatedTermIds"] = ["port-80-http", "https", "port-22-ssh", "tcp"]
    z = node(d, "gen:zone-subnets")
    z["relatedTermIds"] = ["subnet"]
    z["termIdNote"] = ("용어사전 subnet은 일반 정의로 보강되었다(PR #26). 직접 연결(termIds)은 한 노드만 소유하므로 "
                       "이 일반망 예시 노드는 relatedTermIds로만 연결한다.")
    return d


SOURCES = [
    {"id": "rfc791", "label": "RFC 791 Internet Protocol", "kind": "standard",
     "url": "https://www.rfc-editor.org/rfc/rfc791.html"},
    {"id": "rfc4632", "label": "RFC 4632 Classless Inter-domain Routing (CIDR)", "kind": "standard",
     "url": "https://www.rfc-editor.org/rfc/rfc4632.html"},
    {"id": "rfc9293", "label": "RFC 9293 Transmission Control Protocol", "kind": "standard",
     "url": "https://www.rfc-editor.org/rfc/rfc9293.html"},
    {"id": "rfc9110", "label": "RFC 9110 HTTP Semantics", "kind": "standard",
     "url": "https://www.rfc-editor.org/rfc/rfc9110.html"},
    {"id": "glossary-b31", "label": "용어사전 B3-1 네트워크 기초 보강(PR #26, reports/b3-1-network-glossary)", "kind": "glossary"},
]


def bas(nid, label, ctype, region, order, imp, summary, desc, terms, related=None, note=None, scenes=None, applied=None):
    n = {"id": nid, "label": label, "domain": "basics", "conceptType": ctype, "region": region, "order": order,
         "importance": imp, "implementationStatus": "concept", "summary": summary, "description": desc,
         "termIds": terms}
    if related:
        n["relatedTermIds"] = related
    if note:
        n["termIdNote"] = note
    n["storyScenes"] = scenes
    n["appliedIn"] = applied or []
    n["legacyIds"] = []
    return n


def ap(nid, view, note):
    return {"nodeId": nid, "view": view, "note": note}


NODES = [
    bas("bas:network", "네트워크", "area", "bas-address", 1, "core",
        "데이터를 주고받도록 연결된 기기들의 묶음",
        "기기들이 정해진 약속(프로토콜)에 따라 데이터를 주고받는 체계다. 일반망 예시의 회사 네트워크와 B3-1의 VPC는 "
        "모두 네트워크의 한 사례이며, 둘이 같은 것은 아니다.",
        [], ["ip-address"], "용어사전에 '네트워크' 단독 항목이 없다(등록 보류). 관련 용어로 IP 주소를 연다.",
        ["scene-01"], [ap("gen:enterprise-network", "general", "일반망 예시의 회사 네트워크"),
                       ap("aws:vpc", "aws", "B3-1의 가상 네트워크 VPC")]),
    bas("bas:subnet", "서브넷 (Subnet)", "area", "bas-address", 2, "core",
        "네트워크를 구역으로 나누고 구역마다 정한 IP 주소 범위",
        "주소 배정과 경로·정책 관리를 쉽게 하려고 나눈다. 나누기만 해서는 통신이 차단되지 않는다. "
        "막고 허용하는 일은 경로와 방화벽·Security Group 같은 규칙이 따로 맡는다. 범위는 CIDR 표기(예: 10.0.1.0/24)로 적으며 "
        "슬래시 뒤 숫자가 클수록 범위가 좁다. 계산 방법은 학습가이드 2장 그림을 사용한다.",
        ["subnet"], ["cidr"], None, ["scene-01", "scene-03b"],
        [ap("gen:zone-subnets", "general", "일반망 예시의 구역별 주소 범위"),
         ap("aws:vpc", "aws", "VPC 주소 범위 10.0.0.0/16"),
         ap("aws:subnet", "aws", "B3-1의 Public Subnet 10.0.1.0/24")]),
    bas("bas:ip-address", "IP 주소", "address", "bas-address", 3, "core",
        "네트워크에서 기기(정확히는 네트워크 인터페이스)를 찾아가기 위한 번호",
        "IPv4는 0~255 숫자 네 개로 쓴다(예: 문서용 공인 주소 203.0.113.10). 주소 하나는 인터페이스 하나를 가리키고, "
        "서브넷·CIDR은 주소의 범위를 나타낸다. 포트는 IP 주소의 일부가 아니라 TCP·UDP 정보다.",
        ["ip-address"], None, None, ["scene-01", "scene-02", "scene-03b"],
        [ap("aws:eni", "aws", "ENI에 할당된 사설 IPv4"), ap("aws:igw", "aws", "공인 IPv4와 사설 IPv4의 1:1 변환")]),
    bas("bas:packet", "패킷", "data-unit", "bas-protocol", 1, "core",
        "네트워크로 보내는 데이터 조각. 앞부분에 출발지·목적지 IP 주소가 적힌다",
        "IP 정보(주소) 안에 TCP 정보(포트)가, 그 안에 HTTP 같은 내용이 겹쳐 담긴다. HTTP 요청 하나가 항상 패킷 하나에 "
        "들어가지는 않는다. 경로는 목적지 주소로, 허용은 출발지·프로토콜·포트 같은 규칙으로 판단한다.",
        ["packet"], None, None, ["scene-02"],
        [ap("aws:route-table", "aws", "목적지 주소로 다음 경로 결정"),
         ap("aws:security-group", "aws", "출발지·프로토콜·포트로 허용 판단")]),
    bas("bas:protocol", "네트워크 프로토콜", "protocol", "bas-protocol", 2, "core",
        "통신하는 양쪽이 데이터의 형식과 순서를 미리 정한 약속",
        "한 번의 통신에서 여러 프로토콜이 역할을 나눠 겹쳐 쓰인다. 이 보기는 B3-1 웹 접속에 쓰인 IP·TCP·HTTP 세 가지만 다룬다.",
        ["network-protocol"], None, None, ["scene-02"], []),
    bas("bas:ip", "IP (인터넷 프로토콜)", "protocol", "bas-protocol", 3, "core",
        "목적지 IP 주소를 보고 패킷을 네트워크 사이로 전달하는 약속",
        "'IP 주소'의 IP가 이 프로토콜이다. 패킷을 목적지까지 보내지만 도착과 순서를 보장하지 않는다.",
        [], ["network-protocol", "ip-address"],
        "IP(프로토콜) 단독 용어는 등록하지 않았다. network-protocol 본문에서 IP의 역할을 설명한다.",
        ["scene-02"], [ap("aws:route-table", "aws", "목적지 0.0.0.0/0 → IGW 경로")]),
    bas("bas:tcp", "TCP", "protocol", "bas-protocol", 4, "core",
        "포트로 프로그램을 구분하고 손실 재전송·순서 복원을 맡는 약속",
        "신뢰성 있는 바이트 흐름을 제공하지만 연결 성공·암호화·웹 요청 성공을 보장하지 않는다. TCP 정보는 IP 패킷에 담겨 이동한다.",
        ["tcp"], ["socket-port"], None, ["scene-02", "scene-03b"],
        [ap("aws:security-group", "aws", "인바운드 TCP 80·22 허용 규칙")]),
    bas("bas:http", "HTTP", "protocol", "bas-protocol", 5, "core",
        "웹 요청과 응답의 형식과 의미를 정하는 약속",
        "B3-1 실습에서는 TCP 80으로 Nginx에 요청했다. Scene 02의 요청은 HTTPS(TCP 443) 예시다. "
        "HTTP/3처럼 TCP를 쓰지 않는 경우도 있다.",
        ["http"], ["port-80-http", "https"], None, ["scene-02", "scene-03b"],
        [ap("aws:nginx", "aws", "80에서 HTTP 요청을 받고 응답")]),
]


def rel(rid, a, b, t, imp, label, desc, src, scenes):
    return {"id": rid, "from": a, "to": b, "type": t, "scope": "basics", "importance": imp, "label": label,
            "description": desc, "source": src, "storyScenes": scenes}


RELATIONS = [
    rel("BA01", "bas:network", "bas:subnet", "포함", "core", "구역으로 나눔",
        "네트워크를 구역으로 나누고 구역마다 IP 주소 범위를 정한 것이 서브넷이다. 나누기만으로 통신이 차단되지는 않는다.",
        ["rfc4632", "glossary-b31"], ["scene-01"]),
    rel("BA02", "bas:subnet", "bas:ip-address", "연관", "core", "주소 범위",
        "서브넷은 그 구역에서 쓸 IP 주소들의 범위다. 주소 하나와 주소 범위는 다르다.", ["rfc4632"], ["scene-01"]),
    rel("BA03", "bas:ip-address", "com:public-ip", "연관", "core", "종류 · 인터넷 라우팅용",
        "공인 IP는 공용 인터넷의 라우팅에 쓰도록 배정된 IP 주소다. 주소가 있어도 경로·허용 규칙·응답하는 서비스가 함께 있어야 접속된다.",
        ["rfc791", "glossary-b31"], ["scene-01"]),
    rel("BA04", "bas:ip-address", "com:private-ip", "연관", "core", "종류 · 내부 통신용",
        "사설 IP는 내부 통신용으로 정해 둔 범위의 IP 주소이며 공용 인터넷에서 직접 라우팅하지 않는다. 다른 조직도 같은 범위를 다시 쓸 수 있다.",
        ["rfc1918"], ["scene-01"]),
    rel("BA05", "bas:packet", "bas:ip-address", "연관", "core", "출발지·목적지",
        "패킷의 IP 정보에 출발지·목적지 IP 주소가 적힌다. 포트는 IP 정보가 아니라 그 안의 TCP 정보에 있다.", ["rfc791"], ["scene-02"]),
    rel("BA06", "bas:ip", "bas:packet", "역할", "core", "목적지까지 전달",
        "IP는 목적지 주소를 보고 패킷을 네트워크 사이로 전달한다. 도착과 순서를 보장하지는 않는다.", ["rfc791"], ["scene-02"]),
    rel("BA07", "bas:protocol", "bas:ip", "연관", "core", "종류 · 주소와 전달",
        "IP는 주소 형식과 패킷 전달을 정한 프로토콜이다. 'IP 주소'의 IP가 이것이다.", ["rfc791"], ["scene-02"]),
    rel("BA08", "bas:protocol", "bas:tcp", "연관", "core", "종류 · 포트와 신뢰성",
        "TCP는 포트로 프로그램을 구분하고 손실 재전송·순서 복원으로 신뢰성 있는 바이트 흐름을 제공하는 프로토콜이다. TCP 정보는 IP 패킷에 담겨 이동한다.",
        ["rfc9293"], ["scene-02"]),
    rel("BA09", "bas:protocol", "bas:http", "연관", "core", "종류 · 요청과 응답",
        "HTTP는 웹 요청·응답의 의미를 정한 프로토콜이다. B3-1 실습에서는 TCP 80 위에서 쓰였고, HTTP/3처럼 TCP를 쓰지 않는 경우도 있다.",
        ["rfc9110"], ["scene-02"]),
    rel("BA10", "bas:tcp", "com:port", "역할", "supplementary", "포트로 서비스 구분",
        "포트 번호는 TCP 정보에 있고, 같은 IP 주소 안에서 어느 프로그램(서비스)으로 갈지 구분한다. B3-1에서 Nginx는 80에서 요청을 받았다.",
        ["rfc9293", "b31-record"], ["scene-02"]),
]

CONTRASTS = [
    {"id": "CB01", "title": "공인 IP ≠ Public Subnet", "nodeIds": ["com:public-ip", "aws:subnet"], "scope": "aws",
     "storyScenes": ["scene-03b"], "noLineReason": "주소의 종류와 Subnet의 경로 기준은 다른 개념이다.",
     "explanation": "Public Subnet은 IGW로 가는 직접 경로가 있는 Route Table에 연결된 Subnet이다. 그 안의 EC2도 사설 IP를 가지며, "
                    "IPv4 인터넷 접속에는 공인 IP·경로·Security Group 허용·서버 수신이 함께 필요하다."},
    {"id": "CB02", "title": "IP ≠ TCP ≠ HTTP", "nodeIds": ["bas:ip", "bas:tcp", "bas:http"], "scope": "basics",
     "storyScenes": ["scene-02"], "noLineReason": "같은 일을 하는 셋이 아니라 한 통신에서 역할을 나눠 겹쳐 쓴다. 서로 잇는 선은 그리지 않는다.",
     "explanation": "IP는 주소를 보고 패킷을 전달하고, TCP는 포트와 신뢰성을, HTTP는 웹 요청·응답의 의미를 맡는다. "
                    "B3-1에서는 HTTP 내용이 TCP 80 정보에, TCP 정보가 IP 패킷에 담겨 이동했다."},
    {"id": "CB03", "title": "IP 주소 ≠ 포트", "nodeIds": ["bas:ip-address", "com:port"], "scope": "basics",
     "storyScenes": ["scene-02"], "noLineReason": "선을 그으면 포트가 IP 주소의 일부처럼 읽힌다.",
     "explanation": "IP 주소는 기기(인터페이스)를, 포트는 그 기기 안의 프로그램을 가리킨다. 포트는 IP 정보가 아니라 TCP·UDP 정보다."},
]

LEARNING = [
    {"id": "L5", "first": "IP 주소와 패킷(네트워크 기초 보기)", "then": "공인·사설 주소와 NAT·IGW의 주소 변환",
     "firstRefs": ["BA05", "BA03", "BA04"], "thenRefs": ["GN18", "AW10", "SH01"], "usedIn": "기초 주소 노드 선택 시 안내"},
    {"id": "L6", "first": "IP·TCP·HTTP의 역할 구분", "then": "Security Group의 TCP 80 허용과 Nginx의 HTTP 응답",
     "firstRefs": ["CB02", "BA10"], "thenRefs": ["AW13", "AW14"], "usedIn": "프로토콜 노드 선택 시 안내"},
]


REGION_ADDRESS = {"id": "bas-address", "domain": "basics", "label": "기초 · 주소와 구역",
                  "description": "네트워크·서브넷·IP 주소처럼 '어디로'를 정하는 개념"}
REGION_PROTOCOL = {"id": "bas-protocol", "domain": "basics", "label": "기초 · 패킷과 프로토콜",
                   "description": "데이터 조각과 그것을 주고받는 약속"}
REGION_ROLES = {"id": "bas-roles", "domain": "basics", "label": "기초 · IP·TCP·HTTP의 역할",
                "description": "한 통신에서 역할을 나눠 겹쳐 쓰는 세 프로토콜"}


def phase2(base, order, split_roles=False):
    d = phase1(base)
    d["domains"]["basics"] = "네트워크 기초 개념(주소·패킷·프로토콜). 특정 장면의 설정값이 아니며 B3-1 적용 위치는 appliedIn으로 잇는다"
    d["relationScopes"]["basics"] = "기초 개념 관계. 끝점은 basics 또는 보기에 포함한 common 노드"
    d["sources"] += SOURCES
    d["regions"] += [{**REGION_ADDRESS, "order": order[0]}, {**REGION_PROTOCOL, "order": order[1]}]
    if split_roles:
        d["regions"].append({**REGION_ROLES, "order": order[2]})
    d["views"].append({"id": "basics", "label": "네트워크 기초", "default": False, "nodeDomains": ["basics"],
                       "sharedNodeIds": ["com:public-ip", "com:private-ip", "com:port"],
                       "relationScopes": ["basics"], "initialImportance": ["core", "supplementary"],
                       "description": "주소와 프로토콜 기초. 공통 주소·포트 노드를 함께 보이고, AWS 적용은 상세 패널 링크로 연다"})
    nodes = copy.deepcopy(NODES)
    if split_roles:
        for n in nodes:
            if n["id"] in ("bas:ip", "bas:tcp", "bas:http"):
                n["region"] = "bas-roles"
    d["nodes"] += nodes
    d["relations"] += copy.deepcopy(RELATIONS)
    d["contrasts"] += copy.deepcopy(CONTRASTS)
    d["learningOrder"] += copy.deepcopy(LEARNING)
    # subnet 직접 연결은 일반 정의 노드가 소유하고, AWS 노드는 보조 연결로 둔다(설계 문서 §4.3 권장안).
    s = node(d, "aws:subnet")
    s["termIds"] = ["public-subnet"]
    s["relatedTermIds"] = ["subnet"]
    node(d, "gen:zone-subnets")["termIdNote"] = "subnet 직접 연결은 bas:subnet이 소유한다. 이 일반망 예시 노드는 relatedTermIds로만 연결한다."
    return d


def main():
    base = json.load(open(SOURCE, encoding="utf-8"))
    os.makedirs(OUT, exist_ok=True)
    outputs = {"phase1.json": phase1(base), "candidate-A.json": phase2(base, (0, 9)), "candidate-B.json": phase2(base, (7, 8)),
               "candidate-C.json": phase2(base, (7, 8, 9), True), "candidate-D.json": phase2(base, (0, 8, 9), True)}
    for name, d in outputs.items():
        with open(os.path.join(OUT, name), "w", encoding="utf-8") as f:
            json.dump(d, f, ensure_ascii=False, indent=2)
            f.write("\n")
        print(f"{name}: 노드 {len(d['nodes'])} · 관계 {len(d['relations'])} · 보기 {len(d['views'])} · 비교 {len(d['contrasts'])}")


if __name__ == "__main__":
    main()
