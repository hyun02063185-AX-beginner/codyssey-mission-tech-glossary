# B2-1 U3-D — 최종 QA 안정화 결과

검증일: 2026-10-24 (Asia/Seoul). Windows PowerShell / `npm.cmd` / 설치된 Chrome 155.0.8059.85, headless.

## 승인과 시작 상태

- 저장소·브랜치: `hyun02063185-AX-beginner/codyssey-mission-tech-glossary`, `content/b2-1-story-map-foundation`.
- 작업 폴더: `C:/Users/hyun0/codyssey-mission-tech-glossary-b21-story`.
- 시작 HEAD: `3e177789252c0c071cce0420c09cdb37e7d4375b`. 시작 작업 트리 Clean.
- fetch 후 지정 원격 브랜치와 차이 `0 / 0` 확인. 기존 미커밋 수정은 없었다.
- 작업 A는 요청서의 **“승인된 수정안”** 범위로 적용했다.
- 작업 B는 초안의 승인 조건에 따라 확인했고, Owner가 **“B도 승인 — A·B 적용 및 전체 회귀 검사”**라고 명시적으로 승인한 후 변경했다.

**Windows의 U3 최종 기술 기준을 충족했고 U4 진입이 가능하다.** 공개 라우트 연결·용어사전 연결·배포는 이번 작업에 포함하지 않았다. 네이티브 macOS와 물리 프로젝터 검수는 아래의 SKIP으로 구분한다.

## 수정 전후 차이

| 파일 | 변경 |
| --- | --- |
| `drafts/b2-1-story-map/v3/teaching-preview/index.html` | `<style>` 끝에 승인된 Scene 04 미디어 쿼리 한 줄만 추가 |
| `src/b21StoryV3/content/integrity.json` | `preview.sha256` 문자열 한 값만 교체 |
| `drafts/b2-1-story-map/v3/teaching-preview/qa/check-preview.mjs` | 카드 사각형 전체 동일성 단언을 새 불변조건과 클릭·재선택 검사로 교체하고 측정값을 보고서에 기록 |
| `drafts/b2-1-story-map/v3/teaching-preview/qa/role-layout-check.mjs` | 실제 브라우저 측정 및 16개 개별 불변조건 함수 추가 |
| `scripts/b21_role_layout_check.test.mjs` | 새 QA가 높이 차이는 허용하고 잘못된 배치·순서·잘림·겹침·선택 오류는 검출하는지 확인하는 17개 테스트 |
| `scripts/check_b21_u3_d_visuals.mjs` | 기준 HEAD와 현재 HTML의 Scene 04 전후를 실제 Chrome에서 대조하는 검사 |
| 이 문서와 `reports/b21-u3-d/` | 결과·측정값·이미지 증빙 |

실제로 추가한 CSS:

```css
@media (max-width:360px){.mf>.pane{min-width:0}}
```

이 한 줄을 제거한 현재 HTML이 기준 HEAD의 HTML과 정확히 같은지 검사했다. 교육 문구·JavaScript·그림·색상·폰트·나머지 CSS는 불변이다. Scene 02의 원고·그림·레이아웃과 모든 React 런타임 파일도 불변이다.

## Scene 04 — 실제 폭과 내부 콘텐츠

360px Scene 04-1·2·4에서 측정한 변화:

| 항목 | 수정 전 | 수정 후 |
| --- | --- | --- |
| 문서 scrollWidth | 362px | **360px** |
| `.mf` 부모 폭 | 328px | 328px |
| 두 Grid 열 | 169px / 169px | **160px / 160px** |
| 열 간격 | 8px | 8px |
| 왼쪽 패널 x | 16px | 16px |
| 오른쪽 패널 x | 193px | **184px** |
| 오른쪽 패널 끝 | 362px | **344px** |
| 패널 높이 | 244px | 244px |

요청한 360px을 기준으로 검사하며, 모바일 `innerWidth`가 넘침에 따라 확대되는 현상으로 허용 폭을 바꾸지 않았다. 모든 기록의 번호·메모·금액 텍스트 범위가 패널 테두리 안에 있고, 메모/금액과 두 패널 버튼이 겹치지 않는 것을 확인했다. 무대 텍스트와 한 문장 설명은 수정 전후 정확히 같다. 기존 행 배경 padding 안으로 그려지던 텍스트를 숨기는 처리는 하지 않았다.

Scene 04-1·2·4 × 세 폭의 별도 대조에서 **60개 단언 PASS**다. 390px·1280px의 6개 전체 페이지 이미지는 수정 전후 바이트 단위로 동일했다. 360px의 패널 폭·위치만 승인안대로 달라졌으며 글자·줄바꿈·패널 높이는 유지됐다.

기존 React 접근성 CSS의 44px 최소 버튼 너비는 수정하지 않았다. 승인된 U2 동등성 계약대로 모바일 기준에 동일한 접근성 CSS를 적용한 비교도 포함하여 384화면 전수 검사를 통과했다.

## Scene 02 — 승인된 QA 불변조건

이전 검사는 02-2·02-10·02-15의 네 카드에 대해 반올림한 **x/y/width/height 전체 배열이 동일**해야 했다. 이제 내용에 따른 자연스러운 높이와 그에 따라 달라지는 다음 행의 y 좌표를 허용한다. 역할의 열 배치·순서·폭·간격·정렬·텍스트·상태는 계속 검사한다.

| Owner 승인 조건 | 개별 단언 |
| --- | --- |
| 2열 × 2행 | 네 역할 개수, 실제 Grid 2열·2행 |
| 역할 순서·좌우 위치 | Model/Repository/Service/CLI ID와 이름 순서, 좌우·상하 순서, 내용 전환 후 각 역할의 x 좌표·폭 유지 |
| 간격·정렬 | 열 정렬, 행의 위·아래 정렬, 실제 가로 간격, 실제 세로 간격, 내용 전환 후 gap 유지 |
| 잘림·겹침·가로 넘침 없음 | 카드의 Grid 내부 배치, 요청 viewport 초과 없음, 텍스트 잘림·카드 밖 텍스트 없음, 카드 간 겹침 없음, 텍스트 간 겹침 없음 |
| 선택·강조 | `aria-pressed`와 `.sel` 대상 일치, 선택 카드의 accent 테두리. 실제 네 역할 클릭 이동·재선택 복귀·선택 해제도 별도 검사 |
| 자연 높이 허용 | 단계 사이의 height와 두 번째 행 y 동일성은 요구하지 않음. 각 단계 내부의 행 정렬·gap·잘림 검사는 유지 |

기본 3개 단계와 선택 4개 상태를 각 폭에서 확인했다. 총 21개 상태 × 16개 개별 불변조건이 PASS했고, 클릭/재선택 조작도 모두 PASS했다. 기존 ‘먼저 볼 곳’ 표시 등 나머지 의미 검사는 보존했다.

문서의 가로 넘침은 허용값 없이 `scrollWidth <= 요청 viewport`로 검사한다. 기존 텍스트 scrollWidth 검사 기준을 높이지 않았다. 같은 열·gap을 비교하는 새 기하 단언의 허용값은 Chrome 배치 단위인 1/64 CSS px이며 문서 넘침이나 텍스트 잘림의 허용값이 아니다.

### 단언 수 변화

```text
기존 HTML QA                              6,033
기존 전체 사각형 동일성: 폭마다 1개 제거      -3
새 검사: 폭마다 124개 × 세 폭               +372
최종 HTML QA                              6,402  PASS
```

폭마다 기본 3상태 × 16개 = 48개, 선택 4상태 × (16개 + 이동·복귀·해제 3개) = 76개로 총 124개다. **기존 6,030개는 그대로 유지**됐고 승인된 3개만 372개로 대체했다. ‘기존 6,033개가 수정 없이 그대로 통과했다’는 뜻은 아니다.

360px의 자연 높이도 화면 변경 없이 유지됐다. 원본 02-2는 위 118.375px / 아래 137.5625px, 02-10·02-15는 모두 118px이다. 높이를 강제로 맞추거나 텍스트를 줄이지 않았다.

새 QA의 17개 자동 테스트는 정상적인 높이 변화가 통과하고, 역할 누락·교환·1열 배치·정렬/gap 오류·361px 문서 폭·텍스트 잘림/겹침·카드 겹침·선택 및 accent 오류가 실패하는 것을 확인한다.

## 승인 HTML 해시

`src/b21StoryV3/content/integrity.json`의 `preview.sha256`만 다음과 같이 명시적으로 교체했다. 기준은 기존과 같은 UTF-8, CRLF→LF 정규화 SHA-256이다.

```text
이전 b78ba7cbc691d787ceabaa1b6bc9eb13f5685c373fb642328fc90a4f8315cd3a
이후 a73ef3cea740a4bec3a4af64716d6dfbdb8cf516278ec887c943be611f1f2721
```

새 해시는 U3-C에서 Owner에게 제시한 정확한 CSS 패치의 예상 해시와 일치한다. Foundation의 `storyIntegrity.json`, v3의 다른 승인 필드·원고 해시·지도 해시·sourceRevision은 불변이다. `--write`를 사용하지 않았다.

## 전체 회귀 결과

| 명령/검사 | 결과 | 근거 |
| --- | --- | --- |
| `npm.cmd run b21:validate` | PASS | Foundation 9원고·16 SVG·섹션·활동·참조 |
| `npm.cmd run b21:v3-validate` | PASS | 승인 8장면·128단계·기존 숫자 대응 16/13 |
| `npm.cmd run b21:eol-check` | PASS | 실제 LF·CRLF 입력으로 검사 후 원래 바이트 복원 |
| `npm.cmd run b21:v3-parity` | PASS | 128단계 × 1280/390/360 = 384화면, 5,269단언, 오류 0 |
| `npm.cmd run b21:router-check` | PASS | 209검사, URL·복습·뒤로/앞으로·새로고침·발표자 창·답 공개·대체 동작 |
| `npm.cmd run b21:html-qa` | PASS | **6,402단언**, 1280/390/360 전부 PASS, ledger 8개 대조, 오류·외부 요청 0 |
| `npm.cmd test` | PASS | 20파일·255테스트, 새 QA 테스트 17개 포함 |
| `npm.cmd run build` | PASS | 공개 빌드·Foundation 별도 빌드. 기존 큰 청크 경고 유지 |
| `npm.cmd run b21:browser-check` | PASS | 설치 Chrome 명시, Foundation 63검사 |
| `node scripts/check_b21_u3_d_visuals.mjs` | PASS | 실제 HTML 전후 60단언, 390/1280px 동일 이미지 |
| macOS 네이티브 실행 | SKIP | Windows 호스트. Apple 글꼴·macOS Chrome/Safari 팝업·다중 창 동작 미실측 |
| 물리 프로젝터/다중 모니터 | SKIP | headless 자동 브라우저 범위 밖 |

최종 자동 검사 FAIL은 없다. macOS에서의 같은 회귀 명령 실행 및 실제 모니터 배치는 별도 검수로 남는다. LF/CRLF 회귀는 네이티브 macOS 글꼴/창 동작 검사를 대신하지 않는다.

주소·강의 운영 회귀는 전체 128단계, 의미 ID·기존 숫자 주소, 복습 중 새로고침과 지도 복귀, 뒤로/앞으로 반복, 목차·키보드·초점, 두 창 최초 연결·각각 새로고침·양방향 이동·답 공개 동기화·중복 요청·팝업 차단·동기화 미지원 대안을 포함한다. 관련 React 구현은 변경하지 않았다.

## 보호 범위·증빙·종료

기준 SHA 대비 Scene 02 원고·그림, 전체 React 런타임·128단계 데이터·라우팅·발표자 코드·접근성 CSS, 공개 라우트, 용어사전·학습가이드·다른 미션, 의존성·배포 설정은 불변이다. 빌드가 생성한 33개 JSON의 CRLF 차이는 파일별 동등성을 검증한 뒤 해당 경로만 복원했다.

[집계 JSON](../../reports/b21-u3-d/results.json), [360px 수정 전](../../reports/b21-u3-d/360-04-1-before.png), [360px 수정 후](../../reports/b21-u3-d/360-04-1-after.png), [390px 수정 후](../../reports/b21-u3-d/390-04-1-after.png), [1280px 수정 후](../../reports/b21-u3-d/1280-04-1-after.png)를 보존했다. 세 폭의 수정 전 이미지도 같은 폴더에 있다. 상세 로그·384화면은 `node_modules/.cache/`에 있다.

이번 결과로 U3의 Windows 기술 완료 기준은 충족한다. **U4 진입 가능**이며 공개 서비스 통합은 후속 작업에서 진행한다. 로컬 커밋까지만 수행하고 Push·병합·배포는 하지 않는다. 최종 커밋 SHA와 Clean 상태는 완료 응답에 기록한다.
