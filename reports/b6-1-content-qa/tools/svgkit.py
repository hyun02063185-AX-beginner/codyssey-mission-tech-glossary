"""Tiny SVG authoring kit for the B6-1 learning guide figures.

Design rules (enforced by qa tooling):
  * mobile figures: viewBox width 360, every text >= 18 (displays 14.4 / 16.4 / 17.9 px at 320 / 360 / 390)
  * wide figure: viewBox width 900, every text >= 19
  * no glyph symbols for check / cross / circled digits -> drawn as vector shapes
"""
from xml.sax.saxutils import escape

FONT = "'Noto Sans KR','Nanum Gothic','Malgun Gothic','Apple SD Gothic Neo','Noto Sans CJK KR',sans-serif"
MONO = "'D2Coding','Consolas','Menlo','Noto Sans Mono CJK KR',monospace"

# palette (same family as the B1-1 / B2-1 guides)
BG = "#f7faf8"; HEAD = "#173e35"; KICK = "#b5e7ce"; INK = "#1d2d29"; SUB = "#3f5650"
LINE = "#657e70"; EDGE = "#c9d9cf"
BLUE = "#eaf0ff"; BLUE_E = "#9db4ee"
ORNG = "#fff1e3"; ORNG_E = "#e8b27a"
GRN = "#e3f5ea"; GRN_E = "#7cc29a"
PURP = "#f3ebff"; PURP_E = "#b79be6"
RED = "#fde8e6"; RED_E = "#d9756c"; RED_T = "#9b2c22"
WHITE = "#ffffff"; GREY = "#eef2ef"; GREY_T = "#5b6e67"
OK_C = "#1f7a4d"; NO_C = "#b3372b"


def cw(ch, size, mono=False):
    o = ord(ch)
    if o >= 0x2E80 or 0x3130 <= o <= 0x318F or 0xAC00 <= o <= 0xD7A3:
        return size * 1.0
    if mono:
        return size * 0.62
    if ch == " ":
        return size * 0.30
    if ch in "iIl.,:;|!'`/":
        return size * 0.33
    if ch in "mwMW@":
        return size * 0.88
    if ch.isupper():
        return size * 0.68
    if ch.isdigit():
        return size * 0.58
    if ch in "→←↑↓≥≤≠·×÷":
        return size * 1.0
    return size * 0.58


def tw(s, size, mono=False, bold=False):
    w = sum(cw(c, size, mono) for c in s)
    return w * (1.07 if bold else 1.0)


def wrap(s, maxw, size, mono=False, bold=False):
    """Greedy wrap on spaces; falls back to character breaks for long tokens."""
    lines = []
    for para in s.split("\n"):
        words = para.split(" ")
        cur = ""
        for w in words:
            trial = (cur + " " + w) if cur else w
            if tw(trial, size, mono, bold) <= maxw:
                cur = trial
                continue
            if cur:
                lines.append(cur)
                cur = ""
            # token longer than a line -> break by char
            if tw(w, size, mono, bold) > maxw:
                piece = ""
                for ch in w:
                    if tw(piece + ch, size, mono, bold) > maxw:
                        lines.append(piece)
                        piece = ch
                    else:
                        piece += ch
                cur = piece
            else:
                cur = w
        lines.append(cur)
    return lines


class Svg:
    def __init__(self, w, title, aria, kicker=None, head=None, head_h=None, min_font=18):
        self.w = w
        self.title = title
        self.aria = aria
        self.els = []
        self.defs = []
        self.min_font = min_font
        self.y = 0
        self._id = 0
        self.mark("arrow", LINE)
        self.mark("arrowR", RED_T)
        self.mark("arrowG", OK_C)
        if kicker and head:
            self.header(kicker, head, head_h)

    # ---------- primitives ----------
    def mark(self, name, color):
        self.defs.append(
            f'<marker id="{name}" markerWidth="9" markerHeight="9" refX="6.5" refY="4.5" orient="auto" markerUnits="userSpaceOnUse">'
            f'<path d="M0 0L9 4.5L0 9Z" fill="{color}"/></marker>'
        )

    def rect(self, x, y, w, h, fill=WHITE, stroke=EDGE, sw=1.5, rx=12, dash=None):
        d = f' stroke-dasharray="{dash}"' if dash else ""
        s = f' stroke="{stroke}" stroke-width="{sw}"' if stroke else ""
        self.els.append(f'<rect x="{x:g}" y="{y:g}" width="{w:g}" height="{h:g}" rx="{rx}" fill="{fill}"{s}{d}/>')

    def text(self, x, y, s, size=18, bold=False, fill=INK, anchor="start", mono=False):
        assert size >= self.min_font, f"font {size} < {self.min_font}: {s}"
        fam = MONO if mono else FONT
        wt = ' font-weight="700"' if bold else ""
        a = f' text-anchor="{anchor}"' if anchor != "start" else ""
        self.els.append(
            f'<text x="{x:g}" y="{y:g}" font-family="{fam}" font-size="{size}"{wt} fill="{fill}"{a}>{escape(s)}</text>'
        )

    def lines(self, x, y, s, maxw, size=18, lh=None, bold=False, fill=INK, mono=False, anchor="start"):
        """wrapped paragraph, returns y after last line (baseline-based)."""
        lh = lh or round(size * 1.45)
        ls = wrap(s, maxw, size, mono, bold)
        for i, l in enumerate(ls):
            self.text(x, y + i * lh, l, size, bold, fill, anchor, mono)
        return y + len(ls) * lh

    def path(self, d, stroke=LINE, sw=2, dash=None, marker=None, fill="none"):
        da = f' stroke-dasharray="{dash}"' if dash else ""
        mk = f' marker-end="url(#{marker})"' if marker else ""
        self.els.append(f'<path d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"{da}{mk} stroke-linejoin="round" stroke-linecap="round"/>')

    def arrow(self, pts, stroke=LINE, dash=None, marker="arrow", sw=2):
        d = "M" + " L".join(f"{x:g} {y:g}" for x, y in pts)
        self.path(d, stroke, sw, dash, marker)

    def num(self, cx, cy, n, fill=HEAD, tcol="#ffffff"):
        """numbered circle (drawn, not a glyph)."""
        self.els.append(f'<circle cx="{cx:g}" cy="{cy:g}" r="12.5" fill="{fill}"/>')
        self.text(cx, cy + 6.5, str(n), 18, True, tcol, "middle")

    def check(self, cx, cy, r=11, color=OK_C):
        self.els.append(f'<circle cx="{cx:g}" cy="{cy:g}" r="{r}" fill="{color}"/>')
        self.path(f"M{cx-5:g} {cy:g} L{cx-1.5:g} {cy+4.5:g} L{cx+5.5:g} {cy-4.5:g}", "#ffffff", 2.6)

    def cross(self, cx, cy, r=11, color=NO_C):
        self.els.append(f'<circle cx="{cx:g}" cy="{cy:g}" r="{r}" fill="{color}"/>')
        self.path(f"M{cx-4.5:g} {cy-4.5:g} L{cx+4.5:g} {cy+4.5:g} M{cx+4.5:g} {cy-4.5:g} L{cx-4.5:g} {cy+4.5:g}", "#ffffff", 2.6)

    def warn(self, cx, cy, color="#b25b00"):
        self.els.append(f'<path d="M{cx:g} {cy-12:g} L{cx+12:g} {cy+10:g} L{cx-12:g} {cy+10:g} Z" fill="{color}"/>')
        self.path(f"M{cx:g} {cy-4:g} L{cx:g} {cy+3:g}", "#ffffff", 2.6)
        self.els.append(f'<circle cx="{cx:g}" cy="{cy+7:g}" r="1.6" fill="#ffffff"/>')

    def badge(self, x, y, label, fill=HEAD, tcol="#ffffff", w=None):
        """small rounded label; (x,y) = top-left; height 26."""
        w = w or round(tw(label, 18, bold=True) + 14)
        self.rect(x, y, w, 26, fill, None, 0, 7)
        self.text(x + w / 2, y + 19, label, 18, True, tcol, "middle")
        return w

    # ---------- composite helpers ----------
    def header(self, kicker, head, h=None):
        ks = max(18, self.min_font)
        ls = wrap(head, self.w - 40, ks + 3, bold=True)
        h = h or (62 + 28 * len(ls))
        self.rect(0, 0, self.w, h, HEAD, None, 0, 18)
        self.rect(0, h - 22, self.w, 22, HEAD, None, 0, 0)
        self.text(20, 30, kicker, ks, True, KICK)
        for i, l in enumerate(ls):
            self.text(20, 62 + i * 28, l, ks + 3, True, "#ffffff")
        self.y = h

    def card(self, x, y, w, title, body=None, fill=WHITE, stroke=EDGE, tsize=19, bsize=18, tcol=INK, bcol=SUB,
             pad=13, mono_body=False, dash=None, minh=0, lh=26):
        """auto-height card. title bold, body = str or list[str] (each wrapped). returns bottom y."""
        inner = w - 2 * pad
        t_lines = wrap(title, inner, tsize, bold=True) if title else []
        chunks = body if isinstance(body, list) else ([body] if body else [])
        b_lines = []
        for ch in chunks:
            b_lines += wrap(ch, inner, bsize, mono_body)
        h = pad + len(t_lines) * lh + len(b_lines) * lh + pad - 6
        h = max(h, minh)
        self.rect(x, y, w, h, fill, stroke, 1.5, 12, dash)
        cy = y + pad + 17
        for l in t_lines:
            self.text(x + pad, cy, l, tsize, True, tcol)
            cy += lh
        for l in b_lines:
            self.text(x + pad, cy, l, bsize, False, bcol, mono=mono_body)
            cy += lh
        return y + h

    def table(self, x, y, cols, rows, head_fill=GREY, row_h=32, size=18, mono=False, hl=None, bad=None, keys=None,
              first_bold=False, outline=EDGE, cellfills=None, title=None, title_fill=None):
        """cols: list of (label, width). rows: list of list[str].
        keys: list parallel to cols with 'PK'/'FK'/None -> second header row of badges.
        hl: set of (r,c) highlighted cells; bad: set of (r,c) crossed cells."""
        hl = hl or set(); bad = bad or set(); cellfills = cellfills or {}
        w = sum(c[1] for c in cols)
        cy = y
        if title:
            self.text(x, cy + 19, title, 19, True, INK)
            cy += 28
        top = cy
        # header
        n_head = 2 if keys else 1
        total_h = row_h * (len(rows) + n_head)
        self.rect(x, top, w, total_h, WHITE, outline, 1.5, 8)
        self.rect(x, top, w, row_h * n_head, head_fill, None, 0, 8)
        self.rect(x, top + row_h * n_head - 8, w, 8, head_fill, None, 0, 0)
        cx = x
        for ci, (lab, cwid) in enumerate(cols):
            self.text(cx + 8, top + row_h - 9, lab, size, True, INK, mono=mono)
            if keys and keys[ci]:
                k = keys[ci]
                self.badge(cx + 8, top + row_h + 3, k, HEAD if k == "PK" else "#8a4b00" if k == "FK" else SUB, w=34 if len(k) == 2 else None)
            cx += cwid
        for ri, row in enumerate(rows):
            ry = top + row_h * (ri + n_head)
            if ri % 2 == 1:
                pass
            self.els.append(f'<line x1="{x:g}" y1="{ry:g}" x2="{x+w:g}" y2="{ry:g}" stroke="{EDGE}" stroke-width="1"/>')
            cx = x
            for ci, (lab, cwid) in enumerate(cols):
                val = row[ci]
                if (ri, ci) in cellfills:
                    self.rect(cx + 1, ry + 1, cwid - 2, row_h - 2, cellfills[(ri, ci)], None, 0, 4)
                if (ri, ci) in hl:
                    self.rect(cx + 2, ry + 2, cwid - 4, row_h - 4, "none", HEAD, 2.4, 6)
                self.text(cx + 8, ry + row_h - 9, val, size, (first_bold and ci == 0) or (ri, ci) in hl, NO_C if val == "NULL" else INK, mono=mono)
                cx += cwid
        return top + total_h

    def ncard(self, x, y, w, mark, title, body=None, fill=WHITE, stroke=EDGE, mono_body=False, minh=0, tsize=19, bsize=18,
              tcol=INK, bcol=SUB, dash=None):
        """card with a left marker: int -> numbered circle, 'ok'/'no'/'warn' -> vector icon, None -> no marker."""
        pad = 13
        off = 40 if mark is not None else 0
        inner = w - 2 * pad - off
        t_lines = wrap(title, inner, tsize, bold=True) if title else []
        chunks = body if isinstance(body, list) else ([body] if body else [])
        b_lines = []
        for ch in chunks:
            b_lines += wrap(ch, inner, bsize, mono_body)
        h = max(pad + 26 * len(t_lines) + 26 * len(b_lines) + pad - 6, minh)
        self.rect(x, y, w, h, fill, stroke, 1.5, 12, dash)
        mx, my = x + pad + 13, y + pad + 12
        if isinstance(mark, int):
            self.num(mx, my, mark)
        elif mark == "ok":
            self.check(mx, my)
        elif mark == "no":
            self.cross(mx, my)
        elif mark == "warn":
            self.warn(mx, my)
        cy = y + pad + 17
        for l in t_lines:
            self.text(x + pad + off, cy, l, tsize, True, tcol)
            cy += 26
        for l in b_lines:
            self.text(x + pad + off, cy, l, bsize, False, bcol, mono=mono_body)
            cy += 26
        return y + h

    def dots(self, x, y, n, r=8, gap=22, fill=HEAD):
        for i in range(n):
            self.els.append(f'<circle cx="{x + i * gap:g}" cy="{y:g}" r="{r}" fill="{fill}"/>')

    def vline(self, x1, y1, x2, y2, stroke=EDGE, sw=1.2):
        self.els.append(f'<line x1="{x1:g}" y1="{y1:g}" x2="{x2:g}" y2="{y2:g}" stroke="{stroke}" stroke-width="{sw}"/>')

    # ---------- output ----------
    def footer_note(self, text, y, fill="#e7eee9", tcol="#2d4a40"):
        ls = wrap(text, self.w - 2 * 20 - 24, 18, bold=True)
        h = 18 + len(ls) * 26
        self.rect(14, y, self.w - 28, h, fill, None, 0, 10)
        for i, l in enumerate(ls):
            self.text(26, y + 29 + i * 26, l, 18, True, tcol)
        return y + h

    def render(self, height):
        body = "\n".join(e for e in self.els if e)
        return (
            f'<svg xmlns="http://www.w3.org/2000/svg" width="{self.w}" height="{height:g}" viewBox="0 0 {self.w} {height:g}" role="img" aria-label="{escape(self.aria)}">\n'
            f"<title>{escape(self.title)}</title>\n"
            f'<defs>{"".join(self.defs)}</defs>\n'
            f'<rect width="{self.w}" height="{height:g}" rx="20" fill="{BG}"/>\n'
            f"{body}\n</svg>\n"
        )
