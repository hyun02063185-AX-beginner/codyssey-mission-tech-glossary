# Normalization Review

## 1

용어: Token
문제: 예비과정의 개인 액세스 토큰과 본과정 JWT의 토큰은 같은 표기가 아니다.
추천 결정: 인증 토큰은 `authentication-token` 계열로, 향후 AI Token은 별도 canonical term으로 분리한다.
대안: 모든 token을 하나의 일반 Token으로 유지한다.
영향: 검색 별칭은 넓어지지만 설명과 보안 맥락은 혼동될 수 있다.

## 2

용어: Session
문제: 로그인 세션과 SQLAlchemy Session은 역할이 다르다.
추천 결정: `login-session`, `sqlalchemy-session`으로 분리한다.
대안: Session 하나에 하위 설명을 둔다.
영향: 동일 표기의 의미 충돌을 예방한다.

## 3

용어: HTTP 403 / API Rate Limit
문제: 숫자 상태 코드와 사용량 제한은 같은 현상으로 오해되기 쉽다.
추천 결정: `http-status-code-403`과 `rate-limiting`을 분리하고 mission context로 연결한다.
대안: HTTP Status Code의 하위 항목만 둔다.
영향: 원인과 응답 코드를 구분해 설명할 수 있다.

## 4

용어: Hero / About / Skills
문제: 페이지 섹션명은 raw에는 직접 등장하지만 일반 사전 가치가 낮다.
추천 결정: Master DB에서는 미션 맥락 보존을 위해 남기되 core term에서는 제외한다.
대안: curated 단계에서 제거한다.
영향: 제출 요구 추적성과 사전 탐색 범위의 균형이 필요하다.

## 5

용어: UI State
문제: loading/success/error/empty state가 개별 raw 항목으로 등장한다.
추천 결정: `ui-state` canonical term의 mission refs로 통합하고 원문 표기는 alias로 유지한다.
대안: 네 개 상태를 모두 독립 canonical term으로 둔다.
영향: 상태 모델 설명은 쉬워지고 개별 검색은 별칭으로 유지된다.

## 6

용어: Docker Image / Digital Image
문제: image는 컨테이너·웹 자산에서 서로 다른 뜻이다.
추천 결정: 컨테이너 맥락은 `docker-image`로 고정하고 디지털 이미지는 별도 항목으로 둔다.
대안: Image 하나에 여러 의미를 병기한다.
영향: 초보자의 도구 맥락 혼동을 줄인다.
