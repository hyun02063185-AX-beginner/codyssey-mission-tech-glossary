# 패키지 관리자

## 한 줄 설명

macOS의 Homebrew와 Debian 계열의 apt처럼 시스템 패키지를 설치·업데이트하는 도구.

## 쉽게 설명하면

운영체제에 필요한 명령과 라이브러리를 받는 패키지 관리자다.

## 정확한 설명

repository metadata에서 버전과 의존성을 해결하고 설치 이력을 관리한다. OS와 배포판마다 명령·권한·패키지 이름이 다르다.

## 언제 쓰나

개발 환경에 Git이나 Python을 설치한다.

## 기억할 경계

인터넷 예제의 install 명령을 OS 확인 없이 그대로 실행하면 안 된다.

## 이 미션에서는 왜 필요한가

예비 M01에서 도구를 설치하는 경로입니다. 어느 것을 쓰든 설치 자체가 목적이 아니라, 무엇을 어떤 버전으로 설치했는지 나중에 확인할 수 있게 해 두는 것이 목적입니다.

## 코드 예

```bash
# macOS
brew install git
brew list --versions git

# Ubuntu
sudo apt-get install -y git
apt list --installed | grep git
```

## 관련 용어

- `readme`
- `visual-studio-code`
