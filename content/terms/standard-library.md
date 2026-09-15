# Standard Library

## 한 줄 설명

언어 또는 런타임과 함께 기본 제공되어 별도 설치 없이 사용할 수 있는 공식 모듈 집합입니다.

## 쉽게 설명하면

제품을 사면 기본으로 들어 있는 도구 상자입니다.

## 정확한 설명

Python standard library에는 `json`, `pathlib`, `dataclasses` 등이 포함되지만, 설치된 모든 패키지가 표준 라이브러리는 아닙니다. 지원 Python 버전에 따라 제공 API도 달라질 수 있습니다.

## 이 미션에서는 왜 필요한가

M03의 외부 패키지 금지 조건에서 어떤 모듈을 추가 설치 없이 사용할 수 있는지 판단합니다.

## 코드 예

```python
from pathlib import Path
from collections import Counter
```

## 주의할 점 / 경계 조건

표준 라이브러리여도 보안·성능·호환성 검토 없이 모든 문제에 적합한 것은 아닙니다.

## 관련 용어

- `numpy-pandas`
- `python-virtual-environment`
- `requirements-txt`

## 흔한 오해

pip로 설치했다는 사실은 그 패키지가 표준 라이브러리라는 뜻이 아닙니다.

## 동료평가 질문

프로젝트 정책이 외부 패키지를 금지할 때 dataclasses 사용은 왜 가능한가요?
