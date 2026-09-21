#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""상세 콘텐츠 생성기가 다시 같은 사고를 내지 못하게 막는 문지기.

무슨 일이 있었나
----------------
Sprint 7 의 배치 생성기 9개(scripts/implement_s7_b0*.py)가 519개 상세 콘텐츠를 만들었다.
그중 b03~b09 는 '이 미션에서는 왜 필요한가' 절을 **분야마다 한 문장으로 고정**해 두었다.

    b03 Security   "M05·M07·M13의 배포, 원격 접속, 인증 기능에서..."
    b04 Database   "M11과 M12에서 model, SQL, persistence 코드를 구현할 때..."
    b05 Linux/OS   "M07과 M08에서 command 결과, resource 지표, process 상태를..."
    b06 Git        "M04와 M06에서 변경을 안전하게 기록하고..."
    b07 Server     "M05와 M12에서 service를 배포하고..."

그 분야 안에서 다른 미션에 속한 term 이 이 문장을 그대로 물려받았다. 예를 들어
base-image 는 예비 M01 에만 나오는데 본문은 "M05와 M12에서 service를 배포하고"라고
적는다. 전수 감사 결과 79건이 이런 모순을 갖고 있었다(R12).

b01 은 term 마다 고유 문장을 들고 있어 이 결함이 없다. 문제는 분야 기본값을 박아 넣은
쪽이다.

무엇을 막는가
-------------
1. **말없이 덮어쓰기.** 생성기를 다시 돌리면 사람이 고쳐 놓은 글이 사라진다.
   그래서 기본값은 거부다. 정말 재생성하려면 환경 변수를 명시해야 한다.
2. **미션 하드코딩.** 본문이 그 term 의 실제 미션과 어긋나는 회차를 말하면 결함이다.
   이 판정 로직은 scripts/validate_content_integrity.py 가 전수로 돌린다. 그쪽이
   생성기뿐 아니라 손으로 고친 글까지 함께 보므로 더 넓게 막는다.

1번만 있으면 "재생성해도 되는 상황"에서 같은 결함이 다시 들어온다. 그래서 둘 다 둔다.
"""
import os
import re
from pathlib import Path

ALLOW_ENV = "CODYSSEY_ALLOW_CONTENT_REGENERATION"
SECTION = "## 이 미션에서는 왜 필요한가"


class ContentGenerationBlocked(RuntimeError):
    pass


def cited_missions(text):
    """본문의 '왜 필요한가' 절이 명시적으로 부르는 회차 번호."""
    match = re.search(rf"{re.escape(SECTION)}\n(.*?)(?=\n## |\Z)", text, re.S)
    body = match.group(1) if match else ""
    return {int(number) for number in re.findall(r"M(\d\d)", body)}


def mapped_missions(term):
    return {int(ref["mission"][1:]) for ref in term.get("mission_refs", [])}


def check_mission_context(term_id, text, term):
    """본문이 말하는 회차와 실제 mission_refs 가 어긋나면 이유를 돌려준다. 맞으면 None."""
    cited, mapped = cited_missions(text), mapped_missions(term)
    if cited and not (cited & mapped):
        listed = ", ".join(f"M{m:02d}" for m in sorted(cited))
        actual = ", ".join(f"M{m:02d}" for m in sorted(mapped)) or "(없음)"
        return (f"본문이 {listed} 를 말하는데 이 term 이 실제로 등장하는 미션은 {actual} 입니다. "
                "분야 기본 예시로 미션을 박아 넣지 마세요. 근거가 없으면 미션을 언급하지 않는 것이 맞습니다.")
    return None


BLOCK_MESSAGE = "\n".join([
    "{name} 은(는) 기본적으로 실행되지 않습니다.",
    "    이유: 이 스크립트는 content/terms/*.md 를 덮어씁니다. 그 뒤로 사람이 고쳐 놓은 글이",
    "    모두 사라집니다. 특히 R12 로 확인된 미션 모순 79건을 복구한 내용이 들어 있습니다.",
    "    또한 이 계열 생성기는 분야마다 미션을 고정 문구로 박아 넣는 결함이 있었습니다.",
    "    그래서 생성기 수정은 재발 방지용이고, 전면 재생성은 별도 판단 사항입니다.",
    "    정말 재생성해야 한다면 {env}=1 을 지정하고, 실행 뒤 반드시",
    "    npm run content:integrity 로 미션 모순이 다시 들어왔는지 확인하세요.",
])


def assert_generation_allowed(script_path) -> None:
    """생성기 맨 위에서 부른다. 기본은 거부다.

    9개 배치 스크립트는 쓰기 방식이 제각각이라 write 호출마다 문지기를 끼우면 깨지기 쉽다.
    그래서 여기서는 '실행 자체'를 막는다.
    """
    if os.environ.get(ALLOW_ENV) == "1":
        return
    raise ContentGenerationBlocked(BLOCK_MESSAGE.format(name=Path(script_path).name, env=ALLOW_ENV))


def write_term_file(root: Path, term_id: str, text: str, term: dict) -> None:
    """생성기가 write_text 대신 쓸 수 있는 함수. 쓰기 직전에 미션 모순까지 막는다.

    현재 9개 배치 스크립트는 assert_generation_allowed 로 입구에서 막고 있어 이 함수를
    부르지 않는다. 새 생성기를 만든다면 write_text 대신 이것을 쓰는 편이 안전하다.
    """
    if os.environ.get(ALLOW_ENV) != "1":
        raise ContentGenerationBlocked(BLOCK_MESSAGE.format(name=f"{term_id} 쓰기", env=ALLOW_ENV))
    problem = check_mission_context(term_id, text, term)
    if problem:
        raise ContentGenerationBlocked(f"[{term_id}] {problem}")
    (root / "content/terms" / f"{term_id}.md").write_text(text, encoding="utf-8")
