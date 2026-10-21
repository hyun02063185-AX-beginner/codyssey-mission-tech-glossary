"""Scene 04 핵심 개념지도 데스크톱·모바일 SVG 생성기.

../concept-map.json(노드·관계·학습 순서의 유일한 원본)을 읽어 그린다. 좌표만 이 파일에 있다.
Scene 01 생성기의 스타일·글자 폭 추정·그리기 도구를 불러 쓴다(../../scene-01/_tools/build.py).

요소 속성(검사기 check.cjs가 읽음)
- 노드: data-node="<노드 ID>" (모바일의 다른 영역에서 다시 가리키는 참조는 data-node="ref:<n>:<노드 ID>" + data-ref-of)
- 포함(영역 겹침): 바깥 영역·안쪽 요소에 data-node, 표식에 data-rel="C1" data-from data-to data-display="nesting"
- 연관·대응 선: data-rel, data-from, data-to(그 선이 실제로 닿는 요소의 data-node)
- 흐름: 구간마다 data-rel="C12" data-seg="1~3" data-from data-to
- IGW–VPC(C5): IGW가 VPC 경계에 걸쳐 붙고 표식에 data-rel="C5" data-display="dock"

실행: python3 -I build.py
"""
import importlib.util
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.dirname(HERE)
_spec = importlib.util.spec_from_file_location(
    "scene01_build", os.path.join(HERE, "..", "..", "scene-01", "_tools", "build.py"))
s1 = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(s1)
tw, esc = s1.tw, s1.esc

DATA = json.load(open(os.path.join(OUT, "concept-map.json"), encoding="utf-8"))
N = {n["id"]: n for n in DATA["nodes"]}
R = {r["id"]: r for r in DATA["relations"]}

EXTRA = """      .nAws  { fill: #ffffff; stroke: #3b5ba9; stroke-width: 2; }
      .nSet  { fill: #eef2fb; stroke: #3b5ba9; stroke-width: 2; }
      .nAddr { fill: #f4f6f5; stroke: #5f6b66; stroke-width: 1.6; }
      .nSoft { fill: #ffffff; stroke: #2f7d55; stroke-width: 2; }
      .nAct  { fill: #f1f2f4; stroke: #868e96; stroke-width: 1.6; }
      .nRole { fill: #f5f0fb; stroke: #6a3d9a; stroke-width: 2; }
      .nRef  { fill: #ffffff; stroke: #7b879c; stroke-width: 1.4; stroke-dasharray: 4 3; }
      .rVpc  { fill: #edf2fd; stroke: #3b5ba9; stroke-width: 2.2; }
      .rSub  { fill: #e6f5ec; stroke: #2f7d55; stroke-width: 1.8; }
      .rEc2  { fill: #f8faff; stroke: #3b5ba9; stroke-width: 1.6; }
      .relA  { stroke: #5f6b66; stroke-width: 2.2; fill: none; stroke-dasharray: 7 5; }
      .cmp   { stroke: #6a3d9a; stroke-width: 3; fill: none; stroke-dasharray: 0.1 7; stroke-linecap: round; }
      .lbl   { fill: #ffffff; stroke: #5f6b66; stroke-width: 1.2; }
      .lblT  { fill: #2f3a35; font-weight: 700; }
      .lblF  { fill: #ffffff; stroke: #0f4c3a; stroke-width: 1.4; }
      .lblFT { fill: #0f4c3a; font-weight: 700; }
      .lblC  { fill: #f5f0fb; stroke: #6a3d9a; stroke-width: 1.4; }
      .lblCT { fill: #4b2a7a; font-weight: 700; }
      .incl  { fill: #ffffff; stroke: #2f5f4a; stroke-width: 1.4; }
      .inclT { fill: #2f5f4a; font-weight: 700; }
      .info  { fill: #ffffff; stroke: #8fa89b; stroke-width: 1.5; }
      .head  { fill: #eef2ef; stroke: #c9d3cd; stroke-width: 1; }
"""
MARKER_D = ('    <marker id="dia" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="11" markerHeight="11" '
            'markerUnits="userSpaceOnUse" orient="auto"><path d="M5 0L10 5L5 10L0 5z" fill="#6a3d9a"/></marker>\n')
NCLASS = {"aws-resource": "nAws", "aws-setting": "nSet", "address": "nAddr", "software": "nSoft", "actor": "nAct", "network-role": "nRole"}
SUB = {  # 노드 상자 안의 짧은 보조 설명(긴 설명은 concept-map.json summary)
    "b31:visitor": "브라우저", "b31:igw": "인터넷 게이트웨이", "b31:public-ipv4": "자동 할당 공인 주소",
    "b31:private-ipv4": "Subnet 범위 사설 주소", "b31:route-table": "규칙표 · 0.0.0.0/0 → IGW",
    "b31:security-group": "허용 규칙 · HTTP 80", "b31:eni": "네트워크 인터페이스", "b31:nginx": "EC2 안에서 실행",
    "role:routing": "라우터·방화벽의 길 안내", "role:access-control": "방화벽의 허용·차단", "role:address-translation": "NAT",
}


class Svg(s1.Svg):
    def __init__(self, *a):
        super().__init__(*a)
        self.head = self.head.replace("    </style>", EXTRA + "    </style>", 1).replace("  </defs>", MARKER_D + "  </defs>", 1)

    def save(self, name):
        with open(os.path.join(OUT, name), "w", encoding="utf-8") as f:
            f.write(self.head + "\n".join(self.out) + "\n</svg>\n")

    def box(self, nid, x, y, w, h, cls="card", rx=8):
        n = f' data-node="{nid}"' if nid else ""
        self.add(f'<rect x="{x:g}" y="{y:g}" width="{w:g}" height="{h:g}" rx="{rx}" class="{cls}"{n}/>')

    def fit(self, H):
        self.head = self.head.replace('height="0"', f'height="{H}"').replace(f'viewBox="0 0 {self.w} 0"', f'viewBox="0 0 {self.w} {H}"')

    def node(self, nid, x, y, w, h, size, sub_size, ref=None, sub=None):
        n = N[nid]
        if ref:
            self.add(f'<rect x="{x:g}" y="{y:g}" width="{w:g}" height="{h:g}" rx="10" class="nRef" data-node="ref:{ref}:{nid}" data-ref-of="{nid}"/>')
            self.text(x + 12, y + h / 2 - 3, n["label"], size, "t b")
            self.text(x + 12, y + h / 2 + sub_size + 1, f"↑ {n['area']} 영역의 노드", sub_size, "s")
            return f"ref:{ref}:{nid}"
        self.add(f'<rect x="{x:g}" y="{y:g}" width="{w:g}" height="{h:g}" rx="10" class="{NCLASS[n["conceptType"]]}" data-node="{nid}"/>')
        sub = SUB.get(nid, "") if sub is None else sub
        if sub:
            self.text(x + 12, y + h / 2 - 3, n["label"], size, "t b")
            self.text(x + 12, y + h / 2 + sub_size + 1, sub, sub_size, "s")
        else:
            self.text(x + 12, y + h / 2 + size * 0.36, n["label"], size, "t b")
        return nid

    def region(self, nid, cls, x, y, w, h):
        self.add(f'<rect x="{x:g}" y="{y:g}" width="{w:g}" height="{h:g}" rx="14" class="{cls}" data-node="{nid}" data-container="1"/>')

    def chip(self, cx, cy, s, size, cls="lbl", tcls="lblT", h=24, extra=""):
        w = tw(s, size) + 18
        self.add(f'<rect x="{cx - w / 2:.1f}" y="{cy - h / 2:g}" width="{w:.1f}" height="{h}" rx="{h / 2:g}" class="{cls}"{extra}/>')
        self.text(cx, cy + size * 0.36, s, size, tcls, "middle")
        return w

    def incl(self, rid, cx, cy, s, size, child, parent):
        """포함 표식(영역 겹침으로 보여 준 관계)"""
        self.chip(cx, cy, s, size, "incl", "inclT", 24,
                  f' data-rel="{rid}" data-from="{parent}" data-to="{child}" data-display="nesting"')

    def rel(self, rid, pts, a, b, label_at=None, size=15):
        r = R[rid]
        cls = "cmp" if r["type"] == "대응" else "relA"
        d = "M" + " L".join(f"{px:g} {py:g}" for px, py in pts)
        mk = ' marker-start="url(#dia)" marker-end="url(#dia)"' if cls == "cmp" else ""
        self.add(f'<path d="{d}" class="{cls}"{mk} data-rel="{rid}" data-from="{a}" data-to="{b}"/>')
        if label_at:
            if cls == "cmp":
                self.chip(*label_at, r["label"], size, "lblC", "lblCT", 24)
            else:
                self.chip(*label_at, r["label"], size, "lbl", "lblT", 24)

    def flow(self, seg, pts, a, b, label=None, label_at=None, size=15):
        d = "M" + " L".join(f"{px:g} {py:g}" for px, py in pts)
        self.add(f'<path d="{d}" class="flowA" marker-end="url(#arrA)" data-rel="C12" data-seg="{seg}" data-from="{a}" data-to="{b}"/>')
        if label:
            self.chip(*label_at, label, size, "lblF", "lblFT", 24)

    def dock(self, cx, cy, size):
        self.chip(cx, cy, R["C5"]["label"], size, "lbl", "lblT", 24,
                  ' data-rel="C5" data-from="b31:igw" data-to="b31:vpc" data-display="dock"')


def desc_text():
    parts = [DATA["question"], "Scene 01~03에서 설명한 기술만 모은 핵심 개념지도다. 2026-10-14 배포 기록 기준이며 현재 AWS 상태가 아니다."]
    parts.append("노드: " + ", ".join(f"{n['label']}({n['summary']})" for n in DATA["nodes"]) + ".")
    for r in DATA["relations"]:
        parts.append(f"{r['id']} {N[r['from']]['label']} — {N[r['to']]['label']}: {r['type']}, {r['label']}. {r['description']}.")
    parts.append("인터넷은 노드가 아니라 요청 경로의 표시다. 학습 순서(지도 밖): " +
                 " / ".join(f"{l['id']} {l['first']} 다음 {l['then']}" for l in DATA["learningOrder"]) + ".")
    return " ".join(parts)


def legend(s, x0, y0, w, mobile=False):
    if mobile:
        s.box(None, x0, y0, w, 212, "info", 12)
        y = y0 + 24
        s.add(f'<rect x="{x0 + 10}" y="{y - 14}" width="38" height="22" rx="6" class="rVpc"/><rect x="{x0 + 18}" y="{y - 9}" width="22" height="12" rx="3" class="rSub"/>')
        s.text(x0 + 58, y + 2, "포함 = 영역 안에 놓임", 14, "t")
        y += 28
        s.add(f'<path d="M{x0 + 10} {y - 4}H{x0 + 48}" class="relA"/>')
        s.text(x0 + 58, y + 1, "연관 = 회색 점선 + 관계 이름", 14, "t")
        y += 28
        s.add(f'<path d="M{x0 + 10} {y - 4}H{x0 + 48}" class="flowA" marker-end="url(#arrA)"/>')
        s.text(x0 + 58, y + 1, "흐름 = 실제 웹 요청", 14, "t")
        y += 28
        s.add(f'<path d="M{x0 + 12} {y - 4}H{x0 + 46}" class="cmp" marker-start="url(#dia)" marker-end="url(#dia)"/>')
        s.text(x0 + 58, y + 1, "대응 ≈ 비슷한 역할 (같은 것 아님)", 14, "t")
        y += 30
        for i, (cls, t) in enumerate([("nAws", "AWS 자원"), ("nSet", "설정(규칙)"), ("nAddr", "주소"), ("nRole", "일반망 역할")]):
            xx, yy = x0 + 10 + (i % 2) * 160, y + (i // 2) * 26
            s.add(f'<rect x="{xx}" y="{yy - 13}" width="22" height="18" rx="5" class="{cls}" data-swatch="1"/>')
            s.text(xx + 30, yy + 1, t, 14, "t")
        y += 52
        s.text(x0 + 10, y + 1, "인터넷 = 요청 경로 표시 (노드 아님)", 14, "s")
        return y0 + 212
    s.box(None, x0, y0, w, 92, "info", 12)
    r1, r2 = y0 + 32, y0 + 70
    s.add(f'<rect x="32" y="{r1 - 19}" width="42" height="26" rx="7" class="rVpc"/><rect x="40" y="{r1 - 14}" width="26" height="16" rx="4" class="rSub"/>')
    s.text(86, r1, "포함 = 영역 안에 놓임", 16, "t")
    s.add(f'<path d="M372 {r1 - 6}H414" class="relA"/>')
    s.text(426, r1, "연관 = 회색 점선 + 관계 이름 (연결·적용·할당…)", 16, "t")
    s.add(f'<path d="M852 {r1 - 6}H894" class="flowA" marker-end="url(#arrA)"/>')
    s.text(906, r1, "흐름 = 실제 웹 요청", 16, "t")
    s.add(f'<path d="M36 {r2 - 6}H72" class="cmp" marker-start="url(#dia)" marker-end="url(#dia)"/>')
    s.text(86, r2, "대응 ≈ 비슷한 역할 (같은 것 아님)", 16, "t")
    for i, (cls, t) in enumerate([("nAws", "AWS 자원"), ("nSet", "설정(규칙)"), ("nAddr", "주소"), ("nRole", "일반망 역할")]):
        xx = 372 + i * 122
        s.add(f'<rect x="{xx}" y="{r2 - 18}" width="28" height="20" rx="6" class="{cls}" data-swatch="1"/>')
        s.text(xx + 36, r2, t, 16, "t")
    s.text(906, r2, "인터넷 = 요청 경로 표시 (노드 아님)", 16, "s")
    return y0 + 92


# ── 데스크톱 ──────────────────────────────────────────────
def desktop():
    W, H = 1280, 990
    s = Svg(W, H, DATA["title"] + " · 노트북용", desc_text(), "d4")
    s.text(24, 44, DATA["title"], 28, "t b")
    s.text(24, 78, "Scene 04 · 핵심 개념지도 — Scene 01~03에서 설명한 기술만 모았습니다 (B3-1 2026-10-14 기록 기준)", 17, "s")
    legend(s, 16, 98, 1248)

    s.comment("C · 일반망에서 배운 역할 (+ 지도 밖 학습 순서)")
    s.box(None, 16, 210, 288, 690, "info", 12)
    s.text(30, 240, "C · 일반망에서 배운 역할", 17, "t b")
    s.text(30, 262, "Scene 01·02에서 본 역할", 16, "s")
    s.node("role:address-translation", 36, 304, 240, 52, 17, 16)
    s.node("role:routing", 36, 426, 240, 52, 17, 16)
    s.node("role:access-control", 36, 576, 240, 52, 17, 16)
    s.text(30, 666, "≈ 기능을 비교할 수 있다는 뜻", 16, "s")
    s.text(30, 688, "(같은 장비·서비스 아님)", 16, "s")
    s.box(None, 30, 712, 260, 170, "head", 10)
    s.text(44, 740, "학습 순서 (지도 밖)", 16, "t b")
    for i, (lid, t) in enumerate([("L1", "Scene 01·02 → 03 대응"), ("L2", "공인·사설 구분 → IGW 변환"), ("L3", "경로 ≠ 허용 → RT·SG")]):
        s.add(f'<text x="44" y="{774 + 32 * i}" font-size="16" data-learning="{lid}"><tspan class="t b">{lid}</tspan><tspan dx="8" class="t">{esc(t)}</tspan></text>')

    s.comment("B · 인터넷에서 어떻게 닿나 (VPC 밖 위쪽 띠 + VPC 안의 설정)")
    s.text(330, 232, "B · 인터넷에서 어떻게 닿나", 17, "t b")

    s.comment("A · 네트워크 안 — 포함은 영역 안에 놓음")
    s.region("b31:vpc", "rVpc", 330, 340, 918, 560)
    s.text(346, 370, "A · VPC 10.0.0.0/16", 17, "t b")
    s.text(346, 392, "네트워크 안에 무엇이 있나", 16, "s")
    s.region("b31:subnet", "rSub", 680, 410, 552, 470)
    s.text(696, 866, "Subnet · Public Subnet 10.0.1.0/24", 16, "t b")
    s.incl("C1", 1158, 410, "VPC 안에 포함", 16, "b31:subnet", "b31:vpc")
    s.region("b31:ec2", "rEc2", 980, 520, 236, 320)
    s.text(996, 546, "EC2", 17, "t b")
    s.text(996, 568, "가상 서버 · t3.micro", 16, "s")
    s.incl("C2", 1146, 520, "Subnet 안에 포함", 16, "b31:ec2", "b31:subnet")

    s.comment("관계선(연관·대응)과 흐름. 선을 먼저 그리고 노드를 위에 그린다")
    s.rel("C15", [(276, 330), (640, 330)], "role:address-translation", "b31:igw", (460, 330), 16)
    s.rel("C13", [(276, 452), (346, 452)], "role:routing", "b31:route-table", (311, 452), 16)
    s.rel("C14", [(276, 602), (346, 602)], "role:access-control", "b31:security-group", (311, 602), 16)
    s.rel("C10", [(800, 314), (800, 259), (900, 259)], "b31:igw", "b31:public-ipv4", (852, 259), 16)
    s.rel("C11", [(1040, 282), (1040, 440)], "b31:public-ipv4", "b31:private-ipv4", (1040, 378), 16)
    s.rel("C7", [(570, 426), (690, 366)], "b31:route-table", "b31:igw", (622, 392), 16)
    s.rel("C6", [(470, 478), (470, 512), (680, 512)], "b31:route-table", "b31:subnet", (580, 512), 16)
    s.rel("C8", [(586, 602), (720, 602)], "b31:security-group", "b31:eni", (652, 602), 16)
    s.rel("C9", [(880, 576), (880, 463), (960, 463)], "b31:eni", "b31:private-ipv4", (920, 463), 16)
    s.rel("C3", [(900, 602), (980, 602)], "b31:eni", "b31:ec2", (940, 602), 16)
    s.flow(1, [(490, 279), (760, 279), (760, 314)], "b31:visitor", "b31:igw", "인터넷 경유", (620, 279), 16)
    s.flow(2, [(780, 366), (780, 576)], "b31:igw", "b31:eni")
    s.flow(3, [(800, 628), (800, 708), (1000, 708)], "b31:eni", "b31:nginx", R["C12"]["label"], (890, 708), 16)

    s.comment("노드")
    s.node("b31:visitor", 330, 256, 160, 46, 17, 16)
    s.node("b31:igw", 640, 314, 180, 52, 17, 16)
    s.dock(878, 340, 16)
    s.node("b31:public-ipv4", 900, 236, 190, 46, 17, 16)
    s.node("b31:route-table", 346, 426, 240, 52, 17, 16)
    s.node("b31:security-group", 346, 576, 240, 52, 17, 16)
    s.node("b31:eni", 720, 576, 180, 52, 17, 16)
    s.node("b31:private-ipv4", 960, 440, 200, 46, 17, 16)
    s.node("b31:nginx", 1000, 680, 200, 56, 17, 16)
    s.incl("C4", 1100, 760, R["C4"]["label"], 16, "b31:nginx", "b31:ec2")

    s.text(24, 934, "인터넷은 노드가 아니라 요청 경로의 표시입니다. 실제 B3-1은 2026-10-14 배포 기록 기준이며 현재 AWS 상태가 아닙니다.", 16, "s")
    s.text(24, 960, "경계 라우터↔IGW, DMZ↔Public Subnet은 같은 것이 아니어서 잇지 않았습니다(Scene 03-A 주의 카드). 자세한 뜻은 Scene 01~03과 기술용어사전에서 봅니다.", 16, "s")
    s.save("concept-map-desktop.svg")


# ── 모바일 ───────────────────────────────────────────────
def mobile():
    W = 360
    s = Svg(W, 0, DATA["title"] + " · 휴대전화용", desc_text(), "m4")
    s.text(12, 30, "B3-1 웹사이트는 무엇이", 20, "t b")
    s.text(12, 56, "연결되어 인터넷에서 열렸을까?", 20, "t b")
    s.text(12, 80, "Scene 04 · 핵심 개념지도 (2026-10-14 기록)", 14, "s")
    y = legend(s, 14, 94, 336, mobile=True) + 18

    s.comment("A · 네트워크 안에 무엇이 있나")
    s.text(12, y + 4, "A · 네트워크 안에 무엇이 있나", 16, "t b")
    a0 = y + 18
    s.region("b31:vpc", "rVpc", 14, a0, 336, 352)
    s.text(24, a0 + 24, "VPC 10.0.0.0/16", 15, "t b")
    s.region("b31:subnet", "rSub", 24, a0 + 40, 312, 300)
    s.text(36, a0 + 64, "Subnet · Public 10.0.1.0/24", 14, "t b")
    s.incl("C1", 282, a0 + 40, "VPC 안에 포함", 14, "b31:subnet", "b31:vpc")
    s.rel("C9", [(156, a0 + 101), (206, a0 + 101)], "b31:eni", "b31:private-ipv4", (181, a0 + 101), 14)
    s.rel("C3", [(96, a0 + 124), (96, a0 + 160)], "b31:eni", "b31:ec2", (128, a0 + 142), 14)
    s.node("b31:eni", 36, a0 + 78, 120, 46, 15, 14, sub="네트워크 IF")
    s.node("b31:private-ipv4", 206, a0 + 78, 118, 46, 14, 14, sub="사설 주소")
    s.region("b31:ec2", "rEc2", 36, a0 + 160, 288, 168)
    s.text(48, a0 + 184, "EC2 · 가상 서버", 14, "t b")
    s.incl("C2", 262, a0 + 160, "Subnet 안에 포함", 14, "b31:ec2", "b31:subnet")
    s.node("b31:nginx", 60, a0 + 220, 240, 52, 15, 14, sub="웹 서버 프로그램 · HTTP 80")
    s.incl("C4", 180, a0 + 300, R["C4"]["label"], 14, "b31:nginx", "b31:ec2")
    y = a0 + 352 + 26

    s.comment("B · 인터넷에서 어떻게 닿나 (A의 노드는 점선 참조로 다시 가리킴)")
    s.text(12, y + 4, "B · 인터넷에서 어떻게 닿나", 16, "t b")
    b0 = y + 20
    L, Rx, cw = 12, 220, 128
    rows = {0: b0, 1: b0 + 80, 2: b0 + 180, 3: b0 + 270, 4: b0 + 360, 5: b0 + 450}
    s.rel("C6", [(76, rows[1]), (76, rows[0] + 46)], "b31:route-table", "ref:b:b31:subnet", (140, rows[0] + 63), 14)
    s.rel("C7", [(L + cw, rows[1] + 23), (180, rows[1] + 23), (180, rows[2] + 12), (Rx, rows[2] + 12)], "b31:route-table", "b31:igw", None)
    s.chip(180, rows[1] + 58, R["C7"]["label"], 14, "lbl", "lblT", 22)
    s.rel("C10", [(Rx, rows[2] + 40), (L + cw, rows[2] + 40)], "b31:igw", "b31:public-ipv4", (180, rows[2] + 40), 14)
    s.rel("C11", [(76, rows[2] + 52), (76, rows[3])], "b31:public-ipv4", "ref:b:b31:private-ipv4", (112, rows[3] - 20), 14)
    s.rel("C8", [(L + cw, rows[4] + 23), (Rx, rows[4] + 23)], "b31:security-group", "ref:b:b31:eni", (174, rows[4] + 23), 14)
    s.flow(1, [(284, rows[1] + 46), (284, rows[2])], "b31:visitor", "b31:igw", "인터넷 경유", (284, rows[1] + 72), 14)
    s.flow(2, [(284, rows[2] + 52), (284, rows[4])], "b31:igw", "ref:b:b31:eni")
    s.flow(3, [(284, rows[4] + 46), (284, rows[5])], "ref:b:b31:eni", "ref:b:b31:nginx", R["C12"]["label"], (284, rows[4] + 68), 14)
    s.node("b31:subnet", L, rows[0], cw, 46, 14, 14, ref="b")
    s.node("b31:route-table", L, rows[1], cw, 46, 14, 14, sub="규칙표")
    s.node("b31:visitor", Rx, rows[1], cw, 46, 14, 14)
    s.node("b31:public-ipv4", L, rows[2], cw, 52, 14, 14, sub="공인 주소")
    s.add(f'<rect x="{Rx}" y="{rows[2]}" width="{cw}" height="52" rx="10" class="nAws" data-node="b31:igw"/>')
    s.text(Rx + 12, rows[2] + 22, "IGW", 15, "t b")
    s.dock(Rx + 64, rows[2] + 40, 14)
    s.node("b31:private-ipv4", L, rows[3], cw, 46, 14, 14, ref="b")
    s.node("b31:security-group", L, rows[4], cw, 46, 14, 14, sub="허용 규칙")
    s.node("b31:eni", Rx, rows[4], cw, 46, 14, 14, ref="b")
    s.node("b31:nginx", Rx, rows[5], cw, 46, 14, 14, ref="b")
    y = rows[5] + 46 + 30

    s.comment("C · 일반망에서 배운 역할과 비교")
    s.text(12, y + 4, "C · 일반망에서 배운 역할과 비교", 16, "t b")
    y += 20
    for rid, aws in [("C13", "b31:route-table"), ("C14", "b31:security-group"), ("C15", "b31:igw")]:
        r = R[rid]
        s.box(None, 14, y, 336, 66, "info", 10)
        s.node(r["from"], 20, y + 10, 128, 46, 14, 14, sub={"role:routing": "라우터·방화벽", "role:access-control": "방화벽", "role:address-translation": "NAT"}[r["from"]])
        refid = s.node(aws, 212, y + 10, 128, 46, 14, 14, ref="c")
        s.rel(rid, [(148, y + 33), (212, y + 33)], r["from"], refid, (180, y + 33), 14)
        y += 74
    s.text(12, y + 10, "≈ 기능을 비교할 수 있다는 뜻 · 같은 장비·서비스 아님", 14, "s")
    y += 28

    s.box(None, 14, y, 336, 118, "head", 10)
    s.text(24, y + 24, "학습 순서 (지도 밖)", 14, "t b")
    for i, (lid, t) in enumerate([("L1", "Scene 01·02 → 03 대응"), ("L2", "공인·사설 구분 → IGW 변환"), ("L3", "경로 ≠ 허용 → Route Table·SG")]):
        s.add(f'<text x="24" y="{y + 52 + 24 * i}" font-size="14" data-learning="{lid}"><tspan class="t b">{lid}</tspan><tspan dx="8" class="t">{esc(t)}</tspan></text>')
    y += 140
    for i, t in enumerate(["인터넷은 요청 경로 표시이며 노드가 아닙니다.", "실제 B3-1은 2026-10-14 기록 기준입니다.",
                           "경계 라우터↔IGW, DMZ↔Public Subnet은", "같은 것이 아니어서 잇지 않았습니다."]):
        s.text(12, y + 22 * i, t, 14, "s")
    H = y + 22 * 4 + 4
    s.fit(H)
    s.save("concept-map-mobile.svg")


if __name__ == "__main__":
    desktop()
    mobile()
    print("written to", OUT)
