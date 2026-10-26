# S01-3 다대다(N:M) 표기 수정 QA

2026-10-26 · `feature/b6-1-story-web` · 시작 HEAD `55dd2e6af878314c36c4d2af6e9d035a9d862148` (원격과 동일, 로컬 변경 없음).

`다대다(N) 관계` → **`다대다(N:M) 관계`**만 수정했다. 원본 `_tools/build.py`, 스토리보드, PC·모바일 SVG의 화면 문구/접근성 설명, Vitest·Playwright 기대값을 맞췄다. 생성기와 기존 미리보기 도구를 실행해 S01-3 PC·모바일 PNG 및 전체 모음을 재생성했다. 다른 화면의 미리보기는 기준 커밋과 동일하다.

8개 SVG를 기준 커밋과 대조했다. `same-structure` 2개는 위 문자열 치환 외에 완전히 동일하며, 나머지 6개는 바이트가 동일하다. 좌표·카드 크기·폰트·기존 줄 배치를 변경하지 않았다. 4 Scene·12화면 콘텐츠 어댑터와 앱/CSS도 변경하지 않았다.

검증 결과:

- 관련 Vitest `src/b61Story/content.test.ts`: **26 PASS** ([로그](unit.log)). 4 Scene·12화면/원고 대조와 SVG 문구·상태·안전성, 기존 URL 어댑터 검사 포함.
- 원본 미리보기 도구: **PASS** ([로그](preview.log)). 글자 범위·겹침·최소 크기·문구 일치 검사. 그림 생성/재생성과 묶인 기존 검사를 재사용했다.
- 관련 Playwright `b61-story-web.spec.ts --grep '1280 dark:'`: **1 PASS** ([로그](playwright.log)). 수정된 접근성 기대값과 기존 12화면 탐색을 확인했다.
- 실제 React 앱 S01-3: **8조합 PASS** ([측정값](browser-check.json)). PC 1280×720·1000×720, 모바일 360×800·390×844 × Dark/Light에서 보이는 문구와 접근성 설명 일치, 카드 안 6 SVG 단위 이상 여유, 가로 넘침/페이지 예외 부재를 확인했다. PC는 기존 2줄, 모바일은 기존 3줄 배치다.
- 재생성한 PC·모바일 미리보기 및 실제 앱 모바일 Light 캡처를 직접 열어 줄바꿈·카드 경계를 확인했다.

실행 주소: `http://127.0.0.1:4200/#/missions/main-M11/story?scene=01&screen=3`.
대표 실제 앱 캡처: [PC Dark](1280-dark.png), [PC Light](1280-light.png), [모바일 Dark](360-dark.png), [모바일 Light](360-light.png).
원본 미리보기: [PC](../../../content/mission-stories/main-m11/preview/pc-S01-3.png), [모바일](../../../content/mission-stories/main-m11/preview/mobile-S01-3.png).

재실행 명령:

```sh
python3 content/mission-stories/main-m11/_tools/build.py
node content/mission-stories/main-m11/_tools/preview.cjs
npx vitest run src/b61Story/content.test.ts --maxWorkers=2
PLAYWRIGHT_PORT=4200 PLAYWRIGHT_CHANNEL=chrome B61_QA_OUTPUT=/tmp/b61-s013-nm-playwright npx playwright test playwright/b61-story-web.spec.ts --grep '1280 dark:'
```

문구·정적 자산 변경에 해당하는 검사만 실행했다. 무관한 미션 회귀·전체 빌드는 반복하지 않았다. main 병합·배포는 수행하지 않는다. 작업 커밋·원격 Push 결과는 완료 메시지에 기록한다.
