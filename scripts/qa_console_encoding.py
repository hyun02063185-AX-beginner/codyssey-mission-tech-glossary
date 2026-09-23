#!/usr/bin/env python3
"""콘솔 인코딩이 좁아도 QA 도구가 끝까지 도는지 확인한다.

RC QA 에서 찾은 문제다. Windows 기본 콘솔은 cp949 인데 보고서 본문에 `—`·`…` 가
들어 있어서 `content:quality` 와 `content:specificity` 가 **분석을 마치고 출력하다가**
UnicodeEncodeError 로 죽었다. 결과가 틀린 것이 아니라 결과를 못 내보낸 것이다.

여기서는 자식 프로세스의 `PYTHONIOENCODING` 을 cp949 로 강제해 그 상황을 그대로
재현한다. 그래서 Windows 가 아닌 곳에서도 같은 회귀를 잡는다.

  python scripts/qa_console_encoding.py
"""
from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path

# 이 검사기 자신도 같은 문제를 겪는다. 실제로 처음 돌렸을 때 9개를 다 통과시켜 놓고
# 마지막 요약 줄에서 죽었다. 고쳐야 할 것이 무엇인지 그대로 보여 준 셈이다.
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parent.parent

# 좁은 콘솔에서도 돌아야 하는 것들. 인자는 파일을 쓰지 않는 검사 모드로만 준다.
COMMANDS: list[list[str]] = [
    ["scripts/audit_term_specificity.py"],
    ["scripts/report_content_quality.py"],
    ["scripts/audit_map_reasons.py"],
    ["scripts/audit_learner_readability.py"],
    ["scripts/build_field_search.py"],
    ["scripts/build_pilot_comparison.py"],     # --write 없이: 표준 출력으로만 낸다
    ["scripts/build_learner_test_plan.py"],    # --write 없이: 배치 검사만 한다
    ["scripts/validate_content_integrity.py"],
    ["scripts/validate_glossary.py"],
]


def main() -> int:
    env = dict(os.environ, PYTHONIOENCODING="cp949")
    failures = []
    for command in COMMANDS:
        name = command[0].split("/")[-1]
        result = subprocess.run([sys.executable, *command], cwd=ROOT, env=env,
                                capture_output=True)
        if result.returncode == 0:
            print(f"  ok    {name}")
            continue
        tail = result.stderr.decode("utf-8", "replace").strip().splitlines()[-1:]
        failures.append((name, tail[0] if tail else f"exit {result.returncode}"))
        print(f"  FAIL  {name}")

    if failures:
        print(f"\n좁은 콘솔(cp949)에서 {len(failures)}개가 멈춘다:", file=sys.stderr)
        for name, reason in failures:
            print(f"  {name}: {reason}", file=sys.stderr)
        print("\n출력 스트림을 utf-8 로 고정하면 된다. 분석 로직을 바꾸는 문제가 아니다.",
              file=sys.stderr)
        return 1

    print(f"\n콘솔 인코딩 검사 통과 — {len(COMMANDS)}개 전부 cp949 콘솔에서도 끝까지 돈다.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
