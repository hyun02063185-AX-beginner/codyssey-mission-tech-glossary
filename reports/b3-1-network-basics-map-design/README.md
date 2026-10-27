# B3-1 네트워크 기초 보기 — 설계 사전 검증 보고서

- 브랜치 `content/b3-1-network-basics-map-design` · 기준 `main` `2149a66` · 2026-10-27 · Claude Code
- 설계 문서: [network-basics-map-design-v0.1.md](../../content/mission-stories/main-m05/network-basics-map-design-v0.1.md)
- 상태: **설계·검증만.** 지도 데이터·웹 코드·검증기·canonical·SVG·golden 파일은 수정하지 않았다. 이 폴더의 스크립트와 패치는 증거·구현 참고용이며 빌드·테스트에 포함되지 않는다.

## 1. 폴더 구성

| 경로 | 내용 |
| --- | --- |
| `candidate-concept-map-D.json` | 권장안(후보 D)을 현재 데이터에 적용한 **후보 데이터.** Codex 구현의 기준 사양이며 런타임 데이터가 아니다 |
| `experiment/build_candidate.py` | 현재 데이터를 읽어 1차·2차 후보(A~D) JSON을 작업 폴더에 만든다 |
| `experiment/layout_experiment.mjs` | E1~E6 배치·탐색 비교 |
| `experiment/run_checker.py`, `mutations.py` | 검증기 실행기, 제안 규칙 변이 검사 |
| `experiment/capture_prototype.mjs` | 임시 프로토타입 화면 캡처 |
| `proposed-patches/engine.patch` | 제안 엔진 변경(`conceptMapTypes.ts`·`conceptMapAdapter.ts`) |
| `proposed-patches/validator.patch` | 제안 검증기 규칙(현재 검증기 대비 diff. 설계 문서 §4.1의 권장 위치는 scripts 쪽 독립 검증기) |
| `proposed-patches/prototype-ui.patch` | 캡처용 최소 UI 수정(패널 제목 등 구현 시 바꿀 점은 설계 문서 §3.5) |
| `results/` | 실행 결과 원본 |
| `captures/` | 프로토타입 화면 12장 |

세 패치는 `git apply --check`로 현재 `2149a66`에 깨끗하게 적용됨만 확인했고 실제로 적용하지 않았다.

## 2. 재현 방법

작업 폴더 `W`(저장소 밖)를 하나 정한다.

```sh
python3 -I -X utf8 reports/b3-1-network-basics-map-design/experiment/build_candidate.py "$PWD" "$W"
npx esbuild src/missionConceptMap/conceptMapAdapter.ts --bundle --format=esm --platform=node --outfile="$W/engine-original.mjs"
# 제안 엔진: 임시 사본에 engine.patch를 적용한 뒤 같은 방식으로 $W/engine-patched.mjs
node reports/b3-1-network-basics-map-design/experiment/layout_experiment.mjs "$PWD" "$W"   # → $W/layout-results.json
# 검증기: 현재 검증기 사본에 validator.patch를 적용해 $W/check_patched.py, run_checker.py를 $W에 복사
python3 -B -X utf8 "$W/run_checker.py" "$W/check_patched.py" "$W/candidate-D.json" "$PWD"
python3 -B -X utf8 reports/b3-1-network-basics-map-design/experiment/mutations.py "$W" "$PWD"
```

화면 캡처는 `git worktree add --detach "$W/wt" HEAD`에 후보 데이터·엔진·UI 패치를 넣고 `npx vite --port 4291`로 띄운 뒤 `capture_prototype.mjs "$W/wt" http://127.0.0.1:4291 <출력>`(시스템 Chrome)으로 찍었다. 이번 작업의 worktree는 캡처 후 삭제했고 `git worktree list`에 남지 않았다.

## 3. 결과

### 검증기 ([results/](results/))

| 대상 | 현재 검증기 | 제안 검증기 |
| --- | --- | --- |
| 현재 main 데이터 | PASS | PASS |
| 1차 데이터 | PASS ([로그](results/unchanged-checker-phase1.txt)) | PASS |
| 후보 D | **FAIL 18**: ID 접두어 8, scope 10 ([로그](results/unchanged-checker-candidate-D.txt)) | PASS — basics core 10/9, full 11/10, 고립 0 ([로그](results/patched-checker-candidate-D.txt)) |

[변이 검사](results/mutations.txt) 8/8 검출: 공통 도메인 전체 포함(방문자·인터넷 고립), subnet 이중 소유, 보기 밖 끝점, `appliedIn` 보기 불일치, 3노드 비교 카드의 2·3번째 노드 연결(**현재 규칙의 빈틈**, 제안본에서 수정), 보충 끝점 핵심 관계, 장면에 없는 주소, AWS 노드 공유.

### 배치·탐색 ([layout-results.json](results/layout-results.json))

| 실험 | 비교 | 상태 수 | 결과 |
| --- | --- | --- | --- |
| E1 | 현재 엔진: 현재 vs 1차 | 1,128 | 좌표·경로·투영·강조 차이 0 |
| E2 | 현재 데이터: 현재 vs 제안 엔진 | 1,128 | 차이 0 |
| E3 | 현재 엔진+데이터 vs 제안 엔진+후보 A·B·C·D(세 보기) | 각 1,128 | 좌표·경로·투영 0. 강조 24(CB01, 의도) |
| E4 | B6-1(11/12)·B2-1(45/24) 기하 | — | 동일 |
| E5 | 기초 보기 카드 관통·끝점·경계·대각선·좌표 안정 | 각 132 | 4후보 문제 0 |
| E6 | URL 9 + 보기 전환 9 | — | 현재 엔진: 선택 숨김 5, 잘못된 보기 1, TypeError 1 / 제안 엔진: 모두 올바른 보기, 선택 표시, URL 왕복 동일 |

상태 수는 `conceptMapAdapter.test.ts`와 같은 범위(모든 노드·관계·흐름 선택 + 선택 없음)에 보충 표시 2 × 중요도 지정 3을 곱했다. 기존 세 보기의 기하 지문(SHA-256 앞 16자): `all 60c848e63ac46266` · `general bfe78b943954046a` · `aws ee7082e19cbbef17`.

E5 열 배치 비교(최종 노드 11·관계 10 기준):

| 후보 | 크기 | 긴 선 | 교차 관계쌍 |
| --- | --- | --- | --- |
| A [주소·공통·패킷+프로토콜] | 1158×604 | BA05 | 11 |
| B [공통·주소·패킷+프로토콜] | 1158×604 | BA10 | 8 |
| C [공통·주소·패킷·역할] | 1536×400 | BA10 | 6 |
| **D [주소·공통·패킷·역할]** | **1536×400** | BA05, BA10 | **5** |

CIDR을 보충 노드로 둔 첫 시안에서는 D의 교차 관계쌍 6개 중 4개가 서브넷→CIDR 선이었다. 그래서 CIDR을 노드에서 빼고 서브넷의 보조 용어·적용 위치로 옮겼다(설계 문서 §3.2).

이전 설계 문서가 적었던 "기초 보기 1158×604"는 이번 3열 후보 A·B에서 같은 크기로 재현됐다. 다만 이전 실험은 노드 구성이 다르고 코드가 남지 않아, 이전 문서의 "기존 세 보기 완전 동일" 주장의 증거로는 쓰지 않았다. 이번 E3가 그 검증을 새로 대신한다.

### 화면 ([capture-log.json](results/capture-log.json))

| 캡처 | 확인한 것 |
| --- | --- |
| [variant-A](captures/variant-A-1280-light.png) · [B](captures/variant-B-1280-light.png) · [C](captures/variant-C-1280-light.png) · [D](captures/variant-D-1280-light.png) | 같은 1280×720 "전체 보기"에서 열 배치 비교 |
| [D 1920 개요](captures/D-1920-light-overview.png) | 강의용 큰 화면에서 4열·카드 글자 |
| [D 1920 TCP 선택](captures/D-1920-dark-tcp-selected.png) | TCP→포트·프로토콜 선 강조, CB02로 IP·HTTP 비교 점선, 패널의 적용 위치 |
| [D 1280 IP 주소 선택](captures/D-1280-dark-ip-address-selected.png) | CB03으로 포트 비교 점선 |
| [D 390 서브넷 패널](captures/D-390-dark-subnet-panel.png) · [D 360 개요](captures/D-360-overview.png) | 모바일 보기 버튼 4개·패널. 360에서 버튼 글자 여백 부족 |
| [적용 위치 → AWS](captures/D-1280-applied-in-to-aws.png) | TCP 패널의 Security Group 링크가 AWS 보기로 전환·선택 |
| [전체 보기 공인 IP](captures/D-1280-all-public-ip-contrast.png) · [전체 보기 개요](captures/D-1280-all-unchanged-overview.png) | CB01로 생긴 Public Subnet 강조(의도), 기존 개요 23노드 |

`D-1920-dark-*`·`D-1280-dark-*`·`D-390-dark-*`는 OS Dark 에뮬레이션이다. 사이트 테마는 선택기로 바뀌므로 이 캡처는 사이트 Dark 검증이 아니다. 지도 캔버스는 기존 정책대로 테마와 독립된 밝은 팔레트였다.

## 4. 미검증·제약

- 실제 브라우저 Story·지도·사전 왕복, 사이트 테마 4종 × Dark, 360px 글자 잘림 측정, 실물 기기·프로젝터·공개 Pages.
- 저장소 Vitest·Playwright 전체는 실행하지 않았다(프로덕션 변경 없음).
- 프로토타입 UI는 캡처용 최소 수정이다. 패널 제목·보기별 사용법 문구·안내 문구 수정은 반영하지 않았다.
- 노드·관계·비교 카드 문장은 GPT 독립 콘텐츠 검토 전이다.
