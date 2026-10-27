# B6-1 P0 시각 설명 — 자체 검토·QA·인수인계

> 브랜치 `content/b6-1-glossary-visual-p0` · 기준 `863a6ff` · 작성 Claude Code · 2026-10-28
> 상태: **콘텐츠 제작 완료, GPT 독립 검토와 Owner 시각 승인 대기.** 웹 통합·공개하지 않았다.
> 표기: PASS = 실제로 확인함 · 수정 필요 · 미검증 = 확인하지 않음

## 1. 기술 정확성 자체 검토

데이터 원본: Codyssey_B6-1 `8b99440c` `sql/01_schema.sql`·`sql/02_sample_data.sql`·`docs/images/erd.mmd` (GitHub API로 내려받아 Python `sqlite3` 메모리 DB에서 실행).

| 확인 | 결과 | 근거 |
| --- | --- | --- |
| ERD 관계 기호 | PASS | 원본 `erd.mmd`: `STUDENT \|\|--o{ ENROLLMENT`, `COURSE \|\|--o{ ENROLLMENT` = 그림의 `‖ … ○<` |
| "학생 1명은 수강 0건 이상" | PASS | 학생별 수강 수: 1~12번 2건, 13·14번 1건, 15번(문태양) 0건 |
| "수강 1건은 학생 정확히 1명" | PASS | `enrollment.student_id INTEGER NOT NULL` + `FOREIGN KEY … REFERENCES student(id)` |
| PK/FK 그림 값 | PASS | `enrollment` 1·2·3행의 `student_id` = 1·1·2, `student` 1 김민준 · 2 이서연 |
| 거부 행 | PASS | `student_id 99` 입력 → `FOREIGN KEY constraint failed` (스키마의 `PRAGMA foreign_keys = ON` 적용 상태). 원본에 없는 값이므로 그림에 "교육용 예시" 표시 |
| JOIN INNER 4행 | PASS | 학생 1·2·15 대상 `INNER JOIN`: 김민준 1, 김민준 2, 이서연 1, 이서연 3 (`course_id`) |
| JOIN LEFT 5행 | PASS | 위 4행 + 문태양 NULL |
| JOIN 원본 표의 열 | PASS (R1 반영) | `student` 표에는 `01_schema.sql`에 있는 `id`·`name`만 그린다. 짝 수 2·2·0은 표 바깥 "설명용 집계" |
| 전체 26/27행 (본문 제안 문장) | PASS | 15명 전체 INNER 26 · LEFT 27. 스토리 `join-compare` 각주와 같다 |
| FK 참조 대상 일반화 | PASS | 그림: "보통 PK, 경우에 따라 UNIQUE 키". PK만 참조한다고 쓰지 않았다 |
| FK ≠ 복사 | PASS | 그림 안 문장 |
| JOIN ≠ 영구 결합 | PASS | 그림 안 문장 |
| JOIN에 PK·FK 제약이 필요하다는 암시 | PASS (없음) | JOIN 그림은 제약을 언급하지 않고 연결 조건만 보인다 |
| 선·화살표의 뜻 | PASS | ERD: 화살표 없음, "선 = 관계(실행 순서나 데이터 흐름이 아님)". PK/FK: "점선 화살표 = 가리킴(실행 순서 아님)" |
| PK "비워 둘 수 없다" | PASS (일반 SQL 기준) | SQL 표준 기준이다. SQLite는 `INTEGER PRIMARY KEY`가 아닌 PK에서 NULL을 허용하는 예외가 있다 — 입문 그림에 넣지 않고 GPT 판단 항목으로 남긴다(§6) |
| 결과 행 순서 | 주의 | 그림의 행 순서는 설명용 정렬이다. `ORDER BY` 없이는 순서가 보장되지 않는다 — 본문 제안에 선택 항목으로 기록 |

## 2. 자동 검증

명령: `npm run build`(성공, 생성 데이터 변경 없음) → `npx vite preview --port 6431` → `node drafts/glossary-visual/b6-1-p0/_tools/preview.cjs`. 결과 전체: [`preview/qa-results.json`](preview/qa-results.json).

실제 앱의 `#/terms/erd`·`#/terms/foreign-key`·`#/terms/join` 화면에, 브라우저 안에서만 현재 렌더러와 같은 마크업(`.rich-figure > .rich-svg-scroll > .rich-svg`)으로 그림을 넣어 측정했다. 저장소 코드는 바꾸지 않았다.

| 검사 | 범위 | 결과 |
| --- | --- | --- |
| SVG 문법 (브라우저 XML 파서) | 6개 파일 | PASS — 오류 0 |
| viewBox = width·height | 6개 파일 | PASS |
| `role="img"` + `aria-labelledby`(title·desc) | 6개 파일 | PASS |
| id 중복 (파일 안 · 6개 파일 사이) | 6개 파일 | PASS — 중복 0 |
| 글자가 viewBox 밖으로 나감 | 24회 렌더링 | PASS — 0건 |
| 글자끼리 겹침 | 24회 렌더링 | PASS — 0건 |
| 글자가 칸·상자 밖으로 넘침 | 24회 렌더링 | PASS — 0건 |
| 페이지 가로 넘침 | 24회 렌더링 | PASS — 0건 (그림 영역 안의 가로 스크롤은 현재 렌더러의 설계 동작) |
| 글자 대비 (본문 면·보조 면 모두에 대해) | 4개 테마 + OS 다크 | PASS — 최소 5.46:1 (Indigo 보조 글자). 의미색: PK·FK 이름표 흰 글자, 빠짐 `#9b2c22`, 남음 `#1a6b43` 포함 |
| 최소 글자 크기 (실제 표시 px) | desktop 1280 · mobile 390 · mobile 360 | desktop 12px(PK·FK 이름표, JOIN "설명용 집계" 이름표·각주) / 본문 13~15px · mobile 390 12.6px · mobile 360 11.5px(같은 보조 이름표), 본문 12.4px 이상 |

24회 렌더링 = 그림 3종 × {desktop 1280 Forest, mobile 390, mobile 360, 현재 렌더러 390, Indigo, Paper, Signal, OS 다크}.

제작 중 자동 검사로 잡아 고친 문제: 모바일 PK/FK 표에서 이름표가 열 이름과 겹침(이름표를 다음 줄로), Indigo·Paper·Signal에서 한 줄 이름표가 그림 오른쪽 밖으로 나감(두 줄로), Paper 보조 면에서 초록 글자 대비 4.48:1(색을 약간 어둡게).

## 3. 시각 검증

| 환경 | 결과 | 파일 |
| --- | --- | --- |
| 1280px 데스크톱 (Forest) | PASS (Claude 캡처 확인) — 문구·선·관계·표 가독성 | `preview/*-desktop.png` |
| 390px 모바일 (모바일판, 제안 CSS) | PASS (Claude 캡처 확인) — 가로 넘침 없음 | `preview/*-mobile.png` |
| 360px 모바일 (모바일판, 제안 CSS) | PASS (자동 측정) · 캡처는 Owner 확인 필요 | `preview/qa/*-mobile-360.png` |
| 390px 현재 렌더러 (desktop판, 520 고정) | **수정 필요 (통합 방식)** — 그림 오른쪽이 가려진다. JOIN은 LEFT JOIN 결과 전체가 첫 화면 밖 | `preview/qa/*-current-renderer-390.png` |
| Indigo · Paper · Signal | PASS (자동 측정) — 토큰에 따라 면·글자·선 색이 바뀌고 의미색은 유지 | `preview/qa/*-desktop-<theme>.png` |
| Light / Dark | 해당 없음 + PASS — 용어 상세에는 다크 사이트 테마가 없다(4개 테마 모두 밝은 면). OS 다크 에뮬레이션에서 그림이 바뀌지 않음을 확인 | `preview/qa/*-desktop-os-dark.png` |

**미검증**

- 실제 기기(iOS Safari·Android Chrome)에서의 표시 — 데스크톱 Chromium 에뮬레이션만 했다.
- 스크린리더 실제 낭독 — `title`·`desc` 구조만 확인했다.
- 웹 통합 후 실제 렌더러에서의 표시 — 통합하지 않았다. 현재 캡처는 브라우저 안에서 같은 마크업을 넣은 근사치다.
- 강의실 프로젝터 투영 가독성.
- **Owner 시각 검수** — 자동 검사와 Claude 캡처 확인은 Owner 승인을 대신하지 않는다.

## 4. 원본 보호와 변경 범위

| 확인 | 결과 |
| --- | --- |
| 변경 파일이 `drafts/glossary-visual/b6-1-p0/` 안에만 있음 | PASS — 커밋 전 `git status`로 확인 |
| `src/`·`data/curated/`·`content/terms/`·B6-1 스토리·가이드·승인 SVG·개념지도·웹툰·확장·정책 | 변경 없음 |
| `npm run build` 뒤 추적 파일 변경 | 없음 (생성 데이터 재생성 결과 동일) |
| `git diff --check` | PASS |

## 5. Codex 웹 통합 시 필요한 작업

Owner가 그림과 본문 제안을 승인한 뒤에 진행한다. 이번 조사에서 확인한 현재 구조의 제약을 함께 적는다.

1. **그림 렌더러가 두 용어에만 켜져 있다.** `scripts/build_web_data.py`의 `rich_sections`는 `t['id'] in {'ssh-key','cidr'}`일 때만 만들어진다. 나머지 용어는 일반 화면이 각 절을 평문으로 그리므로, 본문에 `![…](…)` 줄을 넣으면 **글자 그대로 보인다**. 둘 중 하나가 필요하다.
   - 대상 용어를 rich 목록에 추가한다. 이때 rich 경로는 고정된 제목 목록만 그리므로 `주의할 점 / 경계 조건`·`비슷한 개념과의 차이`·`동작 원리` 같은 절이 **빠진다**(`erd`·`inner-join`·`left-join`에 `주의할 점` 절이 있다). 목록 보완이 함께 필요하다.
   - 또는 일반 화면이 그림 줄을 인식하게 한다.
2. **Chrome 오픈북도 같은 문제가 있다.** `extension/sidepanel.js`는 `easyExplanation`·`technicalExplanation`·`codeExample`을 글자로 보여 준다. 그림 줄이 이 필드에 들어가면 확장에서 `![…](…)`가 보인다. 생성 단계에서 그림 줄을 걸러야 한다.
3. **그림 등록:** 승인된 desktop SVG를 새 경로(제안: `src/assets/glossary/b6-1/`)로 복사하고 `src/TermRichContent.tsx`의 `figures`에 `assets/erd-basics.svg` 등 키와 캡션을 등록한다. 공유 용어에 다른 캡션을 쓰려면 등록 방식을 정한다(제안 문서 §5).
4. **모바일판:** 700px 이하에서 `-mobile.svg`를 `width:100%; max-width:520px`로 그리는 방식을 정한다(두 SVG를 모두 인라인하고 CSS로 하나만 보이기, 또는 화면 폭에 따라 하나만 렌더링). 모바일판을 쓰면 `figcaption::after`의 "그림은 좌우로 밀어 자세히 볼 수 있습니다." 안내가 맞지 않게 되므로 함께 조정한다. 두 변형의 id는 서로 다르게 만들어 두었다.
5. **본문 반영:** 승인된 제안 문안만 `content/terms/erd.md`·`foreign-key.md`·`join.md`에 반영하고 `npm run data:build`·`npm run build:extension`으로 생성물을 갱신한다.
6. **QA:** 실제 렌더러에서 1280·1000·390·360px × 4개 테마, 용어 상세 기존 절이 빠지지 않았는지(1번), 확장 사이드패널 표시(2번), `cidr`·`ssh-key` 그림 회귀.

## 6. GPT 독립 검토 요청 항목

1. 세 그림의 기술적 사실과 데이터 값(§1 표를 원본 SQL과 대조).
2. ERD 기호 설명 "안쪽 = 최대, 바깥쪽 = 최소"와 "반대쪽 끝을 읽는다"가 입문자에게 정확하고 충분한가.
3. ERD 그림에 `1`·`N` 숫자를 까마귀 발과 함께 둔 것이 혼동을 만들지 않는가(`N` 옆의 동그라미 = 최소 0).
4. ~~`erd` 텍스트 도식 수정안에서 `member` 쪽을 `||`로 둘지 `o|`로 둘지~~ — R2로 해소. 도식 예시를 B6-1 `student`·`enrollment`·`course`로 바꾸고 기호를 원본 스키마·`erd.mmd`로 확정했다(§9).
5. `foreign-key` 신설 `주의할 점` 3항목(NULL, SQLite PRAGMA, 제약 없는 JOIN)의 정확성과 입문자 수준 적합성.
6. PK의 "비워 둘 수 없다"에 SQLite 예외를 언급할지 여부.
7. JOIN 그림의 결과 열로 수업 이름 대신 `course_id`를 보인 선택(2표 JOIN을 유지하기 위함)이 적절한가.
8. 미션 사례(B6-1 표본 이름)를 사전 그림에 남기는 것이 정책 §6 "사례 표시" 기준에 맞는가.

## 7. Owner 시각 승인 항목

1. 세 그림 각각이 "한 장을 보고 자기 말로 설명할 수 있는가" — 핵심 메시지 한 줄([visual-design.md](visual-design.md))과 비교.
2. desktop 캡처 3장과 mobile 캡처 3장의 글자 크기·밀도.
3. 모바일판을 도입할지, 현재 렌더러(가로 스크롤)로 둘지 — 특히 JOIN(`preview/qa/join-current-renderer-390.png`).
4. 색: 가이드와 같은 PK 짙은 초록·FK 갈색을 유지하는 것(스토리는 PK 파랑·FK 초록).
5. 이번 배치 범위: P0 3개 용어만 개정하고 `primary-key`·`inner-join`·`left-join`은 후속으로 둘지.
6. "본과정 M11" → "B6-1" 표기 변경을 이 세 용어에만 할지, 65개 파일 별도 배치로 할지.

## 8. 기록해 둘 발견 (이번 범위 밖)

- [시각 설명 정책](../../../docs/glossary-visual-explanation-policy.md) §3의 "기술 제약"은 `figures` 등록만 언급한다. 실제로는 §5-1의 rich 목록 제약도 있다. 정책 문서 정정 후보.
- B6-1 학습가이드 V02는 화살표를 "부모 → 자식"으로, V03은 점선 화살표를 "FK → PK"로 쓴다. 같은 가이드 안에서 화살표 방향의 뜻이 다르다.
- 스토리와 가이드의 PK·FK 색 계열이 서로 반대다.
- 미리보기에 쓴 `npx vite preview` 서버는 작업 후 종료했다.

## 9. GPT 독립 검토 반영 (검토 커밋 `1216ccf`)

GPT 독립 검토: 그림 구성·기술 내용 양호, 아래 두 항목 수정 요청.

| # | 지적 | 수정 | 상태 |
| --- | --- | --- | --- |
| R1 | JOIN 그림의 `student` 표 안에 원본 스키마에 없는 `짝 수` 열이 있어 실제 저장된 열처럼 보인다 | `student` 표는 원본 열 `id`·`name`만 그린다. 김민준 2건·이서연 2건·문태양 0건은 표 오른쪽 바깥에 "설명용 집계" 제목으로 적고, 문태양 0건만 기존처럼 점선 빨강 테두리로 강조한다. 표 아래에 "※ 짝 수는 student 표의 열이 아님". SVG `desc`에도 같은 설명을 넣었다. INNER 4행·LEFT 5행 데이터와 학습 흐름은 그대로다 | 반영 |
| R2 | ERD 문자 도식 개정안의 `member`·`post`·`comment` 필수 관계 기호는 원본 제약이 확인되지 않았다 | [제안 문서 §2](term-revision-proposal.md#2-erd--erd)의 도식을 B6-1 `student ||────o< enrollment >o────|| course`로 교체했다. 네 끝 기호를 `erd.mmd`(`STUDENT \|\|--o{ ENROLLMENT`, `COURSE \|\|--o{ ENROLLMENT`)와 `01_schema.sql`(`student_id`·`course_id` `NOT NULL` + FK)로 확인하고 근거 표를 붙였다. 최소 0은 데이터로도 확인했다(문태양 수강 0건, 수업 12번 수강 0건). 새 ERD SVG와 기호·읽는 방향·최소/최대 설명을 맞췄다 | 반영 |

**재검증 (수정 후)**

| 검사 | 결과 |
| --- | --- |
| 생성기 `_tools/build.py` 재실행 | 바뀐 파일은 `join-inner-left-desktop.svg`·`-mobile.svg` 두 개뿐. ERD·PK/FK SVG는 바이트 단위로 같다 |
| JOIN 1280px | 글자 viewBox 밖 0 · 겹침 0 · 칸 넘침 0 · 페이지 가로 넘침 없음 (viewBox 520×676) |
| JOIN 390px (모바일판) | 같은 항목 모두 0 · 그림 영역 가로 스크롤 없음 (viewBox 320×1204) |
| JOIN 360px (모바일판) | 같은 항목 모두 0 · 그림 영역 가로 스크롤 없음 · 보조 이름표 최소 11.5px |
| 전체 24회 렌더링 | 레이아웃 문제 0건 · SVG 문법·viewBox·id 중복 PASS · 최소 대비 5.46:1 (변화 없음) |
| 시각 확인 | `preview/join-desktop.png`, `preview/qa/join-mobile-360.png`를 Claude가 열어 확인 |
| `git diff --check` | PASS |

**유지되는 통합 필수 작업:** 모바일 전용 SVG 선택(700px 이하에서 `-mobile.svg`를 폭 100%로)과 `figcaption::after` 가로 스크롤 안내 문구 조정은 Codex 통합 단계의 **필수** 작업으로 남는다(§5-4). 현재 렌더러로는 390px에서 LEFT JOIN 결과가 첫 화면 밖에 있다(`preview/qa/join-current-renderer-390.png`).

수정 범위: `drafts/glossary-visual/b6-1-p0/` 안의 생성기·JOIN SVG 2개·미리보기 PNG·`qa-results.json`·문서 3개. 기존 승인 자료, 용어 본문, `src/`, canonical 데이터는 바꾸지 않았다.
