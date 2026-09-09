# 05. 초기 개발·콘텐츠 로드맵

## Phase 0 — 기준 문서 확정

상태: 완료

목표:

- 프로젝트 목적
- 데이터 모델
- 콘텐츠 작성 기준
- 웹툰 가이드
- 원천 데이터 정규화 원칙

완료 조건:

`docs/`가 이후 작업 판단의 기준으로 사용 가능하다.

---

## Phase 1 — 전체 미션 용어 추출

상태: 완료

범위:

- 예비과정 M01~M03
- 본과정 M01~M13

총 16개 미션.

작업:

1. 실제 등장 용어 추출
2. 요구사항상 필수 개념 추출
3. 연관 개념 분리
4. 미션 내 등장 맥락 보존
5. 웹툰 후보 표시

산출물:

`data/raw/`

---

## Phase 2 — 마스터 용어 DB v0.1

상태: 완료

작업:

1. 중복 제거
2. 표준명 결정
3. 영문명 및 별칭 정리
4. 분야 분류
5. 유형 정규화
6. 출처 상태 정리
7. 미션 연결
8. 이름 충돌 처리

산출물:

`data/curated/glossary-master.*`

---

## Phase 3 — 핵심 용어 콘텐츠 작성

상태: 핵심 용어 초안 완료

전체 용어를 한꺼번에 작성하지 않는다.

우선순위:

1. 여러 미션에 반복 등장
2. 미션 핵심 요구사항과 직접 연결
3. 동료평가 질문으로 자주 나올 가능성이 높음
4. 초보자가 혼동하기 쉬움

핵심 용어부터:

- 한 줄 설명
- 쉬운 설명
- 정확한 설명
- 미션 맥락
- 흔한 오해
- 동료평가 질문

을 작성한다.

---

## Phase 4 — 웹툰 Pilot

상태: 완료 — 실제 이미지 Pilot 5개 Web 연결 완료

실제 이미지 Pilot 5개 (Web 연결 완료):

- localStorage (`local-storage`)
- JavaScript (`javascript`)
- DOM (`dom`)
- defer (`defer`)
- fetch (`fetch-api`)

HTML/CSS는 후보로 유지하되 이번 실제 이미지 Pilot에는 포함하지 않는다.
기존 콘셉트 후보(`docker-image`, `shell`, `git`, `react-state`, `foreign-key`)는 후속 후보로 보존한다.

원칙: 개념을 웃기게 설명하는 것이 아니라, 개념을 정확하게 설명하되 상황을 웃기게 만든다.

전환 카피: "웃었으면 됐고, 이제 진짜 뜻을 봅시다."

예비과정 데이터에서 우선 후보를 선정한다.

초기 후보 예:

- Shell vs Terminal
- Docker Image vs Container
- Git vs GitHub
- Volume vs Bind Mount
- Class vs Object
- Branch / Merge
- Floating Point / Epsilon
- MAC Operation

처음부터 많은 수를 만들지 않고
3~5개를 제작하여 표현 방식과 학습 효과를 검증한다.

---

## Phase 5 — 웹 UI v1

상태: Release Candidate / content review

구현 결과: 완료 — Vite, React, TypeScript, HashRouter 기반 정적 UI와 build-time 데이터 변환을 구성했다. 실제 웹툰 이미지 Pilot 5개는 `/webtoons` 페이지와 용어 상세 "웹툰으로 이해하기" 섹션에 연결했다.

최소 기능:

- 검색
- 미션별 용어 목록
- 용어 상세
- 분야 필터
- 관련 용어 이동
- 동료평가 질문 표시
- 웹툰 표시

콘텐츠 구조가 안정되기 전에는 UI 개발을 앞세우지 않는다.

---

## Phase 6 — 확장

후보 기능:

- 개념 관계 지도
- 동료평가 준비 모드
- 오늘의 용어
- 웹툰 모아보기
- 미션별 학습 체크
- 사용자 피드백 기반 설명 개선

---

## Phase 7 — Glossary Content Quality Audit v1

상태: 완료 (2026-09-10)

산출물:

- `reports/glossary/glossary-content-audit-v1.md` — 550개 전수 감사 보고서
- `data/reviews/glossary-content-audit-v1.json` — machine-readable audit (177 flagged / 373 KEEP)
- `data/reviews/deep-content-priority-v1.json` — Top 50 Deep Content 우선순위 (P0 10 / P1 25 / P2 15)
- `data/reviews/manual-review.json` — 사용자 발견 오류 review backlog
- `docs/07_content_layer_model.md` — Quick/Mission/Deep 콘텐츠 레이어 모델

핵심 정책:

- Web Glossary는 Deep Layer를 제공하고, Chrome Open-book은 Quick/Mission Layer를 우선 제공한다.
- canonical count를 유지하는 것이 목표가 아니라, 기술적으로 정확하고 학습 가치 있는 canonical glossary를 만드는 것이 목표다.
- Audit 결과 없이 대량 삭제/통합/재작성하지 않는다. merge/split/remove는 후보로만 기록한다.

## 당장 다음 작업

1. **Glossary Deep Content & Canonical Correction Sprint 1** — `data/reviews/deep-content-priority-v1.json`의 P0(10개)부터 정리
2. `data/curated/normalization-review.md`의 사람 판단 항목을 audit 결과와 함께 확정
3. `data/reviews/manual-review.json` 기반 사용자 발견 오류 반영
