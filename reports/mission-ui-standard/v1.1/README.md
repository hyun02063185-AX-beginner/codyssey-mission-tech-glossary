# Mission UI Standard v1.1 — 구현·QA

- 작업일: 2026-10-26 (Asia/Seoul), 브랜치 `feature/mission-ui-standard`.
- 시작 HEAD 및 원격: `058f0eae3be1a4660ac33e5112bf087a7f453d56`. `git fetch origin` 후 일치 확인, 로컬 변경 없음. 기존 브랜치를 추적해 이어서 작업했다.
- 완료 HEAD: 이 보고서를 포함한 커밋(`git log -1 --format=%H`). 정확한 SHA와 원격 Push 결과는 완료 보고에서 확인한다. main 병합·공개 배포는 수행하지 않는다.
- UI 정책의 단일 기준은 [영구 가이드 v1.1](../../../docs/mission-guides/mission-ui-standard.md). 이 문서는 변경과 실행 증빙만 기록한다.

## 구현 결과

두 Story 모두 기존 `LearningFocusNav`를 사용한다. 공통 CSS에서 높이·폰트·여백·버튼·자료 메뉴를 관리하고, 개념지도에는 명시적 `compact` 레이아웃을 적용했다. 모바일에서 미션 코드와 현재 자료를 모두 표시한다. 승인 강의 내부의 이전·다음·목차·강사 노트·발표자는 유지했다.

B2-1의 서비스 외곽, GNB·자료 메뉴, Explorer 버튼·선택·도구와 상세 패널에 기존 네 사이트 테마 토큰을 적용했다. 승인 슬라이드의 독립 팔레트와 Canvas 배경·영역·노드·관계 색상은 보존했다. B3-1은 기존 의미 색상과 테마별 선택·관계 강조를 유지했다. 테마별 자간이 SVG에 상속되는 기존 문제를 발견해 B3-1 그림과 Canvas의 자간을 기존 Forest 값(-0.192px)에 고정했다. 원본 SVG를 수정하지 않았다.

기존 공간 분할 구현에 공통 패널 CSS 클래스를 적용했다. 양쪽 모두 PC 약 350px / 모바일 700px 이하 43dvh 하단 분할, 헤더·닫기와 본문 스크롤 분리, 선택 즉시 열기·같은 항목 재선택·선택 유지·닫기 후 공간 회수·포커스 복귀를 확인했다. 새 범용 상세 콘텐츠 렌더러를 만들지 않았다. B2-1은 크기 변경 시 선택 노드가 가시 영역 안에 남도록 기존 카메라 조정만 보완했다. Escape는 도구→상세→큰 화면 순서로 처리하며, B3-1은 숨겨진 도구에 포커스가 남아도 동작한다.

영구 가이드는 메뉴 역할, Story 공통 규칙, 테마 경계, 패널 배치/선택/복구, 공통 토큰, 재사용 컴포넌트, 예외 Owner 승인, 회귀 범위와 변경 이력을 명문화했다. `workflow.md`는 개발 착수 전 해당 기준을 확인하도록 참조만 보강했다.

## 검증 결과

환경: macOS의 실제 Chrome **146.0.7680.165**, Playwright headless. 1280×720 / 1000×720 / 360×800 / 390×844, Forest / Indigo / Paper / Signal, OS light / dark 에뮬레이션.

| 검증 | 결과·근거 |
| --- | --- |
| 영향 범위 단위 테스트 | **124 PASS**, [로그](targeted.log) |
| 최종 전체 단위 테스트 | **392 PASS / 27 files**, [로그](unit.log) |
| 최종 빌드 | **PASS**, TypeScript·데이터 검증·Vite·기존 SVG 출력 무결성 포함. 기존 큰 번들 경고 유지. [로그](build.log) |
| v1.1 실제 App 매트릭스 | **8 tests PASS / 64 조합**, [로그](browser.log), [요약](summary.json), viewport/OS별 JSON |
| 메뉴 가독성 | 모든 조합의 메뉴 텍스트 대비 **6.16:1 이상**, 테마 선택·Escape·메뉴 포커스 검증 |
| 기존 회귀 | 최초 **89/91 PASS**. 두 가이드 테스트는 이전 진입 링크 문구를 사용해 실패했고 자료 카드 선택자로 수정. 가이드 재실행 **9/9 PASS**. [최초 로그](regression-initial.log), [재검증](guide-regression.log) |
| 최종 지도 회귀 | Escape 보완 후 기존 상호작용·레이아웃 최종 **22/22 PASS**. [최종 로그](map-final.log) |
| B2-1 보호 | **8 Scene / 128단계 PASS**, [원고 검사](b21-v3.log). dev·dist 각각 **176 checks PASS**, 발표자 연결/정답 공개/단계 동기화/새로고침/팝업 종료·차단·fallback, 1280/390/360px 승인 강의와 실제 App의 타이포·도형 크기 일치. [로그](b21-u5.log), [결과](b21-u5/app-results.json) |
| 기존 콘텐츠 QA 재사용 | 기존 624개 보호 파일 중 **620개 해시 일치**, 예상 UI 변경 4개 별도 기록, 예상 밖 변경 0. B3-1 5 Scene·원본 지도 데이터, B2-1 승인 원고·SVG·강의 CSS 보존. [무결성 기록](integrity.json) |
| Git 공백 검사 | `git diff --check` PASS |

매트릭스는 두 Story GNB의 계산된 높이·폰트·여백·버튼 동등성, 노드/관계 열기→닫기→재선택, 헤더 고정/본문 스크롤, 실제 Canvas 공간 복구, 선택 노드 가시성, 키보드 포커스, 큰 화면 진입/종료의 열린 패널·URL 복원, 직접 주소·새로고침, Story→지도→사전→지도→원래 Story를 검증했다. 교육 콘텐츠의 크기·폰트·자간·fill/stroke와 지도 영역 색상을 테마 간 대조했다.

초기 픽셀 비교에서 테마별 자간 상속 문제를 수정했다. 이후 페이지의 소수점 스크롤 위치와 외곽 프레임이 1px/안티앨리어싱 차이를 만들므로 최종 보호 검증은 **원본 해시 + 실제 교육 요소의 계산된 크기·타이포·색상 비교**를 사용한다. 서로 다른 Chrome 버전의 기존 캡처와 픽셀 동일성을 주장하지 않는다. 기존 QA 캡처는 덮어쓰지 않았고 이번 실행의 중복 회귀 PNG는 제외했다.

## 화면 캡처

| 화면 | B2-1 | B3-1 |
| --- | --- | --- |
| PC Story 1280 | [Indigo](1280-b2-indigo-story.png) | [Indigo](1280-b3-indigo-story.png) |
| PC 상세 1280 | [Forest](1280-b2-forest-detail.png) | [Signal](1280-b3-signal-detail.png) |
| PC 상세 1000 | [Forest](1000-b2-forest-detail.png) | [Forest](1000-b3-forest-detail.png) |
| 모바일 상세 360 | [Indigo](360-b2-indigo-detail.png) | [Forest](360-b3-forest-detail.png) |
| 모바일 상세 390 | [Forest](390-b2-forest-detail.png) | [Forest](390-b3-forest-detail.png) |
| OS dark 메뉴 360 | [Forest](360-forest-dark-menu.png) · [Indigo](360-indigo-dark-menu.png) | [Paper](360-paper-dark-menu.png) · [Signal](360-signal-dark-menu.png) |

이 폴더에는 네 테마의 1280/360px Story·상세와 두 OS 모드 메뉴, 1000/390px Forest 캡처도 포함한다. PC·모바일 대표 캡처에서 분할·가독성·테마 반영과 Canvas 의미 색상 보존을 직접 시각 검수했다.

## 남은 Owner 검수

- 공통 GNB·네 테마의 시각적 최종 선호, 모바일 시트 높이와 기존 B2-1 강의 메뉴의 공존.
- 실물 휴대전화·강의실 프로젝터와 실제 강의 환경. OS 모드는 브라우저 에뮬레이션이며 실기기 검수를 대신하지 않는다.
- main 병합과 공개 배포 승인 및 공개 URL 검증. 이 작업에서는 브랜치 커밋·Push까지만 수행한다.
