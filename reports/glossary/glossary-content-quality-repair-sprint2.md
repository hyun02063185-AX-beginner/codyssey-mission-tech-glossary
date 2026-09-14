# Glossary Content Quality Repair — Sprint 2

## A. Baseline

- 시작 기준선: `0b9339d` (Sprint 1 완료 상태)
- 시작 전 `git status`는 깨끗했고 `git pull --ff-only`도 최신 상태였다.
- canonical 514개, Technology Atlas, Concept Connection v1.1, Open-book, Chrome extension, 검색 UX를 유지했다.

## B. Selected Terms

34개 기존 상세 항목을 보수했다. 모두 phase 1 audit에서 P1 placeholder·CLARIFY 또는 순환 정의·self-reference 신호가 있었고, 미션에서 직접 또는 반복적으로 만나는 항목을 우선했다.

| 묶음 | 용어 |
| --- | --- |
| 컨테이너·실행 환경 | 절대/상대 경로, 바인드 마운트, Docker, Docker 컨테이너, Docker 이미지, Dockerfile, 볼륨, 포트 매핑, 셸, 터미널, 파일 권한, 환경 변수 |
| Git 협업 | Git, GitHub, 브랜치, Merge |
| Python·CLI | Python, CLI, class, 객체와 인스턴스, 예외 처리 |
| 데이터베이스 | CRUD, SQL, SQLAlchemy, PK, 외래 키, JOIN, 영속성 |
| Web·AI·계산 | React state, 재사용 컴포넌트, UTF-8, 부동소수점, MAC 연산 |

## C. P0 Fixes

이번 기준선에서 남은 audit P0 항목은 Sprint 1의 JSON·React·시간복잡도 및 이미 심화 설명이 있던 연결 용어가 대부분이었다. 이 배치에서는 P0 새 항목을 억지로 늘리지 않고, P1 placeholder 중 잘못 이해하면 구현을 망칠 수 있는 기술 경계를 우선 바로잡았다.

- Docker와 가상 머신, 이미지와 컨테이너, 볼륨과 바인드 마운트의 차이
- Git과 GitHub, 브랜치와 merge의 역할 차이
- SQL·JOIN·기본 키·외래 키·SQLAlchemy의 층위 차이
- UTF-8과 Unicode, 터미널과 셸, class와 인스턴스의 구분
- 부동소수점 오차와 MAC 연산의 실제 계산 단위

## D. P1 Fixes

- placeholder 보수: 34개
- self-reference 또는 빈 관련 용어를 실제 canonical 링크로 교체: 34개
- 한 줄 설명과 상세 설명을 서로 다른 깊이로 분리: 34개
- 자연스러운 한국어 재작성: 34개

이전의 "미션에서 반복해 쓰이는 핵심 개념"과 같은 문장을 제거하고, 각 항목이 무엇인지 먼저 설명한 뒤 미션 맥락을 덧붙였다.

## E. Learning Content Improvements

- 코드: Dockerfile, 포트 매핑, 예외 처리, React state, SQL JOIN, UTF-8, MAC 연산
- 흐름·비교: 이미지→컨테이너, 볼륨/바인드 마운트, 브랜치→merge, PK↔외래 키, 셸↔터미널
- 경계 조건: 파일 권한의 디렉터리 실행 권한, HTTP가 아닌 CRUD의 범위, ORM 사용 시에도 남는 SQL/트랜잭션 책임

## F. Natural Korean Review

번역체인 "~을 구현하기 위한 메커니즘"과 미션 중심 순환 문장을 제거했다. 용어의 첫 문장은 정의를 바로 전달하고, 설명은 짧은 비유·코드·구분이 실제로 도움이 되는 경우에만 사용했다.

## G. Validator

`scripts/validate_glossary.py`에 비차단 `content_quality` 경고를 추가했다.

- placeholder 문구
- 한 줄 설명과 기술 설명의 동일 반복
- 상세 관련 용어가 자기 자신뿐인 경우

이번 보수 항목에는 새 경고가 없었다. 전체 validator 경고는 기존 성숙화 경고 1,207건과 새 품질 경고 20건을 합쳐 1,227건이며, 오류는 0건이다.

## H. QA

- `npm run glossary:validate`: 0 errors, 1,227 warnings
- `npm run atlas:validate`: 통과
- `npm run knowledge-map:validate`: 통과
- `npm test`: 31 PASS
- `npm run build`: 통과
- `npm run test:map-interaction`: 5 PASS
- `npm run build:extension`: 통과
- 브라우저 QA: 실제 Docker·SQL 상세 화면, 보수 용어 15개, 한국어·영어 검색 6종, Atlas 링크, 모바일 가로 overflow, Concept Connection 6개를 확인했다.

## I. Remaining Work

다음 배치는 새 validator의 품질 경고 20개 중 CORS, XSS, SQL Injection, LLM, Hallucination, Recursion, npm처럼 미션 영향이 큰 항목을 우선한다. 이후 client-side-route, epsilon 같은 남은 placeholder와 관련 용어 부족 항목을 10~15개 단위로 보수한다.
