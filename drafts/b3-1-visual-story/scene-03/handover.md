# Scene 03 인수인계

> 미션 스토리맵 · B3-1 · AWS로 다시 이해하는 네트워크. 갱신일 2026-10-21. 단계: **시안, Owner 시각 검토 대기.** Scene 04(개념지도)나 서비스 반영으로 진행하지 않는다.

## 시작 기준과 변경 범위

| 항목 | 내용 |
| --- | --- |
| 브랜치 | `draft/b3-1-visual-story-scene-03` |
| 시작 커밋 | `1d70843`(Scene 02, 원격 `origin/draft/b3-1-visual-story-scene-02`와 같음). Scene 02는 자체 QA까지 마쳤고 **Owner 최종 시각 승인 전**이다. 임시 기준으로만 썼다 |
| Scene 01 기준 | `8da2e59`(원격과 같음) |
| `main`과의 관계 | 병합하지 않았다. 작업 시점의 `origin/main`은 `82eca2d`로, Scene 01 분기점(`10ab089`) 이후 웹툰 관련 변경만 있다. `drafts/b3-1-visual-story/`와 겹치는 경로는 0건이다 |
| 변경 범위 | `drafts/b3-1-visual-story/scene-03/` 새 폴더만. Scene 01·02 파일, 기존 학습가이드·승인 SVG, 용어사전·지식지도, 웹 코드, AWS 자원은 바꾸지 않았다 |

## 산출물

| 파일 | 내용 |
| --- | --- |
| `network-aws-comparison-desktop.svg` | 노트북용 1280×1904. A 전체 구조 비교 + B 공개 웹 접속 비교 |
| `network-aws-comparison-mobile.svg` | 휴대전화용 360×3756. AWS 구성 → 역할 비교 카드 7장 → B 흐름·조건 카드 |
| `design-notes.md` | 재사용 판단, A·B 구조, 선 약속, 표시 폭(960px) |
| `comparison-review.md` | 근거 자료(B3-1 기록, AWS 문서), 비교선 7개 검증, §5 A~E 처리, Scene 01·02 일관성 |
| `concept-candidates.md` | 관계 후보 22개(핵심·보충·제안), 제외 후보 9개 |
| `visual-qa.md` | 자동 검사, 표시 폭, 렌더링 확인, 학습 질문(사용자 검증 대기) |
| `preview/` | PNG 4장, 검토 페이지 `index.html` |
| `_tools/` | 생성기(Scene 01 생성기를 불러 씀), 검사기 |

## 승인 대기

1. **비교선 표현:** 보라 점선 + 양끝 마름모 + "≈ 이름" 알약. AWS 설정 연결은 회색 긴 점선(새 약속 두 가지)
2. **A·B를 한 SVG에 둘지, 두 파일로 나눌지**(노트북용 높이 1904 단위)
3. 휴대전화용 길이(약 4.7화면)와 일반망 전체를 Scene 01로 안내한 방식
4. 노트북용 표시 기준 960px(Scene 01·02의 904px와 다름)
5. 대응 등급: "경계 라우터 ≈ IGW", "DMZ ≈ Public Subnet"을 보충 대응으로 그림에 남길지(오해 위험이 있어 주의 문구를 붙였다)
6. 흐림의 뜻이 장면마다 다름: Scene 02 "이번 흐름에 안 씀", Scene 03 "B3-1과 비교할 대상 없음"

## 보고할 차이(수정하지 않음)

- B3-1 `docs/architecture.png`는 계획도이며 요청 화살표가 Route Table을 지난다. 실제 구성 근거로 쓰지 않았다. 고칠지는 B3-1 저장소 Owner가 판단한다.
- 기존 보강 자료 그림 4의 "B3-1 기록에 없는 것"에는 NAT Gateway·로드 밸런서가 없다. Scene 03은 배포 기록의 "NAT Gateway, ELB … 만들지 않는다"를 근거로 이를 추가했다.
- Scene 02 handover의 "확정 정책과 기존 문서의 차이"는 그대로 유효하다.

## 다음 작업에 필요한 정보

- 개념지도(Scene 04 후보)는 Owner 승인 전에는 만들지 않는다. 후보는 Scene 02·03의 `concept-candidates.md`에 있다. 기존 ID(`route-table`, `nat-gateway`, `nginx`)를 일반 개념에 자동 연결하지 않는다.
- 다시 생성하려면 `python3 -I _tools/build.py`를 실행한 뒤 `_tools/check.cjs`로 검사한다(실행 방법은 파일 머리말).
