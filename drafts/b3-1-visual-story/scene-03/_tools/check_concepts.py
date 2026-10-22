"""concept-candidates.md의 1절(핵심 노드)·2절(핵심 관계) 표 검사.

- 모든 관계의 A·B가 노드 목록에 있는가
- 관계 유형이 여섯 가지(포함·선행·역할·흐름·대응·연관) 안에 있는가
- 어떤 관계에도 쓰이지 않는 고립 노드가 없는가
- 관계 번호·노드 번호가 겹치지 않는가

실행: python3 -I check_concepts.py
"""
import os
import re
import sys

DOC = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "concept-candidates.md")
TYPES = {"포함", "선행", "역할", "흐름", "대응", "연관"}


def rows(section_title, prefix):
    text = open(DOC, encoding="utf-8").read()
    start = text.index(section_title)
    end = text.find("\n## ", start + 1)
    out = []
    for line in text[start:end].splitlines():
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if cells and re.fullmatch(prefix + r"\d+", cells[0]):
            out.append(cells)
    return out


def main():
    nodes = rows("## 1. ", "N")
    rels = rows("## 2. ", "C")
    names = [c[1] for c in nodes]
    problems = []
    for label, items in (("노드", nodes), ("관계", rels)):
        ids = [c[0] for c in items]
        if len(ids) != len(set(ids)):
            problems.append(f"{label} 번호 중복")
    if len(names) != len(set(names)):
        problems.append("노드 이름 중복")
    used = set()
    for c in rels:
        rid, a, b, kind = c[0], c[1], c[2], c[3]
        for end in (a, b):
            if end not in names:
                problems.append(f"{rid}: 끝점 '{end}'이(가) 노드 목록에 없음")
            used.add(end)
        if kind not in TYPES:
            problems.append(f"{rid}: 관계 유형 '{kind}'이(가) 여섯 유형 밖")
        if kind == "선행":
            problems.append(f"{rid}: 학습 선행은 2-1절 학습 순서로 관리(지도 관계에 두지 않음)")
    for n in names:
        if n not in used:
            problems.append(f"고립 노드: {n}")
    print(f"노드 {len(nodes)}개, 관계 {len(rels)}개")
    for kind in sorted(TYPES):
        k = [c[0] for c in rels if c[3] == kind]
        if k:
            print(f"  {kind}: {', '.join(k)}")
    if problems:
        print("\n".join("FAIL " + p for p in problems))
        sys.exit(1)
    print("PASS 모든 관계 끝점이 노드 목록에 있음 · 유형 여섯 가지 안 · 고립 노드 없음 · 번호 중복 없음")


if __name__ == "__main__":
    main()
