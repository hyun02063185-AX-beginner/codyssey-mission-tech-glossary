// Screen copy of the approved v3.7 preview; storyboard remains the source.
import type { TeachingScene } from './types';

export const scene03: TeachingScene = {
  "id": "03",
  "title": "기록 다루기: CRUD·검색·요약",
  "question": "기록을 다루는 기본 동작에는 어떤 것이 있을까?",
  "ctx": "Scene 03",
  "tag": "학습용 가상 기록",
  "addressing": "number",
  "home": "crud",
  "steps": [
    {
      "id": "crud",
      "mode": "ops",
      "op": null,
      "say": "기록을 다루는 기본 동작은 추가·조회·수정·삭제 네 가지로 나눌 수 있습니다. 영어 머리글자를 따서 CRUD라고 부릅니다.",
      "title": "네 가지 데이터 동작 CRUD",
      "figure": "s3",
      "example": "fictional-records",
      "instructor": {
        "script": [
          "“앞 장면에서 Service는 요청한 일을 처리하는 부분이었죠. 그럼 용돈 기입장에 들어오는 ‘요청한 일’에는 어떤 것들이 있을까요?” (답을 들은 뒤) “기록을 새로 적고, 보고, 고치고, 지우는 일이 있겠죠. 기록을 다루는 이 네 가지 기본 동작을 영어 머리글자를 따서 CRUD라고 부릅니다. 이 그림은 네 동작의 종류이지, 이 순서대로 실행된다는 뜻이 아닙니다.”"
        ]
      }
    },
    {
      "id": "create",
      "mode": "ops",
      "op": "create",
      "home": "crud",
      "say": "추가(Create)는 새로운 기록을 하나 더하는 동작입니다.",
      "title": "추가 Create",
      "figure": "s3",
      "example": "fictional-records",
      "instructor": {
        "script": [
          "“10월 6일에 지하철을 타서 1,500원을 썼다고 해 봅시다. 이 기록을 새로 적는 것이 추가, Create입니다. 기록이 4개에서 5개가 되었죠.”"
        ]
      }
    },
    {
      "id": "read",
      "mode": "ops",
      "op": "read",
      "home": "crud",
      "say": "조회(Read)는 기록을 꺼내 보는 동작이며, 원본 기록은 그대로입니다.",
      "title": "조회 Read",
      "figure": "s3",
      "example": "fictional-records",
      "instructor": {
        "script": [
          "“기록을 꺼내 보는 것은 조회, Read입니다. 보기만 했으니 기록은 그대로 4개, 내용도 그대로예요.”"
        ]
      }
    },
    {
      "id": "update",
      "mode": "ops",
      "op": "update",
      "home": "crud",
      "say": "수정(Update)은 이미 있는 기록의 내용을 바꾸는 동작입니다.",
      "title": "수정 Update",
      "figure": "s3",
      "example": "fictional-records",
      "instructor": {
        "script": [
          "“아이스크림 값을 잘못 적어서 2,500원으로 고친다면 수정, Update입니다. 기록 수는 그대로지만 내용 한 곳이 바뀌었습니다.”"
        ]
      }
    },
    {
      "id": "delete",
      "mode": "ops",
      "op": "delete",
      "home": "crud",
      "say": "삭제(Delete)는 이미 있는 기록을 없애는 동작입니다.",
      "title": "삭제 Delete",
      "figure": "s3",
      "example": "fictional-records",
      "instructor": {
        "script": [
          "“버스 기록을 잘못 넣어서 지운다면 삭제, Delete입니다. 기록이 3개로 줄었습니다.”"
        ]
      }
    },
    {
      "id": "change",
      "mode": "change",
      "home": "crud",
      "say": "추가·수정·삭제는 원본 기록을 바꾸고, 조회는 원본 기록을 그대로 둡니다.",
      "title": "원본이 바뀌는 동작",
      "figure": "s3",
      "example": "fictional-records",
      "instructor": {
        "script": [
          "“네 동작을 원본 기록이 바뀌는지로 나눠 봅시다. 추가·수정·삭제는 원본이 바뀌고, 조회는 그대로입니다. 지금 보는 기록 묶음이 처음 4개 그대로인 것도 확인해 주세요. 앞의 세 변화는 같은 처음 기록에서 따로 비교한 것입니다.”"
        ]
      }
    },
    {
      "id": "search",
      "mode": "sr",
      "sr": "search",
      "home": "both",
      "say": "검색은 조건에 맞는 기록만 골라 보는 일입니다.",
      "title": "검색",
      "figure": "s3",
      "example": "fictional-records",
      "instructor": {
        "script": [
          "“간식에 쓴 기록만 보고 싶다면요? 분류가 간식인 기록만 골라 보는 것을 검색이라고 합니다. 떡볶이와 아이스크림, 2개가 골라졌죠.”"
        ]
      }
    },
    {
      "id": "summary",
      "mode": "sr",
      "sr": "summary",
      "home": "both",
      "say": "요약은 여러 기록을 계산해 하나의 결과를 얻는 일입니다.",
      "title": "요약",
      "figure": "s3",
      "example": "fictional-records",
      "instructor": {
        "script": [
          "“이번엔 지금까지 모두 얼마를 썼는지 알고 싶다면요? 네 기록의 금액을 더하면 14,500원입니다. 분류별로 묶어서 더할 수도 있어요. 여러 기록을 계산해 하나의 결과를 얻는 것을 요약이라고 합니다.”"
        ]
      }
    },
    {
      "id": "both",
      "mode": "sr",
      "sr": "both",
      "home": "both",
      "say": "검색과 요약은 기록을 읽어 활용할 뿐, 원본 기록을 바꾸지 않습니다.",
      "title": "검색·요약과 원본",
      "figure": "s3",
      "example": "fictional-records",
      "instructor": {
        "script": [
          "“검색 결과는 고른 기록들이고, 요약 결과는 계산한 값입니다. 결과는 다르지만 둘 다 기록을 읽어서 활용할 뿐이에요. 가운데 원본 기록은 여전히 4개 그대로입니다. 검색했다고 나머지 기록이 지워지는 것이 아닙니다.”"
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
          "kind": "기본 · 원본",
          "q": "추가·조회·수정·삭제 중 원본 기록을 바꾸지 않는 동작은 무엇인가요?"
        },
        {
          "kind": "기본 · 검색과 요약",
          "q": "검색과 요약은 결과가 어떻게 다른가요?"
        },
        {
          "kind": "기본 · 순서",
          "q": "CRUD는 추가 → 조회 → 수정 → 삭제 순서로 실행해야 하나요?"
        }
      ],
      "reveal": {
        "answers": [
          "조회",
          "검색은 조건에 맞는 기록들, 요약은 계산한 하나의 결과",
          "아니요. 네 동작의 종류일 뿐 순서가 아닙니다."
        ]
      },
      "instructor": {
        "expected": [
          {
            "q": "추가·조회·수정·삭제 중 원본 기록을 바꾸지 않는 동작은 무엇인가요?",
            "a": "조회",
            "miss": "수정이라고 답함 → F2를 다시 가리키며 “수정은 내용을 바꿨죠. 보기만 한 것은 조회입니다.”"
          },
          {
            "q": "검색과 요약은 결과가 어떻게 다른가요?",
            "a": "검색은 조건에 맞는 기록들, 요약은 계산한 하나의 결과",
            "miss": "“둘 다 기록을 줄인다”고 답함 → F3의 왼쪽(기록 2개)과 오른쪽(14,500원)을 번갈아 가리킴"
          },
          {
            "q": "CRUD는 추가 → 조회 → 수정 → 삭제 순서로 실행해야 하나요?",
            "a": "아니요. 네 동작의 종류일 뿐 순서가 아닙니다.",
            "miss": "“네” → F1의 ‘순서가 아닙니다’ 표시와 단계 5(삭제만 따로 일어남)를 다시 보여 줌"
          }
        ]
      }
    },
    {
      "id": "apply",
      "kind": "check",
      "say": "새로운 요청이 어떤 동작인지 골라 봅시다.",
      "title": "적용 · 이 요청은 어떤 동작?",
      "figure": "check",
      "example": "fictional-records",
      "questions": [
        {
          "kind": "요청",
          "q": "10월 7일에 산 연필 1,000원을 적어 줘."
        },
        {
          "kind": "요청",
          "q": "떡볶이 금액을 3,500원으로 고쳐 줘."
        },
        {
          "kind": "요청",
          "q": "교통에 쓴 기록만 보여 줘."
        },
        {
          "kind": "요청",
          "q": "이번 달에 쓴 돈이 모두 얼마야?"
        },
        {
          "kind": "요청",
          "q": "잘못 적은 버스 기록을 지워 줘."
        },
        {
          "kind": "요청",
          "q": "지금까지 적은 기록을 모두 보여 줘."
        }
      ],
      "reveal": {
        "answers": [
          "추가 (Create)",
          "수정 (Update)",
          "검색",
          "요약",
          "삭제 (Delete)",
          "조회 (Read)"
        ]
      },
      "instructor": {
        "expected": [
          {
            "q": "10월 7일에 산 연필 1,000원을 적어 줘.",
            "a": "추가 (Create)",
            "miss": ""
          },
          {
            "q": "떡볶이 금액을 3,500원으로 고쳐 줘.",
            "a": "수정 (Update)",
            "miss": ""
          },
          {
            "q": "교통에 쓴 기록만 보여 줘.",
            "a": "검색",
            "miss": "삭제로 답함 → “다른 기록을 지우는 게 아니라 고르기만 하는 거예요.”"
          },
          {
            "q": "이번 달에 쓴 돈이 모두 얼마야?",
            "a": "요약",
            "miss": "조회로 답함 → “기록을 보여 주는 것이 아니라 계산한 값 하나를 원하죠.”"
          },
          {
            "q": "잘못 적은 버스 기록을 지워 줘.",
            "a": "삭제 (Delete)",
            "miss": ""
          },
          {
            "q": "지금까지 적은 기록을 모두 보여 줘.",
            "a": "조회 (Read)",
            "miss": ""
          }
        ]
      }
    },
    {
      "id": "wrap",
      "mode": "sum",
      "home": "crud",
      "say": "기록을 바꾸는 일(추가·수정·삭제), 고르는 일(검색), 계산하는 일(요약)을 구분하면 기능의 목적이 보입니다.",
      "title": "정리",
      "figure": "s3",
      "example": "fictional-records",
      "instructor": {
        "script": [
          "한 문장 정리를 함께 읽고, 다음 장면 질문으로 넘어갑니다."
        ]
      },
      "next": {
        "question": "추가하거나 수정한 기록은 프로그램을 끝낸 뒤에도 남아 있을까요?",
        "target": {
          "scene": "04",
          "step": "1"
        }
      }
    }
  ],
  "instructor": {
    "notes": [
      "<b>분류이지 순서가 아니다:</b> CRUD는 데이터 동작의 종류다. 한 프로그램이 네 동작을 모두 갖춰야 한다는 규칙도, 이 순서로 실행한다는 뜻도 아니다.",
      "<b>검색·요약과 Read:</b> 넓게 보면 검색·요약도 기록을 읽는 동작(Read)에 속한다. 이 장면에서는 결과의 차이를 보이기 위해 따로 이름을 붙였다.",
      "<b>Read와 Repository의 읽기:</b> CRUD의 ‘조회’는 사용자가 요청하는 동작이고, Scene 02의 Repository가 ‘파일에서 읽어 오는’ 일은 그 동작을 위해 저장소에서 기록을 가져오는 일이다.",
      "<b>원본이 바뀐다는 뜻:</b> 이 장면은 프로그램이 다루는 기록이 바뀌는 것을 보여 준다. 바뀐 기록이 파일에 남는지는 Scene 04에서 다룬다.",
      "<b>변화 비교는 누적이 아니다:</b> 추가·수정·삭제의 예는 각각 처음 기록 4개에서 따로 비교한 것이다.",
      "<b>가상 데이터:</b> 모든 기록과 합계는 학습용이다. 실제 ledger에는 <code>add</code>·<code>list</code>·<code>search</code>·<code>summary</code>·<code>update</code>·<code>delete</code> 명령이 있지만, 이 화면의 숫자는 ledger를 실행한 결과가 아니다."
    ],
    "deep": [
      "기록을 구별하는 번호(ID) — 수정·삭제할 기록을 정확히 가리키려면 번호가 필요하다. 실제 ledger는 <code>--id</code>로 지정한다.",
      "여러 조건 검색 — 날짜 범위·분류·메모 글자 등 조건을 함께 쓰면 모두 맞는 기록만 남는다(실제 ledger 검색은 조건을 AND로 결합).",
      "요약의 종류 — 합계 말고도 개수·평균·가장 많이 쓴 분류 등",
      "안전한 수정·삭제 — 잘못 지우지 않도록 확인하기, 없는 번호를 지정했을 때 알려 주기",
      "기존 Scene 03 자료 — 03-B 원고(구현 흐름 추적), 03-A(함수·클래스 복습, 선수 자료)"
    ]
  },
  "source": {
    "storyboard": "drafts/b2-1-story-map/v3/scene-03/storyboard.md",
    "sha256": "61d65cf8dbfb04b42fb2d40be49ddcef3b7b21960628815987223d693507780e"
  }
};
