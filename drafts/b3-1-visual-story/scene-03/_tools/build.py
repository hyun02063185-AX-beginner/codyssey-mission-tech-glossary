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


if __name__ == "__main__":
    desktop()
    mobile()
    print("written to", OUT)
