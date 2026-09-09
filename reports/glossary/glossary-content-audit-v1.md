# Glossary Content Quality Audit v1

- 일자: 2026-09-10
- 기준 commit: `25b7338`
- 대상: `data/curated/glossary-master-v0.1.yaml`의 public canonical glossary 전체 (550 terms)
- Machine-readable 버전: `data/reviews/glossary-content-audit-v1.json`

## 목적

Web UI / Chrome Extension / Webtoon 구조는 동작하지만 glossary content 자체의 최종 품질을 검증한다.
이번 Audit은 수정이 아니라 **"감사 → 분류 → 우선순위 확정"**이 목적이며, HIGH confidence의 무해한 오류만 실제 수정한다.

## 감사 방법

각 term을 다음 관점에서 검사했다.

- A. Canonical validity — 실제 기술용어인가, 일반 단어·섹션명·제출 요구사항 문구가 아닌가
- B. Canonical naming — 한/영 표기, 대소문자, 공식 명칭 일치 여부
- C. Semantic collision — 같은 문자열의 서로 다른 의미 혼재
- D. Duplicate / near duplicate — 개념·한영·축약·단복수 중복
- E. Term type / category — 분류 정확성
- F. Mission relevance — direct/required/related 연결 타당성
- G. Explanation quality — 순환 정의, placeholder, 과도한 단순화 (65개 상세 콘텐츠 전수 스캔)

판정은 term별 verdict + confidence(HIGH/MEDIUM/LOW)로 기록하며, merge/split/remove는 전부 후보로만 남긴다.

## 결과 요약

| 항목 | 수 |
|---|---|
| total terms | 550 |
| KEEP | 373 |
| flagged entries (term 단위) | 177 |
| MERGE_CANDIDATE | 55 |
| REVIEW_NAME | 45 |
| REVIEW_SCOPE | 43 |
| DEEP_CONTENT_NEEDED | 42 |
| REMOVE_CANDIDATE | 24 |
| SPLIT_CANDIDATE | 8 |
| REVIEW_MEANING | 6 |
| NEEDS_EXTERNAL_VERIFICATION 플래그 | 20 |

confidence 분포: HIGH 39 / MEDIUM 97 / LOW 41 (entry 기준)

## 사용자 발견 사례 확인 결과

1. **토큰 충돌** — `token`(Security)에 prelM01 PAT·mainM13 JWT의 **인증 토큰**과 M06 `max_tokens`·`token-usage-cost`의 **LLM 토큰**이 혼재. `normalization-review.md #1`과 일치. → SPLIT_CANDIDATE (HIGH)
2. **이미지 충돌** — 일반 이미지 term은 없음(images-directory만 존재). 단 `docker-image`의 termEn이 `image`로 일반 단어 → REVIEW_NAME (MEDIUM)
3. **필터 충돌** — `filter`(AI / Hardware)의 실제 맥락은 prelM03 `data.json`의 `filters`(분류 기준 필드). NPU convolution filter가 아님. category와 의미 불일치 → REVIEW_MEANING + REVIEW_NAME (HIGH)
4. **추가 발견** — `transaction-model`(mainM03)의 맥락은 DB 트랜잭션이 아닌 **거래 데이터**로, `transaction`(Database)과 의미 충돌 → REVIEW_MEANING (HIGH). `ai-model`의 termKo `model`과 `model-layer`(models/ 디렉터리)도 표기 충돌.

## Highest-risk terms (20)

| term | issue | confidence | action |
|---|---|---|---|
| token | 인증 토큰과 LLM 토큰 혼재 | HIGH | SPLIT (authentication-token 분리) |
| transaction-model | DB 트랜잭션과 거래 데이터 의미 충돌 | HIGH | 의미 재확정 후 이름 분리 |
| filter | data.json 필드인데 AI/Hardware로 분류 | HIGH | 의미·category 재확정 |
| masking ↔ data-masking | 동일 표기 '마스킹' 이중 canonical | MEDIUM | MERGE 검토 |
| o ↔ time-complexity | 같은 개념 중복 + id 'o' 부적합 | HIGH | MERGE (time-complexity로) |
| data-json ↔ json | termKo 'JSON' 표기 충돌 | HIGH | MERGE (json으로) |
| rate-limiting | termKo '시간당 60회 제한'은 사례값 | HIGH | termKo 일반화 |
| listen-address | termKo '0.0.0.0:15034' 리터럴 | HIGH | 개념명으로 변경 |
| default-route-any-ipv4 | termKo '0.0.0.0/0' 리터럴 | HIGH | 개념명으로 변경 |
| docker-ps-docker-ps-a | id 중복 어절 + termEn backtick | HIGH | 정리 (backtick은 이번 Sprint 수정) |
| staging-area-git-add | termEn backtick 아티팩트 | HIGH | 정리 (이번 Sprint 수정) |
| let-s-encrypt | id 오타형 (lets-encrypt) | HIGH | 참조 확인 후 수정 |
| numpy-pandas | ko '외부 라이브러리' vs en 'NumPy, pandas' 불일치 | HIGH | SPLIT 또는 명칭 일치 |
| cpu-architecture ↔ arm64-x86-64 | 같은 개념 중복 | HIGH | MERGE |
| remote ↔ remote-repository | 같은 Git 개념 중복 | HIGH | MERGE |
| least-privilege ↔ principle-of-least-privilege | 동일 보안 원칙 중복 | HIGH | MERGE |
| log-rotation ↔ logrotate | 같은 개념 중복 | HIGH | MERGE |
| expiration ↔ time-to-live | Redis TTL 중복 | HIGH | MERGE |
| dom-update ↔ ui-update | 같은 M01 개념 중복 | HIGH | MERGE |
| client-side-route ↔ client-side-routing | 같은 개념 중복 | HIGH | MERGE |
| aws-free-tier / aws-seoul-region | category 'Linux / OS' 부적절 | HIGH | category 수정 |
| user-input ↔ stdin-stdout | termKo '표준 입력' = stdin 중복 | HIGH | MERGE |
| serialization ↔ serialize-deserialize | 동일 개념 중복 | HIGH | MERGE |
| database-session ↔ sqlalchemy-session | session 충돌 (normalization-review #2) | HIGH | MERGE |

## 설명 품질 (DEEP_CONTENT_NEEDED 42)

상세 콘텐츠 65개 중 **42개**가 순환 정의("...은(는) 코디세이 미션에서 반복해 쓰이는 핵심 개념입니다") 또는 일반 filler 문장 수준이다.
M01 openbook 23개는 build 단계 placeholder 금지 규칙으로 정리되어 있으나, 그 외 42개(대부분 Phase 3 초안)는 Deep Content Sprint에서 재작성 필요.
전체 목록은 `data/reviews/glossary-content-audit-v1.json`의 `DEEP_CONTENT_NEEDED` 항목 참조.

## Content Layer Model

요약 (전체 설계는 `docs/07_content_layer_model.md`):

- **Quick Layer** — 한 줄 설명·쉬운 설명 → Chrome 기본 표시
- **Mission Layer** — 미션 맥락·짧은 예제·동료평가 질문 → Chrome + Web 공유
- **Deep Layer** — 정확한 정의·동작 원리·제한사항·흔한 오해 → Web 중심

기존 스키마를 그대로 활용하며, Deep Layer 신규 필드(`how_it_works`, `limitations_or_edge_cases`, `precise_definition`)는 content/terms 마크다운의 선택적 섹션으로 추가한다. 대규모 migration 없음.

## Top 50 Deep Content 우선순위

machine-readable: `data/reviews/deep-content-priority-v1.json`

- **P0 (10)** — 즉시 정리: `token`, `transaction-model`, `filter`, `masking`, `data-masking`, 웹툰 연결 5개(`local-storage`, `javascript`, `dom`, `defer`, `fetch-api`)
- **P1 (25)** — 높은 우선순위: `rate-limiting`, `git`, `docker`, `docker-container`, `docker-image`, `dockerfile`, `react`, `react-state`, `json`, `sql`, `python`, `cli`, `environment-variable`, `ui-state`, `crud`, `shell`, `terminal`, `branch`, `merge`, `commit`, `class`, `persistence`, `http-status-code`, `rest-api`, `authentication`
- **P2 (15)** — 후속: `async-await`, `event-loop`, `promise`, `sqlalchemy`, `fastapi`, `primary-key`, `foreign-key`, `join`, `file-permission`, `time-complexity`, `big-o-notation`, `floating-point`, `process`, `authorization`, `api-key`

## 이번 Sprint에서 실제 수정한 안전 변경

1. termEn backtick 아티팩트 제거 2건 (`docker-ps-docker-ps-a`, `staging-area-git-add`)
2. `content_status` raw→drafted 동기화 15건 (md 파일이 이미 존재하는 term) — master DB와 실제 콘텐츠 상태 불일치 해소

상세: 아래 "Changes actually applied" 참조.

## 의도적으로 수정하지 않은 것

- merge / split / remove — 전부 후보로만 기록 (다음 Sprint에서 사람 결정)
- termKo/termEn/category/type 변경 — REVIEW_* 후보로만 기록
- id 변경 (`o`, `let-s-encrypt`, `docker-ps-docker-ps-a` 등) — URL·openbook·테스트 참조 영향 확인 필요
- canonical count 550 유지
- 설명 대량 재작성 금지 (42개 placeholder는 DEEP_CONTENT_NEEDED 목록으로만 기록)
- Chrome Extension source / version / packaging 무변경

## 검증 정책

명확하지 않은 기술 정의는 공식 문서 검증 대상으로 표시했다 (`needs_external_verification: true`, 20건).
우선 소스: MDN, WHATWG, ECMAScript, Git docs, Docker docs, Linux man pages, SQLite/PostgreSQL docs, React docs, Python docs, Node.js docs.
임의 블로그는 canonical source로 사용하지 않는다.

## 후속 구조

- Review Inbox: `data/reviews/manual-review.json` — 사용자 발견 오류를 term 단위로 계속 등록
- 다음 Sprint: **Glossary Deep Content & Canonical Correction Sprint 1** (본 Audit의 P0부터 실행)
