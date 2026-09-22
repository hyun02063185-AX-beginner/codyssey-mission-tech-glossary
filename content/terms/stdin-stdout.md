# 표준 입출력

## 한 줄 설명

프로세스의 표준 입력과 표준 출력 스트림.

## 쉽게 설명하면

프로그램이 기본으로 받는 통로와 내보내는 통로다.

## 정확한 설명

stdin은 입력을, stdout은 정상 결과를 전달한다. shell pipe와 redirection은 이 스트림을 다른 프로그램·파일에 연결한다.

## 언제 쓰나

`cat data.txt | program > result.txt`처럼 도구를 조합한다.

## 기억할 경계

오류 메시지는 보통 stdout이 아니라 stderr로 보내야 결과 파이프를 오염시키지 않는다.

## 이 미션에서는 왜 필요한가

퀴즈가 답을 받는 통로가 표준 입력이고 문제를 보여 주는 통로가 표준 출력입니다. 둘을 구분해 두면 사람이 직접 치는 대신 파일에서 답을 읽어 자동으로 검사하는 것도 같은 코드로 됩니다.

## 코드 예

```bash
python quiz.py                      # 사람이 직접 입력
echo "a\nb\nc" | python quiz.py       # 미리 준비한 답으로 자동 검사
python quiz.py > result.txt         # 출력만 파일로

# 오류 메시지는 stderr 로 보내야 result.txt 가 깨끗하다
```

## 관련 용어

- `user-input`
- `terminal`
