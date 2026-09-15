# Python 가상환경

## 한 줄 설명

프로젝트마다 Python 패키지와 버전 의존성을 분리하는 실행 환경입니다.

## 쉽게 설명하면

프로젝트별로 도구 상자를 따로 두어 서로의 도구를 섞지 않는 것과 같습니다.

## 정확한 설명

Virtual environment는 interpreter와 site-packages 경로를 분리해 한 프로젝트의 설치·업데이트가 다른 프로젝트나 시스템 Python에 영향을 덜 주게 합니다.

## 이 미션에서는 왜 필요한가

M12에서 서버 의존성을 재현 가능하게 설치하고 로컬 환경 오염을 줄입니다.

## 코드 예

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## 주의할 점 / 경계 조건

가상환경을 만들었다고 의존성 버전이 자동 기록되지는 않으므로 requirements 또는 lock 파일도 관리해야 합니다.

## 관련 용어

- `requirements-txt`
- `pyproject-toml`
- `python-cli`

## 흔한 오해

가상환경은 컨테이너나 운영체제 가상머신과 같은 수준의 격리가 아닙니다.

## 동료평가 질문

동료가 같은 프로젝트를 실행할 때 가상환경과 의존성 목록이 함께 필요한 이유는 무엇인가요?
