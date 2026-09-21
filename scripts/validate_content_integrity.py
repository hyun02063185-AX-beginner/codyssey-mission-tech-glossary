#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""상세 콘텐츠의 무결성을 본다 — 형식이 아니라 '이 글이 이 term 의 글인가'를.

기존 validator 4종은 구조를 본다. canonical 수, 링크 대상, 그래프 무결성. 그것들은
R12 를 하나도 잡지 못했다. 파일은 전부 제자리에 있었고 형식도 맞았으며, 다만 내용이
다른 term 의 것이었기 때문이다.

세 가지를 본다. 심각도를 다르게 둔 이유가 각각 있다.

  ERROR    미션 문맥 모순
           본문이 M11 을 말하는데 그 term 은 M11 에 나오지 않는다. 이건 사실이 틀린
           것이라 판단의 여지가 없다.

  WARNING  템플릿 재사용
           여러 term 이 같은 본문을 공유한다. 틀린 것은 아니다 — 같은 분야의 term 이
           비슷한 설명을 갖는 것은 자연스럽다. 다만 '이 term 고유의 설명'은 아니다.
           heuristic 이므로 실패로 만들지 않는다.

  INFO     고정 예제 신호
           같은 코드 예가 여러 term 에 그대로 쓰인다. 개념을 설명하지 못하는 예제일
           가능성을 알린다.

기준선(baseline) 개념을 둔다. 이미 알고 있는 템플릿 재사용을 매번 다시 보고하면
새로 생긴 것이 묻힌다. --update-baseline 으로 현재 상태를 기록해 두면 그 뒤로는
늘어난 것만 보여 준다.
"""
import argparse
import json
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from content_generation_guard import check_mission_context  # noqa: E402

MASTER = ROOT / "data/curated/glossary-master-v0.1.yaml"
TERMS_DIR = ROOT / "content/terms"
BASELINE = ROOT / "data/reviews/content-integrity-baseline.json"
SECTION = "## 이 미션에서는 왜 필요한가"
# 한두 문장짜리 상투구는 공유돼도 문제가 아니다. 문단 길이부터 본다.
TEMPLATE_MIN_CHARS = 40


def section(text, title):
    match = re.search(rf"## {re.escape(title)}\n(.*?)(?=\n## |\Z)", text, re.S)
    return match.group(1).strip() if match else ""


def collect():
    master = {term["id"]: term for term in json.loads(MASTER.read_text(encoding="utf-8"))["terms"]}
    rows = {}
    for term_id, term in master.items():
        path = TERMS_DIR / f"{term_id}.md"
        if not path.exists():
            continue
        text = path.read_text(encoding="utf-8")
        rows[term_id] = {
            "term": term, "text": text,
            "why": section(text, "이 미션에서는 왜 필요한가"),
            "code": section(text, "코드 예"),
        }
    return master, rows


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--update-baseline", action="store_true", help="현재 템플릿 재사용 상태를 기준선으로 기록한다.")
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()

    master, rows = collect()
    errors, warnings, infos = [], [], []

    # 1. 미션 문맥 모순 — 사실이 틀린 것이라 ERROR.
    for term_id, row in sorted(rows.items()):
        problem = check_mission_context(term_id, row["text"], row["term"])
        if problem:
            errors.append(f"content/terms/{term_id}.md\n    문제: {problem}\n"
                          f"    조치: 이 term 의 mission_refs 에 적힌 실제 맥락으로 '{SECTION}' 절을 다시 쓰세요.")

    # 2. 템플릿 재사용 — heuristic 이라 WARNING.
    shared = defaultdict(list)
    for term_id, row in rows.items():
        if len(row["why"]) >= TEMPLATE_MIN_CHARS:
            shared[row["why"]].append(term_id)
    groups = {body: ids for body, ids in shared.items() if len(ids) > 1}
    baseline = json.loads(BASELINE.read_text(encoding="utf-8")) if BASELINE.exists() else {"templateGroups": {}}
    known = baseline.get("templateGroups", {})

    for body, ids in sorted(groups.items(), key=lambda kv: -len(kv[1])):
        key = body[:60]
        was = known.get(key, 0)
        if len(ids) > was:
            categories = sorted({master[i]["category"] for i in ids})
            warnings.append(
                f"content/terms — 같은 본문을 쓰는 term {len(ids)}개"
                + (f" (기준선 {was}개에서 늘었습니다)" if was else "")
                + f"\n    분야: {', '.join(categories)}"
                + f"\n    본문: {body[:80]}…"
                + f"\n    확인: 이 term 들이 정말 같은 이유로 필요한지 보세요. 분야가 같다고 이유가 같지는 않습니다."
                + f"\n    term: {', '.join(sorted(ids)[:8])}{' 외 ' + str(len(ids) - 8) + '개' if len(ids) > 8 else ''}")

    # 3. 고정 예제 — INFO.
    code_groups = defaultdict(list)
    for term_id, row in rows.items():
        if row["code"]:
            code_groups[row["code"]].append(term_id)
    for code, ids in sorted(code_groups.items(), key=lambda kv: -len(kv[1])):
        if len(ids) > 3:
            infos.append(f"같은 코드 예를 쓰는 term {len(ids)}개: {', '.join(sorted(ids)[:6])}…"
                         f"\n    예제: {code.splitlines()[0] if code.splitlines() else ''}"
                         f"\n    확인: 예제가 그 개념을 설명하는지 보세요.")

    if args.update_baseline:
        BASELINE.write_text(json.dumps({
            "artifactType": "generated-content-integrity-baseline",
            "generatedBy": "scripts/validate_content_integrity.py --update-baseline",
            "doNotEditByHand": "기준선은 '이미 알고 있는 템플릿 재사용'이다. 줄이는 것이 목표이지 늘리는 것이 아니다.",
            "templateGroups": {body[:60]: len(ids) for body, ids in groups.items()},
        }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"기준선 갱신: 템플릿 무리 {len(groups)}개")
        return 0

    unique = len({row["why"] for row in rows.values()})
    if args.json:
        print(json.dumps({"detailDocs": len(rows), "uniqueWhyBodies": unique,
                          "contextMismatch": len(errors), "templateGroups": len(groups),
                          "errors": errors, "warnings": warnings}, ensure_ascii=False, indent=1))
        return 1 if errors else 0

    for message in errors:
        print(f"ERROR: {message}")
    for message in warnings:
        print(f"WARNING: {message}")
    for message in infos:
        print(f"INFO: {message}")
    largest = max((len(ids) for ids in groups.values()), default=0)
    print(f"\nContent integrity: 상세 {len(rows)}개 · 고유 '왜 필요한가' 본문 {unique}개 · "
          f"템플릿 무리 {len(groups)}개(최대 {largest}개) · "
          f"미션 문맥 모순 {len(errors)}건 · 새 경고 {len(warnings)}건")
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
