# zsh / bash

## 한 줄 설명

Unix shell인 zsh와 bash의 문법·startup 설정 차이.

## 쉽게 설명하면

`zsh / bash`은(는) 실행 중인 program과 operating system의 상태를 관찰할 때 구분해야 하는 개념입니다.

## 정확한 설명

Unix shell인 zsh와 bash의 문법·startup 설정 차이. 실제 장애 판단에서는 값의 순간 변화와 지속 상태, process 범위와 system 범위를 나누어 봐야 합니다.

## 이 미션에서는 왜 필요한가

예비 M01에서 실행 환경을 적을 때 어떤 셸을 썼는지 구분해야 합니다. 명령은 같아 보여도 시작 설정 파일과 문법이 달라, 같은 한 줄이 한쪽에서만 동작하는 일이 생깁니다.

## 코드 예

```bash
echo $SHELL       # 로그인 셸
ps -p $$ -o comm= # 지금 이 창에서 돌고 있는 셸
# bash: ~/.bashrc · zsh: ~/.zshrc
```

## 관련 용어

- `process`
- `linux`
