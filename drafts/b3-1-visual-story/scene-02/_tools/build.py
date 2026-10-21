"""Scene 02 (웹사이트 요청과 응답은 어떻게 흐를까?) 데스크톱·모바일 SVG 생성기.

Scene 01 생성기(../../scene-01/_tools/build.py)의 장비·구역 정의와 그리기 도구를 그대로 불러 쓴다.
노트북용은 Scene 01 노트북용과 구역·장비 좌표가 같고, 휴대전화용은 같은 순서·같은 가로 위치에 세로 간격만 넓혔다.
Scene 02에서 더하는 것: 응답(R1~R5, 갈색 점선), 설명 단계(숫자 원 1~8), 단계별 판단 카드, 이번 흐름에 쓰지 않는 구역의 흐림 처리.

실행: python3 -I build.py  (출력: ../request-response-desktop.svg, ../request-response-mobile.svg)
"""
import importlib.util
import os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.dirname(HERE)
_spec = importlib.util.spec_from_file_location(
    "scene01_build", os.path.join(HERE, "..", "..", "scene-01", "_tools", "build.py"))
s1 = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(s1)

ZONES, SUBNET, ZONE_NOTE = s1.ZONES, s1.SUBNET, s1.ZONE_NOTE
cloud_geom, cloud_x_at, cloud_top_at = s1.cloud_geom, s1.cloud_x_at, s1.cloud_top_at

FLOW_R = ["web", "sw_dmz", "fw", "router", "internet", "visitor"]  # R1~R5: 웹 서버의 응답
STEPS = [  # (번호, 제목, 노트북용 설명 줄)
    ("1", "요청 시작", ["브라우저가 공개 주소로 · A1", "(주소는 이미 앎, DNS 생략)"]),
    ("2", "회사 경계 도착", ["인터넷을 지나 · A2"]),
    ("3", "경로 선택", ["도착 주소로 다음 길 · A3"]),
    ("4", "허용 판단", ["방화벽 정책과 비교"]),
    ("5", "주소 변환", ["미리 설정한 NAT 규칙"]),
    ("6", "웹 서버로 전달", ["DMZ 쪽으로 · A4·A5"]),
    ("7", "응답 만들기", ["웹 서버가 홈페이지 내용을"]),
    ("8", "방문자에게 돌아감", ["허용된 연결의 응답 · R1~R5"]),
]

EXTRA_STYLE = """      .flowR { stroke: #7a4a00; stroke-width: 4; fill: none; stroke-dasharray: 9 6; }
      .badgeR { fill: #7a4a00; }
      .step { fill: #ffffff; stroke: #18241f; stroke-width: 2.2; }
      .stepT { fill: #18241f; font-weight: 700; }
"""
MARKER_R = ('    <marker id="arrR" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="13" markerHeight="13" '
            'markerUnits="userSpaceOnUse" orient="auto"><path d="M0 0L10 5L0 10z" fill="#7a4a00"/></marker>\n')
FADE = 0.35


class Svg(s1.Svg):
    def __init__(self, *a):
        super().__init__(*a)
        self.head = self.head.replace("    </style>", EXTRA_STYLE + "    </style>", 1).replace("  </defs>", MARKER_R + "  </defs>", 1)

    def fade_begin(self, why):
        self.comment(why)
        self.add(f'<g opacity="{FADE}" data-faded="true">')

    def fade_end(self):
        self.add("</g>")

    def flow_r(self, i, pts, badge, size=15, half=13):
        a, b = FLOW_R[i - 1], FLOW_R[i]
        d = "M" + " L".join(f"{px:g} {py:g}" for px, py in pts)
        self.add(f'<path d="{d}" class="flowR" marker-end="url(#arrR)" data-flow="R{i}" data-from="{a}" data-to="{b}"/>')
        bx, by = badge
        self.add(f'<rect x="{bx - half:g}" y="{by - half:g}" width="{2 * half}" height="{2 * half}" rx="6" class="badgeR"/>')
        self.text(bx, by + size * 0.36, f"R{i}", size, "badgeT", "middle")

    def step(self, x, y, n, size=17, r=14):
        self.add(f'<circle cx="{x:g}" cy="{y:g}" r="{r}" class="step" data-step="{n}"/>')
        self.text(x, y + size * 0.36, n, size, "stepT", "middle")

    def save(self, name):
        with open(os.path.join(OUT, name), "w", encoding="utf-8") as f:
            f.write(self.head + "\n".join(self.out) + "\n</svg>\n")


DESC = (
    "설명용 일반 기업 네트워크 예시이며 실제 B3-1(AWS) 구성이 아니다. 앞 장면(Scene 01)과 같은 구역과 장비 배치에서 외부 방문자 한 명이 회사의 공개 웹 서버에 접속하는 흐름만 보여 준다. "
    "자료 저장 구역과 내부 업무망은 이번 흐름에 쓰지 않아 흐리게 그렸다. 방문자는 웹 서버의 공인 주소 203.0.113.10을 이미 안다고 가정하고 DNS는 생략했다. "
    "초록 실선은 요청, 갈색 점선은 응답, 회색 선은 장비 사이의 실제 연결이며 통신 허용을 뜻하지 않는다. 숫자 원은 설명 단계다. "
    "1 요청 시작: 방문자 브라우저가 공개 주소로 HTTPS 443 요청을 보낸다(A1 방문자에서 인터넷). "
    "2 회사 경계 도착: 인터넷을 지나 경계 라우터에 도착한다(A2). "
    "3 경로 선택: 경계 라우터가 도착 주소를 보고 다음 길로 방화벽 쪽을 고른다(A3). 방화벽도 구역 사이의 길을 고른다. 경로 선택은 허용 여부를 판단하지 않는다. "
    "4 허용 판단: 방화벽이 정책과 비교한다. 인터넷에서 웹 서버로 가는 HTTPS 443은 허용하고 연결을 기록한다. 규칙에 없으면 차단한다. "
    "5 주소 변환: 미리 설정한 NAT 규칙대로 도착 주소 203.0.113.10을 웹 서버의 사설 주소 172.16.10.10으로 바꾼다. NAT는 허용·차단을 하지 않는다. "
    "4와 5의 처리 순서는 장비와 정책마다 다르다. "
    "6 웹 서버로 전달: 방화벽의 DMZ 쪽에서 스위치를 거쳐 공개 웹 서버로 간다(A4, A5). 7 응답 만들기: 웹 서버가 홈페이지 내용을 응답한다. "
    "8 방문자에게 돌아감: 응답은 R1 웹 서버에서 스위치, R2 스위치에서 방화벽, R3 방화벽에서 경계 라우터, R4 경계 라우터에서 인터넷, R5 인터넷에서 방문자로 간다. "
    "방화벽은 기록된 연결의 응답이므로 통과시키고, NAT는 응답의 출발 주소 172.16.10.10을 203.0.113.10으로 되돌린다. "
    "이는 웹 서버가 인터넷으로 새 연결을 먼저 시작할 수 있다는 뜻이 아니다. 응답이 돌아가는 실제 경로는 기업망마다 다를 수 있다. "
    "일반 기업 예시는 HTTPS 443이며 실제 B3-1 배포 기록의 접속은 HTTP 80이었다. 웹 서버의 DB 조회와 직원 게시는 다른 장면에서 다룬다."
)
TITLE = "웹사이트 요청과 응답은 어떻게 흐를까? (설명용 예시)"


def card_title(s, x, y, n, title, size=19, r=14, msize=17):
    s.step(x + r, y - size * 0.36, n, msize, r)
    s.text(x + 2 * r + 8, y, title, size, "t b")


# ── 데스크톱(가로형): Scene 01 노트북용과 구역·장비 좌표가 같다 ───────────
def desktop():
    W, H = 1280, 1272
    s = Svg(W, H, TITLE + " · 노트북용", DESC, "d2")
    s.comment("제목")
    s.text(24, 44, "웹사이트 요청과 응답은 어떻게 흐를까?", 28, "t b")
    s.text(24, 78, "앞 장면과 같은 회사 네트워크에서 방문자 한 명의 접속을 따라갑니다. 설명용 예시입니다.", 18, "s")

    ZH = lambda key: [[(ZONES[key][1], 19, "t b")]]
    ZH2 = lambda key: [[(ZONES[key][1], 19, "t b")], [(SUBNET[key], 17, "s m"), ("· " + ZONE_NOTE[key], 17, "s")]]

    s.comment("구역(Scene 01과 같은 위치)")
    s.zone("out", 16, 146, 306, 214, ZH("out"), chip=26, num_size=17)
    s.add('<rect x="338" y="116" width="926" height="842" rx="18" class="company" data-zone="company"/>')
    s.add('<rect x="350" y="102" width="232" height="28" fill="#ffffff"/>')
    s.text(358, 123, "회사 네트워크 (기업망 안)", 19, "t b")
    s.zone("edge", 354, 146, 462, 796, ZH("edge"), chip=26, num_size=17)
    s.zone("dmz", 832, 146, 416, 182, ZH2("dmz"), chip=26, num_size=17, gap=9)
    s.fade_begin("이번 흐름에 쓰지 않는 구역(흐리게)")
    s.zone("store", 832, 344, 416, 256, ZH2("store"), chip=26, num_size=17, gap=9)
    s.zone("inner", 832, 616, 416, 326, ZH2("inner"), chip=26, num_size=17, gap=9)
    s.fade_end()

    Y, LANE, RLANE = 264, 242, 286  # 회색 연결선 / 요청 / 응답
    CX, CY, CW, CH = 200, 210, 112, 96
    _, curves, _ = cloud_geom(CX, CY, CW, CH)
    cl_a, cr_a = cloud_x_at(curves, LANE)
    cl_l, cr_l = cloud_x_at(curves, Y)
    cl_r, cr_r = cloud_x_at(curves, RLANE)

    s.comment("실제 연결(회색 선)")
    s.link("visitor", "internet", [(144, Y), (cl_l, Y)])
    s.link("internet", "router", [(cr_l, Y), (414, Y)])
    s.link("router", "fw", [(544, Y), (630, Y)])
    s.link("fw", "sw_dmz", [(800, Y), (912, Y)])
    s.link("sw_dmz", "web", [(990, Y), (1052, Y)])
    s.fade_begin("이번 흐름에 쓰지 않는 연결(흐리게)")
    s.link("fw", "sw_store", [(800, 493), (912, 493)])
    s.link("sw_store", "db", [(990, 458), (1052, 458)])
    s.link("sw_store", "files", [(990, 528), (1052, 528)])
    s.link("fw", "sw_inner", [(800, 790), (912, 790)])
    s.link("sw_inner", "mgmt", [(990, 754), (1052, 754)])
    s.link("sw_inner", "pc", [(990, 826), (1052, 826)])
    s.fade_end()

    s.comment("장비(Scene 01과 같은 위치)")
    s.card("visitor", 28, Y - 60, 116, 120, 18, 17, "col")
    s.cloud(CX, CY, CW, CH, 18)
    s.card("router", 414, Y - 60, 130, 120, 18, 17, "col")
    s.add('<rect x="630" y="176" width="170" height="750" rx="10" class="fwbox" data-node="fw"/>')
    s.switch("sw_dmz", 912, Y - 40, 78, 80, 18)
    s.card("web", 1052, Y - 28, 184, 56, 18, 17)
    s.fade_begin("이번 흐름에 쓰지 않는 장비(흐리게)")
    s.switch("sw_store", 912, 443, 78, 100, 18)
    s.card("db", 1052, 430, 184, 56, 18, 17)
    s.card("files", 1052, 500, 184, 56, 18, 17)
    s.switch("sw_inner", 912, 740, 78, 100, 18)
    s.card("mgmt", 1052, 726, 184, 56, 18, 17)
    s.card("pc", 1052, 798, 184, 56, 18, 17)
    s.text(790, 483, "저장 쪽", 17, "s b", "end")
    s.text(790, 780, "업무망 쪽", 17, "s b", "end")
    s.fade_end()

    s.comment("방화벽 안: 이름, 연결 지점, 기능 이름표(Scene 01과 같음), 이번 장면의 단계 4·5")
    s.icon("firewall", 644, 190)
    s.text(684, 215, "방화벽", 22, "t b")
    s.text(640, Y + 34, "인터넷 쪽", 17, "s b")
    s.text(790, Y + 34, "DMZ 쪽", 17, "s b", "end")
    s.tag(640, Y + 46, "NAT", 17, 28)
    s.tag(640, 364, "허용·차단 판단", 17, 28)
    s.tag(640, 402, "구역 사이 길 안내", 17, 28)
    s.step(656, 574, "4")
    s.text(678, 580, "허용 판단", 18, "t b")
    s.step(656, 614, "5")
    s.text(678, 620, "주소 변환", 18, "t b")
    s.text(715, 664, "4·5의 처리 순서는", 17, "s", "middle")
    s.text(715, 688, "장비·정책마다 다름", 17, "s", "middle")

    s.comment("단계 카드(경계 구역 안)")
    s.add('<rect x="370" y="344" width="248" height="186" rx="10" class="info"/>')
    card_title(s, 384, 375, "3", "경로 선택")
    s.text(384, 406, "도착 주소로 다음 길 선택", 18, "t")
    s.text(384, 429, "경로표 예 (경계 라우터)", 17, "s")
    s.add('<text x="384" y="453" font-size="17" class="t m">203.0.113.0/24</text>')
    s.text(384, 476, "→ 방화벽 쪽", 18, "t")
    s.text(384, 499, "방화벽도 구역 사이 길 안내", 17, "t")
    s.text(384, 521, "허용 여부는 판단 안 함", 17, "s b")

    s.add('<rect x="370" y="542" width="248" height="140" rx="10" class="info"/>')
    card_title(s, 384, 573, "4", "허용 판단 (방화벽)")
    s.text(384, 604, "규칙: 인터넷 → 웹 서버", 18, "t")
    s.text(384, 627, "HTTPS 443 허용", 18, "t")
    s.text(384, 650, "맞으면 통과, 연결 기록", 18, "t")
    s.text(384, 673, "규칙에 없으면 차단", 18, "s")

    s.add('<rect x="370" y="694" width="248" height="232" rx="10" class="info"/>')
    card_title(s, 384, 725, "5", "주소 변환 (NAT)")
    s.text(384, 756, "미리 설정한 규칙대로", 18, "t")
    s.text(384, 779, "요청: 도착 주소", 18, "t b")
    s.add('<text x="384" y="802" font-size="17" class="t m">203.0.113.10</text>')
    s.add('<text x="384" y="824" font-size="17" class="t m">→ 172.16.10.10</text>')
    s.text(384, 849, "응답: 출발 주소", 18, "t b")
    s.add('<text x="384" y="872" font-size="17" class="t m">172.16.10.10</text>')
    s.add('<text x="384" y="894" font-size="17" class="t m">→ 203.0.113.10</text>')
    s.text(384, 917, "허용·차단은 안 함", 17, "s b")

    s.comment("요청(초록 실선) A1~A5 — Scene 01과 같은 위치")
    mid = lambda a, b: (a + b - 13) / 2
    s.flow(1, [(144, LANE), (cl_a, LANE)], (mid(144, cl_a), LANE), 17, 16)
    s.flow(2, [(cr_a, LANE), (414, LANE)], (375, LANE), 17, 16)
    s.flow(3, [(544, LANE), (630, LANE)], (mid(544, 630), LANE), 17, 16)
    s.flow(4, [(800, LANE), (912, LANE)], (mid(800, 912) + 12, LANE), 17, 16)
    s.flow(5, [(990, LANE), (1052, LANE)], (mid(990, 1052), LANE), 17, 16)

    s.comment("응답(갈색 점선) R1~R5 — 회색 연결선 아래 차선, 오른쪽에서 왼쪽으로")
    rmid = lambda a, b: (a + b + 13) / 2  # 화살촉이 왼쪽 끝에 있으므로
    s.flow_r(1, [(1052, RLANE), (990, RLANE)], (rmid(1052, 990), RLANE), 17, 15)
    s.flow_r(2, [(912, RLANE), (800, RLANE)], (868, RLANE), 17, 15)
    s.flow_r(3, [(630, RLANE), (544, RLANE)], (rmid(630, 544), RLANE), 17, 15)
    s.flow_r(4, [(414, RLANE), (cr_r, RLANE)], (384, RLANE), 17, 15)  # 경계 구역 테두리(354)와 겹치지 않게
    s.flow_r(5, [(cl_r, RLANE), (144, RLANE)], (rmid(cl_r, 144), RLANE), 17, 15)

    s.comment("설명 단계 표시(숫자 원) — 장비 모서리")
    s.step(132, 208, "1")
    s.step(132, 320, "8")
    s.step(426, 208, "2")
    s.step(532, 208, "3")
    s.step(982, 226, "6")
    s.step(1222, 238, "7")

    s.comment("단계 목록(왼쪽 열)")
    s.add('<rect x="16" y="376" width="306" height="566" rx="12" class="info"/>')
    s.text(30, 408, "설명 단계", 19, "t b")
    s.text(30, 432, "번호는 설명 순서입니다", 17, "s")
    y = 470
    for n, title, lines in STEPS:
        s.step(44, y - 6, n)
        s.text(66, y, title, 18, "t b")
        for ln in lines:
            y += 22
            s.text(66, y, ln, 17, "s")
        y += 38

    s.comment("그림 읽는 법(아래)")
    s.add('<rect x="16" y="978" width="1248" height="148" rx="12" class="info"/>')
    s.text(32, 1008, "그림 읽는 법", 19, "t b")
    r1, r2 = 1046, 1094
    s.add(f'<path d="M32 {r1 - 6}H74" class="flowA" marker-end="url(#arrA)"/>')
    s.text(88, r1, "초록 실선 = 요청, A1→A5 순서", 17, "t")
    s.add(f'<path d="M440 {r1 - 6}H482" class="flowR" marker-end="url(#arrR)"/>')
    s.text(496, r1, "갈색 점선 = 응답, R1→R5 순서", 17, "t")
    s.add(f'<path d="M852 {r1 - 6}H888" class="link"/><circle cx="852" cy="{r1 - 6}" r="4.6" class="port"/><circle cx="888" cy="{r1 - 6}" r="4.6" class="port"/>')
    s.text(904, r1, "회색 선 = 실제 연결 (통신 허용 아님)", 17, "t")
    s.step(52, r2 - 6, "3")
    s.text(88, r2, "숫자 원 = 설명 단계 (왼쪽 목록)", 17, "t")
    s.add(f'<rect x="440" y="{r2 - 20}" width="42" height="26" rx="7" class="zStore" opacity="{FADE}"/>')
    s.text(496, r2, "흐린 부분 = 이번 흐름에 쓰지 않음", 17, "t")
    s.tag(846, r2 - 19, "NAT", 17, 26)
    s.text(904, r2, "이름표 = 장비가 맡는 기능", 17, "t")

    s.comment("단순화와 범위 안내")
    notes = [
        "설명용 일반 기업망 예시이며 실제 B3-1(AWS) 구성이 아닙니다. 이 예시는 HTTPS 443, 실제 B3-1 배포 기록의 접속은 HTTP 80이었습니다.",
        "방문자는 웹 서버의 공인 주소를 이미 안다고 가정합니다(DNS 생략). 웹 서버의 DB 조회와 직원 게시는 다른 장면에서 다룹니다.",
        "단계 번호는 설명 순서입니다. 3~5의 실제 처리 순서와 장비, 응답이 돌아가는 경로는 장비·기업망마다 다를 수 있습니다.",
        "응답은 허용된 연결의 응답이라 통과합니다. 웹 서버가 인터넷으로 새 연결을 먼저 시작할 수 있다는 뜻이 아닙니다.",
    ]
    for i, t in enumerate(notes):
        s.text(24, 1162 + 26 * i, t, 18, "s")
    s.save("request-response-desktop.svg")


# ── 모바일(세로형): Scene 01 휴대전화용과 같은 순서·가로 위치, 세로 간격만 넓힘 ─────
def mobile():
    W, H = 360, 2626
    s = Svg(W, H, TITLE + " · 휴대전화용", DESC, "m2")
    X, LX, RX = 252, 270, 234  # 연결선 / 요청 / 응답 축
    AB, RB = LX + 26, RX - 26   # 번호 표식의 가로 위치
    s.comment("제목")
    s.text(12, 30, "웹사이트 요청과 응답은", 21, "t b")
    s.text(12, 58, "어떻게 흐를까?", 21, "t b")
    s.text(12, 82, "설명용 예시 · 방문자 한 명의 접속 따라가기", 14, "s")

    s.comment("그림 읽는 법(먼저 보기)")
    s.add('<rect x="12" y="96" width="336" height="212" rx="12" class="info"/>')
    s.add('<path d="M22 118H60" class="flowA" marker-end="url(#arrA)"/>')
    s.text(72, 123, "초록 실선 = 요청 A1→A5", 15, "t")
    s.add('<path d="M22 148H60" class="flowR" marker-end="url(#arrR)"/>')
    s.text(72, 153, "갈색 점선 = 응답 R1→R5", 15, "t")
    s.add('<path d="M24 178H58" class="link"/><circle cx="24" cy="178" r="4.6" class="port"/><circle cx="58" cy="178" r="4.6" class="port"/>')
    s.text(72, 183, "회색 선 = 실제 연결", 15, "t")
    s.text(72, 202, "통신 허용을 뜻하지 않음", 14, "s")
    s.step(41, 226, "3", 14, 12)
    s.text(72, 231, "숫자 원 = 설명 단계", 15, "t")
    s.add(f'<rect x="22" y="246" width="38" height="22" rx="6" class="zStore" opacity="{FADE}"/>')
    s.text(72, 263, "흐린 부분 = 이번 흐름에 안 씀", 15, "t")
    s.tag(22, 276, "NAT", 13, 22)
    s.text(72, 293, "이름표 = 기능", 15, "t")
    s.add('<rect x="186" y="278" width="38" height="20" rx="6" class="zDmz"/>')
    s.text(234, 293, "색 면 = 구역", 15, "t")

    s.comment("구역: 회사 밖")
    s.zone("out", 12, 322, 336, 226, [[(ZONES["out"][1], 16, "t b")]])
    s.comment("회사 네트워크 경계")
    s.add('<rect x="6" y="564" width="348" height="1346" rx="16" class="company" data-zone="company"/>')
    s.text(18, 590, "회사 네트워크", 15, "t b")
    s.text(18, 610, "(기업망 안)", 14, "s")
    s.zone("edge", 12, 624, 336, 440, [[("경계 · 출입구", 16, "t b")]])
    s.zone("dmz", 68, 1080, 280, 326,
           [[("공개 서비스 구역", 15, "t b")], [("(DMZ)", 15, "t b")], [(SUBNET["dmz"], 13, "s m")], [("외부 공개용 서버만", 14, "s")]])
    s.fade_begin("이번 흐름에 쓰지 않는 구역(흐리게)")
    s.zone("store", 68, 1422, 280, 230,
           [[("자료 저장 구역", 15, "t b")], [(SUBNET["store"], 13, "s m")], [("외부 공개 안 함", 14, "s")]])
    s.zone("inner", 68, 1668, 280, 226,
           [[("내부 업무망", 15, "t b")], [(SUBNET["inner"], 13, "s m")], [("직원 전용 · 외부 공개 안 함", 14, "s")]])
    s.fade_end()

    CX, CY, CW, CH = X - 60, 468, 120, 64
    _, curves, base = cloud_geom(CX, CY, CW, CH)
    top_l, top_a, top_r = cloud_top_at(curves, X), cloud_top_at(curves, LX), cloud_top_at(curves, RX)

    s.comment("실제 연결(회색 선)")
    s.link("visitor", "internet", [(X, 422), (X, top_l)])
    s.link("internet", "router", [(X, base), (X, 702)])
    s.link("router", "fw", [(X, 758), (X, 802)])
    s.link("fw", "sw_dmz", [(X, 1034), (X, 1222)])
    s.link("sw_dmz", "web", [(X, 1286), (X, 1330)])
    s.fade_begin("이번 흐름에 쓰지 않는 연결(흐리게)")
    s.link("fw", "sw_store", [(52, 1034), (52, 1564), (84, 1564)])
    s.link("sw_store", "db", [(160, 1538), (184, 1538)])
    s.link("sw_store", "files", [(160, 1604), (184, 1604)])
    s.link("fw", "sw_inner", [(32, 1034), (32, 1810), (84, 1810)])
    s.link("sw_inner", "mgmt", [(160, 1784), (184, 1784)])
    s.link("sw_inner", "pc", [(160, 1850), (184, 1850)])
    s.fade_end()

    s.comment("장비")
    s.card("visitor", 172, 366, 164, 56, 15, 14)
    s.cloud(CX, CY, CW, CH, 15)
    s.card("router", 172, 702, 164, 56, 15, 14)
    s.add('<rect x="20" y="802" width="320" height="232" rx="10" class="fwbox" data-node="fw"/>')
    s.switch("sw_dmz", X - 38, 1222, 76, 64, 14)
    s.card("web", 172, 1330, 164, 56, 15, 14)
    s.fade_begin("이번 흐름에 쓰지 않는 장비(흐리게)")
    s.switch("sw_store", 84, 1516, 76, 96, 15)
    s.card("db", 184, 1510, 156, 56, 15, 14)
    s.card("files", 184, 1576, 156, 56, 15, 14)
    s.switch("sw_inner", 84, 1762, 76, 96, 15)
    s.card("mgmt", 184, 1756, 156, 56, 14, 13)
    s.card("pc", 184, 1822, 156, 56, 15, 14)
    s.fade_end()

    s.comment("방화벽 안")
    s.icon("firewall", 32, 814)
    s.text(72, 838, "방화벽", 18, "t b")
    s.text(326, 828, "인터넷 쪽", 14, "s b", "end")
    w = s.tag(32, 856, "NAT", 14, 24)
    s.step(32 + w + 16, 868, "5", 14, 12)
    w = s.tag(32, 890, "허용·차단 판단", 14, 26)
    s.step(32 + w + 16, 903, "4", 14, 12)
    s.tag(32, 926, "구역 사이 길 안내", 14, 26)
    s.text(326, 872, "4·5의 처리 순서는", 14, "s", "end")
    s.text(326, 892, "장비·정책마다 다름", 14, "s", "end")
    s.text(32, 984, "구역 사이 연결은 모두", 14, "t")
    s.text(32, 1004, "방화벽을 거칩니다", 14, "t b")
    s.text(326, 1024, "DMZ 쪽", 14, "s b", "end")
    s.text(66, 1054, "← 업무망 쪽 · 저장 쪽", 13, "s b")

    s.comment("설명 단계 표시(왼쪽 짧은 이름)")
    for n, label, y in [("1", "요청 시작", 380), ("8", "응답 도착", 412), ("2", "회사 도착", 718), ("3", "경로 선택", 748),
                        ("6", "전달", 1254), ("7", "응답", 1358)]:
        lx = 36 if int(y) < 1080 else 96
        s.step(lx, y, n, 14, 12)
        s.text(lx + 18, y + 5, label, 14, "t b")

    s.comment("요청(초록 실선) A1~A5")
    s.flow(1, [(LX, 422), (LX, top_a)], (AB, (422 + top_a) / 2), 14)
    s.flow(2, [(LX, base), (LX, 702)], (AB, 662), 14)
    s.flow(3, [(LX, 758), (LX, 802)], (AB, 780), 14)
    s.flow(4, [(LX, 1034), (LX, 1222)], (AB, 1200), 14)
    s.flow(5, [(LX, 1286), (LX, 1330)], (AB, 1308), 14)
    s.comment("응답(갈색 점선) R1~R5 — 회색 연결선 왼쪽 차선, 아래에서 위로")
    s.flow_r(1, [(RX, 1330), (RX, 1286)], (RB, 1308), 14, 12)
    s.flow_r(2, [(RX, 1222), (RX, 1034)], (RB, 1200), 14, 12)
    s.flow_r(3, [(RX, 802), (RX, 758)], (RB, 780), 14, 12)
    s.flow_r(4, [(RX, 702), (RX, base)], (RB, 662), 14, 12)
    s.flow_r(5, [(RX, top_r), (RX, 422)], (RB, (422 + top_r) / 2), 14, 12)

    s.comment("자세히: 단계 3·4·5·8")
    y0 = 1930
    s.add(f'<rect x="12" y="{y0}" width="336" height="154" rx="12" class="info"/>')
    card_title(s, 24, y0 + 30, "3", "경로 선택", 15, 12, 14)
    s.text(24, y0 + 58, "도착 주소를 보고 다음 길을 고릅니다", 14, "t")
    s.mixed(24, y0 + 80, [("경계 라우터 예:", 14, "t"), ("203.0.113.0/24", 13, "t m"), ("→ 방화벽 쪽", 14, "t")])
    s.text(24, y0 + 102, "방화벽도 구역 사이의 길을 고릅니다", 14, "t")
    s.text(24, y0 + 128, "허용 여부는 판단하지 않습니다", 14, "s b")
    y0 = 2096
    s.add(f'<rect x="12" y="{y0}" width="336" height="112" rx="12" class="info"/>')
    card_title(s, 24, y0 + 30, "4", "허용 판단 (방화벽)", 15, 12, 14)
    s.text(24, y0 + 58, "규칙: 인터넷 → 웹 서버, HTTPS 443 허용", 14, "t")
    s.text(24, y0 + 80, "맞으면 통과하고 연결을 기록합니다", 14, "t")
    s.text(24, y0 + 102, "규칙에 없으면 차단합니다", 14, "s")
    y0 = 2220
    s.add(f'<rect x="12" y="{y0}" width="336" height="134" rx="12" class="info"/>')
    card_title(s, 24, y0 + 30, "5", "주소 변환 (NAT)", 15, 12, 14)
    s.text(24, y0 + 58, "미리 설정한 규칙대로 바꿉니다", 14, "t")
    s.mixed(24, y0 + 80, [("요청 도착", 14, "t b"), ("203.0.113.10 → 172.16.10.10", 13, "t m")])
    s.mixed(24, y0 + 102, [("응답 출발", 14, "t b"), ("172.16.10.10 → 203.0.113.10", 13, "t m")])
    s.text(24, y0 + 124, "허용·차단은 하지 않습니다", 14, "s b")
    y0 = 2366
    s.add(f'<rect x="12" y="{y0}" width="336" height="112" rx="12" class="info"/>')
    card_title(s, 24, y0 + 30, "8", "응답이 돌아갈 때", 15, 12, 14)
    s.text(24, y0 + 58, "허용된 연결의 응답이라 통과합니다", 14, "t")
    s.text(24, y0 + 80, "웹 서버가 새 연결을 먼저 여는 것과 다릅니다", 14, "t")
    s.text(24, y0 + 102, "돌아가는 경로는 기업망마다 다를 수 있음", 14, "s")

    s.comment("단순화와 범위 안내")
    notes = [
        "방문자는 공인 주소를 이미 안다고 가정(DNS 생략)",
        "이 예시는 HTTPS 443입니다.",
        "실제 B3-1 배포 기록의 접속은 HTTP 80이었습니다.",
        "DB 조회·직원 게시는 다른 장면에서 다룹니다.",
        "실제 B3-1(AWS) 구성이 아닙니다.",
    ]
    for i, t in enumerate(notes):
        s.text(12, 2508 + 22 * i, t, 14, "s")
    s.save("request-response-mobile.svg")


if __name__ == "__main__":
    desktop()
    mobile()
    print("written to", OUT)
