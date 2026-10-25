# B2-1 Concept Explorer — Map-first UX

2026-10-25 (Asia/Seoul). 저장소 `hyun02063185-AX-beginner/codyssey-mission-tech-glossary`, 브랜치 `content/b2-1-story-map-foundation`, Windows 작업 폴더 `C:/Users/hyun0/codyssey-mission-tech-glossary-b21-story`.

## 1. 시작·완료 기준

시작 HEAD와 원격 지정 브랜치 모두 `8b6f0f2f2e93ad870505b1d88fd8cf4db5a4984d`였다. fetch 후 차이 `0 / 0`을 확인했다. **시작 작업 트리는 생성 데이터 33개의 EOL 변경이 있었다.** 모든 파일이 Git 기준과 LF 정규화 후 일치함을 확인하고 원래 바이트 해시를 [초기 상태](../../reports/b21-map-first/initial-worktree.json)에 기록했다. 이 변경은 UI 커밋에서 제외하고 사용자 시작 상태를 보존한다.

완료 커밋은 이 보고서·구현·증빙을 포함하는 로컬 Git 커밋과 최종 응답에 기록한다. Push·main 병합·배포·실제 공개 사이트 갱신은 수행하지 않는다.

## 2. 기존 구조와 개선 구조

기존에는 큰 제목/통계/안내와 메뉴 아래에 영역 카드, 개념 목록, Canvas, 관계 목록, 상세, 비교가 세로로 이어졌다. 초기 화면에는 SVG 자체가 없었다. Generator 선택 상태에서 스크롤을 맨 위로 돌리면 Canvas 윗변은 PC 약 701px, 모바일 약 1,175px 아래였다.

새 화면은 **간결한 도구 모음 → 항상 표시하는 큰 관계 지도 → 선택형 패널**이다. PC에서는 제목·현재 선택·메뉴와 영역/개념/상세 도구를 한 줄에 배치한다. 7개 영역 패널은 기본 접힘이고, 선택 시 오른쪽 상세 패널을 연다. 상세를 닫으면 폭을 즉시 회수한다. 유형·방향 범례와 자세한 사용법은 메뉴 안에 보존한다.

모바일에서는 영역 패널과 상세 시트가 기본 접힘이다. 노드 선택만으로 시트를 강제로 열지 않고 지도와 선택 이름을 먼저 보여 준다. ‘상세·관계’에서 하단 시트를 열며 상세/관계/비교 탭으로 전환한다. 시트를 닫으면 지도 높이를 회수한다. 정보·설명을 삭제하거나 글씨를 작게 만들어 압축하지 않았다.

Canvas는 `100dvh`와 실제 호스트 상단 위치에서 남은 공간을 계산한다. 영역/상세 패널, 시트, 창 크기 변화는 ResizeObserver가 감지한다. 모든 화면에 540px 높이를 적용하지 않는다.

## 3. 실제 Canvas 폭·높이

아래는 **SVG clientWidth × clientHeight(내용 영역, px)**다. 이전 원시 측정은 테두리 포함 bounding box이므로 기준 CSS의 1px 테두리를 양쪽에서 뺀 값이다. 이전 초기 화면에는 Canvas가 없어 Generator 선택 상태를 비교했다. 새 기본/선택 읽기 화면은 패널을 닫은 상태다.

| Viewport | 이전 Generator Canvas | 새 기본·패널 닫힘 | 상세 패널·시트 열림 | 큰 화면 탐색 |
| --- | ---: | ---: | ---: | ---: |
| 1280×720 | 948×458 | **1248×532** | 890×532 | 1260×544 |
| 1280×900 | 948×458 | **1248×712** | 890×712 | 1260×724 |
| 390×844 | 322×358 | **362×614** | 362×220 | 374×626 |
| 360×800 | 292×358 | **332×570** | 332×196 | 344×582 |

새 Canvas 윗변은 PC 145px, 모바일 189px이며 전체 내용 영역이 첫 viewport 안에 들어온다. 이전 화면에서 스크롤 상단의 SVG 가시 높이는 PC 720에서 약 19px, PC 900에서 약 199px, 모바일에서 0px였다. 새 초기 화면은 45개 노드·24개 관계가 즉시 보이며 전체 맞춤으로 시작한다. 전체 보기에서 작은 글자는 허용하고 개념 선택 후 읽기 모드에서는 13.5px 이상을 유지한다.

근거: [이전 원시 측정](../../reports/b21-map-first/before.json), [개선 측정·자동 검증](../../reports/b21-map-first/after.json). 비교 캡처는 같은 폴더의 `before-*.png`, `after-*.png`이며 기존 [U5 캡처](../../reports/b21-u5/dist-map-generator-1280.png)도 보존했다.

## 4. PC와 전체 화면 탐색

‘지도 확대/축소’는 카메라 배율을 바꾸고, ‘지도 크게 보기’는 주변 패널을 접어 viewport 전체의 지도 공간을 확보한다. CSS로 구현하므로 브라우저 Fullscreen API의 지원이나 권한에 의존하지 않는다. ‘원래 화면으로’ 또는 Escape로 복귀한다. 기존 선택 URL과 패널 상태를 보존한다. 진입·복귀 시 확장 버튼으로 초점을 돌려준다.

읽기/수동 카메라는 크기 변경 시 세계 좌표의 중심과 배율을 유지한다. 전체 맞춤 상태는 새 화면 크기에 다시 맞춘다. 기존 고정 레이아웃 좌표는 바꾸지 않는다. 24개 관계 모두에서 연결 맞춤으로 양 끝 노드가 잘리지 않는지 네 화면 크기에서 검사한다.

- [PC 1280×720 기본 지도](../../reports/b21-map-first/after-1280-720-initial.png)
- [PC 1280×720 Generator 읽기](../../reports/b21-map-first/after-1280-720-generator.png)
- [PC 큰 화면 탐색](../../reports/b21-map-first/after-1280-720-full.png)
- [PC 1280×900 지도](../../reports/b21-map-first/after-1280-900-generator.png)

## 5. 모바일 지도·시트·입력

- [390×844 기본 지도](../../reports/b21-map-first/after-390-844-initial.png) · [상세 시트](../../reports/b21-map-first/after-390-844-detail.png)
- [360×800 기본 지도](../../reports/b21-map-first/after-360-800-initial.png) · [상세 시트](../../reports/b21-map-first/after-360-800-detail.png)
- [360×800 관계 맞춤](../../reports/b21-map-first/after-360-800-relation.png) · [비교](../../reports/b21-map-first/after-360-800-comparison.png)

보이는 HTML 버튼·select·메뉴 summary는 최소 44×44px이다. 전체 지도에서는 45개 노드가 작게 보일 수 있지만 읽기 모드의 선택 카드와 원래 이름은 자르거나 생략하지 않는다. 배경에서 손가락 이동/핀치 확대를 지원하고 페이지 스크롤과 분리한다. 확대/축소 버튼은 별도 대안이다. SVG는 키보드 방향키 이동, +/- 확대·축소, Home 전체 맞춤, 노드 Enter/Space 선택을 지원한다. 탭은 좌우 방향키·Home/End로 전환하며, Escape와 닫기 후 초점이 해당 열기 버튼으로 복귀한다.

시트는 지도 아래 실제 공간을 나누는 비모달 구조다. 패널 높이를 제외한 SVG 영역을 사용하므로 시트가 노드 위를 덮지 않는다. 연결 양 끝을 함께 보려면 ‘연결 맞춤’, 선택한 이름을 크게 읽으려면 ‘읽기’를 사용한다.

## 6. 기능·데이터·학습 연계 보존

원본 45개 개념·24개 관계·10개 비교·7개 영역, P1~P3의 17개 질문/단계, 다섯 관계 유형·의미·방향, C2의 선택/강조/필터/맞춤/pan/zoom을 유지한다. 기존 상세 JSX와 링크 검증을 패널로 옮겼고, 원본 JSON·adapter·B3 엔진·주소 상태/복귀 파서는 수정하지 않았다. 03a/03b를 v3 03으로 임의 매핑하지 않으며 연결 보류는 그대로다.

실제 App과 비공개 Preview에서 용어사전 새로고침 후 원래 지도 상태로 복귀, 검증된 Story 복습 후 지도 복귀, 지도 origin의 Scene/step/back 복귀를 확인한다. U5의 경로 안전성·B3 배너 우선순위·발표자 검사를 유지한다. 용어사전 페이지는 변경하지 않는다. 기존 `/missions/main-M03/story/concepts?node=generator` 주소를 그대로 사용할 수 있으므로 향후 사전의 ‘전체 지도에서 보기’ 진입에도 재사용할 수 있다. 작은 사전 패널에 전체 지도를 삽입하지 않았다.

## 7. QA와 보호 범위

신규 `npm.cmd run b21:map-first-check`는 실제 App 경로에서 네 viewport의 첫 화면 Canvas, 패널/시트 열고 닫기, 전체 화면 복귀, 카메라 중심, 24개 관계 양 끝, 읽기 이름, 탭/키보드/마우스/터치/핀치, URL·새로고침·이력·사전/Story 왕복을 검사한다. 카메라 순수 함수는 중심·배율 보존 및 전체 맞춤에 관한 8개 단위 검사를 추가했다.

기존 `b21:concept-check`에서 새 요구와 충돌하는 ‘초기에 SVG 없음’과 세로 배치/바로가기 기준을 지도 중심 기준으로 교체했다. 데이터·관계·비교·P 경로·왕복·보류·CSS 격리·글자 크기 조건은 완화하지 않았다. 세 폭에서 원본 45개 설명의 모든 필드, 24개 관계 label/scope, 10개 비교 원문과 모든 안내 단계를 대조하는 **1,093 checks**가 PASS했다.

중간 검사에서 발견해 수정한 사항: 사전 왕복 뒤 사이트의 숫자 글꼴 스타일이 제목에 새어 들어오는 문제를 다시 격리했다. 큰 화면 모드에 기본 화면보다 큰 여백이 남아 지도 공간이 줄던 문제는 여백을 제거했다. 카메라 중심 검사는 SVGAnimatedRect의 float32 반올림 대신 실제 viewBox 문자열의 double 값을 읽도록 수정했으며, 판정 허용치 `0.00001`은 넓히지 않았다.

[보호 파일 대조](../../reports/b21-map-first/protection.json): **1,589개 파일 PASS**. 승인 교육 원고/해시, 128단계 Story 디자인·발표자 코드, 전체 지도 데이터, 용어사전·가이드, B3-1, 다른 미션, App 라우트·미션 카드, 배포 설정은 기준과 같다. 텍스트는 승인 무결성 계약과 같은 LF 정규화, 바이너리는 바이트 비교다.

최종 자동 실행 결과는 [순차 회귀 기록](../../reports/b21-map-first/regressions.json), [Map-first 검사](../../reports/b21-map-first/after.json), [U5 실제 App 결과](../../reports/b21-map-first/u5/app-results.json)에 기록한다. 브라우저를 많이 쓰는 검사는 순차 실행하며 과거 C2/U5 증빙을 덮어쓰지 않는다.

## 8. 수정 범위

`src/b21ConceptExplorer/{ConceptExplorer,ExplorerCanvas,explorer.css,B21ServiceConcepts}`와 새 camera helper/검사, `src/b21Learning/service.css`의 지도 전용 오류 안내 위치, 관련 QA 스크립트·실행 항목, 본 보고서·증빙에 한정한다. `src/App.tsx`, 용어사전 화면, Story 강의 CSS, B3 지도 코드에는 변경이 없다.

## 9. PASS·FAIL·SKIP과 남은 검토

| 검사 | 최종 결과 |
| --- | --- |
| `b21:concept-check` | PASS · 1,093 checks, 45개념·24관계·10비교·P1~P3·보류·왕복·CSS 격리 |
| `b21:router-check` | PASS · 209 checks, 기존 U3 단계/정답/발표자 계약 |
| `b21:u4-check` | PASS · 84 checks, 승인 18개 용어 및 기존 가이드/분야 지도 |
| `b21:v3-parity` | PASS · 384화면·5,269 assertions, 승인 강의 디자인 불변 |
| `npm.cmd test` | PASS · 25파일·360 tests, 기존 전체 + 카메라 8개 |
| `npm.cmd run build` | PASS · tsc/Vite/Foundation build-check |
| `b21:u5-check` | PASS · 실제 App 개발/dist 각 176, 합계 352 checks, B3/다른 미션·발표자·안전한 왕복 포함 |
| `b21:map-first-check` | PASS · 실제 App 개발/dist 각 213, 합계 **426 checks**, 네 viewport의 실측 값 동일 |

[최종 QA 요약](../../reports/b21-map-first/qa-summary.json), [개발/dist 측정 비교](../../reports/b21-map-first/comparison.json), [빌드 결과 Map-first 검사](../../reports/b21-map-first/built-app/after.json)에 원시 결과를 남겼다. 시작 시 생성 데이터 33개는 **바이트까지 동일하게 보존**했다([대조](../../reports/b21-map-first/preserved-worktree.json)). 커밋 후 작업 트리에 이 기존 변경이 남아 있을 수 있으며 UI 변경과 섞지 않는다. Vite의 기존 큰 청크 경고는 경고 한도를 바꾸지 않고 그대로 기록했다.

최종 미해결 FAIL은 없다. 사람 대상 Owner 최종 시각/수업 검토는 별도다. 브라우저 Fullscreen API 검사는 미사용 설계로 해당하지 않으며 CSS 방식 진입·종료를 검증했다. SKIP: Push·main 병합·Pages 배포·공개 사이트 갱신·원격 CI. 이 작업은 공개 전환을 수행하거나 승인하지 않는다.

## 10. Owner 최종 검토 주소

- [전체 지도](http://127.0.0.1:4180/#/missions/main-M03/story/concepts)
- [Generator 선택](http://127.0.0.1:4180/#/missions/main-M03/story/concepts?node=generator)
- 비공개 Preview: `http://127.0.0.1:4179/` → 전체 개념지도

로컬 서버가 종료되었으면 이 작업 폴더에서 `npm.cmd run dev -- --host 127.0.0.1 --port 4180 --strictPort`로 다시 연다.

참고용 명령이며 **이번 작업에서 실행하지 않음**:

```powershell
git push origin content/b2-1-story-map-foundation
```
