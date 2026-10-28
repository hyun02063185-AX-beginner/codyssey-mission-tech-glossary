# Browser Rendering Fast Track QA — 2026-10-28

- 기준 `main`/`origin/main`: `52831907bfa9626f32442bcae7e175bcbd42abf4` (PR #34 병합).
- 브랜치: `feature/glossary-browser-rendering-status-audit`.
- 검증 소스: 이 보고서를 포함하는 Commit A. 마지막 의미 있는 수정은 두 SVG 합류선의 불필요한 화살촉 제거이며, 그 뒤 웹 빌드·대상 단위 테스트·브라우저 QA를 재실행했다. Commit B는 감사 보고서만 추가하므로 같은 QA 증빙을 재사용한다.
- 환경: macOS, Node v24.22.1, npm 11.19.1, Python 3.12.13. Python 명령에 `PYTHONUTF8=1`을 사용했으며 sudo는 사용하지 않았다.
- 범위: Browser Rendering 본문·신규 PC/모바일 SVG·기존 figures 등록 및 richSections 연결. 기존 15개 그림 용어의 본문·자산·렌더링 분기는 유지한다.

## 본문과 기술 정확성

DOM/CSSOM/스타일 계산/Layout/Paint/Compositing을 각각 설명하고 CSSOM과 Render Tree를 구분했다. B1-1의 CSS 수정·JS DOM 변경을 화면 반영 스케줄링과 연결했다. 속성별 비용을 무조건 “가장 비싸다/가장 싸다”라고 하던 설명을 제거하고, 필요한 단계·레이어 준비·재사용 조건·영향 범위를 설명했다. 매 프레임 모든 단계가 실행되지 않는다는 조건을 본문·그림·캡션에 남겼다.

기술 검토 관점은 Web/Backend Architecture(브라우저 흐름·계층 구분)와 Mission Learning(L0 용어·B1-1 예시)이다. 검토 근거는 [Chromium의 Rendering Critical Path](https://www.chromium.org/developers/the-rendering-critical-path/)와 [web.dev Rendering performance](https://web.dev/articles/rendering-performance), [레이어 수와 합성 조건](https://web.dev/articles/stick-to-compositor-only-properties-and-manage-layer-count)이다. 원래 절 순서, 관련 용어 3개, 기존 동료평가 질문을 보존했다. 새 상태 모델이나 공통 렌더러 재설계는 없다.

## 자동 검증

| 명령 | 결과 |
| --- | --- |
| `PYTHONUTF8=1 npm run glossary:validate` | PASS — canonical 523, mission-local 46, errors 0, warnings 0, info 788 |
| `PYTHONUTF8=1 npm run content:integrity` | PASS — 상세 522개(terms 디렉터리 기준), 고유 미션 맥락 522개, 템플릿 무리 0, 모순 0, 새 경고 0. 별도 경로 `content/readme-term.md`를 합치면 canonical 상세 523개 |
| `PYTHONUTF8=1 npm test` | PASS — 39 files, 495 tests |
| `PYTHONUTF8=1 npm run build` | PASS — 최종 SVG 수정 뒤 재실행, B2-1 build-check 포함 |
| `PYTHONUTF8=1 npm run build:extension` | PASS — 기존 MV3/딥링크 contract 유지 |
| `npx vitest run scripts/glossary_visual_contract.test.mjs src/TermRichContent.test.tsx` | PASS — 최종 SVG 수정 뒤 대상 29 tests |
| `PLAYWRIGHT_CHANNEL=chrome npx playwright test playwright/glossary-browser-rendering.spec.ts --workers=1` | PASS — 7 tests, Chrome 146.0.7680.165 |
| `node scripts/check_glossary_visual_extension.mjs --browser-rendering` | PASS — 실제 MV3 로드, Chromium 153.0.8010.12 |
| `git diff --check` | PASS |

최초 단위 테스트에서 기존 batch hash 검사가 이번 Browser Rendering의 의도된 변경을 “무관 항목 변경”으로 잡았다. `5283190`의 해당 항목만 작은 fixture로 저장해 기존 batch 상태를 복원한 뒤 비교하고, 별도 검사로 **나머지 522개 생성 항목 전체와 대상 canonical 메타데이터 불변**을 보장했다. 기존 승인 fixture와 SVG는 수정하지 않았다.

최초 Playwright 실행은 다운로드된 브라우저가 없어 시작하지 못했다. 웹 QA는 설치된 Chrome 채널로 통과했고, 확장 QA에 필요한 Playwright Chromium은 사용자 캐시에 설치해 실제 확장으로 확인했다. 환경 문제를 통과로 간주하지 않았다.

## 화면·모바일·회귀 검증

| 항목 | 결과 |
| --- | --- |
| 1280px × Forest / Paper | PASS — PC SVG, 제목·단계·속성 비교·캡션 |
| 390px × Forest / Paper | PASS — 세로 모바일 SVG |
| 360px × Forest / Paper | PASS — 세로 모바일 SVG |
| 701→700→390→1280px | PASS — 같은 페이지에서 모바일 선택과 PC 복귀 |
| 6개 폭/테마 조합의 기하 검사 | PASS — SVG 텍스트 겹침 0, viewBox 밖 텍스트 0, 문서·그림 가로 넘침 0, 표시 글꼴 최소 11px 이상, 텍스트 대비 4.5:1 이상, filter 없음 |
| 접근성 | PASS — role=img, 고유 title/desc ID, aria-labelledby 참조, PC/모바일 동일 desc, 내부 marker 참조. 외부 이미지·스크립트·이벤트 속성·애니메이션 없음 |
| 본문·관련 링크 | PASS — 원본 Markdown 절 순서와 화면 h2 순서 일치(관련 용어는 전용 링크 영역), 기존 질문·관련 ID 보존, 관련 링크 이동 |
| 기존 그림 간단 회귀 | PASS — `dom`, `join`, `packet` 각 6개 폭/테마 조합에서 그림 표시. 기존 15개 항목의 접근성·절 렌더링 단위 테스트 유지 |
| Chrome 확장 | PASS — browser-rendering 검색·상세 본문 표시, `![` 노출 없음, SVG/img 없음, 관련 링크 이동, 23개 quick term 회귀, pageerror 0 |

저장한 브라우저 캡처는 아래 **대표 2장뿐**이다. 두 이미지를 직접 열어 글자, 합류선·화살표 방향, 단계 순서, 여백, 잘림 여부를 확인했다. 360px 및 나머지 테마 조합은 위 브라우저 검사로 확인하고 캡처를 추가 저장하지 않았다.

- [PC 1280px · Forest](browser-rendering-1280-forest.png)
- [모바일 390px · Paper](browser-rendering-390-paper.png)

## 범위와 알려진 제한

Canonical 파일과 다른 522개 용어 본문, 기존 SVG, 미션 스토리·학습가이드·지도, 기존 batch QA 보고서는 변경하지 않았다. 생성 웹/확장 glossary 데이터는 browser-rendering 한 항목만 달라진다. 브라우저 구현별 렌더링 비용을 실제 성능 벤치마크로 보장하는 작업은 아니다. 웹 시각 QA는 Chrome, 확장 QA는 Playwright Chromium이며 Safari/Firefox는 미검증이다.

새 실패나 시각 결함은 남아 있지 않다. 웹 빌드의 기존 Vite 500kB chunk-size 안내는 남는다. [35개 상태 감사](../../glossary/glossary-content-status-audit-2026-10-28.md)의 후속 보완 대상 `thread`, `json-web-token`은 이번 변경에서 수정하지 않았다. main 병합은 Owner 승인 대상으로 남긴다.
