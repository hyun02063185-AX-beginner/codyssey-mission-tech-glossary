# 본과정 M13 기술용어 원천 추출

- 과정: 본과정
- 미션: M13 — 로그인이 되고 회원끼리 연결되는 웹 서비스 만들기
- 추출 목적: `Codyssey Mission Tech Glossary` 원천 데이터 수집
- 추출 상태: raw / unnormalized
- 기준일: 2026-09-09
- 원천: Notion `M13 — 로그인이 되고 회원끼리 연결되는 웹 서비스 만들기`
- 원천 URL: https://app.notion.com/p/3d462d4e0380818f8304f3c8536cb53a?pvs=204
- 원칙: 미션 문서에 직접 등장한 기술 표현과 수행상 필요한 배경 개념을 분리한다.

> 이 파일은 사전 본문이 아니다. 표준명 확정, 중복 제거, 분야 재분류, 설명 본문 작성은 `data/curated/` 단계에서 수행한다.

---

## 1. direct — 미션 원문에 직접 등장한 용어

| 원문 표기 | 표준명 후보 | 분야 후보 | 유형 후보 | 중요도 | 미션 내 맥락 | 웹툰 후보 |
|---|---|---|---|---|---|---|
| FastAPI | FastAPI | Backend | framework | 핵심 | M12 기반 서비스 확장 | 보통 |
| Depends | FastAPI Depends | Backend | dependency injection | 핵심 | 인증 로직 주입 | 좋음 |
| 인증 | Authentication | Security/Backend | concept | 핵심 | 사용자 신원 확인 | 좋음 |
| 인가 | Authorization | Security/Backend | concept | 핵심 | 기능 접근 권한 판단 | 좋음 |
| session | Session-based Authentication | Security/Web | auth method | 핵심 | 인증 방식 선택지 | 좋음 |
| JWT | JSON Web Token | Security/Web | token/auth method | 핵심 | 인증 방식 선택지 | 좋음 |
| 로그인 | Login | Security/Web | flow | 핵심 | 인증 진입 흐름 | 보통 |
| 로그아웃 | Logout | Security/Web | flow | 핵심 | 인증 종료 흐름 | 보통 |
| public route | Public Route | Security/Web | routing policy | 핵심 | 비로그인 접근 가능 | 좋음 |
| protected route | Protected Route | Security/Web | routing policy | 핵심 | 로그인 필요 경로 | 좋음 |
| SQLAlchemy ORM | SQLAlchemy ORM | Database/Backend | ORM | 핵심 | 최소 3개 모델 | 좋음 |
| 1:N | One-to-Many | Database | relationship | 핵심 | 모델 연관관계 | 좋음 |
| N:1 | Many-to-One | Database | relationship | 핵심 | 모델 연관관계 | 좋음 |
| relationship | SQLAlchemy relationship | Database/Backend | ORM relationship | 핵심 | ORM 관계 선언 | 좋음 |
| back_populates | back_populates | Database/Backend | ORM option | 핵심 | 양방향 관계 | 좋음 |
| cascade / 부모 삭제 정책 | Cascade / Delete Policy | Database | relationship policy | 핵심 | 부모 삭제 시 자식 처리 | 좋음 |
| state transition | State Transition | Software Design | concept | 핵심 | 상태 변경 비즈니스 기능 | 좋음 |
| SQLite | SQLite | Database | DBMS | 보조 | 저장 DB 선택지 | 보통 |
| PostgreSQL | PostgreSQL | Database | DBMS | 보조 | 저장 DB 선택지 | 보통 |
| Jinja2 SSR | Jinja2 SSR | Web/Backend | rendering architecture | 핵심 | 로그인 전후 UI·기능 흐름 | 좋음 |
| auth/ | Auth Layer | Backend | directory/layer | 핵심 | 인증 역할 분리 | 좋음 |
| OAuth2 | OAuth 2.0 | Security/Web | protocol/framework | 보조 | 소셜 로그인 보너스 | 좋음 |
| password hashing | Password Hashing | Security | concept | 보조 | 회원가입 보너스 | 좋음 |
| Render | Render | Deployment | service | 보조 | 외부 배포 보너스 | 불필요 |
| Railway | Railway | Deployment | service | 보조 | 외부 배포 보너스 | 불필요 |
| N:M | Many-to-Many | Database | relationship | 보조 | 요구하지 않는 관계 | 좋음 |

---

## 2. required — 수행·설명을 위해 사실상 필요한 개념

| 개념 | 분야 후보 | 왜 필요한가 | 웹툰 후보 |
|---|---|---|---|
| Cookie | Security/Web | 세션 기반 인증 이해 배경 | 좋음 |
| Token | Security/Web | JWT 기반 인증 이해 배경 | 좋음 |
| Password Credential | Security | ID/PW 인증 구조 이해 | 좋음 |
| Access Control | Security | 공개/보호 경로 정책의 상위 개념 | 좋음 |
| Bidirectional Relationship | Database | relationship + back_populates 이해 | 좋음 |

---

## 3. related — 더 깊은 이해를 위한 연관 개념

| 개념 | 분야 후보 | 연결 이유 | 웹툰 후보 |
|---|---|---|---|
| RBAC | Security | 복잡 역할 기반 권한은 범위 밖이지만 인가 확장 개념 | 좋음 |
| Refresh Token | Security/Web | JWT 인증 심화 | 좋음 |
| CSRF | Security/Web | 세션/폼 기반 웹 인증 보안 확장 | 좋음 |
| OAuth2 Authorization Code | Security/Web | 소셜 로그인 심화 | 좋음 |

---

## 4. 추출 검수 체크
- [x] direct 항목은 원문 근거가 명확하다.
- [x] required 항목을 direct에 섞지 않았다.
- [x] related 항목은 학습 확장용으로만 분리했다.
- [x] 금지/선택/보너스로 등장한 기술도 raw에는 보존했다.
- [x] 설명 본문을 완성하거나 용어를 중복 제거하려 하지 않았다.
- [x] 웹툰 후보는 비유·시각화 효과가 큰 개념에 우선 표시했다.

## 5. 미션 요약

- direct 용어 수: 26
- required 개념 수: 5
- related 개념 수: 4
- 웹툰 우선 후보 예: Depends, 인증, 인가, session, JWT, public route, protected route, SQLAlchemy ORM, 1:N, N:1
