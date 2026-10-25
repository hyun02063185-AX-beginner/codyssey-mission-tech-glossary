# B2-1 Story v3.2 — 디자인 탐색 (A/B)

2026-10-24 · 시작 `47cbde292ca343c2ecda8c183ec76aa5ea18a83c` · **Owner 시각 검토 대기**

v3.2 교육 원고로 대표 화면 2개(Scene 01 명령 구조, Scene 02 네 역할)를 두 가지 디자인 방향으로 만든 시안이다. React 개발·운영 통합·배포가 아니며, 기존 v2·v3.1·v3.2 문서와 화면은 바꾸지 않았다. 기존 v3.1 HTML 시안의 디자인은 기준으로 삼지 않았다.

| 파일 | 내용 |
| --- | --- |
| [design-a.html](design-a.html) | A — 프레젠테이션형 |
| [design-b.html](design-b.html) | B — 시각적 구조도형 |
| [comparison.md](comparison.md) | 특징·장단점·강의 적합성·추천 |
| [qa/](qa/) | 대표 스크린샷 24장, 검사 스크립트, 결과 `results.json` |

## 여는 방법

서버·인터넷·Python이 필요 없다. 파일을 브라우저로 직접 연다(외부 글꼴·스크립트 요청 없음).

**Windows** (저장소 루트, PowerShell):

```powershell
Start-Process .\drafts\b2-1-story-map\v3\design-exploration\design-a.html
Start-Process .\drafts\b2-1-story-map\v3\design-exploration\design-b.html
```

**Mac** (저장소 루트, 터미널):

```bash
open drafts/b2-1-story-map/v3/design-exploration/design-a.html
open drafts/b2-1-story-map/v3/design-exploration/design-b.html
```

탐색기/Finder에서 파일을 더블클릭해도 된다. 발표 화면 확인은 브라우저 창을 1280×720 또는 전체 화면으로 맞춘다.

## 조작

- **그림 선택:** 명령의 부분·역할·상황을 클릭(또는 Tab으로 이동 후 Enter/Space). 같은 것을 다시 누르면 전체 보기로 돌아간다.
- **아래 강사 조작부:** `명령 구조`/`네 역할` 화면 전환, `누가 읽나`(화면 1 전용), `전체 보기`, `이전`/`다음`
- **키보드:** ←/→ 강의 순서대로 이동, Home 처음, End 마지막, Esc 전체 보기
- 강의 순서: 화면 1은 전체 → python → -m todo → list → --limit 5 → 누가 읽나, 화면 2는 전체 → Model → Repository → Service → CLI → 저장 형식 변경 → 표시 변경

## QA

2026-10-24 · macOS · Node 24.22.0 · Chrome(Playwright 채널)에서 실행.

```bash
node drafts/b2-1-story-map/v3/design-exploration/qa/check-designs.mjs
```

| 항목 | 결과 | 범위 |
| --- | --- | --- |
| 전체 | **PASS, 732 assertions** | 2시안 × 1280×720 / 390×800 / 360×800 |
| v3.2 내용 사용 | PASS | 화면 한 문장을 storyboard 원문과 자동 대조(상황 문장 2개는 F3 대응표를 합친 문장으로, 역할 이름·‘부터 살펴봅니다’ 확인) |
| Scene 01 해석 주체 | PASS | ‘누가 읽나’에서 Python 묶음 = `python -m todo`만, todo 묶음 = `list --limit 5`만, 넘겨줌 1개는 이 상태에서만 |
| Scene 02 역할 구분 | PASS | 네 역할 설명 문구, 선택 1개, 저장 변경→Repository·표시 변경→CLI, ‘먼저 볼 곳’ 배지 1개 |
| 역할 그림의 화살표·번호 | PASS | Scene 02 화면에 화살표 그래픽·화살표 문자·단계 번호 없음 |
| 코드·클래스 문법 | PASS | Scene 02 화면에 class/def/self/`__init__`/import 없음 |
| 레이아웃 | PASS | 모든 상태에서 가로 넘침 0, **스크롤 없이 한 화면**, 명령·역할 이름 잘림 0 |
| 조작 | PASS | 클릭·재클릭 해제, Enter/Space, ←/→/Home/End/Esc, 이전/다음 끝 비활성, 화면 전환 시 질문으로 초점 이동 |
| 모바일 누를 영역 | PASS | 보이는 모든 버튼 높이 44px 이상 |
| 강사 조작부 | PASS | 조작부 글자가 질문 제목보다 작음(시각 위계) |
| 브라우저 오류·외부 요청 | PASS | 페이지 오류·console 오류/경고·요청 실패 0, 외부 HTTP 요청 0 |
| 대표 스크린샷 | PASS (자체 육안 검토) | 시안별 4상태 × 3폭 = 24장을 직접 보고 겹침·잘림·강조를 확인. 발견한 문제와 수정은 [comparison.md](comparison.md#시각-qa로-고친-것) |

**미검증 — Owner 검토 대상**

- 시각 완성도와 디자인 방향 선택
- **Windows 글꼴**(맑은 고딕·Consolas)에서의 실제 폭. 이번 스크린샷은 Mac 글꼴로 찍었다. 명령 토큰 폭이 달라질 수 있다.
- 실물 프로젝터·휴대전화, Safari/Firefox, 스크린리더, 200% 확대, 다크 모드(두 시안 모두 밝은 화면만)
- 입문자 학습 효과

## 다음 단계

Owner가 방향(A, B, 또는 혼합)을 고르면, 승인된 방향으로 Scene 01·02 전체 단계 화면을 설계한다. 이번 시안을 기존 Preview·React·Manifest에 등록하지 않았다.
