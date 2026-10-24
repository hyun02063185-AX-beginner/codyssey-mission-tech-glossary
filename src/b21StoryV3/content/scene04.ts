// Screen copy of the approved v3.7 preview; storyboard remains the source.
import type { TeachingScene } from './types';

export const scene04: TeachingScene = {
  "id": "04",
  "title": "기록 남기기: 메모리·파일·JSONL·CSV",
  "question": "프로그램을 종료해도 기록이 남으려면 무엇이 필요할까?",
  "ctx": "Scene 04",
  "tag": "학습용 가상 기록",
  "addressing": "number",
  "home": "mem",
  "steps": [
    {
      "id": "mem",
      "mode": "mf",
      "st": "mem",
      "home": "mem",
      "say": "프로그램이 실행되는 동안 기록은 메모리에 있습니다.",
      "title": "메모리",
      "figure": "s4",
      "example": "fictional-records",
      "instructor": {
        "script": [
          "“앞 장면에서 지하철 기록 #5를 추가했죠. 프로그램이 실행되는 동안 이 기록들은 메모리라는 곳에 있습니다. 메모리는 프로그램이 실행 중에 데이터를 두고 다루는 공간이에요. 그런데 #5는 아직 파일에는 없습니다.”"
        ]
      }
    },
    {
      "id": "file",
      "mode": "mf",
      "st": "file",
      "home": "mem",
      "say": "파일에 저장한 기록은 프로그램을 끝내도 남습니다.",
      "title": "파일 저장",
      "figure": "s4",
      "example": "fictional-records",
      "instructor": {
        "script": [
          "“오른쪽은 파일입니다. 파일에 저장한 기록은 프로그램을 꺼도 남아요. 다음에 프로그램을 켜면 이 파일에서 기록을 다시 읽어 옵니다.”"
        ]
      }
    },
    {
      "id": "exit",
      "mode": "mf",
      "st": "exit",
      "home": "mem",
      "say": "저장하지 않고 프로그램을 끝내면 메모리에만 있던 기록은 남지 않습니다.",
      "title": "저장하지 않고 종료",
      "figure": "s4",
      "example": "fictional-records",
      "instructor": {
        "script": [
          "“지금 저장하지 않고 프로그램을 끝내면 어떻게 될까요?” (답을 들은 뒤) “메모리는 비워지고 파일에 있던 4개만 남습니다. #5는 메모리에만 있었기 때문에 남지 않아요.”"
        ]
      }
    },
    {
      "id": "flow",
      "mode": "mf",
      "st": "flow",
      "home": "flow",
      "say": "기록을 남기려면 프로그램이 파일에 저장하는 단계를 거쳐야 합니다.",
      "title": "저장 흐름",
      "figure": "s4",
      "example": "fictional-records",
      "instructor": {
        "script": [
          "“그래서 저장 단계가 필요합니다. 사용자가 ‘지하철 1,500원을 적어 줘’라고 요청하면, 프로그램이 내용을 확인하고 번호를 붙인 뒤, 파일 끝에 한 줄을 덧붙여 저장합니다. 이 단계를 거쳐야 파일이 바뀌어요. 메모리의 값을 바꾸는 것만으로는 파일이 저절로 바뀌지 않습니다.”"
        ]
      }
    },
    {
      "id": "repo",
      "mode": "mf",
      "st": "saved",
      "home": "flow",
      "say": "파일에 읽고 저장하는 일은 Scene 02의 Repository가 맡고, 저장한 기록은 프로그램을 끝내도 남습니다.",
      "title": "Repository와 저장 후 종료",
      "figure": "s4",
      "example": "fictional-records",
      "instructor": {
        "script": [
          "“Scene 02에서 ‘기록을 읽고 저장하는 부분’이 있었죠. Repository입니다. 이 파일 저장을 맡는 부분이에요. 이제 프로그램을 끝내도 파일에 5개가 남아 있습니다.”"
        ]
      }
    },
    {
      "id": "jsonl",
      "mode": "jsonl",
      "sub": "lines",
      "home": "jsonl",
      "say": "JSONL은 한 줄에 기록 하나를 JSON 모양으로 적는 파일 형식입니다.",
      "title": "JSONL — 한 줄에 기록 하나",
      "figure": "s4",
      "example": "fictional-records",
      "instructor": {
        "script": [
          "“그럼 파일 안은 실제로 어떻게 생겼을까요? 이 파일은 JSONL이라는 형식으로 적었습니다. 줄 번호를 보세요. 한 줄이 기록 하나예요. 기록이 5개니까 5줄입니다. 각 줄은 JSON이라는 모양으로 적었고, JSON을 한 줄씩 늘어놓았다는 뜻으로 JSONL이라고 부릅니다.”"
        ]
      }
    },
    {
      "id": "pair",
      "mode": "jsonl",
      "sub": "pair",
      "home": "jsonl",
      "say": "한 줄 안에는 항목 이름과 값이 짝을 지어 들어갑니다.",
      "title": "항목 이름과 값",
      "figure": "s4",
      "example": "fictional-records",
      "instructor": {
        "script": [
          "“첫 줄을 자세히 봅시다. \"date\"는 항목 이름, \"2026-10-01\"은 그 값입니다. 이렇게 이름과 값이 짝을 지어 들어가요. 그래서 줄 하나만 봐도 무엇이 날짜이고 무엇이 금액인지 알 수 있습니다.”"
        ]
      }
    },
    {
      "id": "csv",
      "mode": "csv",
      "sub": "table",
      "home": "csv",
      "say": "CSV는 쉼표로 칸을 나누어 기록을 행과 열의 표로 적는 파일 형식입니다.",
      "title": "CSV — 행과 열",
      "figure": "s4",
      "example": "fictional-records",
      "instructor": {
        "script": [
          "“같은 기록을 다른 형식으로도 적을 수 있습니다. CSV는 쉼표로 칸을 나눠 적는 형식이에요. 오른쪽처럼 표로 볼 수 있습니다.”"
        ]
      }
    },
    {
      "id": "header",
      "mode": "csv",
      "sub": "header",
      "home": "csv",
      "say": "CSV의 첫 줄은 열 이름이고, 그다음 줄부터 한 줄이 기록 하나입니다.",
      "title": "열 이름",
      "figure": "s4",
      "example": "fictional-records",
      "instructor": {
        "script": [
          "“CSV의 첫 줄은 열 이름입니다. id, date, category처럼요. 그다음 줄부터는 한 줄이 기록 하나이고, 쉼표 사이에 값만 적습니다. 금액에 천 단위 쉼표를 넣지 않은 것도 보이죠? 칸을 나누는 쉼표와 헷갈리지 않게 하기 위해서입니다.”"
        ]
      }
    },
    {
      "id": "cmp",
      "mode": "cmp",
      "sub": "shape",
      "home": "cmp",
      "say": "같은 기록이라도 JSONL은 줄마다 항목 이름을 붙이고, CSV는 열 이름을 첫 줄에 한 번만 적습니다.",
      "title": "JSONL과 CSV 비교",
      "figure": "s4",
      "example": "fictional-records",
      "instructor": {
        "script": [
          "“두 형식을 나란히 보면, JSONL은 줄마다 항목 이름이 붙어 있고 CSV는 첫 줄에 한 번만 적습니다. CSV는 표 프로그램에서 바로 열어 보기 좋아서 다른 사람과 주고받을 때 자주 씁니다.”"
        ]
      }
    },
    {
      "id": "use",
      "mode": "cmp",
      "sub": "use",
      "home": "cmp",
      "say": "실제 용돈 기입장은 기록을 JSONL 파일에 저장하고, CSV는 가져오기·내보내기에 씁니다.",
      "title": "실제 사례 · 용돈 기입장의 쓰임",
      "figure": "s4",
      "example": "ledger",
      "real": true,
      "instructor": {
        "script": [
          "“실제 용돈 기입장 프로그램은 어떻게 쓸까요? 기록은 transactions.jsonl이라는 JSONL 파일에 저장하고, CSV는 기록을 가져오거나 내보낼 때 씁니다. 두 형식을 똑같은 용도로 쓰는 게 아니라 역할을 나눠 쓰는 거예요.”"
        ]
      }
    },
    {
      "id": "check",
      "kind": "check",
      "say": "설명을 모두 마쳤습니다. 답을 보기 전에 먼저 말로 답해 봅시다.",
      "title": "이해 확인",
      "figure": "check",
      "example": "fictional-records",
      "questions": [
        {
          "kind": "기본 · 메모리",
          "q": "저장하지 않고 프로그램을 끝내면, 메모리에만 있던 기록은 어떻게 되나요?"
        },
        {
          "kind": "기본 · JSONL",
          "q": "JSONL 파일에서 한 줄은 무엇인가요?"
        },
        {
          "kind": "기본 · CSV",
          "q": "CSV의 첫 줄에는 무엇이 있나요?"
        }
      ],
      "reveal": {
        "answers": [
          "남지 않습니다.",
          "기록 하나 (JSON 하나)",
          "열 이름"
        ]
      },
      "instructor": {
        "expected": [
          {
            "q": "저장하지 않고 프로그램을 끝내면, 메모리에만 있던 기록은 어떻게 되나요?",
            "a": "남지 않습니다.",
            "miss": "“자동으로 저장된다” → 단계 3의 종료 그림과 단계 4의 ‘저장하는 단계’를 다시 보여 줌"
          },
          {
            "q": "JSONL 파일에서 한 줄은 무엇인가요?",
            "a": "기록 하나 (JSON 하나)",
            "miss": "“항목 하나” → F3에서 1번 줄 전체와 그 안의 이름·값 짝을 구분해 가리킴"
          },
          {
            "q": "CSV의 첫 줄에는 무엇이 있나요?",
            "a": "열 이름",
            "miss": "“첫 번째 기록” → F4에서 원문 첫 줄과 표의 머리줄을 함께 가리킴"
          }
        ]
      }
    },
    {
      "id": "apply",
      "kind": "check",
      "say": "새로운 상황에 적용해 봅시다.",
      "title": "적용",
      "figure": "check",
      "example": "fictional-records",
      "questions": [
        {
          "kind": "적용 · 형식",
          "q": "이번 달 기록을 표 프로그램에서 열어 보려고 파일로 보내고 싶습니다. 용돈 기입장에서는 어떤 형식의 어떤 기능을 쓸까요?"
        },
        {
          "kind": "적용 · 저장",
          "q": "메모리에서 떡볶이 금액을 3,500원으로 바꿨지만 저장하지 않고 프로그램을 끝냈습니다. 다시 켜면 파일의 떡볶이 금액은?"
        },
        {
          "kind": "적용 · JSONL",
          "q": "위 JSONL 파일에 기록을 하나 더 저장하면 파일은 몇 줄이 될까요?"
        }
      ],
      "reveal": {
        "answers": [
          "CSV 내보내기(export)",
          "3,000원 그대로",
          "6줄"
        ]
      },
      "instructor": {
        "expected": [
          {
            "q": "이번 달 기록을 표 프로그램에서 열어 보려고 파일로 보내고 싶습니다. 용돈 기입장에서는 어떤 형식의 어떤 기능을 쓸까요?",
            "a": "CSV 내보내기(export)",
            "miss": "“JSONL 파일을 그대로 보낸다” → F5의 ‘잘 맞는 곳’과 실제 사례 줄을 가리킴"
          },
          {
            "q": "메모리에서 떡볶이 금액을 3,500원으로 바꿨지만 저장하지 않고 프로그램을 끝냈습니다. 다시 켜면 파일의 떡볶이 금액은?",
            "a": "3,000원 그대로",
            "miss": "“3,500원” → 단계 4: 저장 단계를 거쳐야 파일이 바뀐다"
          },
          {
            "q": "위 JSONL 파일에 기록을 하나 더 저장하면 파일은 몇 줄이 될까요?",
            "a": "6줄",
            "miss": "“5줄 그대로” → 한 줄 = 기록 하나"
          }
        ]
      }
    },
    {
      "id": "wrap",
      "mode": "sum",
      "home": "mem",
      "say": "기록을 남기려면 메모리의 기록을 파일에 저장해야 하고, 형식은 그 기록을 어떤 모양으로 적을지 정합니다.",
      "title": "정리",
      "figure": "s4",
      "example": "fictional-records",
      "instructor": {
        "script": [
          "한 문장 정리를 함께 읽고, 다음 장면(Scene 05 Generator)으로 넘어갑니다."
        ]
      },
      "next": {
        "question": "파일에 기록이 아주 많아지면 꼭 한꺼번에 모두 읽어야 할까요?",
        "target": {
          "scene": "05",
          "step": "repeat"
        }
      }
    }
  ],
  "instructor": {
    "notes": [
      "<b>저장은 자동이 아니다:</b> 메모리의 값을 바꾸는 것과 파일에 쓰는 것은 다른 일이다. 프로그램이 저장하도록 만든 곳에서만 파일이 바뀐다. 실제 ledger는 <code>add</code>·<code>update</code>·<code>delete</code> 같은 명령을 처리할 때 저장까지 하도록 만들어져 있다(추가는 파일 끝에 한 줄 덧붙이기, 수정·삭제는 파일을 안전하게 다시 쓰기).",
      "<b>메모리의 범위:</b> ‘메모리 = 실행 중 데이터를 두는 공간’은 입문 설명이다. 운영체제·캐시 등 세부는 다루지 않는다.",
      "<b>JSONL과 JSON:</b> JSONL은 줄마다 JSON 값 하나를 적는다. 파일 전체가 하나의 JSON 문서는 아니다. 줄 안에는 줄바꿈이 들어가지 않는다.",
      "<b>형식은 메모리 절약 기능이 아니다:</b> JSONL이라는 이름만으로 메모리를 덜 쓰는 것은 아니다. 한 줄씩 읽어 처리할 수 있다는 점은 Scene 05에서 다룬다.",
      "<b>CSV의 값은 글자:</b> CSV에는 형(숫자·날짜)이 적혀 있지 않다. 읽은 뒤 숫자로 바꾸고 검사하는 일이 필요하다(→ Scene 07).",
      "<b>CSV의 쉼표:</b> 값 안에 쉼표가 있으면 큰따옴표로 감싼다. 실제 ledger의 tags 칸(<code>\"meal,lunch\"</code>)이 그런 예다. 학습용 데이터는 이런 경우를 피했다.",
      "<b>두 형식의 역할:</b> JSONL과 CSV를 대등한 두 가지 내부 저장 방식으로 설명하지 않는다. 실제 ledger의 기록 저장은 JSONL이고, CSV는 가져오기·내보내기다. 내보낸 CSV에는 id가 없고, 가져온 기록은 새 번호를 받는다.",
      "<b>학습용 데이터:</b> 파일 이름 <code>records.jsonl</code>·<code>records.csv</code>와 다섯 항목은 학습용이다. 실제 ledger 파일은 <code>data/transactions.jsonl</code>이고 <code>type</code>·<code>tags</code> 항목도 있다."
    ],
    "deep": [
      "파일 경로 — 파일이 어느 폴더에 생기는가, 실제 ledger의 기본 위치 <code>./data</code>와 <code>--data-dir</code>",
      "인코딩 — 한글을 파일에 적을 때 UTF-8로 저장·읽기",
      "예외 처리 — 파일이 없을 때, 줄 하나가 깨져 있을 때 알려 주기",
      "안전한 재작성 — 수정·삭제 때 임시 파일에 먼저 쓰고 바꿔 끼우기",
      "데이터 검증 — 읽은 값이 날짜·양수 금액인지 확인하기(→ Scene 07)",
      "CSV 인용 규칙 — 쉼표·줄바꿈이 들어간 값을 큰따옴표로 감싸기",
      "JSON 문서 하나와 JSONL의 차이 — 파일 전체를 한 번에 읽어야 하는가",
      "구현 문법 — <code>open()</code>, <code>with</code>, <code>json</code> 모듈, <code>csv</code> 모듈은 학습가이드에서 실행과 함께 다룬다."
    ]
  },
  "source": {
    "storyboard": "drafts/b2-1-story-map/v3/scene-04/storyboard.md",
    "sha256": "101ba777a1432012674068bfdeae61235105c61aedb4afa53f04f0de1b3f0dd6"
  }
};
