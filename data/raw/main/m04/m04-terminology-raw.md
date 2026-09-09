# 본과정 M04 기술용어 원천 추출

- 과정: 본과정
- 미션: M04 — 친구 3~5명과 함께 프로그램 만드는 법 연습하기
- 추출 목적: `Codyssey Mission Tech Glossary` 원천 데이터 수집
- 추출 상태: raw / unnormalized
- 기준일: 2026-09-09
- 원천: Notion `M04 — 친구 3~5명과 함께 프로그램 만드는 법 연습하기`
- 원천 URL: https://app.notion.com/p/3d462d4e038081bc867bd5611e4b2e5d?pvs=204
- 원칙: 미션 문서에 직접 등장한 기술 표현과 수행상 필요한 배경 개념을 분리한다.

> 이 파일은 사전 본문이 아니다. 표준명 확정, 중복 제거, 분야 재분류, 설명 본문 작성은 `data/curated/` 단계에서 수행한다.

---

## 1. direct — 미션 원문에 직접 등장한 용어

| 원문 표기 | 표준명 후보 | 분야 후보 | 유형 후보 | 중요도 | 미션 내 맥락 | 웹툰 후보 |
|---|---|---|---|---|---|---|
| Git | Git | Git/Collaboration | tool | 핵심 | 협업 형상관리 기반 | 좋음 |
| GitHub Flow | GitHub Flow | Git/Collaboration | workflow | 핵심 | main + feature/* 협업 흐름 | 좋음 |
| Organization | GitHub Organization | Git/Collaboration | service concept | 보조 | 팀 저장소 운영 방식 | 보통 |
| Collaborator | GitHub Collaborator | Git/Collaboration | permission | 보조 | 팀 저장소 운영 방식 | 보통 |
| main branch | main branch | Git/Collaboration | branch | 핵심 | 직접 push 금지 대상 | 좋음 |
| Pull Request | Pull Request | Git/Collaboration | workflow artifact | 핵심 | 변경 제안·리뷰·병합 단위 | 좋음 |
| approve | Approval | Git/Collaboration | review state | 핵심 | 최소 1명 승인 요구 | 좋음 |
| Branch Protection Rule | Branch Protection | Git/Collaboration | policy | 핵심 | main 보호 규칙 | 좋음 |
| feature/* | Feature Branch | Git/Collaboration | branch pattern | 핵심 | 작업 브랜치 규칙 | 좋음 |
| Issue | GitHub Issue | Git/Collaboration | work item | 핵심 | 작업 추적 단위 | 좋음 |
| Closes # | Closing Keyword | Git/Collaboration | syntax | 보조 | PR과 Issue 자동 연결 | 보통 |
| Fixes # | Closing Keyword | Git/Collaboration | syntax | 보조 | PR과 Issue 자동 연결 | 보통 |
| 커밋 메시지 컨벤션 | Commit Message Convention | Git/Collaboration | convention | 핵심 | 팀 커밋 규칙 | 좋음 |
| code review | Code Review | Git/Collaboration | practice | 핵심 | 동료 코드 검토 | 좋음 |
| merge conflict | Merge Conflict | Git/Collaboration | concept | 핵심 | 충돌 해결 학습 | 좋음 |
| git amend | git commit --amend | Git | command | 핵심 | 트러블슈팅 4종 | 좋음 |
| git reset --soft | git reset --soft | Git | command | 핵심 | 트러블슈팅 4종 | 좋음 |
| git revert | git revert | Git | command | 핵심 | 트러블슈팅 4종 | 좋음 |
| git stash | git stash | Git | command | 핵심 | 트러블슈팅 4종 | 좋음 |
| CONTRIBUTING.md | CONTRIBUTING.md | Git/Docs | document | 핵심 | 팀 협업 규칙 문서 | 보통 |
| git rebase -i | Interactive Rebase | Git | command/concept | 보조 | 개인 브랜치 히스토리 정리 | 좋음 |
| CODEOWNERS | CODEOWNERS | Git/Collaboration | config-file | 보조 | 코드 소유자 지정 | 좋음 |
| force push | Force Push | Git | command/concept | 보조 | 공유 브랜치에서 주의 대상 | 좋음 |

---

## 2. required — 수행·설명을 위해 사실상 필요한 개념

| 개념 | 분야 후보 | 왜 필요한가 | 웹툰 후보 |
|---|---|---|---|
| Remote Repository | Git | 팀원이 함께 사용하는 원격 저장소 개념 | 좋음 |
| Merge | Git | PR 병합의 기본 개념 | 좋음 |
| Commit History | Git | 협업 증빙과 히스토리 재작성 이해 | 좋음 |
| Code Ownership | Git/Collaboration | 리뷰 책임과 CODEOWNERS 이해 | 좋음 |

---

## 3. related — 더 깊은 이해를 위한 연관 개념

| 개념 | 분야 후보 | 연결 이유 | 웹툰 후보 |
|---|---|---|---|
| Trunk-based Development | Git/Collaboration | GitHub Flow와 비교 가능한 협업 전략 | 보통 |
| Semantic / Conventional Commits | Git/Collaboration | 커밋 메시지 규칙 확장 | 좋음 |

---

## 4. 추출 검수 체크
- [x] direct 항목은 원문 근거가 명확하다.
- [x] required 항목을 direct에 섞지 않았다.
- [x] related 항목은 학습 확장용으로만 분리했다.
- [x] 금지/선택/보너스로 등장한 기술도 raw에는 보존했다.
- [x] 설명 본문을 완성하거나 용어를 중복 제거하려 하지 않았다.
- [x] 웹툰 후보는 비유·시각화 효과가 큰 개념에 우선 표시했다.

## 5. 미션 요약

- direct 용어 수: 23
- required 개념 수: 4
- related 개념 수: 2
- 웹툰 우선 후보 예: Git, GitHub Flow, main branch, Pull Request, approve, Branch Protection Rule, feature/*, Issue, 커밋 메시지 컨벤션, code review
