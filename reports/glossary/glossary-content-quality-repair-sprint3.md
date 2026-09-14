# Glossary Content Quality Repair — Sprint 3

## Executive Summary

- 수정 용어: 20개
- P0: 0개 (기준선의 P0은 Sprint 1/기존 심화 콘텐츠에서 이미 처리됨)
- P1: 20개
- P2/P3: 0개
- content_quality warning: 20개 → 0개

이번 배치는 경고 수를 맞추기보다, 모든 경고를 사람이 읽어 실제 설명 문제인지 확인한 뒤 보수했다. canonical, Atlas, Connection, Open-book, extension, 검색과 라우팅 구조는 바꾸지 않았다.

## Priority Terms

| 용어 | 개선 내용 |
| --- | --- |
| CORS | 브라우저·서버 헤더·same-origin policy·preflight의 역할을 요청 흐름으로 구분 |
| XSS | 신뢰하지 않는 입력을 HTML로 해석해 브라우저에서 스크립트가 실행되는 상황과 방어 방향 제시 |
| SQL Injection | 문자열 결합의 위험과 parameterized query의 목적을 안전한 짧은 코드로 설명 |
| LLM | 토큰 단위 다음 토큰 예측을 설명하고 의인화를 피함 |
| Hallucination | 의도적 거짓말이 아닌, 그럴듯하지만 부정확한 생성과 검증 필요성을 설명 |
| Recursion | 종료 조건과 호출 스택의 관계가 보이는 countdown 코드 추가 |
| npm | Node.js 런타임, npm CLI/registry, package.json, 설치/스크립트 실행을 구분 |

추가 보수: ACID, AJAX, Callback, 클라이언트 측 라우트, 엡실론, 이벤트 전파, JSX, MPA, 신경망, Node.js, preventDefault, 솔트, useState.

## content_quality Warning Review

| 분류 | 수 |
| --- | ---: |
| REAL_ISSUE | 20 |
| FALSE_POSITIVE | 0 |
| ALREADY_FIXED | 0 |
| DEFER | 0 |

20개 모두 한 줄 설명과 상세 설명의 반복, 영어 복사체, placeholder, 또는 의미 없는 쉬운 설명이 실제로 남아 있던 항목이었다. validator 조건을 완화하지 않고 내용을 고쳤다.

## Content Style

- 보안: 요청/공격 발생 상황 → 방어 방향
- AI: 입력 → 토큰 처리 → 출력 → 검증
- JavaScript: 이벤트 흐름·기본 동작·상태 갱신
- CS: 재귀 코드, 종료 조건, 호출 스택
- 데이터: ACID 네 가지 성질과 SQL 입력 경계

각 항목은 한 줄 정의와 상세 설명을 분리했고, UI가 읽는 `쉽게 설명하면`, `동작 원리`, `코드 예` 필드를 사용해 빈 제목 없이 표시되도록 확인했다.

## Content QA

실제 브라우저에서 CORS와 LLM 상세 화면을 확인했다. 자동 브라우저 검사로 수정 항목 20개, 검색 8종(CORS, XSS, SQL 인젝션, LLM, 환각, 재귀, npm, Node.js), 모바일 가로 overflow, 공유 상세 UI의 Atlas 링크, Concept Connection 6개를 확인했다.

## Functional QA

- `npm run glossary:validate`: 0 errors, 1,207 maturity warnings, content_quality warnings 0
- `npm run atlas:validate`: PASS
- `npm run knowledge-map:validate`: PASS
- `npm test`: 31 PASS
- `npm run build`: PASS
- `npm run test:map-interaction`: 5 PASS
- `npm run build:extension`: PASS

## Remaining Content

- detailed content: 84개 (이번 Sprint는 기존 20개 품질 보수)
- missing/immature: 430개 인덱스·성숙화 대상
- maturity warnings: 1,207개
- content_quality warnings: 0개

## Sprint 4 Candidates

새 content_quality 경고는 없으므로, 다음에는 미션 관련성과 Atlas 핵심도를 기준으로 Event Loop, Call Stack, Task Queue, Scope, Middleware, Migration, DNS, ACID 확장 항목을 소규모 배치로 검토한다.
