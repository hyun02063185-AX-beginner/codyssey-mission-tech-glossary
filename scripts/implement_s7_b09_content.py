#!/usr/bin/env python3
"""Write the final planned S7-B09 content batch, including lowercase readme.md."""
import json
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
# summary, easy explanation, technical detail, use, boundary, related canonical IDs
DATA={
'ai-model':('입력을 받아 학습한 규칙으로 예측·생성·분류를 수행하는 계산 모델','데이터에서 패턴을 배운 뒤 새 입력에 답을 내는 엔진이다.','모델은 구조·파라미터·추론 절차의 조합이다. 학습과 추론은 입력·비용·실패 양상이 다르다.','서비스에서 사용자의 문장을 분류하거나 답변을 생성한다.','모델 이름만으로 정확성·안전성·최신성이 보장되지는 않는다.',['inference','weight']),
'output-validation':('모델 또는 프로그램 출력이 요구한 형식·범위·안전 조건을 만족하는지 확인하는 절차','답을 바로 믿지 않고 사용할 수 있는 모양인지 마지막으로 검사하는 단계다.','schema 검사, 허용값 검증, 길이 제한, 정책 검사처럼 소비자 계약에 맞춘 검증을 적용한다.','JSON 응답을 저장하기 전에 필수 필드와 타입을 확인한다.','형식이 맞아도 내용의 사실성까지 증명하지는 않는다.',['structured-output','post-processing']),
'ai-api':('AI 모델 기능을 HTTP 등의 인터페이스로 호출하게 하는 서비스 API','애플리케이션이 모델에게 요청을 보내고 결과를 받는 창구다.','요청에는 모델·입력·파라미터가, 응답에는 생성 결과·사용량·오류가 포함될 수 있다. timeout과 재시도 정책을 호출자 쪽에서도 설계한다.','채팅 화면에서 사용자 prompt를 보내고 생성 결과를 표시한다.','API 호출 성공은 출력 품질이나 정책 적합성을 뜻하지 않는다.',['ai-model','max-tokens']),
'max-tokens':('한 요청 또는 생성에서 사용할 수 있는 토큰 수의 상한','답변이 너무 길어지지 않게 잡는 글자 예산에 가깝다.','입력 토큰과 출력 토큰의 한도는 모델 API마다 분리되거나 함께 계산된다. 상한은 비용·지연 시간·잘림 가능성에 영향을 준다.','긴 문서 요약에서 출력 길이를 제한한다.','token은 문자 수나 단어 수와 정확히 같지 않다.',['token-usage-cost','summary-aggregation']),
'neural-processing-unit':('신경망 연산을 효율적으로 처리하도록 설계된 전용 하드웨어','행렬 계산을 빠르게 처리하는 AI 전용 가속기다.','NPU는 저정밀도 tensor 연산과 전력 효율에 초점을 둘 수 있으며 GPU와 지원 연산·메모리·도구가 다르다.','모바일 기기에서 온디바이스 추론을 실행한다.','NPU가 있다고 모든 모델이나 프레임워크가 자동으로 빨라지지는 않는다.',['gpu-vs-npu','tensor']),
'post-processing':('원본 결과를 사용자·후속 시스템이 쓰기 좋게 정리하는 후처리','생성된 답을 그대로 내보내기 전에 다듬고 필요한 정보를 붙이는 단계다.','형식 변환, 인용 정리, 민감 정보 제거, 점수 재정렬, schema 정규화 등이 여기에 속한다.','모델의 텍스트를 UI 카드용 JSON으로 바꾼다.','후처리로 원본 모델의 잘못된 판단을 완전히 고칠 수는 없다.',['output-validation','structured-output']),
'prompt-design':('원하는 작업과 제약을 모델에 명확히 전달하도록 입력을 설계하는 일','모델이 무엇을, 어떤 기준과 형식으로 답할지 안내문을 쓰는 작업이다.','역할·입력 경계·출력 형식·예시·평가 기준을 명시하고 실제 실패 사례로 반복 개선한다.','요약 요청에 대상 독자와 최대 길이, JSON 형식을 함께 지정한다.','긴 prompt가 항상 좋은 것은 아니며 상충하는 지시는 결과를 불안정하게 만든다.',['prompt-template','output-validation']),
'temperature':('생성 모델의 다음 토큰 선택 무작위성을 조절하는 파라미터','낮추면 보수적으로, 높이면 더 다양한 후보를 고르는 다이얼이다.','logit 분포를 재조정해 샘플링 다양성에 영향을 준다. 정확한 효과와 허용 범위는 모델 제공자마다 다르다.','사실 추출은 낮게, 아이디어 초안은 상대적으로 높게 설정해 비교한다.','temperature 0도 시스템 전체가 결정적이라는 보장은 아니다.',['ai-model','inference']),
'convolution':('작은 필터를 입력 위로 이동하며 국소 패턴을 계산하는 연산','이미지의 작은 창을 훑으며 모서리나 질감을 찾는 계산이다.','필터와 입력의 같은 위치 원소를 곱해 더한 값을 feature map에 기록한다. stride·padding이 출력 크기를 바꾼다.','이미지 분류 모델의 초반 특징 추출 층에 사용한다.','합성곱은 단순한 행렬 곱 하나와 같지 않으며 차원 규칙이 중요하다.',['tensor','weight']),
'inference':('학습된 모델에 새 입력을 넣어 결과를 계산하는 단계','공부를 마친 모델이 실제 질문에 답하는 시간이다.','파라미터는 보통 고정한 채 forward pass를 수행하고, 생성 모델은 다음 token 선택을 반복한다.','배포한 분류기가 새 이미지의 라벨 확률을 낸다.','추론 결과는 훈련 데이터 밖의 입력에서 틀리거나 편향될 수 있다.',['ai-model','temperature']),
'regeneration':('조건을 바꾸지 않거나 일부만 바꿔 출력을 다시 생성하는 작업','마음에 들지 않는 결과를 새 시도로 다시 받는 일이다.','비결정적 sampling에서는 같은 입력도 다른 결과를 만들 수 있다. 재생성 횟수·비용·이전 결과 보존 방식을 정해야 한다.','사용자가 답변 카드의 다시 생성 버튼을 누른다.','재생성은 사실 확인이나 오류 수정의 대체 수단이 아니다.',['temperature','token-usage-cost']),
'simulator':('현실 또는 대상 시스템의 동작을 모델로 흉내 내는 프로그램','실제 장비를 건드리기 전에 가상 환경에서 결과를 시험하는 도구다.','입력·상태 전이·시간·확률 규칙을 정의해 결과를 계산한다. 모델의 가정이 simulator 결과의 신뢰 범위를 결정한다.','트래픽 증가가 큐 대기 시간에 미치는 영향을 모의한다.','시뮬레이션 결과는 실제 운영 측정값과 같은 증거가 아니다.',['benchmark','inference']),
'attention':('입력 요소마다 중요도를 계산해 필요한 정보에 집중하게 하는 신경망 메커니즘','문장을 읽을 때 현재 답에 중요한 단어를 더 살피게 하는 방식이다.','query·key·value의 유사도를 점수화해 가중 합을 만든다. self-attention은 같은 시퀀스 내부 관계를 본다.','번역 모델이 현재 출력 토큰과 관련된 원문 부분을 참조한다.','attention 가중치를 그대로 사람이 이해할 수 있는 설명으로 해석하면 안 된다.',['tensor','dot-product']),
'dot-product':('두 벡터의 같은 위치 원소를 곱해 모두 더한 값인 내적','두 방향이 얼마나 같은 쪽을 향하는지 수치로 재는 연산이다.','벡터 a와 b의 내적은 Σaᵢbᵢ이며 차원이 같아야 한다. 유사도, projection, 신경망 선형 연산의 기본이 된다.','attention에서 query와 key의 친밀도 점수를 계산한다.','내적이 크다고 길이가 다른 두 벡터의 cosine 유사도가 반드시 큰 것은 아니다.',['attention','tensor']),
'gpu-vs-npu':('범용 병렬 GPU와 AI 연산 특화 NPU의 목적·성능 특성을 비교하는 관점','둘 다 AI 계산을 돕지만 잘하는 일과 전력 사용 방식이 다르다.','GPU는 폭넓은 병렬 작업과 생태계를, NPU는 지원되는 신경망 연산의 전력 효율·온디바이스 실행을 중시하는 경우가 많다.','배포 대상 기기와 모델 연산을 보고 가속기를 선택한다.','이름만으로 속도를 비교하지 말고 모델·정밀도·런타임을 함께 측정해야 한다.',['neural-processing-unit','benchmark']),
'human-in-the-loop':('자동화 과정에 사람이 검토·승인·수정 단계로 참여하는 설계','모델이 혼자 결정하지 않고 중요한 순간에 사람에게 넘기는 방식이다.','신뢰도 임계값, 검토 UI, 피드백 기록, 책임 범위를 정의해 사람의 판단을 시스템 흐름에 넣는다.','고위험 답변을 게시하기 전에 운영자가 승인한다.','사람을 넣었다고 지연·편향·책임 문제가 자동으로 사라지지는 않는다.',['output-validation','troubleshooting']),
'prompt-template':('변수 자리에 실제 값을 채워 반복 사용하는 prompt의 골격','매번 새로 쓰지 않고 이름·문서·질문만 끼워 넣는 prompt 서식이다.','고정 지시와 동적 입력을 분리해 재사용성과 테스트 가능성을 높인다. 입력은 구분자와 길이 제한으로 경계를 명확히 한다.','요약 대상 문서만 바꿔 같은 요약 규칙을 적용한다.','사용자 입력을 template 지시처럼 섞으면 prompt injection 위험이 커질 수 있다.',['prompt-design','user-input']),
'structured-output':('정해진 schema에 맞춰 필드와 타입이 있는 형태로 내보낸 결과','사람용 문장 대신 프로그램이 바로 읽을 수 있는 칸 채운 답이다.','JSON schema나 도구 호출 계약으로 필수 필드·enum·중첩 구조를 지정한다. 소비 전에는 여전히 파싱과 검증이 필요하다.','제목·요약·태그를 가진 JSON 객체를 생성한다.','JSON처럼 보여도 유효 JSON 또는 요구 schema라는 보장은 없다.',['output-validation','serialization']),
'tensor':('여러 차원의 수를 담아 벡터·행렬을 일반화한 배열','숫자 표를 1차원, 2차원, 그 이상으로 확장한 상자다.','shape와 dtype이 연산 가능 여부를 결정한다. 신경망에서는 입력, weight, 중간 feature를 tensor로 표현한다.','이미지 batch를 [batch, height, width, channel] 형태로 저장한다.','차원 수가 많다고 자동으로 tensor 연산이 효율적인 것은 아니다.',['convolution','weight']),
'token-usage-cost':('모델 API가 처리·생성한 토큰 수에 따라 발생하는 사용량과 비용','입력과 답변 길이가 늘수록 API 청구량도 늘어나는 구조다.','제공자는 입력·출력·캐시 토큰을 다르게 과금할 수 있다. usage를 기록해 요청별 비용과 예산을 관찰한다.','긴 context를 보낼 때 예상 비용을 제한한다.','짧은 문자 수가 항상 적은 token 사용량을 뜻하지는 않는다.',['max-tokens','regeneration']),
'weight':('학습 과정에서 조정되어 모델의 계산 결과에 영향을 주는 파라미터','모델이 데이터에서 배운 숫자 조절값이다.','층의 weight는 입력과 곱해져 특징과 출력을 만든다. 학습은 손실을 줄이는 방향으로 이 값을 갱신한다.','훈련 후 저장된 weight 파일을 불러와 추론한다.','weight 하나를 사람 언어의 규칙 하나로 대응시키기는 어렵다.',['ai-model','tensor']),
'compose':('여러 컨테이너 서비스를 하나의 선언 파일로 정의·실행하는 Docker Compose 도구','웹 앱과 DB처럼 함께 움직이는 컨테이너 묶음을 한 파일로 관리한다.','compose file에 service, network, volume, environment를 선언하고 `docker compose up`으로 원하는 상태를 만든다.','개발 환경에서 API와 Redis를 함께 시작한다.','Compose는 운영 오케스트레이터의 모든 기능을 대신하지 않는다.',['docker-hub','redis']),
'docker-logs':('컨테이너의 표준 출력과 오류 출력을 확인하는 Docker 명령','컨테이너 안 프로그램이 남긴 기록을 바깥에서 보는 명령이다.','`docker logs <container>`는 저장된 stdout/stderr를 보여 주며 `-f`로 새 로그를 따라갈 수 있다.','웹 서버가 시작 실패한 원인을 확인한다.','로그가 없다고 프로세스가 정상이라는 뜻은 아니며 로그 보존 정책도 별도다.',['troubleshooting','daemon-dockerd']),
'docker-stats':('실행 중인 컨테이너의 CPU·메모리·네트워크 사용량을 표시하는 Docker 명령','각 컨테이너가 자원을 얼마나 쓰는지 실시간으로 보는 계기판이다.','`docker stats`는 cgroup 기반 사용량을 주기적으로 표시한다. 여러 컨테이너를 비교해 과도한 소비자를 찾을 수 있다.','메모리 급증 컨테이너를 식별한다.','순간 수치만으로 memory leak을 확정하면 안 된다.',['used-memory','system-monitoring']),
'orbstack':('macOS에서 컨테이너와 Linux VM을 실행·관리하는 개발 도구','Mac에서 Docker 호환 컨테이너 환경을 빠르게 쓰기 위한 도구다.','VM, Linux machine, Docker API 호환성, 파일 공유를 제공하며 실제 동작은 설치 버전과 설정에 의존한다.','로컬에서 compose 서비스를 실행한다.','Docker Desktop과 명령 호환이 있어도 모든 운영 특성이 동일하지는 않다.',['compose','vm-vs-container']),
'containerd-runc':('컨테이너 생명주기를 관리하는 containerd와 실제 프로세스를 만드는 runc','컨테이너 도구 뒤에서 이미지와 실행 프로세스를 나눠 담당하는 구성 요소다.','containerd는 이미지·snapshot·task 관리를, runc는 OCI spec에 따라 namespace·cgroup을 적용해 프로세스를 시작한다.','Docker 실행 문제에서 상위 CLI와 runtime 계층을 구분한다.','사용자가 보통 runc를 직접 호출해 컨테이너를 관리할 필요는 없다.',['daemon-dockerd','vm-vs-container']),
'daemon-dockerd':('Docker API 요청을 받아 이미지·컨테이너·네트워크를 관리하는 백그라운드 데몬','docker 명령이 일을 부탁하는 뒤편의 관리자 프로세스다.','dockerd는 client 요청을 처리하고 containerd 등 runtime 구성 요소와 통신한다. socket 권한과 daemon 상태가 실행에 영향을 준다.','`docker ps`가 실패할 때 daemon 연결 상태를 점검한다.','docker CLI가 설치됐다고 daemon이 실행 중이라는 뜻은 아니다.',['containerd-runc','docker-logs']),
'docker-hub':('컨테이너 이미지를 저장·배포하는 Docker의 공개·비공개 레지스트리 서비스','다른 사람이 만든 이미지나 팀 이미지를 내려받는 창고다.','image name과 tag 또는 digest로 이미지를 식별하고 pull/push 권한을 관리한다.','`docker pull redis`로 기본 이미지를 가져온다.','tag는 바뀔 수 있으므로 재현성에는 immutable digest가 더 적합하다.',['compose','layer']),
'layer':('컨테이너 이미지 변경을 겹쳐 만든 읽기 전용 파일시스템 층','이미지는 한 덩어리보다 여러 투명 필름을 포개 놓은 구조에 가깝다.','Dockerfile 각 단계가 layer를 만들 수 있고, container 실행 시 writable layer가 그 위에 추가된다. cache 재사용과 이미지 크기에 영향을 준다.','변경이 적은 의존성 설치를 앞 단계에 둬 build cache를 활용한다.','명령 하나가 항상 layer 하나라는 보장은 빌더와 설정에 따라 다르다.',['docker-hub','containerd-runc']),
'vm-vs-container':('가상머신과 컨테이너가 격리·운영체제·자원 사용을 나누는 방식의 차이','VM은 운영체제까지 따로 가진 컴퓨터이고, 컨테이너는 host kernel을 공유하는 격리된 프로세스다.','VM은 hypervisor 위 guest OS를 실행하고, container는 namespace·cgroup으로 host kernel 위 프로세스를 분리한다.','격리 강도와 시작 속도, 운영체제 요구를 기준으로 배포 방식을 고른다.','컨테이너가 VM보다 항상 더 안전하거나 더 가볍다는 단정은 환경에 따라 틀릴 수 있다.',['containerd-runc','orbstack']),
'redis':('메모리 기반 key-value 저장소로 cache·queue·pub/sub 등에 쓰이는 Redis','빠르게 꺼내는 메모리 서랍을 서버 형태로 제공하는 도구다.','자료형, TTL, persistence 옵션을 제공하며 network를 통해 여러 process가 공유할 수 있다.','세션 cache에 만료 시간이 있는 값을 저장한다.','Redis를 무조건 영구 데이터베이스 대체재로 쓰면 내구성 요구를 놓칠 수 있다.',['cache-eviction','used-memory']),
'streaming':('결과 전체가 준비되기 전에 조각 단위로 데이터를 보내는 전송 방식','긴 답을 다 만들 때까지 기다리지 않고 완성되는 부분부터 보여 주는 방식이다.','서버는 chunk 또는 event를 순서대로 보내고 client는 누적 렌더링한다. 연결 종료·취소·재연결을 고려해야 한다.','AI 답변 token을 생성되는 대로 채팅 UI에 표시한다.','streaming은 총 처리 시간을 줄이지 못해도 체감 대기 시간을 줄일 수 있다.',['ai-api','serialization']),
'summary-aggregation':('여러 정보 조각을 모아 핵심을 압축한 요약 결과를 만드는 과정','긴 기록 여러 개에서 중요한 내용만 묶어 짧게 정리하는 일이다.','부분 요약을 다시 합치는 계층적 방식이나 항목별 점수화 방식을 쓸 수 있다. 출처와 누락 위험을 관리해야 한다.','긴 회의 기록을 주제별 요약으로 합친다.','요약은 원문을 대체하지 않으며 중요한 조건이 빠질 수 있다.',['max-tokens','post-processing']),
'transaction-data':('금융·주문·결제처럼 상태 변화가 기록된 개별 거래 데이터','무언가가 사고팔리거나 이동한 한 건의 사실 기록이다.','금액, 시각, 주체, 상태, 식별자를 포함하며 정합성·감사·중복 처리 요구가 높다.','주문 생성과 환불을 별도 거래 행으로 남긴다.','분석용 집계값과 원본 거래 레코드를 같은 것으로 취급하면 추적성이 떨어진다.',['serialization','backup']),
'used-memory':('프로세스 또는 시스템이 현재 사용 중인 메모리 양','지금 실행 중인 프로그램들이 점유한 RAM 규모를 나타내는 수치다.','도구마다 cache, shared memory, reclaimable memory를 포함하는 방식이 달라 정의를 확인해야 한다.','컨테이너 메모리 사용량 증가를 `docker stats`로 관찰한다.','used memory 증가만으로 누수라고 결론 내리면 안 된다.',['docker-stats','memory-accounting']),
'serialization':('메모리 안의 값을 저장·전송 가능한 바이트나 형식으로 변환하는 과정','객체를 JSON 같은 전달 가능한 포장으로 바꾸는 일이다.','encoder는 자료구조를 JSON·bytes 등으로 바꾸고 decoder는 계약에 따라 복원한다. schema와 버전 호환성이 중요하다.','API response의 객체를 JSON으로 직렬화한다.','직렬화 가능한 형식이라고 민감 정보 공개까지 안전한 것은 아니다.',['structured-output','transaction-data']),
'max-memory':('프로세스·컨테이너가 사용할 수 있는 메모리의 상한 설정','메모리를 끝없이 쓰지 못하도록 정한 천장이다.','runtime 또는 cgroup 제한을 넘으면 allocation 실패나 OOM kill이 발생할 수 있다. 제한은 workload의 정상 peak를 고려해 정한다.','컨테이너에 메모리 limit을 지정한다.','제한을 높이는 것만으로 누수 원인이 해결되지는 않는다.',['used-memory','docker-stats']),
'backup':('장애·삭제·손상 뒤 복구할 수 있도록 데이터 사본을 보존하는 작업','원본이 망가져도 되돌릴 수 있게 따로 보관하는 안전망이다.','backup은 시점·보존 기간·암호화·복구 절차를 포함한다. restore 테스트로 실제 복구 가능성을 확인해야 한다.','거래 DB의 암호화된 일일 snapshot을 별도 저장소에 둔다.','복사본이 있다는 사실만으로 복구 시간이 요구사항을 만족하는 것은 아니다.',['transaction-data','troubleshooting']),
'benchmark':('정해진 workload와 지표로 성능을 재는 비교 실험','같은 시험 문제로 속도·메모리·비용을 재는 성능 측정이다.','입력, 환경, warm-up, 반복 횟수, percentile 지표를 고정해 비교 가능성을 만든다.','두 모델의 요약 지연 시간과 비용을 같은 문서 집합에서 비교한다.','단일 최고 수치만 보면 tail latency나 비용 변화를 놓친다.',['before-after-experiment','system-monitoring']),
'troubleshooting':('증상에서 원인을 좁혀 확인·완화·재발 방지를 진행하는 문제 해결 과정','문제가 생겼을 때 추측부터 하지 않고 증거를 모아 원인을 좁히는 절차다.','재현, 관측, 가설, 검증, 완화, 회고 순으로 진행하며 변경 이력과 영향 범위를 함께 확인한다.','컨테이너가 기동하지 않을 때 logs와 설정을 비교한다.','가장 최근 변경이 항상 원인이라는 가정은 위험하다.',['docker-logs','observability']),
'readme':('프로젝트의 목적·실행 방법·구조·기여 정보를 안내하는 최상위 문서','처음 온 사람이 이 프로젝트를 이해하고 시작할 수 있게 길을 알려 주는 문서다.','README는 설치 명령, 필요한 환경, 주요 기능, 예시, 제한 사항, 문서 링크를 최신 상태로 유지한다. 이 term의 상세 파일은 대소문자 충돌을 피하기 위해 `content/readme-term.md`에 둔다.','새 개발자가 clone 뒤 실행 방법과 검증 명령을 찾는다.','README는 운영 비밀값이나 상세 설계 전체를 담는 장소가 아니다.',['visual-studio-code','homebrew-apt']),
'visual-studio-code':('코드 편집·디버깅·확장을 제공하는 Microsoft의 개발자 도구','파일을 고치고 terminal·debugger·확장을 한 화면에서 쓰는 편집기다.','workspace 설정, language server, extension, integrated terminal을 조합해 개발 흐름을 지원한다.','프로젝트를 열고 formatter와 test 실행 명령을 구성한다.','에디터 설정은 프로젝트의 runtime 의존성과는 별개다.',['readme','troubleshooting']),
'homebrew-apt':('macOS의 Homebrew와 Debian 계열의 apt처럼 시스템 패키지를 설치·업데이트하는 도구','운영체제에 필요한 명령과 라이브러리를 받는 패키지 관리자다.','repository metadata에서 버전과 의존성을 해결하고 설치 이력을 관리한다. OS와 배포판마다 명령·권한·패키지 이름이 다르다.','개발 환경에 Git이나 Python을 설치한다.','인터넷 예제의 install 명령을 OS 확인 없이 그대로 실행하면 안 된다.',['readme','visual-studio-code']),
}
def sec(h,b): return f'## {h}\n\n{b}'
def render(tid,term,item,index):
 s,e,d,u,b,rels=DATA[tid]; tier=item['tier']; title=term['term_ko']; p=[f'# {title}',sec('한 줄 설명',s+'.'),sec('쉽게 설명하면',e),sec('정확한 설명',d)]
 if tier=='A':
  p += [sec(('작동 흐름','선택 기준')[index%2], '입력의 형태, 기대 결과, 비용과 실패 조건을 분리해 이 개념이 맡는 역할을 판단합니다.'),sec('실제 사용',u),sec('경계와 오해',b),sec('동료평가 질문',f'`{title}`을 적용할 때 확인할 입력 계약과 실패 시 처리 방식을 설명해 보세요.')]
 elif tier=='B': p += [sec(('대표 사용','판단할 점','작은 사례')[index%3],u),sec('주의할 점',b)]
 else: p += [sec('언제 쓰나',u),sec('기억할 경계',b)]
 p += [sec('이 미션에서는 왜 필요한가','AI·데이터 도구와 개발·운영 환경을 선택하고, 결과·비용·장애를 정확한 기준으로 설명하는 데 필요합니다.')]
 if rels:p += [sec('관련 용어','\n'.join(f'- `{x}`' for x in rels))]
 return '\n\n'.join(p)+'\n'
def main():
 plan=json.loads((ROOT/'data/reviews/content-tier-sprint7.json').read_text()); batch=next(x for x in plan['implementation_batches'] if x['id']=='S7-B09'); items={x['term_id']:x for x in plan['items']}; mp=ROOT/'data/curated/glossary-master-v0.1.yaml'; master=json.loads(mp.read_text()); terms={x['id']:x for x in master['terms']}; assert len(batch['term_ids'])==43 and set(batch['term_ids'])==set(DATA)
 for i,tid in enumerate(batch['term_ids']):
  path=ROOT/'content/readme-term.md' if tid=='readme' else ROOT/'content/terms'/f'{tid}.md'
  path.write_text(render(tid,terms[tid],items[tid],i)); terms[tid]['content_status']='drafted'
 mp.write_text(json.dumps(master,ensure_ascii=False,indent=2)+'\n'); print('Wrote 43 S7-B09 term files.')
if __name__=='__main__': main()
