#!/usr/bin/env python3
"""학습자 읽기 신호 — 검토 후보를 고르는 도구.

대상 독자는 컴퓨터를 쓸 줄은 알지만 프로그래밍·컴퓨터공학을 체계적으로 공부한
적은 거의 없는 성인이다. 그 사람이 설명을 **처음 읽었을 때** 걸리는 자리를 찾는다.

이 도구는 점수를 매기지 않는다. 숫자는 사람이 문서를 열어 볼 이유를 만들 뿐이며
절대 통과/실패 판정으로 쓰지 않는다(Discovery Cycle §6·§19).

  python scripts/audit_learner_readability.py              분포 요약
  python scripts/audit_learner_readability.py --term X     한 용어
  python scripts/audit_learner_readability.py --sample F   표본 파일(JSON)만
  python scripts/audit_learner_readability.py --json       전체 결과
"""
from __future__ import annotations

import argparse
import collections
import json
import re
import statistics
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
GLOSSARY = ROOT / "src/data/generated/glossary.json"
GRAPH = ROOT / "src/data/generated/encyclopedia-graph.json"

# 학습자가 처음 보는 자리. 이 두 절이 '첫 화면'이다.
FIRST_SCREEN = ("summary", "easyExplanation")

# 한국어 추상명사 꼬리. 연달아 나오면 문장이 손에 잡히지 않는다.
ABSTRACT = re.compile(r"[가-힣]{2,}(성|화|적|임|됨|함|화된|성의|적인)\b")
ACRONYM = re.compile(r"\b[A-Z]{2,}[0-9]*\b")
LATIN = re.compile(r"[A-Za-z][A-Za-z0-9._/-]{1,}")
PAREN = re.compile(r"[(（][^)）]*[)）]")
SENTENCE = re.compile(r"[^.!?\n]+[.!?]?")

# 대상 독자가 이미 안다고 볼 수 있는 일상 낱말. 영문이라고 전부 전문용어는 아니다.
EVERYDAY = {
    "ai", "cpu", "pc", "url", "web", "app", "id", "ok", "email", "mail", "png", "jpg",
    "pdf", "windows", "mac", "macos", "linux", "ubuntu", "google", "github", "python",
    "java", "javascript", "html", "css", "sql", "json", "csv", "http", "https", "wifi",
}


def sentences(text: str) -> list[str]:
    return [s.strip() for s in SENTENCE.findall(text) if len(s.strip()) > 1]


def load():
    glossary = json.loads(GLOSSARY.read_text(encoding="utf-8"))
    graph = json.loads(GRAPH.read_text(encoding="utf-8"))
    learn_first = set(graph["learnFirstRelations"])
    prerequisites: dict[str, set[str]] = collections.defaultdict(set)
    for edge in graph["edges"]:
        if edge["relation"] in learn_first:
            prerequisites[edge["from"]].add(edge["to"])
    return glossary, prerequisites


def build_vocabulary(glossary):
    """용어 이름을 찾기 위한 색인. 본문에 다른 용어 이름이 나오면 후보로 센다."""
    index = {}
    for term in glossary:
        for name in {term["termKo"], term["termEn"], *term.get("aliases", [])}:
            name = (name or "").strip()
            if len(name) >= 2:
                index.setdefault(name.lower(), set()).add(term["id"])
    return index


def measure(term, vocabulary, prerequisites):
    first = "\n".join((term.get(section) or "") for section in FIRST_SCREEN).strip()
    body = sentences(first)
    lengths = [len(s) for s in body]

    latin = [w for w in LATIN.findall(first) if w.lower() not in EVERYDAY]
    acronyms = [w for w in ACRONYM.findall(first) if w.lower() not in EVERYDAY]

    # 첫 화면에 이름이 등장하는 다른 canonical 용어
    mentioned = set()
    lowered = first.lower()
    for name, ids in vocabulary.items():
        if name in lowered:
            mentioned |= ids
    mentioned.discard(term["id"])

    known = {t.removeprefix("term:") for t in prerequisites.get(f"term:{term['id']}", set())}
    # 선수 관계로 이어져 있으면 학습자가 그 자리로 갈 길이 있다. 그렇지 않은 것이 문제다.
    unlinked = sorted(mentioned - known)

    return {
        "sentences": len(body),
        "avgSentenceLen": round(statistics.mean(lengths), 1) if lengths else 0,
        "maxSentenceLen": max(lengths) if lengths else 0,
        "longSentences": sum(1 for n in lengths if n > 80),
        "latinTokens": len(latin),
        "acronyms": sorted(set(acronyms)),
        "parentheticals": len(PAREN.findall(first)),
        "abstractNouns": len(ABSTRACT.findall(first)),
        "otherTermsMentioned": sorted(mentioned),
        "mentionedWithoutPrerequisite": unlinked,
        "firstScreenChars": len(first),
    }


def flags(row):
    """사람이 열어 볼 이유. 판정이 아니다."""
    out = []
    if row["maxSentenceLen"] > 90:
        out.append("긴 문장")
    if row["latinTokens"] >= 5:
        out.append("영문 용어 밀집")
    if len(row["acronyms"]) >= 2:
        out.append("약어 밀집")
    if row["parentheticals"] >= 2:
        out.append("괄호 많음")
    if row["abstractNouns"] >= 4:
        out.append("추상명사 연속")
    if len(row["mentionedWithoutPrerequisite"]) >= 3:
        out.append("설명 없는 선수용어")
    if row["sentences"] <= 1 and row["firstScreenChars"] > 120:
        out.append("한 문장에 여러 개념")
    return out


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--term")
    ap.add_argument("--sample")
    ap.add_argument("--json", action="store_true")
    args = ap.parse_args()

    glossary, prerequisites = load()
    vocabulary = build_vocabulary(glossary)
    rows = {}
    for term in glossary:
        if not term.get("hasDetailedContent"):
            continue
        row = measure(term, vocabulary, prerequisites)
        row["flags"] = flags(row)
        row["name"] = term["termKo"]
        rows[term["id"]] = row

    if args.sample:
        wanted = json.loads(Path(args.sample).read_text(encoding="utf-8"))
        ids = [t for group in wanted.values() for t in group] if isinstance(wanted, dict) else wanted
        rows = {t: rows[t] for t in ids if t in rows}

    if args.json:
        print(json.dumps(rows, ensure_ascii=False, indent=2))
        return 0

    if args.term:
        row = rows.get(args.term)
        if not row:
            print(f"없는 용어: {args.term}")
            return 1
        print(f"{args.term} ({row['name']}) — 첫 화면 {row['firstScreenChars']}자 / {row['sentences']}문장")
        print(f"  문장 길이   평균 {row['avgSentenceLen']} · 최대 {row['maxSentenceLen']} · 80자 초과 {row['longSentences']}")
        print(f"  영문 토큰   {row['latinTokens']} · 약어 {row['acronyms']}")
        print(f"  괄호 {row['parentheticals']} · 추상명사 {row['abstractNouns']}")
        print(f"  함께 나온 용어 {len(row['otherTermsMentioned'])}개 "
              f"(선수 관계 없는 것 {len(row['mentionedWithoutPrerequisite'])}: "
              f"{', '.join(row['mentionedWithoutPrerequisite'][:6])})")
        print(f"  검토 사유   {', '.join(row['flags']) or '없음'}")
        return 0

    print(f"상세 콘텐츠 {len(rows)}개의 첫 화면(한 줄 설명 + 쉽게 설명하면)\n")
    for key, label in (("avgSentenceLen", "평균 문장 길이"), ("maxSentenceLen", "최대 문장 길이"),
                       ("latinTokens", "영문 토큰 수"), ("abstractNouns", "추상명사 수"),
                       ("firstScreenChars", "첫 화면 글자 수")):
        values = sorted(r[key] for r in rows.values())
        mid = values[len(values) // 2]
        p90 = values[int(len(values) * 0.9)]
        print(f"  {label:<16} 중앙 {mid:>6} · 상위 10% {p90:>6} · 최대 {values[-1]:>6}")

    counter: collections.Counter = collections.Counter()
    for row in rows.values():
        counter.update(row["flags"])
    print(f"\n검토 사유별 용어 수 (전체 {sum(1 for r in rows.values() if r['flags'])}개에 하나 이상)")
    for reason, n in counter.most_common():
        print(f"  {reason:<16} {n}")
    print("\n이 숫자는 검토 후보를 고르는 신호다. 통과/실패 판정이 아니다.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
