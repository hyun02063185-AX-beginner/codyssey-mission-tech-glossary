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
