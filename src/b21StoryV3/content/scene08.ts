// Screen copy of the approved v3.7 preview; storyboard remains the source.
import type { TeachingScene } from './types';

export const scene08: TeachingScene = {
  "id": "08",
  "title": "한눈에 연결하기: 핵심 개념지도",
  "question": "지금까지 배운 개념은 한 프로그램 안에서 어떤 관계로 연결될까?",
  "ctx": "Scene 08",
  "tag": "개념지도 · 복습",
  "addressing": "number",
  "home": "map",
  "steps": [
    {
      "id": "map",
      "mode": "areas",
      "sel": null,
      "home": "map",
      "say": "지금까지 배운 개념은 일곱 영역으로 다시 묶어 볼 수 있습니다.",
      "title": "일곱 영역",
      "figure": "s8",
      "example": "review",
      "instructor": {
        "script": [
          "“일곱 장면을 지나왔습니다. 오늘 배운 개념을 일곱 영역으로 다시 묶어 보면 이렇습니다. 지금은 선이 하나도 없죠. 하나씩 떠올려 보고, 그다음에 어떤 관계로 이어지는지 볼게요.”"
        ]
      }
    },
    {
      "id": "t-exec",
      "mode": "areas",
      "sel": 0,
      "home": "map",
      "say": "명령 한 줄로 프로그램에 일을 부탁하고, 프로그램은 정해 둔 규칙대로 알아듣습니다.",
      "title": "실행과 CLI",
      "figure": "s8",
      "example": "review",
      "instructor": {
        "script": [
          "“(영역을 가리키며) 이 영역에서 기억나는 말이 뭐가 있나요?” (학습자 답을 들은 뒤 화면 문장을 읽는다.) “더 보고 싶으면 옆의 ‘복습’ 버튼으로 그 장면에 다녀올 수 있어요. 위의 ‘개념지도로 돌아가기’를 누르면 다시 여기로 옵니다.”"
        ]
      },
      "review": [
        {
          "scene": "01",
          "step": "3"
        }
      ]
    },
    {
      "id": "t-struct",
      "mode": "areas",
      "sel": 1,
      "home": "map",
      "say": "프로그램의 일을 역할로 나누고, 코드를 모듈과 패키지로 묶어 함께 씁니다.",
      "title": "모듈과 패키지·역할 분리",
      "figure": "s8",
      "example": "review",
      "instructor": {
        "script": [
          "“(영역을 가리키며) 이 영역에서 기억나는 말이 뭐가 있나요?” (학습자 답을 들은 뒤 화면 문장을 읽는다.) “더 보고 싶으면 옆의 ‘복습’ 버튼으로 그 장면에 다녀올 수 있어요. 위의 ‘개념지도로 돌아가기’를 누르면 다시 여기로 옵니다.”"
        ]
      },
      "review": [
        {
          "scene": "02",
          "step": "2"
        }
      ]
    },
    {
      "id": "t-crud",
      "mode": "areas",
      "sel": 2,
      "home": "map",
      "say": "기록을 바꾸는 일, 고르는 일, 계산하는 일을 구분합니다.",
      "title": "CRUD·검색·요약",
      "figure": "s8",
      "example": "review",
      "instructor": {
        "script": [
          "“(영역을 가리키며) 이 영역에서 기억나는 말이 뭐가 있나요?” (학습자 답을 들은 뒤 화면 문장을 읽는다.) “더 보고 싶으면 옆의 ‘복습’ 버튼으로 그 장면에 다녀올 수 있어요. 위의 ‘개념지도로 돌아가기’를 누르면 다시 여기로 옵니다.”"
        ]
      },
      "review": [
        {
          "scene": "03",
          "step": "1"
        }
      ]
    },
    {
      "id": "t-store",
      "mode": "areas",
      "sel": 3,
      "home": "map",
      "say": "실행 중 기록은 메모리에 있고, 남기려면 파일에 저장하며, 형식은 그 모양을 정합니다.",
      "title": "메모리·파일·저장 형식",
      "figure": "s8",
      "example": "review",
      "instructor": {
        "script": [
          "“(영역을 가리키며) 이 영역에서 기억나는 말이 뭐가 있나요?” (학습자 답을 들은 뒤 화면 문장을 읽는다.) “더 보고 싶으면 옆의 ‘복습’ 버튼으로 그 장면에 다녀올 수 있어요. 위의 ‘개념지도로 돌아가기’를 누르면 다시 여기로 옵니다.”"
        ]
      },
      "review": [
        {
          "scene": "04",
          "step": "1"
        }
      ]
    },
    {
      "id": "t-gen",
      "mode": "areas",
      "sel": 4,
      "home": "map",
      "say": "Iterable에서 얻은 Iterator가 값을 하나씩 꺼내 주고, Generator는 그 한 종류로서 필요할 때 값을 만들어 건넵니다.",
      "title": "Iterator·Generator",
      "figure": "s8",
      "example": "review",
      "instructor": {
        "script": [
          "“(영역을 가리키며) 이 영역에서 기억나는 말이 뭐가 있나요?” (학습자 답을 들은 뒤 화면 문장을 읽는다.) “더 보고 싶으면 옆의 ‘복습’ 버튼으로 그 장면에 다녀올 수 있어요. 위의 ‘개념지도로 돌아가기’를 누르면 다시 여기로 옵니다.”"
        ]
      },
      "review": [
        {
          "scene": "05",
          "step": "iterable"
        }
      ]
    },
    {
      "id": "t-deco",
      "mode": "areas",
      "sel": 5,
      "home": "map",
      "say": "원래 기능을 감싸 정해 둔 공통 처리를 덧붙입니다.",
      "title": "Decorator",
      "figure": "s8",
      "example": "review",
      "instructor": {
        "script": [
          "“(영역을 가리키며) 이 영역에서 기억나는 말이 뭐가 있나요?” (학습자 답을 들은 뒤 화면 문장을 읽는다.) “더 보고 싶으면 옆의 ‘복습’ 버튼으로 그 장면에 다녀올 수 있어요. 위의 ‘개념지도로 돌아가기’를 누르면 다시 여기로 옵니다.”"
        ]
      },
      "review": [
        {
          "scene": "06",
          "step": "deco"
        }
      ]
    },
    {
      "id": "t-valid",
      "mode": "areas",
      "sel": 6,
      "home": "map",
      "say": "기대하는 형은 표시하고, 실제 값은 변환하고 검증합니다.",
      "title": "Type Hint·검증",
      "figure": "s8",
      "example": "review",
      "instructor": {
        "script": [
          "“(영역을 가리키며) 이 영역에서 기억나는 말이 뭐가 있나요?” (학습자 답을 들은 뒤 화면 문장을 읽는다.) “더 보고 싶으면 옆의 ‘복습’ 버튼으로 그 장면에 다녀올 수 있어요. 위의 ‘개념지도로 돌아가기’를 누르면 다시 여기로 옵니다.”"
        ]
      },
      "review": [
        {
          "scene": "07",
          "step": "1"
        }
      ]
    },
    {
      "id": "types",
      "mode": "types",
      "home": "types",
      "say": "개념지도의 선은 실행 순서가 아니라 포함·종류·사용·역할 같은 개념 사이의 관계를 나타냅니다.",
      "title": "관계 읽는 법",
      "figure": "s8",
      "example": "review",
      "instructor": {
        "script": [
          "“이제 선을 그어 봅시다. 그런데 개념지도의 선은 ‘무엇이 먼저 실행되느냐’를 뜻하지 않습니다. 개념과 개념 사이의 관계예요. 네 가지만 기억하면 됩니다. 포함, 종류, 사용, 역할. 예는 모두 앞에서 본 것들입니다. 종류 카드를 보세요. Scene 05에서 Generator 객체는 Iterator의 한 종류이고, Iterator는 Iterable이기도 하다고 했죠. 둘 다 종류 관계입니다.”"
        ]
      }
    },
    {
      "id": "R09",
      "mode": "rel",
      "rel": "R09",
      "home": "types",
      "say": "패키지는 모듈을 포함합니다. 이 선은 포함 관계이지 실행 순서가 아닙니다.",
      "title": "포함 · 패키지와 모듈",
      "figure": "s8",
      "example": "review",
      "instructor": {
        "script": [
          "“Scene 02에서 todo라는 폴더가 네 파일을 묶었죠. 패키지가 모듈을 포함하는 관계입니다. 패키지가 먼저 실행되고 모듈이 나중에 실행된다는 뜻이 아니에요.”"
        ]
      },
      "review": [
        {
          "scene": "02",
          "step": "12"
        }
      ]
    },
    {
      "id": "R37",
      "mode": "rel",
      "rel": "R37",
      "home": "types",
      "say": "영구 저장은 파일 입출력을 사용합니다. 파일에 써 두고 다음 실행에서 다시 읽기 때문입니다.",
      "title": "사용 · 영구 저장과 파일 입출력",
      "figure": "s8",
      "example": "review",
      "instructor": {
        "script": [
          "“Scene 04에서 프로그램을 끝내도 기록이 남으려면 파일에 저장해야 했죠. 영구 저장은 파일에 쓰고, 다음에 실행할 때 파일에서 다시 읽습니다. 그래서 영구 저장이 파일 입출력을 ‘사용’하는 관계예요.”"
        ]
      },
      "review": [
        {
          "scene": "04",
          "step": "4"
        }
      ]
    },
    {
      "id": "R28",
      "mode": "rel",
      "rel": "R28",
      "home": "types",
      "say": "Type Hint는 입출력 계약을 표시하는 역할을 하며, 실행 중에 값을 강제하지는 않습니다.",
      "title": "역할 · Type Hint",
      "figure": "s8",
      "example": "review",
      "instructor": {
        "script": [
          "“Scene 07의 Type Hint는 어떤 역할이었죠? 받을 값과 돌려줄 값의 기대 형식을 알리는 역할입니다. 그리고 선 위에 쓰인 대로, 실행 중에 강제하지는 않아요.”"
        ]
      },
      "review": [
        {
          "scene": "07",
          "step": "1"
        }
      ]
    },
    {
      "id": "C30",
      "mode": "cmp",
      "cmp": "C30",
      "home": "C30",
      "say": "JSONL은 저장 형식이고 Generator는 값을 하나씩 내는 실행 방식이며, 둘 다 메모리 절약을 스스로 보장하지 않습니다.",
      "title": "비교 · JSONL vs Generator",
      "figure": "s8",
      "example": "review",
      "instructor": {
        "script": [
          "“이 둘은 자주 섞입니다. JSONL은 파일에 적는 모양, 곧 저장 형식이고, Generator는 값을 하나씩 내는 실행 방식이에요. 둘 다 그것만으로 메모리를 아껴 준다고 보장하지 않습니다. Scene 05에서 본 것처럼 받은 값을 어떻게 보관하느냐가 중요했죠.”"
        ]
      },
      "review": [
        {
          "scene": "04",
          "step": "6"
        },
        {
          "scene": "05",
          "step": "jsonl"
        }
      ]
    },
    {
      "id": "C13",
      "mode": "cmp",
      "cmp": "C13",
      "home": "C13",
      "say": "Type Hint는 기대하는 형을 표시하고, 값 검증은 실제 값을 검사합니다.",
      "title": "비교 · Type Hint vs 값 검증",
      "figure": "s8",
      "example": "review",
      "instructor": {
        "script": [
          "“Type Hint는 기대를 표시하고, 값 검증은 실제로 검사합니다. 검사하려면 검사 코드가 있어야 하죠.”"
        ]
      },
      "review": [
        {
          "scene": "07",
          "step": "4"
        }
      ]
    },
    {
      "id": "check",
      "kind": "check",
      "say": "설명을 모두 마쳤습니다. 답을 보기 전에 먼저 말로 답해 봅시다.",
      "title": "이해 확인",
      "figure": "check",
      "example": "review",
      "questions": [
        {
          "kind": "기본 · 지도 읽기",
          "q": "개념지도의 선은 실행 순서를 나타내나요?"
        },
        {
          "kind": "기본 · 포함",
          "q": "패키지와 모듈은 어떤 관계인가요?"
        },
        {
          "kind": "기본 · 비교",
          "q": "JSONL로 저장하고 Generator로 읽기만 하면 메모리가 저절로 절약될까요?"
        },
        {
          "kind": "기본 · 비교",
          "q": "Type Hint와 값 검증 중 실제 값을 검사하는 것은 무엇인가요?"
        },
        {
          "kind": "기본 · 종류",
          "q": "Generator 객체, Iterator, Iterable은 어떤 관계인가요?"
        }
      ],
      "reveal": {
        "answers": [
          "아니요. 개념 사이의 관계(포함·종류·사용·역할)를 나타냅니다.",
          "포함 — 패키지가 모듈을 묶습니다(R09).",
          "아니요. 둘 다 스스로 보장하지 않고, 받은 값을 어떻게 보관하는지가 중요합니다(C30).",
          "값 검증 (C13)",
          "Generator 객체는 Iterator의 한 종류이고(R23), Iterator는 Iterable이기도 합니다(R41). 하지만 리스트처럼 모든 Iterable이 Iterator인 것은 아닙니다."
        ]
      },
      "instructor": {
        "expected": [
          {
            "q": "개념지도의 선은 실행 순서를 나타내나요?",
            "a": "아니요. 개념 사이의 관계(포함·종류·사용·역할)를 나타냅니다.",
            "miss": "“선을 따라 실행된다” → 단계 9·10의 ‘실행 순서가 아닙니다’"
          },
          {
            "q": "패키지와 모듈은 어떤 관계인가요?",
            "a": "포함 — 패키지가 모듈을 묶습니다(R09).",
            "miss": "“패키지가 모듈을 호출한다” → 포함과 호출(실행)을 구분"
          },
          {
            "q": "JSONL로 저장하고 Generator로 읽기만 하면 메모리가 저절로 절약될까요?",
            "a": "아니요. 둘 다 스스로 보장하지 않고, 받은 값을 어떻게 보관하는지가 중요합니다(C30).",
            "miss": "“둘 다 쓰면 절약된다” → Scene 05 F6(보관 방식)으로 복습 이동"
          },
          {
            "q": "Type Hint와 값 검증 중 실제 값을 검사하는 것은 무엇인가요?",
            "a": "값 검증 (C13)",
            "miss": "“Type Hint” → Scene 07 단계 3으로 복습 이동"
          },
          {
            "q": "Generator 객체, Iterator, Iterable은 어떤 관계인가요?",
            "a": "Generator 객체는 Iterator의 한 종류이고(R23), Iterator는 Iterable이기도 합니다(R41). 하지만 리스트처럼 모든 Iterable이 Iterator인 것은 아닙니다.",
            "miss": "“셋 다 같은 것” → Scene 05 단계 7·8로 복습 이동"
          }
        ]
      }
    },
    {
      "id": "apply",
      "mode": "apply",
      "kind": "check",
      "home": "apply",
      "say": "하나의 상황에 필요한 일들을 앞에서 배운 영역과 연결해 봅시다.",
      "title": "적용 · 필요한 일 연결",
      "figure": "s8",
      "example": "review",
      "questions": [
        {
          "kind": "일",
          "q": "파일에 저장하고 다음에 다시 읽기"
        },
        {
          "kind": "일",
          "q": "명령을 받아 알아듣기"
        },
        {
          "kind": "일",
          "q": "금액이 0보다 큰 정수인지 확인하기"
        },
        {
          "kind": "일",
          "q": "기록 추가하기 · 조건으로 검색하기"
        },
        {
          "kind": "일",
          "q": "문제가 생기면 [오류]·[힌트]로 알리기"
        },
        {
          "kind": "일",
          "q": "일을 맡을 부분 나누기"
        },
        {
          "kind": "일",
          "q": "저장된 기록을 하나씩 읽어 처리하기"
        }
      ],
      "reveal": {
        "answers": [
          "메모리·파일·저장 형식",
          "실행과 CLI",
          "Type Hint·검증",
          "CRUD·검색·요약",
          "Decorator",
          "모듈과 패키지·역할 분리",
          "Iterator·Generator"
        ]
      },
      "instructor": {
        "script": [
          "“(상황을 읽고) 이 일을 하려면 어떤 종류의 일들이 필요할까요? 카드를 하나씩 보고, 앞에서 배운 영역 중 어디와 관련 있는지 말해 봅시다. 순서를 맞히는 게 아니라 ‘무슨 일을 누가 맡는지’를 말하는 겁니다.” (답을 들은 뒤 ‘답 보기’) “다른 영역과 연결해도 이유를 설명할 수 있으면 괜찮습니다.”",
          "흔한 오답: ‘하나씩 읽기’를 CRUD로만 답함 → “조회는 CRUD지만, 하나씩 건네받는 방식은 Generator 영역이에요. 둘 다 말해도 좋습니다.” ‘금액 확인’을 Decorator로 답함 → “확인은 검증이 하고, Decorator는 확인에서 난 오류를 알리는 공통 처리였죠.”"
        ],
        "expected": [
          {
            "q": "파일에 저장하고 다음에 다시 읽기",
            "a": "메모리·파일·저장 형식",
            "miss": ""
          },
          {
            "q": "명령을 받아 알아듣기",
            "a": "실행과 CLI",
            "miss": ""
          },
          {
            "q": "금액이 0보다 큰 정수인지 확인하기",
            "a": "Type Hint·검증",
            "miss": ""
          },
          {
            "q": "기록 추가하기 · 조건으로 검색하기",
            "a": "CRUD·검색·요약",
            "miss": ""
          },
          {
            "q": "문제가 생기면 [오류]·[힌트]로 알리기",
            "a": "Decorator",
            "miss": ""
          },
          {
            "q": "일을 맡을 부분 나누기",
            "a": "모듈과 패키지·역할 분리",
            "miss": ""
          },
          {
            "q": "저장된 기록을 하나씩 읽어 처리하기",
            "a": "Iterator·Generator",
            "miss": ""
          }
        ]
      }
    },
    {
      "id": "wrap",
      "mode": "wrap",
      "home": "map",
      "say": "Python 프로그램은 명령을 받고, 역할에 따라 데이터를 다루고 저장하며, 필요한 값을 하나씩 처리하고 검사하는 여러 개념이 함께 작동합니다.",
      "title": "전체 정리",
      "figure": "s8",
      "example": "review",
      "instructor": {
        "script": [
          "“한 문장으로 정리하면, Python 프로그램은 명령을 받고, 역할에 따라 데이터를 다루고 저장하며, 필요한 값을 하나씩 처리하고 검사하는 여러 개념이 함께 작동합니다. 영역을 누르면 언제든 그 장면으로 돌아가 복습할 수 있어요.”"
        ]
      },
      "review": [
        {
          "scene": "01",
          "step": "3"
        },
        {
          "scene": "02",
          "step": "2"
        },
        {
          "scene": "03",
          "step": "1"
        },
        {
          "scene": "04",
          "step": "1"
        },
        {
          "scene": "05",
          "step": "iterable"
        },
        {
          "scene": "06",
          "step": "deco"
        },
        {
          "scene": "07",
          "step": "1"
        }
      ]
    }
  ],
  "instructor": {
    "notes": [
      "<b>실행 순서도가 아니다:</b> 지도의 선은 개념 관계다. 영역의 배치 순서(01~07)는 강의 순서일 뿐 프로그램의 실행 순서가 아니다.",
      "<b>원본 데이터 보존:</b> 관계·비교의 문구는 기존 후보 지도(<code>scene-08/candidate-map.json</code>)의 원본 그대로이며 QA가 일치를 검사한다. 강의용 영역 이름은 원본 영역과 다른 교육용 묶음이다(원고 1절 대응표).",
      "<b>원본에 없는 개념:</b> 검색·요약·CSV·Model 역할·자료형 변환은 원본 후보에 노드가 없다. 영역 설명에는 나오지만 새 관계선을 만들지 않았다.",
      "<b>원본 sceneIds:</b> 원본 노드의 장면 번호는 v2 기준이다. v2의 03a·03b는 v3 Scene 03과 같은 장면이 아니다.",
      "<b>R37의 범위:</b> 원본 scope는 ‘파일 기반 영구 저장 사례’다. 데이터베이스 등 다른 영구 저장 방식으로 일반화하지 않는다.",
      "<b>R28의 범위:</b> 원본 label에 ‘런타임 비강제’가 포함되어 있다. Scene 07과 같은 경계다.",
      "<b>종류 예시 (v3.7):</b> Scene 05에서 Iterable·Iterator를 기본 개념으로 올렸으므로 ‘종류’ 예로 R23(Generator → Iterator, ‘Iterator의 한 종류’)과 R41(Iterator → Iterable, ‘Iterator도 Iterable’)을 쓴다. v3.6에서 쓰던 R20(JSONL → 텍스트 파일 형식)은 원본에 그대로 있으며 강의 화면에서만 빠졌다. R22(Iterable → Iterator, 역할 ‘iter()로 Iterator를 내줌’)는 Scene 05 강사 노트에서 쓴다.",
      "<b>복습 왕복:</b> 복습 버튼은 이 미리보기 안에서 해당 단계로 이동하고, ‘개념지도로 돌아가기’와 브라우저 ‘뒤로’로 떠났던 단계로 돌아온다. 실제 서비스의 용어사전 이동·복귀는 <b>미연결</b>이다.",
      "<b>별도 탐색 자료:</b> 기존 개념지도 탐색 시안(<code>scene-08/concept-map-preview.html</code>)은 45노드·24관계·10비교·강사 경로를 담은 별도 시안으로 그대로 둔다. 그 안의 사전 연결도 ‘미구현’ 상태다."
    ],
    "deep": [
      "관계 더 보기 — R22 Iterable → Iterator(역할 ‘iter()로 Iterator를 내줌’), R20 JSONL → 텍스트 파일 형식(종류)",
      "헷갈리는 쌍 더 보기 — C12 yield vs return, C11 Iterable vs Iterator, C21 메모리 속 변경 vs 영구 저장, C07 import vs 함수 호출",
      "전체 후보 지도 — 45개념·24관계·10비교, 강사 경로 P1~P3: <code>drafts/b2-1-story-map/scene-08/concept-map-preview.html</code> (별도 시안)",
      "관계 유형 ‘호출’ — 원본에는 실행 관계인 ‘호출’(R14·R17·R18·R27)도 있다. 개념 관계와 실행 관계를 구분해 읽는 연습",
      "기존 v2 자료 — Scene 08 v2 원고와 설계 노트"
    ]
  },
  "source": {
    "storyboard": "drafts/b2-1-story-map/v3/scene-08/storyboard.md",
    "sha256": "b4de759c8d64f1515c9b5f047a47bb5ceaa35428d42b4b9969b8c7c05b0bd370"
  }
};
