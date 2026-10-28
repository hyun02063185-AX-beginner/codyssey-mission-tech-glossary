# 용어 작성 상태 33개 동기화 검토 보고서

- 작업일: 2026-10-28 (Asia/Seoul).
- 기준: `main` / `6fb3ce2986ed3c3e06f12785a193209efb87a47d`. 시작 시 미커밋 변경 없음, `git fetch origin` 후 `main...origin/main`은 0/0.
- 브랜치: `chore/glossary-content-status-sync-33`.
- 데이터 최종 작업 커밋: `e1ab90315cc5b08cb2e7aab5545d42a22e5f7708`. 이후 보고서만 별도 커밋한다. 보고서 포함 최종 커밋은 `git log -1 --format=%H -- reports/glossary/glossary-content-status-sync-33.md`로 확인한다(자기 커밋 해시를 본문에 기록할 수 없으므로 실행 시 해석).
- 근거: [기존 감사](glossary-content-status-audit-2026-10-28.md). 신규 콘텐츠 작성이나 기술 검수 완료 판정이 아닌, 요청된 작성 상태 메타데이터 동기화다.

## 변경 및 사전 확인

33개 모두 변경 전 raw, 상세 Markdown 주요 4절에 본문 있음. 감사 기준 `5283190`과 작업 기준 `6fb3ce2`의 대상 Markdown Git blob을 비교해 33/33 동일함을 확인했다. 감사 판단과 달라진 예외는 0개다.

| ID | 전 | 후 | 상세 Markdown |
| --- | --- | --- | --- |
| `asynchronous-programming` | raw | drafted | 있음 / 감사 이후 동일 |
| `concurrency` | raw | drafted | 있음 / 감사 이후 동일 |
| `const` | raw | drafted | 있음 / 감사 이후 동일 |
| `cookie` | raw | drafted | 있음 / 감사 이후 동일 |
| `curl` | raw | drafted | 있음 / 감사 이후 동일 |
| `data-integrity` | raw | drafted | 있음 / 감사 이후 동일 |
| `database-index` | raw | drafted | 있음 / 감사 이후 동일 |
| `database-session` | raw | drafted | 있음 / 감사 이후 동일 |
| `dependency-injection` | raw | drafted | 있음 / 감사 이후 동일 |
| `event-handler` | raw | drafted | 있음 / 감사 이후 동일 |
| `event-loop` | raw | drafted | 있음 / 감사 이후 동일 |
| `function` | raw | drafted | 있음 / 감사 이후 동일 |
| `http` | raw | drafted | 있음 / 감사 이후 동일 |
| `http-get` | raw | drafted | 있음 / 감사 이후 동일 |
| `http-post` | raw | drafted | 있음 / 감사 이후 동일 |
| `http-request-response` | raw | drafted | 있음 / 감사 이후 동일 |
| `http-status-code` | raw | drafted | 있음 / 감사 이후 동일 |
| `https` | raw | drafted | 있음 / 감사 이후 동일 |
| `json-request-response` | raw | drafted | 있음 / 감사 이후 동일 |
| `let` | raw | drafted | 있음 / 감사 이후 동일 |
| `login-session` | raw | drafted | 있음 / 감사 이후 동일 |
| `module` | raw | drafted | 있음 / 감사 이후 동일 |
| `process` | raw | drafted | 있음 / 감사 이후 동일 |
| `queue` | raw | drafted | 있음 / 감사 이후 동일 |
| `react-props` | raw | drafted | 있음 / 감사 이후 동일 |
| `request-response-cycle` | raw | drafted | 있음 / 감사 이후 동일 |
| `rest-api` | raw | drafted | 있음 / 감사 이후 동일 |
| `schema` | raw | drafted | 있음 / 감사 이후 동일 |
| `stack` | raw | drafted | 있음 / 감사 이후 동일 |
| `tcp` | raw | drafted | 있음 / 감사 이후 동일 |
| `user-event` | raw | drafted | 있음 / 감사 이후 동일 |
| `var` | raw | drafted | 있음 / 감사 이후 동일 |
| `variable` | raw | drafted | 있음 / 감사 이후 동일 |

| 집계 | 전 | 후 |
| --- | ---: | ---: |
| Canonical | 523 | 523 |
| drafted | 488 | 521 |
| raw | 35 | 2 |
| reviewed / published | 0 / 0 | 0 / 0 |

유지한 2개:

- `thread`: 경쟁 상태와 lock을 따라갈 수 있는 실제 실행 예제 보완 필요. raw 유지, 본문 미수정.
- `json-web-token`: JWT/JWS/JWE 표현 범위 설명 보완 필요. raw 유지, 본문 미수정.

## 데이터 정합성과 범위

기준 커밋의 Canonical·웹·확장 JSON과 생성 후 데이터를 파싱하여 항목 순서·ID·전체 필드를 비교했다. 세 파일 각각 정확히 위 33개의 상태만 raw→drafted이며, 나머지 490개 항목은 전체 객체가 동일하다. 33개에서도 상태 외 필드는 모두 동일하다.

- Canonical 523개와 ID·순서·상위 구조 유지. 기타 메타데이터 변경 0건.
- 웹 `src/data/generated/glossary.json`: contentStatus 521 drafted / 2 raw.
- 확장 `dist-extension/glossary.json`: 동일 집계이며 웹 파일과 바이트 단위 동일.
- hasDetailedContent: 웹·확장 모두 523개 true 유지, 변화 0개.
- 기준 파일의 승인된 33개 상태 토큰만 치환한 바이트열과 실제 파일을 비교해 동일함을 확인했다(체크아웃 CRLF/LF 정규화). JSON 전체 재포맷 없음. Canonical diff는 33줄 교체다.
- Markdown·미션 스토리·개념지도·관계·Chrome UI·데이터 계약·생성 스크립트·테스트·fixture 변경 없음. 기존 B3-1 재정비 미수정.
- 재생성 이후 데이터 변경 파일은 아래 3개뿐이었다. 보고서를 더한 최종 의도된 파일은 4개다. 의도하지 않은 변경 0개.

## 실행 결과와 기준선 비교

기존 npm 경로를 그대로 사용했다. Python 3.14.6의 python3 명령 정상 작동. 프로세스 환경에 PYTHONUTF8=1을 설정했으며 프로젝트 설정 변경 없음.

| 명령 | 작업 브랜치 결과 |
| --- | --- |
| `npm run glossary:validate` | PASS: canonical 523, mission-local 46, 오류 0 / 경고 0 / 정보 788 |
| `npm run content:integrity` | PASS: 검사 대상 상세 522, 고유 미션 본문 522, 템플릿·모순·새 경고 0 (검사 범위 수치이며 생성 데이터 상세 플래그 523과 구분) |
| `npm run build:extension` | PASS: 기존 deep-link·권한·생성물 계약 검사 통과 |
| `npm run build` | PASS: TypeScript·Vite·B2-1 검증 통과. 500 kB 초과 청크 경고 있음 |
| `npm test -- --maxWorkers=2 --testTimeout=20000` | FAIL: 41개 파일 중 39 통과 / 2 실패, 509개 테스트 중 504 통과 / 5 실패 |
| `git diff --check` | PASS |

같은 Python·Node·의존성을 사용한 별도 detached worktree(`6fb3ce2`)에서 동일 npm test 명령을 재실행했다. 기준선은 40개 파일 통과 / 1개 실패, 508개 테스트 통과 / 1개 실패다.

**기존 실패 1건**: `scripts/b31_packet_journey.test.ts:16`, `preserves the supplied ZIP and source as evidence`. 기대 SHA256은 `24e3c557520bb57a6044648d985a1445da1dba2a3a4324066f732fbef7430410`, Windows 체크아웃은 `e3fe28c0e6ed6cd12f3d1c18024437897bc709615fccb69eeea0662b7728cb8d`. Git 기준 blob은 기대 해시와 일치하고 체크아웃과 LF 정규화 후 동일하여 줄바꿈 차이임을 확인했다. 이번 작업으로 수정하지 않았다.

**이번 변경으로 추가된 테스트 실패 4건**: 모두 `scripts/glossary_visual_contract.test.mjs`의 과거 생성 데이터 전체 객체 해시 검사다. 기준선에서는 4건 모두 통과한다.

| 위치 | 검사 |
| --- | --- |
| 25 | B6-1: keeps 523 IDs, canonical metadata and all unrelated generated entries unchanged |
| 81 | Fast Batch B: changes only the two target generated entries and preserves every existing source paragraph |
| 113 | Fast Batch C: keeps unrelated entries, source section order, existing code, related terms and questions |
| 149 | Browser Rendering: changes only the target entry while retaining metadata, section order, links and original question |

이 검사는 과거 시각화 배치 외 용어의 contentStatus까지 동결하여 의도된 33개 변경에도 실패한다. **신규 테스트 실패 4건을 회귀 0건으로 보고하지 않는다.** 위 전체 필드 비교로 콘텐츠·구조·표시 플래그의 추가 차이가 없음을 별도로 확인했다. 기존 테스트/fixture를 임의 갱신하거나 검사를 무력화하지 않았다. 전체 단위 테스트 통과 상태는 아니다.

## 변경 파일과 후속 조치

1. `data/curated/glossary-master-v0.1.yaml` — 지정 33개 content_status만 변경.
2. `src/data/generated/glossary.json` — 기존 빌더로 contentStatus 반영.
3. `dist-extension/glossary.json` — 기존 확장 빌더로 동일 상태 반영.
4. `reports/glossary/glossary-content-status-sync-33.md` — 본 보고서.

Owner Gate: 검토용 Draft PR까지 진행. GPT 변경 검토 및 Owner 승인 전 병합 보류. main 병합·GitHub Pages 배포 없음. 현재 단위 테스트 신규 실패 4건도 검토에서 해소해야 한다.

후속 권고: 별도 승인 범위에서 과거 시각화 테스트의 상태 메타데이터 비교 정책을 검토하고, 콘텐츠·기타 메타데이터 불변 검사는 유지하도록 기대값 처리 방식을 정한다. B3-1 줄바꿈 해시 실패는 기존 문제로 별도 처리한다. thread의 경쟁/lock 실행 예제와 json-web-token의 JWT/JWS/JWE 범위 보완은 다음 콘텐츠 작업으로 분리한다.
