# 용어사전 시각 설명 P0 — B6-1 (ERD · PK/FK · JOIN)

> 브랜치 `content/b6-1-glossary-visual-p0` · 기준 `main` `863a6ff`(PR #29) · 작성 Claude Code · 2026-10-28
> 단계: **콘텐츠 제작 완료 → GPT 독립 검토 → Owner 시각 승인 → Codex 웹 통합.** 이 폴더의 그림은 아직 공개되지 않았다.
> 근거 정책: [용어사전 시각 설명 보강 정책](../../../docs/glossary-visual-explanation-policy.md) §11 P0

## 그림 3종

| 그림 | 대상 용어 | 핵심 메시지 | desktop (폭 520) | mobile (폭 320) |
| --- | --- | --- | --- | --- |
| A. ERD 읽기 | `erd` | 상자는 표, 선은 관계, 선 끝 기호는 상대 쪽의 최소·최대 개수다 | [svg](assets/erd-basics-desktop.svg) · [png](preview/erd-desktop.png) | [svg](assets/erd-basics-mobile.svg) · [png](preview/erd-mobile.png) |
| B. PK와 FK | `foreign-key` (+ `primary-key` 공유) | FK 칸의 값이 다른 표 PK의 같은 값을 가리킨다. 없는 값은 FK 제약이 막는다 | [svg](assets/pk-fk-relationship-desktop.svg) · [png](preview/pk-fk-desktop.png) | [svg](assets/pk-fk-relationship-mobile.svg) · [png](preview/pk-fk-mobile.png) |
| C. INNER · LEFT JOIN | `join` (+ `inner-join`·`left-join` 공유) | 짝 없는 왼쪽 행은 INNER에서 빠지고 LEFT에서 NULL과 함께 남는다. 짝이 여럿이면 여러 행이 된다 | [svg](assets/join-inner-left-desktop.svg) · [png](preview/join-desktop.png) | [svg](assets/join-inner-left-mobile.svg) · [png](preview/join-mobile.png) |

세 그림은 모두 B6-1의 `student`·`enrollment`·`course`와 실제 표본 데이터를 쓴다. 원본에 없는 값은 PK/FK 그림의 거부 행(`student_id 99`) 하나이며 "교육용 예시"로 표시했다.

## 문서

| 파일 | 내용 |
| --- | --- |
| [visual-design.md](visual-design.md) | 그림별 질문·메시지·표현 규칙, 모바일 재배치, 기존 승인 그림 재사용 분석과 표기 차이 |
| [term-revision-proposal.md](term-revision-proposal.md) | `erd`·`foreign-key`·`join` 본문 개정 초안과 공유 용어 설계, Markdown 그림 참조 예시 |
| [review.md](review.md) | 기술 정확성 자체 검토, 자동·시각 QA, 미검증 항목, GPT·Owner 검토 항목, Codex 통합 작업 |

## 폴더 구조

```text
assets/          그림 원본 SVG 6개 (재사용 원본)
preview/         검수용 PNG (1280 desktop · 390 mobile) · qa-results.json
preview/qa/      360px, 현재 렌더러 390px, Indigo·Paper·Signal, OS 다크 캡처
_tools/build.py  SVG 생성기 — 그림은 이 파일을 고쳐 다시 만든다 (python -I build.py)
_tools/preview.cjs  실제 앱 화면에 그림을 넣어 캡처·측정 (npx vite preview --port 6431 실행 후)
```

## 이번 단계에서 하지 않은 것

`src/`·`data/curated/`·`content/terms/`·B6-1 스토리·가이드·승인 SVG·개념지도·웹툰·Chrome 확장·운영 정책은 수정하지 않았다. 웹 통합에 필요한 코드 변경은 [review.md §5](review.md#5-codex-웹-통합-시-필요한-작업)에만 적었다.
