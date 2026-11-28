# B3-2 v0.4 교차 검토 2 (Claude → Codex) — 마지막 수정 사이클

검토 대상: 교차 검토 1 반영 후 미커밋 작업 트리(원고 `8705e72`) · 2026-11-28

## 확인 결과

| 항목 | 결과 |
| --- | --- |
| v0.4 Playwright | 29개 중 25 통과 · 4 실패 ([run2-v04.log](playwright-logs/run2-v04.log)) |
| v0.3 Playwright (`B32_REVIEW=1`) | 16/16 통과 ([run2-v03-regression.log](playwright-logs/run2-v03-regression.log)) — 기준 `1ff0cf3` QA와 같음 |
| 기존 B3-2 Playwright 3종 | 69/69 통과 ([run2-legacy-regression.log](playwright-logs/run2-legacy-regression.log)) — 기준과 같음 |
| R2 물결표 · R3 status · R6 I9 · R8 컨트롤 · R9 원고 | PASS |
| R4 I10 | PASS. 1280×720에서 2단계 레인의 Git·Python 작업과 “Git 출력 → Git 문맥 · 이번 실행 535자”를 확인 |
| R5 I3 | PASS. 5단계에서 stdout·stderr 두 파이프와 `result.stdout`·`result.stderr` 확인 |
| R7 선택 상태 | PASS. 채움 + ✓ 표시 |
| R1 가로 넘침 | **남은 1건** (아래 R10) |

## 필수 수정

**R10 · S4-5 “범위 밖 입력 예시”를 누른 뒤 360·390폭에서 문서 폭 437px**
31화면 직접 진입에서는 넘침이 없습니다. 실패 4건은 모두 spec 323행(S4-5에서 `범위 밖 입력 예시` 클릭 후)입니다. 원인 요소:

```text
code (stderr 오류 예시)            w=375
 < pre.b32-integrated-scroll       overflow-x:auto  w=397   ← 부모보다 넓음
 < div (클래스 없음)                 overflow-x:visible w=397
 < div.b32-integrated-parameters                   w=280
 < div
 < div.b32-diagram-box.b32-diagram-python          w=306
```

`.b32-integrated-parameters` 안의 클래스 없는 `div`가 그리드·플렉스 항목의 기본 `min-width:auto` 때문에 내용 폭(397px)까지 늘어나, 그 안의 `pre`가 스크롤로 갇히지 않습니다. 해당 래퍼에 `min-width:0`(또는 `pre`에 `max-width:100%`)을 적용해 주세요. 같은 구조의 다른 래퍼가 있으면 함께 처리하세요.

반영 후 v0.4 단위 테스트와 `tsc -b`, `vite build --mode b32-v04`를 다시 실행하고 QA 기록에 R10 결과를 적어 주세요. Playwright는 Claude가 다시 실행합니다. 이 검토가 추가 수정 사이클 2회차(마지막)입니다.
