"""Scene 03 (일반 기업 네트워크와 AWS는 무엇이 같고 무엇이 다를까?) 데스크톱·모바일 SVG 생성기.

Scene 01 생성기의 스타일·아이콘·그리기 도구를 불러 쓴다(../../scene-01/_tools/build.py).
두 그림은 아래 COMPARE·ASSOC·MISSING·FLOW_G·FLOW_W·CONDITIONS 한 벌에서 만든다.
요소마다 data-node / data-cmp / data-assoc / data-flow / data-missing / data-cond 속성을 붙여 check.cjs가 두 그림의 관계를 비교한다.

실행: python3 -I build.py  (출력: ../network-aws-comparison-desktop.svg, ../network-aws-comparison-mobile.svg)
"""
import importlib.util
import os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.dirname(HERE)
_spec = importlib.util.spec_from_file_location(
    "scene01_build", os.path.join(HERE, "..", "..", "scene-01", "_tools", "build.py"))
s1 = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(s1)
tw, cloud_geom, cloud_x_at, cloud_top_at, esc = s1.tw, s1.cloud_geom, s1.cloud_x_at, s1.cloud_top_at, s1.esc

# ── 공통 사실 ─────────────────────────────────────────────
# 역할 비교: (일반망 요소, AWS 요소, 비교 이름, 휴대전화 카드의 일반망 이름, AWS 이름, 한 줄 주의)
COMPARE = [
    ("g:company", "a:vpc", "네트워크 영역", "회사 네트워크", "VPC 10.0.0.0/16", "VPC는 AWS 안의 논리적으로 격리된 가상 네트워크"),
    ("g:router", "a:igw", "인터넷 연결", "경계 라우터", "인터넷 게이트웨이(IGW)", "IGW는 VPC 구성요소이며 라우터 장비가 아님"),
    ("g:nat", "a:igw", "주소 변환", "NAT (방화벽 기능)", "IGW의 1:1 주소 변환", "NAT Gateway를 만든 것이 아님"),
    ("g:route", "a:rt", "경로 규칙", "경로 선택 (구역 사이 길 안내)", "Route Table", "Subnet에 연결된 규칙표이며 장비가 아님"),
    ("g:acl", "a:sg", "접근 통제", "방화벽의 허용·차단 판단", "Security Group", "구역 경계 장비가 아니라 ENI에 적용되는 규칙"),
    ("g:dmz", "a:subnet", "주소 구역", "DMZ (공개 서비스 구역)", "Public Subnet 10.0.1.0/24", "Public Subnet은 DMZ와 같은 개념이 아님"),
    ("g:web", "a:ec2", "웹 서버", "공개 웹 서버", "EC2 + Nginx", "EC2는 컴퓨팅 자원, Nginx는 웹 서버 프로그램"),
]
ASSOC = [("a:internet", "a:igw", "VPC와 인터넷 연결"), ("a:rt", "a:subnet", "Subnet에 연결"), ("a:sg", "a:eni", "ENI에 적용")]
MISSING = [
    ("staff", "직원 업무망 · 관리 화면 서버"),
    ("data", "DB 서버 · 파일 저장 서비스"),
    ("dmz", "별도 DMZ 구성"),
    ("natgw-lb", "NAT Gateway · 로드 밸런서"),
]
FLOW_G = ["bg:visitor", "bg:internet", "bg:router", "bg:fw", "bg:sw", "bg:web"]          # 일반 기업망 요청 G1~G5
FLOW_W = ["ba:visitor", "ba:internet", "ba:igw", "ba:eni", "ba:nginx"]                    # B3-1 AWS 요청 W1~W4
CHIPS_G = {"bg:visitor": ("외부 방문자", "PC·스마트폰"), "bg:internet": ("인터넷", ""), "bg:router": ("경계 라우터", "경로 선택"),
           "bg:fw": ("방화벽", "허용 판단·NAT"), "bg:sw": ("DMZ 스위치", ""), "bg:web": ("공개 웹 서버", "DMZ")}
CHIPS_W = {"ba:visitor": ("외부 방문자", "PC·스마트폰"), "ba:internet": ("인터넷", ""), "ba:igw": ("IGW", "Public → Private"),
           "ba:eni": ("EC2의 ENI", "SG: HTTP 80 허용"), "ba:nginx": ("Nginx", "EC2 안의 프로그램")}
CONDITIONS = [  # (id, 조건, 일반망 줄, B3-1 줄)
    ("addr", "① 인터넷 쪽 주소", ["회사 공인 주소", "→ NAT 규칙으로 서버의 사설 주소"],
     ["EC2의 자동 할당 Public IPv4", "→ IGW가 Private IPv4로 1:1 변환"]),
    ("route", "② 인터넷과 이어진 길", ["회선 + 경계 라우터·방화벽의 경로"],
     ["IGW를 VPC에 연결 + Route Table", "0.0.0.0/0 → IGW (Subnet에 연결)"]),
    ("allow", "③ 들어와도 되는지", ["방화벽 규칙: HTTPS 443 허용"],
     ["Security Group(ENI에 적용):", "HTTP 80 허용 · 기본 NACL 유지"]),
    ("server", "④ 응답할 프로그램", ["DMZ의 공개 웹 서버"], ["EC2 안의 Nginx (HTTP 80)", "dist 정적 파일 제공"]),
]
CAVEATS = [
    "Route Table = Subnet에 연결된 규칙표 (장비 아님)",
    "Security Group = ENI에 적용되는 상태 추적 규칙",
    "IGW = VPC 구성요소 (라우터 장비·NAT Gateway 아님)",
    "Public Subnet ≠ DMZ (서로 다른 설계 개념)",
]
NOTES = [
    "실제 B3-1은 2026-10-14 배포 기록 기준이며 현재 AWS 상태가 아닙니다. 계정·리소스 ID와 공인 주소는 표시하지 않았습니다.",
    "B3-1은 HTTP 80으로 제공했고 HTTPS 443은 설정하지 않았습니다. 일반 기업망 예시(Scene 02)는 HTTPS 443입니다.",
    "비교선(≈)은 비슷한 역할이라는 뜻입니다. 같은 장비라거나, 통신이 그 선을 따라 이동한다는 뜻이 아닙니다.",
]

EXTRA_STYLE = """      .cmp { stroke: #6a3d9a; stroke-width: 3; fill: none; stroke-dasharray: 0.1 7; stroke-linecap: round; }
      .chip { fill: #f5f0fb; stroke: #6a3d9a; stroke-width: 1.6; }
      .chipT { fill: #4b2a7a; font-weight: 700; }
      .assoc { stroke: #5f6b66; stroke-width: 2; fill: none; stroke-dasharray: 7 5; }
      .missing { fill: #f4f4f4; stroke: #8a8a8a; stroke-width: 1.6; stroke-dasharray: 7 5; }
      .region { fill: #f6f8fb; stroke: #7b879c; stroke-width: 1.5; }
      .vpc { fill: #edf2fd; stroke: #3b5ba9; stroke-width: 2.2; }
      .subnet { fill: #e6f5ec; stroke: #2f7d55; stroke-width: 1.8; }
      .awscard { fill: #ffffff; stroke: #3b5ba9; stroke-width: 1.6; }
      .cell { fill: #ffffff; stroke: #c9d3cd; stroke-width: 1; }
      .head { fill: #eef2ef; stroke: #c9d3cd; stroke-width: 1; }
      .partT { fill: #ffffff; font-weight: 700; }
      .part { fill: #18241f; }
"""
MARKER_D = ('    <marker id="dia" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="11" markerHeight="11" '
            'markerUnits="userSpaceOnUse" orient="auto"><path d="M5 0L10 5L5 10L0 5z" fill="#6a3d9a"/></marker>\n')
ICONS = dict(s1.ICONS)
ICONS.update({
    "gateway": '<path d="M5 28V13a11 11 0 0 1 22 0v15" fill="#fff"/><path d="M3 28h26M11 28V17M21 28V17" fill="none"/>',
    "table": '<rect x="3" y="5" width="26" height="22" rx="2" fill="#fff"/><path d="M3 12h26M3 19h26M12 5v22" fill="none"/>',
    "shield": '<path d="M16 3l11 4v8c0 7-5 11-11 14C10 26 5 22 5 15V7z" fill="#fff"/><path d="M11 16l4 4 7-8" fill="none"/>',
    "nic": '<rect x="3" y="8" width="26" height="15" rx="2" fill="#fff"/><path d="M8 23v4M13 23v4M18 23v4M23 23v4" fill="none"/><rect x="8" y="12" width="9" height="6" fill="none"/>',
    "program": '<rect x="3" y="5" width="26" height="22" rx="3" fill="#fff"/><path d="M12 12l-4 4 4 4M20 12l4 4-4 4" fill="none"/>',
})


class Svg(s1.Svg):
    def __init__(self, *a):
        super().__init__(*a)
        self.head = self.head.replace("    </style>", EXTRA_STYLE + "    </style>", 1).replace("  </defs>", MARKER_D + "  </defs>", 1)

    def save(self, name):
        with open(os.path.join(OUT, name), "w", encoding="utf-8") as f:
            f.write(self.head + "\n".join(self.out) + "\n</svg>\n")

    def icon(self, kind, x, y):
        self.add(s1.ICON_G.format(x=f"{x:g}", y=f"{y:g}", body=ICONS[kind]))

    def box(self, nid, x, y, w, h, cls="card", rx=8, container=False, extra=""):
        c = ' data-container="1"' if container else ""
        n = f' data-node="{nid}"' if nid else ""
        self.add(f'<rect x="{x:g}" y="{y:g}" width="{w:g}" height="{h:g}" rx="{rx}" class="{cls}"{n}{c}{extra}/>')

    def rowcard(self, nid, x, y, w, h, icon, title, sub="", size=17, sub_size=16, cls="card", sub_cls="s"):
        self.box(nid, x, y, w, h, cls)
        tx = x + 10
        if icon:
            self.icon(icon, x + 8, y + (h - 32) / 2)
            tx = x + 46
        if sub:
            self.text(tx, y + h / 2 - 3, title, size, "t b")
            self.text(tx, y + h / 2 + sub_size + 1, sub, sub_size, sub_cls)
        else:
            self.text(tx, y + h / 2 + size * 0.36, title, size, "t b")

    def chip(self, cx, cy, s, size, h=28, cls="chip", tcls="chipT"):
        w = tw(s, size) + 22
        self.add(f'<rect x="{cx - w / 2:.1f}" y="{cy - h / 2:g}" width="{w:.1f}" height="{h}" rx="{h / 2:g}" class="{cls}"/>')
        self.text(cx, cy + size * 0.36, s, size, tcls, "middle")
        return w

    def cmp(self, gid, aid, pts, mfrom=None, mto=None, via=""):
        d = "M" + " L".join(f"{px:g} {py:g}" for px, py in pts)
        v = f' data-via="{via}"' if via else ""
        self.add(f'<path d="{d}" class="cmp" marker-start="url(#dia)" marker-end="url(#dia)" '
                 f'data-cmp="{gid}~{aid}" data-from="{mfrom or gid}" data-to="{mto or aid}"{v}/>')

    def assoc(self, a, b, pts, mfrom=None, mto=None):
        d = "M" + " L".join(f"{px:g} {py:g}" for px, py in pts)
        self.add(f'<path d="{d}" class="assoc" data-assoc="{a}&gt;{b}" data-from="{mfrom or a}" data-to="{mto or b}"/>')

    def glink(self, a, b, pts):
        d = "M" + " L".join(f"{px:g} {py:g}" for px, py in pts)
        self.add(f'<path d="{d}" class="link" data-link="{a}-{b}" data-from="{a}" data-to="{b}"/>')
        for px, py in (pts[0], pts[-1]):
            self.add(f'<circle cx="{px:g}" cy="{py:g}" r="4.6" class="port"/>')

    def arrow(self, fid, a, b, pts):
        d = "M" + " L".join(f"{px:g} {py:g}" for px, py in pts)
        self.add(f'<path d="{d}" class="flowA" marker-end="url(#arrA)" data-flow="{fid}" data-from="{a}" data-to="{b}"/>')

    def cloudnode(self, nid, x, y, w, h, size):
        d, curves, base = cloud_geom(x, y, w, h)
        self.add(f'<path d="{d}" fill="#ffffff" stroke="#3d4f45" stroke-width="2" data-node="{nid}"/>')
        self.text(x + w / 2, base - 12, "인터넷", size, "t b", "middle")
        return curves, base

    def part(self, x, y, letter, title, size=22):
        self.add(f'<rect x="{x}" y="{y - 22}" width="30" height="30" rx="7" class="part"/>')
        self.text(x + 15, y - 7 + 18 * 0.36, letter, 18, "partT", "middle")
        self.text(x + 42, y, title, size, "t b")

    def missing_list(self, x, y, size, gap, items=MISSING):
        for i, (mid, label) in enumerate(items):
            self.add(f'<text x="{x:g}" y="{y + i * gap:g}" font-size="{size}" class="t" data-missing="{mid}">· {esc(label)}</text>')


DESC = (
    "설명용 일반 기업 네트워크(Scene 01)와 실제 B3-1 AWS 구성(2026-10-14 배포 기록)을 비교한다. 비슷한 역할일 뿐 장비와 AWS 자원이 일대일로 같지는 않다. "
    "A 전체 구조 비교: 왼쪽은 일반 기업 네트워크의 구역 1~5와 장비, 오른쪽은 AWS 서울 리전의 VPC 10.0.0.0/16, 인터넷 게이트웨이(IGW), Route Table, Security Group, "
    "Public Subnet 10.0.1.0/24, EC2(Amazon Linux 2023, t3.micro)와 그 ENI, EC2 안의 Nginx다. 보라색 점선 비교선은 비슷한 역할을 잇는다: "
    "회사 네트워크와 VPC(네트워크 영역), 경계 라우터와 IGW(인터넷 연결), 방화벽의 NAT 기능과 IGW의 1:1 주소 변환(주소 변환, NAT Gateway 아님), "
    "구역 사이 길 안내와 Route Table(경로 규칙, 장비 아닌 규칙표), 방화벽의 허용·차단 판단과 Security Group(접근 통제, ENI에 적용), "
    "DMZ와 Public Subnet(주소 구역, 같은 개념 아님), 공개 웹 서버와 EC2 + Nginx(웹 서버). 회색 점선은 AWS 설정상의 연결이다: IGW는 VPC와 인터넷을 연결하고, "
    "Route Table은 Subnet에 연결되며, Security Group은 ENI에 적용된다. 자료 저장 구역과 내부 업무망은 B3-1과 비교할 대상이 없어 흐리게 그렸다. "
    "B3-1에서 구현하지 않음: 직원 업무망과 관리 화면 서버, DB 서버와 파일 저장 서비스, 별도 DMZ, NAT Gateway와 로드 밸런서. AWS에서 만들 수 없다는 뜻이 아니다. "
    "B 외부 방문자의 접속: 일반 기업망은 방문자, 인터넷, 경계 라우터, 방화벽, DMZ 스위치, 공개 웹 서버로 요청이 간다. B3-1은 방문자, 인터넷, IGW(Public IPv4를 Private IPv4로 변환), "
    "Security Group이 적용된 EC2의 ENI, EC2 안의 Nginx로 간다. Route Table은 요청이 지나가는 장비가 아니라 Subnet의 경로 규칙(0.0.0.0/0 → IGW)이다. "
    "접속에 필요한 조건: ① 인터넷 쪽 주소(일반망은 회사 공인 주소와 NAT 규칙, B3-1은 자동 할당 Public IPv4와 IGW의 1:1 변환), "
    "② 인터넷과 이어진 길(일반망은 회선과 경계 라우터·방화벽의 경로, B3-1은 VPC에 연결한 IGW와 Route Table의 0.0.0.0/0 → IGW), "
    "③ 들어와도 되는지(일반망은 방화벽의 HTTPS 443 허용, B3-1은 ENI에 적용된 Security Group의 HTTP 80 허용과 기본 NACL), "
    "④ 응답할 프로그램(일반망은 공개 웹 서버, B3-1은 EC2의 Nginx가 HTTP 80으로 dist 정적 파일 제공). Public Subnet이라는 이름만으로는 접속되지 않는다. "
    "B3-1은 HTTP 80만 사용했고 HTTPS 443은 설정하지 않았다. 리소스 ID와 공인 주소는 표시하지 않았다."
)
TITLE = "일반 기업 네트워크와 AWS는 무엇이 같고 무엇이 다를까?"


# ── 데스크톱 ──────────────────────────────────────────────
def desktop():
    W, H = 1280, 1904
    s = Svg(W, H, TITLE + " · 노트북용", DESC, "d3")
    s.text(24, 44, TITLE, 28, "t b")
    s.text(24, 78, "같은 문제를 다른 방식으로 해결합니다. 비슷한 역할일 뿐, 장비와 AWS 자원이 일대일로 같지는 않습니다.", 18, "s")

    s.comment("그림 읽는 법")
    s.box(None, 16, 100, 1248, 86, "info", 12)
    r1, r2 = 132, 168
    s.cmp("legend", "legend", [(34, r1 - 6), (80, r1 - 6)], "x", "x")
    s.text(94, r1, "보라 점선 = 비슷한 역할 (통신 방향 아님)", 17, "t")
    s.add(f'<path d="M454 {r1 - 6}H490" class="link"/><circle cx="454" cy="{r1 - 6}" r="4.6" class="port"/><circle cx="490" cy="{r1 - 6}" r="4.6" class="port"/>')
    s.text(504, r1, "회색 실선 = 실제 연결 (케이블)", 17, "t")
    s.add(f'<path d="M852 {r1 - 6}H892" class="assoc"/>')
    s.text(906, r1, "회색 점선 = AWS 설정상의 연결", 17, "t")
    s.add(f'<path d="M32 {r2 - 6}H74" class="flowA" marker-end="url(#arrA)"/>')
    s.text(94, r2, "초록 화살표 = 요청 방향 (B 부분)", 17, "t")
    s.add(f'<rect x="452" y="{r2 - 20}" width="40" height="26" rx="7" class="zStore" opacity="0.35"/>')
    s.text(504, r2, "흐린 부분 = B3-1과 비교할 대상 없음", 17, "t")
    s.add(f'<rect x="852" y="{r2 - 20}" width="40" height="26" rx="7" class="missing"/>')
    s.text(906, r2, "점선 상자 = B3-1에서 구현하지 않음", 17, "t")

    s.comment("A 전체 구조 비교")
    s.part(16, 230, "A", "전체 구조 비교")
    s.text(16, 262, "일반 기업 네트워크 · 설명용 예시 (Scene 01)", 18, "t b")
    s.text(768, 262, "실제 B3-1 AWS 구성 · 2026-10-14 기록", 18, "t b")

    # 왼쪽: 일반 기업 네트워크 (Scene 01의 구역 1~5)
    s.comment("왼쪽: 일반 기업 네트워크")
    s.zone("out", 16, 272, 496, 64, [[(s1.ZONES["out"][1], 17, "t b")]], chip=24, num_size=16)
    s.box("g:company", 16, 348, 496, 662, "company", 18, container=True)
    s.text(30, 376, "회사 네트워크", 18, "t b")
    s.zone("edge", 28, 392, 472, 310, [[("경계 · 출입구", 17, "t b")]], chip=24, num_size=16)
    s.add('<rect x="56" y="714" width="444" height="136" rx="14" class="zDmz" data-node="g:dmz" data-container="1"/>')
    s.add('<rect x="68" y="726" width="24" height="24" rx="6" fill="#ffffff" stroke="#a8741a" stroke-width="2"/>')
    s.text(80, 744, "3", 16, "t b", "middle")
    s.text(102, 744, "공개 서비스 구역 (DMZ)", 17, "t b")
    s.add('<g opacity="0.35" data-faded="true">')
    s.add('<rect x="56" y="862" width="444" height="64" rx="14" class="zStore" data-node="g:store" data-container="1"/>')
    s.add('<rect x="68" y="882" width="24" height="24" rx="6" fill="#ffffff" stroke="#4a5fa8" stroke-width="2"/>')
    s.text(80, 900, "4", 16, "t b", "middle")
    s.text(102, 900, "자료 저장 구역", 17, "t b")
    s.box("g:db", 300, 876, 90, 36, "card")
    s.text(345, 900, "DB 서버", 16, "t b", "middle")
    s.box("g:files", 398, 876, 92, 36, "card")
    s.text(444, 900, "파일 저장소", 16, "t b", "middle")
    s.add('<rect x="56" y="934" width="444" height="64" rx="14" class="zInner" data-node="g:inner" data-container="1"/>')
    s.add('<rect x="68" y="954" width="24" height="24" rx="6" fill="#ffffff" stroke="#5d8a6e" stroke-width="2"/>')
    s.text(80, 972, "5", 16, "t b", "middle")
    s.text(102, 972, "내부 업무망", 17, "t b")
    s.box("g:mgmt", 266, 948, 124, 36, "card")
    s.text(328, 972, "내부 관리 서버", 16, "t b", "middle")
    s.box("g:pc", 398, 948, 92, 36, "card")
    s.text(444, 972, "직원 PC", 16, "t b", "middle")
    s.glink("g:fw", "g:store", [(312, 640), (40, 640), (40, 894), (56, 894)])
    s.glink("g:fw", "g:inner", [(312, 664), (32, 664), (32, 966), (56, 966)])
    s.add("</g>")

    _, gcurves, gbase = cloud_geom(352, 276, 96, 56)
    gl = cloud_x_at(gcurves, 304)[0]
    s.glink("g:visitor", "g:internet", [(326, 304), (gl, 304)])
    s.glink("g:internet", "g:router", [(400, gbase), (400, 428)])
    s.glink("g:router", "g:fw", [(400, 476), (400, 490)])
    s.glink("g:fw", "g:sw", [(400, 690), (400, 758)])
    s.glink("g:sw", "g:web", [(400, 792), (400, 804)])
    s.rowcard("g:visitor", 206, 282, 120, 44, "", "외부 방문자", size=16)
    s.cloudnode("g:internet", 352, 276, 96, 56, 16)
    s.rowcard("g:router", 312, 428, 176, 48, "router", "경계 라우터", "경로 선택", 17, 16)
    s.box("g:fw", 312, 490, 176, 200, "fwbox", 10)
    s.icon("firewall", 322, 500)
    s.text(362, 522, "방화벽", 18, "t b")
    for nid, label, cy in [("g:nat", "NAT", 546), ("g:route", "구역 사이 길 안내", 611), ("g:acl", "허용·차단 판단", 671)]:
        w = tw(label, 16) + 18
        s.add(f'<rect x="{480 - w:.1f}" y="{cy - 13}" width="{w:.1f}" height="26" rx="13" class="tag" data-node="{nid}"/>')
        s.text(480 - w / 2, cy + 16 * 0.36, label, 16, "tagT", "middle")
    s.rowcard("g:sw", 362, 758, 76, 34, "", "스위치", size=16)
    s.rowcard("g:web", 312, 804, 176, 44, "server", "공개 웹 서버", size=17)

    # 오른쪽: 실제 B3-1 AWS
    s.comment("오른쪽: 실제 B3-1 AWS (리소스 ID·공인 주소는 표시하지 않음)")
    s.add('<rect x="768" y="272" width="496" height="64" rx="14" class="zOut" data-zone="aws-internet"/>')
    s.text(784, 310, "인터넷 (AWS 밖)", 17, "t b")
    _, acurves, abase = cloud_geom(960, 276, 96, 56)
    ar = cloud_x_at(acurves, 304)[1]
    s.glink("a:visitor", "a:internet", [(1112, 304), (ar, 304)])
    s.cloudnode("a:internet", 960, 276, 96, 56, 16)
    s.rowcard("a:visitor", 1112, 282, 130, 44, "", "외부 방문자", size=16)
    s.box("a:region", 768, 348, 496, 552, "region", 14, container=True)
    s.text(1248, 374, "AWS 클라우드 · 서울 리전", 17, "s b", "end")
    s.box("a:vpc", 784, 384, 464, 500, "vpc", 12, container=True)
    s.text(1232, 410, "VPC 10.0.0.0/16", 18, "t b", "end")
    s.assoc("a:internet", "a:igw", [(1008, abase), (1008, 426)])
    s.text(998, 402, "VPC와 인터넷 연결", 16, "s", "end")
    s.box("a:igw", 776, 426, 364, 148, "awscard", 10)
    s.icon("gateway", 786, 436)
    s.text(826, 458, "인터넷 게이트웨이 (IGW)", 17, "t b")
    s.text(790, 492, "VPC에 연결 · VPC ↔ 인터넷", 16, "s")
    s.chip(790 + (tw("1:1 주소 변환 · Public ↔ Private IPv4", 16) + 22) / 2, 546, "1:1 주소 변환 · Public ↔ Private IPv4", 16, 28, "tag", "tagT")
    s.rowcard("a:rt", 800, 588, 250, 46, "table", "Route Table", "0.0.0.0/0 → IGW", 17, 16, "awscard", "t m")
    s.assoc("a:rt", "a:subnet", [(1050, 611), (1180, 611), (1180, 718)])
    s.text(1115, 602, "Subnet에 연결", 16, "s", "middle")
    s.rowcard("a:sg", 800, 648, 330, 46, "shield", "Security Group", "HTTP 80 모두 허용 · SSH 22 지정 IP", 17, 16, "awscard")
    s.box("a:subnet", 800, 718, 432, 156, "subnet", 12, container=True)
    s.text(1216, 744, "Public Subnet", 17, "t b", "end")
    s.add('<text x="1216" y="766" font-size="16" class="s m" text-anchor="end">10.0.1.0/24</text>')
    s.assoc("a:sg", "a:eni", [(836, 694), (836, 820)])
    s.text(846, 772, "ENI에 적용", 16, "s")
    s.box("a:ec2", 816, 790, 400, 72, "awscard", 10, container=True)
    s.text(1206, 812, "EC2 · Amazon Linux 2023 · t3.micro", 16, "t b", "end")
    s.box("a:eni", 830, 820, 176, 34, "card", 8)
    s.text(918, 843, "ENI (사설·공개 IPv4)", 16, "t b", "middle")
    s.box("a:nginx", 1020, 820, 186, 34, "card", 8)
    s.text(1113, 843, "Nginx · HTTP 80", 16, "t b", "middle")
    s.add('<rect x="768" y="912" width="496" height="98" rx="12" class="missing" data-node="a:missing"/>')
    s.text(784, 938, "B3-1에서 구현하지 않음", 17, "t b")
    s.text(1248, 938, "AWS에서 불가능하다는 뜻 아님", 16, "s", "end")
    for i, (mid, label) in enumerate(MISSING):
        x, y = (784 if i % 2 == 0 else 1024), (966 if i < 2 else 994)
        s.add(f'<text x="{x}" y="{y}" font-size="16" class="t" data-missing="{mid}">· {esc(label)}</text>')

    s.comment("가운데: 비슷한 역할 비교선(≈)")
    s.text(640, 386, "비슷한 역할 ≈", 16, "s b", "middle")
    rows = {"g:company": ((512, 404), (784, 404)), "g:router": ((488, 452), (776, 452)), "g:nat": ((480, 546), (776, 546)),
            "g:route": ((480, 611), (800, 611)), "g:acl": ((480, 671), (800, 671)), "g:dmz": ((500, 744), (800, 744)),
            "g:web": ((488, 826), (816, 826))}
    via = {"g:nat": "g:fw", "g:route": "g:fw", "g:acl": "g:fw"}
    for gid, aid, name, *_ in COMPARE:
        p0, p1 = rows[gid]
        s.cmp(gid, aid, [p0, p1], via=via.get(gid, ""))
    for gid, aid, name, *_ in COMPARE:
        s.chip(640, rows[gid][0][1], "≈ " + name, 16)
    s.chip(640, 960, "B3-1에 없음", 16, 28, "missing", "s b")

    s.comment("같다고 보면 틀리는 점")
    s.box(None, 16, 1028, 1248, 106, "info", 12)
    s.text(32, 1058, "같다고 보면 틀리는 점", 18, "t b")
    for i, t in enumerate(CAVEATS):
        s.text(32 if i % 2 == 0 else 648, 1092 if i < 2 else 1120, "· " + t, 17, "t")

    s.comment("B 외부 방문자의 웹 접속 비교")
    s.part(16, 1192, "B", "외부 방문자가 홈페이지에 접속하려면?")
    slots = [190, 374, 558, 742, 926, 1110]
    CW_, CH_ = 136, 52
    gy, wy = 1216, 1300
    s.text(16, 1238, "일반 기업망", 17, "t b")
    s.text(16, 1260, "(설명용 예시)", 16, "s")
    s.text(16, 1322, "B3-1 AWS", 17, "t b")
    s.text(16, 1344, "(2026-10-14 기록)", 16, "s")
    gpos = dict(zip(FLOW_G, slots))
    wpos = dict(zip(FLOW_W, [slots[0], slots[1], slots[2], slots[3], slots[5]]))
    for i in range(len(FLOW_G) - 1):
        a, b = FLOW_G[i], FLOW_G[i + 1]
        s.arrow(f"G{i + 1}", a, b, [(gpos[a] + CW_, gy + CH_ / 2), (gpos[b], gy + CH_ / 2)])
    wwid = {nid: (150 if nid == "ba:eni" else CW_) for nid in FLOW_W}
    for i in range(len(FLOW_W) - 1):
        a, b = FLOW_W[i], FLOW_W[i + 1]
        s.arrow(f"W{i + 1}", a, b, [(wpos[a] + wwid[a], wy + CH_ / 2), (wpos[b], wy + CH_ / 2)])
    for nid, x in gpos.items():
        t, sub = CHIPS_G[nid]
        s.rowcard(nid, x, gy, CW_, CH_, "", t, sub, 17, 16)
    for nid, x in wpos.items():
        t, sub = CHIPS_W[nid]
        s.rowcard(nid, x, wy, wwid[nid], CH_, "", t, sub, 17, 16, "awscard")
    s.box("ba:rt", 558, 1368, 520, 62, "awscard", 10)
    s.add('<text x="572" y="1393" font-size="16"><tspan class="t b">Route Table (Subnet에 연결)</tspan><tspan dx="8" class="t m">0.0.0.0/0 → IGW</tspan></text>')
    s.text(572, 1418, "화살표가 지나가는 장비가 아니라 Subnet의 경로 규칙입니다", 16, "s")

    s.comment("접속에 필요한 조건")
    tx0, tx1, tx2, tx3 = 16, 280, 772, 1264
    ty = 1452
    s.add(f'<rect x="{tx0}" y="{ty}" width="{tx3 - tx0}" height="40" class="head"/>')
    s.text(tx0 + 14, ty + 27, "필요한 조건", 17, "t b")
    s.text(tx1 + 14, ty + 27, "일반 기업 네트워크 (예시)", 17, "t b")
    s.text(tx2 + 14, ty + 27, "B3-1 AWS (2026-10-14 기록)", 17, "t b")
    y = ty + 40
    for cid, title, gl_, al_ in CONDITIONS:
        h = 64
        s.add(f'<g data-cond="{cid}">')
        for x0, x1 in [(tx0, tx1), (tx1, tx2), (tx2, tx3)]:
            s.add(f'<rect x="{x0}" y="{y}" width="{x1 - x0}" height="{h}" class="cell"/>')
        s.text(tx0 + 14, y + 38, title, 17, "t b")
        for col, lines in [(tx1, gl_), (tx2, al_)]:
            base = y + (38 if len(lines) == 1 else 27)
            for k, ln in enumerate(lines):
                s.text(col + 14, base + 24 * k, ln, 17, "t")
        s.add("</g>")
        y += h
    s.add(f'<rect x="{tx0}" y="{y}" width="{tx3 - tx0}" height="44" class="head"/>')
    s.text(tx0 + 14, y + 29, "Public Subnet이라는 이름만으로는 접속되지 않습니다. ①~④가 모두 갖춰져야 합니다.", 17, "t b")

    for i, t in enumerate(NOTES):
        s.text(24, 1830 + 26 * i, t, 17, "s")
    s.save("network-aws-comparison-desktop.svg")


# ── 모바일 ───────────────────────────────────────────────
def mobile():
    W = 360
    s = Svg(W, 0, TITLE + " · 휴대전화용", DESC, "m3")
    y = 0
    s.text(12, 30, "일반 기업 네트워크와 AWS는", 20, "t b")
    s.text(12, 56, "무엇이 같고 무엇이 다를까?", 20, "t b")
    s.text(12, 80, "비슷한 역할일 뿐, 일대일로 같지는 않습니다", 14, "s")

    s.comment("그림 읽는 법")
    s.box(None, 12, 94, 336, 196, "info", 12)
    s.cmp("legend", "legend", [(24, 114), (60, 114)], "x", "x")
    s.text(72, 119, "보라 점선 = 비슷한 역할", 15, "t")
    s.text(72, 138, "통신 방향이 아닙니다", 14, "s")
    s.add('<path d="M24 162H58" class="link"/><circle cx="24" cy="162" r="4.6" class="port"/><circle cx="58" cy="162" r="4.6" class="port"/>')
    s.text(72, 167, "회색 실선 = 실제 연결", 15, "t")
    s.add('<path d="M22 192H60" class="assoc"/>')
    s.text(72, 197, "회색 점선 = AWS 설정상의 연결", 15, "t")
    s.add('<path d="M22 222H60" class="flowA" marker-end="url(#arrA)"/>')
    s.text(72, 227, "초록 화살표 = 요청 방향", 15, "t")
    s.add('<rect x="22" y="242" width="38" height="20" rx="6" class="missing"/>')
    s.text(72, 257, "점선 상자 = B3-1에서 구현하지 않음", 15, "t")
    s.text(72, 279, "흐린 글씨·상자 = 비교 대상 없음", 14, "s")

    s.comment("A-1 실제 B3-1 AWS 구성")
    s.part(12, 330, "A", "전체 구조 비교", 18)
    s.text(12, 360, "실제 B3-1 AWS 구성 · 2026-10-14 기록", 15, "t b")
    s.text(12, 380, "일반 기업 네트워크 전체는 Scene 01 그림을 봅니다", 14, "s")
    s.add('<rect x="12" y="392" width="336" height="64" rx="12" class="zOut" data-zone="aws-internet"/>')
    s.text(24, 428, "인터넷", 15, "t b")
    _, acurves, abase = cloud_geom(170, 398, 92, 52)
    ar = cloud_x_at(acurves, 424)[1]
    s.glink("a:visitor", "a:internet", [(272, 424), (ar, 424)])
    s.cloudnode("a:internet", 170, 398, 92, 52, 14)
    s.rowcard("a:visitor", 272, 404, 68, 40, "", "방문자", size=14)
    s.box("a:region", 12, 470, 336, 512, "region", 12, container=True)
    s.text(336, 492, "AWS 서울 리전", 14, "s b", "end")
    s.box("a:vpc", 20, 502, 320, 470, "vpc", 12, container=True)
    s.text(330, 524, "VPC 10.0.0.0/16", 15, "t b", "end")
    s.assoc("a:internet", "a:igw", [(216, abase), (216, 540)])
    s.box("a:igw", 30, 540, 300, 72, "awscard", 10)
    s.icon("gateway", 38, 548)
    s.text(76, 566, "인터넷 게이트웨이 (IGW)", 15, "t b")
    s.text(40, 600, "1:1 주소 변환 · Public ↔ Private IPv4", 14, "s")
    s.rowcard("a:rt", 30, 628, 190, 46, "table", "Route Table", "0.0.0.0/0 → IGW", 15, 13, "awscard", "t m")
    s.assoc("a:rt", "a:subnet", [(220, 651), (300, 651), (300, 754)])
    s.text(265, 644, "Subnet에 연결", 13, "s", "middle")
    s.rowcard("a:sg", 30, 688, 230, 46, "shield", "Security Group", "HTTP 80 허용 · SSH 지정 IP", 15, 13, "awscard")
    s.box("a:subnet", 30, 754, 300, 206, "subnet", 12, container=True)
    s.text(42, 778, "Public Subnet", 15, "t b")
    s.add('<text x="42" y="798" font-size="13" class="s m">10.0.1.0/24</text>')
    s.assoc("a:sg", "a:eni", [(245, 734), (245, 870)])
    s.text(238, 812, "ENI에 적용", 13, "s", "end")
    s.box("a:ec2", 42, 826, 276, 124, "awscard", 10, container=True)
    s.text(54, 848, "EC2 · Amazon Linux 2023", 14, "t b")
    s.text(54, 866, "t3.micro", 13, "s")
    s.box("a:eni", 54, 870, 252, 32, "card", 8)
    s.text(180, 891, "ENI (사설·공개 IPv4)", 14, "t b", "middle")
    s.box("a:nginx", 54, 910, 252, 32, "card", 8)
    s.text(180, 931, "Nginx · HTTP 80 · dist 정적 파일", 14, "t b", "middle")
    s.add('<rect x="12" y="994" width="336" height="148" rx="12" class="missing" data-node="a:missing"/>')
    s.text(24, 1020, "B3-1에서 구현하지 않음", 15, "t b")
    s.missing_list(24, 1046, 14, 22)
    s.text(24, 1132, "AWS에서 불가능하다는 뜻이 아닙니다", 13, "s")

    s.comment("A-2 역할 비교 카드")
    s.text(12, 1176, "역할 비교 (≈ 비슷한 역할)", 16, "t b")
    y = 1190
    for i, (gid, aid, name, gname, aname, caveat) in enumerate(COMPARE):
        s.box(None, 12, y, 336, 132, "info", 12)
        gnode, anode = f"m{i}-{gid}", f"m{i}-{aid}"
        s.box(gnode, 24, y + 12, 312, 30, "card", 8)
        s.text(36, y + 32, gname, 14, "t b")
        s.text(324, y + 32, "일반", 13, "s", "end")
        s.box(anode, 24, y + 76, 312, 30, "awscard", 8)
        s.text(36, y + 96, aname, 14, "t b")
        s.text(324, y + 96, "B3-1", 13, "s", "end")
        s.cmp(gid, aid, [(70, y + 42), (70, y + 76)], gnode, anode)
        s.chip(170, y + 59, "≈ " + name, 13, 22)
        s.text(24, y + 124, caveat, 13, "s")
        y += 142
    s.box(None, 12, y, 336, 92, "info", 12)
    s.add(f'<g opacity="0.45" data-faded="true">')
    s.text(24, y + 26, "4 자료 저장 구역 · 5 내부 업무망", 14, "t b")
    s.text(24, y + 46, "DB 서버 · 파일 저장소 · 내부 관리 서버 · 직원 PC", 13, "t")
    s.add("</g>")
    s.chip(108, y + 72, "B3-1에 없음", 13, 22, "missing", "s b")
    y += 102

    s.comment("같다고 보면 틀리는 점")
    s.box(None, 12, y, 336, 142, "info", 12)
    s.text(24, y + 26, "같다고 보면 틀리는 점", 15, "t b")
    caveats_m = ["Route Table = Subnet의 규칙표 (장비 아님)", "Security Group = ENI에 적용되는 규칙",
                 "IGW ≠ 라우터 장비 · ≠ NAT Gateway", "Public Subnet ≠ DMZ"]
    for i, t in enumerate(caveats_m):
        s.text(24, y + 52 + 24 * i, "· " + t, 14, "t")
    y += 166

    s.comment("B 외부 방문자의 웹 접속 비교")
    s.part(12, y + 22, "B", "홈페이지에 접속하려면?", 18)
    y += 48
    s.text(92, y, "일반 기업망", 14, "t b", "middle")
    s.text(268, y, "B3-1 AWS", 14, "t b", "middle")
    y += 14
    gx, wx, cw, ch, gap = 20, 196, 144, 46, 30
    ys_g = {nid: y + i * (ch + gap) for i, nid in enumerate(FLOW_G)}
    ys_w = {"ba:visitor": ys_g["bg:visitor"], "ba:internet": ys_g["bg:internet"], "ba:igw": ys_g["bg:router"],
            "ba:eni": ys_g["bg:fw"], "ba:nginx": ys_g["bg:web"]}
    for i in range(len(FLOW_G) - 1):
        a, b = FLOW_G[i], FLOW_G[i + 1]
        s.arrow(f"G{i + 1}", a, b, [(gx + 40, ys_g[a] + ch), (gx + 40, ys_g[b])])
    for i in range(len(FLOW_W) - 1):
        a, b = FLOW_W[i], FLOW_W[i + 1]
        s.arrow(f"W{i + 1}", a, b, [(wx + 40, ys_w[a] + ch), (wx + 40, ys_w[b])])
    for nid, yy in ys_g.items():
        t, sub = CHIPS_G[nid]
        s.rowcard(nid, gx, yy, cw, ch, "", t, sub, 14, 13)
    for nid, yy in ys_w.items():
        t, sub = CHIPS_W[nid]
        s.rowcard(nid, wx, yy, cw, ch, "", t, sub, 14, 13, "awscard")
    y = ys_g["bg:web"] + ch + 16
    s.box("ba:rt", 12, y, 336, 70, "awscard", 10)
    s.text(24, y + 24, "Route Table (Subnet에 연결)", 14, "t b")
    s.add(f'<text x="24" y="{y + 44}" font-size="13" class="t m">0.0.0.0/0 → IGW</text>')
    s.text(24, y + 62, "화살표가 지나가는 장비가 아닌 경로 규칙", 13, "s")
    y += 86

    s.comment("접속에 필요한 조건")
    for cid, title, gl_, al_ in CONDITIONS:
        n = len(gl_) + len(al_)
        h = 44 + 20 * n + 12
        s.add(f'<g data-cond="{cid}">')
        s.box(None, 12, y, 336, h, "info", 12)
        s.text(24, y + 24, title, 15, "t b")
        yy = y + 48
        for tag, lines in [("일반", gl_), ("B3-1", al_)]:
            s.text(24, yy, tag, 13, "s b")
            for k, ln in enumerate(lines):
                s.text(70, yy + 20 * k, ln, 14, "t")
            yy += 20 * len(lines) + 6
        s.add("</g>")
        y += h + 10
    s.box(None, 12, y, 336, 50, "head", 10)
    s.text(24, y + 22, "Public Subnet이라는 이름만으로는", 14, "t b")
    s.text(24, y + 40, "접속되지 않습니다. ①~④가 모두 필요합니다.", 14, "t b")
    y += 70
    notes_m = ["실제 B3-1은 2026-10-14 기록 기준입니다.", "현재 AWS 상태가 아닙니다.", "리소스 ID·공인 주소는 표시하지 않았습니다.",
               "B3-1은 HTTP 80, HTTPS 443은 설정하지 않음.", "일반 기업망 예시(Scene 02)는 HTTPS 443."]
    for i, t in enumerate(notes_m):
        s.text(12, y + 22 * i, t, 14, "s")
    H = y + 22 * len(notes_m) + 10
    s.head = s.head.replace('viewBox="0 0 360 0" width="360" height="0"', f'viewBox="0 0 360 {H}" width="360" height="{H}"')
    s.head = s.head.replace('height="0"/>', f'height="{H}"/>')
    s.save("network-aws-comparison-mobile.svg")



# ══ Revision 1: 03-A(구조·역할 비교)와 03-B(웹 접속 조건)로 분리 ══════════════
# 1차 통합형(desktop()/mobile())은 비교 근거로 보존한다. `python3 -I build.py legacy`로만 다시 만든다.

# 역할 비교 6개: (일반망 요소, AWS 요소, 비교 이름, 휴대전화 카드의 일반망 이름, AWS 이름)
# 경계 라우터 ↔ IGW, DMZ ↔ Public Subnet은 직접 비교선에서 뺐다(주의 카드로 설명).
COMPARE_R1 = [
    ("g:company", "a:vpc", "네트워크 영역", "회사 네트워크", "VPC 10.0.0.0/16"),
    ("g:nat", "a:igw", "주소 변환", "NAT (방화벽 기능)", "IGW의 1:1 IPv4 변환"),
    ("g:route", "a:rt", "경로 결정", "경로 선택 (구역 사이 길 안내)", "Route Table"),
    ("g:acl", "a:sg", "접근 통제", "방화벽의 허용·차단 판단", "Security Group (ENI에 적용)"),
    ("g:web", "a:ec2", "웹 서버", "공개 웹 서버", "EC2 + Nginx"),
    ("g:subnets", "a:subnet", "주소 구역 분리", "구역마다 서브넷 (주소 범위)", "Subnet 10.0.1.0/24"),
]
NOT_LINKED = [("g:router", "a:igw"), ("g:dmz", "a:subnet")]
CAUTIONS = [  # (제목, 줄들) — 오해 위험이 큰 관계는 선 대신 이 카드로 설명
    ("경계 라우터 ≠ IGW", ["IGW는 VPC를 인터넷과", "연결하는 VPC 구성요소.", "경로는 Route Table이 정함"]),
    ("DMZ ≠ Public Subnet", ["DMZ: 공개 서비스와 내부망을", "나누는 설계 개념", "Public Subnet: IGW 경로가 있는", "Route Table에 연결된 Subnet"]),
    ("Route Table ≠ Security Group", ["Route Table: 어디로 보낼지(경로)", "Security Group: 들어와도", "되는지(허용) · ENI에 적용"]),
    ("1:1 변환 ≠ NAT Gateway", ["IGW가 Public ↔ Private IPv4를", "1:1로 바꿈", "B3-1은 NAT Gateway를", "만들지 않음"]),
]
ACCESS_FLOW = ["c:visitor", "c:internet", "c:igw", "c:eni", "c:nginx"]   # 요청 이동 W1~W4(설정 카드는 지나지 않음). Scene 02의 응답 R1~R5와 다른 식별자
ACCESS_ASSOC = [("c:rt", "c:subnet", "Subnet에 연결"), ("c:sg", "c:eni", "ENI에 적용")]
ACCESS_CONDS = [  # (번호, 제목, 노트북 줄, 휴대전화 줄)
    ("1", "요청 보내기", ["브라우저가 EC2의 Public IPv4로", "HTTP 80 요청을 보냄"], ["브라우저 → EC2의 Public IPv4", "HTTP 80 요청"]),
    ("2", "IGW 연결", ["IGW를 VPC에 연결해야", "VPC와 인터넷이 통신할 수 있음"], ["IGW를 VPC에 연결해야", "VPC와 인터넷이 통신"]),
    ("3", "경로와 Subnet 연결", ["Route Table에 0.0.0.0/0 → IGW", "이 Route Table을 Subnet에 연결", "(이 연결이 있어야 Public Subnet)"],
     ["Route Table: 0.0.0.0/0 → IGW", "이 표를 Subnet에 연결", "(그래야 Public Subnet)"]),
    ("4", "주소 대응", ["EC2는 Subnet 안의 Private IPv4만 앎", "IGW가 자동 할당 Public IPv4와", "1:1로 바꿔 줌"],
     ["EC2는 Private IPv4만 앎", "IGW가 Public IPv4와 1:1 변환"]),
    ("5", "허용 규칙", ["Security Group을 EC2의 ENI에 적용", "inbound HTTP 80 (0.0.0.0/0) 허용", "상태 추적 · Subnet NACL은 기본값"],
     ["SG를 EC2의 ENI에 적용", "inbound HTTP 80 허용 · 상태 추적", "NACL은 기본값 유지"]),
    ("6", "응답할 프로그램", ["Nginx가 HTTP 80으로 요청을 받아", "/var/www/b3-1의 dist 정적 파일 제공"],
     ["Nginx가 HTTP 80으로 받아", "dist 정적 파일 제공"]),
]
STEP_STYLE = """      .step { fill: #ffffff; stroke: #18241f; stroke-width: 2.2; }
      .stepT { fill: #18241f; font-weight: 700; }
      .brk { fill: #d9cdea; stroke: #6a3d9a; stroke-width: 1.2; }
"""


class SvgR1(Svg):
    def __init__(self, *a):
        super().__init__(*a)
        self.head = self.head.replace("    </style>", STEP_STYLE + "    </style>", 1)

    def step(self, x, y, n, size=16, r=13):
        self.add(f'<circle cx="{x:g}" cy="{y:g}" r="{r}" class="step" data-cond-mark="{n}"/>')
        self.text(x, y + size * 0.36, n, size, "stepT", "middle")

    def fit(self, H):
        self.head = self.head.replace(f'height="0"', f'height="{H}"').replace(f'viewBox="0 0 {self.w} 0"', f'viewBox="0 0 {self.w} {H}"')


def legend_overview(s, y0, size, mobile=False):
    if mobile:
        s.box(None, 12, y0, 336, 150, "info", 12)
        s.cmp("legend", "legend", [(24, y0 + 20), (60, y0 + 20)], "x", "x")
        s.text(72, y0 + 25, "보라 점선 = 비슷한 역할 (≈)", size, "t")
        s.text(72, y0 + 44, "같은 장비·서비스가 아닙니다", 14, "s")
        s.add(f'<path d="M24 {y0 + 68}H58" class="link"/><circle cx="24" cy="{y0 + 68}" r="4.6" class="port"/><circle cx="58" cy="{y0 + 68}" r="4.6" class="port"/>')
        s.text(72, y0 + 73, "회색 실선 = 실제 연결", size, "t")
        s.add(f'<path d="M22 {y0 + 96}H60" class="assoc"/>')
        s.text(72, y0 + 101, "회색 점선 = AWS 설정상의 연결", size, "t")
        s.add(f'<rect x="22" y="{y0 + 114}" width="38" height="20" rx="6" class="missing"/>')
        s.text(72, y0 + 129, "점선 상자 = B3-1에서 구현하지 않음", size, "t")
        return y0 + 150
    s.box(None, 16, y0, 1248, 86, "info", 12)
    r1, r2 = y0 + 32, y0 + 68
    s.cmp("legend", "legend", [(34, r1 - 6), (80, r1 - 6)], "x", "x")
    s.text(94, r1, "보라 점선 = 비슷한 역할 (≈)", size, "t")
    s.add(f'<path d="M454 {r1 - 6}H490" class="link"/><circle cx="454" cy="{r1 - 6}" r="4.6" class="port"/><circle cx="490" cy="{r1 - 6}" r="4.6" class="port"/>')
    s.text(504, r1, "회색 실선 = 실제 연결 (케이블)", size, "t")
    s.add(f'<path d="M852 {r1 - 6}H892" class="assoc"/>')
    s.text(906, r1, "회색 점선 = AWS 설정상의 연결", size, "t")
    s.text(94, r2, "≈ 는 비슷한 역할일 뿐, 같은 장비·서비스가 아닙니다", size, "s")
    s.add(f'<rect x="452" y="{r2 - 20}" width="40" height="26" rx="7" class="zStore" opacity="0.35"/>')
    s.text(504, r2, "흐린 부분 = 비교할 대상 없음", size, "t")
    s.add(f'<rect x="852" y="{r2 - 20}" width="40" height="26" rx="7" class="missing"/>')
    s.text(906, r2, "점선 상자 = B3-1에서 구현하지 않음", size, "t")
    return y0 + 86


def overview_desktop():
    W, H = 1280, 1300
    s = SvgR1(W, H, "일반 기업망에서 하던 일을 AWS에서는 무엇이 맡을까? · 노트북용", DESC_OVERVIEW, "d3a")
    s.text(24, 44, "일반 기업망에서 하던 일을 AWS에서는 무엇이 맡을까?", 28, "t b")
    s.text(24, 78, "Scene 03-A · 일반 기업 네트워크(Scene 01 요약)와 실제 B3-1 AWS 구성의 역할 비교", 18, "s")
    legend_overview(s, 100, 17)
    s.text(16, 230, "일반 기업 네트워크 · Scene 01 요약 (설명용 예시)", 18, "t b")
    s.text(768, 230, "실제 B3-1 AWS 구성 · 2026-10-14 기록", 18, "t b")

    s.comment("왼쪽: 일반 기업 네트워크 요약(구역 1~5)")
    s.zone("out", 16, 272, 496, 64, [[(s1.ZONES["out"][1], 17, "t b")]], chip=24, num_size=16)
    s.box("g:company", 16, 348, 496, 662, "company", 18, container=True)
    s.text(30, 376, "회사 네트워크", 18, "t b")
    s.zone("edge", 28, 392, 472, 310, [[("경계 · 출입구", 17, "t b")]], chip=24, num_size=16)
    s.add('<rect x="56" y="714" width="444" height="136" rx="14" class="zDmz" data-node="g:dmz" data-container="1"/>')
    s.add('<rect x="68" y="726" width="24" height="24" rx="6" fill="#ffffff" stroke="#a8741a" stroke-width="2"/>')
    s.text(80, 744, "3", 16, "t b", "middle")
    s.text(102, 744, "공개 서비스 구역 (DMZ)", 17, "t b")
    s.add('<text x="102" y="768" font-size="16" class="s m">172.16.10.0/24</text>')
    s.add('<g opacity="0.35" data-faded="true">')
    for zid, cls, stroke, num, name, cidr, devices, y in [
            ("g:store", "zStore", "#4a5fa8", "4", "자료 저장 구역", "10.20.30.0/24", "DB 서버 · 파일 저장소", 862),
            ("g:inner", "zInner", "#5d8a6e", "5", "내부 업무망", "192.168.10.0/24", "내부 관리 서버 · 직원 PC", 934)]:
        s.add(f'<rect x="56" y="{y}" width="444" height="64" rx="14" class="{cls}" data-node="{zid}" data-container="1"/>')
        s.add(f'<rect x="68" y="{y + 10}" width="24" height="24" rx="6" fill="#ffffff" stroke="{stroke}" stroke-width="2"/>')
        s.text(80, y + 28, num, 16, "t b", "middle")
        s.add(f'<text x="102" y="{y + 28}"><tspan font-size="17" class="t b">{name}</tspan><tspan dx="8" font-size="16" class="s m">{cidr}</tspan></text>')
        s.text(102, y + 52, devices, 16, "s")
    s.glink("g:fw", "g:store", [(312, 640), (40, 640), (40, 894), (56, 894)])
    s.glink("g:fw", "g:inner", [(312, 664), (32, 664), (32, 966), (56, 966)])
    s.add("</g>")
    # "구역마다 서브넷" 괄호 막대(구역 3~5). 웹 서버 비교선이 지나는 자리는 비워 둔다
    s.add('<path d="M503 722h6v92h-6z M503 840h6v152h-6z" class="brk" data-node="g:subnets"/>')

    _, gcurves, gbase = cloud_geom(352, 276, 96, 56)
    gl = cloud_x_at(gcurves, 304)[0]
    s.glink("g:visitor", "g:internet", [(326, 304), (gl, 304)])
    s.glink("g:internet", "g:router", [(400, gbase), (400, 428)])
    s.glink("g:router", "g:fw", [(400, 476), (400, 490)])
    s.glink("g:fw", "g:sw", [(400, 690), (400, 758)])
    s.glink("g:sw", "g:web", [(400, 792), (400, 804)])
    s.rowcard("g:visitor", 206, 282, 120, 44, "", "외부 방문자", size=16)
    s.cloudnode("g:internet", 352, 276, 96, 56, 16)
    s.rowcard("g:router", 312, 428, 176, 48, "router", "경계 라우터", "경로 선택", 17, 16)
    s.box("g:fw", 312, 490, 176, 200, "fwbox", 10)
    s.icon("firewall", 322, 500)
    s.text(362, 522, "방화벽", 18, "t b")
    for nid, label, cy in [("g:nat", "NAT", 546), ("g:route", "구역 사이 길 안내", 611), ("g:acl", "허용·차단 판단", 671)]:
        w = tw(label, 16) + 18
        s.add(f'<rect x="{480 - w:.1f}" y="{cy - 13}" width="{w:.1f}" height="26" rx="13" class="tag" data-node="{nid}"/>')
        s.text(480 - w / 2, cy + 16 * 0.36, label, 16, "tagT", "middle")
    s.rowcard("g:sw", 362, 758, 76, 34, "", "스위치", size=16)
    s.rowcard("g:web", 312, 804, 176, 44, "server", "공개 웹 서버", size=17)

    s.comment("오른쪽: 실제 B3-1 AWS")
    s.add('<rect x="768" y="272" width="496" height="64" rx="14" class="zOut" data-zone="aws-internet"/>')
    s.text(784, 310, "인터넷 (AWS 밖)", 17, "t b")
    _, acurves, abase = cloud_geom(960, 276, 96, 56)
    ar = cloud_x_at(acurves, 304)[1]
    s.glink("a:visitor", "a:internet", [(1112, 304), (ar, 304)])
    s.cloudnode("a:internet", 960, 276, 96, 56, 16)
    s.rowcard("a:visitor", 1112, 282, 130, 44, "", "외부 방문자", size=16)
    s.box("a:region", 768, 348, 496, 552, "region", 14, container=True)
    s.text(1248, 374, "AWS 클라우드 · 서울 리전", 17, "s b", "end")
    s.box("a:vpc", 784, 384, 464, 500, "vpc", 12, container=True)
    s.text(1232, 410, "VPC 10.0.0.0/16", 18, "t b", "end")
    s.assoc("a:internet", "a:igw", [(1008, abase), (1008, 426)])
    s.box("a:igw", 776, 426, 364, 148, "awscard", 10)
    s.icon("gateway", 786, 436)
    s.text(826, 458, "인터넷 게이트웨이 (IGW)", 17, "t b")
    s.text(790, 492, "VPC를 인터넷과 연결", 16, "s")
    s.chip(790 + (tw("1:1 IPv4 변환 · Public ↔ Private", 16) + 22) / 2, 546, "1:1 IPv4 변환 · Public ↔ Private", 16, 28, "tag", "tagT")
    s.rowcard("a:rt", 800, 588, 250, 46, "table", "Route Table", "0.0.0.0/0 → IGW", 17, 16, "awscard", "t m")
    s.assoc("a:rt", "a:subnet", [(1050, 611), (1180, 611), (1180, 718)])
    s.text(1115, 602, "Subnet에 연결", 16, "s", "middle")
    s.rowcard("a:sg", 800, 648, 330, 46, "shield", "Security Group", "HTTP 80 모두 허용 · SSH 22 지정 IP", 17, 16, "awscard")
    s.box("a:subnet", 800, 718, 432, 156, "subnet", 12, container=True)
    s.text(1216, 744, "Public Subnet", 17, "t b", "end")
    s.add('<text x="1216" y="766" font-size="16" class="s m" text-anchor="end">10.0.1.0/24</text>')
    s.assoc("a:sg", "a:eni", [(836, 694), (836, 820)])
    s.text(846, 772, "ENI에 적용", 16, "s")
    s.box("a:ec2", 816, 790, 400, 72, "awscard", 10, container=True)
    s.text(1206, 812, "EC2 · Amazon Linux 2023 · t3.micro", 16, "t b", "end")
    s.box("a:eni", 830, 820, 176, 34, "card", 8)
    s.text(918, 843, "ENI (사설·공개 IPv4)", 16, "t b", "middle")
    s.box("a:nginx", 1020, 820, 186, 34, "card", 8)
    s.text(1113, 843, "Nginx · HTTP 80", 16, "t b", "middle")
    s.add('<rect x="768" y="912" width="496" height="98" rx="12" class="missing" data-node="a:missing"/>')
    s.text(784, 938, "B3-1에서 구현하지 않음", 17, "t b")
    s.text(1248, 938, "AWS에서 불가능하다는 뜻 아님", 16, "s", "end")
    for i, (mid, label) in enumerate(MISSING):
        x, y = (784 if i % 2 == 0 else 1024), (966 if i < 2 else 994)
        s.add(f'<text x="{x}" y="{y}" font-size="16" class="t" data-missing="{mid}">· {esc(label)}</text>')

    s.comment("가운데: 비슷한 역할 비교선(≈) 6개. 경계 라우터↔IGW, DMZ↔Public Subnet은 선을 긋지 않고 아래 주의 카드로 설명")
    s.text(640, 386, "비슷한 역할 ≈", 16, "s b", "middle")
    rows = {"g:company": ((512, 404), (784, 404)), "g:nat": ((480, 546), (776, 546)), "g:route": ((480, 611), (800, 611)),
            "g:acl": ((480, 671), (800, 671)), "g:web": ((488, 826), (816, 826)), "g:subnets": ((509, 862), (800, 862))}
    via = {"g:nat": "g:fw", "g:route": "g:fw", "g:acl": "g:fw", "g:web": "g:subnets"}
    for gid, aid, *_ in COMPARE_R1:
        s.cmp(gid, aid, list(rows[gid]), via=via.get(gid, ""))
    for gid, aid, name, *_ in COMPARE_R1:
        s.chip(640, rows[gid][0][1], "≈ " + name, 16)
    s.chip(640, 960, "B3-1에 없음", 16, 28, "missing", "s b")

    s.comment("같다고 보면 틀리는 점(선 대신 주의 카드)")
    s.text(16, 1056, "같다고 보면 틀리는 점", 19, "t b")
    for i, (title, lines) in enumerate(CAUTIONS):
        x = 16 + i * 314
        s.add(f'<g data-caution="{i + 1}">')
        s.box(None, x, 1072, 306, 150, "info", 12)
        s.text(x + 14, 1100, title, 17, "t b")
        for k, ln in enumerate(lines):
            s.text(x + 14, 1128 + 22 * k, ln, 16, "t")
        s.add("</g>")
    s.text(24, 1254, "실제 B3-1은 2026-10-14 배포 기록 기준이며 현재 AWS 상태가 아닙니다. 계정·리소스 ID와 공인 주소는 표시하지 않았습니다.", 16, "s")
    s.text(24, 1280, "웹 접속에 필요한 설정은 Scene 03-B에서 봅니다.", 16, "s")
    s.save("network-aws-overview-desktop.svg")


def overview_mobile():
    W = 360
    s = SvgR1(W, 0, "일반 기업망에서 하던 일을 AWS에서는 무엇이 맡을까? · 휴대전화용", DESC_OVERVIEW, "m3a")
    s.text(12, 30, "일반 기업망에서 하던 일을", 20, "t b")
    s.text(12, 56, "AWS에서는 무엇이 맡을까?", 20, "t b")
    s.text(12, 80, "Scene 03-A · 실제 B3-1 AWS (2026-10-14 기록)", 14, "s")
    y = legend_overview(s, 94, 15, mobile=True) + 12
    s.box(None, 12, y, 336, 52, "head", 10)
    s.text(24, y + 22, "일반 기업 네트워크 전체 구조(구역 1~5)는", 14, "t")
    s.text(24, y + 41, "Scene 01 그림에서 봅니다", 14, "t b")
    y += 70

    s.comment("실제 B3-1 AWS 구성")
    s.text(12, y + 14, "실제 B3-1 AWS 구성", 16, "t b")
    o = y + 30 - 392  # 1차 휴대전화용 A-1(392~1142)을 아래로 옮겨 재사용
    s.add(f'<rect x="12" y="{392 + o}" width="336" height="64" rx="12" class="zOut" data-zone="aws-internet"/>')
    s.text(24, 428 + o, "인터넷", 15, "t b")
    _, acurves, abase = cloud_geom(170, 398 + o, 92, 52)
    ar = cloud_x_at(acurves, 424 + o)[1]
    s.glink("a:visitor", "a:internet", [(272, 424 + o), (ar, 424 + o)])
    s.cloudnode("a:internet", 170, 398 + o, 92, 52, 14)
    s.rowcard("a:visitor", 272, 404 + o, 68, 40, "", "방문자", size=14)
    s.box("a:region", 12, 470 + o, 336, 512, "region", 12, container=True)
    s.text(336, 492 + o, "AWS 서울 리전", 14, "s b", "end")
    s.box("a:vpc", 20, 502 + o, 320, 470, "vpc", 12, container=True)
    s.text(330, 524 + o, "VPC 10.0.0.0/16", 15, "t b", "end")
    s.assoc("a:internet", "a:igw", [(216, abase), (216, 540 + o)])
    s.box("a:igw", 30, 540 + o, 300, 72, "awscard", 10)
    s.icon("gateway", 38, 548 + o)
    s.text(76, 566 + o, "인터넷 게이트웨이 (IGW)", 15, "t b")
    s.text(40, 600 + o, "VPC를 인터넷과 연결 · 1:1 IPv4 변환", 14, "s")
    s.rowcard("a:rt", 30, 628 + o, 190, 46, "table", "Route Table", "0.0.0.0/0 → IGW", 15, 14, "awscard", "t m")
    s.assoc("a:rt", "a:subnet", [(220, 651 + o), (300, 651 + o), (300, 754 + o)])
    s.text(265, 644 + o, "Subnet에 연결", 14, "s", "middle")
    s.rowcard("a:sg", 30, 688 + o, 230, 46, "shield", "Security Group", "HTTP 80 허용 · SSH 지정 IP", 15, 14, "awscard")
    s.box("a:subnet", 30, 754 + o, 300, 206, "subnet", 12, container=True)
    s.text(42, 778 + o, "Public Subnet", 15, "t b")
    s.add(f'<text x="42" y="{798 + o}" font-size="14" class="s m">10.0.1.0/24</text>')
    s.assoc("a:sg", "a:eni", [(245, 734 + o), (245, 870 + o)])
    s.text(238, 812 + o, "ENI에 적용", 14, "s", "end")
    s.box("a:ec2", 42, 826 + o, 276, 124, "awscard", 10, container=True)
    s.text(54, 848 + o, "EC2 · Amazon Linux 2023", 14, "t b")
    s.text(54, 866 + o, "t3.micro", 14, "s")
    s.box("a:eni", 54, 870 + o, 252, 32, "card", 8)
    s.text(180, 891 + o, "ENI (사설·공개 IPv4)", 14, "t b", "middle")
    s.box("a:nginx", 54, 910 + o, 252, 32, "card", 8)
    s.text(180, 931 + o, "Nginx · HTTP 80 · dist 정적 파일", 14, "t b", "middle")
    y = 994 + o
    s.add(f'<rect x="12" y="{y}" width="336" height="148" rx="12" class="missing" data-node="a:missing"/>')
    s.text(24, y + 26, "B3-1에서 구현하지 않음", 15, "t b")
    s.missing_list(24, y + 52, 14, 22)
    s.text(24, y + 138, "AWS에서 불가능하다는 뜻이 아닙니다", 14, "s")
    y += 178

    s.comment("역할 비교 카드 6장")
    s.text(12, y + 4, "역할 비교 (≈ 비슷한 역할)", 16, "t b")
    y += 18
    for i, (gid, aid, name, gname, aname) in enumerate(COMPARE_R1):
        s.box(None, 12, y, 336, 112, "info", 12)
        gnode, anode = f"m{i}-{gid}", f"m{i}-{aid}"
        s.box(gnode, 24, y + 12, 312, 30, "card", 8)
        s.text(36, y + 32, gname, 14, "t b")
        s.text(324, y + 32, "일반", 14, "s", "end")
        s.box(anode, 24, y + 70, 312, 30, "awscard", 8)
        s.text(36, y + 90, aname, 14, "t b")
        s.text(324, y + 90, "B3-1", 14, "s", "end")
        s.cmp(gid, aid, [(70, y + 42), (70, y + 70)], gnode, anode)
        s.chip(170, y + 56, "≈ " + name, 14, 22)
        y += 120
    s.box(None, 12, y, 336, 54, "info", 12)
    s.add('<g opacity="0.45" data-faded="true">')
    s.text(24, y + 22, "4 자료 저장 구역 · 5 내부 업무망", 14, "t b")
    s.add("</g>")
    s.chip(80, y + 40, "B3-1에 없음", 14, 20, "missing", "s b")
    y += 82

    s.comment("같다고 보면 틀리는 점")
    s.text(12, y + 4, "같다고 보면 틀리는 점", 16, "t b")
    y += 16
    for i, (title, lines) in enumerate(CAUTIONS):
        h = 36 + 20 * len(lines) + 8
        s.add(f'<g data-caution="{i + 1}">')
        s.box(None, 12, y, 336, h, "info", 12)
        s.text(24, y + 24, title, 15, "t b")
        for k, ln in enumerate(lines):
            s.text(24, y + 46 + 20 * k, ln, 14, "t")
        s.add("</g>")
        y += h + 8
    y += 14
    for i, t in enumerate(["실제 B3-1은 2026-10-14 기록 기준이며", "현재 AWS 상태가 아닙니다.", "웹 접속에 필요한 설정은 Scene 03-B에서 봅니다."]):
        s.text(12, y + 22 * i, t, 14, "s")
    H = y + 22 * 3 + 6
    s.fit(H)
    s.save("network-aws-overview-mobile.svg")


def access_desktop():
    W, H = 1280, 1112
    s = SvgR1(W, H, "AWS에서 웹사이트에 접속하려면? · 노트북용", DESC_ACCESS, "d3b")
    s.text(24, 44, "AWS에서 웹사이트에 접속하려면?", 28, "t b")
    s.text(24, 78, "Scene 03-B · 실제 B3-1 (2026-10-14 기록) · 요청이 이동하는 길과, 그 길을 가능하게 하는 설정을 나눠 봅니다", 18, "s")
    s.box(None, 16, 100, 1248, 52, "info", 12)
    s.add('<path d="M32 126H74" class="flowA" marker-end="url(#arrA)"/>')
    s.text(88, 132, "초록 화살표 = 요청이 이동하는 길", 17, "t")
    s.add('<path d="M452 126H492" class="assoc"/>')
    s.text(506, 132, "회색 점선 = 설정이 연결·적용된 곳", 17, "t")
    s.step(866, 126, "3")
    s.text(888, 132, "숫자 원 = 필요한 설정 (아래 카드)", 17, "t")

    s.comment("인터넷")
    s.add('<rect x="16" y="380" width="320" height="180" rx="14" class="zOut" data-zone="aws-internet"/>')
    s.text(32, 410, "인터넷 (AWS 밖)", 17, "t b")
    s.rowcard("c:visitor", 30, 440, 120, 60, "visitor", "방문자", size=16)
    _, curves, base = cloud_geom(190, 430, 120, 80)
    cl, cr = cloud_x_at(curves, 470)
    s.cloudnode("c:internet", 190, 430, 120, 80, 17)

    s.comment("AWS: 리전 ⊃ VPC ⊃ (Route Table, Security Group, Public Subnet ⊃ EC2 ⊃ ENI·Nginx), IGW는 VPC 경계에")
    s.box("c:region", 352, 172, 912, 432, "region", 14, container=True)
    s.text(1248, 198, "AWS 클라우드 · 서울 리전", 17, "s b", "end")
    s.box("c:vpc", 384, 210, 864, 380, "vpc", 12, container=True)
    s.text(1232, 236, "VPC 10.0.0.0/16", 18, "t b", "end")
    s.box("c:igw", 372, 420, 156, 100, "awscard", 10)
    s.icon("gateway", 384, 432)
    s.text(422, 454, "IGW", 18, "t b")
    s.text(384, 482, "인터넷 게이트웨이", 16, "s")
    s.chip(450, 504, "1:1 IPv4 변환", 16, 24, "tag", "tagT")
    s.rowcard("c:sg", 560, 250, 300, 62, "shield", "Security Group", "inbound HTTP 80 · 0.0.0.0/0", 17, 16, "awscard")
    s.rowcard("c:rt", 900, 250, 300, 62, "table", "Route Table", "0.0.0.0/0 → IGW", 17, 16, "awscard", "t m")
    s.box("c:subnet", 560, 360, 672, 214, "subnet", 12, container=True)
    s.text(576, 386, "Public Subnet", 17, "t b")
    s.add('<text x="576" y="408" font-size="16" class="s m">10.0.1.0/24</text>')
    s.box("c:ec2", 600, 420, 616, 140, "awscard", 10, container=True)
    s.text(1200, 544, "EC2 · Amazon Linux 2023 · t3.micro", 16, "t b", "end")
    s.box("c:eni", 640, 450, 220, 40, "card", 8)
    s.text(750, 476, "ENI · Private IPv4", 16, "t b", "middle")
    s.box("c:nginx", 960, 450, 236, 40, "card", 8)
    s.text(1078, 476, "Nginx · HTTP 80 · dist", 16, "t b", "middle")
    s.assoc("c:sg", "c:eni", [(710, 312), (710, 450)])
    s.text(720, 344, "ENI에 적용", 16, "s")
    s.assoc("c:rt", "c:subnet", [(1050, 312), (1050, 360)])
    s.text(1060, 344, "Subnet에 연결", 16, "s")

    s.comment("요청이 이동하는 길(초록). Route Table·Security Group 카드는 지나지 않는다")
    path = {"c:visitor": (150, None), "c:internet": (cl, cr), "c:igw": (372, 528), "c:eni": (640, 860), "c:nginx": (960, None)}
    for i in range(len(ACCESS_FLOW) - 1):
        a, b = ACCESS_FLOW[i], ACCESS_FLOW[i + 1]
        x0 = path[a][1] if path[a][1] is not None else path[a][0]
        x1 = path[b][0]
        s.arrow(f"W{i + 1}", a, b, [(x0, 470), (x1, 470)])

    s.comment("필요한 설정 번호")
    for n, (x, y) in {"1": (146, 444), "2": (524, 424), "3": (1196, 254), "4": (856, 454), "5": (856, 254), "6": (1192, 454)}.items():
        s.step(x, y, n)

    s.comment("필요한 설정 카드 ①~⑥")
    for i, (n, title, lines, _) in enumerate(ACCESS_CONDS):
        x, y = 16 + (i % 3) * 422, 630 + (i // 3) * 158
        s.add(f'<g data-cond="{n}">')
        s.box(None, x, y, 404, 146, "info", 12)
        s.step(x + 28, y + 28, n)
        s.text(x + 50, y + 34, title, 18, "t b")
        for k, ln in enumerate(lines):
            s.text(x + 18, y + 66 + 24 * k, ln, 17, "t")
        s.add("</g>")
    s.box(None, 16, 954, 1248, 48, "head", 10)
    s.text(32, 985, "Public Subnet이라는 이름만으로는 접속되지 않습니다. ②~⑥이 모두 갖춰져야 ①의 요청이 Nginx에 닿습니다.", 17, "t b")
    notes = [
        "응답은 같은 연결의 반대 방향으로 돌아갑니다(자세한 흐름은 Scene 02). Route Table은 응답이 VPC 밖으로 나갈 다음 대상도 정합니다.",
        "B3-1은 HTTP 80만 설정했습니다(HTTPS 443은 설정하지 않음). 일반 기업망 예시(Scene 02)는 HTTPS 443입니다.",
        "2026-10-14 배포 기록 기준이며 현재 AWS 상태가 아닙니다. 리소스 ID와 공인 주소는 표시하지 않았습니다.",
    ]
    for i, t in enumerate(notes):
        s.text(24, 1036 + 26 * i, t, 16, "s")
    s.save("network-aws-access-desktop.svg")


def access_mobile():
    W = 360
    s = SvgR1(W, 0, "AWS에서 웹사이트에 접속하려면? · 휴대전화용", DESC_ACCESS, "m3b")
    s.text(12, 30, "AWS에서 웹사이트에", 20, "t b")
    s.text(12, 56, "접속하려면?", 20, "t b")
    s.text(12, 80, "Scene 03-B · 실제 B3-1 (2026-10-14 기록)", 14, "s")
    s.box(None, 12, 94, 336, 98, "info", 12)
    s.add('<path d="M22 116H60" class="flowA" marker-end="url(#arrA)"/>')
    s.text(72, 121, "초록 화살표 = 요청이 이동하는 길", 15, "t")
    s.add('<path d="M22 146H60" class="assoc"/>')
    s.text(72, 151, "회색 점선 = 설정이 연결·적용된 곳", 15, "t")
    s.step(41, 174, "3", 14, 12)
    s.text(72, 179, "숫자 원 = 필요한 설정 (아래 카드)", 15, "t")

    X = 290  # 요청 축
    s.add('<rect x="12" y="206" width="336" height="128" rx="12" class="zOut" data-zone="aws-internet"/>')
    s.text(24, 230, "인터넷 (AWS 밖)", 15, "t b")
    s.rowcard("c:visitor", 236, 216, 104, 40, "", "방문자", size=14)
    _, curves, base = cloud_geom(X - 50, 270, 100, 56)
    top = cloud_top_at(curves, X)
    s.cloudnode("c:internet", X - 50, 270, 100, 56, 14)
    s.box("c:region", 12, 348, 336, 562, "region", 12, container=True)
    s.text(24, 370, "AWS 서울 리전", 14, "s b")
    s.box("c:vpc", 20, 380, 320, 520, "vpc", 12, container=True)
    s.text(32, 402, "VPC 10.0.0.0/16", 15, "t b")
    s.box("c:igw", 196, 366, 136, 72, "awscard", 10)
    s.text(208, 388, "IGW", 15, "t b")
    s.text(208, 406, "인터넷 게이트웨이", 14, "s")
    s.text(208, 426, "1:1 IPv4 변환", 14, "tagT")
    s.rowcard("c:rt", 30, 456, 176, 50, "table", "Route Table", "0.0.0.0/0 → IGW", 14, 14, "awscard", "t m")
    s.rowcard("c:sg", 30, 520, 200, 50, "shield", "Security Group", "inbound HTTP 80", 14, 14, "awscard")
    s.assoc("c:rt", "c:subnet", [(206, 481), (245, 481), (245, 600)])
    s.box("c:subnet", 30, 600, 300, 290, "subnet", 12, container=True)
    s.text(42, 624, "Public Subnet", 15, "t b")
    s.add('<text x="42" y="644" font-size="14" class="s m">10.0.1.0/24</text>')
    s.box("c:ec2", 42, 660, 276, 218, "awscard", 10, container=True)
    s.box("c:eni", 60, 676, 240, 40, "card", 8)
    s.text(84, 701, "ENI · Private IPv4", 14, "t b")
    s.box("c:nginx", 60, 776, 240, 40, "card", 8)
    s.text(84, 801, "Nginx · HTTP 80 · dist", 14, "t b")
    s.text(54, 848, "EC2 · Amazon Linux 2023", 14, "t b")
    s.text(54, 866, "t3.micro", 14, "s")
    s.assoc("c:sg", "c:eni", [(200, 570), (200, 676)])
    s.text(194, 594, "ENI에 적용", 14, "s", "end")
    flows = [("c:visitor", "c:internet", 256, top), ("c:internet", "c:igw", base, 366), ("c:igw", "c:eni", 438, 676), ("c:eni", "c:nginx", 716, 776)]
    for i, (a, b, y0, y1) in enumerate(flows):
        s.arrow(f"W{i + 1}", a, b, [(X, y0), (X, y1)])
    for n, (x, y) in {"1": (228, 222), "2": (326, 372), "3": (200, 462), "4": (64, 680), "5": (224, 526), "6": (64, 780)}.items():
        s.step(x, y, n, 14, 12)

    y = 930
    for n, title, _, lines in ACCESS_CONDS:
        h = 40 + 20 * len(lines) + 8
        s.add(f'<g data-cond="{n}">')
        s.box(None, 12, y, 336, h, "info", 12)
        s.step(36, y + 22, n, 14, 12)
        s.text(56, y + 27, title, 15, "t b")
        for k, ln in enumerate(lines):
            s.text(24, y + 52 + 20 * k, ln, 14, "t")
        s.add("</g>")
        y += h + 8
    s.box(None, 12, y, 336, 50, "head", 10)
    s.text(24, y + 22, "Public Subnet이라는 이름만으로는", 14, "t b")
    s.text(24, y + 40, "접속되지 않습니다. ②~⑥이 모두 필요합니다.", 14, "t b")
    y += 70
    for i, t in enumerate(["응답은 같은 연결의 반대 방향 (Scene 02)", "B3-1은 HTTP 80만 설정 (HTTPS 443 없음)", "2026-10-14 기록 기준, 현재 AWS 상태 아님"]):
        s.text(12, y + 22 * i, t, 14, "s")
    H = y + 22 * 3 + 6
    s.fit(H)
    s.save("network-aws-access-mobile.svg")


DESC_OVERVIEW = (
    "Scene 03-A. 설명용 일반 기업 네트워크(Scene 01 요약)와 실제 B3-1 AWS 구성(2026-10-14 배포 기록)의 역할을 비교한다. 비슷한 역할일 뿐 같은 장비나 서비스가 아니다. "
    "왼쪽은 구역 1~5(회사 밖·인터넷, 경계, DMZ 172.16.10.0/24, 자료 저장 구역 10.20.30.0/24, 내부 업무망 192.168.10.0/24)와 경계 라우터, 방화벽(NAT, 구역 사이 길 안내, 허용·차단 판단), 스위치, 공개 웹 서버다. "
    "오른쪽은 서울 리전의 VPC 10.0.0.0/16, VPC 경계의 인터넷 게이트웨이(IGW, VPC를 인터넷과 연결, 1:1 IPv4 변환), Route Table(0.0.0.0/0 → IGW, Subnet에 연결), "
    "Security Group(HTTP 80 허용, SSH 22는 지정 IP, ENI에 적용), Public Subnet 10.0.1.0/24, 그 안의 EC2(Amazon Linux 2023, t3.micro)와 ENI, Nginx다. "
    "보라 점선 비교선 6개: 회사 네트워크와 VPC(네트워크 영역), 방화벽의 NAT와 IGW의 1:1 IPv4 변환(주소 변환), 구역 사이 길 안내와 Route Table(경로 결정), "
    "방화벽의 허용·차단 판단과 Security Group(접근 통제), 공개 웹 서버와 EC2 + Nginx(웹 서버), 구역마다 있는 서브넷과 Subnet(주소 구역 분리). "
    "경계 라우터와 IGW, DMZ와 Public Subnet은 비교선으로 잇지 않고 주의 카드로 설명한다: 경계 라우터 ≠ IGW, DMZ ≠ Public Subnet, Route Table ≠ Security Group, 1:1 변환 ≠ NAT Gateway. "
    "B3-1에서 구현하지 않음: 직원 업무망·관리 화면 서버, DB 서버·파일 저장 서비스, 별도 DMZ, NAT Gateway·로드 밸런서(AWS에서 불가능하다는 뜻 아님). 리소스 ID와 공인 주소는 표시하지 않았다."
)
DESC_ACCESS = (
    "Scene 03-B. 실제 B3-1(2026-10-14 기록)에서 방문자의 웹 요청이 Nginx에 닿으려면 무엇이 필요한지, 요청이 이동하는 길과 설정을 나눠 보여 준다. "
    "요청은 방문자에서 인터넷, VPC 경계의 IGW, EC2의 ENI, EC2 안의 Nginx로 간다(초록 화살표). Route Table과 Security Group은 요청이 지나가는 장비가 아니라 설정이다: "
    "Route Table은 Public Subnet에 연결되고, Security Group은 ENI에 적용된다(회색 점선). 필요한 설정: 1 브라우저가 EC2의 Public IPv4로 HTTP 80 요청, "
    "2 IGW를 VPC에 연결, 3 Route Table에 0.0.0.0/0 → IGW 경로를 두고 Subnet에 연결(그래야 Public Subnet), 4 EC2는 Private IPv4만 알고 IGW가 자동 할당 Public IPv4와 1:1로 변환, "
    "5 Security Group을 ENI에 적용해 inbound HTTP 80 허용(상태 추적, NACL 기본값), 6 Nginx가 HTTP 80으로 받아 dist 정적 파일 제공. "
    "Public Subnet이라는 이름만으로는 접속되지 않는다. 응답은 같은 연결의 반대 방향으로 돌아간다(Scene 02). B3-1은 HTTP 80만 설정했고 HTTPS 443은 설정하지 않았다."
)


if __name__ == "__main__":
    import sys
    if "legacy" in sys.argv:  # 1차 통합형(비교 근거)
        desktop()
        mobile()
    overview_desktop()
    overview_mobile()
    access_desktop()
    access_mobile()
    print("written to", OUT)
