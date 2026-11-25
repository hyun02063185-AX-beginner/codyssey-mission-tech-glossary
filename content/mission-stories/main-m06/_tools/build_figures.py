"""B3-2 미션 스토리(Git의 변경 내용을 AI가 어떻게 설명할까?) SVG 생성기.

PC(desktop, 폭 1200)·모바일(mobile, 폭 360) 그림을 ../assets/ 에 쓴다. v0.2와 r1 개정판은 각각 -v02, -r1 이름으로 함께 생성한다.
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

    def path(self, d, cls="ln", marker="a", transfer=None):
        c = " ".join(f"{P}-{k}" for k in cls.split())
        m = f' marker-end="url(#{P}-{marker})"' if marker else ""
        direction = f' data-transfer="{transfer}"' if transfer else ""
        self.add(f'<path d="{d}" class="{c}"{m}{direction}/>')

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


def f0(mobile, v02=False):
    steps = ([("n", "활용", "AI에 맡길 일"), ("g", "로컬 Git", "수집·판단"),
              ("a", "AI API", "요청·응답"), ("r", "결과", "검증·확인")] if v02 else J_STEPS)
    title = "강의 위치: 활용 → 로컬 Git → AI API → 결과" if v02 else "강의 위치: Git → Python → AI API → 결과"
    label = (title + ". 현재 Scene을 강조한다. 이 띠는 강의 순서를 보여 준다.") if v02 else J_LABEL
    states = ("s1", "s2", "s3", "s4")
    if not mobile:
        s = Svg(1200, 64, states, label, title)
        w, gap = 254, 50
        for i, (k, name, sub) in enumerate(steps):
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
        s = Svg(360, 52, states, label, title)
        w, gap = 80, 12
        for i, (k, name, sub) in enumerate(steps):
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


OBSERVED_DATE = "2026-11-25"
PRACTICE_STATUS = " M README.md"
PRACTICE_MEMO = "실습 메모: AI가 작성한 초안은 사람이 검토한다."
PRACTICE_HUNK = "@@ -76,3 +76,5 @@"
PRACTICE_COMMIT = "README에 실습 메모 문장 추가"
PRACTICE_PR = "Title: README에 'AI 초안은 사람이 검토' 실습 메모 추가"
PRACTICE_CONTEXT = "535자"


def f2(mobile, v02=False, r1=False, v03=False):
    sides = list(F2_SIDES)
    label = F2_LABEL
    if v02:
        head, _, _, tag, quote, notes = F2_SIDES[1]
        steps = ["Python이 Git 변경을 읽는다", "외부 AI에 보내 초안을 받는다", "사람이 확인하고 고친다"]
        sides[1] = ("B3-2 프로그램을 쓸 때" if r1 else head, steps, 1, tag, quote, notes)
        label = (F2_LABEL.split("오른쪽")[0] + "오른쪽은 Python이 로컬 Git 변경을 읽고 외부 AI에 보내 초안을 받는다. "
                 "사람이 확인하고 고친다. 실제 출력의 제목은 학습 문서에 실습 메모 추가: AI 생성 커밋 메시지 검토 필요.")
    if v03:
        direct, steps, highlight, _, quote, notes = sides[0]
        sides[0] = (direct, steps, highlight, "교육용 예시", quote, notes)
        head, steps, highlight, _, _, notes = sides[1]
        sides[1] = (head, steps, highlight, f"실제 B3-2 출력 · {OBSERVED_DATE}", [PRACTICE_COMMIT], notes)
        label = (label.split("실제 출력의 제목")[0] +
                 f"실제 출력({OBSERVED_DATE})의 제목은 '{PRACTICE_COMMIT}'로, 무엇이 바뀌었는지 드러난다.")
    title = "변경 설명을 직접 쓸 때와 AI 초안을 쓸 때"
    if not mobile:
        s = Svg(1200, 470, ("main",), label, title)
        for i, (head, steps, hl, tag, quote, notes) in enumerate(sides):
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
            s.lines(x + 44, 400 if i == 0 else 382 if v03 else 418, notes, 19, 26, "muted")
    else:
        s = Svg(360, 720, ("main",), label, title)
        for i, (head, steps, hl, tag, quote, notes) in enumerate(sides):
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
            s.lines(26, y0 + (292 if i == 0 else 286 if v03 else 314), notes, 16, 24, "muted")
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


def f3(mobile, v03=False):
    label, notes = F3_LABEL, F3_NOTES
    if v03:
        label = (f"{OBSERVED_DATE} README.md 변경 재현. git status --short는 '{PRACTICE_STATUS}'를 보여 준다. "
                 f"M은 add 전이라 오른쪽 칸에 있다. {PRACTICE_HUNK}는 76번째 줄부터 3줄이 5줄로 바뀌었음을 표시한다. "
                 f"앞 문맥 세 줄에 이어 빈 줄과 '{PRACTICE_MEMO}'가 추가되었고 뒤 문맥은 없다. "
                 "git diff --cached는 이번에는 출력이 없다.")
        notes = [
            (1, "M", ["고친 파일", "add 전 · 오른쪽 칸"]),
            (5, "@@", ["위치 표시", "76번째 줄부터 · 3줄 → 5줄"]),
            (7, "빈칸", ["그대로인 주변 줄", "앞 3줄 · 뒤쪽은 없음"]),
            (9, "+", ["새로 생긴 줄", "이번 변경은 2줄 (빈 줄 먼저)"]),
            (None, "-", ["지워진 줄", "이번 변경에는 없다"]),
            (13, "--cached", ["git add한 변경", "이번에는 없다 · Lab 03에서 비교"]),
        ]
    title = "Git은 무엇이 변경됐는지 알고 있다"
    if not mobile:
        s = Svg(1200, 520, ("main",), label, title)
        s.rect(16, 12, 780, 496, "box-term", 12)
        s.add(f'<path d="M16 24a12 12 0 0 1 12-12h756a12 12 0 0 1 12 12v24H16Z" class="{P}-bar"/>')
        s.text(36, 38, "터미널 · 재현 2026-11-25 · Owner 실행과 같은 변경" if v03 else "터미널 · 연습 저장소 (재현 · 긴 줄은 …로 줄임)", 19, "muted")
        y0, lh = 90, 30
        rows = F3_ROWS if not v03 else [
            ("$ git status --short", "cmd"), (PRACTICE_STATUS, "out"), ("$ git diff", "cmd"),
            ("diff --git a/README.md b/README.md", "out"), ("··· index · --- · +++ 3줄 생략 ···", "cut"),
            (f"{PRACTICE_HUNK} python -m unittest …", "hunk"), (" ```", "ctx"), (" ", "ctx"),
            (" macOS에서는 `python3`를 사용하세요. …", "ctx"), ("+", "add"), ("+" + PRACTICE_MEMO, "add"),
            ("(파일 끝 · 뒤쪽 주변 줄 없음)", "cut"), ("$ git diff --cached", "cmd"), ("(출력 없음)", "cut"),
        ]
        for i, (t, k) in enumerate(rows):
            y = y0 + i * lh
            if k == "add":
                s.rect(24, y - 22, 764, 30, "hlrow", 4)
            term_row(s, 36, y, t, k, 19)
            if v03 and i == 10:
                s.path(f"M36 {y + 4}H435", "ln-acc", None)
        ny = [96, 166, 236, 306, 376, 446]
        for j, (row, mark, desc) in enumerate(notes):
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
        if v03:
            rows = [
                ("$ git status --short", "cmd"), (PRACTICE_STATUS, "out"), ("$ git diff", "cmd"),
                ("diff --git a/README.md b/README.md", "out"), ("··· index · --- · +++ 생략 ···", "cut"),
                (f"{PRACTICE_HUNK} …", "hunk"), (" ```", "ctx"), (" ", "ctx"),
                (" macOS에서는 … 않습니다.", "ctx"), ("+", "add"),
                ("+실습 메모: AI가 작성한", "add"), ("  초안은 사람이 검토한다.", "add"),
                ("↑ 실제로는 한 줄 · 파일 끝", "cut"), ("$ git diff --cached", "cmd"), ("(출력 없음)", "cut"),
            ]
        extra = 60 if v03 else 0
        s = Svg(360, 860 + extra, ("main",), label, title)
        s.rect(4, 8, 352, 452 + extra, "box-term", 12)
        s.add(f'<path d="M4 20a12 12 0 0 1 12-12h328a12 12 0 0 1 12 12v22H4Z" class="{P}-bar"/>')
        s.text(16, 32, "터미널 · 재현 (화면 폭에 맞춰 줄임)", 16, "muted")
        for i, (t, k) in enumerate(rows):
            y = 72 + i * 30
            if k == "add":
                s.rect(10, y - 20, 340, 30, "hlrow", 4)
            term_row(s, 16, y, t, k, 16)
            if v03 and i in (10, 11):
                s.path(f"M16 {y + 4}H215", "ln-acc", None)
        s.text(16, 496 + extra, "읽는 법", 18, "ink b")
        for j, (row, mark, desc) in enumerate(notes):
            y = 532 + extra + j * 52
            s.text(16, y, mark, 17, "acc mono")
            s.text(104, y, desc[0], 16, "ink b")
            s.text(104, y + 23, desc[1], 16, "muted")
    if v03:
        if mobile:
            s.text(16, 903, "재현 · 2026-11-25 · Owner 실행과 같은 변경", 16, "muted")
    return s


# ---------------------------------------------------------------- F4 argparse → subprocess → 운영체제 → Git
F4_LABEL = ("python main.py commit을 입력했을 때의 흐름. 1 argparse가 명령줄 입력을 읽어 commit이면 커밋 메시지 초안, pr이면 PR 초안을 만들기로 정한다. "
            "2 subprocess.run에는 실행할 프로그램과 명령을 Python 리스트로 전달한다. git은 실행할 프로그램, diff는 Git에 전달할 명령이다. …는 예시의 인수 생략 표시다. 셸을 거치지 않고 운영체제를 통해 Git을 실행한다(shell=False). 3 운영체제가 git 프로그램을 새 프로세스로 실행한다. "
            "4 Git이 저장소를 읽고 결과를 돌려준다. 강조 이름표: 여기서 commit은 만들 초안의 종류이며 git commit을 실행하지 않는다. "
            "아래 띠: 실제로 실행하는 Git 명령은 rev-parse, branch, status 두 번, diff, diff --cached의 여섯 번이고 commit·push는 없다.")
F4_BOXES = [
    ("p", "argparse", ["명령줄 입력을 읽는다", "commit → 커밋 메시지 초안", "pr → PR 초안"]),
    ("p", "subprocess.run()", ['["git", "diff", …]', "git: 실행할 프로그램", "diff: Git에 전달할 명령", "Python 리스트로 전달", "셸 없이 운영체제로 실행"]),
    ("n", "운영체제", ["git 프로그램을", "새 프로세스로 실행", "(Windows · macOS)"]),
    ("g", "Git", ["저장소를 읽고", "결과를 돌려준다", "→ 다음 화면"]),
]


def f4(mobile, v02=False, r1=False):
    title = "Python이 Git을 실행하는 길"
    boxes = F4_BOXES
    label = F4_LABEL
    if r1:
        boxes = [
            ("p", "argparse", ["사람 → 프로그램", "입력을 읽고 초안을 선택"]),
            ("p", "subprocess.run()", ["프로그램 → Git", "Git 명령을 실행"]),
            ("g", "로컬 Git", ["내 컴퓨터의 저장소에서", "상태와 바뀐 줄을 읽는다"]),
            ("p", "Python", ["Git이 돌려준 결과를 받는다", "다음 화면에서 결과 확인"]),
        ]
        label = ("사용자가 python main.py commit을 입력한다. argparse는 입력을 읽고, subprocess.run()은 로컬 Git을 실행한다. "
                 "Git은 상태와 바뀐 줄을 읽어 Python에 돌려준다. commit은 만들 초안의 종류다.")
    if not mobile:
        s = Svg(1200, 500, ("main",), label, title)
        s.rect(16, 16, 420, 58, "box-term", 10)
        s.text(36, 54, "> python main.py commit", 24, "ink mono b")
        s.path("M226 76V122", "ln", "a")
        w, gap = 266, 26
        for i, (k, head, lines) in enumerate(boxes):
            x = 16 + i * (w + gap)
            s.rect(x, 126, w, 196, {"p": "box-p", "g": "box-g", "n": "box"}[k], 12)
            s.num(i + 1, x + 30, 158, 15)
            s.text(x + 56, 166, head, 20 if v02 and "." in head else 22, "ink b mono" if "." in head else "ink b")
            for j, t in enumerate(lines):
                s.text(x + 18, 198 + j * 24, t, 19, "ink mono" if t.startswith("[") else "muted")
            if i < 3:
                s.path(f"M{x + w + 2} 224H{x + w + gap - 2}", "ln", "a")
        s.rect(16, 346, 600, 56, "box-acc", 10)
        s.text(36, 382, "commit은 초안의 종류다 · git commit을 실행하지 않는다", 21, "ink b")
        s.path("M150 324V344", "ln-acc", None)
        s.rect(16, 422, 1168, 62, "box", 10)
        s.text(36, 449, "실제로 실행하는 Git 명령 6번: rev-parse · branch · status ×2 · diff · diff --cached", 19, "ink")
        s.text(36, 474, "변경을 기록하거나(commit) 보내는(push) 명령은 없다.", 19, "muted")
    else:
        s = Svg(360, 808, ("main",), label, title)
        s.rect(4, 8, 352, 48, "box-term", 10)
        s.text(18, 39, "> python main.py commit", 18, "ink mono b")
        y = 76
        for i, (k, head, lines) in enumerate(boxes):
            box_height = 116 + max(0, len(lines) - 3) * 24
            s.rect(4, y, 352, box_height, {"p": "box-p", "g": "box-g", "n": "box"}[k], 12)
            s.num(i + 1, 28, y + 26, 13)
            s.text(50, y + 33, head, 19, "ink b mono" if "." in head else "ink b")
            for j, t in enumerate(lines):
                s.text(18, y + 62 + j * 24, t, 16, "ink mono" if t.startswith("[") else "muted")
            if i < 3:
                s.path(f"M180 {y + box_height + 2}V{y + box_height + 16}", "ln", "a")
            y += box_height + 18
        y = y + 6 if r1 else 666
        s.rect(4, y, 352, 62, "box-acc", 10)
        s.lines(18, y + 25, ["commit은 초안의 종류다", "git commit을 실행하지 않는다"], 17, 24, "ink b")
        s.lines(16, y + 90, ["실행하는 Git 명령 6번 (commit·push 없음)", "rev-parse · branch · status ×2 · diff ×2"], 16, 26, "muted")
    return s


# ---------------------------------------------------------------- F5 stdout · stderr · returncode
F5_LABEL = ("subprocess.run()을 실행하면 CompletedProcess 실행 결과 객체가 반환된다. stdout(표준 출력), stderr(표준 오류 출력), returncode(종료 코드)는 이 객체의 속성이다. "
            "stdout의 실제 값은 저장소 안에서 ' M docs/learning/02-python-ai-api.md', stderr의 실제 값은 저장소 밖에서 'fatal: not a git repository …'다. returncode는 안 0, 밖 128이다. "
            "Python의 처리 로직: returncode가 0인지 먼저 검사한다. 0이 아니면 오류를 알리고 멈춘다. 성공하면 stdout을 읽어 변경 여부를 판단한다. 변경이 없으면 종료, 있으면 다음 Scene의 데이터를 만든다. "
            "stderr의 내용만으로 실패를 판단하지 않는다. 기본 check=False에서는 0이 아닌 종료 코드에 대해 자동으로 예외를 내지 않으므로 B3-2가 직접 검사한다.")
F5_CARDS = [
    ("stdout", "표준 출력", " M docs/learning/02-python-ai-api.md", "저장소 안 · 실제 값"),
    ("stderr", "표준 오류 출력", "fatal: not a git repository …", "저장소 밖 · 실제 값"),
    ("returncode", "종료 코드", "0 = 성공 · 0이 아님 = 실패", "실제: 안 0 · 밖 128"),
]


def f5(mobile):
    title = "subprocess.run() 실행 결과와 Python의 처리 로직"
    if not mobile:
        s = Svg(1200, 500, ("main",), F5_LABEL, title)
        node(s, 16, 166, 150, 104, "g", "Git", ["명령 끝"])
        s.text(214, 25, "실행 결과 객체 · CompletedProcess", 19, "ink b")
        for i, (name, sub, val, note) in enumerate(F5_CARDS):
            y = 42 + i * 146
            s.rect(214, y, 440, 128, "box-acc" if name == "returncode" else "box", 12)
            s.text(232, y + 36, name, 22, "acc mono" if name == "returncode" else "ink mono b")
            s.text(232 + (148 if name == "returncode" else 92), y + 36, sub, 19, "muted")
            s.text(232, y + 76, val, 19, "ink" if name == "returncode" else "ink mono", "start")
            s.text(232, y + 110, note, 19, "muted")
            s.path(f"M168 218C190 218 190 {y + 64} 210 {y + 64}", "ln", "a")
        s.path("M656 416H680V58H700", "ln-acc", "a-acc")
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
        s.lines(720, 420, ["기본 check=False: 종료 코드를 직접 확인", "0이 아니면 B3-2가 오류를 알리고 멈춘다."], 19, 28, "ink")
    else:
        s = Svg(360, 860, ("main",), F5_LABEL, title)
        s.rect(4, 8, 352, 70, "box-p", 12)
        s.text(18, 37, "subprocess.run() 반환값", 19, "ink b")
        s.text(18, 63, "실행 결과 객체의 세 속성", 16, "muted")
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
        s.lines(16, y + 18, ["기본 check=False: 종료 코드를 직접 확인", "0이 아니면 B3-2가 오류를 알리고 멈춘다."], 16, 24, "ink")
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


def f6(mobile, v02=False):
    gates = ([("1", "위험 경로·개인키", ["위험 경로·불완전한 개인키", "→ 전송 중단"]),
              ("2", "감지된 이메일·토큰 등", ["→ [REDACTED]로 가림"]),
              ("3", "16,000자 초과", ["→ 모든 모드에서 전송 중단"])] if v02 else F6_GATE)
    excluded = "Git 문맥에서 제외" if v02 else "보내지 않는 것"
    key = "API 키 (인증 헤더)" if v02 else "API 키"
    label = (F6_LABEL.split("가운데 안전 검사")[0] + "기본 검사는 위험 경로와 불완전한 개인키 블록을 차단하고 일부 값을 가린다. "
             "16,000자 초과는 어떤 모드에서도 차단한다. 806자는 재현 문맥의 길이다. API 키는 이 문맥 대신 인증 헤더에 사용한다.") if v02 else F6_LABEL
    title = "AI에게 보내는 데이터와 안전 검사"
    if not mobile:
        s = Svg(1200, 520, ("main",), label, title)
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
        for n, head, lines in gates:
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
        s.text(988, 256, excluded, 20, "ink b")
        s.lines(988, 296, ["새 파일의 내용", "바뀌지 않은 파일", key], 19, 34, "ink")
    else:
        s = Svg(360, 1064, ("main",), label, title)
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
        for n, head, lines in gates:
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
        s.text(18, 982, excluded, 18, "ink b")
        s.lines(18, 1012, ["새 파일의 내용 · 바뀌지 않은 파일", key], 16, 26, "ink")
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


def f8(mobile, r1=False, v03=False):
    title = "commit 초안과 PR 초안"
    label = F8_LABEL
    if v03:
        label = (f"README.md 변경으로 생성한 {OBSERVED_DATE} 실제 초안. COMMIT 제목은 {PRACTICE_COMMIT!r}, "
                 f"PR 제목은 {PRACTICE_PR!r}. 두 글은 같은 Git 문맥에 서로 다른 작성 규칙을 적용했다. "
                 "PR의 How to Test는 Python이 넣은 실행 권장 문구이며, 요청 횟수 1은 stderr로 나왔다.")
    if r1:
        label += " 프로그램은 같은 Git 문맥이면 user를 그대로 쓰고, 명령에 따라 system 작성 규칙을 바꾼다."
    rule_labels = ("system · 커밋 작성 규칙", "system · PR 작성 규칙")
    context_label = "같은 Git 문맥이면 user는 같다"
    commit_rows, pr_rows = F8_COMMIT, F8_PR
    date = f" · {OBSERVED_DATE}" if v03 else ""
    if v03:
        commit_rows = [
            F8_COMMIT[0], (PRACTICE_COMMIT, "ink b"), ("", ""),
            ('README.md 마지막에 "실습 메모: AI가 작성한 초안은', "ink"),
            ('사람이 검토한다." 문장을 새 줄로 추가함.', "ink"),
            ("↑ 본문은 실제로 한 줄 · 화면 폭에 맞춰 나눔", "muted"), *F8_COMMIT[-2:],
        ]
        pr_rows = [
            F8_PR[0], (PRACTICE_PR, "ink b"), F8_PR[2],
            ("- AI가 작성한 초안에 대해 … 알리기 위해 변경했습니다.", "ink"), F8_PR[4],
            ("- README.md 파일 끝에 … 문구를 추가했습니다.", "ink"), *F8_PR[6:],
        ]
    if not mobile:
        s = Svg(1200, 512 if r1 else 520, ("main",), label, title)
        panels = [(8, 612, "> python main.py commit", commit_rows, "제목 1줄 · 72자 이하 (이 제목 35자) + 선택 본문"),
                  (632, 560, "> python main.py pr", pr_rows, "Title 80자 이하 (37자) · Why · What · How to Test")]
        offset = 52 if r1 else 0
        if r1:
            s.rect(8, 8, 1184, 44, "box-p", 10)
            s.text(24, 39, f"프로그램 동작 · {context_label}", 20, "tp")
        for (x, w, cmd, rows, note), rule in zip(panels, rule_labels):
            s.rect(x, 8 + offset, w, 400, "box-term", 12)
            s.add(f'<path d="M{x} {20 + offset}a12 12 0 0 1 12-12h{w - 24}a12 12 0 0 1 12 12v30H{x}Z" class="{P}-bar"/>')
            s.text(x + 16, 40 + offset, cmd, 20, "ink mono b")
            if r1:
                s.text(x + w - 16, 40 + offset, rule, 19, "tp", "end")
            for i, (t, c) in enumerate(rows):
                if t:
                    if c == "acc":
                        s.rect(x + 8, 74 + i * 32 + 8 + offset, w - 16, 32, "box-acc", 6)
                    text_y = 104 + offset + i * 32 - (2 if c == "acc" else 0)
                    s.text(x + 16, text_y, t, 19, c)
                    if v03 and t in (commit_rows[3][0], commit_rows[4][0]):
                        x1, x2 = (x + 214, x + 449) if i == 3 else (x + 16, x + 134)
                        s.path(f"M{x1} {text_y + 4}H{x2}", "ln-acc", None)
            if not r1:
                s.rect(x, 424, w, 44, "box", 10)
                s.text(x + 16, 453, note, 19, "ink")
        s.text(8, 488 if r1 else 506, f"모두 실제 출력{date} · … = 화면에 맞춰 줄인 부분 (전문은 발표자 노트) · 주황 = 프로그램이 넣은 고정 문구", 19, "muted")
    else:
        s = Svg(360, 940, ("main",), label, title)
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
        if v03:
            com = [
                commit_rows[0], commit_rows[1], ("README.md 마지막에", "ink"),
                ('"실습 메모: AI가 작성한 초안은', "ink"), ('사람이 검토한다." 문장을', "ink"),
                ("새 줄로 추가함.", "ink"), ("↑ 본문은 실제로 한 줄", "muted"), *commit_rows[-2:],
            ]
            pr = [
                pr_rows[0], ("Title: README에 'AI 초안은", "ink b"), ("사람이 검토' 실습 메모 추가", "ink b"),
                ("↑ 실제로는 한 줄 · 32자", "muted"), pr_rows[2],
                ("- AI가 작성한 초안에 대해 …", "ink"), ("알리기 위해 변경했습니다.", "ink"),
                pr_rows[4], ("- README.md 파일 끝에 …", "ink"), ("문구를 추가했습니다.", "ink"),
                pr_rows[6], ("- 실행 권장: python -m", "acc"), ("  unittest discover -s tests", "acc"),
                *pr_rows[-2:],
            ]
        y = 8
        if r1:
            s.rect(4, y, 352, 58, "box-p", 10)
            s.lines(16, y + 23, ["프로그램 동작", context_label], 16, 23, "tp")
            y += 70
        for (cmd, rows), rule in zip((("> python main.py commit", com), ("> python main.py pr", pr)), rule_labels):
            if r1:
                s.text(16, y + 18, rule, 16, "tp")
                y += 28
            h = 56 + len(rows) * 28
            s.rect(4, y, 352, h, "box-term", 12)
            s.add(f'<path d="M4 {y + 12}a12 12 0 0 1 12-12h328a12 12 0 0 1 12 12v24H4Z" class="{P}-bar"/>')
            s.text(16, y + 27, cmd, 17, "ink mono b")
            for i, (t, c) in enumerate(rows):
                if c == "acc":
                    s.rect(10, y + 46 + i * 28, 340, 28, "box-acc", 4)
                text_y = y + 66 + i * 28
                s.text(16, text_y, t, 16, c)
                if v03 and cmd.endswith("commit") and i in (3, 4):
                    s.path(f"M16 {text_y + 4}H{234 if i == 3 else 137}", "ln-acc", None)
            y += h + 16
        s.lines(8, y + 16, [f"모두 실제 출력{date}", "… = 화면에 맞춰 줄인 부분 (전문은 노트)", "주황 = 프로그램이 넣은 고정 문구"], 16, 26, "muted")
        s.h = y + 86
    return s


def f1_v02(mobile, r1=False):
    title = "로컬 Python과 외부 AI API"
    label = ("Python이 현재 폴더의 Git을 실행해 변경을 읽는다. 검사한 문맥은 Python에서 외부 AI API로 HTTPS 요청을 통해 나간다. "
             "응답 JSON은 반대 방향으로 Python에 돌아온다. Python은 초안을 검증해 터미널에 출력하고, 사람이 확인한 뒤 사용한다. "
             "외부 경계는 API를 둘러싸며 모델 실행 위치는 미확인이다.")
    if r1:
        label = label.rsplit(" 외부 경계", 1)[0]
    if not mobile:
        s = Svg(1200, 448, STATES_OVERVIEW, label, title)
        s.rect(12, 8, 702, 338, "zone", 16)
        s.text(32, 36, "내 컴퓨터 · 로컬", 20, "muted b")
        s.rect(836, 8, 352, 338, "zone-ext", 16)
        s.text(854, 36, "외부 서비스", 20, "muted b")
        node(s, 30, 53, 227, 104, "g", "로컬 Git", ["변경 파일과 바뀐 줄"], keys="s1 s2")
        node(s, 373, 53, 323, 126, "p", "Python 프로그램", ["Git 결과 수집과 검사", "API 요청 · 응답 읽기"], keys="s1 s2 s3")
        node(s, 852, 53, 320, 126, "a", "코디세이 AI API", ["HTTPS 요청을 받는 창구", "응답 JSON을 반환"], keys="s1 s3")
        node(s, 373, 215, 323, 110, "r", "검토용 초안", ["검증 뒤 터미널에 출력"], keys="s4 return")
        node(s, 30, 215, 227, 110, "n", "사용자", ["내용을 확인하고 활용"], keys="s4 return")
        s.group("g k-s1 k-s2")
        s.path("M371 83H260")
        s.path("M259 128H369")
        s.text(276, 75, "Git 실행", 19, "ink")
        s.text(276, 151, "변경 결과", 19, "muted")
        s.end()
        s.group("g k-s1 k-s3")
        s.path("M698 83H849", "ln-acc", "a-acc", "request")
        s.path("M850 134H700", "ln", "a", "response")
        s.text(729, 73, "요청", 20, "acc")
        s.text(723, 160, "응답 JSON", 19, "ink")
        if not r1:
            s.text(855, 223, "모델 실행 위치 미확인", 19, "muted")
        s.end()
        s.group("g k-s4 k-return")
        s.path("M535 181V212")
        s.path("M371 270H260")
        s.text(277, 261, "사람 확인", 19, "ink")
        s.end()
        s.group("in-all in-s1 in-s2 in-s3 in-s4")
        s.text(30, 384, "실선 = 실행·데이터 전달    점선 테두리 = 외부 서비스 경계", 20, "muted")
        s.text(30, 418, "로컬 Python이 외부 API에 요청하고, 돌아온 응답을 검증해 초안을 출력한다.", 22, "ink b")
        s.end()
        s.group("in-return")
        for i, (n, head, sub) in enumerate(GATES):
            x = 16 + i * 396
            s.rect(x, 362, 376, 78, "box-acc" if i else "box-r")
            s.num(n, x + 27, 389, 14)
            s.text(x + 51, 396, head, 20, "ink b")
            s.text(x + 17, 425, sub, 19, "muted")
        s.end()
    else:
        s = Svg(360, 718, STATES_OVERVIEW, label, title)
        s.rect(4, 8, 352, 280, "zone", 14)
        s.text(16, 33, "내 컴퓨터 · 로컬", 16, "muted b")
        node(s, 16, 48, 127, 104, "g", "Git", ["파일·변경 수집"], 16, 19, keys="s1 s2", bsize=14)
        node(s, 187, 48, 157, 104, "p", "Python", ["Git 실행·검사", "요청·응답"], 16, 19, keys="s1 s2 s3", bsize=14)
        s.group("g k-s1 k-s2")
        s.path("M185 81H146")
        s.path("M145 116H184")
        s.end()
        node(s, 16, 184, 124, 92, "n", "사용자", ["내용 확인"], 16, 19, keys="s4 return")
        node(s, 170, 184, 111, 92, "r", "", ["터미널 출력"], 16, 19, keys="s4 return", bsize=13)
        s.group("g k-s4 k-return")
        s.path("M223 154V181")
        s.path("M168 228H143")
        s.end()
        s.rect(4, 351, 352, 147, "zone-ext", 14)
        s.text(16, 377, "외부 서비스", 16, "muted b")
        node(s, 16, 391, 328, 95, "a", "코디세이 AI API", ["응답 JSON을 반환" if r1 else "모델 실행 위치 미확인"], 16, 19, keys="s1 s3", bsize=14)
        s.group("g k-s1 k-s3")
        s.path("M299 154V388", "ln-acc", "a-acc", "request")
        s.path("M326 389V156", "ln", "a", "response")
        s.text(202, 313, "요청 → API", 16, "acc")
        s.text(177, 338, "응답 → Python", 16, "ink")
        s.end()
        s.group("in-all in-s1 in-s2 in-s3 in-s4")
        s.lines(16, 537, ["Python이 검사한 변경을 API에 보낸다.", "응답은 Python이 읽고 검증한다.", "사용자는 출력된 초안을 확인한다."], 16, 29, "ink")
        s.lines(16, 643, ["실선 = 실행·데이터 전달", "점선 테두리 = 외부 서비스 경계"], 16, 26, "muted")
        s.end()
        s.group("in-return")
        for i, (n, head, sub) in enumerate(GATES):
            y = 508 + i * 68
            s.rect(4, y, 352, 62, "box-acc" if i else "box-r")
            s.num(n, 27, y + 20, 13)
            s.text(49, y + 26, head, 17, "ink b")
            s.text(17, y + 51, sub, 16, "muted")
        s.end()
    return s


def f7_v02(mobile):
    title = "Python과 외부 AI API의 요청·응답"
    label = ("로컬 Python에서 외부 코디세이 AI API로 향하는 첫 번째 실선 화살표는 HTTPS POST 요청이다. 인증 헤더와 JSON 본문이 함께 간다. "
             "본문은 모델 ID와 메시지 두 개를 담고, system은 작성 규칙, user는 검사한 Git 문맥이다. "
             "외부 API에서 Python으로 돌아오는 두 번째 실선 화살표는 응답 JSON이다. Python은 choices[0].message.content의 초안 텍스트를 읽어 다음 검증으로 넘긴다. "
             "요청 구조는 재현이며 모델은 2026-10-20의 실행 설정이다. 모델 실행 위치는 미확인이다.")
    if not mobile:
        s = Svg(1200, 450, ("main",), label, title)
        s.rect(8, 8, 652, 394, "zone", 14)
        s.text(25, 38, "내 컴퓨터 · Python", 21, "tp")
        s.rect(24, 54, 620, 191, "box-p")
        s.text(42, 86, "요청 구성 · HTTPS POST", 23, "tp")
        s.text(42, 117, "Authorization: Bearer ••••", 20, "ink mono")
        s.text(382, 117, "환경변수의 API 키", 19, "muted")
        s.text(42, 150, "JSON 본문  ·  model: gpt-5-mini", 20, "ink")
        s.text(42, 181, "messages", 20, "ink mono b")
        s.text(156, 181, "system · 작성 규칙", 20, "ink")
        s.text(156, 215, "user · 검사한 Git 문맥", 20, "ink")
        s.rect(24, 263, 620, 122, "box-r")
        s.text(42, 296, "응답에서 초안 읽기", 23, "tr")
        s.text(42, 330, "choices[0].message.content", 20, "ink mono")
        s.text(42, 361, "꺼낸 초안 텍스트 → 다음 장면의 형식 검증", 19, "muted")
        s.rect(878, 8, 314, 394, "zone-ext", 14)
        s.text(895, 38, "외부 서비스", 20, "muted b")
        node(s, 896, 69, 278, 282, "a", "코디세이 AI API", ["HTTPS 요청 수신", "JSON 응답 반환"], keys="", tsize=22)
        s.text(913, 316, "모델 실행 위치 미확인", 19, "muted")
        s.path("M646 135H893", "ln-acc", "a-acc", "request")
        s.path("M894 316H648", "ln", "a", "response")
        s.text(676, 121, "① 요청 · HTTPS POST", 19, "acc")
        s.text(676, 344, "② 응답 · JSON", 19, "ink b")
        s.text(24, 434, "요청 구조 재현 · 모델 ID는 2026-10-20 실제 실행 설정", 19, "muted")
    else:
        s = Svg(360, 636, ("main",), label, title)
        s.rect(4, 8, 352, 379, "zone", 14)
        s.text(16, 34, "내 컴퓨터 · Python", 17, "tp")
        s.rect(12, 47, 336, 185, "box-p")
        s.text(25, 73, "요청 구성 · HTTPS POST", 18, "tp")
        s.text(25, 102, "Authorization: Bearer ••••", 16, "ink mono")
        s.text(25, 126, "인증 헤더에 환경변수의 API 키", 16, "muted")
        s.text(25, 154, "JSON 본문 · model: gpt-5-mini", 16, "ink")
        s.text(25, 181, "messages  system · 작성 규칙", 16, "ink")
        s.text(106, 207, "user · 검사한 Git 문맥", 16, "ink")
        s.rect(12, 246, 336, 123, "box-r")
        s.text(25, 274, "응답에서 초안 읽기", 18, "tr")
        s.text(25, 305, "choices[0].message.content", 16, "ink mono")
        s.text(25, 338, "초안 텍스트 → 다음 장면의 형식 검증", 16, "muted")
        s.rect(4, 461, 352, 113, "zone-ext", 14)
        s.text(16, 487, "외부 서비스 · 코디세이 AI API", 17, "ink b")
        s.text(16, 514, "HTTPS 요청 수신 · JSON 응답 반환", 16, "ink")
        s.text(16, 548, "모델 실행 위치 미확인", 16, "muted")
        s.path("M63 389V458", "ln-acc", "a-acc", "request")
        s.path("M288 459V391", "ln", "a", "response")
        s.text(78, 427, "① 요청", 17, "acc")
        s.text(273, 427, "② 응답 JSON", 17, "ink b", "end")
        s.lines(16, 600, ["요청 구조 재현", "모델 ID는 2026-10-20 실제 실행 설정"], 16, 23, "muted")
    return s


def f5_r1(mobile, v03=False):
    title = "Git이 돌려준 결과와 Python의 판단"
    label = ("Git이 돌려준 종료 코드, 표준 출력, 표준 오류 출력의 재현 예시. "
             "Python은 먼저 종료 코드가 0인지 확인한다. 실패했거나 성공해도 변경이 없으면 AI에 보내지 않는다. "
             "변경이 있을 때만 내 컴퓨터 밖으로 보낼 글을 만든다.")
    if v03:
        label += f" 저장소 안 상태 B의 stdout은 {PRACTICE_STATUS!r}이다."
    s = Svg(360 if mobile else 1200, 834 if mobile else 500, label=label, title=title)
    s.text(16, 30, "Git이 돌려준 결과 세 가지", 22, "ink b")
    cards = [
        ("returncode · 종료 코드", "0 = 성공 · 0이 아님 = 실패", "재현: 안 0 · 밖 128"),
        ("stdout · 표준 출력", PRACTICE_STATUS if v03 else "M docs/…/02-python-ai-api.md", "저장소 안 · 재현 (상태 B)" if v03 else "저장소 안 · 재현"),
        ("stderr · 표준 오류 출력", "fatal: not a git repository …", "저장소 밖 · 재현"),
    ]
    for i, (name, value, note) in enumerate(cards):
        x, y, w = (4, 46 + i * 112, 352) if mobile else (8 + i * 396, 49, 376)
        s.rect(x, y, w, 98, "box-acc" if i == 0 else "box")
        s.text(x + 14, y + 27, name, 19, "acc" if i == 0 else "ink b")
        s.text(x + 14, y + 55, value, 19, "ink" if i == 0 else "ink mono")
        s.text(x + 14, y + 81, note, 19, "muted")
    steps = [
        ("① 종료 코드가 0인가?", ["아니요 → 오류를 알리고 종료", "AI 요청 0회"]),
        ("② 변경이 있나?", ["없음 → 변경 사항이 없습니다", "AI 요청 0회"]),
        ("있음 → 다음으로", ["내 컴퓨터 밖으로 보낼 글을 만든다", "다음 · Scene 3"]),
    ]
    for i, (head, lines) in enumerate(steps):
        x, y, w = (4, 394 + i * 126, 352) if mobile else (8 + i * 408, 208, 368)
        s.rect(x, y, w, 98, "box-p" if i == 2 else "box-acc")
        s.text(x + 14, y + 28, head, 20, "ink b")
        s.lines(x + 14, y + 56, lines, 19, 25, "muted")
        if i < 2:
            if mobile:
                s.path(f"M32 {y + 100}V{y + 123}")
                s.text(48, y + 119, ["예", "있음"][i], 16, "ink b")
            else:
                s.path(f"M{x + w + 2} 253H{x + 406}")
                s.text(x + w + 19, 240, ["예", "있음"][i], 19, "ink b", "middle")
    if mobile:
        s.path("M32 370V391")
        s.lines(16, 781, ["값 · 연습 저장소에서 재현", "판단 순서 · B3-2 프로그램 구현"], 17, 25, "muted")
    else:
        s.path("M160 149V205", "ln-acc", "a-acc")
        s.text(8, 361, "값 · 연습 저장소에서 재현    판단 순서 · B3-2 프로그램 구현", 19, "muted")
    return s


def f6_r1(mobile, v03=False):
    title = "외부 AI에 보내기 전에 검사할 글"
    label = ("브랜치, 상태와 바뀐 파일 이름, 새 파일 이름, 바뀐 줄을 보낼 글에 담는다. 새 파일 내용, 바뀌지 않은 파일, API 키는 이 글에 넣지 않는다. "
             "기본 검사는 이메일과 토큰처럼 보이는 값을 가린 뒤 계속하고, 비밀 파일로 보이는 경로가 있으면 전송을 멈춘다. "
             "검사를 마친 글이 다음 요청의 user 메시지가 된다. 재현 예시에서는 806자이며 가릴 값은 없었다.")
    if v03:
        label = label.replace("재현 예시에서는 806자이며 가릴 값은 없었다.",
                              f"{OBSERVED_DATE} 실행에서는 {PRACTICE_CONTEXT}였고 가릴 값은 없었다.")
    s = Svg(360 if mobile else 1200, (710 if v03 else 560) if mobile else 500, label=label, title=title)
    s.text(16, 29, "내 컴퓨터 밖으로 나갈 글", 22, "ink b")
    if mobile:
        s.rect(4, 42, 352, 104, "box-p")
        s.text(16, 68, "보낼 글에 담는 것", 17, "tp")
        s.lines(16, 93, ["브랜치 · 상태 · 바뀐 파일 이름", "새 파일 이름 · 바뀐 줄(diff)"], 16, 21 if v03 else 24)
        if v03:
            s.text(16, 136, "git add 전후 변경을 함께 읽음", 16)
        s.add('<g data-topic="excluded-context">')
        s.rect(4, 152, 352, 79, "box")
        s.text(16, 175, "넣지 않는 것", 16, "muted b")
        s.lines(16, 197, ["새 파일 내용 · 바뀌지 않은 파일", "API 키 → 다음 화면의 인증 헤더"], 16, 21)
        s.end()
        s.path("M22 234V253")
        s.rect(4, 256, 352, 127, "box-acc")
        s.text(16, 280, "보내기 전 검사 · 기본으로 켜짐", 16, "acc")
        s.lines(16, 305, ["가리고 계속 · 이메일·토큰 → [REDACTED]", "전송 멈춤 · 비밀 파일 경로 등", "멈추면 AI 요청 0회"], 16, 22, "ink")
        s.path("M22 386V405")
        s.add('<g data-topic="prepared-context">')
        s.rect(4, 408, 352, 96, "box-r")
        s.text(16, 435, "검사를 마친 글", 18, "tr")
        s.text(16, 460, f"실제 · {PRACTICE_CONTEXT} · 이번 예는 가릴 값 없음" if v03 else "재현 · 806자 · 이번 예는 가릴 값 없음", 16, "muted")
        s.text(16, 486, "→ 다음 요청의 user 메시지가 된다", 16, "ink b")
        s.end()
        if v03:
            s.rect(4, 516, 352, 131, "box-term")
            s.text(16, 540, f"Git 문맥 발췌 · {OBSERVED_DATE}", 16, "muted b")
            s.lines(16, 562, ["Branch: main", PRACTICE_STATUS, "…", "+실습 메모: AI가 작성한 …"], 16, 21, "ink mono")
            s.path("M16 630H208", "ln-acc", None)
        s.text(16, 676 if v03 else 535, "글자 수 한도와 검사 옵션 · 학습가이드 05", 16, "muted")
    else:
        s.rect(8, 44, 428, 103, "box-p")
        s.text(24, 71, "보낼 글에 담는 것", 22, "tp")
        s.lines(24, 96, ["브랜치 · 상태 · 바뀐 파일 이름", "새 파일은 이름만 · 바뀐 줄(diff)", "git add 전후 변경을 함께 읽음"], 19, 20)
        s.add('<g data-topic="excluded-context">')
        s.rect(8, 154, 428, 76, "box")
        s.text(24, 176, "넣지 않는 것", 20, "muted b")
        s.lines(24, 200, ["새 파일 내용 · 바뀌지 않은 파일", "API 키 → 다음 화면의 인증 헤더"], 19, 22)
        s.end()
        s.rect(8, 289, 428, 162, "box-term")
        s.text(24, 315, f"Git 문맥 발췌 · {OBSERVED_DATE}" if v03 else "연습 저장소의 Git 문맥 · 재현 발췌", 19, "muted b")
        s.lines(24, 343, ["Branch: main", PRACTICE_STATUS, "…", "+실습 메모: AI가 작성한 …"] if v03 else
                ["Branch: main", "Status: M …/02-python-ai-api.md", "…", "+실습 메모: AI가 생성한 …"], 19, 25, "ink mono")
        if v03:
            s.path("M24 423H260", "ln-acc", None)
        s.path("M438 105H470")
        s.rect(474, 44, 335, 194, "box-acc")
        s.text(490, 74, "보내기 전 검사", 22, "acc")
        s.text(490, 100, "기본으로 켜짐", 19, "muted")
        s.lines(490, 131, ["가리고 계속 · 이메일·토큰 등", "→ [REDACTED]로 가림"], 19, 23)
        s.lines(490, 190, ["전송 멈춤 · 비밀 파일 경로 등", "→ AI 요청 0회"], 19, 23)
        s.path("M811 105H843")
        s.add('<g data-topic="prepared-context">')
        s.rect(847, 44, 345, 158, "box-r")
        s.text(863, 72, "검사를 마친 글", 22, "tr")
        s.text(863, 100, "감지한 값은 가린 채 보낸다", 19)
        s.text(863, 132, PRACTICE_CONTEXT if v03 else "806자", 25, "tr")
        s.text(950, 131, "실제 · 11-25 · 가릴 값 없음" if v03 else "재현 · 가릴 값 없음", 19, "muted")
        s.text(863, 178, "→ 다음 요청의 user 메시지", 20, "ink b")
        s.end()
        s.lines(474, 271, ["글자 수 한도와 검사 옵션", "→ 학습가이드 05"], 19, 25, "muted")
        s.text(8, 482, "문맥과 글자 수 · 2026-11-25 실제(재현 일치)    담는 항목·검사·요청 연결 · 프로그램 구현" if v03 else "문맥과 글자 수 · 재현    담는 항목·기본 검사·요청 연결 · 프로그램 구현", 19, "muted")
    return s


F7_RESPONSE = (
    ('{"', "choices", '":[{"', "message", '":{'),
    ('  "', "content", '":"커밋 메시지 초안 …"'),
    ('}}]}',),
)


def f7_response_example(s, x, baseline, mobile):
    """Keep the painted JSON parseable and emphasize the same keys Python reads."""
    size, spacing = (16, 20) if mobile else (19, 21)
    s.add('<g data-response-example="true">')
    for i, parts in enumerate(F7_RESPONSE):
        text = "".join(f'<tspan class="{P}-tr">{esc(part)}</tspan>' if j % 2 else esc(part)
                       for j, part in enumerate(parts))
        y = baseline + i * spacing
        s.add(f'<text x="{x}" y="{y}" font-size="{size}" class="{P}-mono {P}-ink" xml:space="preserve">{text}</text>')
    s.end()


def f7_r1(mobile, v03=False):
    title = "Python과 외부 AI API의 요청·응답"
    label = ("Python은 API 주소에 POST로 요청한다. 인증 헤더에는 자격 증명인 API 키를, JSON 본문에는 모델 ID와 system 작성 규칙, user Git 문맥을 담는다. "
             "Python 딕셔너리를 JSON으로 바꿔 보내고, 성공 응답의 JSON을 Python 데이터로 읽는다. 401 또는 403이면 인증 또는 권한 오류를 알리고 멈춘다. "
             "교육용 예시의 choices 첫 항목에서 message의 content가 초안이다. 요청 구조는 재현이며 원본 응답은 확보하지 않았다.")
    if v03:
        label += (" 이번 실행 Git 문맥은 535자. 400 같은 그 밖의 HTTP 오류는 응답 오류로 알린다. "
                  "답을 꺼내는 경로는 별도의 실제 최소 연결 테스트 응답으로 확인했다.")
    s = Svg(360 if mobile else 1200, (688 if v03 else 634) if mobile else (296 if v03 else 265), label=label, title=title)
    if mobile:
        s.rect(4, 4, 352, 202, "box-p")
        s.text(16, 29, "내 컴퓨터 · Python이 요청 만들기", 17, "tp")
        s.text(16, 54, "POST …/v1/chat/completions", 16, "acc mono")
        s.text(16, 77, "주소 · 환경변수 또는 실행 옵션", 16, "muted")
        s.text(16, 102, "인증 헤더 · 요청 인증과 권한 확인", 16, "ink b")
        s.text(16, 124, "Authorization: Bearer ••••", 16, "ink mono")
        s.text(16, 149, "JSON 본문 · model: gpt-5-mini", 16, "ink b")
        s.text(16, 172, "messages · system: 작성 규칙", 16)
        s.text(16, 194, f"user: 앞 화면의 Git 문맥 ({PRACTICE_CONTEXT})" if v03 else "user: 앞 화면에서 준비한 Git 문맥", 16)
        s.path("M25 208V242", "ln-acc", "a-acc", "request")
        s.text(45, 229, "① 요청 · 딕셔너리 → JSON 글", 16, "acc")
        s.rect(4, 245, 352, 45, "box-a")
        s.text(16, 274, "외부 서비스 · 코디세이 AI API", 17, "ink b")
        s.path("M25 292V326", "ln", "a", "response")
        s.text(45, 313, "② 응답 · Python으로 전달", 16, "ink b")
        extra = 24 if v03 else 0
        s.rect(4, 329, 352, 243 + extra, "box-p")
        s.text(16, 355, "내 컴퓨터 · Python이 응답 읽기", 17, "tp")
        s.add('<g data-topic="response-status">')
        s.lines(16, 382, ["성공 · JSON 글 → Python 데이터", "401·403 · 인증·권한 오류로 멈춤"], 16, 22, "ink b")
        s.end()
        if v03:
            s.text(16, 425, "그 밖의 오류(예: 400) · 응답 오류", 16, "acc")
        s.rect(9, 416 + extra, 342, 146, "box-r")
        s.add('<g data-topic="response-example">')
        s.text(20, 436 + extra, "교육용 예시 · 원본 응답 미확보", 16, "tr")
        f7_response_example(s, 20, 460 + extra, mobile)
        s.text(20, 528 + extra, "choices[0].message.content", 16, "tr mono")
        s.text(20, 552 + extra, "꺼낸 초안 → 다음 장면의 형식 검사", 16, "muted")
        s.end()
        foot = ["요청 구조 · 재현", "모델 ID · 2026-10-20 실제 실행 설정"]
        if v03:
            foot = ["요청 구조 · 재현 · 모델 ID · 11-25 실제",
                    "응답 경로 · 실제 최소 연결 테스트에서 확인"]
        s.lines(16, 597 + extra, foot, 16, 22, "muted")
    else:
        s.rect(6, 4, 820, 223, "zone")
        s.text(20, 29, "내 컴퓨터 · Python", 21, "tp")
        s.text(225, 29, "POST https://copa.codyssey.kr/v1/chat/completions", 19, "acc mono")
        s.rect(16, 40, 400, 177, "box-p")
        s.text(30, 65, "요청 만들기", 20, "tp")
        s.text(160, 65, "주소 · 환경변수 또는 실행 옵션", 19, "muted")
        s.text(30, 88, "인증 헤더 · 요청 인증과 권한 확인", 19, "ink b")
        s.text(30, 111, "Authorization: Bearer ••••", 19, "ink mono")
        s.text(30, 134, "JSON 본문 · model: gpt-5-mini", 19, "ink b")
        s.text(30, 157, "messages · system: 작성 규칙", 19)
        s.text(30, 180, f"user: 앞 화면의 Git 문맥 ({PRACTICE_CONTEXT})" if v03 else "user: 앞 화면에서 준비한 Git 문맥", 19)
        s.rect(427, 40, 388, 177, "box-r")
        s.text(442, 65, "응답에서 초안 꺼내기", 20, "tr")
        s.add('<g data-topic="response-example">')
        s.text(442, 88, "교육용 예시 · 원본 응답 미확보", 19, "tr")
        f7_response_example(s, 442, 110, mobile)
        s.text(442, 176, "choices[0].message.content", 19, "tr mono")
        s.end()
        s.text(442, 203, "꺼낸 초안 → 다음 장면의 형식 검사", 19, "muted")
        s.rect(979, 40, 213, 171 if v03 else 148, "box-a")
        s.text(994, 67, "외부 서비스", 20, "muted b")
        s.text(994, 93, "코디세이 AI API", 21, "ink b")
        s.add('<g data-topic="response-status">')
        s.text(994, 119, "성공 · JSON 반환", 19, "tr")
        if v03:
            s.text(994, 143, "401·403 · 인증/권한", 19, "acc")
            s.text(994, 168, "그 밖의 오류 (예: 400)", 19, "acc")
            s.text(994, 193, "→ 응답 오류", 19, "acc")
        else:
            s.text(994, 143, "401·403 · 인증 오류", 19, "acc")
            s.text(994, 168, "또는 권한 오류", 19, "acc")
        s.end()
        s.path("M828 104H976", "ln-acc", "a-acc", "request")
        s.text(840, 89, "① 요청 · POST", 19, "acc")
        s.text(841, 129, "딕셔너리 → JSON", 19, "muted")
        s.path("M976 158H828", "ln", "a", "response")
        s.text(840, 181, "② 응답 · JSON", 19, "ink b")
        s.text(840, 207, "JSON → Python", 19, "muted")
        date = OBSERVED_DATE if v03 else "2026-10-20"
        s.text(16, 251, f"요청 구조 · 재현    모델 ID · {date} 실제 실행 설정    응답 JSON 모양 · 교육용 예시", 19, "muted")
        if v03:
            s.text(16, 278, "응답 경로 choices[0].message.content · 실제 최소 연결 테스트 응답에서 확인", 19, "muted")
    return s


FIGS = {"f0-journey": f0, "f1-overview": f1, "f2-why": f2, "f3-diff": f3, "f4-subprocess": f4,
        "f5-result": f5, "f6-context": f6, "f7-api": f7, "f8-drafts": f8}

if __name__ == "__main__":
    for name, fn in FIGS.items():
        for kind in ("desktop", "mobile"):
            save(f"{name}-{kind}.svg", fn(kind == "mobile"))
    revised = {
        "f0-journey": lambda mobile: f0(mobile, v02=True),
        "f1-overview": f1_v02,
        "f2-why": lambda mobile: f2(mobile, v02=True),
        "f6-context": lambda mobile: f6(mobile, v02=True),
        "f7-api": f7_v02,
    }
    for name, fn in revised.items():
        for kind in ("desktop", "mobile"):
            save(f"{name}-v02-{kind}.svg", fn(kind == "mobile"))
    save("f4-subprocess-v02-desktop.svg", f4(False, v02=True))
    beginner = {
        "f1-overview": lambda mobile: f1_v02(mobile, r1=True),
        "f2-why": lambda mobile: f2(mobile, v02=True, r1=True),
        "f4-subprocess": lambda mobile: f4(mobile, v02=True, r1=True),
        "f5-result": f5_r1,
        "f6-context": f6_r1,
        "f7-api": f7_r1,
        "f8-drafts": lambda mobile: f8(mobile, r1=True),
    }
    for name, fn in beginner.items():
        for kind in ("desktop", "mobile"):
            save(f"{name}-r1-{kind}.svg", fn(kind == "mobile"))
    learning_cycle = {
        "f2-why": lambda mobile: f2(mobile, v02=True, r1=True, v03=True),
        "f3-diff": lambda mobile: f3(mobile, v03=True),
        "f5-result": lambda mobile: f5_r1(mobile, v03=True),
        "f6-context": lambda mobile: f6_r1(mobile, v03=True),
        "f7-api": lambda mobile: f7_r1(mobile, v03=True),
        "f8-drafts": lambda mobile: f8(mobile, r1=True, v03=True),
    }
    for name, fn in learning_cycle.items():
        for kind in ("desktop", "mobile"):
            save(f"{name}-v03-{kind}.svg", fn(kind == "mobile"))
    print(f"{2 * (len(FIGS) + len(revised) + len(beginner) + len(learning_cycle)) + 1} SVG → {os.path.relpath(OUT)}")
