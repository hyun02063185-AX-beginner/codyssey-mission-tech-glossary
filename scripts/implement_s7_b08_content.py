#!/usr/bin/env python3
"""Write detailed content for the planned S7-B08 terms only."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

# summary | plain-language explanation | technical detail | concrete use | boundary | related IDs
DATA = {
    'directed-acyclic-graph': ('방향은 있지만 순환 고리가 없는 그래프', '선행 작업에서 다음 작업으로만 화살표가 이어지는 의존성 지도다.', '간선 u→v는 v가 u 뒤에 와야 함을 뜻한다. 순환이 없으므로 선후 관계를 정렬할 수 있다.', '빌드 단계와 모듈 의존성을 DAG로 만들면 실행 가능한 순서를 계산할 수 있다.', 'A→B→A가 생기면 DAG가 아니며 위상 정렬도 실패한다.', ['topological-sort', 'cycle']),
    'graph-traversal': ('그래프의 정점과 간선을 규칙에 따라 방문하는 방법', '연결된 지점을 하나씩 찾아가며 필요한 지점만 훑는 절차다.', '방문 집합을 유지해야 같은 정점을 반복 처리하지 않는다. BFS와 DFS가 대표적인 순회 전략이다.', '추천 관계나 의존성을 따라 영향 범위를 찾을 때 사용한다.', '그래프가 비연결이면 시작점 하나의 순회로 모든 정점을 방문할 수 없다.', ['bfs', 'dfs']),
    'hash-map': ('키를 해시해 값에 빠르게 접근하는 자료구조', '이름표를 넣으면 해당 서랍으로 바로 가는 사물함에 가깝다.', '해시 함수가 키를 버킷 위치로 바꾸고, 충돌은 체이닝 또는 다른 탐사 방식으로 해결한다. 평균 조회·삽입은 O(1)이다.', '사용자 ID를 키로 하여 프로필을 찾는 인메모리 캐시에 적합하다.', '키의 순서가 보장되지 않으며 최악의 충돌 상황에서는 O(n)이 될 수 있다.', ['hash-function', 'collision']),
    'least-recently-used': ('가장 오래 사용하지 않은 항목을 먼저 비우는 캐시 교체 정책', '자주 다시 찾는 것은 남기고 한동안 손대지 않은 것을 내보내는 방식이다.', '조회 때 항목을 최근 위치로 옮기고, 공간이 차면 꼬리의 항목을 제거한다. 해시맵과 이중 연결 리스트 조합으로 O(1)에 구현할 수 있다.', '최근 본 문서나 API 응답을 제한된 메모리에 보관할 때 쓴다.', '최근에 쓰지 않았다고 앞으로도 안 쓸 것이라는 보장은 없다.', ['cache-eviction', 'doubly-linked-list']),
    'min-heap': ('가장 작은 값이 루트에 있는 완전 이진 트리 기반 우선순위 큐', '늘 가장 급한, 즉 가장 작은 우선순위의 일을 맨 위에 올려둔다.', '부모 값은 자식 값보다 작거나 같다는 힙 속성을 유지한다. 최솟값 조회는 O(1), 삽입과 삭제는 O(log n)이다.', '최단 경로 탐색에서 다음 후보 중 비용이 가장 작은 정점을 꺼낸다.', '전체가 정렬된 배열은 아니므로 임의 위치의 값을 빠르게 찾는 용도에는 맞지 않는다.', ['heap-property', 'shortest-path']),
    'sorting-algorithm': ('여러 값을 비교 기준에 따라 일정한 순서로 재배치하는 알고리즘', '흩어진 카드를 번호나 이름 순으로 줄 세우는 방법이다.', '비교 기반 정렬은 비교 연산으로 순서를 결정하며, 안정성·추가 메모리·최악 시간 복잡도가 알고리즘마다 다르다.', '점수 목록을 내림차순으로 정렬한 뒤 상위 N명을 표시할 수 있다.', '숫자를 문자열로 정렬하면 10이 2보다 앞서는 등 기대와 다른 결과가 날 수 있다.', ['stable-custom-comparator', 'top-n']),
    'doubly-linked-list': ('각 노드가 이전과 다음 노드를 모두 가리키는 연결 리스트', '각 칸이 앞뒤 칸의 주소를 함께 적어 둔 줄이다.', '노드를 알고 있으면 앞뒤 포인터만 바꿔 삽입·삭제할 수 있다. 대신 배열보다 포인터 저장 공간과 순차 접근 비용이 든다.', 'LRU 캐시에서 최근 사용 순서를 앞뒤로 이동시키는 데 쓰인다.', '인덱스로 k번째 원소를 찾는 일은 O(1)이 아니라 순회가 필요하다.', ['least-recently-used', 'deque']),
    'hash-bucket': ('해시 값이 가리키는 항목 저장 칸 또는 그 칸의 묶음', '해시맵에서 같은 번호를 받은 항목이 모이는 서랍이다.', '버킷 수와 분포가 충돌 빈도에 영향을 준다. 한 버킷에는 체이닝으로 여러 엔트리가 들어갈 수 있다.', '해시맵의 특정 키가 어느 저장 묶음에 들어가는지 설명할 때 사용한다.', '버킷은 해시맵 전체가 아니며, 충돌이 없다는 뜻도 아니다.', ['hash-map', 'load-factor']),
    'inverted-index': ('단어에서 문서 목록으로 거꾸로 연결하는 검색용 색인', '책 뒤의 색인처럼 단어를 보면 그 단어가 나온 문서를 찾는다.', '각 토큰에 문서 ID와 필요하면 위치·빈도를 연결한다. 검색어의 posting list를 합치거나 교차해 결과를 만든다.', '문서 검색에서 “cache eviction”을 포함한 페이지를 빠르게 찾는다.', '원본 문서가 바뀌면 색인도 갱신해야 최신 결과를 보장한다.', ['hash-map', 'graph-traversal']),
    'lexicographical-order': ('문자열을 앞 글자부터 비교해 정하는 사전식 순서', '사전에서 단어를 첫 글자부터 비교해 놓는 순서다.', '공통 접두사는 건너뛰고 처음 다른 문자에서 비교한다. 문자 인코딩과 locale 규칙에 따라 사람이 기대하는 순서와 달라질 수 있다.', '파일명과 사용자 이름을 일관되게 정렬할 때 쓰인다.', '숫자 문자열은 숫자 크기 순서가 아니라 문자 순서로 비교된다.', ['sorting-algorithm', 'stable-custom-comparator']),
    'load-factor': ('해시 테이블의 저장 항목 수를 버킷 수로 나눈 비율', '서랍 수에 비해 물건이 얼마나 찼는지 나타내는 수치다.', 'load factor가 커질수록 한 버킷의 평균 항목 수와 충돌 비용이 증가한다. 임계값을 넘으면 보통 버킷을 늘리고 재해싱한다.', '캐시용 해시맵의 성능 저하 원인을 판단할 때 본다.', '낮다고 항상 좋은 것은 아니며, 너무 낮으면 메모리를 낭비한다.', ['hash-map', 'hash-bucket']),
    'o-constant-time': ('입력 크기와 무관하게 일정한 단계 수로 끝나는 시간 복잡도 O(1)', '데이터가 많아져도 한 번의 주소 계산처럼 처리량이 거의 늘지 않는 경우다.', '상수 시간은 실제 시간이 동일하다는 뜻이 아니라 n에 따라 증가하지 않는다는 점근 표기다.', '배열 인덱스 접근이나 평균적인 해시맵 조회가 대표적이다.', '해시맵 조회는 충돌이 심하면 최악 O(n)이 될 수 있다.', ['hash-map', 'amortized-complexity']),
    'separate-chaining': ('같은 해시 버킷의 여러 항목을 연결 구조에 저장하는 충돌 해결법', '한 서랍에 물건이 겹치면 서랍 안에 작은 목록을 이어 두는 방식이다.', '각 버킷에 연결 리스트나 동적 배열을 두고, 같은 해시 값의 키를 그 안에서 비교한다.', '충돌을 허용하면서 해시맵에 키-값 쌍을 저장한다.', '버킷 하나가 길어지면 탐색 성능이 선형으로 나빠진다.', ['collision', 'hash-bucket']),
    'shortest-path': ('그래프에서 출발점과 도착점 사이 비용 합이 최소인 경로', '여러 길 중 거리·시간·비용이 가장 적은 길을 고르는 문제다.', '가중치가 음수가 아니면 우선순위 큐를 쓰는 Dijkstra 알고리즘이 흔하다. 비용 기준은 간선 가중치로 명확히 정의해야 한다.', '배달 경로, 네트워크 라우팅, 의존성 비용 분석에 적용한다.', '간선 수가 가장 적은 경로와 비용이 가장 작은 경로는 다를 수 있다.', ['min-heap', 'graph-traversal']),
    'topological-order': ('DAG의 모든 간선이 앞에서 뒤로 향하도록 나열한 정점 순서', '선행 작업을 먼저 두고 후속 작업을 뒤에 세운 실행 목록이다.', 'u→v가 있으면 u는 반드시 v보다 앞선다. 하나의 DAG에도 여러 위상 순서가 존재할 수 있다.', '패키지 설치나 빌드 작업의 안전한 실행 순서를 만든다.', '순환 의존성이 있으면 가능한 위상 순서는 없다.', ['directed-acyclic-graph', 'topological-sort']),
    'binary-search-tree': ('왼쪽에는 작은 키, 오른쪽에는 큰 키를 두는 이진 탐색 트리', '숫자 기준으로 작은 것은 왼쪽, 큰 것은 오른쪽으로 갈라 놓은 나무다.', '각 노드의 왼쪽 부분 트리는 더 작은 키, 오른쪽 부분 트리는 더 큰 키를 가진다. 균형이 유지되면 탐색·삽입·삭제는 O(log n)이다.', '정렬된 순서로 범위 검색을 지원해야 할 때 사용한다.', '한쪽으로만 기울면 연결 리스트처럼 O(n)이 된다.', ['sorting-algorithm', 'min-heap']),
    'deque': ('양쪽 끝에서 삽입과 삭제를 할 수 있는 double-ended queue', '앞문과 뒷문이 모두 열린 줄이다.', 'push/pop을 양 끝에서 지원하며 원형 버퍼나 이중 연결 리스트로 구현한다.', 'BFS의 방문 대기열이나 최근 작업 목록에 알맞다.', '가운데 원소를 자주 삽입·삭제해야 한다면 다른 구조가 더 적합할 수 있다.', ['bfs', 'doubly-linked-list']),
    'amortized-complexity': ('여러 연산의 평균 비용으로 한 연산의 장기 비용을 평가하는 방법', '가끔 비싼 일이 있어도 긴 작업 묶음 전체로 나누면 싸게 끝나는지 보는 관점이다.', '동적 배열 확장은 한 번에 O(n)이지만, 용량을 배로 늘리면 append들의 amortized 비용은 O(1)이다.', '반복 삽입 코드가 실제로 허용할 성능인지 판단할 때 쓴다.', '확률적 평균과 달리 입력 분포가 아니라 연산열 전체에 대한 보장이다.', ['o-constant-time', 'deque']),
    'bfs': ('가까운 정점부터 너비 우선으로 그래프를 탐색하는 알고리즘', '시작점 주변을 한 겹씩 넓혀 가며 찾는 탐색이다.', '큐에 다음 방문 후보를 넣고, 꺼낸 정점의 미방문 이웃을 추가한다. 무가중 그래프에서는 최단 간선 수를 구한다.', '친구 관계에서 두 사람 사이의 최소 연결 단계를 찾는다.', '가중치가 서로 다르면 BFS 결과가 최소 비용 경로라는 보장은 없다.', ['graph-traversal', 'deque']),
    'cache-eviction': ('캐시 공간이 부족할 때 어떤 항목을 제거할지 정하는 과정', '새 물건을 넣을 자리를 만들기 위해 무엇을 꺼낼지 정하는 규칙이다.', 'LRU, LFU, FIFO처럼 접근 이력이나 빈도를 기준으로 교체한다. 정책은 hit rate와 관리 비용 사이의 선택이다.', '메모리 캐시가 용량 제한에 도달했을 때 실행된다.', '삭제된 항목은 필요하면 원본 저장소에서 다시 읽어야 한다.', ['least-recently-used', 'hash-map']),
    'collision': ('서로 다른 키가 같은 해시 값 또는 버킷에 배정되는 현상', '다른 이름표 두 개가 같은 서랍 번호를 받는 일이다.', '해시 공간은 유한하므로 충돌은 피할 수 없다. 체이닝이나 open addressing으로 키를 다시 비교해 구분한다.', '해시맵 조회 결과가 잘못 섞이지 않도록 충돌 처리를 구현한다.', '충돌은 해시 함수가 고장 났다는 뜻이 아니라 설계상 예상되는 상황이다.', ['hash-function', 'separate-chaining']),
    'cycle': ('그래프를 따라가 다시 출발 정점으로 돌아오는 경로', '화살표를 계속 따라가면 원래 자리로 돌아오는 고리다.', '의존성 그래프의 cycle은 선후 순서를 모순되게 만들 수 있다. 방문 상태를 색으로 구분하면 DFS 중 순환을 탐지할 수 있다.', '모듈 A가 B를, B가 다시 A를 요구하는 의존성 오류를 찾는다.', '모든 그래프의 cycle이 오류는 아니지만, DAG가 필요한 문제에서는 금지된다.', ['directed-acyclic-graph', 'dfs']),
    'dfs': ('한 경로를 끝까지 내려간 뒤 되돌아오는 깊이 우선 탐색', '갈림길에서 하나를 끝까지 파고든 뒤 막히면 되돌아오는 방식이다.', '재귀 호출이나 명시적 스택으로 구현한다. 탐색 중 상태를 기록하면 cycle 탐지와 연결 요소 탐색에 쓸 수 있다.', '폴더 트리나 의존성 그래프를 깊게 탐색한다.', '재귀 깊이가 매우 크면 호출 스택 제한에 걸릴 수 있다.', ['graph-traversal', 'cycle']),
    'directed-graph': ('간선에 출발점과 도착점의 방향이 있는 그래프', 'A가 B를 가리켜도 B가 A를 가리킨다는 뜻은 아닌 관계 지도다.', '간선 (u, v)와 (v, u)는 별개다. 팔로우, 호출, 의존성처럼 비대칭 관계를 표현한다.', '서비스 호출 흐름이나 과목 선수 조건을 모델링한다.', '방향을 무시하면 도달 가능성과 순환 분석 결과가 달라진다.', ['directed-acyclic-graph', 'graph-traversal']),
    'hash-function': ('임의 길이의 키를 일정 범위의 해시 값으로 바꾸는 함수', '긴 이름표를 서랍 번호로 바꾸는 계산 규칙이다.', '좋은 해시 함수는 입력을 버킷에 고르게 퍼뜨리고 계산 비용이 낮다. 자료구조용 해시는 암호학적 해시와 목적이 다르다.', '문자열 키를 해시맵의 인덱스로 바꾼다.', '해시 값이 같아도 원래 키가 같다는 뜻은 아니다.', ['hash-map', 'collision']),
    'heap-property': ('부모와 자식 사이의 우선순위를 보장하는 힙의 불변 조건', '나무의 각 부모가 자식보다 먼저 처리될 조건을 지키는 규칙이다.', '최소 힙에서는 부모 키가 자식 키 이하이고, 최대 힙에서는 반대다. 삽입·삭제 뒤에는 sift-up 또는 sift-down으로 복구한다.', '우선순위 큐가 항상 가장 작은 작업을 꺼내게 한다.', '형제 노드끼리의 순서는 힙 속성이 보장하지 않는다.', ['min-heap', 'top-n']),
    'topological-sort': ('DAG의 정점을 위상 순서로 만드는 알고리즘', '선행 조건을 모두 지킨 작업 목록을 만드는 절차다.', '진입 차수가 0인 정점을 차례로 제거하는 Kahn 알고리즘이나 DFS 후위 순회를 사용한다. 결과 수가 정점 수보다 적으면 cycle이 있다.', '빌드 시스템에서 의존 모듈을 먼저 처리한다.', '정렬 결과가 하나뿐이라고 가정하면 안 된다.', ['topological-order', 'cycle']),
    'top-n': ('정렬 또는 선택 결과에서 상위 N개만 취하는 작업', '전체 순위 중 앞의 몇 개만 뽑는 일이다.', '전체 정렬 뒤 앞 N개를 자르거나, 크기 N의 힙으로 후보를 유지해 처리할 수 있다.', '점수 상위 10명이나 최근 오류 상위 5개를 보여 준다.', 'N의 기준과 동점 처리 규칙을 정하지 않으면 결과가 흔들린다.', ['sorting-algorithm', 'min-heap']),
    'stable-custom-comparator': ('동점의 기존 순서를 지키는 안정 정렬과 사용자 정의 비교 규칙', '같은 점수의 사람 순서는 그대로 두고, 정렬 기준도 직접 정하는 방법이다.', 'comparator는 두 값의 순서를 일관되게 반환해야 한다. stable sort는 비교상 같은 값의 입력 순서를 보존한다.', '이름 오름차순, 점수 내림차순 같은 다중 기준 정렬을 작성한다.', '비교 규칙이 비대칭·비추이적이면 정렬 결과를 신뢰할 수 없다.', ['sorting-algorithm', 'lexicographical-order']),
    'user-input': ('프로그램이 표준 입력 등으로 외부에서 받는 값', '사용자가 키보드나 파이프로 프로그램에 건네는 데이터다.', '입력은 문자열로 들어오는 경우가 많으므로 형식·범위·누락을 검증한 뒤 목적 타입으로 변환한다.', '명령줄에서 정수 N과 목록을 읽어 알고리즘에 전달한다.', '입력을 신뢰하면 잘못된 값이나 악의적 데이터가 로직을 깨뜨릴 수 있다.', ['stdin-stdout', 'input-validation']),
    'before-after-experiment': ('변경 전후의 결과를 같은 기준으로 비교하는 실험', '수정하기 전과 후를 나란히 재서 변화가 있었는지 보는 방법이다.', '입력·측정 지표·환경을 통제해야 원인을 변경에 연결할 수 있다. 한 번의 수치만으로 인과를 확정하지 않는다.', '캐시 도입 전후의 응답 시간과 hit rate를 비교한다.', '동시에 여러 조건이 바뀌면 before/after만으로 효과를 분리하기 어렵다.', ['benchmark', 'cache-eviction']),
    'business-logic': ('제품의 업무 규칙과 의사결정을 구현한 코드', '버튼을 누를 때 무엇을 허용하고 계산할지 정한 핵심 규칙이다.', 'HTTP 처리나 DB 접근과 분리하면 테스트와 변경이 쉬워진다. 예: 주문 총액 계산, 권한 확인, 상태 전이 규칙.', '서비스 함수에서 할인 조건과 주문 상태 변경을 처리한다.', '화면 코드나 저장소 코드에 규칙을 흩뿌리면 규칙이 서로 달라질 수 있다.', ['repository-pattern', 'mvc']),
    'context-manager': ('블록의 시작과 끝에서 자원 획득·정리를 보장하는 Python 프로토콜', '문을 열고 일을 한 뒤 예외가 나도 문을 닫아 주는 장치다.', '`with` 문은 `__enter__` 뒤 본문을 실행하고, 종료 시 `__exit__`를 호출한다. 파일·락·DB 연결 정리에 알맞다.', '`with open(path) as f:`로 파일을 읽으면 사용 뒤 자동으로 닫힌다.', 'with를 썼다고 트랜잭션 commit 정책까지 자동으로 맞는 것은 아니다.', ['resource-cleanup', 'exception-handling']),
    'ieee-754': ('컴퓨터가 부동소수점 수를 저장하고 계산하는 표준', '소수를 제한된 비트로 근사해 담는 약속이다.', '부호·지수·가수로 값을 표현하므로 0.1 같은 10진 소수를 정확히 나타내지 못할 수 있다. NaN과 infinity도 정의한다.', '금액 외의 측정값을 비교할 때 허용 오차 epsilon을 둔다.', '두 float를 `==`로 비교하는 것이 항상 안전하지 않다.', ['floating-point', 'epsilon']),
    'init': ('객체가 만들어질 때 초기 상태를 설정하는 생성자', '새 물건을 만들면서 필요한 속성을 처음 채우는 함수다.', 'Python의 `__init__`은 인스턴스 생성 뒤 호출되어 필드와 불변 조건을 설정한다.', '`User(name)`에서 name을 검증해 `self.name`에 저장한다.', '`__init__`은 객체 자체를 만드는 `__new__`와 역할이 다르다.', ['class', 'object-instance']),
    'interpreter': ('소스 코드를 실행 가능한 동작으로 해석하는 프로그램', '작성한 문장을 읽어 한 단계씩 실행 의미를 정하는 실행기다.', '인터프리터는 파싱·바이트코드 실행·런타임 관리를 수행할 수 있다. 구현에 따라 JIT 컴파일을 함께 쓰기도 한다.', 'Python 파일을 실행할 때 Python 인터프리터가 코드를 처리한다.', '인터프리터 언어라도 매번 한 줄씩만 읽는다는 뜻은 아니다.', ['python']),
    'iterator': ('컬렉션의 요소를 차례로 꺼내는 순회 인터페이스', '상자를 통째로 꺼내지 않고 다음 물건을 하나씩 요청하는 손잡이다.', 'Python iterator는 `__next__`로 다음 값을 내고 끝에서 `StopIteration`을 발생시킨다. for문이 이를 소비한다.', '큰 파일을 한 줄씩 읽어 메모리를 아낀다.', 'iterator는 한 번 소진되면 보통 처음부터 다시 돌 수 없다.', ['generator', 'list-dict']),
    'list-dict': ('순서 있는 리스트와 키로 찾는 딕셔너리의 선택 기준', '목록은 위치로, 딕셔너리는 이름표로 값을 찾는다.', 'list는 순서·중복을 보존하고 index 접근이 빠르다. dict는 키-값 매핑을 평균 O(1)에 조회한다.', '할 일 순서는 list, 사용자 ID별 프로필은 dict로 저장한다.', '순서가 필요하다는 이유만으로 모든 데이터를 list로 찾으면 탐색 비용이 커진다.', ['hash-map', 'iterator']),
    'locality': ('가까운 메모리나 최근 데이터에 다시 접근하기 쉬운 성질', '방금 쓴 서랍이나 그 옆 서랍을 다시 쓰면 더 빨리 꺼낼 가능성이 높다.', '시간 지역성은 최근 사용 데이터를, 공간 지역성은 인접 데이터를 다시 쓰는 경향이다. CPU cache가 이를 이용한다.', '배열을 연속 순회하면 포인터를 따라 흩어진 구조보다 cache 친화적일 수 있다.', '알고리즘 복잡도가 같아도 지역성 차이로 실제 속도는 달라질 수 있다.', ['cache', 'memory-accounting']),
    'memory-accounting': ('프로세스나 구성 요소별 메모리 사용량을 측정·분류하는 일', '누가 메모리를 얼마나 쓰는지 장부처럼 기록하는 작업이다.', 'heap, stack, cache, shared memory 등의 사용량을 구분해야 누수와 정상 cache 증가를 구별할 수 있다.', '컨테이너의 메모리 제한 초과 원인을 프로세스별로 조사한다.', 'RSS 하나만으로 실제 회수 가능한 메모리까지 모두 설명할 수는 없다.', ['system-monitoring', 'memory-leak']),
    'mvc': ('Model·View·Controller로 화면과 상태, 입력 처리를 나누는 구조', '데이터, 화면, 사용자 요청의 책임을 나눠 정리하는 방식이다.', 'Model은 도메인 상태, View는 표현, Controller는 입력을 받아 흐름을 조정한다. 웹 프레임워크마다 경계는 조금씩 다르다.', '폼 요청을 controller가 받고 model을 바꾼 뒤 view를 렌더링한다.', 'MVC는 파일 개수 규칙이 아니라 책임 분리 원칙이다.', ['business-logic', 'repository-pattern']),
    'observability': ('외부에서 시스템의 내부 상태를 추론할 수 있는 성질과 도구 체계', '문제가 난 뒤 시스템 안에서 무슨 일이 있었는지 로그·지표·추적으로 알아낼 수 있는 능력이다.', 'logs, metrics, traces를 상관관계 ID와 함께 수집해 원인 후보를 좁힌다. 단순 모니터링보다 “왜”를 추론하는 데 초점이 있다.', '느린 요청의 trace를 따라 어느 서비스와 DB 호출이 병목인지 찾는다.', '데이터를 많이 모으는 것만으로 관측 가능성이 생기지는 않으며 질문 가능한 구조가 필요하다.', ['system-monitoring', 'logging']),
    'repository-pattern': ('도메인 코드가 저장 방식 대신 컬렉션 같은 인터페이스에 의존하게 하는 패턴', '업무 규칙이 DB 문법을 직접 알지 않아도 데이터를 꺼내게 하는 중간 창구다.', 'repository는 조회·저장 경계를 감싸고 구현을 교체 가능하게 한다. 도메인 규칙과 영속성 세부 사항을 분리한다.', '테스트에서는 메모리 repository로 주문 규칙을 검증할 수 있다.', '단순 CRUD에 무조건 계층을 늘리면 코드만 복잡해질 수 있다.', ['business-logic', 'mvc']),
    'stdin-stdout': ('프로세스의 표준 입력과 표준 출력 스트림', '프로그램이 기본으로 받는 통로와 내보내는 통로다.', 'stdin은 입력을, stdout은 정상 결과를 전달한다. shell pipe와 redirection은 이 스트림을 다른 프로그램·파일에 연결한다.', '`cat data.txt | program > result.txt`처럼 도구를 조합한다.', '오류 메시지는 보통 stdout이 아니라 stderr로 보내야 결과 파이프를 오염시키지 않는다.', ['user-input', 'terminal']),
    'system-monitoring': ('시스템 자원과 서비스 상태를 지속적으로 측정하는 운영 활동', 'CPU·메모리·응답 시간·오류율이 평소와 다른지 살피는 일이다.', '지표 수집, 대시보드, 임계값 경보를 통해 이상을 감지한다. 관측 데이터는 배포·트래픽 변화와 함께 해석해야 한다.', 'CPU 사용률 급등과 5xx 오류 증가에 경보를 설정한다.', '경보가 많으면 중요한 장애가 묻히므로 행동 가능한 기준이 필요하다.', ['observability', 'memory-accounting']),
    'typescript': ('JavaScript에 정적 타입 검사를 더한 프로그래밍 언어', '실행 전에 값의 모양이 맞는지 더 많이 확인해 주는 JavaScript다.', 'TypeScript는 컴파일 시 타입 오류를 찾고 JavaScript로 변환된다. 타입 정보는 기본적으로 런타임에 남지 않는다.', 'API 응답 인터페이스를 선언해 잘못된 속성 접근을 일찍 발견한다.', '타입 검사가 서버 응답 자체를 검증하거나 런타임 오류를 모두 막지는 않는다.', ['javascript']),
}

def section(title, body):
    return f'## {title}\n\n{body}'

def render(term_id, term, item, index):
    summary, plain, detail, use, boundary, related = DATA[term_id]
    title = term['term_ko']
    tier = item['tier']
    parts = [f'# {title}', section('한 줄 설명', summary + '.'), section('쉽게 설명하면', plain), section('정확한 설명', detail)]
    if tier == 'A':
        labels = [('작동 흐름', '입력 → 자료구조/규칙 적용 → 결과를 만드는 과정을 작은 사례로 따라가 보는 것이 이해에 가장 빠르다.'), ('구조와 선택', '문제의 관계·순서·비용을 먼저 정의하고, 그 조건에 맞는 자료구조와 알고리즘을 선택한다.'), ('실행 관점', '정확성뿐 아니라 데이터 크기, 메모리, 갱신 빈도, 실패 조건을 함께 고려해야 한다.')]
        heading, extra = labels[index % len(labels)]
        parts.append(section(heading, extra))
        parts.append(section('사용 장면', use))
        parts.append(section('경계와 오해', boundary))
        parts.append(section('동료평가 질문', f'이 문제에서 `{title}`을 선택한 근거와, 입력 조건이 바뀌면 어떤 대안을 검토할지 설명해 보세요.'))
    elif tier == 'B':
        labels = ['대표 사용', '판단 기준', '작은 사례']
        parts.append(section(labels[index % len(labels)], use))
        parts.append(section('주의할 점', boundary))
    else:
        parts.append(section('언제 쓰나', use))
        parts.append(section('기억할 경계', boundary))
    parts.append(section('이 미션에서는 왜 필요한가', '구현·검토·문제 해결에서 자료의 형태와 처리 순서를 분명히 설명하는 기준으로 사용합니다.'))
    if related:
        parts.append(section('관련 용어', '\n'.join(f'- `{value}`' for value in related)))
    return '\n\n'.join(parts) + '\n'

def main():
    plan_path = ROOT / 'data/reviews/content-tier-sprint7.json'
    plan = json.loads(plan_path.read_text(encoding='utf-8'))
    batch = next(value for value in plan['implementation_batches'] if value['id'] == 'S7-B08')
    items = {value['term_id']: value for value in plan['items']}
    master_path = ROOT / 'data/curated/glossary-master-v0.1.yaml'
    master = json.loads(master_path.read_text(encoding='utf-8'))
    terms = {value['id']: value for value in master['terms']}
    assert len(batch['term_ids']) == 46 and set(batch['term_ids']) == set(DATA)
    for index, term_id in enumerate(batch['term_ids']):
        (ROOT / 'content/terms' / f'{term_id}.md').write_text(render(term_id, terms[term_id], items[term_id], index), encoding='utf-8')
        terms[term_id]['content_status'] = 'drafted'
    master_path.write_text(json.dumps(master, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print('Wrote 46 S7-B08 term files.')

if __name__ == '__main__':
    main()
