# 모델·프롬프트 웹툰 2편 통합

2026-10-20 · 기준 main `885731e3aa25ab67f16d27627edee611d2ee9a25` · 작업 브랜치 `feat/webtoon-model-prompt`.

## Owner 결정과 구현

- Owner가 모델·프롬프트의 첫 완성 시안 내용을 긍정 평가하고 사전 적용을 요청했다. 추가 질문에 ‘새 2편만 공개하고 기존 5편은 보관’을 선택했다.
- 기존 공개 경로 `/webtoons` 안에서 `?episode=ai-model-role-01` / `?episode=prompt-request-01`로 작품을 선택한다. 공개 route는 신설하지 않았다.
- PC는 승인된 1536×1024 2×2 원본, 모바일은 동일한 네 컷을 순서대로 표시한다. 두 원본 master의 SHA-256은 Owner가 본 시안과 바이트 단위로 동일하다. WebP와 여러 크기 파생본으로 전달량을 줄였다.
- 웹툰 바로 아래에 쉬운 뜻과 비유의 한계, 텍스트 대본을 제공한다. 사전 링크는 `?webtoon=<작품ID>` 문맥에서 쉬운 설명부터 제공하고, 기술 세부와 지도는 선택적으로 이동한다. 기본 용어 상세 경로의 동작은 유지한다.
- AI 모델은 기존 `ai-model`에 연결한다. 일반 프롬프트는 독립 canonical로 새 등록하지 않고, 자체 쉬운 뜻 뒤 `prompt-design`을 ‘이어서 읽기: 프롬프트 설계’로 연결한다.
- 기존 5편은 `content/webtoons/archive/`로 이동했다. 파일 바이트와 기존 사전 설명은 보존하고 배포 디렉터리에는 포함하지 않는다. 공개 목록·홈·용어 상세에서 이전 작품과 이미지 준비 중 후보를 제거했다.
- `episodes.json`에서 작품과 용어 ID를 구분하며 승인·컷별 대본·원본·버전을 기록한다. 승인 상태가 아닌 작품은 이미지가 있어도 공개 데이터로 생성하지 않는다.

## 검증 근거

- `npm run build`: PASS. canonical/encyclopedia 검사 0 errors, TypeScript·Vite 빌드 완료.
- `npm test`: 11 files / 96 tests PASS. 이후 이미지 우선 로딩·모바일 메뉴 줄바꿈 조정은 최종 빌드·브라우저 QA로 재검증했다.
- `python scripts/test_webtoon_publication.py`: 5 tests PASS. 승인 누락·알 수 없는 용어·public 밖 경로 차단과 초안 비공개 확인.
- `diagnostics/webtoon-episodes-smoke.mjs`: 1440 / 390 / 375 / 360px PASS. 두 작품, 대사 8개·컷 설명 4개, 키보드 진입, 사전 왕복, 기존 5편 비노출, 웹툰 필터와 알 수 없는 작품 복구 확인. 브라우저·네트워크 오류 0.
- PC·390px 결과 이미지를 직접 열어 전체판/네 컷, 글자·순서·대본·메뉴를 확인했다. 실제 보조기기를 이용한 사용자 검증은 수행하지 않았다.
- `src/data/generated/glossary.json`은 `hasWebtoon` 외 모든 내용이 main과 동일하고 519개 유지. curated 원본·관계·taxonomy·기존 map·Extension 스키마는 변경하지 않았다.
- 보관 이미지 5개는 원본 해시 동일, dist에서 제외. 승인 master 해시: 모델 `a1ab7ca190906f78c2b38de9a432d7237883f5d7337eaad585de7b7f07da5221`, 프롬프트 `0cc7ea7578b9e2b3922924c7a8838bed574b707c7b988ba9d529bea3d52ac582`.

## 제작 재현·공개 경계

원본·프롬프트·대사는 `content/webtoons/episodes/`와 manifest에 있고 공통 지면은 `template-v1.css`에 보존했다. `render_webtoon_episodes.mjs` → `export_webtoon_assets.py`는 제작자가 명시적으로 실행하는 도구이며 일반 배포 빌드에서 이미지를 재생성하지 않는다.

이 보고서 작성 시점에는 로컬 통합과 QA가 완료됐고 원격 push·PR 병합·공개 배포는 실행하지 않았다. 저장소 AGENTS.md 및 거버넌스 §8은 원격 push를 사용자가 수행하도록 정하고 있다. PR #8은 별도의 문서 초안으로 유지하며 이번 작업에서 병합하지 않았다. 원격 반영 이후 실제 GitHub Pages 주소의 새 두 작품을 확인한 시점을 배포 완료로 기록한다.
