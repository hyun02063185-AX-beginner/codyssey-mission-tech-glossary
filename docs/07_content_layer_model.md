# 07. 콘텐츠 Layer Model

Web Glossary와 Chrome Open-book이 같은 glossary 기반을 공유하되,
표현 깊이를 **Quick / Mission / Deep** 3개 레이어로 분리한다.

핵심 정책:

- **Web Glossary는 Deep Layer까지 제공하고, Chrome Open-book은 Quick/Mission Layer를 우선 제공한다.**
- canonical count를 유지하는 것이 목표가 아니라, 기술적으로 정확하고 학습 가치 있는 canonical glossary를 만드는 것이 목표다.
- Audit 결과 없이 대량 삭제/통합/재작성하지 않는다.

## Layer 정의

### Quick Layer

- 10초 요약, 초보자가 바로 이해 가능한 표현
- Chrome Extension 기본 표시, Web 상세 최상단
- 필드: `summary`(한 줄 설명), `easyExplanation`(쉽게 설명하면), `aliases`

### Mission Layer

- 이 미션에서 왜 필요한가, 실제 사용 맥락, 짧은 예제, 동료평가 질문
- Chrome + Web 공유
- 필드: `missionContext`, `missionRefs[].context`, `codeExample`, `peerReviewQuestions`
- Chrome sidepanel의 M01 openbook(`quick_term_context`)이 이 레이어의 현재 구현 사례

### Deep Layer

- 정확한 기술 정의, 내부 동작 원리, 문법/API semantics, 제한사항/edge cases,
  비교 개념, 실제 코드/명령어, 흔한 오해, 관련 표준/런타임/환경
- Web 중심
- 기존 필드: `technicalExplanation`(정확한 설명), `commonMisconceptions`(흔한 오해), `detailRelatedTerms`(관련 용어)

## 기존 스키마 매핑

| 권장 모델 | 현재 스키마 | Layer |
|---|---|---|
| term | `id`, `termKo`, `termEn` | shared |
| one_line_summary | `summary` | Quick |
| easy_explanation | `easyExplanation` | Quick / Mission |
| precise_definition | `technicalExplanation` (강화 예정) | Deep |
| mission_context | `missionContext`, `missionRefs[].context` | Mission |
| how_it_works | **신규** `how_it_works` | Deep |
| syntax_or_example | `codeExample` (강화 예정) | Mission / Deep |
| limitations_or_edge_cases | **신규** `limitations_or_edge_cases` | Deep |
| common_misconception | `commonMisconceptions` | Deep |
| related_terms | `detailRelatedTerms` | shared |
| peer_review_question | `peerReviewQuestions` | Mission |
| webtoon | `webtoons.json` (hasImage/imageSrc/alt) | optional visual layer |

## 신규 Deep 필드 (제안 — 다음 Sprint에서 도입)

`content/terms/<term-id>.md`에 선택적 섹션으로 추가하고
`scripts/build_web_data.py`가 생성 JSON으로 변환한다.

- `## 정확한 정의` → `preciseDefinition` (기존 `정확한 설명`을 심화하거나 대체)
- `## 동작 원리` → `howItWorks`
- `## 제한사항 / 엣지 케이스` → `limitationsOrEdgeCases`

Migration impact:

- 기존 65개 상세 콘텐츠는 유지 — 새 섹션은 없는 term은 Web에서 해당 블록을 렌더링하지 않음
- Web `Term` 상세 페이지에 Deep 섹션 렌더링 추가 (App.tsx 소규모 확장)
- Chrome sidepanel은 Quick/Mission 우선 표시를 유지 — Deep 필드를 sidepanel에 추가하지 않음
- generated JSON에 필드가 늘어나지만 기존 소비자(extension sidepanel, 검색, 필터)는 영향 없음

## Chrome Extension 사용 규칙

Chrome은 "사전 전체"가 아니라 미션 수행/동료평가 중 빠른 확인용 Open-book이다.

기본 표시 우선순위:

1. term
2. 10초 요약 (`summary`)
3. 미션에서 왜 필요한가 (`missionContext`)
4. 짧은 예제 (`codeExample`)
5. 동료평가 질문 (`peerReviewQuestions`)
6. 필요 시 상세 설명 (기존 "상세 설명 보기" 확장)

Deep Layer(동작 원리, 제한사항 등)는 Chrome에 넣지 않고 Web 상세에서 제공한다.

이번 Sprint에서 Chrome UI/source/version/packaging은 수정하지 않는다.
