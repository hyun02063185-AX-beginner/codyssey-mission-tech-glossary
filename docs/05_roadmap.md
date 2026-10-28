# 05. 개발·콘텐츠 로드맵

> 이 문서는 두 부분으로 나뉜다.
> - **현재 로드맵** — 2026-10-28, `main` `fcc7514`(PR #33 병합) 기준. 지금 판단에 쓰는 기준이다.
> - **초기 로드맵 이력** — 2026-09 당시의 Phase 0~8 계획과 "당장 다음 작업" 기록. 역사로 보존하며 현재 작업 지시로 읽지 않는다.

## 현재 로드맵

### A. 완료한 작업

| 작업 | 결과 | 근거 |
| --- | --- | --- |
| 원천 용어 추출·정규화 | 예비 3 + 본과정 13, 16개 미션 | `data/raw/` · `data/curated/` · 아래 초기 Phase 1~2 |
| 전체 상세 용어 콘텐츠 | canonical 523개 전부 상세 본문 보유 (RC 당시 519개) | `content/terms/` · [Sprint 19 RC 승인](../reports/glossary/glossary-tier-a-relation-polish-rc-approval-sprint19.md) |
| 기술용어사전 웹서비스 | GitHub Pages 공개, `main` 병합 시 자동 배포 | `.github/workflows/deploy-pages.yml` |
| 웹툰 제작·공개 | 19편 승인·공개 | `content/webtoons/episodes.json` |
| Chrome 오픈북 | v0.4.2, B1-1 동료평가 23개 용어, 압축해제 로드 방식 | `extension/manifest.json` · [README](../README.md#chrome-extension-배포-zip-패키징) |
| 분야별 기술지도 · 학습 대백과 | 분야 지도 10개 + 공통 레이어 2개, Knowledge Encyclopedia V1.2 | `data/knowledge-maps/map-registry.json` · [대백과 상태](knowledge-encyclopedia/00-project-status.md) |
| 미션 학습 콘텐츠 | B1-1·B2-1·B3-1·B6-1 학습가이드·미션 스토리·개념지도 웹 통합 | `src/missionLearning.ts` · 아래 미션별 진행 상태 |
| 미션 학습 운영 기준 | 학습 운영 정책 v1.1, 제작 절차, 미션 공통 UI 기준 v1.2 | [`docs/mission-guides/`](mission-guides/learning-operation-policy.md) |
| 네트워크 기초 개념 보강 | B3-1 기초 카드·그림, 용어 4개 신규(519 → 523)·10개 보강, 기초 지도 보기 | PR #25 · #26 · #27 · [보강 보고서](../reports/b3-1-network-glossary/README.md) |
| 기술용어사전 시각 설명 보강 초기 계획 완료 | 신규 보강 13개·기존 그림 보유 2개(합계 15개 페이지)·추가 보강 보류 5개. 반응형 SVG·Rich Content 통합 기반 확보, Fast Track 운영 적용 | [PR #30](https://github.com/hyun02063185-AX-beginner/codyssey-mission-tech-glossary/pull/30) · [PR #31](https://github.com/hyun02063185-AX-beginner/codyssey-mission-tech-glossary/pull/31) · [PR #32](https://github.com/hyun02063185-AX-beginner/codyssey-mission-tech-glossary/pull/32) · [PR #33](https://github.com/hyun02063185-AX-beginner/codyssey-mission-tech-glossary/pull/33) · [시각 설명 정책 v0.2](glossary-visual-explanation-policy.md) |

배치별 QA: [B6-1 P0](../reports/glossary-visual/b6-1-p0-web-integration.md) · [Batch A](../reports/glossary-visual/fast-batch-a.md) · [Batch B](../reports/glossary-visual/fast-batch-b.md) · [Batch C](../reports/glossary-visual/fast-batch-c.md). 신규 13개와 보류 5개는 초기 후보 18개 ID의 결과이며, 기존 그림 2개 중 CIDR는 추가 제작만 보류한 항목이다. 원래 후보 밖의 SSH 키를 별도 집계하므로 두 집합을 단순 합산하지 않는다.

### B. 현재 운영 단계

새 기능을 넓히기보다, 이미 만든 자료를 강의에 쓰고 쓰면서 드러난 문제를 고치는 단계다.

1. **기존 미션 학습 콘텐츠의 실제 교육 활용** — B1-1·B2-1·B3-1·B6-1 스토리·개념지도·학습가이드·용어사전을 대면 강의와 복습에 사용한다. 기준: [학습 운영 정책](mission-guides/learning-operation-policy.md).
2. **오류·혼동 기록** — 교육과 학습 중 발견한 오류·질문·혼동을 기록하고 필요한 개정 범위를 판단한다.
3. **필요한 부분의 일괄 보강** — 관련 용어 5~8개 단위를 권장하며, 하나의 그림을 공유하는 작은 주제는 2개 단위로 진행할 수 있다. [시각 설명 정책 §9](glossary-visual-explanation-policy.md#9-역할과-승인)의 Fast Track 또는 표준 절차를 선택한다.
4. **효과가 확인될 때만 새로운 시각 보강** — 초기 계획은 완료했다. 이후에는 실제 교육 활용에서 보강 효과와 필요성이 확인된 부분만 제작하며 모든 용어에 그림을 추가하지 않는다. GPT 독립 검토와 Owner 최종 공개 승인을 유지한다.
5. **다음 미션은 Owner 실제 수행 이후 제작** — Owner가 실제로 수행한 뒤 학습 콘텐츠를 기획·제작한다. 아직 확인되지 않은 필수 미션 목록은 임의로 확정하지 않는다.

### C. 향후 확장

아래는 초기 시각 보강 완료와 구분한 **후속 확장 후보**다. 새 작업은 선행 조건이 충족되고 Owner가 승인한 뒤에 시작한다.

| 작업 | 선행 조건 |
| --- | --- |
| 추가 필수 미션의 스토리·개념지도 | Owner의 해당 미션 수행 · 필수 미션 10개 목록 확정 |
| 교육 피드백 기반 후속 시각 보강 | 초기 13개는 완료. 새로운 효과·혼동 근거 확인 → 범위 승인 → 구현·검증 → GPT 최종 검토 → Owner 공개 승인 |
| 웹툰 후속 제작 | [웹툰 가이드](04_webtoon_content_guide.md)의 승인 대기 시안 확정 |
| 기술지도 연결성 개선 | 예: [B3-1 네트워크 보강 보고서](../reports/b3-1-network-glossary/README.md)의 지도 링크 제안 검토 |
| 콘텐츠 품질 검증·유지보수 | 예: `content_status` 메타데이터 정합성(아래 참고), 다른 분야의 일괄 생성 관련 용어 링크 점검 |
| Chrome Extension 배포 방식 | GitHub Release 자동화 또는 Web Store 게시 여부 결정 |

참고: canonical의 `content_status` 값은 `drafted` 488 · `raw` 35이지만, `raw` 35개도 상세 본문의 핵심 절(한 줄 설명·쉽게 설명하면·정확한 설명·미션 맥락)을 모두 갖추고 있다. 필드 값이 본문 작성 이후 갱신되지 않은 것으로 보이며, canonical 데이터 변경이므로 별도 작업에서 판단한다.

### 미션별 진행 상태

용어를 수집했다는 것은 미션을 수행했다는 뜻이 아니다. 단계마다 따로 기록한다.

| 교육 미션 | 프로젝트 ID | 필수 10개 해당 | 용어 수집·정규화 | Owner 미션 수행 | 미션 스토리 | 개념지도 | 학습가이드 | 웹 통합·배포 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| B1-1 | `main-m01` | 해당 | 완료 | 완료 | 완료 | 완료 | 완료 | 완료 (스토리·지도 PR #28) |
| B2-1 | `main-m03` | 해당 | 완료 | 완료 | 완료 | 완료 | 완료 | 완료 |
| B3-1 | `main-m05` | 해당 | 완료 | 완료 | 완료 | 완료 | 완료 | 완료 |
| B6-1 | `main-m11` | 해당 | 완료 | 완료 | 완료 | 완료 | 완료 | 완료 |
| B1-2 · B2-2 · B3-2 · B4-1 · B4-2 · B5-1 · B5-2 · B6-2 · B6-3 | `main-m02` · `m04` · `m06` · `m07` · `m08` · `m09` · `m10` · `m12` · `m13` | 확인 필요 | 완료 | 기록 없음 | 없음 | 없음 | 없음 | — |

- "해당"은 2026-10-27 Owner 작업 지시서 기준이다. 나머지 6개 필수 미션이 무엇인지는 저장소 자료로 확인되지 않아 비워 둔다.
- 교육 미션 번호와 프로젝트 ID의 대응은 `src/encyclopedia.ts`의 `officialMainMissionIds`를 따른다.
- 예비과정 M01~M03은 용어 수집 대상이며 필수 미션 표에 넣지 않는다. 예비 M03에는 MAC 체험 자료가 있다.

---

## 초기 로드맵 이력 — 2026-09 당시 계획 기록

> 아래 Phase 0~8의 상태와 "당장 다음 작업"은 작성 당시 기준이다. 이후 진행은 `reports/glossary/`의 Sprint 보고서와 위의 현재 로드맵을 따른다.

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

## Phase 8 — Canonical Correction & Deep Content Sprint 1

상태: 완료 (2026-09-10)

- Track A: audit P0 5개 정리 — token→authentication-token(scope correction: 인증 의미로 한정, LLM token canonical은 unresolved), transaction-model→transaction-data(rename), filter→데이터 필터(rename·category 수정), masking→data-masking(merge, 550→549)
- Track B: Webtoon Pilot 5개(localStorage, JavaScript, DOM, defer, fetch) Deep Content 완성 — 동작 원리·코드 예·주의할 점·비교 개념·관련 용어 섹션 추가, Web 상세 렌더링
- 보고서: `reports/glossary/canonical-correction-sprint-1.md`

## 당장 다음 작업 (2026-09-10 당시 기록 — 현재 작업 아님)

1. **Canonical Correction & Deep Content Sprint 2** — `rate-limiting` 정리, placeholder 재작성 1차(git, docker, react, json, sql, python, cli, shell, terminal), HIGH confidence merge 쌍 검토
2. `data/curated/normalization-review.md`의 사람 판단 항목을 audit 결과와 함께 확정
3. `data/reviews/manual-review.json` 기반 사용자 발견 오류 반영
