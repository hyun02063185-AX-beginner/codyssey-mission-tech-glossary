# docker logs

## 한 줄 설명

컨테이너의 표준 출력과 오류 출력을 확인하는 Docker 명령.

## 쉽게 설명하면

컨테이너 안 프로그램이 남긴 기록을 바깥에서 보는 명령이다.

## 정확한 설명

`docker logs <container>`는 저장된 stdout/stderr를 보여 주며 `-f`로 새 로그를 따라갈 수 있다.

## 언제 쓰나

웹 서버가 시작 실패한 원인을 확인한다.

## 기억할 경계

로그가 없다고 프로세스가 정상이라는 뜻은 아니며 로그 보존 정책도 별도다.

## 이 미션에서는 왜 필요한가

예비 M01의 4.5 항목이 요구하는 운영 명령입니다. 컨테이너 안의 프로그램이 찍은 출력을 밖에서 보는 유일한 방법이라, 컨테이너가 바로 죽었을 때 이유를 찾는 첫 자리이기도 합니다.

## 코드 예

```bash
docker logs my-nginx           # 지금까지의 출력
docker logs -f my-nginx        # 계속 따라 보기
docker logs --tail 50 my-nginx # 마지막 50줄만
```

## 관련 용어

- `troubleshooting`
- `daemon-dockerd`
