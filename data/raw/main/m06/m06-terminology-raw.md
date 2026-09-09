# 본과정 M06 기술용어 원천 추출

- 과정: 본과정
- 미션: M06 — 내가 고친 코드 설명을 AI가 대신 써주는 도우미 만들기
- 추출 목적: `Codyssey Mission Tech Glossary` 원천 데이터 수집
- 추출 상태: raw / unnormalized
- 기준일: 2026-09-09
- 원천: Notion `M06 — 내가 고친 코드 설명을 AI가 대신 써주는 도우미 만들기`
- 원천 URL: https://app.notion.com/p/3d462d4e038081c0a49ef344c7cea6a9?pvs=204
- 원칙: 미션 문서에 직접 등장한 기술 표현과 수행상 필요한 배경 개념을 분리한다.

> 이 파일은 사전 본문이 아니다. 표준명 확정, 중복 제거, 분야 재분류, 설명 본문 작성은 `data/curated/` 단계에서 수행한다.

---

## 1. direct — 미션 원문에 직접 등장한 용어

| 원문 표기 | 표준명 후보 | 분야 후보 | 유형 후보 | 중요도 | 미션 내 맥락 | 웹툰 후보 |
|---|---|---|---|---|---|---|
| Python CLI | Python CLI | Programming | application type | 핵심 | git 상태를 읽어 AI 호출 | 보통 |
| git status | git status | Git | command | 핵심 | 변경 상태 수집 | 좋음 |
| git diff | git diff | Git | command | 핵심 | 변경 내용 수집 | 좋음 |
| AI API | AI API | AI/API | API | 핵심 | 커밋/PR 초안 생성 | 좋음 |
| API Key | API Key | Security/API | credential | 핵심 | AI API 인증 정보 | 좋음 |
| 환경변수 | Environment Variable | Security/Config | config | 핵심 | API Key 관리 | 좋음 |
| model | AI Model | AI | parameter/concept | 핵심 | CLI에서 모델 변경 | 좋음 |
| temperature | Temperature | AI | generation parameter | 핵심 | 생성 다양성 제어 | 좋음 |
| max_tokens | Max Tokens | AI | generation parameter | 핵심 | 출력 길이 제한 | 좋음 |
| 네트워크 오류 | Network Error | Network/API | error | 보조 | API 실패 처리 | 보통 |
| 인증 오류 | Authentication Error | Security/API | error | 보조 | API 실패 처리 | 좋음 |
| commit 명령 | commit subcommand | CLI | command | 핵심 | 커밋 제목 생성 | 불필요 |
| PR | Pull Request | Git/Collaboration | artifact | 핵심 | PR 초안 생성 | 좋음 |
| prompt design | Prompt Design | AI | concept | 핵심 | AI 출력 품질 제어 | 좋음 |
| 출력 검증 | Output Validation | AI/Programming | concept | 핵심 | 제목 길이/섹션 형식 검증 | 좋음 |
| 후처리 | Post-processing | AI/Programming | concept | 핵심 | AI 출력 형식 보정 | 좋음 |
| 재생성 | Regeneration | AI | workflow | 보조 | 형식 불일치 시 재시도 | 좋음 |
| safe-mode | Safe Mode | Security/AI | policy/feature | 핵심 | 민감정보 전송 제한 | 좋음 |
| 마스킹 | Data Masking | Security | concept | 핵심 | diff 민감정보 보호 | 좋음 |
| subprocess | Python subprocess | Programming/OS | library/module | 핵심 | Git 명령 실행 연동 | 좋음 |
| REST API | REST API | API | architecture | 핵심 | AI API 호출 학습 포인트 | 좋음 |
| 하드코딩 | Hardcoding | Programming/Security | anti-pattern | 보조 | API Key 직접 코드 삽입 금지 | 좋음 |

---

## 2. required — 수행·설명을 위해 사실상 필요한 개념

| 개념 | 분야 후보 | 왜 필요한가 | 웹툰 후보 |
|---|---|---|---|
| HTTP Request | Network/API | REST/AI API 호출 이해 | 좋음 |
| JSON Request/Response | Data/API | 대부분의 AI API 데이터 교환 구조 이해 | 좋음 |
| Secret Management | Security | API Key를 안전하게 관리하는 상위 개념 | 좋음 |
| Prompt Template | AI | commit/pr 출력 스키마를 안정화 | 좋음 |
| Human-in-the-loop | AI/Operations | AI 문구를 사용자 검토 후 적용 | 좋음 |

---

## 3. related — 더 깊은 이해를 위한 연관 개념

| 개념 | 분야 후보 | 연결 이유 | 웹툰 후보 |
|---|---|---|---|
| Token Usage / Cost | AI | 요청 횟수·max_tokens·비용 주의와 연결 | 좋음 |
| Structured Output | AI | 형식 검증을 줄이는 출력 전략 | 좋음 |
| PII | Security | 개인정보 마스킹 확장 개념 | 좋음 |

---

## 4. 추출 검수 체크
- [x] direct 항목은 원문 근거가 명확하다.
- [x] required 항목을 direct에 섞지 않았다.
- [x] related 항목은 학습 확장용으로만 분리했다.
- [x] 금지/선택/보너스로 등장한 기술도 raw에는 보존했다.
- [x] 설명 본문을 완성하거나 용어를 중복 제거하려 하지 않았다.
- [x] 웹툰 후보는 비유·시각화 효과가 큰 개념에 우선 표시했다.

## 5. 미션 요약

- direct 용어 수: 22
- required 개념 수: 5
- related 개념 수: 3
- 웹툰 우선 후보 예: git status, git diff, AI API, API Key, 환경변수, model, temperature, max_tokens, 인증 오류, PR
