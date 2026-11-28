"""Record B3-2's real response handling for every truncation of one PR draft.

Usage (read-only use of the B3-2 source; no network; no AI API call):

    python3 -B -I content/mission-stories/main-m06/_tools/build_max_tokens_v05.py <B3-2 checkout> <output.json>

The draft is an educational example based on the 2026-11-25 Owner PR output.
`urlopen` is replaced, so AIClient.generate() never opens a connection. Each
prefix goes through the real AIClient.generate() content handling and
validators.validate_pr(), the same order main.py uses.
"""

import io
import json
import re
import sys
from pathlib import Path

DRAFT = """Title: README에 'AI 초안은 사람이 검토' 실습 메모 추가

## Why
- AI가 작성한 초안에 대해 사용자에게 명시적으로 사람이 검토한다는 점을 알리기 위해 변경했습니다.

## What
- README.md 파일 끝에 빈 줄 한 줄과 "실습 메모: AI가 작성한 초안은 사람이 검토한다." 문구를 추가했습니다.

## How to Test
- README.md를 열어 마지막 줄에 실습 메모 문장이 있는지 확인합니다."""

# Educational unit: one whitespace-separated chunk. Not a real tokenizer count.
CHUNK = re.compile(r"\S+")


def prefixes(text: str):
    ends = [match.end() for match in CHUNK.finditer(text)]
    yield 0, ""
    for count, end in enumerate(ends, start=1):
        yield count, text[:end]


def main() -> None:
    source, output = Path(sys.argv[1]).resolve(), Path(sys.argv[2])
    sys.path.insert(0, str(source))
    from ai_gitgen import ai_client
    from ai_gitgen.ai_client import AIClient, APIError
    from ai_gitgen.prompts import PR_SYSTEM
    from ai_gitgen.validators import DraftError, validate_pr

    calls = []

    class FakeResponse(io.BytesIO):
        def __enter__(self):
            return self

        def __exit__(self, *exc):
            return False

    def fake_urlopen(req, timeout):
        calls.append(req.full_url)
        return FakeResponse(json.dumps(pending, ensure_ascii=False).encode("utf-8"))

    ai_client.request.urlopen = fake_urlopen
    total = len(CHUNK.findall(DRAFT))
    results = []
    for count, content in prefixes(DRAFT):
        finish = "stop" if count == total else "length"
        pending = {"choices": [{"index": 0, "message": {"role": "assistant", "content": content}, "finish_reason": finish}]}
        client = AIClient("https://example.invalid/v1/chat/completions", "educational-model", "fake-key", max_tokens=500)
        entry = {"units": count, "finish_reason": finish}
        try:
            text = client.generate(PR_SYSTEM, "Git context (educational)")
            entry["stage"] = "validate"
            entry["output"] = validate_pr(text)
            entry["result"] = "pass"
        except APIError as exc:
            entry.update(stage="response", result="reject", message=str(exc))
        except DraftError as exc:
            entry.update(stage="validate", result="reject", message=str(exc))
        results.append(entry)

    if len(calls) != total + 1 or any("example.invalid" not in url for url in calls):
        raise SystemExit("unexpected request target")
    record = {
        "title": "B3-2 v0.5 Max Tokens simulation record",
        "recorded": "재현 · Claude 2026-11-28",
        "source": "Codyssey_B3-2 be21c49 ai_gitgen/ai_client.py AIClient.generate() + validators.validate_pr()",
        "network": "urlopen replaced; 0 AI API calls; request target example.invalid only",
        "draft_evidence": "교육용 예시 · 2026-11-25 Owner PR 출력을 바탕으로 How to Test 원문을 교육용으로 작성",
        "unit_rule": "교육용 단위 1 = 공백·줄바꿈으로 나눈 글 조각 1개 (regex \\S+). 실제 토크나이저 수가 아님",
        "finish_reason_note": "B3-2 프로그램은 finish_reason을 읽지 않음. 기록에는 교육용으로 함께 표시",
        "draft": DRAFT,
        "total_units": total,
        "results": results,
    }
    output.write_text(json.dumps(record, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
