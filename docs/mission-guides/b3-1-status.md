# B3-1 학습 가이드 인수인계

> 갱신일: 2026-10-19. 단계: **Owner 원고 확인 후 웹 통합 QA 완료, PR #4 검토 대기**. 이 파일은 진행 상태이며 PR 병합·공개 검증 기록이 아니다.

## 목적과 고정된 방향

- 대상: B3-1을 수행하는 코디세이 교육생. 네트워크·AWS 초심자와 다른 배포 방식을 선택한 교육생도 읽는다.
- 중심 질문: 일반 네트워크 구성의 역할·용어가 AWS의 자원·서비스와 어떻게 대응하는가. 물리 장비와 AWS 자원을 1:1로 단정하지 않는다.
- 실제 사례는 `Codyssey_B3-1` 커밋 `c68929943f1904a5c7c8033d2d49a30ace56e3d1`에 고정한다. 당시 기록과 현재 AWS 상태, 미션 요구사항과 구현 선택을 구분한다.

## 현재 산출물과 절차 상태

| 항목 | 현재 사실 | 절차상 판정 |
| --- | --- | --- |
| Codex가 만든 7장 원고·강사 노트·SVG 재사용 | `2ec3aef`까지 작성. [초안 QA](https://github.com/hyun02063185-AX-beginner/codyssey-mission-tech-glossary/blob/2ec3aef/content/mission-guides/main-m05/qa-draft.md)에 확인 범위 기록 | 최초에는 참고 초안. 이후 Claude Code가 원본과 대조하고 SVG 2종을 수정했다. |
| Claude Code 콘텐츠 담당 | 별도 브랜치 `claude/b3-1-learning-guide-review`의 `0c4c2ae`(자체 검토), `958b47a`(그림·기록 수정), `d1de30c`(기록 정확화). 7장 본문은 유지, 가이드 복사본 SVG 2종과 `content/mission-guides/main-m05/author-review.md`를 수정 | **로컬 커밋 완료.** Owner가 2026-10-19 대화에서 원고 내용을 확인했다고 알렸다. 콘텐츠 브랜치의 원격 Push는 Owner 단계로 남아 있다. |
| GPT 독립 콘텐츠 검토 | 원본 배포 커밋과 7장·강사 노트·그림을 대조하여 SVG의 SSH 지문·CIDR `/0` 표현과 검토 기록의 과장을 발견. Claude Code 수정 후 [독립 검토 기록](b3-1-independent-review.md)대로 재확인 | **PASS**. Owner의 원고 확인 보고를 받아 `d1de30c`을 웹 통합 기준으로 사용했다. |
| Codex 웹 연결 | `541eefd`에서 B3-1 미션 링크·7장 route 연결. 이후 `d1de30c`의 SVG 2종·콘텐츠 담당 기록을 통합하고 [웹 QA](../../content/mission-guides/main-m05/qa-web.md)에 재검증 결과를 추가 | 승인 원고와 실제 웹 소스 대조, 영향 범위 브라우저·빌드 QA 완료. 공개 Pages는 미검증. |
| QA 기록 | 빌드·Playwright·일부 시각·경로 검사가 통과했다는 당시 기록 | 해당 커밋의 실행 근거로만 재사용한다. 독립 콘텐츠 검토나 공개 Pages 확인을 대신하지 않는다. |
| GitHub PR | [#4](https://github.com/hyun02063185-AX-beginner/codyssey-mission-tech-glossary/pull/4)에 통합 변경을 반영해 Owner 검토 대상으로 올린다. 역할 절차 PR [#5](https://github.com/hyun02063185-AX-beginner/codyssey-mission-tech-glossary/pull/5)는 2026-10-19 병합됨. | #4의 최종 Push·Ready 상태와 head는 GitHub에서 다시 조회한다. Owner가 병합을 판단한다. |

## 다음 담당자에게

1. **Owner:** 콘텐츠 브랜치를 원격에 별도로 공유하려면 로컬 저장소에서 `git push origin claude/b3-1-learning-guide-review`를 실행한다. 갱신된 PR #4를 검토·병합한다.
2. **Codex:** 병합 후 Pages 공개 주소에서 B3-1 진입과 핵심 표·그림을 확인한다.

원본 미션의 모든 필수·선택 조건, 현재 AWS 자원 상태, 실물 휴대전화·모든 테마, 공개 Pages 화면은 아직 검증하지 않았다. 새 채팅에서는 이 문서의 기록일과 Git·PR의 실제 상태를 먼저 대조한다.

## 기업망 보강 자료 웹 통합 (2026-10-19)

- 콘텐츠 기준: Owner가 확인한 `content/b3-1-enterprise-network-supplement`의 `f455163bbf122f1efac06f476b78708466e893bd`. 이 브랜치는 당시 `main` `03230667ccd8c4221b5b269f7b7aea7a50a4d15f`에서 4커밋 앞서 있었다.
- 통합 범위: 기존 B3-1 가이드 주소의 `?document=supplement`를 사용하고 목차·2장·본문 탐색을 연결했다. 새 공개 경로 패턴을 만들지 않았고 다른 미션·용어·지식 지도·AWS 설정은 수정하지 않았다.
- 승인 원고에서 달라진 본문은 공개용 첫 상태 문장(“독립 검토 전” 삭제)과 2장으로 돌아가는 끝 링크뿐이다. 2장에는 보강 자료 진입 문장을 추가했다. 설명·그림 SVG 자체는 유지했다.
- 구성도는 최대 1144px 폭의 별도 읽기 영역에서 표시한다. 900px보다 좁은 화면은 원본 비율을 유지하고 좌우 스크롤하며, 그림 1~4와 보충 그림은 최대 360px 폭을 사용한다. 각 그림의 큰 보기 링크·대체 설명을 유지한다.
- 실행 결과: `npm run build` 통과, Vitest 전체 92개 통과(기존 가이드 및 보강 자료 렌더링·링크 검사 포함), 빌드 산출물에 SVG 6개 포함, `git diff --check` 통과.
- **미검증:** 실제 브라우저의 390px/데스크톱 화면, 키보드 스크롤, 한국어 글꼴과 이미지의 눈으로 보는 상태, GitHub Pages 공개 경로. 이 환경의 Playwright 브라우저 다운로드가 손상된 파일(0 MiB)을 반환했고 별도 브라우저는 로컬 미리보기에 접속할 수 없었다. 빌드와 HTML 렌더 검사를 시각 QA라고 부르지 않는다.
- 다음 순서: 검토용 PR에서 변경 범위와 미검증 항목을 확인하고, 브라우저·휴대전화 화면을 실제로 살핀 뒤 Owner가 병합한다. 병합 후 Pages에서 목차 → 보강 자료 → 그림 크게 열기 → 2장 이동을 확인한다.

## 시각 스토리 Scene 01 시안 (2026-10-21)

- 브랜치 `draft/b3-1-visual-story-scene-01`(분기 기준 `origin/main` `10ab089`). 산출물은 `drafts/b3-1-visual-story/scene-01/`의 노트북용·휴대전화용 SVG와 설계·용어·QA 기록이다. 단계: **Owner 시각 검토 대기**. 서비스 반영, 승인 SVG 교체, 보강 README 본문 수정은 하지 않았다.
- 기존 보강 README 장면 0과의 차이: 방문자 경로 **A1~A4 → A1~A5**(인터넷을 별도 요소로 추가), **B·C 경로 생략**, 장비 명칭 변경(관리 화면 서버 → 내부 관리 서버, DB → DB 서버 등). 시안을 채택하면 장면 0 원고를 함께 고쳐야 한다. 고칠 곳은 [Scene 01 인수인계](../../drafts/b3-1-visual-story/scene-01/handover.md)에 있다.
- 개념지도는 별도 기획이 필요한 후속 항목이다. 기획과 Owner 승인 전에는 제작하지 않는다.

## 통합 인터랙티브 개념지도 Phase 1 (2026-10-21)

- Owner의 Phase 1 구현 지시에 따라 `4e688f6d3d9076f5864646f27da7777466e1614a`에서 `feature/b3-1-interactive-concept-map-poc`을 만들었다. 단계: **작동 화면·로컬 QA 완료, Owner 사용성·디자인 검토 대기**.
- 후보 데이터 `data/mission-story-maps/main-m05/concept-map.json`과 전용 `src/missionConceptMap/`을 구현했다. 기존 지도 엔진·지도 데이터·가이드 원고·Scene 초안은 보존했고 SH01의 일반 NAT 1:1 오해 방지 문구만 후보에 반영했다.
- 지정 경로 `/#/missions/main-M05/story-map/concepts`와 미션 상세의 시안 카드가 연결된다. 전체 스토리맵·Scene 이동 링크·배포는 범위 밖이다.
- 빌드, Vitest 120개, 기존 Playwright 전체 85개, 최종 개념지도+기존 지도 회귀 29개 통과. 1280/1000/390/360px 캡처와 검증 한계, 실행 명령, Owner 조작 시나리오는 [Phase 1 결과](../../reports/b3-1-concept-map/README.md)에 기록했다.
- 로컬 커밋까지만 수행한다. Push·병합·배포와 최종 사용성 평가는 Owner 단계다. 실물 휴대전화·공개 Pages는 미검증이다.

## 개념지도 지도 영역 확대 · 1차 UX 피드백 (2026-10-22)

- `feature/b3-1-interactive-concept-map-poc`의 `7d1fb293b673c66a7e81e757060e6a3a41011161`에서 이어서 레이아웃·화면 상태·카메라만 수정했다. 콘텐츠·36노드/57관계·기존 기술지도·가이드·Scene·route는 유지했다.
- 실제 DOM 전후 측정: 1280/1000×900에서 SVG 높이 398→662px, 상단 도구 173→65px. 390/360×844에서 지도 시작 y=717/762→400px. PC 세로 스크롤·접이식 도구·집중 모드와 반응형 모바일 높이를 적용했다.
- 빌드, 전체 Vitest 120개, 전체 Playwright 107개(기존 기술지도 13개·개념지도 16개·새 레이아웃 6개 포함) 통과. 시점·선택 가림·패널·크기 변경도 검증했다.
- 단계: **로컬 구현·QA 완료, Owner 화면 검토 대기**. [측정 수치·전후 캡처·실행 명령](../../reports/b3-1-map-first/README.md). 실물 기기·공개 배포는 미검증이며 Push는 Owner가 진행한다.

## 개념지도 관계선 가독성·상세 패널 레이어 (2026-10-22)

- `8116411420dd35c64e5c4e084cb96962d5561432` 기준 Owner의 2차 UI 수정 지시를 반영했다. 카드 너비를 유지하고 컬럼 간 통로·평행 트랙·분리 연결점을 배정했다. 장거리 관계는 카드 행 사이 여백을 통과하며, 기본 관계를 약하게 하고 직접 연결된 관계를 강조한다.
- 상세 패널은 고정 헤더와 독립 스크롤 본문으로 나눴다. 불투명 배경·경계·stacking context를 정리하고 모바일 시트에도 적용했다. 콘텐츠·36노드/57관계·JSON·기존 기술지도·공개 route·가이드·Scene 원본은 변경하지 않았다.
- 빌드, Vitest 123개, 전체 Playwright 111개 통과. 네 viewport의 전후 캡처·헤더 스크롤·경로 충돌 검사와 남은 Fit/모바일 가독성 제약은 [수정·QA 기록](../../reports/b3-1-edge-lanes/README.md)에 있다.
- 단계: **로컬 구현·QA 완료, Owner 화면 검토 대기**. Push·main 병합·배포는 수행하지 않았으며 Push는 Owner가 진행한다.

## 개념지도 노드 위치 안정화·선택 강조 (2026-10-22)

- 원격·로컬 기준 `0406f0930ff9ba56912ad3a7224537dd65af9922`에서 Owner의 3차 UX 지시를 반영했다. 보기별 전체 데이터를 기준으로 좌표·port·lane을 캐시하고 표시/강조만 투영한다. 핵심 노드를 연속 배치하고 보충 노드는 컬럼 아래에 예약해 자동 표시·숨김 때 기존 노드가 이동하지 않는다.
- 선택 1 / 연결·비교 0.95 / 무관 0.25 opacity와 선명한 선택 배경·테두리·그림자, hover/focus 복원을 적용했다. 스타일·OS 다크 대응은 `.mission-concept-map`에 한정한다. 원본 데이터·기술지도·route·가이드·스토리맵/Scene은 변경하지 않았다.
- Vitest 126개, 전체 Playwright 119개, 빌드 통과. 네 viewport × light/dark의 핵심 좌표 차이와 기존 구간 경로 불일치가 모두 0이다. [연속 선택 화면·좌표/경로 측정·검증 한계](../../reports/b3-1-stable-layout/README.md).
- 단계: **로컬 구현·QA 완료, Owner UX 검토 대기**. 로컬 커밋까지만 수행하며 Push·병합·배포는 Owner 단계다.
