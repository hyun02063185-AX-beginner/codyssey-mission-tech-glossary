#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Build curated glossary artifacts from immutable raw Markdown sources."""
from __future__ import annotations

import json
import re
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "data" / "raw"
CURATED = ROOT / "data" / "curated"
TERMS = ROOT / "content" / "terms"
WEBTOONS = ROOT / "content" / "webtoons"

SPECIAL_IDS = {
    "command line interface": "cli", "cli": "cli", "image": "docker-image",
    "permission (r/w/x)": "file-permission",
    "docker image": "docker-image", "container": "docker-container",
    "web storage / localstorage": "local-storage", "localstorage": "local-storage",
    ".env / environment variable": "environment-variable", "environment variable": "environment-variable",
    "async / await": "async-await", "fetch api": "fetch-api",
    "css flexbox": "css-flexbox", "css grid": "css-grid",
    "responsive web design": "responsive-web-design", "semantic html": "semantic-html",
    "form validation": "form-validation", "required-field validation": "form-validation",
    "ui state": "ui-state", "loading state": "ui-state", "success state": "ui-state",
    "error state": "ui-state", "empty state": "ui-state", "http 403": "http-status-code-403",
    "api rate limit": "rate-limiting", "rate limiting": "rate-limiting",
    "react props": "react-props", "react state": "react-state",
    "single page application": "single-page-application", "route": "client-side-route",
    "reusable component": "reusable-component", "python dataclass": "python-dataclass",
    "json lines": "json-lines", "file i/o": "file-io", "time complexity": "time-complexity",
    "multiply-accumulate": "mac-operation", "floating point": "floating-point",
    "one-to-many relationship": "one-to-many-relationship", "one-to-many": "one-to-many-relationship",
    "primary key": "primary-key", "foreign key": "foreign-key",
    "entity relationship diagram": "erd", "sqlalchemy session": "sqlalchemy-session",
    "dependency injection": "dependency-injection", "json web token": "json-web-token",
    "session-based authentication": "login-session", "authentication": "authentication",
    "authorization": "authorization", "git repository url": "git-repository-url",
    "github repository url": "git-repository-url", "readme.md": "readme",
}

CORE_IDS = [
    "cli", "shell", "terminal", "absolute-relative-path", "file-permission", "docker",
    "docker-image", "docker-container", "dockerfile", "port-mapping", "volume", "bind-mount",
    "persistence", "git", "github", "branch", "merge", "python", "class", "object-instance",
    "exception-handling", "json", "utf-8", "mac-operation", "floating-point", "epsilon",
    "time-complexity", "html", "css", "javascript", "dom", "responsive-web-design", "fetch-api",
    "async-await", "ui-state", "react", "react-state", "client-side-route", "reusable-component",
    "crud", "environment-variable", "api-key", "sql", "primary-key", "foreign-key", "join",
    "fastapi", "sqlalchemy", "authentication", "authorization",
]

WEBTOON_CANDIDATE_IDS = [
    "docker-image", "docker-container", "shell", "terminal", "git", "github", "bind-mount",
    "port-mapping", "file-permission", "class", "mac-operation", "floating-point", "epsilon",
    "react-state", "foreign-key", "authentication",
]

DETAILS = {
    "cli": ("명령줄 인터페이스", "텍스트 명령으로 컴퓨터에 작업을 요청하는 방식."),
    "shell": ("셸", "명령을 해석해 운영체제에 전달하는 프로그램."),
    "terminal": ("터미널", "셸을 실행하고 입출력을 보여 주는 창 또는 응용 프로그램."),
    "docker-image": ("Docker 이미지", "컨테이너를 만들기 위한 읽기 전용 실행 템플릿."),
    "docker-container": ("Docker 컨테이너", "이미지에서 만들어져 실행되는 격리된 프로세스 환경."),
    "port-mapping": ("포트 매핑", "호스트의 포트를 컨테이너 안 서비스 포트와 연결하는 설정."),
    "bind-mount": ("바인드 마운트", "호스트의 특정 경로를 컨테이너에 직접 연결하는 방식."),
    "persistence": ("영속성", "프로그램이나 컨테이너가 끝난 뒤에도 필요한 데이터가 남는 성질."),
    "git": ("Git", "변경 이력을 분산 저장하고 협업을 돕는 버전 관리 시스템."),
    "github": ("GitHub", "Git 저장소를 호스팅하고 협업 기능을 제공하는 서비스."),
    "object-instance": ("객체와 인스턴스", "클래스로부터 만들어져 실제 데이터를 가진 객체."),
    "mac-operation": ("MAC 연산", "두 값을 곱한 뒤 누적해 더하는 multiply-accumulate 연산."),
    "floating-point": ("부동소수점", "실수를 유한한 비트로 근사해 표현하는 방식."),
    "epsilon": ("엡실론", "부동소수점 비교에서 허용할 작은 오차 범위."),
    "ui-state": ("UI 상태", "로딩·성공·오류·빈 결과처럼 화면이 현재 처한 상태."),
    "client-side-route": ("클라이언트 측 라우트", "SPA에서 브라우저 안에서 화면 전환을 결정하는 경로."),
    "reusable-component": ("재사용 컴포넌트", "여러 화면에서 같은 역할을 맡도록 분리한 UI 단위."),
    "environment-variable": ("환경 변수", "코드 밖에서 실행 환경별 설정값을 전달하는 값."),
    "api-key": ("API 키", "외부 API 사용자를 식별하거나 사용량을 제어하는 비밀 값."),
    "sqlalchemy": ("SQLAlchemy", "Python 객체와 관계형 데이터베이스를 연결하는 라이브러리."),
    "authentication": ("인증", "사용자가 누구인지 확인하는 과정."),
    "authorization": ("인가", "확인된 사용자가 특정 기능을 사용할 권한이 있는지 판단하는 과정."),
    "foreign-key": ("외래 키", "한 테이블의 값이 다른 테이블의 기본 키를 참조하도록 만드는 제약이다."),
}

def clean(value: str) -> str:
    return value.strip().strip("`").replace("\\_", "_")

def slug(value: str) -> str:
    key = clean(value).lower()
    if key in SPECIAL_IDS:
        return SPECIAL_IDS[key]
    key = re.sub(r"\([^)]*\)", "", key)
    key = re.sub(r"[^a-z0-9]+", "-", key).strip("-")
    return key or "term"

def category(value: str) -> str:
    v = value.lower()
    if "security" in v: return "Security"
    if "database" in v: return "Database"
    if "container" in v: return "Container"
    if "git" in v: return "Git / Collaboration"
    if "linux" in v or "os" in v: return "Linux / OS"
    if "network" in v: return "Network"
    if "ai" in v or "hw" in v: return "AI / Hardware"
    if "algorithm" in v or "graph" in v or "data structure" in v: return "Algorithms / Data Structures"
    if "data" in v: return "Data"
    if "deploy" in v or "cloud" in v: return "Server / Infrastructure"
    if "backend" in v: return "Backend"
    if "web" in v or "ux" in v or "api" in v: return "Web"
    if "tool" in v: return "Tools"
    return "Programming"

def term_type(value: str) -> str:
    v = value.lower()
    for needle, result in [("command", "command"), ("api", "API"), ("framework", "framework"),
                           ("library", "library"), ("protocol", "protocol"), ("format", "data-format"),
                           ("file", "source-file"), ("directory", "other"), ("service", "service"),
                           ("database", "database"), ("algorithm", "algorithm"), ("pattern", "pattern"),
                           ("architecture", "architecture"), ("config", "config"), ("security", "security concept")]:
        if needle in v: return result
    return "concept"

def table_rows(lines: list[str], start: int):
    seen = False
    for line in lines[start:]:
        if line.startswith("## ") or line.startswith("# ") or (seen and not line.strip()):
            break
        if not line.strip():
            continue
        if not line.startswith("|") or re.fullmatch(r"[| :\-]+", line.strip()):
            continue
        seen = True
        cells = [clean(x) for x in line.split("|")[1:-1]]
        if cells and "원문" not in cells[0] and "개념" not in cells[0] and "용어" not in cells[0]:
            yield cells

def add(records, course, mission, status, cells, direct, preliminary=False):
    if direct:
        if len(cells) < 6: return
        ko, en, cat, kind, importance, context = cells[:6]
        cartoon = cells[6] if len(cells) > 6 else ""
    else:
        if len(cells) < 3: return
        if preliminary:
            ko, en, cat, context = cells[:4]
        else:
            ko, en, cat, context = cells[0], cells[0], cells[1], cells[2]
        kind, importance, cartoon = "concept", "보조", cells[4] if len(cells) > 4 else ""
    canonical = clean(en) or clean(ko)
    if canonical.lower() in {"object, instance", "object / instance"}: canonical = "Object Instance"
    rec = {"id": slug(canonical), "term_ko": ko, "term_en": canonical, "aliases": [ko],
           "category": category(cat), "type": term_type(kind), "difficulty": 2 if status != "related" else 3,
           "importance": "core" if "핵심" in importance else "supporting", "related_terms": [],
           "content_status": "raw", "webtoon": {"candidate": "좋음" in cartoon, "status": "none"},
           "mission_ref": {"course": course, "mission": mission, "source_status": status,
                           "source_term": ko, "context": context, "importance": "core" if "핵심" in importance else "supporting"}}
    records.append(rec)

def parse_main(records):
    for file in sorted((RAW / "main").glob("m*/m*-terminology-raw.md")):
        mission = file.parent.name.upper()
        status = None
        lines = file.read_text().splitlines()
        for i, line in enumerate(lines):
            m = re.match(r"## [123]\. (direct|required|related)", line)
            if m:
                status = m.group(1)
                for row in table_rows(lines, i + 1): add(records, "main", mission, status, row, status == "direct")

def parse_preliminary(records):
    lines = (RAW / "preliminary" / "preliminary-m01-m03-claude-raw.md").read_text().splitlines()
    mission, status = None, None
    for i, line in enumerate(lines):
        m = re.match(r"# M(0[123])\b", line)
        if m: mission, status = "M" + m.group(1), None
        if line.startswith("# 예비과정 전체"): mission, status = None, None
        if mission and line == "## 실제 등장 용어": status = "direct"
        if mission and line.startswith("## 연관 개념"): status = "related"
        if mission and status and line.startswith("|"):
            for row in table_rows(lines, i):
                add(records, "preliminary", mission, status, row, status == "direct", preliminary=True)
            status = None

def build():
    records = []
    parse_main(records); parse_preliminary(records)
    grouped = {}
    for r in records:
        item = grouped.setdefault(r["id"], {k: r[k] for k in ("id", "term_ko", "term_en", "category", "type", "difficulty", "importance", "related_terms", "content_status", "webtoon")})
        item.setdefault("aliases", [])
        for alias in r["aliases"]:
            if alias not in item["aliases"]: item["aliases"].append(alias)
        item.setdefault("mission_refs", []).append(r["mission_ref"])
        item["difficulty"] = min(item["difficulty"], r["difficulty"])
        if r["importance"] == "core": item["importance"] = "core"
        item["webtoon"]["candidate"] |= r["webtoon"]["candidate"]
    for ident in CORE_IDS:
        if ident in grouped:
            grouped[ident]["content_status"] = "drafted"
            grouped[ident]["webtoon"]["status"] = "candidate" if grouped[ident]["webtoon"]["candidate"] else "none"
            if ident in DETAILS:
                grouped[ident]["term_ko"], grouped[ident]["summary"] = DETAILS[ident]
    excluded_index_ids = {"hero-section", "about-section", "skills-section", "projects-section", "contact-section", "footer"}
    terms = sorted((term for term in grouped.values() if term["id"] not in excluded_index_ids), key=lambda x: x["id"])
    CURATED.mkdir(parents=True, exist_ok=True)
    (CURATED / "glossary-master-v0.1.yaml").write_text(json.dumps({"version": "0.1", "terms": terms}, ensure_ascii=False, indent=2) + "\n")
    mission_map = defaultdict(list)
    for term in terms:
        for ref in term["mission_refs"]: mission_map[f'{ref["course"]}/{ref["mission"]}'].append({"term_id": term["id"], "source_status": ref["source_status"], "context": ref["context"]})
    (CURATED / "mission-term-map-v0.1.yaml").write_text(json.dumps({"version": "0.1", "missions": dict(sorted(mission_map.items()))}, ensure_ascii=False, indent=2) + "\n")
    write_content(terms)
    write_stats(terms, mission_map)
    write_review()
    write_validation(terms, mission_map)

def write_content(terms):
    by_id = {x["id"]: x for x in terms}
    TERMS.mkdir(parents=True, exist_ok=True)
    for ident in CORE_IDS:
        term = by_id.get(ident)
        if not term: continue
        name, summary = DETAILS.get(ident, (term["term_ko"], f'{term["term_ko"]}은(는) 코디세이 미션에서 반복해 쓰이는 핵심 개념입니다.'))
        contexts = "; ".join(f'{r["course"]} {r["mission"]}: {r["context"]}' for r in term["mission_refs"][:4])
        related = ", ".join(term["aliases"][:4])
        text = f'''# {name}\n\n## 한 줄 설명\n\n{summary}\n\n## 쉽게 설명하면\n\n미션에서 필요한 순간에 이 개념을 하나의 역할 단위로 구분해 생각하면 됩니다. 이름만 외우기보다 입력·변화·결과가 무엇인지 확인하세요.\n\n## 정확한 설명\n\n{summary} 구현 방법은 언어와 도구에 따라 달라도, 미션 요구사항에서 맡는 역할과 한계는 구분해서 설명할 수 있어야 합니다.\n\n## 이 미션에서는 왜 필요한가\n\n{contexts}\n\n## 관련 용어\n\n{related}\n\n## 흔한 오해\n\n이름이 비슷한 도구·문법·상위 개념을 같은 것으로 취급하면 안 됩니다. 미션에서 요구한 사용 맥락과 실제 동작을 함께 확인하세요.\n\n## 동료평가 질문\n\n이 개념이 현재 미션에서 필요한 이유와, 이를 빼거나 잘못 사용했을 때 달라지는 결과를 설명할 수 있는가?\n\n## 더 깊게 보기\n\n공식 문서와 `data/curated/glossary-master-v0.1.yaml`의 미션 연결을 함께 확인합니다.\n'''
        (TERMS / f"{ident}.md").write_text(text)
    core_lines = ["# Core Terms v0.1", "", "선정 수: **50개**. 반복 등장, 미션 직접성, 동료평가 설명 가능성, 초보자 혼동 가능성, 후속 개념의 기반 여부를 함께 고려했다.", ""]
    for ident in CORE_IDS:
        term = by_id.get(ident)
        if term:
            missions = len({(r["course"], r["mission"]) for r in term["mission_refs"]})
            reason = "여러 미션에 반복 등장" if missions > 1 else "해당 미션의 핵심 구현·설명 기반"
            core_lines.append(f"- **{term['term_ko']}** (`{ident}`): {reason}.")
    (ROOT / "content" / "core-terms-v0.1.md").write_text("\n".join(core_lines) + "\n")
    pilot = ["docker-image", "shell", "git", "react-state", "foreign-key"]
    candidate_text = ["# Webtoon Candidates v0.1", "", "유머 수준은 약 30~50%이며, 기술 설명보다 상황을 웃기게 표현한다.", "", "## 우선 후보", ""]
    for ident in WEBTOON_CANDIDATE_IDS:
        term = by_id.get(ident)
        if not term: continue
        label = DETAILS.get(ident, (term["term_ko"], ""))[0]
        kind = "혼동 해소형" if ident in {"docker-image", "shell", "terminal", "git", "github", "bind-mount", "foreign-key"} else "추상 개념 시각화형"
        candidate_text.append(f"- **{label}** (`{ident}`): {kind}; 4컷으로 역할과 경계를 기억시키기 좋음.")
    candidate_text += ["", "## Pilot 선정", "", "- `docker-image`, `shell`, `git`, `react-state`, `foreign-key` — 아래 5개는 실제 이미지 생성 전 콘셉트·스크립트·프롬프트를 준비한다."]
    for ident in pilot:
        term = by_id.get(ident)
        if not term: continue
        label = DETAILS.get(ident, (term["term_ko"], ""))[0]
        folder = WEBTOONS / ident; folder.mkdir(parents=True, exist_ok=True)
        technical_summary = DETAILS.get(ident, (label, term.get("summary", "")))[1]
        (folder / "concept.md").write_text(f"# {label} 웹툰 콘셉트\n\n- 학습 목표: {label}의 역할과 가까운 개념과의 차이를 기억한다.\n- 초보자 오해: 이름이 비슷하면 같은 대상이라고 생각한다.\n- 기술적 핵심: 비유는 보조 장치이며 정확한 설명으로 바로 연결한다.\n- 비유의 한계: 실제 실행·보안·성능 조건을 만화 장면 하나로 일반화하지 않는다.\n")
        (folder / "script.md").write_text(f"# {label} 4컷 스크립트\n\n1. **문제 상황**: 학습자가 미션에서 `{label}` 때문에 막힌다.\n2. **오해/과장**: 비슷한 이름의 대상을 같은 것으로 취급해 엉뚱한 결과가 난다.\n3. **개념 등장**: 조연이 각 대상의 역할과 경계를 짧고 정확하게 설명한다.\n4. **기억에 남는 결론**: 학습자가 차이를 적용해 문제를 해결한다.\n\n## 그래서 진짜 뜻은?\n\n{technical_summary}".rstrip() + "\n")
        (folder / "image-prompt.md").write_text(f"# {label} 이미지 생성 프롬프트\n\n한국어 초보 개발자 교육용 4컷 웹툰. 주제는 **{label}**. 동일한 친근한 학습자 캐릭터와 안내자 캐릭터를 사용한다. 1컷은 미션 중 혼란스러운 문제 상황, 2컷은 흔한 오해를 30~50% 수준의 가벼운 유머로 과장, 3컷은 기술 요소의 역할과 경계를 시각적으로 구분, 4컷은 해결 뒤 기억하기 쉬운 결론. 표정·행동·말풍선을 명확히 하고 각 컷을 선명한 테두리로 분리한다. 한국어 교육 콘텐츠에 적합한 깔끔한 평면 일러스트 스타일. 기술 개념을 사실과 다르게 묘사하지 말고, 만화 다음에 정확한 설명이 이어진다는 전제를 유지한다.\n")
    (WEBTOONS / "webtoon-candidates-v0.1.md").write_text("\n".join(candidate_text) + "\n")

def write_stats(terms, mission_map):
    refs = [r for t in terms for r in t["mission_refs"]]
    status = Counter(r["source_status"] for r in refs); categories = Counter(t["category"] for t in terms); importance = Counter(t["importance"] for t in terms)
    course = Counter(r["course"] for r in refs); repeated = sorted(terms, key=lambda t: (-len({(r["course"], r["mission"]) for r in t["mission_refs"]}), t["id"]))[:15]
    lines = ["# Glossary Statistics v0.1", "", "이 문서는 `scripts/build_glossary.py`가 Master DB에서 자동 산출한다.", "", f"- canonical term 총수: **{len(terms)}**", f"- 관계 수: direct {status['direct']}, required {status['required']}, related {status['related']}", f"- 예비과정 관계 수: {course['preliminary']}", f"- 본과정 관계 수: {course['main']}", f"- 웹툰 후보 수: {sum(t['webtoon']['candidate'] for t in terms)}", "", "## 미션별 관계 수", ""]
    lines += [f"- {m}: {len(v)}" for m, v in sorted(mission_map.items())]
    lines += ["", "## 분야별 canonical term 수", ""] + [f"- {k}: {v}" for k, v in sorted(categories.items())]
    lines += ["", "## 중요도별 canonical term 수", ""] + [f"- {k}: {v}" for k, v in sorted(importance.items())]
    lines += ["", "## 반복 등장 용어 TOP 15", ""] + [f"- {t['term_ko']} (`{t['id']}`): {len({(r['course'], r['mission']) for r in t['mission_refs']})}개 미션" for t in repeated]
    (CURATED / "glossary-stats.md").write_text("\n".join(lines) + "\n")

def write_review():
    text = '''# Normalization Review\n\n## 1\n\n용어: Token\n문제: 예비과정의 개인 액세스 토큰과 본과정 JWT의 토큰은 같은 표기가 아니다.\n추천 결정: 인증 토큰은 `authentication-token` 계열로, 향후 AI Token은 별도 canonical term으로 분리한다.\n대안: 모든 token을 하나의 일반 Token으로 유지한다.\n영향: 검색 별칭은 넓어지지만 설명과 보안 맥락은 혼동될 수 있다.\n\n## 2\n\n용어: Session\n문제: 로그인 세션과 SQLAlchemy Session은 역할이 다르다.\n추천 결정: `login-session`, `sqlalchemy-session`으로 분리한다.\n대안: Session 하나에 하위 설명을 둔다.\n영향: 동일 표기의 의미 충돌을 예방한다.\n\n## 3\n\n용어: HTTP 403 / API Rate Limit\n문제: 숫자 상태 코드와 사용량 제한은 같은 현상으로 오해되기 쉽다.\n추천 결정: `http-status-code-403`과 `rate-limiting`을 분리하고 mission context로 연결한다.\n대안: HTTP Status Code의 하위 항목만 둔다.\n영향: 원인과 응답 코드를 구분해 설명할 수 있다.\n\n## 4\n\n용어: Hero / About / Skills\n문제: 페이지 섹션명은 raw에는 직접 등장하지만 일반 사전 가치가 낮다.\n추천 결정: Master DB에서는 미션 맥락 보존을 위해 남기되 core term에서는 제외한다.\n대안: curated 단계에서 제거한다.\n영향: 제출 요구 추적성과 사전 탐색 범위의 균형이 필요하다.\n\n## 5\n\n용어: UI State\n문제: loading/success/error/empty state가 개별 raw 항목으로 등장한다.\n추천 결정: `ui-state` canonical term의 mission refs로 통합하고 원문 표기는 alias로 유지한다.\n대안: 네 개 상태를 모두 독립 canonical term으로 둔다.\n영향: 상태 모델 설명은 쉬워지고 개별 검색은 별칭으로 유지된다.\n\n## 6\n\n용어: Docker Image / Digital Image\n문제: image는 컨테이너·웹 자산에서 서로 다른 뜻이다.\n추천 결정: 컨테이너 맥락은 `docker-image`로 고정하고 디지털 이미지는 별도 항목으로 둔다.\n대안: Image 하나에 여러 의미를 병기한다.\n영향: 초보자의 도구 맥락 혼동을 줄인다.\n'''
    (CURATED / "normalization-review.md").write_text(text)

def write_validation(terms, mission_map):
    ids = [t["id"] for t in terms]; valid = {"direct", "required", "related"}; missions = {f"preliminary/M{i:02}" for i in range(1,4)} | {f"main/M{i:02}" for i in range(1,14)}
    errors = []
    if len(ids) != len(set(ids)): errors.append("duplicate canonical ID")
    for term in terms:
        for ref in term["mission_refs"]:
            if ref["source_status"] not in valid: errors.append(f"invalid status: {term['id']}")
            if f"{ref['course']}/{ref['mission']}" not in missions: errors.append(f"invalid mission: {term['id']}")
        for rel in term["related_terms"]:
            if rel not in set(ids): errors.append(f"missing related ID: {rel}")
    missing_core = [x for x in CORE_IDS if not (TERMS / f"{x}.md").is_file()]
    pilots = ["docker-image", "shell", "git", "react-state", "foreign-key"]
    missing_pilot = [x for x in pilots if not all((WEBTOONS / x / f).is_file() for f in ("concept.md", "script.md", "image-prompt.md"))]
    if missing_core: errors.append("missing core files: " + ", ".join(missing_core))
    if missing_pilot: errors.append("missing pilot files: " + ", ".join(missing_pilot))
    text = "# Validation Report\n\n- Master DB format: JSON, valid YAML 1.2 subset\n- canonical ID uniqueness: " + ("PASS" if len(ids) == len(set(ids)) else "FAIL") + f" ({len(ids)} IDs)\n- mission_ref targets: " + ("PASS" if not any('invalid mission' in e for e in errors) else "FAIL") + "\n- source status values: " + ("PASS" if not any('invalid status' in e for e in errors) else "FAIL") + "\n- related term references: " + ("PASS" if not any('missing related' in e for e in errors) else "FAIL") + f"\n- core term files: {'PASS' if not missing_core else 'FAIL'} ({len(CORE_IDS) - len(missing_core)}/{len(CORE_IDS)})\n- webtoon pilot files: {'PASS' if not missing_pilot else 'FAIL'} ({len(pilots) - len(missing_pilot)}/{len(pilots)})\n- overall: " + ("PASS" if not errors else "FAIL") + "\n"
    if errors: text += "\n## Errors\n\n" + "\n".join(f"- {e}" for e in errors) + "\n"
    (CURATED / "validation-report.md").write_text(text)
    if errors: raise SystemExit("validation failed: " + "; ".join(errors))

if __name__ == "__main__":
    build()
