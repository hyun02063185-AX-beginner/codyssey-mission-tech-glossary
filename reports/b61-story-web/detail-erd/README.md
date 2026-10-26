# B6-1 상세 ERD 뷰어 QA

2026-10-26 · 브랜치 `feature/b6-1-story-web`

- 시작 HEAD: `6f0cc89c5409adc4f6ae3b55bc0ff4a44cbfdc13` (원격과 동일, 시작 시 로컬 변경 없음)
- 검증 구현 커밋: `9ceaace40aa445f8731dc867aa511dfe66d54945`
- 실행: `http://127.0.0.1:4200/#/missions/main-M11/story?scene=03&screen=2` → **ERD 상세 보기**
- 최종 빌드 검증 서버: `http://127.0.0.1:4206/` (로컬 Vite preview, 공개 배포 아님)

## 구현과 원본 검증

원본 저장소의 현재 main `8b99440c830fddc6f78c1440cff8fa2591d47884`를 고정했다.
[erd.mmd](https://github.com/hyun02063185-AX-beginner/Codyssey_B6-1/blob/8b99440c830fddc6f78c1440cff8fa2591d47884/docs/images/erd.mmd)와
[01_schema.sql](https://github.com/hyun02063185-AX-beginner/Codyssey_B6-1/blob/8b99440c830fddc6f78c1440cff8fa2591d47884/sql/01_schema.sql)의 원본 사본·blob SHA·출처는 `_tools/erd-detail-source/`에 보관한다.

고정 레이아웃의 B6 전용 생성기가 원본 blob SHA를 검사하고 SQL을 **메모리 SQLite**에서 실행한다. `table_info`/`foreign_key_list`를 Mermaid와 대조해 **6개 테이블·25개 전체 컬럼·자료형·6 PK·5 FK/관계**를 확인한 후 PC/모바일 SVG를 만든다. `teacher→course`, `subject→course`, `course→enrollment`, `student→enrollment`, `enrollment→score` 관계와 원본의 `1 : 0..N` 끝 모양을 표시한다. 관계는 테이블 간 연결이며 PK/FK 컬럼에는 문자 배지가 있다.

새 SVG는 `assets/detail/`에만 추가했다. 기존 8개 간략 SVG·12화면 미리보기 도구에는 개입하지 않는다. PNG 반전이나 런타임 Mermaid/다이어그램 엔진은 사용하지 않는다. 정적 SVG 2개만 명시적으로 가져와 Shadow DOM으로 CSS와 접근성 ID를 격리하고 기존 `--presentation-*` 색상 토큰을 상속한다. 전체 컬럼과 FK 대상은 SVG의 접근성 설명에도 제공한다.

- 기존 `전체 ERD` 링크는 **간략 ERD로 이동**으로 명칭을 바꾸고 S01-1 이동 주소를 유지했다.
- **ERD 상세 보기**는 현재 강의 위에 native `<dialog>`를 연다. 새로운 Scene·화면·route·브라우저 이력을 추가하지 않는다.
- PC는 큰 팝업(1280×720에서 1232×672), 모바일 700px 이하는 전체 화면이다. 도식은 실제 뷰어 폭 700px 이하면 세로 배치를 사용한다.
- 확대/축소 50–300%, 너비 맞춤, 100% 복구와 가로·세로 스크롤을 제공한다. 상단 제목·닫기·도구와 하단 조작 안내는 도식 스크롤과 분리했다.
- 팝업에서도 기존 `PresentationThemeSelector`를 재사용한다. Dark/Light는 배치·좌표·줌을 유지하고 도식/UI 색상만 바뀐다.
- 처음 열면 닫기에 초점을 두고, Tab/Shift+Tab은 팝업 안에서 순환한다. 배경은 native modal의 inert 동작으로 조작을 막는다. 방향키/PageDown은 도식 스크롤만 수행하고 `+`/`−`/`0`은 확대/원래 크기를 조작한다. 닫기·Esc는 원래 버튼·문서 스크롤·슬라이드 URL을 복구한다.

## 검증 결과

macOS / Node 24 / 설치된 Chrome(headless) / Pretendard VF. 모바일은 viewport 검사이며 실제 iOS/Android 검증과 구분한다.

| 검증 | 결과 | 증빙 |
| --- | --- | --- |
| 원본 blob·SQLite·Mermaid 대조 및 SVG 재생성 | PASS | [source-check.log](source-check.log) |
| 관련 Vitest | **30 PASS / 2 files** | [unit.log](unit.log) |
| 최종 TypeScript·Vite 빌드 및 기존 무결성 검사 | **PASS** | [build.log](build.log) |
| 상세 뷰어 개발 앱 | 4 PASS | [dev-dialog.log](dev-dialog.log) |
| 상세 뷰어 최종 빌드 | **4 PASS** | [built-dialog.log](built-dialog.log) |
| 기존 B6 Story 동선 회귀 | **10 PASS** | [story-regression.log](story-regression.log) |
| 기존 보호 대상 소스·콘텐츠·자산 | **765파일 동일** | [preservation.json](preservation.json) |

PC 1280×720·모바일 360×800 × Dark/Light에서 다음을 확인했다.

- 6개 표·25개 컬럼·5개 관계의 실제 마운트, 올바른 PC/모바일 SVG 선택.
- 기본 컬럼/자료형 글자 크기 PC **17.85px**, 모바일 **18px**. 표 안 글자 겹침·카드 밖 넘침 없음. 표의 모든 글자 대비 **4.5:1 이상**.
- 팝업 열기·Enter, Tab/Shift+Tab 순환, 배경 초점 차단, 확대 버튼·키보드 조작, 양방향 스크롤, 도식 아래쪽 접근 및 닫기 버튼 고정 표시.
- 팝업 안의 Dark/Light 전환과 SVG 배치 동일성.
- S03-2에서 열기 → 확대/이동 → 닫기/재열기/Esc 후 **동일 URL·슬라이드·문서 스크롤·버튼 초점** 복귀. 팝업 안 방향키와 PageDown이 슬라이드를 넘기지 않음. 닫은 뒤 다음 슬라이드도 정상 이동.

기존 Story 회귀 10건은 1280×720·1000×720·360×800·390×844 × Dark/Light의 12화면 탐색, 직접 URL·새로고침·뒤/앞 이동, 가이드/미션 왕복, 간략 ERD 이동, 기존 Light 선택값 연계와 폭 전환 복원을 포함한다. 새 포커스 순환 처리는 팝업 안에만 적용되며, 최종 빌드 뷰어 검사에서 다시 검증했다.

기존 B6 원고·간략 도식·4 Scene·12화면, 기존 가이드, 개념지도, B2/B3 원본과 공통 UI v1.2 정책은 변경하지 않았다. 기존 콘텐츠 승인 QA를 재사용했고 무관한 전체 콘텐츠 QA는 반복하지 않았다. 빌드의 기존 큰 번들 크기 경고는 남지만 실패는 없다.

재현 명령:

```sh
python3 content/mission-stories/main-m11/_tools/build_detail_erd.py
npx vitest run src/b61Story --maxWorkers=2
npm run build
# 최종 빌드: npx vite preview --host 127.0.0.1 --port 4206 --strictPort
PLAYWRIGHT_PORT=4206 PLAYWRIGHT_CHANNEL=chrome B61_DETAIL_QA_OUTPUT=reports/b61-story-web/detail-erd npx playwright test playwright/b61-detail-erd.spec.ts --workers=2
# 개발 서버: npm run dev -- --host 127.0.0.1 --port 4200
PLAYWRIGHT_PORT=4200 PLAYWRIGHT_CHANNEL=chrome B61_QA_OUTPUT=/tmp/b61-detail-story-regression npx playwright test playwright/b61-story-web.spec.ts --workers=2
```

## 대표 캡처와 남은 검수

모두 최종 빌드의 실제 React 앱 캡처다. 기본 보기와 스크롤 하단을 열어 컬럼·자료형·PK/FK·관계선·조작부의 가독성을 시각 확인했다.

| 환경 | 기본 보기 | 도식 하단 |
| --- | --- | --- |
| PC Dark | [열기](1280-dark-open.png) | [하단](1280-dark-bottom.png) |
| PC Light | [열기](1280-light-open.png) | [하단](1280-light-bottom.png) |
| 모바일 Dark | [열기](360-dark-open.png) | [하단](360-dark-bottom.png) |
| 모바일 Light | [열기](360-light-open.png) | [하단](360-light-bottom.png) |

Owner의 실제 화면 검수와 iOS Safari·Android 실기기/스크린리더 검수는 남아 있다. 이번 작업은 사용자가 요청한 선택형 상세 ERD 뷰어에 한정하며 편집기·새로운 범용 엔진·학습가이드·개념지도·설명 문장은 추가하지 않았다. 동일 작업 브랜치에만 Commit·Push하며 main 병합과 GitHub Pages 공개 배포는 수행하지 않는다.
