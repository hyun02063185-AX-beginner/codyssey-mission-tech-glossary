# 본과정 M02 기술용어 원천 추출

- 과정: 본과정
- 미션: M02 — 버튼 누르면 화면이 스르륵 바뀌는 요즘 웹사이트 만들기
- 추출 목적: `Codyssey Mission Tech Glossary` 원천 데이터 수집
- 추출 상태: raw / unnormalized
- 기준일: 2026-09-09
- 원천: Notion `M02 — 버튼 누르면 화면이 스르륵 바뀌는 요즘 웹사이트 만들기`
- 원천 URL: https://app.notion.com/p/3d462d4e038081d5aa2de3cf9f50ed0b?pvs=204
- 원칙: 미션 문서에 직접 등장한 기술 표현과 수행상 필요한 배경 개념을 분리한다.

> 이 파일은 사전 본문이 아니다. 표준명 확정, 중복 제거, 분야 재분류, 설명 본문 작성은 `data/curated/` 단계에서 수행한다.

---

## 1. direct — 미션 원문에 직접 등장한 용어

| 원문 표기 | 표준명 후보 | 분야 후보 | 유형 후보 | 중요도 | 미션 내 맥락 | 웹툰 후보 |
|---|---|---|---|---|---|---|
| React | React | Web | framework/library | 핵심 | SPA 서비스를 React로 구현 | 좋음 |
| SPA | Single Page Application | Web | architecture | 핵심 | React 기반 서비스 구조 | 좋음 |
| pages | pages directory | Web | directory/structure | 보조 | 페이지 역할 분리 | 불필요 |
| components | components directory | Web | directory/structure | 핵심 | 재사용 컴포넌트 분리 | 보통 |
| hooks | hooks directory | Web | directory/structure | 보조 | 커스텀 훅 역할 분리 | 보통 |
| lib | lib directory | Programming | directory/structure | 보조 | 공통 로직 역할 분리 후보 | 불필요 |
| 라우트 | Route | Web | routing | 핵심 | 최소 5개 이상의 라우트 구현 | 좋음 |
| Not Found | Not Found Page | Web | routing/status | 보조 | 존재하지 않는 라우트 처리 | 보통 |
| 재사용 컴포넌트 | Reusable Component | Web | concept | 핵심 | 8개 이상 재사용 컴포넌트 요구 | 좋음 |
| props | React Props | Web | concept | 핵심 | 컴포넌트 간 데이터 전달 | 좋음 |
| state | React State | Web | concept | 핵심 | 폼·데이터·로딩/에러 상태 관리 | 좋음 |
| useEffect | useEffect | Web | hook | 핵심 | 비동기/사이드이펙트 학습 포인트 | 좋음 |
| controlled input | Controlled Input | Web | form/concept | 핵심 | React 방식 폼 입력 관리 | 좋음 |
| custom hook | Custom Hook | Web | hook/concept | 핵심 | 조회/갱신 흐름 분리 | 좋음 |
| Supabase | Supabase | Backend/Cloud | service | 핵심 | 원격 데이터 CRUD 선택지 | 좋음 |
| Firebase | Firebase | Backend/Cloud | service | 핵심 | 원격 데이터 CRUD 선택지 | 좋음 |
| CRUD | CRUD | Programming/Data | concept | 핵심 | 단일 핵심 데이터 생성·조회·수정·삭제 | 좋음 |
| 환경변수 | .env / Environment Variable | Security/Config | config | 핵심 | API Key 민감정보 관리 | 좋음 |
| .env | .env | Security/Config | config-file | 핵심 | 민감정보 저장 위치 | 보통 |
| .gitignore | .gitignore | Git | config-file | 핵심 | .env 등 민감 파일 제외 | 좋음 |
| Context | React Context | Web | state-management | 보조 | 전역 상태 보너스 요구 | 좋음 |
| useMemo | useMemo | Web | hook | 보조 | 성능 최적화 보너스 | 보통 |
| useCallback | useCallback | Web | hook | 보조 | 성능 최적화 보너스 | 보통 |
| React.memo | React.memo | Web | optimization | 보조 | 성능 최적화 보너스 | 보통 |
| Auth | Authentication | Security/Web | concept | 보조 | Supabase/Firebase Auth 보너스 | 좋음 |
| 보호 라우트 | Protected Route | Security/Web | routing/security | 보조 | 인증 사용자만 접근 | 좋음 |
| Vercel | Vercel | Deployment | service | 보조 | 배포 URL 예시 | 불필요 |
| Netlify | Netlify | Deployment | service | 보조 | 배포 URL 예시 | 불필요 |

---

## 2. required — 수행·설명을 위해 사실상 필요한 개념

| 개념 | 분야 후보 | 왜 필요한가 | 웹툰 후보 |
|---|---|---|---|
| Virtual DOM / Rendering | Web | state 변화가 화면 렌더링으로 이어지는 React 핵심 흐름 이해 | 좋음 |
| Component Tree | Web | 컴포넌트 경계와 props/state 흐름 이해 | 좋음 |
| Client-side Routing | Web | SPA 내 라우트 이동 이해 | 좋음 |
| Asynchronous Data Fetching | Programming/Web | 원격 데이터 로딩·에러 상태 관리 | 좋음 |
| API Key | Security | Supabase/Firebase 연결 시 민감정보의 의미 이해 | 좋음 |

---

## 3. related — 더 깊은 이해를 위한 연관 개념

| 개념 | 분야 후보 | 연결 이유 | 웹툰 후보 |
|---|---|---|---|
| React Router | Web | 라우팅 구현 대표 라이브러리 | 좋음 |
| Backend as a Service | Backend/Cloud | Supabase/Firebase의 공통 성격 | 좋음 |
| Memoization | Programming | useMemo/useCallback/React.memo의 상위 개념 | 좋음 |
| TypeScript | Programming | 선택 사항으로 명시된 확장 기술 | 보통 |

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
- related 개념 수: 4
- 웹툰 우선 후보 예: React, SPA, 라우트, 재사용 컴포넌트, props, state, useEffect, controlled input, custom hook, Supabase
