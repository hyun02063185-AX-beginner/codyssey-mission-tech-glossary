# git config

## 한 줄 설명

Git configuration 값을 조회하거나 설정하는 명령.

## 쉽게 설명하면

이름과 이메일 같은 설정을 보고 바꾸는 명령입니다. 설정은 여러 곳에 나뉘어 있습니다.

## 정확한 설명

시스템·사용자·저장소의 세 수준에 설정이 나뉘어 있고, 좁은 범위가 넓은 범위를 덮어쓴다. 같은 항목이 여러 곳에 있으면 저장소 설정이 최종값이 되며, 어느 파일에서 온 값인지 확인할 수 있다.

## 이 미션에서는 왜 필요한가

예비 M01의 4.10 항목에서 설정이 실제로 적용됐는지 보여 주는 증거로 씁니다. 사용자 이름과 메일이 커밋에 박히므로, 설정을 마친 뒤 목록으로 확인하는 것까지가 한 묶음입니다.

## 코드 예

```bash
git config --list --show-origin
# file:/etc/gitconfig        core.autocrlf=input
# file:~/.gitconfig          user.name=김현래
# file:.git/config           user.email=work@example.com   ← 이것이 이긴다

git config user.email              # 최종 적용값
git config --global user.email     # 사용자 수준
git config --local user.email      # 이 저장소만

# 저장소마다 다른 계정을 쓸 때
git config --local user.email me@personal.com
```

## 주의할 점 / 경계 조건

저장소별 설정이 사용자 설정을 덮어씁니다. 커밋 작성자가 예상과 다르면 저장소 설정을 확인해야 합니다.

## 관련 용어

- `git`
- `commit`

## 흔한 오해

설정이 한 곳에 있다고 생각하기 쉽지만, 세 수준에 나뉘어 있습니다. 어느 값이 쓰이는지는 범위가 좁은 쪽이 정합니다.

## 동료평가 질문

커밋 작성자가 예상과 다르게 찍혔을 때 어디를 확인하겠습니까?
