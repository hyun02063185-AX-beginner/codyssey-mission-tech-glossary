# B3-2 v0.2 실행 흐름 미리보기 QA

검토 기준은 용어사전 `origin/main`의 `e13f3f69`와 B3-2 실제 구현의 `be21c499`입니다. 미션 학습 운영 정책 v1.1, 공통 UI 기준 v1.2, 기존 B3-2 원고와 웹 검증 기록을 확인했습니다. [B3-2 소스](https://github.com/hyun02063185-AX-beginner/Codyssey_B3-2/tree/be21c4994a93bc943a6783ea380c50f61aa7c45b) · [v0.1 원고](../../content/mission-stories/main-m06/storyboard-v0.1.md) · [기존 웹 QA](../b32-story-web/README.md)

## 미리보기 열기

작업 브랜치에서 `npm ci` 후 `npm run dev`를 실행하고 [로컬 미리보기](http://localhost:5173/#/missions/main-M06/story/flow-preview)를 엽니다. 앱의 기존 해시 라우팅을 사용합니다. 미리보기 라우트와 전용 번들은 Vite 개발 서버에서만 제공됩니다.

- **자유 탐색**에서 임의의 단계를 선택하고, **순서대로 보기**에서 첫 단계부터 이전·다음으로 이동합니다. 선택한 상자에 **선택** 표시가 붙고 상세 패널에는 역할, 입력, 출력, 소스 링크가 나옵니다.
- 연결된 슬라이드는 같은 탭에서 기존 주소로 열립니다. 브라우저의 뒤로 가기로 선택한 단계에 돌아온 뒤 **전체 흐름으로** 버튼을 누르면 선택이 해제됩니다. **기존 강의 소개**는 공통 `MissionStoryOverview`를 쓰는 v0.1 인트로로 연결됩니다.
- **학습자료** 메뉴에서 **강의 화면 테마**를 바꿉니다. **예외 분기**를 펼치면 변경 없음, 보안 차단, API 오류, 형식 검증 실패를 볼 수 있습니다.

## 캡처

전체 흐름은 요청된 뷰포트 높이로, 단계 선택 화면은 아래 상세 패널까지 포함해 캡처했습니다.

| 뷰포트 | Dark 전체 | Light 전체 | Dark 4단계 선택 | Light 4단계 선택 |
| --- | --- | --- | --- | --- |
| 1280×720 | [보기](1280-dark-overview.png) | [보기](1280-light-overview.png) | [보기](1280-dark-selected.png) | [보기](1280-light-selected.png) |
| 1000×720 | [보기](1000-dark-overview.png) | [보기](1000-light-overview.png) | [보기](1000-dark-selected.png) | [보기](1000-light-selected.png) |
| 360×800 | [보기](360-dark-overview.png) | [보기](360-light-overview.png) | [보기](360-dark-selected.png) | [보기](360-light-selected.png) |
| 390×844 | [보기](390-dark-overview.png) | [보기](390-light-overview.png) | [보기](390-dark-selected.png) | [보기](390-light-selected.png) |

## 검증 결과

| 항목 | 결과 |
| --- | --- |
| 실행 사실 및 학습 흐름 | PASS. 명령 해석 → 로컬 Git 수집 → 변경 확인 → 보안 검사 → Python의 API 요청·응답 → 검증·사람의 활용을 실제 소스와 대조. 변경 없음은 요청 0회, 마스킹과 차단은 별도 처리, 16,000자 한도는 `--unsafe`에도 적용. PR 테스트 문구 교체와 모델 실행 위치 미확인도 반영. |
| 브라우저 상호작용 | PASS 10건. macOS Chrome 157에서 뷰포트 4종 × Dark/Light, 터치 에뮬레이션, 키보드 전 단계, 예외 펼침, 직접 URL·새로고침·뒤로 가기, 기존 8개 슬라이드 URL 확인. 선택 전후 상자 위치·크기 동일, 가로 넘침 0, 첫 화면에 6단계와 예외 분기 버튼 표시. [테스트](../../playwright/b32-flow-preview.spec.ts) |
| 가독성 | PASS. 캡처를 열어 주요 화면과 포커스·선택 표시를 확인. 360px 화면에서 표본의 최저 텍스트 대비는 Dark 6.79:1, Light 4.57:1. 상자 경계와 연결선은 Dark 6.44:1, Light 5.75:1. |
| 기존 미션 회귀 | B3-2 32건, B3-1 슬라이드·가이드 6건, B6-1 10건, 공통 미션 진입 18건 PASS. 공통 진입 1건은 추천 카드 5개 기대와 실제 6개 차이로 `origin/main`에서도 같은 결과. |
| 빌드 및 격리 | `npm run build` PASS. 프로덕션 산출물에 미리보기 라우트·번들이 없고 기존 S4-2 직접 주소는 로컬 프로덕션 빌드에서 동작. 파일 비교로 기존 원고·SVG·슬라이드 렌더러·배포 설정 보존 확인. |
| 자동 테스트 및 기존 원고 검사 | B3-2 Python 단위 테스트 14건 PASS. 용어사전 Vitest 524건 PASS, 5건 FAIL. 실패 5건은 `origin/main`에서도 재현된 용어사전 기준 해시 4건과 B3-1 SVG 목록 1건. 기존 v0.1 정적 미리보기 검사(`preview.cjs --check-only`)의 F4 `subprocess.run()` 텍스트 경계 실패도 `origin/main`의 같은 macOS 환경에서 재현. |
| Owner 확인 | 미검증. 실제 기기와 강의실 프로젝터에서의 가독성, Owner의 탐색 동선 검토 및 통합 결정은 검토 단계에 남아 있습니다. |

## 미리보기 테스트 재현

```sh
PLAYWRIGHT_CHANNEL=chrome B32_FLOW_QA_OUTPUT=/tmp/b32-flow-captures \
  npx playwright test playwright/b32-flow-preview.spec.ts
```
