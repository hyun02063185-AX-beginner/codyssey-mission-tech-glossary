# 본과정 M12 기술용어 원천 추출

- 과정: 본과정
- 미션: M12 — 글을 쓰고·보고·고치고·지울 수 있는 게시판형 웹 서비스 만들기
- 추출 목적: `Codyssey Mission Tech Glossary` 원천 데이터 수집
- 추출 상태: raw / unnormalized
- 기준일: 2026-09-09
- 원천: Notion `M12 — 글을 쓰고·보고·고치고·지울 수 있는 게시판형 웹 서비스 만들기`
- 원천 URL: https://app.notion.com/p/3d462d4e038081c2995addbe9d6247f1?pvs=204
- 원칙: 미션 문서에 직접 등장한 기술 표현과 수행상 필요한 배경 개념을 분리한다.

> 이 파일은 사전 본문이 아니다. 표준명 확정, 중복 제거, 분야 재분류, 설명 본문 작성은 `data/curated/` 단계에서 수행한다.

---

## 1. direct — 미션 원문에 직접 등장한 용어

| 원문 표기 | 표준명 후보 | 분야 후보 | 유형 후보 | 중요도 | 미션 내 맥락 | 웹툰 후보 |
|---|---|---|---|---|---|---|
| FastAPI | FastAPI | Backend | framework | 핵심 | 웹 애플리케이션 백엔드 | 좋음 |
| Uvicorn | Uvicorn | Backend | ASGI server | 핵심 | FastAPI 실행 서버 | 좋음 |
| SQLAlchemy | SQLAlchemy | Database/Backend | ORM library | 핵심 | DB ORM 접근 | 좋음 |
| Jinja2 | Jinja2 | Web/Backend | template engine | 핵심 | SSR 템플릿 렌더링 | 좋음 |
| python-multipart | python-multipart | Backend | library | 보조 | HTML Form 처리 패키지 | 불필요 |
| 가상환경 | Python Virtual Environment | Programming | environment | 핵심 | 패키지 격리 | 좋음 |
| routers/ | Router Layer | Backend | directory/layer | 핵심 | 요청/응답 역할 | 좋음 |
| services/ | Service Layer | Backend | directory/layer | 핵심 | 비즈니스 로직 역할 | 좋음 |
| repositories/ | Repository Layer | Backend | directory/layer | 핵심 | DB 접근 역할 | 좋음 |
| models/ | Model Layer | Backend/Database | directory/layer | 핵심 | ORM 모델 역할 | 좋음 |
| templates/ | Template Directory | Web/Backend | directory | 핵심 | SSR 화면 템플릿 | 보통 |
| GET | HTTP GET | Web/Network | method | 핵심 | 홈·조회 요청 | 좋음 |
| POST | HTTP POST | Web/Network | method | 핵심 | 등록/수정 폼 처리 | 좋음 |
| TemplateResponse | TemplateResponse | FastAPI/Jinja2 | response type | 핵심 | SSR 화면 렌더링 | 좋음 |
| SSR | Server-Side Rendering | Web | rendering architecture | 핵심 | 서버 측 HTML 렌더링 | 좋음 |
| CRUD | CRUD | Backend/Database | concept | 핵심 | 단일 모델 생성·조회·수정·삭제 | 좋음 |
| HTML Form | HTML Form | Web | form | 핵심 | 등록/수정 입력 | 보통 |
| Form() | FastAPI Form | Backend | dependency/input | 핵심 | 폼 데이터 수신 | 보통 |
| RedirectResponse | RedirectResponse | Backend/Web | response type | 핵심 | PRG 리다이렉트 | 좋음 |
| 303 | HTTP 303 See Other | Web/Network | status-code | 핵심 | POST 후 GET 유도 | 좋음 |
| PRG | Post/Redirect/Get | Web | pattern | 핵심 | 폼 재제출 방지 패턴 | 좋음 |
| SQLite | SQLite | Database | DBMS | 핵심 | 저장 DB | 보통 |
| ORM Session | SQLAlchemy Session | Database/Backend | concept | 핵심 | DB 세션 관리 | 좋음 |
| Depends | FastAPI Depends | Backend | dependency injection | 핵심 | DB 세션 주입 | 좋음 |
| dependency injection | Dependency Injection | Software Design | concept | 핵심 | Depends 학습 포인트 | 좋음 |
| layered architecture | Layered Architecture | Software Design | architecture | 핵심 | Router/Service/Repository 분리 | 좋음 |
| requirements.txt | requirements.txt | Programming | dependency file | 핵심 | 의존성 목록 명시 | 보통 |
| pyproject.toml | pyproject.toml | Programming | config/dependency file | 보조 | 의존성 목록 대안 | 좋음 |

---

## 2. required — 수행·설명을 위해 사실상 필요한 개념

| 개념 | 분야 후보 | 왜 필요한가 | 웹툰 후보 |
|---|---|---|---|
| ASGI | Backend | Uvicorn과 FastAPI 실행 구조 이해 | 좋음 |
| Request / Response Cycle | Web/Backend | Router→Service→Repository→DB/Template 흐름 이해 | 좋음 |
| Database Session | Database | ORM Session 수명과 트랜잭션 이해 | 좋음 |
| Business Logic | Software Design | Service Layer 역할 이해 | 좋음 |
| Repository Pattern | Software Design | DB 접근 분리 원리 | 좋음 |

---

## 3. related — 더 깊은 이해를 위한 연관 개념

| 개념 | 분야 후보 | 연결 이유 | 웹툰 후보 |
|---|---|---|---|
| MVC | Software Design | SSR 웹 구조와 비교 가능한 패턴 | 좋음 |
| Transaction | Database | ORM Session commit/rollback 심화 | 좋음 |
| Template Engine | Web | Jinja2 상위 개념 | 보통 |

---

## 4. 추출 검수 체크
- [x] direct 항목은 원문 근거가 명확하다.
- [x] required 항목을 direct에 섞지 않았다.
- [x] related 항목은 학습 확장용으로만 분리했다.
- [x] 금지/선택/보너스로 등장한 기술도 raw에는 보존했다.
- [x] 설명 본문을 완성하거나 용어를 중복 제거하려 하지 않았다.
- [x] 웹툰 후보는 비유·시각화 효과가 큰 개념에 우선 표시했다.

## 5. 미션 요약

- direct 용어 수: 28
- required 개념 수: 5
- related 개념 수: 3
- 웹툰 우선 후보 예: FastAPI, Uvicorn, SQLAlchemy, Jinja2, 가상환경, routers/, services/, repositories/, models/, GET
