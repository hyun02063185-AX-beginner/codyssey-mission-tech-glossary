# 02. 용어 데이터 모델

## 1. 데이터 관리 원칙

동일 용어를 미션별로 복제하지 않는다.

예를 들어 `Git`이 여러 미션에 등장해도 용어 정의는 하나이며,
미션별 맥락만 별도 연결한다.

---

## 2. 출처 상태

모든 용어-미션 연결에는 다음 중 하나의 출처 상태를 기록한다.

### `direct`

미션 원문에 해당 기술용어 또는 명확한 동일 표현이 직접 등장한다.

### `required`

원문에 동일한 단어가 직접 나오지는 않더라도,
요구사항을 수행하거나 설명하려면 사실상 반드시 이해해야 하는 개념이다.

### `related`

미션 수행에 필수는 아니지만 개념을 더 깊이 이해하기 위한 연관 개념이다.

`direct`, `required`, `related`는 서로 섞어서 집계하지 않는다.

---

## 3. 용어 기본 필드

```yaml
id: docker-image
term_ko: Docker 이미지
term_en: Docker Image
aliases:
  - image
category: Container
type: concept
difficulty: 1
importance: core
summary: ""
easy_explanation: ""
technical_explanation: ""
common_misconceptions: []
related_terms: []
webtoon:
  candidate: true
  priority: 1
  status: planned
```

---

## 4. 미션 연결 필드

```yaml
mission_refs:
  - course: preliminary
    mission: M01
    source_status: direct
    source_term: image
    context: "docker images 및 커스텀 이미지 제작 요구"
    importance: core
```

---

## 5. 동료평가 필드

```yaml
peer_review:
  understanding_questions:
    - "Docker 이미지와 컨테이너의 차이는 무엇인가?"
  check_points:
    - "이미지를 실행 결과물인 컨테이너와 구분해서 설명할 수 있는가?"
```

---

## 6. 콘텐츠 상태

각 용어는 작성 상태를 관리한다.

- `raw`: 원천 추출만 완료
- `normalized`: 표준명/분류/중복 정리 완료
- `drafted`: 설명 초안 작성
- `reviewed`: 기술 검수 완료
- `published`: 서비스 노출 가능

웹툰은 별도 상태를 둔다.

- `none`
- `candidate`
- `scripted`
- `generated`
- `reviewed`
- `published`

---

## 7. 유형(type) 초기 후보

- concept
- command
- tool
- protocol
- data-format
- config
- source-file
- document
- artifact
- library
- runtime
- other

주의:

`JSON`, `Dockerfile`, `README.md`, `main.py`를 모두 단순히 `파일형식`으로 묶지 않는다.

- JSON → data-format
- Dockerfile → config/build-definition
- README.md → document
- main.py → source-file

---

## 8. 이름 충돌 처리

같은 한국어 표현이 서로 다른 분야에서 다른 의미로 사용될 수 있다.

예:

- Token
  - Authentication Token
  - AI Token
- Image
  - Docker Image
  - Digital Image
- Filter
  - NPU/Convolution Filter
  - UI/Image Filter

이 경우 사전의 표준명은 맥락을 포함해 구분하고,
원문 표현은 `aliases` 또는 `source_term`에 보존한다.

---

## 9. 난이도

난이도는 기술의 절대 난이도가 아니라
**코디세이 미션 학습 맥락에서 필요한 깊이**를 뜻한다.

- Level 1: 알아야 미션 요구사항을 읽을 수 있음
- Level 2: 수행과 설명에 필요
- Level 3: 더 깊은 이해를 위한 확장 개념
