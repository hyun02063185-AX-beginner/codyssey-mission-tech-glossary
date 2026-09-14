# curl

## 한 줄 설명

curl은 터미널에서 HTTP 등을 포함한 네트워크 요청을 보내고 응답을 확인하는 명령줄 도구입니다.

## 쉽게 설명하면

브라우저 화면 대신 명령 한 줄로 서버에 요청을 보내 보는 도구입니다.

## 정확한 설명

curl은 URL로 요청을 보내고 response header·body를 출력하거나 파일로 저장할 수 있습니다. `-i`는 response header를 함께 보이고, `-X`는 method를 지정하며, `-H`와 `-d`로 header와 body를 설정할 수 있습니다. 셸 기록이나 화면에 토큰을 남기지 않도록 인증 정보 취급에 주의해야 합니다.

## 이 미션에서는 왜 필요한가

예비 M01과 M05에서 배포 전후의 HTTP endpoint를 빠르게 확인하고, 브라우저 UI와 서버 응답을 분리해 점검합니다.

## 코드 예

```sh
curl -i https://api.github.com/users/octocat
```

## 주의할 점 / 경계 조건

`-X POST`만 붙인다고 JSON body나 Content-Type이 자동으로 설정되지는 않습니다. 서버가 기대하는 형식을 함께 보내야 합니다.

## 관련 용어

- `http`
- `http-request-response`
- `http-get`
- `https`

## 흔한 오해

curl의 출력이 보인다고 API가 모든 사용자 환경에서 정상이라는 뜻은 아닙니다. 브라우저의 CORS나 인증 상태는 별도로 확인해야 합니다.

## 동료평가 질문

브라우저에서 실패한 API 요청을 curl로도 확인하면 무엇을 분리해서 진단할 수 있나요?
