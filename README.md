# Codyssey Mission Tech Glossary

> **코디세이 기술용어 사전**<br>
> *일명, 버티다 보면 아는 말 사전*

**미션 하나, 용어 하나. 버티다 보면 실력이 된다.**

코디세이 예비과정 및 본과정 미션에서 실제로 만나는 기술용어와 핵심 개념을
미션 수행과 동료평가에 바로 활용할 수 있도록 정리하는 미션 기반 기술용어 사전 프로젝트입니다.
용어사전에서 출발해, 실제로 수행한 미션의 학습 경험을 미션 스토리·개념지도·학습가이드로 정리하는 교육 자산으로 확장하고 있습니다.

**Live Web:** https://hyun02063185-ax-beginner.github.io/codyssey-mission-tech-glossary/

## Project Goal

이 프로젝트는 컴퓨터 과학 전체를 포괄하는 백과사전을 만들기 위한 것이 아닙니다.

- 코디세이 미션에 실제 등장한 기술용어를 우선 수집합니다.
- 미션 수행에 꼭 필요한 배경 개념은 별도로 연결합니다.
- "정의"뿐 아니라 "이 미션에서 왜 필요한가"를 설명합니다.
- 동료평가에서 사용할 수 있는 이해 확인 질문과 흔한 오해를 함께 제공합니다.
- 실제로 수행한 미션은 흐름(스토리)·관계(개념지도)·실행(학습가이드)으로 나누어 L0 입문자도 따라올 수 있게 설명합니다.
- 비유와 시각화가 특히 도움이 되는 일부 개념은 웹툰이나 그림으로 설명합니다. 모든 용어에 그림을 넣지 않습니다.

## Brand

- 서비스명: **코디세이 기술용어 사전**
- 영문명: **Codyssey Mission Tech Glossary**
- 별명: **버티다 보면 아는 말 사전**
- 캐치프레이즈: **미션 하나, 용어 하나. 버티다 보면 실력이 된다.**

## 현재 제공 현황

2026-10-27, `main` `bbbddfc`(PR #28 병합) 기준으로 저장소 데이터에서 다시 계산한 값입니다.

| 항목 | 현재 값 | 근거 |
| --- | --- | --- |
| Canonical 기술용어 | **523개** | `data/curated/glossary-master-v0.1.yaml` |
| 상세 콘텐츠 작성 | **523 / 523 (100%)** | 모든 용어에 상세 본문 존재 (`content/terms/*.md`, `readme`만 `content/readme-term.md`) |
| 웹툰 | **19편 승인 · 19편 공개** | `content/webtoons/episodes.json` (`status: approved` 19편) → `/webtoons` |
| 분야별 기술지도 | **10개** + 분야 공통 레이어 2개 | `data/knowledge-maps/map-registry.json` |
| 개념 연결 | **7개** | `data/curated/concept-connections-v1.json` → `/connections` |
| 미션 학습 콘텐츠 | **본과정 4개 미션** (B1-1 · B2-1 · B3-1 · B6-1) | 아래 표 · `src/missionLearning.ts` |
| Chrome 오픈북 | **v0.4.2** · 압축해제 로드 방식 | `extension/manifest.json` · Web Store·GitHub Release 미게시 |

용어 수 변화: RC 승인 당시 519개 → 2026-10-26 B3-1 네트워크 기초 보강에서 `ip-address`·`private-ip`·`packet`·`network-protocol` 4개 등록으로 523개. 근거는 [B3-1 네트워크 용어 보강 보고서](reports/b3-1-network-glossary/README.md)입니다.

## 미션 범위와 학습 콘텐츠

### 용어 수집 범위 — 16개 미션

예비과정 3개(M01~M03)와 본과정 13개(B1-1~B6-3)의 기술용어를 모두 수집·정규화했습니다. **용어 수집은 미션 수행이 아닙니다.** 용어가 사전에 있다는 것은 해당 미션 문서에서 용어를 추출했다는 뜻일 뿐입니다.

### 미션 학습 콘텐츠 — Owner가 실제로 수행한 미션만

미션 스토리·개념지도는 Owner가 본과정 필수 미션을 **직접 수행한 뒤** 그 학습 경험을 바탕으로 만듭니다. 아직 수행하지 않은 미션의 스토리·개념지도를 AI가 미리 만들지 않습니다.

현재 Owner가 수행하고 학습 콘텐츠까지 공개한 미션:

| 교육 미션 | 프로젝트 ID | 미션 스토리 | 개념지도 | 학습가이드 |
| --- | --- | --- | --- | --- |
| B1-1 | `main-m01` | `#/missions/main-M01/story` | `#/missions/main-M01/story/concepts` | `#/missions/main-M01/guide` |
| B2-1 | `main-m03` | `#/missions/main-M03/story` | `#/missions/main-M03/story/concepts` | `#/missions/main-M03/guide` |
| B3-1 | `main-m05` | `#/missions/main-M05/story-map` | `#/missions/main-M05/story-map/concepts` | `#/missions/main-M05/guide` |
| B6-1 | `main-m11` | `#/missions/main-M11/story` | `#/missions/main-M11/story/concepts` | `#/missions/main-M11/guide` |

- 나머지 본과정 미션은 용어 수집만 완료된 상태입니다. 학습 콘텐츠는 Owner의 미션 수행이 먼저입니다.
- Owner가 수행할 본과정 **필수 미션 10개**는 수집 범위 13개와 다른 기준입니다. 10개의 공식 ID 목록은 아직 저장소에 기록되지 않았습니다(확인 필요).
- 예비과정 M03에는 MAC 계산을 직접 움직여 보는 체험 자료(`#/learning-assets/mac-sliding-window`)가 있습니다.
- 미션별 단계 상태(용어 수집 · 미션 수행 · 스토리 · 개념지도 · 학습가이드 · 웹 통합)는 [로드맵](docs/05_roadmap.md#미션별-진행-상태)에서 관리합니다.

### 콘텐츠별 역할

| 자산 | 설명하는 것 |
| --- | --- |
| 미션 스토리 | 한 미션 안에서 기술이 어떤 순서로, 어떤 역할로 작동하는가 |
| 개념지도 | 그 미션의 주요 개념이 서로 어떤 관계인가 |
| 용어사전 | 한 용어의 정확한 정의와 원리, 다른 지식과의 연결 |
| 학습가이드 | 코드·명령·실습·검증 방법 |
| 대면 강의 | L0 입문자가 따라올 수 있는 큰 구조와 자료 사용법 |
| 시각 설명 | 그림으로 구조·흐름·차이가 분명하게 개선되는 용어에만 선택적으로 추가 |

상세 기준은 [학습 운영 정책](docs/mission-guides/learning-operation-policy.md)과 [용어사전 시각 설명 보강 정책](docs/glossary-visual-explanation-policy.md)을 따릅니다.

## 주요 기능

- **용어사전** (`#/terms`): 검색, 분야·미션 필터, 10초 요약 → 상세 설명(동작 원리·코드 예·흔한 오해·동료평가 질문), 관련 용어·개념 연결·웹툰 이동.
- **미션 학습** (`#/missions`): 미션 소개 화면에서 미션 스토리·개념지도·학습가이드를 고릅니다. 공통 화면 기준은 [미션 공통 UI 기준](docs/mission-guides/mission-ui-standard.md)입니다.
- **분야별 기술지도** (`#/maps`): 프론트엔드·Git/협업·데이터/DB·Backend·Linux/OS·DevOps·Security·알고리즘·네트워크·AI/ML 10개 분야 지도와 미션 overlay.
- **학습 대백과** (`#/encyclopedia`): 학문·직무·선수학습·개념 연결 관점의 탐색. 현재 상태는 [Knowledge Encyclopedia 상태](docs/knowledge-encyclopedia/00-project-status.md)를 참고합니다.
- **웹툰** (`#/webtoons`): 승인된 4컷 웹툰 19편. 11개 용어의 상세 화면에 "웹툰으로 이해하기"로 연결됩니다.
- **오픈북** (`#/openbook/main-m01`): B1-1 동료평가용 핵심 23개 용어 요약. 같은 내용을 Chrome Side Panel 확장으로도 씁니다.

## Documentation

**기준 문서**

- [프로젝트 정의와 원칙](docs/00_project_overview.md)
- [정보 구조와 사용자 흐름](docs/01_information_architecture.md)
- [용어 데이터 모델](docs/02_glossary_data_model.md)
- [용어 콘텐츠 작성 가이드](docs/03_content_writing_guide.md)
- [웹툰 콘텐츠 가이드](docs/04_webtoon_content_guide.md)
- [개발·콘텐츠 로드맵](docs/05_roadmap.md)
- [원천 데이터 정규화 기준](docs/06_source_data_normalization.md)
- [콘텐츠 Layer Model](docs/07_content_layer_model.md)
- [Canonical 용어 선정·성장 정책](docs/13_canonical_term_selection_growth_policy_v1.md)
- [용어사전 시각 설명 보강 정책](docs/glossary-visual-explanation-policy.md)

**미션 학습 콘텐츠**

- [학습 운영 정책 및 교육 철학](docs/mission-guides/learning-operation-policy.md)
- [제작·검토·웹 통합 절차](docs/mission-guides/workflow.md)
- [미션 공통 UI 기준](docs/mission-guides/mission-ui-standard.md)

**아키텍처·운영**

- 지도 설계: [08](docs/08_m01_knowledge_map_design.md) · [09](docs/09_frontend_knowledge_map_architecture.md) · [10](docs/10_technology_field_atlas_architecture.md) · [11](docs/11_knowledge_map_engine_architecture.md) · [12](docs/12_cross_field_layer_architecture.md)
- [Knowledge Encyclopedia 상태](docs/knowledge-encyclopedia/00-project-status.md) · [에이전트 거버넌스 계약](docs/knowledge-encyclopedia/06-agent-governance-model.md)
- [Chrome Side Panel 설치](docs/chrome-extension-install-guide.md) · [B1-1 동료평가 오픈북 안내](docs/m01-peer-review-openbook-guide.md)

## 개발과 검증

```bash
npm install
npm run dev          # 데이터 생성 후 개발 서버
npm run build        # B2-1 원고 무결성 → 데이터 생성 → 타입 검사 → 빌드
npm run test         # 데이터 생성 후 Vitest
```

웹 앱은 Vite + React + TypeScript와 HashRouter를 사용해 GitHub Pages의 저장소 하위 경로에서도 동작합니다. `main`에 병합되면 GitHub Actions(`deploy-pages.yml`)가 Pages를 배포합니다.

`scripts/build_web_data.py`는 curated Master DB와 작성된 콘텐츠를 `src/data/generated/`로 변환하며, raw 데이터는 브라우저에서 직접 읽지 않습니다. 원천 데이터는 `data/raw/`, 정규화된 DB와 검증 결과는 `data/curated/`에서 추적합니다.

자주 쓰는 검증 명령:

| 명령 | 확인 대상 |
| --- | --- |
| `npm run glossary:validate` | canonical ID·미션 연결·관련 용어 참조 |
| `npm run content:integrity` | 용어 본문 무결성 |
| `npm run atlas:validate` · `npm run knowledge-map:validate` | 분야 기술지도 |
| `npm run mission:ui-check` | 미션 공통 UI |
| `npm run test:map-interaction` | Playwright 브라우저 동선 |

GitHub Actions 빌드 성공을 브라우저·시각 QA 완료로 해석하지 않습니다. 미션 화면의 PC·모바일 검증 기준은 [미션 공통 UI 기준](docs/mission-guides/mission-ui-standard.md#신규-미션-등록검증)을 따릅니다.

웹툰은 이미지 파일이 있다는 이유만으로 공개되지 않습니다. 작품 ID·대사·그림 설명·원본·연결 용어·Owner 승인을 `content/webtoons/episodes.json`에 기록하고, [제작·출력 안내](content/webtoons/episodes/README.md)에 따라 자산을 준비합니다. 승인된 작품만 빌드에 포함합니다. 초기 Pilot 5편의 이미지는 `content/webtoons/archive/`에 보관합니다.

## 이력

과거 Sprint·RC 보고서의 수치는 당시 기록이며 수정하지 않습니다.

- **2026-09 · Glossary RC freeze**: 16개 미션 정규화, canonical 정비, S7-B01~B09 상세 콘텐츠 작성 완료. 당시 canonical 519개, 상세 100%. 근거: [Sprint 19 보고서](reports/glossary/glossary-tier-a-relation-polish-rc-approval-sprint19.md).
- **2026-10-01 · Knowledge Encyclopedia V1.2**: 학문·직무·선수학습·기술지도 탐색과 시각 기반 정리. 근거: [V1.2 릴리스 노트](docs/knowledge-encyclopedia/release-notes-v1.2.md).
- **2026-10-13 ~ 10-27 · 미션 학습 콘텐츠**: B1-1·B2-1·B3-1·B6-1 학습가이드, 미션 스토리·개념지도, 미션 공통 UI v1.2, 웹툰 19편, B3-1 네트워크 기초 보강(519 → 523). 병합 이력은 `git log --merges --first-parent main`으로 확인합니다.

## Chrome Extension 배포 (ZIP 패키징)

오픈북 확장 프로그램은 현재 Chrome 개발자 모드의 **압축해제된 확장 프로그램**으로 설치합니다. Chrome Web Store와 GitHub Release에는 아직 게시하지 않았습니다(2026-10-27 확인). 확장 프로그램을 Node/npm이 없는 다른 PC에서도 설치할 수 있도록 배포용 ZIP을 만듭니다.

### A. 개발 환경이 있는 경우

```bash
npm install
npm run package:extension
```

이 명령 하나가 다음을 모두 수행합니다.

1. `npm run build:extension` — `dist-extension/` 빌드 및 자체 검증
2. `dist-extension/` 산출물 검증 — `manifest_version = 3`, `version` 존재, `sidepanel.html`/`background.js`/`content.js`/데이터 파일 존재 확인 (누락 시 실패)
3. ZIP 생성 — `releases/codyssey-openbook-v<version>.zip`
4. ZIP 검증 — 임시 디렉터리에 풀어 `manifest.json` 루트 존재, `version` 일치, 필수 파일 존재를 자동 확인

ZIP 파일명의 `<version>`은 `extension/manifest.json`에서 자동으로 읽으므로 하드코딩하지 않습니다.
ZIP 루트에 `manifest.json`이 직접 오므로, 압축을 풀면 그 폴더를 바로 Chrome에서 로드할 수 있습니다.

### B. 일반 사용자 (Node/npm 불필요)

1. 전달받은 `codyssey-openbook-v0.4.2.zip`을 준비합니다 (GitHub Release는 아직 없으므로 위 A에서 만든 ZIP을 전달받습니다)
2. 압축 해제 (예: `codyssey-openbook-v0.4.2` 폴더 생성)
3. Chrome 주소창에 `chrome://extensions` 입력
4. 우측 상단 **개발자 모드** ON
5. **압축해제된 확장 프로그램을 로드합니다** 클릭
6. 압축을 푼 폴더(`codyssey-openbook-v0.4.2`) 선택

Node/npm 설치가 필요 없습니다. ZIP 압축 해제 → Chrome unpacked load만으로 바로 사용할 수 있습니다.

### 사용 방법

오픈북은 먼저 **10초 요약**으로 빠르게 확인하고, 더 알고 싶을 때 **상세 설명 보기**를 펼치는 두 단계 사전입니다. 페이지에서 용어를 선택한 뒤 우클릭해 **코디세이 사전에서 찾기**를 누르면 Side Panel 검색으로 전달됩니다.

검색 결과에는 **웹에서 자세히 보기**와 **기술 지도에서 보기** 링크가 함께 표시됩니다. 웹 링크는 공개 사전의 용어 상세로, 지도 링크는 해당 용어가 실제 node로 존재하는 Technology Field Map으로 새 탭에서 열립니다. B1-1 맥락이 있는 용어는 `mission=main-m01`과 선택된 term을 쿼리로 유지해 미션 overlay 위에서 바로 확인할 수 있습니다. Extension은 깊은 콘텐츠를 복제하지 않고 공개 Web으로 연결합니다.

### 업데이트 방법

새 버전 ZIP을 받았을 때:

- 기존 폴더를 새 버전 폴더로 교체한 뒤, `chrome://extensions`에서 해당 확장의 **새로고침** 버튼을 누릅니다.
- 또는 기존 확장을 **제거**하고 새 폴더를 다시 로드합니다.

unpacked extension 특성상 Chrome Web Store 배포 전까지는 **자동 업데이트가 되지 않습니다.** 새 버전이 나오면 위 방법으로 직접 갱신해야 합니다.

### 버전 정책

- **Extension version이 배포 기준 Source of Truth**입니다: `extension/manifest.json`의 `version`(현재 `0.4.2`)이 빌드 → ZIP 파일명 → 검증까지 그대로 사용됩니다.
- `package.json`의 `version`(현재 `0.1.0`)은 npm/Web UI 프로젝트 버전으로 Extension 버전과 역할이 다릅니다. Extension 버전을 올릴 때는 `extension/manifest.json`만 수정하면 됩니다.

### 릴리스 산출물 정책

- 배포 ZIP은 Git에 commit하지 않습니다. `releases/`는 `.gitignore` 처리되어 있으며, 로컬에서 `npm run package:extension`으로 생성합니다.
- GitHub Release 자동화(`git tag` → GitHub Actions → build → ZIP 생성 → Release asset 업로드)는 아직 구현하지 않은 향후 작업입니다.
