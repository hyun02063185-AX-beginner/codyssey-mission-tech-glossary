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
    "dmz": "외부 공개용 서버만",
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


# ── 구름 모양과 선이 실제로 만나는 점 ─────────────────────────
def cloud_geom(x, y, w, h):
    """구름 외곽: 바닥 직선 + 세 개의 3차 곡선. (path d, 곡선 목록, 바닥 y)"""
    base = y + h - 6
    p0 = (x + 8, base)
    c1 = (p0, (x - 4, base), (x - 2, y + h * 0.45), (x + w * 0.2, y + h * 0.45))
    c2 = (c1[3], (x + w * 0.22, y + 4), (x + w * 0.62, y), (x + w * 0.68, y + h * 0.3))
    c3 = (c2[3], (x + w + 4, y + h * 0.26), (x + w + 6, base), (x + w - 8, base))
    d = "M{:g} {:g}".format(*p0) + "".join(
        "C{:g} {:g} {:g} {:g} {:g} {:g}".format(*c[1], *c[2], *c[3]) for c in (c1, c2, c3)) + "Z"
    return d, (c1, c2, c3), base


def _samples(curves, n=4000):
    for p0, p1, p2, p3 in curves:
        for i in range(n + 1):
            t = i / n
            a, b, c, e = (1 - t) ** 3, 3 * (1 - t) ** 2 * t, 3 * (1 - t) * t * t, t ** 3
            yield (a * p0[0] + b * p1[0] + c * p2[0] + e * p3[0], a * p0[1] + b * p1[1] + c * p2[1] + e * p3[1])


def cloud_x_at(curves, yy):
    """가로선 y=yy가 구름 곡선과 만나는 가장 왼쪽·오른쪽 x."""
    xs, prev = [], None
    for p in _samples(curves):
        if prev and (prev[1] - yy) * (p[1] - yy) <= 0 and prev[1] != p[1]:
            xs.append(prev[0] + (p[0] - prev[0]) * (yy - prev[1]) / (p[1] - prev[1]))
        prev = p
    return min(xs), max(xs)


def cloud_top_at(curves, xx):
    """세로선 x=xx가 구름 곡선과 만나는 가장 위 y."""
    ys, prev = [], None
    for p in _samples(curves):
        if prev and (prev[0] - xx) * (p[0] - xx) <= 0 and prev[0] != p[0]:
            ys.append(prev[1] + (p[1] - prev[1]) * (xx - prev[0]) / (p[0] - prev[0]))
        prev = p
    return min(ys)


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

    def text(self, x, y, s, size, cls="t", anchor=None):
        a = f' text-anchor="{anchor}"' if anchor else ""
        self.add(f'<text x="{x:g}" y="{y:g}" font-size="{size}" class="{cls}"{a}>{esc(s)}</text>')

    def mixed(self, x, y, parts):
        """한 줄에 크기·글꼴이 다른 조각: [(text, size, cls)]"""
        dx = ' dx="6"'
        spans = "".join(
            f'<tspan{dx if i else ""} font-size="{sz}" class="{cls}">{esc(t)}</tspan>'
            for i, (t, sz, cls) in enumerate(parts))
        self.add(f'<text x="{x:g}" y="{y:g}">{spans}</text>')

    def icon(self, kind, x, y):
        self.add(ICON_G.format(x=f"{x:g}", y=f"{y:g}", body=ICONS[kind]))

    def zone(self, key, x, y, w, h, lines, chip=24, num_size=16, gap=8):
        """구역 면 + 번호 칩 + 머리글. lines: 줄마다 [(text, size, cls)] 조각 목록. 첫 줄은 칩 오른쪽."""
        self.add(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="14" class="{ZONE_CLASS[key]}" data-zone="{key}"/>')
        cx, cy = x + 12, y + 12
        self.add(f'<rect x="{cx}" y="{cy}" width="{chip}" height="{chip}" rx="6" fill="#ffffff" stroke="{ZONE_STROKE[key]}" stroke-width="2"/>')
        self.text(cx + chip / 2, cy + chip / 2 + num_size * 0.36, ZONES[key][0], num_size, "t b", "middle")
        ty = cy + chip / 2 + lines[0][0][1] * 0.36
        for i, parts in enumerate(lines):
            self.mixed(cx + chip + 10 if i == 0 else cx, ty, parts)
            ty += max(sz for _, sz, _ in parts) + gap

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
            self.icon(icon, cx - 16, y + 12)
            self.text(cx, y + 64, name, size, "t b", "middle")
            if sub:
                self.text(cx, y + 64 + sub_size + 9, sub, sub_size, "s", "middle")

    def switch(self, nid, x, y, w, h, size):
        self.add(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" class="card" data-node="{nid}"/>')
        self.icon("switch", x + w / 2 - 16, y + h / 2 - 26)
        self.text(x + w / 2, y + h / 2 + 22, "스위치", size, "t b", "middle")

    def cloud(self, x, y, w, h, size):
        d, curves, base = cloud_geom(x, y, w, h)
        self.add(f'<path d="{d}" fill="#ffffff" stroke="#3d4f45" stroke-width="2" data-node="internet"/>')
        self.text(x + w / 2, base - 14, "인터넷", size, "t b", "middle")
        return curves, base

    def link(self, a, b, pts):
        d = "M" + " L".join(f"{px:g} {py:g}" for px, py in pts)
        self.add(f'<path d="{d}" class="link" data-link="{a}-{b}"/>')
        for px, py in (pts[0], pts[-1]):
            self.add(f'<circle cx="{px:g}" cy="{py:g}" r="4.6" class="port"/>')

    def flow(self, i, pts, badge, size=15, r=13):
        a, b = FLOW_A[i - 1], FLOW_A[i]
        d = "M" + " L".join(f"{px:g} {py:g}" for px, py in pts)
        self.add(f'<path d="{d}" class="flowA" marker-end="url(#arrA)" data-flow="A{i}" data-from="{a}" data-to="{b}"/>')
        bx, by = badge
        self.add(f'<circle cx="{bx:g}" cy="{by:g}" r="{r}" class="badgeA"/>')
        self.text(bx, by + size * 0.36, f"A{i}", size, "badgeT", "middle")

    def tag(self, x, y, s, size, h=26):
        w = tw(s, size) + 18
        self.add(f'<rect x="{x:g}" y="{y:g}" width="{w:.1f}" height="{h}" rx="{h / 2:g}" class="tag"/>')
        self.text(x + w / 2, y + h / 2 + size * 0.36, s, size, "tagT", "middle")
        return w

    def pill(self, x, y, allow, size, w=56, h=24):
        cls, tcls = ("allowP", "allowT") if allow else ("denyP", "denyT")
        m = y + h / 2
        self.add(f'<rect x="{x:g}" y="{y:g}" width="{w}" height="{h}" rx="{h / 2:g}" class="{cls}"/>')
        if allow:
            self.add(f'<path d="M{x + 9:g} {m:g} l3.2 3.4 l6 -6.6" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>')
        else:
            self.add(f'<path d="M{x + 10:g} {m - 4:g} l7 8 M{x + 17:g} {m - 4:g} l-7 8" stroke="#9a2f2f" stroke-width="2.2" fill="none" stroke-linecap="round"/>')
        self.text(x + 25, m + size * 0.36, "허용" if allow else "차단", size, tcls)

    def save(self, name):
        with open(os.path.join(OUT, name), "w", encoding="utf-8") as f:
            f.write(self.head + "\n".join(self.out) + "\n</svg>\n")


DESC = (
    "설명용 일반 기업 네트워크 예시이며 모든 기업의 표준 배치가 아니고 실제 B3-1(AWS) 구성도 아니다. "
    "구역은 다섯 개다. 1 회사 밖 인터넷에는 외부 방문자(PC·스마트폰)와 인터넷이 있다. "
    "굵은 테두리 안이 회사 네트워크이며, 2 경계 구역에는 경계 라우터와 방화벽이 있다. "
    "경계 라우터는 인터넷과 회사망을 잇고 경로를 선택한다. 방화벽은 허용·차단을 판단하고 이 예시에서는 구역 사이의 길 안내(라우팅)도 맡는다. "
    "NAT는 방화벽의 인터넷 쪽에서 미리 설정한 변환 규칙대로 주소를 바꾸는 기능이다. 들어올 때 공인 주소 203.0.113.10을 웹 서버의 사설 주소 172.16.10.10으로, "
    "나갈 때 직원 PC의 사설 주소를 회사의 공인 주소로 바꾼다. 이 예시에서는 내부 구역 사이에서는 주소를 바꾸지 않는다. NAT는 허용·차단을 하지 않는다. "
    "방화벽에는 인터넷 쪽, DMZ 쪽, 저장 쪽, 업무망 쪽 연결 지점이 있고 회사 안 세 구역은 각각 방화벽의 자기 연결 지점에만 연결된다. "
    "3 공개 서비스 구역(DMZ, 172.16.10.0/24)에는 스위치와 공개 웹 서버, 4 자료 저장 구역(10.20.30.0/24)에는 스위치와 DB 서버·파일 저장소, "
    "5 내부 업무망(192.168.10.0/24)에는 스위치와 내부 관리 서버·직원 PC가 있다. 스위치는 같은 구역 안 장비를 연결한다. "
    "회색 선은 장비 사이의 실제 연결이며 통신 허용을 뜻하지 않는다. 허용 여부는 방화벽 규칙이 정한다. "
    "초록 실선 화살표는 방문자의 요청 하나만 보여 주며 응답은 생략했다. A1 방문자에서 인터넷, A2 인터넷에서 경계 라우터, A3 경계 라우터에서 방화벽, "
    "A4 방화벽에서 DMZ 스위치, A5 스위치에서 공개 웹 서버로 간다. 방화벽 규칙 예시: 인터넷에서 웹 서버로 웹 80·443만 허용. "
    "먼저 연결 시작 차단: 인터넷에서 저장 구역, 인터넷에서 업무망, DMZ에서 업무망으로 연결을 먼저 시작하는 것은 차단한다. "
    "직원 게시와 웹 서버의 DB 조회는 이후 그림에서 다룬다. IP 주소는 문서용 예시 주소와 사설 주소이다."
)
TITLE = "일반 기업 네트워크는 어떻게 구성될까? (설명용 예시)"


# ── 데스크톱(가로형) ─────────────────────────────────────
# 글자: 설명·카드·각주 18, 그 밖 최소 17 → 900px 표시에서 각각 약 12.7px·12.0px
def desktop():
    W, H = 1280, 1096
    s = Svg(W, H, TITLE + " · 노트북용", DESC, "d1")
    s.comment("제목")
    s.text(24, 44, "일반 기업 네트워크는 어떻게 구성될까?", 28, "t b")
    s.text(24, 78, "공개 웹사이트를 운영하는 회사의 설명용 예시입니다. 모든 기업이 이렇게 구성하지는 않습니다.", 18, "s")

    ZH = lambda key: [[(ZONES[key][1], 19, "t b")]]
    ZH2 = lambda key: [[(ZONES[key][1], 19, "t b")], [(SUBNET[key], 17, "s m"), ("· " + ZONE_NOTE[key], 17, "s")]]

    s.comment("구역: 회사 밖")
    s.zone("out", 16, 146, 306, 214, ZH("out"), chip=26, num_size=17)
    s.comment("회사 네트워크 경계(굵은 테두리)")
    s.add('<rect x="338" y="116" width="926" height="842" rx="18" class="company" data-zone="company"/>')
    s.add('<rect x="350" y="102" width="232" height="28" fill="#ffffff"/>')
    s.text(358, 123, "회사 네트워크 (기업망 안)", 19, "t b")
    s.comment("구역: 경계")
    s.zone("edge", 354, 146, 462, 796, ZH("edge"), chip=26, num_size=17)
    s.comment("구역: 회사 안 세 구역")
    s.zone("dmz", 832, 146, 416, 182, ZH2("dmz"), chip=26, num_size=17, gap=9)
    s.zone("store", 832, 344, 416, 256, ZH2("store"), chip=26, num_size=17, gap=9)
    s.zone("inner", 832, 616, 416, 326, ZH2("inner"), chip=26, num_size=17, gap=9)

    Y = 264        # 방문자 → 웹 서버 한 줄(회색 연결선)
    LANE = Y - 22  # 요청 화살표
    CX, CY, CW, CH = 200, 210, 112, 96
    _, curves, _ = cloud_geom(CX, CY, CW, CH)
    cl_lane, cr_lane = cloud_x_at(curves, LANE)
    cl_link, cr_link = cloud_x_at(curves, Y)

    s.comment("실제 연결(회색 선). 구름 쪽 끝은 구름 외곽과 만나는 점")
    s.link("visitor", "internet", [(144, Y), (cl_link, Y)])
    s.link("internet", "router", [(cr_link, Y), (414, Y)])
    s.link("router", "fw", [(544, Y), (630, Y)])
    s.link("fw", "sw_dmz", [(800, Y), (912, Y)])
    s.link("sw_dmz", "web", [(990, Y), (1052, Y)])
    s.link("fw", "sw_store", [(800, 493), (912, 493)])
    s.link("sw_store", "db", [(990, 458), (1052, 458)])
    s.link("sw_store", "files", [(990, 528), (1052, 528)])
    s.link("fw", "sw_inner", [(800, 790), (912, 790)])
    s.link("sw_inner", "mgmt", [(990, 754), (1052, 754)])
    s.link("sw_inner", "pc", [(990, 826), (1052, 826)])

    s.comment("장비")
    s.card("visitor", 28, Y - 60, 116, 120, 18, 17, "col")
    s.cloud(CX, CY, CW, CH, 18)
    s.card("router", 414, Y - 60, 130, 120, 18, 17, "col")
    s.add('<rect x="630" y="176" width="170" height="750" rx="10" class="fwbox" data-node="fw"/>')
    s.switch("sw_dmz", 912, Y - 40, 78, 80, 18)
    s.card("web", 1052, Y - 28, 184, 56, 18, 17)
    s.switch("sw_store", 912, 443, 78, 100, 18)
    s.card("db", 1052, 430, 184, 56, 18, 17)
    s.card("files", 1052, 500, 184, 56, 18, 17)
    s.switch("sw_inner", 912, 740, 78, 100, 18)
    s.card("mgmt", 1052, 726, 184, 56, 18, 17)
    s.card("pc", 1052, 798, 184, 56, 18, 17)

    s.comment("방화벽 안: 이름, 연결 지점, 기능 이름표")
    s.icon("firewall", 644, 190)
    s.text(684, 215, "방화벽", 22, "t b")
    s.text(640, Y + 34, "인터넷 쪽", 17, "s b")
    s.text(790, Y + 34, "DMZ 쪽", 17, "s b", "end")
    s.tag(640, Y + 46, "NAT", 17, 28)
    s.tag(640, 364, "허용·차단 판단", 17, 28)
    s.tag(640, 402, "구역 사이 길 안내", 17, 28)
    s.text(790, 483, "저장 쪽", 17, "s b", "end")
    s.text(715, 610, "구역 사이 연결은", 18, "t", "middle")
    s.text(715, 636, "모두 방화벽을", 18, "t", "middle")
    s.text(715, 662, "거칩니다", 18, "t b", "middle")
    s.text(790, 780, "업무망 쪽", 17, "s b", "end")

    s.comment("NAT 설명 카드(경계 구역 안)")
    s.add('<rect x="370" y="344" width="248" height="346" rx="10" class="info"/>')
    s.tag(384, 358, "NAT", 17, 28)
    s.text(450, 379, "주소 바꾸기", 19, "t b")
    s.text(384, 414, "미리 설정한 규칙대로", 18, "t")
    s.text(384, 438, "방화벽의 인터넷 쪽에서", 18, "t")
    s.text(384, 474, "들어올 때 (웹 방문)", 18, "t b")
    s.add('<text x="384" y="498" font-size="17" class="t m">203.0.113.10</text>')
    s.add('<text x="384" y="520" font-size="17" class="t m">→ 172.16.10.10</text>')
    s.text(384, 556, "나갈 때 (직원 PC)", 18, "t b")
    s.text(384, 580, "→ 회사 공인 주소", 18, "t")
    s.text(384, 616, "이 예시에서는 내부 구역", 18, "t")
    s.text(384, 640, "사이 주소를 바꾸지 않음", 18, "t")
    s.text(384, 674, "허용·차단은 하지 않음", 18, "s b")

    s.comment("방화벽 규칙 카드(경계 구역 안)")
    s.add('<rect x="370" y="704" width="248" height="224" rx="10" class="info"/>')
    w = s.tag(384, 716, "허용·차단 판단", 17, 28)
    s.text(384 + w + 10, 737, "규칙 예시", 18, "t b")
    s.pill(384, 756, True, 17, 64, 26)
    s.text(456, 775, "인터넷 → 웹 서버", 18, "t")
    s.text(456, 799, "웹 80·443만", 17, "s")
    s.pill(384, 816, False, 17, 64, 26)
    s.text(456, 835, "먼저 연결 시작 차단", 18, "denyT")
    s.text(456, 863, "인터넷 → 저장 구역", 18, "t")
    s.text(456, 887, "인터넷 → 업무망", 18, "t")
    s.text(456, 911, "DMZ → 업무망", 18, "t")

    s.comment("방문자의 요청(초록 실선 화살표) A1~A5. A1·A2의 구름 쪽 끝은 구름 외곽과 만나는 점")
    mid = lambda a, b: (a + b - 13) / 2  # 화살촉(13)을 뺀 구간의 가운데
    s.flow(1, [(144, LANE), (cl_lane, LANE)], (mid(144, cl_lane), LANE), 17, 16)
    s.flow(2, [(cr_lane, LANE), (414, LANE)], (375, LANE), 17, 16)  # 경계 구역 테두리(354)와 겹치지 않게
    s.flow(3, [(544, LANE), (630, LANE)], (mid(544, 630), LANE), 17, 16)
    s.flow(4, [(800, LANE), (912, LANE)], (mid(800, 912) + 12, LANE), 17, 16)
    s.flow(5, [(990, LANE), (1052, LANE)], (mid(990, 1052), LANE), 17, 16)

    s.comment("그림 읽는 법")
    s.add('<rect x="16" y="376" width="306" height="566" rx="12" class="info"/>')
    s.text(30, 408, "그림 읽는 법", 19, "t b")
    s.add('<rect x="30" y="428" width="44" height="28" rx="7" class="zDmz"/>')
    s.text(52, 448, "3", 17, "t b", "middle")
    s.text(86, 446, "색 면과 번호 = 구역", 17, "t")
    s.text(86, 469, "(논리적인 경계)", 17, "s")
    s.add('<rect x="30" y="492" width="44" height="28" rx="7" class="company"/>')
    s.text(86, 510, "굵은 테두리 =", 17, "t")
    s.text(86, 533, "회사 네트워크의 경계", 17, "t")
    s.add('<path d="M34 572H70" class="link"/><circle cx="34" cy="572" r="4.6" class="port"/><circle cx="70" cy="572" r="4.6" class="port"/>')
    s.text(86, 568, "회색 선 = 실제 연결", 17, "t")
    s.text(86, 591, "통신 허용을 뜻하지 않음", 17, "s")
    s.text(86, 614, "(허용은 방화벽 규칙)", 17, "s")
    s.add('<path d="M30 650H72" class="flowA" marker-end="url(#arrA)"/>')
    s.text(86, 654, "초록 화살표 = 방문자", 17, "t")
    s.text(86, 677, "요청의 방향, A1→A5", 17, "t")
    s.text(86, 700, "응답은 이 그림에서 생략", 17, "s")
    s.tag(30, 726, "NAT", 17, 26)
    s.text(86, 744, "이름표 = 장비가", 17, "t")
    s.text(86, 767, "맡는 기능", 17, "t")
    s.icon("switch", 36, 788)
    s.text(86, 808, "스위치 = 같은 구역", 17, "t")
    s.text(86, 831, "안 장비를 연결", 17, "t")

    s.comment("단순화와 범위 안내")
    s.text(24, 994, "설명용 예시입니다. 장비의 수와 배치는 기업마다 다릅니다.", 18, "s")
    s.text(24, 1020, "라우터·방화벽·NAT를 한 장비가 맡기도 하고, 스위치 한 대를 구역별로 나눠 쓰기도 합니다.", 18, "s")
    s.text(24, 1046, "웹 서버의 DB 조회, 직원의 게시처럼 꼭 필요한 구역 사이 연결은 방화벽 규칙으로 따로 허용하며 이후 그림에서 봅니다.", 18, "s")
    s.text(24, 1072, "IP는 문서용 예시 주소(203.0.113.x)와 사설 주소입니다. 실제 B3-1(AWS) 구성이 아닙니다.", 18, "s")
    s.save("enterprise-network-desktop.svg")


# ── 모바일(세로형) ───────────────────────────────────────
def mobile():
    W, H = 360, 2410
    s = Svg(W, H, TITLE + " · 휴대전화용", DESC, "m1")
    X, LX = 252, 270  # 연결선 축과 화살표 축
    o = 86            # 범례 아래 그림 전체의 세로 이동량
    s.comment("제목")
    s.text(12, 30, "일반 기업 네트워크는", 21, "t b")
    s.text(12, 58, "어떻게 구성될까?", 21, "t b")
    s.text(12, 82, "설명용 예시 · 기업마다 구성이 다릅니다", 14, "s")

    s.comment("그림 읽는 법(먼저 보기)")
    s.add('<rect x="12" y="96" width="336" height="214" rx="12" class="info"/>')
    s.add('<path d="M24 120H58" class="link"/><circle cx="24" cy="120" r="4.6" class="port"/><circle cx="58" cy="120" r="4.6" class="port"/>')
    s.text(70, 125, "회색 선 = 실제 연결", 15, "t")
    s.text(70, 145, "통신 허용을 뜻하지 않음 (방화벽 규칙이 정함)", 14, "s")
    s.add('<path d="M22 172H60" class="flowA" marker-end="url(#arrA)"/>')
    s.text(70, 177, "초록 화살표 = 방문자 요청 A1→A5", 15, "t")
    s.text(70, 197, "응답은 이 그림에서 생략", 14, "s")
    s.add('<rect x="22" y="212" width="38" height="22" rx="6" class="zDmz"/>')
    s.text(70, 229, "색 면과 번호 = 구역", 15, "t")
    s.tag(222, 212, "NAT", 13, 22)
    s.text(278, 229, "= 기능", 15, "t")
    s.add('<rect x="22" y="244" width="38" height="20" rx="6" class="company"/>')
    s.text(70, 259, "굵은 테두리 = 회사 네트워크", 15, "t")
    s.icon("switch", 25, 270)
    s.text(70, 292, "스위치 = 같은 구역 안 장비 연결", 15, "t")

    s.comment("구역: 회사 밖")
    s.zone("out", 12, 238 + o, 336, 212, [[(ZONES["out"][1], 16, "t b")]])

    s.comment("회사 네트워크 경계")
    s.add(f'<rect x="6" y="{466 + o}" width="348" height="1240" rx="16" class="company" data-zone="company"/>')
    s.text(18, 492 + o, "회사 네트워크", 15, "t b")
    s.text(18, 512 + o, "(기업망 안)", 14, "s")
    s.comment("구역: 경계")
    s.zone("edge", 12, 526 + o, 336, 384, [[("경계 · 출입구", 16, "t b")]])
    s.comment("구역: DMZ·저장·업무망 (왼쪽 여백은 방화벽에서 내려오는 연결선 자리)")
    s.zone("dmz", 68, 932 + o, 280, 270,
           [[("공개 서비스 구역", 15, "t b")], [("(DMZ)", 15, "t b"), (SUBNET["dmz"], 13, "s m")], [("외부 공개용 서버만", 14, "s")]])
    s.zone("store", 68, 1218 + o, 280, 230,
           [[("자료 저장 구역", 15, "t b")], [(SUBNET["store"], 13, "s m")], [("외부 공개 안 함", 14, "s")]])
    s.zone("inner", 68, 1464 + o, 280, 226,
           [[("내부 업무망", 15, "t b")], [(SUBNET["inner"], 13, "s m")], [("직원 전용 · 외부 공개 안 함", 14, "s")]])

    CX, CY, CW, CH = X - 60, 372 + o, 120, 64
    _, curves, base = cloud_geom(CX, CY, CW, CH)
    top_link, top_lane = cloud_top_at(curves, X), cloud_top_at(curves, LX)

    s.comment("실제 연결(회색 선). 구름 쪽 끝은 구름 외곽과 만나는 점")
    s.link("visitor", "internet", [(X, 336 + o), (X, top_link)])
    s.link("internet", "router", [(X, base), (X, 600 + o)])
    s.link("router", "fw", [(X, 656 + o), (X, 690 + o)])
    s.link("fw", "sw_dmz", [(X, 892 + o), (X, 1046 + o)])
    s.link("sw_dmz", "web", [(X, 1110 + o), (X, 1130 + o)])
    s.link("fw", "sw_store", [(52, 892 + o), (52, 1360 + o), (84, 1360 + o)])
    s.link("sw_store", "db", [(160, 1334 + o), (184, 1334 + o)])
    s.link("sw_store", "files", [(160, 1400 + o), (184, 1400 + o)])
    s.link("fw", "sw_inner", [(32, 892 + o), (32, 1606 + o), (84, 1606 + o)])
    s.link("sw_inner", "mgmt", [(160, 1580 + o), (184, 1580 + o)])
    s.link("sw_inner", "pc", [(160, 1646 + o), (184, 1646 + o)])

    s.comment("장비")
    s.card("visitor", 172, 280 + o, 164, 56, 15, 14)
    s.cloud(CX, CY, CW, CH, 15)
    s.card("router", 172, 600 + o, 164, 56, 15, 14)
    s.add(f'<rect x="20" y="{690 + o}" width="320" height="202" rx="10" class="fwbox" data-node="fw"/>')
    s.switch("sw_dmz", X - 38, 1046 + o, 76, 64, 14)
    s.card("web", 172, 1130 + o, 164, 56, 15, 14)
    s.switch("sw_store", 84, 1312 + o, 76, 96, 15)
    s.card("db", 184, 1306 + o, 156, 56, 15, 14)
    s.card("files", 184, 1372 + o, 156, 56, 15, 14)
    s.switch("sw_inner", 84, 1558 + o, 76, 96, 15)
    s.card("mgmt", 184, 1552 + o, 156, 56, 14, 13)
    s.card("pc", 184, 1618 + o, 156, 56, 15, 14)

    s.comment("방화벽 안")
    s.icon("firewall", 32, 702 + o)
    s.text(72, 726 + o, "방화벽", 18, "t b")
    s.text(X - 10, 712 + o, "인터넷 쪽", 14, "s b", "end")
    s.tag(X - 62, 722 + o, "NAT", 14, 24)
    s.tag(32, 754 + o, "허용·차단 판단", 14, 26)
    s.tag(32, 788 + o, "구역 사이 길 안내", 14, 26)
    s.text(32, 840 + o, "구역 사이 연결은 모두", 14, "t")
    s.text(32, 860 + o, "방화벽을 거칩니다", 14, "t b")
    s.text(X - 10, 882 + o, "DMZ 쪽", 14, "s b", "end")
    s.text(66, 906 + o, "← 왼쪽 두 선: 업무망 쪽 · 저장 쪽", 13, "s b")

    s.comment("방문자의 요청(초록 실선 화살표) A1~A5. A1·A2의 구름 쪽 끝은 구름 외곽과 만나는 점")
    s.flow(1, [(LX, 336 + o), (LX, top_lane)], (LX + 26, (336 + o + top_lane) / 2), 14)
    s.flow(2, [(LX, base), (LX, 600 + o)], (LX + 26, 560 + o), 14)
    s.flow(3, [(LX, 656 + o), (LX, 690 + o)], (LX + 26, 673 + o), 14)
    s.flow(4, [(LX, 892 + o), (LX, 1046 + o)], (LX + 26, 1020 + o), 14)
    s.flow(5, [(LX, 1110 + o), (LX, 1130 + o)], (LX + 26, 1120 + o), 14)

    s.comment("자세히: NAT")
    s.add('<rect x="12" y="1812" width="336" height="208" rx="12" class="info"/>')
    s.tag(24, 1824, "NAT", 14, 24)
    s.text(80, 1842, "주소 바꾸기 · 방화벽의 인터넷 쪽", 15, "t b")
    s.text(24, 1872, "미리 설정한 변환 규칙대로 주소를 바꿉니다", 14, "t")
    s.text(24, 1902, "들어올 때 (웹 방문)", 15, "t b")
    s.add('<text x="24" y="1924" font-size="14" class="t m">203.0.113.10 → 172.16.10.10</text>')
    s.text(24, 1952, "나갈 때: 직원 PC 주소 → 회사 공인 주소", 14, "t")
    s.text(24, 1976, "이 예시에서는 내부 구역끼리 주소를 바꾸지 않음", 14, "t")
    s.text(24, 2004, "허용·차단은 하지 않습니다", 14, "s b")

    s.comment("자세히: 방화벽 규칙")
    s.add('<rect x="12" y="2036" width="336" height="222" rx="12" class="info"/>')
    s.tag(24, 2048, "허용·차단 판단", 14, 24)
    s.text(160, 2066, "규칙 예시", 15, "t b")
    s.pill(24, 2084, True, 14)
    s.text(90, 2101, "인터넷 → 웹 서버 (웹 80·443만)", 14, "t")
    s.pill(24, 2122, False, 14)
    s.text(90, 2139, "먼저 연결 시작 차단", 15, "denyT")
    s.text(90, 2163, "인터넷 → 저장 구역", 14, "t")
    s.text(90, 2185, "인터넷 → 업무망", 14, "t")
    s.text(90, 2207, "DMZ → 업무망", 14, "t")
    s.text(24, 2240, "필요한 다른 연결은 이후 그림에서 봅니다", 14, "s")

    s.comment("단순화와 범위 안내")
    s.text(12, 2292, "장비 수와 배치는 기업마다 다릅니다.", 14, "s")
    s.text(12, 2314, "라우터·방화벽·NAT를 한 장비가 맡기도 하고", 14, "s")
    s.text(12, 2336, "스위치 한 대를 구역별로 나눠 쓰기도 합니다.", 14, "s")
    s.text(12, 2366, "IP는 문서용 예시·사설 주소입니다.", 14, "s")
    s.text(12, 2388, "실제 B3-1(AWS) 구성이 아닙니다.", 14, "s")
    s.save("enterprise-network-mobile.svg")


if __name__ == "__main__":
    desktop()
    mobile()
    print("written to", OUT)
