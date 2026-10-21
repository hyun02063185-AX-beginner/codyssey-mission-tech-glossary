"""Scene 01 (일반 기업 네트워크 전체 구조도) 데스크톱·모바일 SVG 생성기.

두 그림은 아래 NODES·LINKS·FLOW_A 한 벌에서 만든다. 배치만 다르고 구역·장비·연결·흐름은 같다.
각 요소에 data-node / data-link / data-flow 속성을 붙여 check.cjs가 두 그림의 관계를 비교한다.
생성된 SVG는 <text>를 그대로 두므로 생성기 없이 직접 편집해도 된다.

실행: python3 -I build.py  (출력: ../enterprise-network-desktop.svg, ../enterprise-network-mobile.svg)
"""
import os

OUT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# ── 공통 사실 ─────────────────────────────────────────────
ZONES = {
    "out":   ("1", "회사 밖 · 인터넷"),
    "edge":  ("2", "경계 · 회사망의 출입구"),
    "dmz":   ("3", "공개 서비스 구역 (DMZ)"),
    "store": ("4", "자료 저장 구역"),
    "inner": ("5", "내부 업무망"),
}
SUBNET = {"dmz": "172.16.10.0/24", "store": "10.20.30.0/24", "inner": "192.168.10.0/24"}
ZONE_NOTE = {
    "dmz": "외부에 공개하는 서버만 둠",
    "store": "외부 공개 안 함 · 중요 자료",
    "inner": "직원 전용 · 외부 공개 안 함",
}
NODES = {  # id: (zone, 이름, 보조 설명, 아이콘)
    "visitor":  ("out",   "외부 방문자", "PC·스마트폰", "visitor"),
    "internet": ("out",   "인터넷", "", "cloud"),
    "router":   ("edge",  "경계 라우터", "경로 선택", "router"),
    "fw":       ("edge",  "방화벽", "", "firewall"),
    "sw_dmz":   ("dmz",   "스위치", "", "switch"),
    "web":      ("dmz",   "공개 웹 서버", "172.16.10.10", "server"),
    "sw_store": ("store", "스위치", "", "switch"),
    "db":       ("store", "DB 서버", "글·게시 상태", "db"),
    "files":    ("store", "파일 저장소", "이미지 파일", "folder"),
    "sw_inner": ("inner", "스위치", "", "switch"),
    "mgmt":     ("inner", "내부 관리 서버", "게시 관리 화면", "server"),
    "pc":       ("inner", "직원 PC", "업무용", "pc"),
}
LINKS = [
    ("visitor", "internet"), ("internet", "router"), ("router", "fw"),
    ("fw", "sw_dmz"), ("sw_dmz", "web"),
    ("fw", "sw_store"), ("sw_store", "db"), ("sw_store", "files"),
    ("fw", "sw_inner"), ("sw_inner", "mgmt"), ("sw_inner", "pc"),
]
FLOW_A = ["visitor", "internet", "router", "fw", "sw_dmz", "web"]  # A1~A5: 방문자의 요청

# ── 공통 스타일 ───────────────────────────────────────────
FONT = "var(--font-body, 'Pretendard VF', 'Apple SD Gothic Neo', 'Malgun Gothic', 'Noto Sans CJK KR', system-ui, sans-serif)"
STYLE = """
      .bg { fill: #ffffff; }
      .t { fill: #18241f; }
      .s { fill: #4a5c52; }
      .b { font-weight: 700; }
      .m { font-family: ui-monospace, SFMono-Regular, Consolas, 'Liberation Mono', monospace; }
      .card  { fill: #ffffff; stroke: #8fa89b; stroke-width: 1.5; }
      .zOut   { fill: #f1f2f4; stroke: #868e96; stroke-width: 1.5; }
      .zEdge  { fill: #e0efe3; stroke: #1d4d42; stroke-width: 2; }
      .zDmz   { fill: #fff6e0; stroke: #a8741a; stroke-width: 1.5; }
      .zStore { fill: #e9eefb; stroke: #4a5fa8; stroke-width: 1.5; }
      .zInner { fill: #eef5ef; stroke: #5d8a6e; stroke-width: 1.5; }
      .company { fill: none; stroke: #18241f; stroke-width: 3.5; }
      .fwbox { fill: #ffffff; stroke: #1d4d42; stroke-width: 2.4; }
      .link { stroke: #6b7d73; stroke-width: 2.5; fill: none; }
      .port { fill: #6b7d73; stroke: #ffffff; stroke-width: 1.5; }
      .flowA { stroke: #0f4c3a; stroke-width: 4; fill: none; }
      .badgeA { fill: #0f4c3a; }
      .badgeT { fill: #ffffff; font-weight: 700; }
      .tag  { fill: #ffffff; stroke: #1d4d42; stroke-width: 1.5; }
      .tagT { fill: #1d4d42; font-weight: 700; }
      .allowP { fill: #1d4d42; }
      .allowT { fill: #ffffff; font-weight: 700; }
      .denyP  { fill: #ffffff; stroke: #9a2f2f; stroke-width: 1.8; stroke-dasharray: 3 2; }
      .denyT  { fill: #9a2f2f; font-weight: 700; }
      .info { fill: #ffffff; stroke: #8fa89b; stroke-width: 1.5; }
"""
ZONE_CLASS = {"out": "zOut", "edge": "zEdge", "dmz": "zDmz", "store": "zStore", "inner": "zInner"}
ZONE_STROKE = {"out": "#868e96", "edge": "#1d4d42", "dmz": "#a8741a", "store": "#4a5fa8", "inner": "#5d8a6e"}

ICON_G = '<g transform="translate({x},{y})" stroke="#3d4f45" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round">{body}</g>'
ICONS = {
    "pc": '<rect x="3" y="5" width="26" height="17" rx="2" fill="#fff"/><path d="M16 22v5M9 28h14" fill="none"/>',
    "visitor": '<rect x="0" y="6" width="22" height="15" rx="2" fill="#fff"/><path d="M11 21v4M6 26h10" fill="none"/>'
               '<rect x="24" y="5" width="10" height="20" rx="2.5" fill="#fff"/><path d="M27.5 21.5h3" fill="none"/>',
    "router": '<circle cx="16" cy="16" r="12" fill="#fff"/><path d="M16 7v18M7 16h18" fill="none"/>'
              '<path d="M16 5l-3 4.5h6zM16 27l-3-4.5h6zM5 16l4.5-3v6zM27 16l-4.5-3v6z" fill="#3d4f45"/>',
    "firewall": '<rect x="3" y="5" width="26" height="22" rx="2" fill="#f6d9b8"/>'
                '<path d="M3 12.3h26M3 19.7h26M16 5v7.3M9.5 12.3v7.4M22.5 12.3v7.4M16 19.7V27" fill="none"/>',
    "switch": '<rect x="2" y="9" width="28" height="14" rx="3" fill="#fff"/><path d="M7 15v5M13 15v5M19 15v5M25 15v5" fill="none"/>',
    "server": '<rect x="4" y="3" width="24" height="11" rx="2" fill="#fff"/><rect x="4" y="17" width="24" height="11" rx="2" fill="#fff"/>'
              '<circle cx="9" cy="8.5" r="1.4" fill="#3d4f45" stroke="none"/><circle cx="9" cy="22.5" r="1.4" fill="#3d4f45" stroke="none"/>'
              '<path d="M14 8.5h10M14 22.5h10" fill="none"/>',
    "db": '<path d="M5 8c0-3.2 22-3.2 22 0v16c0 3.2-22 3.2-22 0z" fill="#fff"/><path d="M5 8c0 3.2 22 3.2 22 0M5 16c0 3.2 22 3.2 22 0" fill="none"/>',
    "folder": '<path d="M3 8h9l3 3h14v16H3z" fill="#fff"/><path d="M3 14h26" fill="none"/>',
}
CLOUD = '<path d="M{x0} {y1}a{r1} {r1} 0 0 1 {a} -{b}a{r2} {r2} 0 0 1 {c} -{d}a{r3} {r3} 0 0 1 {e} {f}a{r1} {r1} 0 0 1 {g} {h}z" fill="#ffffff" stroke="#3d4f45" stroke-width="2"/>'


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def tw(s, size):
    """대략적인 글자 폭(렌더링 검사로 다시 확인한다)."""
    w = 0.0
    for ch in s:
        if ord(ch) > 0x2E80:
            w += size * 0.98
        elif ch in " ·.:/()":
            w += size * 0.33
        else:
            w += size * 0.58
    return w


class Svg:
    def __init__(self, w, h, title, desc, fid):
        self.w, self.h, self.out = w, h, []
        self.head = (
            f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" role="img" '
            f'aria-labelledby="{fid}T {fid}D" font-family="{FONT}">\n'
            f'  <title id="{fid}T">{esc(title)}</title>\n  <desc id="{fid}D">{esc(desc)}</desc>\n'
            f'  <defs>\n    <style>{STYLE}    </style>\n'
            '    <marker id="arrA" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="13" markerHeight="13" '
            'markerUnits="userSpaceOnUse" orient="auto"><path d="M0 0L10 5L0 10z" fill="#0f4c3a"/></marker>\n'
            '  </defs>\n'
            f'  <rect class="bg" x="0" y="0" width="{w}" height="{h}"/>\n'
        )

    def add(self, s):
        self.out.append("  " + s)

    def comment(self, s):
        self.out.append(f"\n  <!-- {s} -->")

    def text(self, x, y, s, size, cls="t", anchor=None, extra=""):
        a = f' text-anchor="{anchor}"' if anchor else ""
        self.add(f'<text x="{x:g}" y="{y:g}" font-size="{size}" class="{cls}"{a}{extra}>{esc(s)}</text>')

    def icon(self, kind, x, y):
        self.add(ICON_G.format(x=f"{x:g}", y=f"{y:g}", body=ICONS[kind]))

    def zone(self, key, x, y, w, h, size, sub_size, header_lines):
        """구역 면 + 번호 칩 + 이름. header_lines: [(text, size, cls, mono_suffix)]"""
        num = ZONES[key][0]
        self.add(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="14" class="{ZONE_CLASS[key]}" data-zone="{key}"/>')
        cx, cy = x + 12, y + 12
        self.add(f'<rect x="{cx}" y="{cy}" width="24" height="24" rx="6" fill="#ffffff" stroke="{ZONE_STROKE[key]}" stroke-width="2"/>')
        self.text(cx + 12, cy + 18, num, 16, "t b", "middle")
        ty = cy + 18
        for i, (s, sz, cls, mono) in enumerate(header_lines):
            tx = cx + 34 if i == 0 else cx
            if mono:
                self.add(f'<text x="{tx:g}" y="{ty:g}" font-size="{sz}" class="{cls}">{esc(s)}'
                         f'<tspan dx="10" font-size="{sub_size}" class="s m" font-weight="400">{esc(mono)}</tspan></text>')
            else:
                self.text(tx, ty, s, sz, cls)
            ty += sz + 8

    def card(self, nid, x, y, w, h, size, sub_size, layout="row"):
        _, name, sub, icon = NODES[nid]
        self.add(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" class="card" data-node="{nid}"/>')
        if layout == "row":
            self.icon(icon, x + 8, y + (h - 32) / 2)
            if sub:
                self.text(x + 46, y + h / 2 - 4, name, size, "t b")
                self.text(x + 46, y + h / 2 + sub_size + 2, sub, sub_size, "s m" if sub[0].isdigit() else "s")
            else:
                self.text(x + 46, y + h / 2 + size * 0.36, name, size, "t b")
        else:  # 아이콘 위, 글자 아래 가운데
            cx = x + w / 2
            self.icon(icon, cx - 16, y + 10)
            self.text(cx, y + 62, name, size, "t b", "middle")
            if sub:
                self.text(cx, y + 62 + sub_size + 8, sub, sub_size, "s", "middle")

    def switch(self, nid, x, y, w, h, size):
        self.add(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" class="card" data-node="{nid}"/>')
        self.icon("switch", x + w / 2 - 16, y + h / 2 - 26)
        self.text(x + w / 2, y + h / 2 + 22, "스위치", size, "t b", "middle")

    def cloud(self, x, y, w, h, size):
        # 단순한 구름 모양: 바닥선 + 세 개의 호
        cx, base = x + w / 2, y + h - 6
        d = (f"M{x + 8:g} {base:g}"
             f"C{x - 4:g} {base:g} {x - 2:g} {y + h * 0.45:g} {x + w * 0.2:g} {y + h * 0.45:g}"
             f"C{x + w * 0.22:g} {y + 4:g} {x + w * 0.62:g} {y:g} {x + w * 0.68:g} {y + h * 0.3:g}"
             f"C{x + w + 4:g} {y + h * 0.26:g} {x + w + 6:g} {base:g} {x + w - 8:g} {base:g}Z")
        self.add(f'<path d="{d}" fill="#ffffff" stroke="#3d4f45" stroke-width="2" data-node="internet"/>')
        self.text(cx, base - 14, "인터넷", size, "t b", "middle")

    def link(self, a, b, pts):
        d = "M" + " L".join(f"{px:g} {py:g}" for px, py in pts)
        self.add(f'<path d="{d}" class="link" data-link="{a}-{b}"/>')
        for px, py in (pts[0], pts[-1]):
            self.add(f'<circle cx="{px:g}" cy="{py:g}" r="4.6" class="port"/>')

    def flow(self, i, pts, badge, size=15):
        a, b = FLOW_A[i - 1], FLOW_A[i]
        d = "M" + " L".join(f"{px:g} {py:g}" for px, py in pts)
        self.add(f'<path d="{d}" class="flowA" marker-end="url(#arrA)" data-flow="A{i}" data-from="{a}" data-to="{b}"/>')
        bx, by = badge
        self.add(f'<circle cx="{bx:g}" cy="{by:g}" r="13" class="badgeA"/>')
        self.text(bx, by + size * 0.36, f"A{i}", size, "badgeT", "middle")

    def tag(self, x, y, s, size, h=26):
        w = tw(s, size) + 18
        self.add(f'<rect x="{x:g}" y="{y:g}" width="{w:.1f}" height="{h}" rx="{h / 2:g}" class="tag"/>')
        self.text(x + w / 2, y + h / 2 + size * 0.36, s, size, "tagT", "middle")
        return w

    def pill(self, x, y, allow, size):
        cls, tcls = ("allowP", "allowT") if allow else ("denyP", "denyT")
        self.add(f'<rect x="{x:g}" y="{y:g}" width="56" height="24" rx="12" class="{cls}"/>')
        if allow:
            self.add(f'<path d="M{x + 9:g} {y + 12:g} l3.2 3.4 l6 -6.6" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>')
        else:
            self.add(f'<path d="M{x + 10:g} {y + 8:g} l7 8 M{x + 17:g} {y + 8:g} l-7 8" stroke="#9a2f2f" stroke-width="2.2" fill="none" stroke-linecap="round"/>')
        self.text(x + 25, y + 12 + size * 0.36, "허용" if allow else "차단", size, tcls)

    def save(self, name):
        with open(os.path.join(OUT, name), "w", encoding="utf-8") as f:
            f.write(self.head + "\n".join(self.out) + "\n</svg>\n")


DESC = (
    "설명용 일반 기업 네트워크 예시이며 모든 기업의 표준 배치가 아니고 실제 B3-1(AWS) 구성도 아니다. "
    "구역은 다섯 개다. 1 회사 밖 인터넷에는 외부 방문자(PC·스마트폰)와 인터넷이 있다. "
    "굵은 테두리 안이 회사 네트워크이며, 2 경계 구역에는 경계 라우터와 방화벽이 있다. "
    "경계 라우터는 인터넷과 회사망을 잇고 경로를 선택한다. 방화벽은 허용·차단을 판단하고 이 예시에서는 구역 사이의 길 안내(라우팅)도 맡는다. "
    "NAT는 방화벽의 인터넷 쪽에서 주소를 바꾸는 기능이다. 들어올 때 공인 주소 203.0.113.10을 웹 서버의 사설 주소 172.16.10.10으로, "
    "나갈 때 직원 PC의 사설 주소를 회사의 공인 주소로 바꾼다. 내부 구역끼리는 바꾸지 않으며, NAT는 허용·차단을 하지 않는다. "
    "방화벽에는 인터넷 쪽, DMZ 쪽, 저장 쪽, 업무망 쪽 연결 지점이 있고 회사 안 세 구역은 각각 방화벽의 자기 연결 지점에만 연결된다. "
    "3 공개 서비스 구역(DMZ, 172.16.10.0/24)에는 스위치와 공개 웹 서버, 4 자료 저장 구역(10.20.30.0/24)에는 스위치와 DB 서버·파일 저장소, "
    "5 내부 업무망(192.168.10.0/24)에는 스위치와 내부 관리 서버·직원 PC가 있다. 스위치는 같은 구역 안 장비를 연결한다. "
    "회색 선은 장비 사이의 실제 연결이며 통신 허용 여부는 방화벽 규칙이 정한다. "
    "초록 실선 화살표는 방문자의 요청 하나만 보여 준다. A1 방문자에서 인터넷, A2 인터넷에서 경계 라우터, A3 경계 라우터에서 방화벽, "
    "A4 방화벽에서 DMZ 스위치, A5 스위치에서 공개 웹 서버로 간다. 방화벽 규칙 예시: 인터넷에서 웹 서버로 웹 80·443만 허용, "
    "인터넷에서 저장 구역, 인터넷에서 업무망, DMZ에서 업무망으로 먼저 연결하는 것은 차단. 응답과 직원 게시, 웹 서버의 DB 조회는 이후 그림에서 다룬다. "
    "IP 주소는 문서용 예시 주소와 사설 주소이다."
)
TITLE = "일반 기업 네트워크는 어떻게 구성될까? (설명용 예시)"


# ── 데스크톱(가로형) ─────────────────────────────────────
def desktop():
    W, H = 1280, 852
    s = Svg(W, H, TITLE + " · 노트북용", DESC, "d1")
    s.comment("제목")
    s.text(24, 40, "일반 기업 네트워크는 어떻게 구성될까?", 26, "t b")
    s.text(24, 70, "공개 웹사이트를 운영하는 회사의 설명용 예시입니다. 모든 기업이 이렇게 구성하지는 않습니다.", 17, "s")

    s.comment("구역: 회사 밖")
    s.zone("out", 16, 118, 302, 178, 18, 16, [(ZONES["out"][1], 18, "t b", None)])
    s.comment("회사 네트워크 경계(굵은 테두리)")
    s.add('<rect x="334" y="96" width="930" height="652" rx="18" class="company" data-zone="company"/>')
    s.add('<rect x="346" y="84" width="232" height="26" fill="#ffffff"/>')
    s.text(354, 104, "회사 네트워크 (기업망 안)", 18, "t b")
    s.comment("구역: 경계")
    s.zone("edge", 350, 124, 466, 608, 18, 16, [(ZONES["edge"][1], 18, "t b", None)])
    s.comment("구역: 회사 안 세 구역")
    s.zone("dmz", 832, 124, 416, 164, 18, 16,
           [(ZONES["dmz"][1], 18, "t b", SUBNET["dmz"]), (ZONE_NOTE["dmz"], 16, "s", None)])
    s.zone("store", 832, 304, 416, 204, 18, 16,
           [(ZONES["store"][1], 18, "t b", SUBNET["store"]), (ZONE_NOTE["store"], 16, "s", None)])
    s.zone("inner", 832, 524, 416, 208, 18, 16,
           [(ZONES["inner"][1], 18, "t b", SUBNET["inner"]), (ZONE_NOTE["inner"], 16, "s", None)])

    Y = 230  # 방문자 → 웹 서버 한 줄
    LANE = Y - 18
    s.comment("실제 연결(회색 선)")
    s.link("visitor", "internet", [(146, Y), (198, Y)])
    s.link("internet", "router", [(306, Y), (404, Y)])
    s.link("router", "fw", [(530, Y), (626, Y)])
    s.link("fw", "sw_dmz", [(806, Y), (916, Y)])
    s.link("sw_dmz", "web", [(992, Y), (1046, Y)])
    s.link("fw", "sw_store", [(806, 432), (916, 432)])
    s.link("sw_store", "db", [(992, 400), (1046, 400)])
    s.link("sw_store", "files", [(992, 466), (1046, 466)])
    s.link("fw", "sw_inner", [(806, 654), (916, 654)])
    s.link("sw_inner", "mgmt", [(992, 620), (1046, 620)])
    s.link("sw_inner", "pc", [(992, 688), (1046, 688)])

    s.comment("장비")
    s.card("visitor", 30, Y - 55, 116, 110, 17, 16, "col")
    s.cloud(198, Y - 46, 108, 86, 17)
    s.card("router", 404, Y - 55, 126, 110, 17, 16, "col")
    s.add(f'<rect x="626" y="156" width="180" height="566" rx="10" class="fwbox" data-node="fw"/>')
    s.switch("sw_dmz", 916, Y - 36, 76, 72, 17)
    s.card("web", 1046, Y - 28, 188, 56, 17, 16)
    s.switch("sw_store", 916, 384, 76, 96, 17)
    s.card("db", 1046, 372, 188, 56, 17, 16)
    s.card("files", 1046, 438, 188, 56, 17, 16)
    s.switch("sw_inner", 916, 606, 76, 96, 17)
    s.card("mgmt", 1046, 592, 188, 56, 17, 16)
    s.card("pc", 1046, 660, 188, 56, 17, 16)

    s.comment("방화벽 안: 이름, 연결 지점, 기능 이름표")
    s.icon("firewall", 640, 168)
    s.text(680, 192, "방화벽", 20, "t b")
    s.text(636, Y + 30, "인터넷 쪽", 16, "s b")
    s.text(796, Y + 30, "DMZ 쪽", 16, "s b", "end")
    s.tag(636, Y + 42, "NAT", 16)
    s.tag(636, 330, "허용·차단 판단", 16)
    s.tag(636, 364, "구역 사이 길 안내", 16)
    s.text(796, 422, "저장 쪽", 16, "s b", "end")
    s.text(716, 500, "구역 사이 연결은", 16, "t", "middle")
    s.text(716, 524, "모두 방화벽을", 16, "t", "middle")
    s.text(716, 548, "거칩니다", 16, "t b", "middle")
    s.text(796, 644, "업무망 쪽", 16, "s b", "end")

    s.comment("NAT 설명 카드(경계 구역 안)")
    s.add('<rect x="366" y="304" width="244" height="222" rx="10" class="info"/>')
    s.tag(380, 316, "NAT", 16)
    s.text(440, 335, "주소 바꾸기", 17, "t b")
    s.text(380, 368, "방화벽의 인터넷 쪽에서", 16, "t")
    s.text(380, 396, "들어올 때 (웹 방문)", 16, "t b")
    s.add('<text x="380" y="419" font-size="15" class="t m">203.0.113.10</text>')
    s.add('<text x="380" y="440" font-size="15" class="t m">→ 172.16.10.10</text>')
    s.text(380, 468, "나갈 때: 직원 PC 주소 →", 16, "t")
    s.text(380, 490, "회사 공인 주소", 16, "t")
    s.text(380, 510, "허용·차단은 하지 않음", 16, "s b")

    s.comment("방화벽 규칙 카드(경계 구역 안)")
    s.add('<rect x="366" y="538" width="244" height="186" rx="10" class="info"/>')
    s.tag(380, 550, "허용·차단 판단", 16)
    s.text(380, 600, "규칙 예시", 17, "t b")
    s.pill(380, 612, True, 15)
    s.text(446, 629, "인터넷 → 웹 서버", 16, "t")
    s.text(446, 649, "웹 80·443만", 16, "s")
    s.pill(380, 660, False, 15)
    s.text(446, 677, "인터넷 → 저장 구역", 16, "t")
    s.text(446, 697, "인터넷 → 업무망", 16, "t")
    s.text(446, 717, "DMZ → 업무망", 16, "t")

    s.comment("방문자의 요청(초록 실선 화살표) A1~A5")
    s.flow(1, [(146, LANE), (198, LANE)], (172, LANE))
    s.flow(2, [(306, LANE), (404, LANE)], (372, LANE))
    s.flow(3, [(530, LANE), (626, LANE)], (578, LANE))
    s.flow(4, [(806, LANE), (916, LANE)], (866, LANE))
    s.flow(5, [(992, LANE), (1046, LANE)], (1019, LANE))

    s.comment("그림 읽는 법")
    s.add('<rect x="16" y="314" width="302" height="418" rx="12" class="info"/>')
    s.text(30, 342, "그림 읽는 법", 18, "t b")
    s.add('<rect x="30" y="360" width="44" height="26" rx="7" class="zDmz"/>')
    s.text(52, 378, "3", 15, "t b", "middle")
    s.text(86, 372, "색 면과 번호 = 구역", 16, "t")
    s.text(86, 392, "(논리적인 경계)", 16, "s")
    s.add('<rect x="30" y="410" width="44" height="26" rx="7" class="company"/>')
    s.text(86, 422, "굵은 테두리 =", 16, "t")
    s.text(86, 442, "회사 네트워크의 경계", 16, "t")
    s.add('<path d="M34 472H70" class="link"/><circle cx="34" cy="472" r="4.6" class="port"/><circle cx="70" cy="472" r="4.6" class="port"/>')
    s.text(86, 468, "회색 선 = 실제 연결", 16, "t")
    s.text(86, 488, "통신 허용은 방화벽 규칙이", 16, "s")
    s.text(86, 508, "따로 정합니다", 16, "s")
    s.add('<path d="M30 540H72" class="flowA" marker-end="url(#arrA)"/>')
    s.text(86, 536, "초록 화살표 = 방문자의", 16, "t")
    s.text(86, 556, "요청 방향, A1→A5 순서", 16, "t")
    s.text(86, 576, "응답은 생략했습니다", 16, "s")
    s.tag(30, 594, "NAT", 15)
    s.text(86, 612, "이름표 = 장비가", 16, "t")
    s.text(86, 632, "맡는 기능", 16, "t")
    s.icon("switch", 36, 650)
    s.text(86, 668, "스위치 = 같은 구역 안", 16, "t")
    s.text(86, 688, "장비를 연결", 16, "t")

    s.comment("단순화와 범위 안내")
    s.text(24, 786, "설명용 예시입니다. 장비의 수와 배치는 기업마다 다릅니다. 라우터·방화벽·NAT를 한 장비가 맡기도 하고, 스위치 한 대를 구역별로 나눠 쓰기도 합니다.", 16, "s")
    s.text(24, 810, "웹 서버의 DB 조회, 직원의 게시처럼 꼭 필요한 구역 사이 연결은 방화벽 규칙으로 따로 허용하며 이후 그림에서 봅니다.", 16, "s")
    s.text(24, 834, "IP는 문서용 예시 주소(203.0.113.x)와 사설 주소입니다. 실제 B3-1(AWS) 구성이 아닙니다.", 16, "s")
    s.save("enterprise-network-desktop.svg")


# ── 모바일(세로형) ───────────────────────────────────────
def mobile():
    W, H = 360, 2274
    s = Svg(W, H, TITLE + " · 휴대전화용", DESC, "m1")
    X, LX = 252, 270  # 연결선 축과 화살표 축
    s.comment("제목")
    s.text(12, 30, "일반 기업 네트워크는", 21, "t b")
    s.text(12, 58, "어떻게 구성될까?", 21, "t b")
    s.text(12, 82, "설명용 예시 · 기업마다 구성이 다릅니다", 14, "s")

    s.comment("그림 읽는 법(먼저 보기)")
    s.add('<rect x="12" y="96" width="336" height="128" rx="12" class="info"/>')
    s.add('<path d="M24 120H58" class="link"/><circle cx="24" cy="120" r="4.6" class="port"/><circle cx="58" cy="120" r="4.6" class="port"/>')
    s.text(70, 125, "회색 선 = 실제 연결", 15, "t")
    s.add('<path d="M22 150H60" class="flowA" marker-end="url(#arrA)"/>')
    s.text(70, 155, "초록 화살표 = 방문자 요청 A1→A5", 15, "t")
    s.add('<rect x="22" y="168" width="38" height="22" rx="6" class="zDmz"/>')
    s.text(70, 185, "색 면과 번호 = 구역", 15, "t")
    s.tag(222, 168, "NAT", 13, 22)
    s.text(278, 185, "= 기능", 15, "t")
    s.add('<rect x="22" y="196" width="38" height="20" rx="6" class="company"/>')
    s.text(70, 212, "굵은 테두리 = 회사 네트워크", 15, "t")

    s.comment("구역: 회사 밖")
    s.zone("out", 12, 238, 336, 212, 16, 14, [(ZONES["out"][1], 16, "t b", None)])

    s.comment("회사 네트워크 경계")
    s.add('<rect x="6" y="466" width="348" height="1240" rx="16" class="company" data-zone="company"/>')
    s.text(18, 492, "회사 네트워크", 15, "t b")
    s.text(18, 512, "(기업망 안)", 14, "s")
    s.comment("구역: 경계")
    s.zone("edge", 12, 526, 336, 384, 16, 14, [("경계 · 출입구", 16, "t b", None)])
    s.comment("구역: DMZ·저장·업무망 (왼쪽 여백은 방화벽에서 내려오는 연결선 자리)")
    s.zone("dmz", 68, 932, 280, 270, 15, 13,
           [("공개 서비스 구역", 15, "t b", None), ("(DMZ)", 15, "t b", SUBNET["dmz"]), ("외부 공개용 서버만", 14, "s", None)])
    s.zone("store", 68, 1218, 280, 230, 15, 13,
           [("자료 저장 구역", 15, "t b", None), (SUBNET["store"], 13, "s m", None), ("외부 공개 안 함", 14, "s", None)])
    s.zone("inner", 68, 1464, 280, 226, 15, 13,
           [("내부 업무망", 15, "t b", None), (SUBNET["inner"], 13, "s m", None), ("직원 전용 · 외부 공개 안 함", 14, "s", None)])

    s.comment("실제 연결(회색 선)")
    s.link("visitor", "internet", [(X, 336), (X, 382)])
    s.link("internet", "router", [(X, 436), (X, 600)])
    s.link("router", "fw", [(X, 656), (X, 690)])
    s.link("fw", "sw_dmz", [(X, 892), (X, 1046)])
    s.link("sw_dmz", "web", [(X, 1110), (X, 1130)])
    s.link("fw", "sw_store", [(52, 892), (52, 1360), (84, 1360)])
    s.link("sw_store", "db", [(160, 1334), (184, 1334)])
    s.link("sw_store", "files", [(160, 1400), (184, 1400)])
    s.link("fw", "sw_inner", [(32, 892), (32, 1606), (84, 1606)])
    s.link("sw_inner", "mgmt", [(160, 1580), (184, 1580)])
    s.link("sw_inner", "pc", [(160, 1646), (184, 1646)])

    s.comment("장비")
    s.card("visitor", 172, 280, 164, 56, 15, 14)
    s.cloud(X - 60, 372, 120, 64, 15)
    s.card("router", 172, 600, 164, 56, 15, 14)
    s.add('<rect x="20" y="690" width="320" height="202" rx="10" class="fwbox" data-node="fw"/>')
    s.switch("sw_dmz", X - 38, 1046, 76, 64, 14)
    s.card("web", 172, 1130, 164, 56, 15, 14)
    s.switch("sw_store", 84, 1312, 76, 96, 15)
    s.card("db", 184, 1306, 156, 56, 15, 14)
    s.card("files", 184, 1372, 156, 56, 15, 14)
    s.switch("sw_inner", 84, 1558, 76, 96, 15)
    s.card("mgmt", 184, 1552, 156, 56, 14, 13)
    s.card("pc", 184, 1618, 156, 56, 15, 14)

    s.comment("방화벽 안")
    s.icon("firewall", 32, 702)
    s.text(72, 726, "방화벽", 18, "t b")
    s.text(X - 10, 712, "인터넷 쪽", 14, "s b", "end")
    s.tag(X - 62, 722, "NAT", 14, 24)
    s.tag(32, 754, "허용·차단 판단", 14, 26)
    s.tag(32, 788, "구역 사이 길 안내", 14, 26)
    s.text(32, 840, "구역 사이 연결은 모두", 14, "t")
    s.text(32, 860, "방화벽을 거칩니다", 14, "t b")
    s.text(X - 10, 882, "DMZ 쪽", 14, "s b", "end")
    s.text(66, 906, "← 왼쪽 두 선: 업무망 쪽 · 저장 쪽", 13, "s b")

    s.comment("방문자의 요청(초록 실선 화살표) A1~A5")
    s.flow(1, [(LX, 336), (LX, 382)], (LX + 26, 358), 14)
    s.flow(2, [(LX, 434), (LX, 600)], (LX + 26, 560), 14)
    s.flow(3, [(LX, 656), (LX, 690)], (LX + 26, 673), 14)
    s.flow(4, [(LX, 892), (LX, 1046)], (LX + 26, 1020), 14)
    s.flow(5, [(LX, 1110), (LX, 1130)], (LX + 26, 1120), 14)

    s.comment("자세히: NAT")
    s.add('<rect x="12" y="1726" width="336" height="176" rx="12" class="info"/>')
    s.tag(24, 1738, "NAT", 14, 24)
    s.text(80, 1756, "주소 바꾸기 · 방화벽의 인터넷 쪽", 15, "t b")
    s.text(24, 1786, "들어올 때 (웹 방문)", 15, "t b")
    s.add('<text x="24" y="1808" font-size="14" class="t m">203.0.113.10 → 172.16.10.10</text>')
    s.text(24, 1836, "나갈 때: 직원 PC 주소 → 회사 공인 주소", 14, "t")
    s.text(24, 1860, "내부 구역끼리는 바꾸지 않습니다", 14, "t")
    s.text(24, 1884, "허용·차단은 하지 않습니다", 14, "s b")

    s.comment("자세히: 방화벽 규칙")
    s.add('<rect x="12" y="1918" width="336" height="186" rx="12" class="info"/>')
    s.tag(24, 1930, "허용·차단 판단", 14, 24)
    s.text(160, 1948, "규칙 예시", 15, "t b")
    s.pill(24, 1966, True, 14)
    s.text(90, 1983, "인터넷 → 웹 서버 (웹 80·443만)", 14, "t")
    s.pill(24, 2004, False, 14)
    s.text(90, 2021, "인터넷 → 저장 구역", 14, "t")
    s.text(90, 2043, "인터넷 → 업무망", 14, "t")
    s.text(90, 2065, "DMZ → 업무망", 14, "t")
    s.text(24, 2092, "필요한 다른 연결은 이후 그림에서 봅니다", 14, "s")

    s.comment("단순화와 범위 안내")
    s.text(12, 2138, "장비 수와 배치는 기업마다 다릅니다.", 14, "s")
    s.text(12, 2160, "라우터·방화벽·NAT를 한 장비가 맡기도 하고", 14, "s")
    s.text(12, 2182, "스위치 한 대를 구역별로 나눠 쓰기도 합니다.", 14, "s")
    s.text(12, 2212, "IP는 문서용 예시·사설 주소입니다.", 14, "s")
    s.text(12, 2234, "실제 B3-1(AWS) 구성이 아닙니다.", 14, "s")
    s.save("enterprise-network-mobile.svg")


if __name__ == "__main__":
    desktop()
    mobile()
    print("written to", OUT)
