# Codyssey Mission Tech Glossary

> **코디세이 기술용어 사전**<br>
> *일명, 버티다 보면 아는 말 사전*

**미션 하나, 용어 하나. 버티다 보면 실력이 된다.**

코디세이 예비과정 및 본과정 미션에서 실제로 만나는 기술용어와 핵심 개념을
미션 수행과 동료평가에 바로 활용할 수 있도록 정리하는 미션 기반 기술용어 사전 프로젝트입니다.

## Project Goal

이 프로젝트는 컴퓨터 과학 전체를 포괄하는 백과사전을 만들기 위한 것이 아닙니다.

- 코디세이 미션에 실제 등장한 기술용어를 우선 수집합니다.
- 미션 수행에 꼭 필요한 배경 개념은 별도로 연결합니다.
- "정의"뿐 아니라 "이 미션에서 왜 필요한가"를 설명합니다.
- 동료평가에서 사용할 수 있는 이해 확인 질문과 흔한 오해를 함께 제공합니다.
- 비유와 시각화가 특히 도움이 되는 일부 개념은 웹툰으로 설명합니다.

## Brand

- 서비스명: **코디세이 기술용어 사전**
- 영문명: **Codyssey Mission Tech Glossary**
- 별명: **버티다 보면 아는 말 사전**
- 캐치프레이즈: **미션 하나, 용어 하나. 버티다 보면 실력이 된다.**

## Scope

초기 범위:

- 예비과정 미션 3개
- 본과정 미션 13개
- 총 16개 미션

## Documentation

- [프로젝트 정의와 원칙](docs/00_project_overview.md)
- [정보 구조와 사용자 흐름](docs/01_information_architecture.md)
- [용어 데이터 모델](docs/02_glossary_data_model.md)
- [용어 콘텐츠 작성 가이드](docs/03_content_writing_guide.md)
- [웹툰 콘텐츠 가이드](docs/04_webtoon_content_guide.md)
- [초기 개발·콘텐츠 로드맵](docs/05_roadmap.md)
- [원천 데이터 정규화 기준](docs/06_source_data_normalization.md)

## Current Phase

Phase 0(기준 문서), Phase 1(전체 16개 미션 raw 수집), Phase 2(Master Glossary DB v0.1),
Phase 3(핵심 용어 초안), Phase 4(Webtoon Pilot 제작 준비)를 완료했습니다.

실제 이미지는 아직 생성하지 않았으며, 다음 개발 Sprint는 **Web UI v1**입니다.
원천 데이터는 `data/raw/`, 정규화된 DB와 검증 결과는 `data/curated/`에서 계속 추적합니다.

## Web UI v1

```bash
npm install
npm run dev
npm run build
npm run test
```

웹 앱은 Vite + React + TypeScript와 HashRouter를 사용해 GitHub Pages의 저장소 하위 경로에서도 동작합니다.
`scripts/build_web_data.py`는 curated Master DB와 작성된 콘텐츠를 `src/data/generated/`으로 변환하며, raw 데이터는 브라우저에서 직접 읽지 않습니다. 실제 웹툰 이미지는 향후 `public/webtoons/<term-id>.webp`로 추가할 수 있습니다.

웹툰 이미지는 `public/webtoons/<term-id>.webp` 형식으로 추가합니다. 예를 들어 Docker 이미지 Pilot은 `public/webtoons/docker-image.webp`에 저장한 뒤 `npm run build`를 실행하면 됩니다.

M01 동료평가에서는 `#/openbook/main-m01`을 열거나 `npm run build:extension`으로 만든 `dist-extension`을 Chrome 개발자 모드에서 로드해 Side Panel 오픈북을 사용할 수 있습니다.

오픈북은 먼저 **10초 요약**으로 빠르게 확인하고, 더 알고 싶을 때 **상세 설명 보기**를 펼치는 두 단계 사전입니다. 페이지에서 용어를 선택한 뒤 우클릭해 **코디세이 사전에서 찾기**를 누르면 Side Panel 검색으로 전달됩니다.

## Chrome Extension 배포 (ZIP 패키징)

확장 프로그램을 Node/npm이 없는 다른 PC에서도 설치할 수 있도록 배포용 ZIP을 만듭니다.

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

1. `codyssey-openbook-v0.4.1.zip` 다운로드 (GitHub Release asset)
2. 압축 해제 (예: `codyssey-openbook-v0.4.1` 폴더 생성)
3. Chrome 주소창에 `chrome://extensions` 입력
4. 우측 상단 **개발자 모드** ON
5. **압축해제된 확장 프로그램을 로드합니다** 클릭
6. 압축을 푼 폴더(`codyssey-openbook-v0.4.1`) 선택

Node/npm 설치가 필요 없습니다. ZIP 다운로드 → 압축 해제 → Chrome unpacked load만으로 바로 사용할 수 있습니다.

### 업데이트 방법

새 버전 ZIP을 받았을 때:

- 기존 폴더를 새 버전 폴더로 교체한 뒤, `chrome://extensions`에서 해당 확장의 **새로고침** 버튼을 누릅니다.
- 또는 기존 확장을 **제거**하고 새 폴더를 다시 로드합니다.

unpacked extension 특성상 Chrome Web Store 배포 전까지는 **자동 업데이트가 되지 않습니다.** 새 버전이 나오면 위 방법으로 직접 갱신해야 합니다.

### 버전 정책

- **Extension version이 배포 기준 Source of Truth**입니다: `extension/manifest.json`의 `version`(현재 `0.4.1`)이 빌드 → ZIP 파일명 → 검증까지 그대로 사용됩니다.
- `package.json`의 `version`(현재 `0.1.0`)은 npm/Web UI 프로젝트 버전으로 Extension 버전과 역할이 다릅니다. Extension 버전을 올릴 때는 `extension/manifest.json`만 수정하면 됩니다.

### 릴리스 산출물 정책

- 배포 ZIP은 Git에 commit하지 않습니다. `releases/`는 `.gitignore` 처리되어 있으며, 로컬에서 `npm run package:extension`으로 생성합니다.
- 향후 GitHub Release 자동화 예정 흐름: `git tag` → GitHub Actions → build → ZIP 생성 → Release asset 업로드.
