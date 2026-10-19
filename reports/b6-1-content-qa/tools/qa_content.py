#!/usr/bin/env python3
"""Content QA for content/mission-guides/main-m11 (structure, links, source excerpts, evidence tags).

usage: python -I qa_content.py <glossary repo root> <Codyssey_B6-1 checkout> [--net]
"""
import json, re, sys, urllib.request
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
REPO = Path(sys.argv[1]).resolve()
B6 = Path(sys.argv[2]).resolve()
NET = "--net" in sys.argv
GUIDE = REPO / "content" / "mission-guides" / "main-m11"
TERMS = REPO / "content" / "terms"
SHA = "8b99440c830fddc6f78c1440cff8fa2591d47884"
OWNER = "https://github.com/hyun02063185-AX-beginner/Codyssey_B6-1/blob/" + SHA + "/"
TAGS = {"요구 정리", "B6-1 사례", "학습 노트", "실행 확인", "개념", "보충"}
EXPECTED = ["01-database-basics", "02-data-modeling", "03-keys-relations", "04-data-integrity", "05-sql-queries",
            "06-sql-joins", "07-group-aggregation", "08-subquery-index", "09-update-delete", "10-database-overview"]
SECTIONS = ["먼저, 이런 궁금증에서 시작합니다", "일상으로 생각해 보면", "용어의 뜻", "그림으로 보기", "B6-1 결과물에서 확인하기",
            "좋은 점과 한계", "내 프로그램에 연결하기", "요구와 B6-1의 선택", "다른 사람에게 이렇게 설명할 수 있습니다"]
errors, warns, info = [], [], {}


def err(m): errors.append(m); print("ERROR", m)
def warn(m): warns.append(m); print("warn ", m)
def norm(s): return re.sub(r"\s+", " ", s).strip()


def slug(h):
    h = h.strip().lower()
    h = re.sub(r"[^\w\- 가-힣]", "", h)
    return h.replace(" ", "-")


# ---- source corpora
src = {}
for rel in ["README.md", "docs/mission_study.md", "docs/images/erd.mmd", "sql/01_schema.sql", "sql/02_sample_data.sql", "sql/03_queries.sql", "results/query_results.md"]:
    src[rel] = [norm(l) for l in (B6 / rel).read_text(encoding="utf-8").splitlines()]

# ---- 1. chapter set and order
files = sorted(p.stem for p in (GUIDE / "chapters").glob("*.md"))
if files != EXPECTED:
    err(f"chapter files differ: {files}")
else:
    print("ok   10 chapters present in order")
assets = {p.name for p in (GUIDE / "assets").glob("*.svg")}
referenced = set()
readme = (GUIDE / "README.md").read_text(encoding="utf-8")
readme_slugs = {slug(m.group(1)) for m in re.finditer(r"(?m)^#{1,6} (.+)$", readme)}

for n, stem in enumerate(EXPECTED, 1):
    path = GUIDE / "chapters" / f"{stem}.md"
    text = path.read_text(encoding="utf-8")
    lines = text.splitlines()
    tag = f"ch{n:02d}"
    if not lines[0].startswith(f"# Chapter {n} — "):
        err(f"{tag}: first line must be '# Chapter {n} — …' got {lines[0][:40]!r}")
    # sections in order
    pos = -1
    h2 = [l[3:].strip() for l in lines if l.startswith("## ")]
    for s in SECTIONS:
        idx = next((i for i, h in enumerate(h2) if h.startswith(s)), None)
        if idx is None:
            err(f"{tag}: missing section '{s}'")
        elif idx < pos:
            err(f"{tag}: section '{s}' out of order")
        else:
            pos = idx
    if not any(h.startswith("💻 직접 확인해 보기") for h in h2): err(f"{tag}: missing 💻 section")
    if not any(h.startswith("AI에게 물어볼 질문") for h in h2): err(f"{tag}: missing AI question section")
    body = "\n".join(lines)
    i_sum = body.find("**한 문장 정리:**")
    _m = re.search(r"(?m)^## 💻", body)
    i_pc = _m.start() if _m else -1
    if i_sum < 0 or (i_pc >= 0 and i_sum > i_pc): err(f"{tag}: 한 문장 정리 missing or after 💻 section")
    info[tag] = {"chars_before_pc_section": len(body[:i_pc]) if i_pc > 0 else None, "chars_total": len(body)}

    # no raw html outside fences
    in_fence = False
    for ln, l in enumerate(lines, 1):
        if l.startswith("```"): in_fence = not in_fence
        if not in_fence and re.search(r"</?[a-zA-Z][^>]*>", re.sub(r"`[^`]*`", "", l)):
            err(f"{tag}:{ln}: raw HTML outside code: {l[:60]}")

    # tags
    used = set(re.findall(r"`\[([^\]`]+)\]`", body))
    for t in used - TAGS:
        if not re.match(r"Q\d+|\d", t): err(f"{tag}: unknown tag [{t}]")
    if "[공식]" in body: err(f"{tag}: contains [공식] tag")
    info[tag]["tags"] = {t: len(re.findall(r"`\[" + re.escape(t) + r"\]`", body)) for t in sorted(TAGS)}
    # Q numbers
    for q in re.findall(r"\bQ(\d{2})\b", body):
        if not 1 <= int(q) <= 17: err(f"{tag}: bad query number Q{q}")

    # links & images
    for m in re.finditer(r"(!?)\[([^\]]*)\]\(([^)\s]+)\)", body):
        bang, label, href = m.groups()
        if href.startswith("http"):
            if href.startswith("https://github.com/hyun02063185-AX-beginner/Codyssey_B6-1/"):
                if not href.startswith(OWNER): err(f"{tag}: B6-1 link not pinned to {SHA[:7]}: {href}")
                else:
                    rel = href[len(OWNER):].split("#")[0]
                    if not (B6 / rel).exists(): err(f"{tag}: B6-1 path missing: {rel}")
            elif "github.com" in href and "hyun0" in href:
                err(f"{tag}: suspicious github owner in {href}")
            elif NET:
                try:
                    r = urllib.request.urlopen(urllib.request.Request(href, headers={"User-Agent": "Mozilla/5.0"}), timeout=20)
                    if r.status != 200: err(f"{tag}: {href} -> {r.status}")
                except Exception as e:
                    err(f"{tag}: {href} unreachable: {e}")
            info.setdefault("external_urls", set()).add(href)
            continue
        target, _, frag = href.partition("#")
        full = (path.parent / target).resolve()
        if not full.exists(): err(f"{tag}: broken link {href}")
        if frag and target.endswith("README.md") and slug(frag) not in readme_slugs and frag not in readme_slugs:
            err(f"{tag}: README anchor missing #{frag}")
        if bang:
            referenced.add(Path(target).name)
            if not label.strip(): err(f"{tag}: image without alt text {href}")
        elif "/terms/" in href.replace("\\", "/"):
            if not (TERMS / Path(target).name).exists(): err(f"{tag}: term missing {href}")

    # code excerpts
    i = 0
    while i < len(lines):
        if lines[i].startswith("```"):
            lang = lines[i][3:].strip()
            j = i + 1
            while not lines[j].startswith("```"): j += 1
            code = lines[i + 1:j]
            k = j + 1
            while k < len(lines) and not lines[k].strip(): k += 1
            cap = lines[k] if k < len(lines) else ""
            if lang == "sql":
                if "원본 발췌" in cap:
                    wanted = re.findall(r"sql/0\d_\w+\.sql|README\.md|docs/mission_study\.md", cap)
                    if not wanted: err(f"{tag}: excerpt caption without source file: {cap[:50]}")
                    corpus = [l for w in wanted for l in src.get(w, [])]
                    n_lines = len([c for c in code if c.strip()])
                    if n_lines > 6: err(f"{tag}: excerpt has {n_lines} lines (>6)")
                    for c in code:
                        if not c.strip(): continue
                        nc = norm(c)
                        if not any(nc in s for s in corpus):
                            err(f"{tag}: excerpt line not found in {wanted}: {c.strip()}")
                    info.setdefault("excerpts", []).append(f"{tag}:{wanted}:{n_lines}L")
                elif "교육용 예시" in cap:
                    info.setdefault("educational", []).append(f"{tag}:{len(code)}L")
                else:
                    err(f"{tag}: sql block without '원본 발췌'/'교육용 예시' caption near line {i+1}")
                for c in code:
                    if len(c) > 40: info.setdefault("long_code_lines", []).append(f"{tag}:{len(c)}:{c.strip()[:30]}")
            i = j + 1
        else:
            i += 1

    # tables: width for mobile
    for ln, l in enumerate(lines, 1):
        if l.startswith("|") and not re.match(r"^\|[\s\-|:]+\|$", l):
            cells = [c.strip() for c in l.strip().strip("|").split("|")]
            if len(cells) > 4: warn(f"{tag}:{ln}: table with {len(cells)} columns")

    # prev/next
    if n > 1 and f"({EXPECTED[n-2]}.md)" not in body: err(f"{tag}: missing previous-chapter link")
    if n < 10 and f"({EXPECTED[n]}.md)" not in body: err(f"{tag}: missing next-chapter link")

# ---- 2. README coverage
for st in EXPECTED:
    if f"chapters/{st}.md" not in readme: err(f"README does not link chapter {st}")
for a in sorted(assets):
    if a not in referenced and f"assets/{a}" not in readme: err(f"asset not referenced anywhere: {a}")
    if f"assets/{a}" not in readme: err(f"README does not list asset {a}")
missing = referenced - assets
if missing: err(f"chapters reference missing assets: {missing}")
info["assets"] = sorted(assets)
info["referenced_in_chapters"] = sorted(referenced)
info["unreferenced_in_chapters"] = sorted(assets - referenced)

# every term slug listed in README exists
for t in re.findall(r"`([a-z0-9\-]+)`", readme.split("## 관련 기술용어사전 항목")[1].split("## 제작 범위")[0]):
    if not (TERMS / f"{t}.md").exists(): err(f"README term missing: {t}")
# every term linked in chapters is listed in README
listed = set(re.findall(r"`([a-z0-9\-]+)`", readme.split("## 관련 기술용어사전 항목")[1].split("## 제작 범위")[0]))
linked = set()
for stem in EXPECTED:
    linked |= set(re.findall(r"terms/([a-z0-9\-]+)\.md", (GUIDE / "chapters" / f"{stem}.md").read_text(encoding="utf-8")))
if linked - listed: warn(f"terms linked but not listed in README: {sorted(linked - listed)}")
if listed - linked: warn(f"terms listed in README but never linked: {sorted(listed - linked)}")
info["linked_terms"] = sorted(linked)

# ---- 3. other files
for f in ["README.md", "scenario-v1.0.md", "instructor-notes.md"]:
    if not (GUIDE / f).exists(): err(f"missing {f}")

info = {k: (sorted(v) if isinstance(v, set) else v) for k, v in info.items()}
print("\nerrors:", len(errors), " warnings:", len(warns))
Path(sys.argv[3] if len(sys.argv) > 3 and not sys.argv[3].startswith("--") else "qa_content.json").write_text(
    json.dumps({"errors": errors, "warnings": warns, "info": info}, ensure_ascii=False, indent=2), encoding="utf-8")
sys.exit(1 if errors else 0)
