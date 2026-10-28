# 기술용어사전 시각 설명 Fast Track — Batch A

- 작업일: 2026-10-28 (Asia/Seoul)
- 기준: `ca6ef40` (최신 origin/main, PR #30 병합), 브랜치: `feature/glossary-visual-fast-batch-a`
- 최종 커밋: 이 보고서를 포함한 커밋. `git log -1 --format=%H -- reports/glossary-visual/fast-batch-a.md`로 조회하며 정확한 HEAD SHA는 PR과 완료 보고에도 남긴다.
- 범위: 승인된 기존 SVG 재사용 및 6개 용어 본문·등록·richSections 확장. canonical 523개 ID·분류·관계·missionRefs 유지. Story·학습가이드·B6-1 승인 SVG 원본 변경 없음.
- Database / Web·Backend / Data Structures 검토 관점: JOIN의 1:N 결과 증가·NULL 제외 조건, HTML/DOM 구분, 이벤트/함수/등록 구분, Generator/Iterator/deque 역할을 확인했다. 별도 독립 GPT 검토는 PR에서 대기한다.

| 용어 | SVG 적용 | 본문 보강 | PC/모바일 | 상태 |
| --- | --- | --- | --- | --- |
| PK | 기존 pk-fk-relationship 공유 | 한 행 식별과 FK 참조, B6-1 학생·수강 맥락 | PASS | 완료 |
| INNER JOIN | 기존 join-inner-left 공유 | 일치하는 행 쌍, 1:N 결과 증가, 미확인 SQL 개수 제거 | PASS | 완료 |
| LEFT JOIN | 기존 join-inner-left 공유 | 왼쪽 유지·NULL, WHERE의 NULL 제외 조건과 IS NULL 구분 | PASS | 완료 |
| DOM | f5-dom PC·모바일 | HTML 원본은 그대로이고 실행 중 DOM이 바뀌는 사례 | PASS | 완료 |
| 이벤트 핸들러 | f5-event 모바일 원본 공통 사용 | 클릭 → 등록된 함수 → DOM/상태 → 화면, 모든 핸들러가 화면을 바꾸지는 않음 | PASS | 완료 |
| Generator | V04 모바일 원본 공통 사용 | 리스트 보관·요청 시 재개·yield 상태 보존·순차 소비, Iterator/deque 구분 | PASS | 완료 |

## SVG 출처와 표시

모두 기준 커밋에 존재하는 승인 자산이다. 새 그림 제작이나 원본 수정 없이 복사했다.

- PK: `src/assets/glossary/b6-1/pk-fk-relationship-{desktop,mobile}.svg` (기존 등록 유지).
- INNER/LEFT JOIN: `src/assets/glossary/b6-1/join-inner-left-{desktop,mobile}.svg` (기존 등록 유지).
- DOM: `content/mission-stories/main-m01/assets/f5-dom-{desktop,mobile}.svg` → `src/assets/glossary/b1-1/`.
- 이벤트 핸들러: `content/mission-stories/main-m01/assets/f5-event-mobile.svg` → `src/assets/glossary/b1-1/`. 1200px 가로형 원본을 축소하는 대신 360px 세로형 원본을 PC/모바일 공통 사용.
- Generator: `content/mission-guides/main-m03/assets/mobile/v04-generator-streaming.svg` → `src/assets/glossary/b2-1/v04-generator-streaming-mobile.svg`. 줄바꿈된 360px 원본을 공통 사용. 그림 안의 M03 표기는 원본 보존, 본문·캡션에서 B2-1 사례임을 명시.

원본 복사본 일치 계약 테스트를 추가했다. B1-1 공통 클래스·마커 ID와 Generator의 일반적인 `arrow`/`shadow` ID는 등록 시 이름 공간을 붙여 인라인 충돌을 방지한다. 원본의 title·aria-label을 유지한다(B1/B2 원본에는 desc 없음). 기존 B6-1의 title/desc/ID는 그대로다. DOM은 PC 최대 600px·모바일 360px, 이벤트와 Generator는 최대 360px로 표시한다. 공통 520px 고정 표시를 강제하지 않는다.

## 검증 결과

Windows 실행 환경: `$env:PYTHONUTF8='1'` (필요 시 `$env:PYTHONIOENCODING='utf-8'`).

| 명령 | 결과 |
| --- | --- |
| `npm run glossary:validate` | PASS |
| `npm run content:integrity` | PASS |
| `npm test` | PASS, 39개 파일 / 484개 테스트 |
| `npm run build` | PASS, 기존 B2-1 빌드 계약 검사 포함 |
| `npm run build:extension` | PASS |
| `npx playwright test playwright/glossary-visual-fast-batch-a.spec.ts --workers=2` | PASS, 5개 테스트 |
| `node scripts/check_glossary_visual_extension.mjs --fast-batch-a` | PASS, 실제 MV3 Chromium 153.0.8010.12, quickTerms 23개·그림 용어 11개, 오류 0 |
| `git diff --check` | PASS |

집중 웹 테스트: 6개 × 1280/390px × Forest/Paper. 용어별 그림 1개, 접근 가능한 SVG 이름·캡션, 원문 절 순서와 내용 보존, 관련 용어 이동, 700/701px 전환, 페이지·그림 가로 넘침 없음, 최소 글자 크기 11px 이상, 글자 대비 4.5 이상, 필터 미적용 확인. 기존 ERD·FK·JOIN·CIDR·SSH 그림은 같은 두 폭·두 테마에서 간단 회귀했다. 미등록 이미지 대체 설명과 스타일/ID 충돌 검사는 단위 테스트로 확인했다.

실제 확장 테스트: 신규 6개와 기존 5개 상세에서 Markdown 이미지 문법이 노출되지 않고 대체 설명이 평문으로 표시됨을 확인했다. SVG/img 삽입 없음, 관련 용어 이동 정상, 기존 오픈북 23개 빠른 용어 계약 유지. 확장 구조 및 데이터 계약은 변경하지 않았다.

초기 실패와 조치: 기존 B3-1 테스트의 기본 cp949 파일 읽기는 PYTHONUTF8 환경 설정으로 해결했다(제품 코드 변경 없음). 브라우저 검사와 동시에 실행한 전체 테스트에서 기존 경로 계산 테스트가 5초 제한을 한 번 넘었으며, 동시 브라우저 부하가 없는 최종 전체 실행은 484개 모두 통과했다. 대비 측정 도구는 원·마름모 배지 배경까지 포함하도록 바로잡았고 최종 검사를 통과했다.

## 대표 캡처 (7장)

저장 폴더: `reports/glossary-visual/fast-batch-a/`. 그림과 캡션 영역을 캡처하여 직접 열어 가독성을 확인했다. 중복 전체 페이지 캡처와 긴 브라우저 로그는 커밋하지 않는다.

- `inner-join-1280-forest.png` — 공유 그림 대표.
- `dom-1280-forest.png`, `dom-390-paper.png`.
- `event-handler-1280-forest.png`, `event-handler-390-paper.png`.
- `generator-1280-forest.png`, `generator-390-paper.png`.

## 예외·미검증 및 공개 경계

미적용 항목 없음. 기존 B6-1 160개 화면 조합은 반복하지 않았다. Indigo/Signal 별도 전수 시각 검수, 실제 휴대폰 Safari/Chrome, 스크린리더 음성 낭독, 사용자 기존 Chrome 프로필의 네이티브 Side Panel UI는 미검증이다. Forest/Paper는 두 폭에서 자동 검증했고 대표 7장을 시각 확인했다. 기존 일반 게시물·댓글 SQL 코드는 보존했다.

Commit/Push 및 검토용 PR까지만 진행한다. GPT 최종 검토와 Owner 공개 승인은 대기하며 PR 병합·main 배포는 수행하지 않는다.
