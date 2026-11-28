# B3-2 미션 스토리 v0.4 B-0 설계 검토

**판정 · 협의 필요.** 현재 웹 구조로 검토 모드를 추가할 수 있습니다. Phase B 전에 실습 원문의 동일성 기준, I6의 명령과 데이터 대응, I9에서 사용할 입력 기록, v0.4 Lab 색인의 스토리 링크 정책을 확정해야 합니다.

검토 브랜치는 `feature/b32-integrated-learning-v04`입니다. 웹 기준 `1ff0cf3`, 설계 및 현재 HEAD `9ed6210`을 확인했습니다. 두 커밋 사이의 변경은 v0.4 원고·설계·인수인계 및 재현 기록입니다. 학습 운영 정책에 따라 대면 강의에서 스토리로 전체 흐름을 설명하고, 상세 실행은 Lab·학습가이드로, 지식 확장은 용어사전으로 연결합니다. 미션 개념지도는 미구현으로 표시합니다. 제안하는 경로는 검토 모드 내부에 한정되며 공개 경로 계약이나 지식 데이터 변경이 필요해지면 Owner Gate를 거칩니다. [인수인계](../../content/mission-stories/main-m06/handover-v0.4.md) · [학습 운영 정책](../../docs/mission-guides/learning-operation-policy.md) · [제작 절차](../../docs/mission-guides/workflow.md) · [거버넌스](../../docs/knowledge-encyclopedia/06-agent-governance-model.md)

## 문제

1. **명령 동일성 검사가 현재 원고에서 2건 실패합니다.** 인수인계 §7이 지정한 4개 중 S2-2↔Lab 03, S3-7↔Lab 05는 일치합니다. S2-3의 첫 명령 블록과 S5-4는 각각 Lab 03·09에서 명령 사이의 빈 줄 두 개가 빠졌습니다. 설계 §8에서 Lab 06과 동일하다고 기록한 S4-4 결과도 첫 출력의 일부를 `…`로 줄인 발췌입니다. [인수인계 §7](../../content/mission-stories/main-m06/handover-v0.4.md#7-테스트와-qa) · [설계 §8](../../content/mission-stories/main-m06/design-v0.4.md#8-자체-검토-정책-7-기획-착수-체크리스트) · [스토리보드](../../content/mission-stories/main-m06/storyboard-v0.4.md) · [Lab 가이드](../../content/mission-stories/main-m06/lab-guide-v0.3-r1.md)
2. **I6의 Git 호출과 데이터 필드는 일대일로 대응하지 않습니다.** 고정 소스 `be21c49:ai_gitgen/git_collector.py`에서 `rev-parse`는 사전 확인에 쓰이고, porcelain 출력에서 `files`와 `untracked_files`를 함께 만듭니다. 설계의 ‘단계마다 여섯 칸을 하나씩 채움’과 S3-6 캡션을 그대로 연결하면 검사 결과를 데이터 필드로 그리게 됩니다. [설계 §4](../../content/mission-stories/main-m06/design-v0.4.md#4-상호작용-설계-i1i10) · [S3-6](../../content/mission-stories/main-m06/storyboard-v0.4.md#s3-6--collect_changes--git-결과를-하나로-모으기)
3. **I9에서 재현에 사용한 초안 전문이 부족합니다.** R9에는 C1–C6·P1–P5의 판정과 오류 문구, P1의 원래 테스트 주장과 후처리 후 전문이 있습니다. 모든 입력 초안의 전문은 제공하지 않습니다. 새로 쓴 초안 옆에 기존 재현 판정을 붙이면 어떤 입력으로 실제 검증했는지 확인하기 어렵습니다. I8의 원문은 로컬 B3-2 저장소의 고정 커밋 `be21c49:ai_gitgen/prompts.py`에서 읽기 전용으로 확인했습니다. [설계 §4](../../content/mission-stories/main-m06/design-v0.4.md#4-상호작용-설계-i1i10) · [재현 기록 R9](../../content/mission-stories/main-m06/assets/evidence/repro-v0.4-claude-2026-11-28.txt)
4. **Lab의 v0.3 링크는 왕복 카드 외에도 남아 있습니다.** `B32Lab`의 목차·결과 색인·Lab 상단 보조 링크가 v0.3 화면 ID를 사용합니다. 예를 들어 Lab 03의 기본 스토리 링크 `S1-2`는 v0.4에서 커밋 메시지와 PR 설명 비교 화면입니다. `readLabOrigin`과 `readStoryReturn`도 K1–K11 관계를 요구합니다. 용어사전 복귀는 `B32LearningReturn`이 기존 8화면과 v0.3 Lab 형식으로 검사합니다. [B32Lab](../../src/b32Story/B32Lab.tsx) · [labContent](../../src/b32Story/labContent.ts) · [용어사전 복귀](../../src/b32Story/B32LearningReturn.tsx)
5. **스토리의 lesson 주입 범위가 화면 콘텐츠 일부에 한정됩니다.** `B32Story`는 `screens.json` 기반 URL, 고정 여정 SVG, 이전 원고의 발표자 노트·확인 답변, `guideLinks`를 직접 사용합니다. `practice` 슬롯 유무가 P 패널 레이아웃과 스크롤 동작에도 영향을 주고, 오른쪽 패널 CSS는 v0.3 왕복 모듈에서 로드됩니다. `B32Figure`는 `b32-review`에서만 `-v03-` 자산을 읽습니다. `App.tsx`의 Lab 등록 역시 현재 `b32-review` 전용입니다. [B32Story](../../src/b32Story/B32Story.tsx) · [URL과 원고 도우미](../../src/b32Story/content.ts) · [B32Figure](../../src/b32Story/B32Figure.tsx) · [App](../../src/App.tsx)

## 제안

- 설치된 `unified`·`remark-parse`·`remark-gfm`으로 문서 구획을 읽고, 원본 오프셋으로 명령과 결과를 추출합니다. 펜스 경계만 제외하고 내부 줄바꿈·공백을 보존합니다. 문서 수준과 화면별 필수 필드, 순서, 중복, 링크·도식 상태를 검증하고 화면 ID와 줄 번호를 오류에 넣습니다. `?raw` 모듈의 파싱은 브라우저에서 실행되므로 Vite 빌드 훅에서도 같은 파서를 호출해야 잘못된 원고가 빌드를 실패시킵니다. 기존 문법으로 정적 확인한 결과 Scene 6개, 화면 31개(4·5·7·7·5·3), I1–I10, 정의된 가이드·Lab 링크 17종, 용어 파일 46종과 필요한 모바일·데스크톱 SVG 쌍을 확인했습니다. 기존 비밀값 검사에서 원고와 새 재현 기록이 통과했습니다. [원고 형식 계약](../../content/mission-stories/main-m06/handover-v0.4.md#3-원고-형식-계약) · [기존 Lab 파싱](../../src/b32Story/labContent.ts)
- `B32Story`의 화면 전환·P 패널·초점과 공통 `MissionStoryOverview`·`LearningFocusNav`·`PresentationSurface`를 재사용합니다. v0.4에 현재 lesson의 화면 목록·링크와 인트로·도식·실습 슬롯을 주입합니다. 원고의 선택 필드가 있을 때 확인 문제와 마무리를 표시합니다. 기존 공통 인트로 카드 API에는 제목·링크를 전달하고 학습 질문과 도달 목표는 펼침형 강의 구성에 배치할 수 있습니다. P 패널은 1240px 이상에서 오른쪽, 1239px 이하에서 본문 뒤로 배치하며 초점을 기존 방식으로 이동합니다. 슬라이드 Dark/Light는 기존 저장 키를 사용하고 인트로는 공통 UI 기준의 사이트 테마를 따릅니다. [공통 UI 기준](../../docs/mission-guides/mission-ui-standard.md) · [공통 인트로](../../src/missionUI/MissionStoryOverview.tsx) · [발표 테마](../../src/missionUI/PresentationTheme.tsx)
- `b32-v04` 조건에 스토리·Lab과 v0.4 원고·근거 import를 연결합니다. 주소는 HashRouter를 사용합니다. 화면과 일치하는 Scene을 먼저 확인하고, 잘못된 화면은 해당 Scene의 첫 화면으로, 잘못된 Scene은 S1-1로 복구하는 기존 규칙을 적용합니다. 중복·과다 길이·허용되지 않은 파라미터에도 기존 복구 안내를 적용합니다. `from-lab`은 스토리에서 실제 연결한 Lab일 때만 표시하고 닫기 또는 다른 화면 이동 때 제거합니다. Lab 직접 진입은 출발 화면 없이 처리하고 Lab 목차·결과·A/B/C 앵커를 유지합니다. 용어 링크의 복귀는 활성 버전에서 검증한 화면 ID만 허용합니다. [라우트 계약](../../content/mission-stories/main-m06/handover-v0.4.md#2-빌드-모드와-라우트) · [URL 복구](../../src/b32Story/content.ts)
- 해설 본문과 ‘더 읽기’에서 같은 정의를 사용합니다. S1-3·S3-5·S4-2·S4-4의 해설에도 `lab:` 참조가 있어, 정의를 복원해 허용된 Lab ID만 라우터 `Link`로 바꿉니다. S1-3의 요약 링크 문구는 실제 목적지와 일치하도록 두 Lab 링크로 나누는 편이 명확합니다. v0.4 실습에는 Lab 복사 동작을 재사용하고 결과 펜스는 출력으로만 렌더링합니다. I1–I10의 상태 전환은 로컬 정적 데이터로 처리하며 키는 마스킹합니다. I8은 고정 SHA의 프롬프트를 출처와 함께 저장하고, I9는 기록된 판정을 조회합니다. [스토리보드](../../content/mission-stories/main-m06/storyboard-v0.4.md) · [기존 Lab 복사](../../src/b32Story/B32LabMarkdown.tsx) · [상호작용 설계](../../content/mission-stories/main-m06/design-v0.4.md#4-상호작용-설계-i1i10)

## 질문

1. **원고 담당.** S2-3·S5-4 명령의 내부 빈 줄을 Lab과 맞추고 §7의 글자 단위 기준을 유지할까요? S4-4는 Lab 06 원문으로 복원할지, 현재 발췌를 유지하면서 설계 §8의 검수 기록과 결과 레이블을 갱신할지 정해 주세요.
2. **원고 담당.** I6에서 작업 폴더 확인을 별도 결과로 그리고 porcelain 단계에서 두 필드를 함께 채우도록 설계와 S3-6 캡션을 맞출까요? I9는 원래 입력 전문을 제공할지, R9에 기록된 사례 요약과 P1의 교체 전후 줄만 표시할지 정해 주세요.
3. **Lab 링크.** v0.4에서는 Lab 목차와 결과 색인의 v0.3 전용 스토리 링크를 생략하고 결과에서 Lab 섹션으로 이동하는 링크를 유지하는 안을 제안합니다. 스토리 링크도 필요하면 Lab별 v0.4 목적지 매핑을 지정해 주세요. 동명이지만 내용이 달라진 화면 ID의 자동 재사용은 피해야 합니다.
4. **진행 기준.** 협의 결과가 반영된 원고 SHA를 알려 주세요. 독립 콘텐츠 검토와 Owner 승인 대상 SHA를 확인한 뒤 웹 통합 단계로 넘어갈 수 있습니다. [제작 절차](../../docs/mission-guides/workflow.md)

## Phase B 구현 계획

| 구분 | 파일 | 이유 |
| --- | --- | --- |
| 추가 | `src/b32Story/parseStoryboardV04.ts`, `src/b32Story/lessonV04.ts` | 환경 독립적인 원고 파서와 v0.4 전용 `?raw` 로더. Scene·화면·참조·실습·도식 데이터를 원고에서 읽음 |
| 수정 | `src/b32Story/content.ts`, `src/b32Story/B32Story.tsx` | URL 도우미에 화면 목록을 전달할 수 있게 하고 기존 기본값 유지. v0.4의 관점 띠·본문·P 패널 링크·선택 필드에 필요한 슬롯 추가 |
| 추가 | `src/b32Story/B32IntegratedStory.tsx`, `src/b32Story/B32IntegratedFigures.tsx`, `src/b32Story/b32Integrated.css` | v0.4 슬롯 조합, I1–I10, 실습·결과·근거 배지와 좁은 화면 레이아웃. P 패널 레이아웃은 기존 규칙을 재사용 |
| 추가 | `src/b32Story/integratedEvidence.ts`, `src/b32Story/prompts-v04.txt` | 기존 원고·Lab·R6·R8·R9에서 관측값과 판정 추출. I8 프롬프트는 고정 SHA 원문을 출처와 함께 보관하여 빌드를 별도 체크아웃이나 네트워크에 의존시키지 않음 |
| 수정 | `src/b32Story/B32LabFigures.tsx`, `src/b32Story/B32LabMarkdown.tsx`, `src/b32Story/B32Figure.tsx`, `src/b32Story/b32Cycle.css` | HTML 도식 부품과 명령 복사 재사용, 기존 Lab의 `data-diagram`·`data-state` 유지. v0.4에서 필요한 SVG와 P 패널 규칙 연결 |
| 수정 | `src/b32Story/B32Lab.tsx`, `src/b32Story/B32LearningReturn.tsx`, `src/b32Story/reviewMode.ts` | v0.4 출발 화면 검증·복귀 링크·색인 정책을 주입. 용어사전 복귀에 모드별 검증 적용 |
| 수정 | `src/App.tsx`, `package.json`, `vite.config.ts`, `playwright.config.ts` | v0.4 지연 로딩과 Lab 라우트 조건, `dev:b32-v04` 명령, v0.4 원고 빌드 검증, `B32_V04=1` 스펙 실행 모드 등록. Playwright 서버의 잘못된 모드 재사용 방지 |
| 추가 | `src/b32Story/storyboardV04.test.ts`, `playwright/b32-integrated-v04.spec.ts` | 원고·URL·출처·명령 검증과 브라우저 동선. 31화면 직접 진입, 상호작용, 키보드·P 초점, Lab·용어 왕복, 새로고침·뒤로 가기, 클립보드 및 360/390px 넘침 확인 |
| 이후 QA | `reports/b32-integrated-learning-v04/README.md` | Phase D에서 검증 SHA·명령·결과·시각 범위와 미검증 항목 기록 |

`src/missionUI`는 현재 인터페이스로 재사용할 수 있습니다. Phase B에서는 기본·v0.3·v0.4 모드의 스토리와 Lab 노출을 대조하고, 공용 B3-2 코드 변경에 맞춰 기존 B3-2 브라우저 테스트를 다시 실행합니다. [v0.3 QA](../b32-learning-cycle-v03/README.md)

## 샌드박스 실행 확인

| 도구 | 명령 및 결과 |
| --- | --- |
| Vitest | `node_modules/.bin/vitest run src/b32Story src/missionUI --no-cache` 종료 0. 4파일·41테스트 통과. 전체 스위트의 기존 용어사전 실패 5건은 v0.3 QA 기록을 참조했습니다. |
| TypeScript | `node_modules/.bin/tsc -p tsconfig.app.json --noEmit` 종료 0. 앱 타입 검사 통과. |
| Vite | `node_modules/.bin/vite build --mode b32-v04 --outDir /tmp/b32-b0-vite.nkCidz` 종료 0. 번들 크기 경고가 있었으며, 현재 코드에서 `b32-v04` 문자열을 전달한 빌드 실행 확인입니다. v0.4 라우트·원고 검증은 Phase B 대상입니다. |
| Playwright | `node_modules/.bin/playwright test playwright/b32-learning-cycle.spec.ts --list`로 16개 수집. `CI=1 B32_REVIEW=1 PLAYWRIGHT_PORT=44173 npm_config_offline=true node_modules/.bin/playwright test playwright/b32-learning-cycle.spec.ts --grep 'nine directly accessible' --workers=1 --output=<임시 디렉터리> --reporter=line`은 Vite의 `listen EPERM: operation not permitted 127.0.0.1:44173`로 종료 1. 별도 `chromium.launch({headless:true})`도 macOS `bootstrap_check_in … Permission denied (1100)`에서 중단됐습니다. 브라우저 동선과 시각 QA는 미검증입니다. |

이 확인에는 설치된 도구와 현재 생성 데이터를 사용했습니다. Claude가 후속 브라우저 검증을 실행할 때 기존 v0.3 QA의 통과 기록과 v0.4의 새 실행 결과를 각각 SHA와 함께 기록하면 됩니다.
