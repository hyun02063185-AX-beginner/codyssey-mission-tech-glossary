# SHA

## 한 줄 설명

입력에서 고정 길이 digest를 만드는 secure hash algorithm 계열.

## 쉽게 설명하면

`SHA`을(를) 누가 접근할 수 있고 어떤 정보가 노출되는지의 관점에서 확인하면 됩니다.

## 정확한 설명

입력에서 고정 길이 digest를 만드는 secure hash algorithm 계열. 실제 적용에서는 신원, 권한, network 경계, 비밀값 보관 중 관련된 조건을 구분해야 합니다.

## 이 미션에서는 왜 필요한가

본과정 M10에서 직접 만든 커밋 식별자를 실제 Git 쪽으로 넓혀 볼 때 만나는 개념입니다. 내용을 고정 길이 값으로 줄이면서 내용이 조금만 달라도 값이 완전히 달라지는 성질이 있어, 이름이자 무결성 검사 수단이 됩니다.

## 코드 예

```bash
echo -n "hello" | sha1sum
# aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d
echo -n "hellp" | sha1sum
# 한 글자만 바꿔도 전혀 다른 값
```

## 관련 용어

- `authentication`
