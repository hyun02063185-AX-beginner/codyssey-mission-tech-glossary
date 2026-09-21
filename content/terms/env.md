# .env

## 한 줄 설명

실행 환경별 설정값을 process에 전달하는 environment variable 파일 또는 값.

## 쉽게 설명하면

`.env`을(를) 누가 접근할 수 있고 어떤 정보가 노출되는지의 관점에서 확인하면 됩니다.

## 정확한 설명

실행 환경별 설정값을 process에 전달하는 environment variable 파일 또는 값. 실제 적용에서는 신원, 권한, network 경계, 비밀값 보관 중 관련된 조건을 구분해야 합니다.

## 이 미션에서는 왜 필요한가

본과정 M02에서 Supabase나 Firebase 키 같은 민감한 값을 두는 자리입니다. 코드 밖에 두는 가장 간단한 방법이지만, 이 파일 자체를 저장소에 올리면 아무 의미가 없어집니다.

## 코드 예

```text
# .env  (반드시 .gitignore 에 추가)
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...

# 팀에는 .env.example 만 공유한다 (값은 비워서)
```

## 관련 용어

- `authentication`
