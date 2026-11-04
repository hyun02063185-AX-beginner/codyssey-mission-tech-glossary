"""B3-2 미션 스토리(Git의 변경 내용을 AI가 어떻게 설명할까?) SVG 생성기.

그림 9종을 PC(desktop, 폭 1200)·모바일(mobile, 폭 360)용으로 만든다. 결과는 ../assets/ 에 쓴다.
  f0-journey      위치 띠: Git → Python → AI API → 결과. 상태 s1~s4 (모든 강의 화면 위)
  f1-overview     전체 동작 구조도. 상태 all(인트로) · s1~s4(장면 위치) · return(S4-2)
  f2-why          직접 작성 vs AI 초안 + 사람 확인 (S1-1)
  f3-diff         실제 git status / git diff 읽기 (S1-2)
  f4-subprocess   argparse → subprocess → 운영체제 → Git (S2-1)
  f5-result       stdout · stderr · returncode와 조건 분기 (S2-2)
  f6-context      AI에게 보내는 문맥 6칸과 안전 검사 (S3-1)
  f7-api          로컬 Python ↔ 코디세이 API ↔ AI 모델, 요청·응답 JSON (S3-2)
  f8-drafts       commit / pr 실제 출력 비교 (S4-1)

상태 전환: 루트 <svg data-state="..."> 값만 바꾼다. 클래스 b32s-in-<상태>가 붙은 요소는 그 상태에서만 보이고,
b32s-k-<상태>가 붙은 묶음은 그 상태에서 강조된다(나머지는 흐려진다). 렌더러는 SVG를 인라인으로 넣는다(B1-1·B6-1과 같은 방식).
색은 --presentation-* 토큰을 쓰고, 토큰이 없으면 Dark 기본값으로 보인다.
역할 구분은 색 + 모양 + 글자: Git = 네모 G(real), Python = 동그라미 Py(python), AI API = 마름모 AI(ink, 외부는 점선 경계),
결과 = 둥근 네모 ✓ 대신 글자 "초안"(app). 강조 = accent 굵은 테두리 + 이름표. 색만으로 구분하지 않는다.
선: 실선 화살표 = 실제로 오가는 명령·데이터(번호 = 순서), 점선 = 공개되지 않은 내부 또는 경계, 가는 선 = 대응(이름표).
터미널·JSON 글자는 ../assets/evidence/ 의 실제 실행 결과에서 가져왔다. 긴 줄은 '…'로 줄였고 줄인 곳을 그림에 밝힌다.
실행: python -I build_figures.py
"""
import os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(os.path.dirname(HERE), "assets")
FONT = "'Pretendard Variable','Pretendard','Apple SD Gothic Neo','Noto Sans KR','Malgun Gothic',sans-serif"
MONO = "'SF Mono','Menlo','Consolas','D2Coding','Malgun Gothic',monospace"
P = "b32s"

T = {
    "bg": "var(--presentation-bg,#111827)", "panel": "var(--presentation-panel,#1d2736)",
    "ink": "var(--presentation-ink,#eef2f7)", "muted": "var(--presentation-muted,#bdc8d7)",
    "line": "var(--presentation-line,#64748b)", "chip": "var(--presentation-chip,#293549)",
    "acc": "var(--presentation-accent,#ffad86)", "acc_soft": "var(--presentation-accent-soft,#4b2c26)",
    "g": "var(--presentation-real,#edcf8e)", "g_soft": "var(--presentation-real-soft,#403622)",
    "p": "var(--presentation-python,#9cc8ff)", "p_soft": "var(--presentation-python-soft,#203957)",
    "r": "var(--presentation-app,#86dfb0)", "r_soft": "var(--presentation-app-soft,#183f32)",
    "on": "var(--presentation-on-strong,#111827)",
}
STATES_OVERVIEW = ("all", "s1", "s2", "s3", "s4", "return")


def esc(s):
    return str(s).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")


def css(states):
    t = T
    rules = [
        f".{P}-bg{{fill:{t['bg']}}}",
        f".{P}-box{{fill:{t['panel']};stroke:{t['line']};stroke-width:2}}",
        f".{P}-box-g{{fill:{t['g_soft']};stroke:{t['g']};stroke-width:2.5}}",
        f".{P}-box-p{{fill:{t['p_soft']};stroke:{t['p']};stroke-width:2.5}}",
        f".{P}-box-r{{fill:{t['r_soft']};stroke:{t['r']};stroke-width:2.5}}",
        f".{P}-box-a{{fill:{t['panel']};stroke:{t['ink']};stroke-width:2.5;stroke-dasharray:10 6}}",
        f".{P}-box-acc{{fill:{t['acc_soft']};stroke:{t['acc']};stroke-width:3}}",
        f".{P}-box-term{{fill:{t['panel']};stroke:{t['line']};stroke-width:2}}",
        f".{P}-bar{{fill:{t['chip']}}}",
        f".{P}-zone{{fill:none;stroke:{t['line']};stroke-width:2}}",
        f".{P}-zone-ext{{fill:none;stroke:{t['muted']};stroke-width:2.5;stroke-dasharray:12 8}}",
        f".{P}-ink{{fill:{t['ink']}}}", f".{P}-muted{{fill:{t['muted']}}}", f".{P}-b{{font-weight:700}}",
        f".{P}-mono{{font-family:{MONO}}}",
        f".{P}-tg{{fill:{t['g']};font-weight:700}}", f".{P}-tp{{fill:{t['p']};font-weight:700}}",
        f".{P}-tr{{fill:{t['r']};font-weight:700}}", f".{P}-acc{{fill:{t['acc']};font-weight:700}}",
        f".{P}-add{{fill:{t['r']}}}",
        f".{P}-sg{{fill:{t['g']}}}", f".{P}-sp{{fill:{t['p']}}}", f".{P}-sr{{fill:{t['r']}}}", f".{P}-si{{fill:{t['ink']}}}",
        f".{P}-sacc{{fill:{t['acc']}}}",
        f".{P}-on{{fill:{t['on']};font-weight:700}}",
        f".{P}-ln{{stroke:{t['ink']};stroke-width:2.5;fill:none}}",
        f".{P}-ln-acc{{stroke:{t['acc']};stroke-width:3;fill:none}}",
        f".{P}-dash{{stroke:{t['muted']};stroke-width:2.5;stroke-dasharray:9 7;fill:none}}",
        f".{P}-lead{{stroke:{t['muted']};stroke-width:1.8;fill:none}}",
        f".{P}-mk{{fill:{t['ink']}}}", f".{P}-mk-acc{{fill:{t['acc']}}}", f".{P}-mk-m{{fill:{t['muted']}}}",
        f".{P}-hlrow{{fill:{t['r_soft']}}}",
    ]
    for s in states:
        rules.append(f'svg[data-state="{s}"] [class*="{P}-in-"]:not(.{P}-in-{s}){{display:none}}')
        if s not in ("all", "main"):  # 강조·흐림은 위치 상태(s1~s4·return)에만
            rules.append(f'svg[data-state="{s}"] .{P}-g:not(.{P}-k-{s}){{opacity:.32}}')
            rules.append(f'svg[data-state="{s}"] .{P}-k-{s} .{P}-node{{stroke:{t["acc"]};stroke-width:4.5}}')
    return "".join(rules)


# 그림이 화면에 보이는 최소 폭(px). 글자는 이 폭에서도 14px 이상이 되도록 크기 하한을 둔다(preview.cjs와 같은 값).
SHOWN = {1200: 900, 360: 328}


class Svg:
    def __init__(self, w, h, states=("main",), label="", title=""):
        self.w, self.h, self.states, self.label, self.title = w, h, states, label, title
        self.minfont = -(-14 * w // SHOWN[w])  # 올림: 1200 → 19, 360 → 16
        self.parts = []

    def add(self, s):
        self.parts.append(s)

    def text(self, x, y, s, size=20, cls="ink", anchor="start"):
        size = max(size, self.minfont)
        c = " ".join(f"{P}-{k}" for k in cls.split())
        a = f' text-anchor="{anchor}"' if anchor != "start" else ""
        sp = ' xml:space="preserve"' if s.startswith(" ") or "  " in s else ""
        self.add(f'<text x="{x}" y="{y}" font-size="{size}" class="{c}"{a}{sp}>{esc(s)}</text>')

    def lines(self, x, y, items, size=20, lh=None, cls="ink", anchor="start"):
        lh = lh or round(size * 1.4)
        for i, s in enumerate(items):
            self.text(x, y + i * lh, s, size, cls, anchor)

    def rect(self, x, y, w, h, cls="box", rx=12):
        c = " ".join(f"{P}-{k}" for k in cls.split())
        self.add(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" class="{c}"/>')

    def path(self, d, cls="ln", marker="a"):
        c = " ".join(f"{P}-{k}" for k in cls.split())
        m = f' marker-end="url(#{P}-{marker})"' if marker else ""
        self.add(f'<path d="{d}" class="{c}"{m}/>')

    def group(self, cls):
        self.add(f'<g class="{" ".join(f"{P}-{k}" for k in cls.split())}">')

    def end(self):
        self.add("</g>")

    def badge(self, kind, cx, cy, r=18):
        """역할 표시: Git 네모 G · Python 동그라미 Py · AI API 마름모 AI · 결과 둥근 네모 초안."""
        r = max(r, self.minfont)
        if kind == "g":
            self.add(f'<rect x="{cx - r}" y="{cy - r}" width="{2 * r}" height="{2 * r}" rx="3" class="{P}-sg"/>')
            label = "G"
        elif kind == "p":
            self.add(f'<circle cx="{cx}" cy="{cy}" r="{r + 1}" class="{P}-sp"/>')
            label = "Py"
        elif kind == "a":
            k = r + 6
            self.add(f'<path d="M{cx} {cy - k}L{cx + k} {cy}L{cx} {cy + k}L{cx - k} {cy}Z" class="{P}-si"/>')
            label = "AI"
        else:
            self.add(f'<rect x="{cx - r - 8}" y="{cy - r + 2}" width="{2 * r + 16}" height="{2 * r - 4}" rx="{r}" class="{P}-sr"/>')
            label = "초안"
        size = max(round(r * (1.0 if len(label) > 1 else 1.15)), self.minfont)
        self.add(f'<text x="{cx}" y="{cy + round(size * 0.36)}" font-size="{size}" class="{P}-on" text-anchor="middle">{label}</text>')

    def num(self, n, cx, cy, r=15):
        size = max(round(r * 1.15), self.minfont)
        r = max(r, -(-size * 4 // 5))  # 글자 하한에 맞춰 원도 키운다
        self.add(f'<circle cx="{cx}" cy="{cy}" r="{r}" class="{P}-sacc"/>')
        self.add(f'<text x="{cx}" y="{cy + round(size * 0.36)}" font-size="{size}" class="{P}-on" text-anchor="middle">{n}</text>')

    def render(self):
        markers = "".join(
            f'<marker id="{P}-{name}" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="12" markerHeight="12" '
            f'markerUnits="userSpaceOnUse" orient="auto"><path d="M0 0L12 6L0 12Z" class="{P}-{cls}"/></marker>'
            for name, cls in [("a", "mk"), ("a-acc", "mk-acc"), ("a-m", "mk-m")])
        head = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{self.w}" height="{self.h}" viewBox="0 0 {self.w} {self.h}" '
                f'data-state="{self.states[0]}" data-states="{" ".join(self.states)}" font-family="{FONT}" role="img" '
                f'aria-label="{esc(self.label)}"><title>{esc(self.title)}</title><style>{css(self.states)}</style>'
                f'<defs>{markers}</defs><rect width="{self.w}" height="{self.h}" class="{P}-bg"/>')
        return head + "".join(self.parts) + "</svg>\n"


def save(name, svg):
    os.makedirs(OUT, exist_ok=True)
    with open(os.path.join(OUT, name), "w", encoding="utf-8", newline="\n") as f:
        f.write(svg.render())


def node(s, x, y, w, h, kind, title, lines, size=19, tsize=24, cls=None, keys="", bsize=17):
    """역할 상자 하나: 배지 + 제목 + 설명 줄. keys = 이 상자가 강조되는 상태들."""
    box = cls or {"g": "box-g", "p": "box-p", "a": "box-a", "r": "box-r", "n": "box"}[kind]
    s.group(f"g {' '.join('k-' + k for k in keys.split())}".strip())
    s.rect(x, y, w, h, f"{box} node")
    if kind in "gpar":
        s.badge(kind, x + 14 + bsize + (8 if kind == "r" else 0), y + 12 + bsize, bsize)
        tx = x + 2 * bsize + (44 if kind == "r" else 30)
    else:
        tx = x + 16
    s.text(tx, y + 12 + bsize + round(tsize * 0.36), title, tsize, "ink b")
    s.lines(x + 16, y + 2 * bsize + 24 + size, lines, size, round(size * 1.38), "muted")
    s.end()


# ---------------------------------------------------------------- F0 위치 띠
J_STEPS = [("g", "Git", "변경을 안다"), ("p", "Python", "실행·검사"), ("a", "AI API", "외부 서비스"), ("r", "결과", "초안·확인")]
J_LABEL = ("강의 위치 띠. 왼쪽부터 1 Git(변경을 안다), 2 Python(실행·검사), 3 AI API(외부 서비스, 점선 경계), 4 결과(초안·확인)가 "
           "화살표로 이어진다. 지금 Scene의 칸만 주황 테두리로 강조하고 나머지는 흐리게 한다.")


def f0(mobile):
    states = ("s1", "s2", "s3", "s4")
    if not mobile:
        s = Svg(1200, 64, states, J_LABEL, "강의 위치: Git → Python → AI API → 결과")
        w, gap = 254, 50
        for i, (k, name, sub) in enumerate(J_STEPS):
            x = 16 + i * (w + gap)
            s.group(f"g k-s{i + 1}")
            s.rect(x, 6, w, 52, ("box-a" if k == "a" else "box") + " node", 26)
            s.num(i + 1, x + 30, 32, 15)
            s.text(x + 56, 39, name, 21, "ink b")
            s.text(x + w - 16, 39, sub, 19, "muted", "end")
            s.end()
            if i < 3:
                s.path(f"M{x + w + 6} 32H{x + w + gap - 6}", "ln", "a")
    else:
        s = Svg(360, 52, states, J_LABEL, "강의 위치: Git → Python → AI API → 결과")
        w, gap = 80, 12
        for i, (k, name, sub) in enumerate(J_STEPS):
            x = 4 + i * (w + gap)
            s.group(f"g k-s{i + 1}")
            s.rect(x, 6, w, 40, ("box-a" if k == "a" else "box") + " node", 20)
            s.text(x + w // 2, 32, name, 16, "ink b", "middle")
            s.end()
            if i < 3:
                s.path(f"M{x + w + 1} 26H{x + w + gap - 1}", "ln", "a")
    return s


# ---------------------------------------------------------------- F1 전체 동작 구조도
F1_LABEL = ("B3-2 전체 동작 구조도. 왼쪽 실선 영역은 내 컴퓨터(로컬), 오른쪽 점선 영역은 인터넷 너머의 외부 서비스다. "
            "로컬에서 Python 프로그램(python main.py commit 또는 pr)이 ① Git을 실행해 변경 내용을 받고, "
            "② 검사한 내용을 코디세이 API에 요청으로 보내고, ③ 응답을 받는다. 코디세이 API와 AI 모델 사이의 내부 연결과 "
            "모델의 실행 위치는 공개되지 않았다(점선). Python은 ④ 응답을 검증해 검토용 초안으로 터미널에 출력하고, "
            "⑤ 사람이 읽고 확인한 뒤 직접 커밋하거나 PR을 쓴다. 프로그램은 커밋이나 PR을 자동으로 만들지 않는다.")
F1_RETURN = ("마지막 상태에서는 결과 쪽이 강조되고 아래에 세 단계가 나온다: ① 프로그램이 형식을 검사한다(제목 길이·필수 섹션·테스트 주장), "
             "② 사람이 실제 변경·이유와 비교한다, ③ 사람이 직접 git commit을 하고 GitHub에서 PR을 쓴다.")
GATES = [("1", "프로그램 · 형식을 검사", "제목 길이 · 필수 섹션 · 테스트 주장"),
         ("2", "사람 · 내용과 이유를 확인", "실제 diff와 비교 · 빠진 것 찾기"),
         ("3", "사람 · 직접 사용", "git commit · GitHub에서 PR 작성")]


def f1(mobile):
    label = F1_LABEL + " " + F1_RETURN
    title = "Git의 변경 내용을 AI가 설명하기까지"
    if not mobile:
        s = Svg(1200, 540, STATES_OVERVIEW, label, title)
        s.rect(16, 12, 700, 424, "zone", 16)
        s.text(36, 44, "내 컴퓨터 (로컬)", 20, "muted b")
        s.rect(804, 12, 380, 424, "zone-ext", 16)
        s.text(824, 44, "인터넷 너머 (외부 서비스)", 20, "muted b")
        node(s, 36, 64, 220, 120, "g", "Git 저장소", ["바뀐 줄을", "알고 있다"], keys="s1 s2")
        node(s, 380, 64, 320, 120, "p", "Python 프로그램", ["main.py commit | pr", "실행 · 검사 · 요청 · 검증"], keys="s2 s3")
        node(s, 836, 64, 328, 120, "a", "코디세이 API", ["요청을 받는 HTTPS 창구", "키 확인 · 응답 반환"], keys="s3")
        node(s, 836, 284, 328, 132, "a", "AI 모델", ["글을 만들어 돌려준다", "실행 위치는 확인 범위 밖"], keys="s3")
        node(s, 380, 284, 320, 132, "r", "검토용 초안", ["터미널에 출력만 한다", "커밋 · PR을 만들지 않는다"], keys="s4 return")
        node(s, 36, 284, 220, 132, "n", "사람", ["읽고 고친 뒤", "직접 커밋 · PR"], keys="s4 return")
        # ① Python ⇄ Git
        s.group("g k-s2")
        s.path("M378 104H260", "ln", "a")
        s.path("M258 148H376", "ln", "a")
        s.num(1, 290, 84, 13)
        s.text(310, 91, "Git 실행", 19, "ink")
        s.text(276, 176, "결과", 19, "muted")
        s.end()
        # ② 요청 · ③ 응답 (경계를 넘는다)
        s.group("g k-s3")
        s.path("M702 104H832", "ln", "a")
        s.path("M834 148H704", "ln", "a")
        s.num(2, 738, 84, 13)
        s.text(758, 91, "요청", 19, "ink")
        s.num(3, 738, 174, 13)
        s.text(758, 181, "응답", 19, "ink")
        s.path("M1000 188V280", "dash", None)
        s.lines(1014, 226, ["내부 연결은", "공개되지 않음"], 19, 26, "muted")
        s.end()
        # ④ 검증 후 출력 · ⑤ 확인
        s.group("g k-s4 k-return")
        s.path("M540 186V280", "ln", "a")
        s.num(4, 566, 226, 13)
        s.text(586, 233, "검증 후 출력", 19, "ink")
        s.path("M378 350H260", "ln", "a")
        s.num(5, 286, 330, 13)
        s.text(306, 337, "확인", 19, "ink")
        s.end()
        s.group("in-all in-s1 in-s2 in-s3 in-s4")
        s.text(36, 478, "실선 화살표 = 실제로 오가는 명령·데이터 · 점선 = 공개되지 않은 내부 · 번호 = 순서", 19, "muted")
        s.text(36, 512, "프로그램은 커밋도 PR도 자동으로 만들지 않는다. 마지막 판단은 사람이 한다.", 19, "ink b")
        s.end()
        s.group("in-return")
        for i, (n, head, sub) in enumerate(GATES):
            x = 16 + i * 396
            s.rect(x, 452, 360, 80, "box-acc" if i else "box-r", 12)
            s.num(n, x + 28, 480, 14)
            s.text(x + 52, 487, head, 20, "ink b")
            s.text(x + 20, 518, sub, 19, "muted")
            if i < 2:
                s.path(f"M{x + 362} 492H{x + 394}", "ln-acc", "a-acc")
        s.end()
    else:
        s = Svg(360, 820, STATES_OVERVIEW, label, title)
        s.rect(4, 8, 352, 288, "zone", 14)
        s.text(16, 34, "내 컴퓨터 (로컬)", 16, "muted b")
        # 좁은 화면: Python 오른쪽 아래로 ②③ 통로를 비워, 요청·응답이 초안이 아니라 Python에서 나가고 들어옴을 보인다
        node(s, 16, 48, 140, 104, "g", "Git", ["바뀐 줄을", "알고 있다"], 16, 19, keys="s1 s2", bsize=14)
        node(s, 192, 48, 152, 104, "p", "Python", ["main.py", "commit | pr"], 16, 19, keys="s2 s3", bsize=14)
        s.group("g k-s2")
        s.path("M190 80H160", "ln", "a")
        s.path("M158 120H188", "ln", "a")
        s.num(1, 174, 100, 13)
        s.end()
        node(s, 192, 182, 116, 104, "r", "", ["터미널 출력만", "커밋·PR 없음"], 16, 19, keys="s4 return", bsize=13)
        node(s, 16, 182, 140, 104, "n", "사람", ["읽고 고친 뒤", "직접 커밋·PR"], 16, 19, keys="s4 return")
        s.group("g k-s4 k-return")
        s.path("M222 154V178", "ln", "a")
        s.num(4, 250, 166, 13)
        s.path("M190 250H160", "ln", "a")
        s.num(5, 174, 222, 13)
        s.end()
        s.rect(4, 320, 352, 236, "zone-ext", 14)
        s.text(16, 346, "인터넷 너머 (외부 서비스)", 16, "muted b")
        node(s, 16, 360, 328, 82, "a", "코디세이 API", ["요청을 받는 HTTPS 창구"], 16, 19, keys="s3", bsize=14)
        node(s, 16, 460, 328, 84, "a", "AI 모델", ["실행 위치는 공급자 소관"], 16, 19, keys="s3", bsize=14)
        s.group("g k-s3")
        s.path("M322 154V356", "ln", "a")
        s.path("M342 358V156", "ln", "a")
        s.num(2, 300, 308, 13)
        s.num(3, 300, 340, 13)
        s.path("M180 444V456", "dash", None)
        s.end()
        s.group("in-all in-s1 in-s2 in-s3 in-s4")
        s.lines(16, 590, ["① Python이 Git을 실행하고 결과를 받는다", "② 검사한 내용을 API에 요청한다",
                          "③ 응답(JSON)을 받는다", "④ 검증해 초안으로 출력한다", "⑤ 사람이 확인하고 직접 쓴다"], 16, 26, "ink")
        s.lines(16, 732, ["실선 = 실제로 오가는 명령·데이터", "점선 = 외부 · 공개되지 않은 내부",
                          "프로그램은 커밋·PR을 만들지 않는다"], 16, 26, "muted")
        s.end()
        s.group("in-return")
        for i, (n, head, sub) in enumerate(GATES):
            y = 572 + i * 82
            s.rect(4, y, 352, 68, "box-acc" if i else "box-r", 12)
            s.num(n, 28, y + 24, 13)
            s.text(50, y + 30, head, 17, "ink b")
            s.text(20, y + 56, sub, 16, "muted")
        s.end()
    return s


# ---------------------------------------------------------------- F2 직접 작성 vs AI 초안
F2_LABEL = ("두 가지 작성 방식 비교. 왼쪽 '직접 쓸 때'는 1 바뀐 줄을 다시 읽고 2 무엇을 왜 바꿨는지 정리해 3 짧은 문장으로 쓴다. "
            "흔한 결과 예(보충)는 '수정' 한 단어로, 무엇을 고쳤는지 알 수 없고 B3-2 검증기도 이 제목을 거절한다. "
            "오른쪽 'B3-2를 쓸 때'는 1 Git이 바뀐 줄을 알려 주고 2 AI가 초안을 쓰고 3 사람이 확인하고 고친다(강조). "
            "실제 B3-2 출력(2026-10-20) 제목은 '학습 문서에 실습 메모 추가: AI 생성 커밋 메시지 검토 필요'로, 무엇이 바뀌었는지 드러난다.")
F2_SIDES = [
    ("직접 쓸 때", ["바뀐 줄을 다시 읽는다", "무엇을, 왜 바꿨는지 정리한다", "짧은 문장으로 쓴다"], None,
     "흔한 결과 [보충 예]", ["수정"], ["무엇을 고쳤는지 알 수 없다", "B3-2 검증기도 이 제목은 거절한다"]),
    ("B3-2를 쓸 때", ["Git이 바뀐 줄을 알려 준다", "AI가 초안을 쓴다", "사람이 확인하고 고친다"], 2,
     "실제 B3-2 출력 · 2026-10-20", ["학습 문서에 실습 메모 추가:", "AI 생성 커밋 메시지 검토 필요"], ["무엇이 바뀌었는지 드러난다"]),
]


def f2(mobile):
    title = "변경 설명을 직접 쓸 때와 AI 초안을 쓸 때"
    if not mobile:
        s = Svg(1200, 470, ("main",), F2_LABEL, title)
        for i, (head, steps, hl, tag, quote, notes) in enumerate(F2_SIDES):
            x = 24 + i * 592
            s.rect(x, 16, 560, 440, "box-p" if i else "box", 14)
            s.text(x + 24, 58, head, 26, "ink b")
            for j, st in enumerate(steps):
                y = 98 + j * 52
                if j == hl:
                    s.rect(x + 16, y - 24, 528, 46, "box-acc", 10)
                s.num(j + 1, x + 40, y - 1, 14)
                s.text(x + 66, y + 6, st, 21, "ink b" if j == hl else "ink")
            s.rect(x + 24, 264, 512, 172, "box-r" if i else "box", 12)
            s.text(x + 44, 298, tag, 19, "muted")
            if i:
                s.lines(x + 44, 340, quote, 24, 34, "ink b")
            else:
                s.text(x + 44, 352, quote[0], 34, "ink b")
            s.lines(x + 44, 400 if i == 0 else 418, notes, 19, 26, "muted")
    else:
        s = Svg(360, 720, ("main",), F2_LABEL, title)
        for i, (head, steps, hl, tag, quote, notes) in enumerate(F2_SIDES):
            y0 = 8 + i * 360
            s.rect(4, y0, 352, 344, "box-p" if i else "box", 14)
            s.text(20, y0 + 34, head, 20, "ink b")
            for j, st in enumerate(steps):
                y = y0 + 72 + j * 44
                if j == hl:
                    s.rect(12, y - 22, 336, 40, "box-acc", 10)
                s.num(j + 1, 32, y - 3, 12)
                s.text(52, y + 3, st, 17, "ink b" if j == hl else "ink")
            s.rect(12, y0 + 196, 336, 136, "box-r" if i else "box", 12)
            s.text(26, y0 + 222, tag, 16, "muted")
            if i:
                s.lines(26, y0 + 252, quote, 18, 26, "ink b")
            else:
                s.text(26, y0 + 262, quote[0], 28, "ink b")
            s.lines(26, y0 + (292 if i == 0 else 314), notes, 16, 24, "muted")
    return s


# ---------------------------------------------------------------- F3 git status / git diff 읽기
F3_LABEL = ("실제 B3-2 실행에서 AI가 설명한 변경을 연습 저장소에서 다시 만든 터미널 화면(재현). "
            "git status --short는 ' M docs/learning/02-python-ai-api.md'를 보여 준다. M은 고친 파일이고 아직 git add 전이라 오른쪽 칸에 있다. "
            "git diff의 @@ -26,6 +26,8 @@ 줄은 26번째 줄 근처에서 6줄이 8줄이 되었다는 위치 표시다. 앞이 빈칸인 줄은 그대로인 주변 문맥이고, "
            "+로 시작하는 두 줄 '실습 메모: AI가 생성한 커밋 메시지는 사용자가 검토한 후 적용한다.'와 빈 줄이 새로 생긴 줄이다. "
            "-로 시작하는 지워진 줄은 이번 변경에 없다. git diff --cached는 git add한 변경을 보여 주며 이번에는 출력이 없다. "
            "Git은 이 정보를 GitHub가 아니라 내 컴퓨터의 저장소에서 읽는다. 긴 줄과 머리 줄 일부는 줄여서 표시했다.")
# (글자, 종류) — 종류: cmd 명령 · out 출력 · ctx 문맥 · add 추가 · cut 생략 표시. evidence/demo-git-output.txt에서 가져옴
F3_ROWS = [
    ("$ git status --short", "cmd"),
    (" M docs/learning/02-python-ai-api.md", "out"),
    ("$ git diff", "cmd"),
    ("diff --git a/docs/learning/02-python-ai-api.md …", "out"),
    ("··· index · --- · +++ 3줄 생략 ···", "cut"),
    ("@@ -26,6 +26,8 @@ API는 프로그램끼리 …", "hunk"),
    (" ", "ctx"),
    (" 키 없이 Windows: … 을 실행한다.", "ctx"),
    (" ", "ctx"),
    ("+실습 메모: AI가 생성한 커밋 메시지는 사용자가 검토한 후 적용한다.", "add"),
    ("+", "add"),
    ("··· 뒤쪽 문맥 3줄 생략 ···", "cut"),
    ("$ git diff --cached", "cmd"),
    ("(출력 없음)", "cut"),
]
F3_NOTES = [  # (가리키는 줄 번호, 표식, 설명 두 줄)
    (1, "M", ["고친 파일", "아직 git add 전"]),
    (5, "@@", ["위치 표시", "26번째 줄 근처 · 6줄 → 8줄"]),
    (7, "빈칸", ["그대로인 주변 줄", "(앞뒤 3줄씩 문맥)"]),
    (9, "+", ["새로 생긴 줄", "이번 변경은 2줄 (빈 줄 포함)"]),
    (None, "-", ["지워진 줄", "이번 변경에는 없다"]),
    (13, "--cached", ["git add한 변경", "이번에는 없다"]),
]


def term_row(s, x, y, text, kind, size):
    cls = {"cmd": "muted mono b", "out": "ink mono", "cut": "muted", "hunk": "acc mono", "ctx": "ink mono", "add": "add mono b"}[kind]
    if text.strip():
        s.text(x, y, text, size, cls)


def f3(mobile):
    title = "Git은 무엇이 변경됐는지 알고 있다"
    if not mobile:
        s = Svg(1200, 520, ("main",), F3_LABEL, title)
        s.rect(16, 12, 780, 496, "box-term", 12)
        s.add(f'<path d="M16 24a12 12 0 0 1 12-12h756a12 12 0 0 1 12 12v24H16Z" class="{P}-bar"/>')
        s.text(36, 38, "터미널 · 연습 저장소 (재현 · 긴 줄은 …로 줄임)", 19, "muted")
        y0, lh = 90, 30
        for i, (t, k) in enumerate(F3_ROWS):
            y = y0 + i * lh
            if k == "add":
                s.rect(24, y - 22, 764, 30, "hlrow", 4)
            term_row(s, 36, y, t, k, 19)
        ny = [96, 166, 236, 306, 376, 446]
        for j, (row, mark, desc) in enumerate(F3_NOTES):
            y = ny[j]
            s.rect(836, y - 32, 348, 62, "box", 10)
            s.text(852, y - 6, mark, 21, "acc mono")
            s.text(852 + {"M": 34, "@@": 52, "빈칸": 60, "+": 34, "-": 34}.get(mark, 108), y - 6, desc[0], 19, "ink b")
            s.text(852, y + 22, desc[1], 19, "muted")
            if row is not None:
                ry = y0 + row * lh - 7
                s.path(f"M834 {y - 1}L800 {ry}", "lead", None)
    else:
        rows = [
            ("$ git status --short", "cmd"), (" M docs/…/02-python-ai-api.md", "out"), ("$ git diff", "cmd"),
            ("··· 머리 4줄 생략 ···", "cut"), ("@@ -26,6 +26,8 @@ …", "hunk"), (" 키 없이 Windows: …", "ctx"),
            ("+실습 메모: AI가 생성한", "add"), ("  커밋 메시지는 사용자가", "add"), ("  검토한 후 적용한다.", "add"), ("+", "add"),
            ("··· 뒤쪽 문맥 생략 ···", "cut"), ("$ git diff --cached", "cmd"), ("(출력 없음)", "cut"),
        ]
        s = Svg(360, 860, ("main",), F3_LABEL, title)
        s.rect(4, 8, 352, 452, "box-term", 12)
        s.add(f'<path d="M4 20a12 12 0 0 1 12-12h328a12 12 0 0 1 12 12v22H4Z" class="{P}-bar"/>')
        s.text(16, 32, "터미널 · 재현 (화면 폭에 맞춰 줄임)", 16, "muted")
        for i, (t, k) in enumerate(rows):
            y = 72 + i * 30
            if k == "add":
                s.rect(10, y - 20, 340, 30, "hlrow", 4)
            term_row(s, 16, y, t, k, 16)
        s.text(16, 496, "읽는 법", 18, "ink b")
        for j, (row, mark, desc) in enumerate(F3_NOTES):
            y = 532 + j * 52
            s.text(16, y, mark, 17, "acc mono")
            s.text(104, y, desc[0], 16, "ink b")
            s.text(104, y + 23, desc[1], 16, "muted")
    return s


# ---------------------------------------------------------------- F4 argparse → subprocess → 운영체제 → Git
F4_LABEL = ("python main.py commit을 입력했을 때의 흐름. 1 argparse가 명령줄 입력을 읽어 commit이면 커밋 메시지 초안, pr이면 PR 초안을 만들기로 정한다. "
            "2 subprocess.run이 ['git', 'diff', …] 같은 목록을 그대로 넘긴다. 셸을 거치지 않는다. 3 운영체제가 git 프로그램을 새 프로세스로 실행한다. "
            "4 Git이 저장소를 읽고 결과를 돌려준다. 강조 이름표: 여기서 commit은 만들 초안의 종류이며 git commit을 실행하지 않는다. "
            "아래 띠: 실제로 실행하는 Git 명령은 rev-parse, branch, status 두 번, diff, diff --cached의 여섯 번이고 commit·push는 없다.")
F4_BOXES = [
    ("p", "argparse", ["명령줄 입력을 읽는다", "commit → 커밋 메시지 초안", "pr → PR 초안"]),
    ("p", "subprocess.run", ['["git", "diff", …]', "목록 그대로 넘긴다", "셸을 거치지 않는다"]),
    ("n", "운영체제", ["git 프로그램을", "새 프로세스로 실행", "(Windows · macOS)"]),
    ("g", "Git", ["저장소를 읽고", "결과를 돌려준다", "→ 다음 화면"]),
]


def f4(mobile):
    title = "Python이 Git을 실행하는 길"
    if not mobile:
        s = Svg(1200, 500, ("main",), F4_LABEL, title)
        s.rect(16, 16, 420, 58, "box-term", 10)
        s.text(36, 54, "> python main.py commit", 24, "ink mono b")
        s.path("M226 76V122", "ln", "a")
        w, gap = 266, 26
        for i, (k, head, lines) in enumerate(F4_BOXES):
            x = 16 + i * (w + gap)
            s.rect(x, 126, w, 196, {"p": "box-p", "g": "box-g", "n": "box"}[k], 12)
            s.num(i + 1, x + 30, 158, 15)
            s.text(x + 56, 166, head, 22, "ink b mono" if "." in head else "ink b")
            for j, t in enumerate(lines):
                s.text(x + 18, 214 + j * 34, t, 19, "ink mono" if t.startswith("[") else "muted")
            if i < 3:
                s.path(f"M{x + w + 2} 224H{x + w + gap - 2}", "ln", "a")
        s.rect(16, 346, 600, 56, "box-acc", 10)
        s.text(36, 382, "commit은 초안의 종류다 · git commit을 실행하지 않는다", 21, "ink b")
        s.path("M150 324V344", "ln-acc", None)
        s.rect(16, 422, 1168, 62, "box", 10)
        s.text(36, 449, "실제로 실행하는 Git 명령 6번: rev-parse · branch · status ×2 · diff · diff --cached", 19, "ink")
        s.text(36, 474, "변경을 기록하거나(commit) 보내는(push) 명령은 없다.", 19, "muted")
    else:
        s = Svg(360, 760, ("main",), F4_LABEL, title)
        s.rect(4, 8, 352, 48, "box-term", 10)
        s.text(18, 39, "> python main.py commit", 18, "ink mono b")
        y = 76
        for i, (k, head, lines) in enumerate(F4_BOXES):
            s.rect(4, y, 352, 116, {"p": "box-p", "g": "box-g", "n": "box"}[k], 12)
            s.num(i + 1, 28, y + 26, 13)
            s.text(50, y + 33, head, 19, "ink b mono" if "." in head else "ink b")
            for j, t in enumerate(lines):
                s.text(18, y + 62 + j * 24, t, 16, "ink mono" if t.startswith("[") else "muted")
            if i < 3:
                s.path(f"M180 {y + 118}V{y + 132}", "ln", "a")
            y += 134
        s.rect(4, 618, 352, 62, "box-acc", 10)
        s.lines(18, 643, ["commit은 초안의 종류다", "git commit을 실행하지 않는다"], 17, 24, "ink b")
        s.lines(16, 708, ["실행하는 Git 명령 6번 (commit·push 없음)", "rev-parse · branch · status ×2 · diff ×2"], 16, 26, "muted")
    return s


# ---------------------------------------------------------------- F5 stdout · stderr · returncode
F5_LABEL = ("Git 명령이 끝나면 Python은 세 가지를 받는다. stdout은 결과 글(저장소 안에서 실제 값 ' M docs/learning/02-python-ai-api.md'), "
            "stderr는 오류 설명(저장소 밖에서 실제 값 'fatal: not a git repository …'), returncode는 성공 신호다(0이면 성공, 0이 아니면 실패. 실제 값: 저장소 안 0, 밖 128). "
            "오른쪽 흐름: ① returncode가 0인가? 아니요면 오류를 알리고 멈추며 AI 요청은 0회다. 예면 ② git status에 변경이 있나? 없으면 '변경 사항이 없습니다'를 출력하고 "
            "AI 요청은 0회다. 있으면 보낼 데이터를 만든다(Scene 3). 아래: subprocess.run은 실패해도 예외를 내지 않으므로 B3-2가 returncode를 직접 확인한다.")
F5_CARDS = [
    ("stdout", "결과 글", " M docs/learning/02-python-ai-api.md", "저장소 안 · 실제 값"),
    ("stderr", "오류 설명", "fatal: not a git repository …", "저장소 밖 · 실제 값"),
    ("returncode", "성공 신호", "0 = 성공 · 0이 아님 = 실패", "실제: 안 0 · 밖 128"),
]


def f5(mobile):
    title = "Git이 돌려준 세 가지와 다음 작업"
    if not mobile:
        s = Svg(1200, 470, ("main",), F5_LABEL, title)
        node(s, 16, 166, 150, 104, "g", "Git", ["명령 끝"])
        for i, (name, sub, val, note) in enumerate(F5_CARDS):
            y = 16 + i * 146
            s.rect(214, y, 440, 128, "box-acc" if name == "returncode" else "box", 12)
            s.text(232, y + 36, name, 22, "acc mono" if name == "returncode" else "ink mono b")
            s.text(232 + (148 if name == "returncode" else 92), y + 36, sub, 19, "muted")
            s.text(232, y + 76, val, 19, "ink" if name == "returncode" else "ink mono", "start")
            s.text(232, y + 110, note, 19, "muted")
            s.path(f"M168 218C190 218 190 {y + 64} 210 {y + 64}", "ln", "a")
        s.path("M656 390H680V58H700", "ln-acc", "a-acc")
        q = [("1", ["returncode가", "0인가?"], 704, 16), ("2", ["변경이 있나?"], 704, 152)]
        for n, t, x, y in q:
            s.rect(x, y, 236, 84, "box-acc", 42)
            s.num(n, x + 30, y + 42, 14)
            s.lines(x + 56, y + (36 if len(t) > 1 else 49), t, 19, 26, "ink b")
        outs = [(960, 16, "box", "아니요 · 멈춘다", ["오류를 알리고 종료", "AI 요청 0회"]),
                (960, 152, "box", "없음 · 끝낸다", ["변경 사항이 없습니다", "AI 요청 0회"]),
                (704, 288, "box-p", "있음 · 다음으로", ["보낼 데이터를 만든다 (Scene 3)"])]
        for x, y, cls, head, lines in outs:
            w = 224 if x == 960 else 480
            s.rect(x, y, w, 100 if x == 960 else 84, cls, 12)
            s.text(x + 16, y + 32, head, 20, "ink b")
            s.lines(x + 16, y + 62, lines, 19, 26, "muted")
        s.path("M942 58H956", "ln", "a")
        s.path("M942 194H956", "ln", "a")
        s.path("M814 102V148", "ln", "a")
        s.text(826, 132, "예", 19, "ink b")
        s.path("M814 238V284", "ln", "a")
        s.rect(704, 392, 480, 70, "box", 10)
        s.lines(720, 420, ["subprocess.run은 실패해도 예외를 내지 않는다.", "그래서 B3-2가 returncode를 직접 확인한다."], 19, 28, "ink")
    else:
        s = Svg(360, 860, ("main",), F5_LABEL, title)
        node(s, 4, 8, 352, 70, "g", "Git 명령이 끝나면", [], 16, 19, bsize=14)
        for i, (name, sub, val, note) in enumerate(F5_CARDS):
            y = 96 + i * 120
            s.rect(4, y, 352, 108, "box-acc" if name == "returncode" else "box", 12)
            s.text(18, y + 30, name, 19, "acc mono" if name == "returncode" else "ink mono b")
            s.text(18 + (122 if name == "returncode" else 80), y + 30, sub, 16, "muted")
            v = val.replace("docs/learning/", "docs/…/") if name == "stdout" else val
            s.text(18, y + 62, v, 16, "ink" if name == "returncode" else "ink mono")
            s.text(18, y + 90, note, 16, "muted")
        y = 470
        steps = [("box-acc", "① returncode가 0인가?", "아니요 → 오류를 알리고 멈춘다 · AI 요청 0회"),
                 ("box-acc", "② 변경이 있나?", "없음 → 변경 사항이 없습니다 · AI 요청 0회"),
                 ("box-p", "있음 → 보낼 데이터를 만든다", "다음: Scene 3")]
        for cls, head, sub in steps:
            s.rect(4, y, 352, 92, cls, 12)
            s.text(18, y + 32, head, 18, "ink b")
            words = sub.split(" · ")
            s.lines(18, y + 60, words, 16, 24, "muted")
            if cls != "box-p":
                s.path(f"M60 {y + 94}V{y + 124}", "ln", "a")
                s.text(74, y + 116, "예" if "returncode" in head else "있음", 16, "ink b")
            y += 128
        s.lines(16, y + 18, ["subprocess.run은 실패해도 예외를 내지 않는다.", "B3-2가 returncode를 직접 확인한다."], 16, 24, "ink")
        s.h = y + 56
    return s


# ---------------------------------------------------------------- F6 AI에게 보내는 문맥
F6_LABEL = ("B3-2가 AI에게 보내는 Git 문맥 6칸(실제 순서, 재현). Branch: main / Status: ' M docs/…/02-python-ai-api.md' / Changed files: 파일 이름 / "
            "Untracked files: 새 파일은 이름만(강조) / Staged diff: git add한 변경, 이번에는 비어 있음 / Unstaged diff: 아직 add하지 않은 변경, 실습 메모 2줄 추가. "
            "가운데 안전 검사(기본으로 켜짐): ① .env · .pem · id_rsa 같은 비밀 파일 경로가 있으면 보내지 않고 멈춘다 ② 이메일·토큰·비밀번호 값은 [REDACTED]로 가린다 "
            "③ 16,000자를 넘으면 요청하지 않는다. 오른쪽: 이번 예에서 보낼 문맥은 806자. 보내지 않는 것: 새 파일의 내용, 바뀌지 않은 파일, API 키.")
F6_ROWS = [
    ("Branch", "main", False),
    ("Status", " M docs/…/02-python-ai-api.md", False),
    ("Changed files", "docs/…/02-python-ai-api.md", False),
    ("Untracked files", "새 파일은 이름만 보낸다", True),
    ("Staged diff", "git add한 변경 · 이번엔 비어 있음", False),
    ("Unstaged diff", "아직 add 안 한 변경 · +2줄", False),
]
F6_GATE = [("1", "비밀 파일 경로", [".env · .pem · id_rsa …", "→ 보내지 않고 멈춤"]),
           ("2", "이메일·토큰·비밀번호", ["→ [REDACTED]로 가림"]),
           ("3", "16,000자 초과", ["→ 요청하지 않음"])]


def f6(mobile):
    title = "AI에게 보내는 데이터와 안전 검사"
    if not mobile:
        s = Svg(1200, 520, ("main",), F6_LABEL, title)
        s.text(24, 34, "모으는 것 · 실제 순서 (재현)", 20, "muted b")
        for i, (name, val, hl) in enumerate(F6_ROWS):
            y = 52 + i * 76
            s.rect(16, y, 540, 66, "box-acc" if hl else "box", 10)
            s.text(32, y + 27, name, 19, "ink mono b")
            s.text(32, y + 54, val, 19, "ink mono" if val.startswith((" M", "docs", "main")) else "muted")
        s.path("M560 286H598", "ln", "a")
        s.rect(604, 16, 320, 488, "box-g", 14)
        s.text(624, 54, "안전 검사", 24, "ink b")
        s.text(624, 82, "기본으로 켜져 있다", 19, "muted")
        y = 112
        for n, head, lines in F6_GATE:
            h = 48 + 28 * len(lines)
            s.rect(620, y, 288, h, "box", 10)
            s.num(n, 644, y + 26, 13)
            s.text(666, y + 33, head, 19, "ink b")
            s.lines(636, y + 64, lines, 19, 28, "muted")
            y += h + 16
        s.text(624, 488, "--unsafe를 붙이면 ①② 검사를 끈다", 19, "muted")
        s.path("M926 120H962", "ln", "a")
        s.rect(968, 16, 216, 180, "box-p", 14)
        s.text(988, 54, "보낼 문맥", 20, "ink b")
        s.text(988, 116, "806자", 44, "ink b")
        s.lines(988, 152, ["이번 예 · 6칸 합계", "검사를 통과한 것만"], 19, 26, "muted")
        s.rect(968, 220, 216, 200, "box", 14)
        s.text(988, 256, "보내지 않는 것", 20, "ink b")
        s.lines(988, 296, ["새 파일의 내용", "바뀌지 않은 파일", "API 키"], 19, 34, "ink")
    else:
        s = Svg(360, 1064, ("main",), F6_LABEL, title)
        s.text(8, 26, "모으는 것 · 실제 순서 (재현)", 17, "muted b")
        for i, (name, val, hl) in enumerate(F6_ROWS):
            y = 40 + i * 70
            s.rect(4, y, 352, 60, "box-acc" if hl else "box", 10)
            s.text(18, y + 25, name, 16, "ink mono b")
            s.text(18, y + 50, val, 16, "ink mono" if val.startswith((" M", "docs", "main")) else "muted")
        s.path("M180 462V482", "ln", "a")
        s.rect(4, 488, 352, 324, "box-g", 14)
        s.text(18, 520, "안전 검사 · 기본으로 켜짐", 19, "ink b")
        y = 536
        for n, head, lines in F6_GATE:
            h = 36 + 24 * len(lines)
            s.rect(14, y, 332, h, "box", 10)
            s.num(n, 36, y + 20, 12)
            s.text(56, y + 26, head, 17, "ink b")
            s.lines(26, y + 50, lines, 16, 24, "muted")
            y += h + 8
        s.text(18, 796, "--unsafe를 붙이면 ①② 검사를 끈다", 16, "muted")
        s.path("M180 814V832", "ln", "a")
        s.rect(4, 838, 352, 96, "box-p", 14)
        s.text(18, 870, "보낼 문맥 · 이번 예", 18, "ink b")
        s.text(18, 914, "806자", 34, "ink b")
        s.text(140, 912, "검사를 통과한 것만", 16, "muted")
        s.rect(4, 950, 352, 106, "box", 14)
        s.text(18, 982, "보내지 않는 것", 18, "ink b")
        s.lines(18, 1012, ["새 파일의 내용 · 바뀌지 않은 파일", "API 키"], 16, 26, "ink")
    return s


# ---------------------------------------------------------------- F7 API 요청·응답
F7_LABEL = ("내 컴퓨터의 Python(AIClient)과 외부 서비스 사이의 요청과 응답. 왼쪽 위 요청 카드: POST https://copa.codyssey.kr/v1/chat/completions, "
            "Authorization: Bearer 뒤의 키는 가림(환경변수 CODYSSEY_API_KEY에서 읽음), JSON 본문은 model gpt-5-mini와 messages 두 개 — "
            "system(작성 규칙)과 user(검사한 Git 문맥 806자). ② 요청이 경계를 넘어 코디세이 API(요청을 받는 HTTPS 창구)로 간다. "
            "코디세이 API와 AI 모델 사이 내부 연결은 공개되지 않았고(점선), 모델의 실행 위치는 확인 범위 밖이다. "
            "③ 응답 JSON의 choices[0].message.content에서 글만 꺼낸다. 예: '학습 문서에 실습 메모 추가: …'. "
            "명령 1번에 요청 1번, 자동 재시도 없음, 30초 안에 답이 없으면 오류, 401·403은 키·권한 오류.")
F7_REQ = [
    ('POST https://copa.codyssey.kr/v1/chat/completions', "ink mono b"),
    ('Authorization: Bearer ••••••••', "ink mono"),
    ('{', "ink mono"),
    ('  "model": "gpt-5-mini",', "ink mono"),
    ('  "messages": [', "ink mono"),
    ('    {"role": "system", "content": 작성 규칙},', "ink mono"),
    ('    {"role": "user", "content": Git 문맥 806자}', "ink mono"),
    ('  ]', "ink mono"),
    ('}', "ink mono"),
]


def f7(mobile):
    title = "AI API 요청과 응답"
    if not mobile:
        s = Svg(1200, 540, ("main",), F7_LABEL, title)
        s.rect(8, 8, 716, 524, "zone", 14)
        s.text(24, 36, "내 컴퓨터 · Python (AIClient)", 19, "muted b")
        s.rect(764, 8, 428, 524, "zone-ext", 14)
        s.text(780, 36, "인터넷 너머 (외부 서비스)", 19, "muted b")
        s.rect(24, 52, 684, 316, "box-p", 12)
        s.text(44, 84, "요청 · HTTPS POST + JSON", 21, "tp")
        for i, (t, c) in enumerate(F7_REQ):
            s.text(44, 120 + i * 28, t, 19, c)
        s.text(398, 148, "← 키: 환경변수에서 · 화면에 안 보임", 19, "muted")
        s.rect(24, 388, 684, 132, "box-r", 12)
        s.text(44, 420, "응답 · JSON", 21, "tr")
        s.text(44, 454, '{"choices": [{"message": {"content":', 19, "ink mono")
        s.text(44, 482, '   "학습 문서에 실습 메모 추가: …"}}]}', 19, "ink mono")
        s.text(44, 510, "→ choices[0].message.content의 글만 꺼낸다", 19, "muted")
        node(s, 784, 52, 388, 132, "a", "코디세이 API", ["요청을 받는 HTTPS 창구", "명령 1번 = 요청 1번 · 재시도 없음"])
        node(s, 784, 284, 388, 132, "a", "AI 모델 · gpt-5-mini", ["글을 만든다", "실행 위치는 확인 범위 밖"])
        s.path("M978 186V280", "dash", None)
        s.lines(992, 226, ["내부 연결은", "공개되지 않음"], 19, 26, "muted")
        s.path("M710 110H780", "ln", "a")
        s.num(2, 744, 90, 13)
        s.path("M782 160H744V440H712", "ln", "a")
        s.num(3, 744, 300, 13)
        s.lines(784, 466, ["30초 안에 답이 없으면 오류", "401·403 = 키·권한 오류"], 19, 30, "muted")
    else:
        s = Svg(360, 940, ("main",), F7_LABEL, title)
        s.rect(4, 8, 352, 300, "zone", 14)
        s.text(14, 32, "내 컴퓨터 · Python", 16, "muted b")
        s.rect(12, 44, 336, 256, "box-p", 12)
        s.text(24, 70, "요청 · HTTPS POST", 17, "tp")
        rows = [("POST https://copa.codyssey.kr", "ink mono"), ("  /v1/chat/completions", "ink mono"),
                ("Bearer ••••  ← 환경변수", "ink mono"), ("본문 JSON (구조만 표시)", "muted"),
                ("model: gpt-5-mini", "ink mono"), ("messages:", "ink mono"), (" system · 작성 규칙", "ink"), (" user · Git 문맥 806자", "ink")]
        for i, (t, c) in enumerate(rows):
            s.text(24, 100 + i * 26, t, 16, c)
        s.path("M180 310V352", "ln", "a")
        s.num(2, 206, 330, 12)
        s.rect(4, 356, 352, 300, "zone-ext", 14)
        s.text(14, 380, "인터넷 너머 (외부 서비스)", 16, "muted b")
        node(s, 12, 394, 336, 102, "a", "코디세이 API", ["요청 1번 · 재시도 없음"], 16, 19, bsize=14)
        node(s, 12, 536, 336, 102, "a", "AI 모델", ["실행 위치는 확인 범위 밖"], 16, 19, bsize=14)
        s.path("M180 498V532", "dash", None)
        s.text(192, 520, "내부 비공개", 16, "muted")
        s.path("M180 658V700", "ln", "a")
        s.num(3, 206, 680, 12)
        s.rect(4, 704, 352, 160, "box-r", 12)
        s.text(18, 732, "응답 · JSON", 17, "tr")
        s.lines(18, 762, ['choices[0].message.content', '"학습 문서에 실습 메모', ' 추가: …"'], 16, 26, "ink mono")
        s.text(18, 842, "→ 이 글만 꺼낸다", 16, "muted")
        s.lines(8, 896, ["30초 안에 답이 없으면 오류", "401·403 = 키·권한 오류"], 16, 26, "muted")
    return s


# ---------------------------------------------------------------- F8 commit / pr 결과
F8_LABEL = ("같은 변경으로 실행한 두 명령의 실제 출력(2026-10-20 사용자 실행, ChatGPT 대화 공유 원문). 왼쪽 python main.py commit: "
            "'=== 검토용 초안: COMMIT ===' 다음에 제목 '학습 문서에 실습 메모 추가: AI 생성 커밋 메시지 검토 필요'(35자), 빈 줄, 본문 두 줄 "
            "'docs/learning/02-python-ai-api.md 파일 끝에 실습 메모를 추가하여 / AI가 생성한 커밋 메시지는 사용자가 검토한 후 적용해야 함을 명시함.', "
            "끝 표시와 stderr의 'AI API 요청 횟수: 1'. 오른쪽 python main.py pr: 'Title: docs(learning): AI 생성 커밋 메시지 검토 안내 추가'(37자), "
            "## Why '- 학습 문서에 … 실습 메모를 명시해 혼동을 줄이기 위해', ## What '- docs/learning/02-python-ai-api.md 파일 끝에 … 추가함'(긴 줄은 …로 줄임), "
            "## How to Test는 프로그램이 넣은 고정 문구 '- 실행 권장: python -m unittest discover -s tests'(강조), 끝 표시와 요청 횟수 1. "
            "아래 범례: 굵은 글자 = 실제 출력의 제목, … = 화면에 맞춰 줄인 부분(전문은 발표자 노트), 주황 = 프로그램이 넣은 고정 문구.")
# evidence/real-output-2026-10-20.txt 원문. 화면 폭을 넘는 PR 불릿만 원문 순서대로 잘라 '…'로 잇는다(preview.cjs가 원문과 대조)
F8_COMMIT = [
    ("=== 검토용 초안: COMMIT ===", "muted mono"),
    ("학습 문서에 실습 메모 추가: AI 생성 커밋 메시지 검토 필요", "ink b"),
    ("", ""),
    ("docs/learning/02-python-ai-api.md 파일 끝에 실습 메모를 추가하여", "ink"),
    ("AI가 생성한 커밋 메시지는 사용자가 검토한 후 적용해야 함을 명시함.", "ink"),
    ("", ""),
    ("=== 끝: 내용을 확인한 뒤 사용하세요 ===", "muted mono"),
    ("AI API 요청 횟수: 1   ← stderr", "muted"),
]
F8_PR = [
    ("=== 검토용 초안: PR ===", "muted mono"),
    ("Title: docs(learning): AI 생성 커밋 메시지 검토 안내 추가", "ink b"),
    ("## Why", "ink mono b"),
    ("- 학습 문서에 … 실습 메모를 명시해 혼동을 줄이기 위해", "ink"),
    ("## What", "ink mono b"),
    ("- docs/learning/02-python-ai-api.md 파일 끝에 … 추가함", "ink"),
    ("## How to Test", "ink mono b"),
    ("- 실행 권장: python -m unittest discover -s tests", "acc"),
    ("=== 끝: 내용을 확인한 뒤 사용하세요 ===", "muted mono"),
    ("AI API 요청 횟수: 1   ← stderr", "muted"),
]


def f8(mobile):
    title = "commit 초안과 PR 초안"
    if not mobile:
        s = Svg(1200, 520, ("main",), F8_LABEL, title)
        panels = [(8, 612, "> python main.py commit", F8_COMMIT, "제목 1줄 · 72자 이하 (이 제목 35자) + 선택 본문"),
                  (632, 560, "> python main.py pr", F8_PR, "Title 80자 이하 (37자) · Why · What · How to Test")]
        for x, w, cmd, rows, note in panels:
            s.rect(x, 8, w, 400, "box-term", 12)
            s.add(f'<path d="M{x} 20a12 12 0 0 1 12-12h{w - 24}a12 12 0 0 1 12 12v30H{x}Z" class="{P}-bar"/>')
            s.text(x + 16, 40, cmd, 20, "ink mono b")
            for i, (t, c) in enumerate(rows):
                if t:
                    if c == "acc":
                        s.rect(x + 8, 74 + i * 32 + 8, w - 16, 32, "box-acc", 6)
                    s.text(x + 16, 104 + i * 32 - (2 if c == "acc" else 0), t, 19, c)
            s.rect(x, 424, w, 44, "box", 10)
            s.text(x + 16, 453, note, 19, "ink")
        s.text(8, 506, "모두 실제 출력 · … = 화면에 맞춰 줄인 부분 (전문은 발표자 노트) · 주황 = 프로그램이 넣은 고정 문구", 19, "muted")
    else:
        s = Svg(360, 940, ("main",), F8_LABEL, title)
        com = [("=== 검토용 초안: COMMIT ===", "muted mono"), ("학습 문서에 실습 메모 추가:", "ink b"),
               ("AI 생성 커밋 메시지 검토 필요", "ink b"), ("↑ 실제로는 한 줄 · 35자", "muted"),
               ("docs/learning/02-python-ai-api.md", "ink"), ("파일 끝에 실습 메모를 추가하여", "ink"),
               ("AI가 생성한 커밋 메시지는 사용자가", "ink"), ("검토한 후 적용해야 함을 명시함.", "ink"),
               ("↑ 본문 2줄을 화면 폭에 맞춰 나눔", "muted"), ("=== 끝 ===  · 요청 횟수 1", "muted mono")]
        pr = [("=== 검토용 초안: PR ===", "muted mono"), ("Title: docs(learning): AI 생성", "ink b"),
              ("커밋 메시지 검토 안내 추가", "ink b"), ("↑ 실제로는 한 줄 · 37자", "muted"),
              ("## Why", "ink mono b"), ("- 학습 문서에 … 실습 메모를", "ink"), ("  명시해 혼동을 줄이기 위해", "ink"),
              ("## What", "ink mono b"), ("- docs/learning/02-python-ai-api.md", "ink"), ("  파일 끝에 … 문구를 추가함", "ink"),
              ("## How to Test", "ink mono b"), ("- 실행 권장: python -m", "acc"), ("  unittest discover -s tests", "acc"),
              ("=== 끝 ===  · 요청 횟수 1", "muted mono")]
        y = 8
        for cmd, rows in (("> python main.py commit", com), ("> python main.py pr", pr)):
            h = 56 + len(rows) * 28
            s.rect(4, y, 352, h, "box-term", 12)
            s.add(f'<path d="M4 {y + 12}a12 12 0 0 1 12-12h328a12 12 0 0 1 12 12v24H4Z" class="{P}-bar"/>')
            s.text(16, y + 27, cmd, 17, "ink mono b")
            for i, (t, c) in enumerate(rows):
                if c == "acc":
                    s.rect(10, y + 46 + i * 28, 340, 28, "box-acc", 4)
                s.text(16, y + 66 + i * 28, t, 16, c)
            y += h + 16
        s.lines(8, y + 16, ["모두 실제 출력", "… = 화면에 맞춰 줄인 부분 (전문은 노트)", "주황 = 프로그램이 넣은 고정 문구"], 16, 26, "muted")
        s.h = y + 86
    return s


FIGS = {"f0-journey": f0, "f1-overview": f1, "f2-why": f2, "f3-diff": f3, "f4-subprocess": f4,
        "f5-result": f5, "f6-context": f6, "f7-api": f7, "f8-drafts": f8}

if __name__ == "__main__":
    for name, fn in FIGS.items():
        for kind in ("desktop", "mobile"):
            save(f"{name}-{kind}.svg", fn(kind == "mobile"))
    print(f"{len(FIGS) * 2} SVG → {os.path.relpath(OUT)}")
