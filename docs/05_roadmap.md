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

상태: 제작 준비 완료 (이미지 생성은 별도)

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

구현 결과: 완료 — Vite, React, TypeScript, HashRouter 기반 정적 UI와 build-time 데이터 변환을 구성했다. 실제 웹툰 이미지는 별도 Sprint에서 연결한다.

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

## 당장 다음 작업

1. `data/curated/normalization-review.md`의 사람 판단 항목을 검토
2. 실제 Webtoon Pilot 이미지를 별도 제작 Sprint에서 검증
3. 정규화된 Master DB를 기준으로 Web UI v1의 기술 스택과 UI를 결정
