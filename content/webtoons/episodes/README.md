# 승인된 웹툰 에피소드

- 사람이 읽는 정책·판단·승인 이력은 [Notion 정책](https://app.notion.com/p/3ff62d4e038081eba245ca77a511aa52)과 [관리대장](https://app.notion.com/p/3ff62d4e038081d1b86ef87316fe1b4e)에 둔다. 이 폴더는 실행에 필요한 원본을 보존한다.
- `../episodes.json`은 작품 ID, 중심 개념, 선택적 canonical `termId`, 정확한 관련 용어, 컷별 그림 설명·대사, 자산 경로·버전, Owner 승인 기록을 관리한다. 개념이 canonical에 없으면 `termId: null`을 허용하고 의미가 다른 ID에 강제로 연결하지 않는다.
- 일반 프롬프트를 프롬프트 설계와 동의어로 등록하지 않았다. 프롬프트 작품은 쉬운 뜻을 자체 제공하고 `prompt-design`을 후속 읽기로 연결한다.
- `status: approved`인 작품만 웹 데이터에 포함한다. 이미지가 존재해도 `draft` 작품은 공개되지 않는다. `approved`는 공개 대상 승인 상태이며, 실제 배포 완료 시점은 릴리스 보고서에서 추적한다.
- 2026-10-20 Owner는 모델·프롬프트 두 시안을 긍정 평가하고 사전 적용을 요청했으며, 기존 5편은 보관하고 새 2편만 공개하도록 결정했다. 원본·대사는 승인받은 시안 그대로 사용한다.

## 같은 형식으로 다시 출력

1. 작품 폴더의 `art.png`는 생성 그림 원본, `image-prompt.md`는 실제 프롬프트다. 모델 세부명·seed가 도구에 공개되지 않으면 추정하지 않는다.
2. 대사는 `../episodes.json`, 지면은 `../template-v1.css`에서 관리한다. 현재 템플릿은 승인 시안과 같은 Malgun Gothic Bold 환경에서 출력한다. 다른 글꼴 환경으로 재출력하면 시각 QA가 필요하다.
3. `node scripts/render_webtoon_episodes.mjs`로 지면 `master.png`와 네 컷 `panel-1.png`~`panel-4.png`를 만든다. Playwright Chromium을 사용하며, 필요하면 `WEBTOON_CHROME_PATH`로 설치된 Chrome을 지정한다.
4. Pillow가 설치된 Python에서 `python scripts/export_webtoon_assets.py`를 실행하면 공개 WebP와 반응형 크기 파생본을 만든다. 이 두 명령은 일반 앱 빌드에서 실행하지 않는다.
5. `npm run build`는 준비된 자산·승인·참조·대본을 검사하고 웹 데이터를 만든다. `python scripts/test_webtoon_publication.py`는 공개 상태가 빠졌거나 잘못된 용어·경로를 참조할 때 차단되는지 검사한다.

PC는 1536×1024 2×2 전체판, 모바일은 같은 네 컷을 순서대로 보여 준다. 그림 설명과 대사는 HTML로도 제공한다. 웹툰은 기존 `/webtoons` 안에서 `?episode=<작품ID>`로 선택하며 공개 경로를 신설하지 않는다.
