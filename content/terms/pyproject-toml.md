# pyproject.toml

## 한 줄 설명

Python 프로젝트의 빌드 도구·패키지 메타데이터·의존성을 선언할 수 있는 표준 설정 파일입니다.

## 쉽게 설명하면

프로젝트를 만들고 배포하는 데 필요한 규칙을 한곳에 적은 설계표입니다.

## 정확한 설명

`pyproject.toml`은 PEP 518 기반의 TOML 파일로 build-system을 정의하며 도구에 따라 project metadata와 dependency도 담습니다. 모든 도구가 같은 키를 해석하는 것은 아닙니다.

## 이 미션에서는 왜 필요한가

M12에서 requirements.txt 외의 의존성·도구 설정 방식을 이해합니다.

## 코드 예

```toml
[project]
name = 'my-api'
dependencies = ['fastapi']
```

## 관련 용어

- `requirements-txt`
- `python-virtual-environment`
