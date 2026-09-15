#!/usr/bin/env python3
import json
from pathlib import Path

R=Path(__file__).resolve().parents[1]
S={
'controlled-input':('Controlled Input','React state를 입력값의 기준으로 삼아 form control을 표시하고 갱신하는 방식','value와 onChange를 state에 연결해 렌더링 값과 사용자 입력을 하나의 source of truth로 관리한다',['react-state','html-form','input-validation']),
'custom-hook':('Custom Hook','공유하는 React state와 effect 로직을 `use...` 함수로 묶은 재사용 단위','다른 Hook을 호출하는 함수이며 호출마다 독립된 state와 effect를 가진다',['useeffect','react-state','separation-of-concerns']),
'server-side-rendering':('Server-Side Rendering','서버가 요청에 맞춰 HTML을 만들어 browser에 보내는 렌더링 방식','초기 HTML을 서버에서 만들고 필요하면 client JavaScript가 hydration으로 상호작용을 연결한다',['templateresponse','browser-rendering','single-page-application']),
'single-page-application':('Single Page Application','초기 document 뒤 JavaScript가 화면 일부를 갱신하며 여러 route를 제공하는 웹 앱','client router가 URL과 화면을 연결하고 API data를 받아 같은 document 안의 UI를 바꾼다',['client-side-routing','react-router','server-side-rendering']),
'useeffect':('useEffect','렌더링 뒤 네트워크·구독 같은 외부 시스템과 동기화하는 React Hook','dependency 변경 뒤 effect를 실행하고 cleanup으로 timer·subscription·request를 정리할 수 있다',['asynchronous-data-fetching','react-state','custom-hook']),
'contact-form':('Contact Form','사용자가 문의 내용과 연락처를 입력해 서버에 전달하는 form UI','label, input, textarea, 제출, 검증, 성공·실패 피드백을 하나의 입력 흐름으로 조합한다',['html-form','email-validation','input-validation']),
'dom-update':('DOM Update','JavaScript가 document node·속성·텍스트를 바꾸는 화면 구조 갱신','DOM 변경 뒤 browser는 필요한 style, layout, paint 단계를 수행한다',['dom','browser-rendering','ui-update']),
'email-validation':('이메일 검증','입력값이 서비스가 허용하는 이메일 형식과 정책을 만족하는지 확인하는 과정','형식 검사는 소유·수신 가능성을 보장하지 않으므로 인증 메일과 구분한다',['contact-form','input-validation','error-message']),
'html-form':('HTML Form','입력 control을 묶어 사용자 데이터를 제출하는 HTML 구조','name을 가진 control 값을 method와 action에 따라 전송하고 submit의 의미를 제공한다',['contact-form','post-redirect-get','input-validation']),
'interaction':('인터랙션','사용자 행동에 반응해 UI 상태나 화면이 바뀌는 경험','click뿐 아니라 keyboard, focus, pointer event와 피드백까지 포함한다',['user-event','accessibility-a11y','ui-update']),
'post-redirect-get':('Post/Redirect/Get','POST 처리 뒤 redirect하고 결과 URL을 GET으로 읽는 요청 패턴','성공한 mutation 뒤 303 등을 반환해 새로고침의 POST 재전송을 줄인다',['html-form','http-request-response','client-side-routing']),
'templateresponse':('TemplateResponse','template과 context로 서버 HTML response를 만드는 Starlette/FastAPI 응답 객체','request와 context를 template engine에 전달해 HTML, status, header를 포함한 response를 만든다',['template-engine','server-side-rendering','html-form']),
'ui-update':('UI Update','상태나 data 변화가 사용자가 보는 화면에 반영되는 일','state 계산 뒤 DOM 또는 component tree가 새 view를 렌더링한 결과다',['state-change','dom-update','virtual-dom-rendering']),
'react-context':('React Context','중간 component마다 props를 전달하지 않고 tree 아래에 값을 제공하는 React 기능','Provider value를 useContext로 읽으며 value identity 변경은 소비 component render에 영향을 준다',['component-tree','react-state','custom-hook']),
'asynchronous-data-fetching':('Asynchronous Data Fetching','UI를 멈추지 않고 network data의 loading, success, error 상태를 관리하는 방식','요청 순서와 응답 순서는 다를 수 있어 취소·최신성·재시도를 설계해야 한다',['useeffect','http-request-response','error-message']),
'browser-rendering':('Browser Rendering','browser가 HTML·CSS·JavaScript를 해석해 픽셀 화면을 만드는 과정','DOM/CSSOM, style 계산, layout, paint, compositing이 변경 종류에 따라 이어진다',['dom-update','css-cascade','virtual-dom-rendering']),
'client-side-routing':('Client-side Routing','새 document 요청 대신 JavaScript가 URL에 맞는 화면을 선택하는 navigation 방식','History API와 router가 link, back/forward, params를 처리해 component를 교체한다',['single-page-application','react-router','not-found-page']),
'client-side-storage':('Client-side Storage','browser가 사용자 기기에 data를 저장해 다음 방문에도 쓰게 하는 저장 영역','localStorage, sessionStorage, IndexedDB, cookie는 수명·용량·전송 경계가 서로 다르다',['local-storage','cookie','client-side-routing']),
'css-cascade':('CSS Cascade','여러 CSS 규칙이 같은 요소를 가리킬 때 최종 선언을 고르는 우선순위 규칙','origin, importance, specificity, source order를 고려해 선언을 선택한다',['css','inline-style','browser-rendering']),
'react-router':('React Router','React SPA에서 URL과 component를 연결하고 navigation을 처리하는 library','route matching, params, Link, nested route, Not Found route를 제공한다',['client-side-routing','single-page-application','not-found-page']),
'virtual-dom-rendering':('Virtual DOM Rendering','React가 새 UI 설명을 비교해 필요한 실제 DOM 변경을 반영하는 흐름','reconciliation은 key와 component identity를 바탕으로 DOM mutation을 결정한다',['react-state','dom-update','browser-rendering']),
'index-html':('index.html','웹 앱의 최초 HTML document로 자주 쓰이는 entry file','Vite에서는 script entry와 root element를 제공해 JavaScript 앱이 붙을 자리를 만든다',['html','browser-rendering']),
'bootstrap':('Bootstrap','미리 만든 CSS component와 utility를 제공하는 UI framework','class 기반 스타일과 component를 제공하지만 접근성과 디자인 요구를 자동으로 충족하지는 않는다',['css','tailwind-css']),
'error-message':('에러 메시지','실패 원인과 사용자가 다음에 할 행동을 알려 주는 문구','사용자가 고칠 정보를 주되 stack trace나 비밀값 같은 내부 정보는 노출하지 않는다',['input-validation','email-validation']),
'hamburger-menu':('햄버거 메뉴','작은 화면에서 navigation 항목을 접었다 펼치는 메뉴 패턴','button의 열린 상태, aria-expanded, focus 이동을 함께 구현해야 한다',['interaction','accessibility-a11y']),
'health-check-endpoint':('Health Check Endpoint','서비스 상태를 확인하도록 만든 HTTP endpoint','liveness와 readiness 목적, 상태 코드, timeout, 의존성 검사 범위를 분명히 정한다',['health-check','http-status-code']),
'inline-onclick-handler':('inline onclick handler','HTML attribute에 JavaScript를 직접 적는 이벤트 처리 방식','markup과 behavior를 결합해 테스트·재사용·CSP 관리가 어려워질 수 있다',['add-event-listener','interaction']),
'inline-style':('인라인 스타일','HTML element의 style attribute에 CSS 선언을 직접 쓰는 방식','재사용과 media query 설계를 어렵게 하므로 예외적인 한 요소 스타일인지 판단한다',['css-cascade','css-media-query']),
'jquery':('jQuery','DOM 선택·이벤트·Ajax API를 제공한 JavaScript library','유지보수 프로젝트에는 남아 있을 수 있지만 modern DOM API와 framework에 중복 도입할 필요는 없다',['dom','add-event-listener']),
'navigation-state-styling':('Navigation State Styling','현재 route나 scroll 위치에 따라 navigation 모양을 바꾸는 UI 처리','active state는 URL 또는 app state에서 계산하고 aria-current 같은 의미도 제공한다',['client-side-routing','accessibility-a11y']),
'not-found-page':('Not Found Page','요청한 route나 resource가 없을 때 보여 주는 404 안내 화면','SPA의 catch-all route와 server의 올바른 404 status를 함께 고려한다',['client-side-routing','http-status-code']),
'react-memo':('React.memo','props가 같을 때 function component render를 건너뛸 수 있게 하는 React wrapper','shallow prop comparison을 기본으로 하므로 새 object·function prop이 매번 생기면 효과가 줄 수 있다',['usecallback','usememo']),
'scroll-to-top':('스크롤 탑','긴 페이지에서 현재 scroll 위치를 문서 맨 위로 이동시키는 UI 동작','keyboard 동작과 reduced-motion 선호를 고려해 구현한다',['smooth-scroll','accessibility-a11y']),
'smooth-scroll':('부드러운 스크롤','scroll 위치를 animation으로 이동시키는 동작','CSS scroll-behavior 또는 scrollTo로 구현하되 motion 민감 사용자의 설정을 존중한다',['scroll-to-top','css-media-query']),
'tailwind-css':('Tailwind CSS','utility class 조합으로 UI를 스타일링하는 CSS framework','build 단계에서 사용한 class를 분석해 CSS를 만들며 긴 class 조합의 경계를 관리해야 한다',['css','bootstrap']),
'usecallback':('useCallback','dependency가 바뀔 때까지 같은 function reference를 재사용하는 React Hook','React.memo 자식이나 effect dependency에서 reference 안정성이 필요할 때 쓴다',['react-memo','usememo']),
'usememo':('useMemo','dependency가 같을 때 이전 계산 결과를 재사용하는 React Hook','correctness 저장소가 아니라 비용을 측정한 뒤 선택하는 render 최적화다',['memoization','usecallback']),
'vue':('Vue','선언형 component와 reactive state로 UI를 만드는 JavaScript framework','React와 API·생태계는 다르지만 UI state 문제를 다루는 framework다',['react','virtual-dom-rendering']),
'accessibility-a11y':('Accessibility / a11y','다른 장애·입력 방식·환경의 사람도 웹을 사용할 수 있게 하는 설계','semantic HTML, keyboard, focus, label, contrast, accessible name을 함께 다룬다',['html-form','interaction']),
'component-tree':('Component Tree','UI framework에서 component가 부모·자식 관계로 구성된 구조','props가 아래로 흐르고 context가 provider 아래로 전달되는 경계를 보여 준다',['react-context','custom-hook']),
'css-media-query':('CSS Media Query','viewport나 사용자 환경 조건에 따라 CSS 규칙을 적용하는 문법','width뿐 아니라 prefers-reduced-motion, color scheme 같은 환경도 다룬다',['css','accessibility-a11y']),
'template-engine':('Template Engine','template에 data를 넣어 HTML 같은 text output을 만드는 도구','Jinja2 같은 engine은 variable·loop·escape를 제공해 presentation과 business logic 경계를 돕는다',['templateresponse','server-side-rendering']),}
def render(id,tier,v):
 title,summary,technical,related=v; easy=f'`{title}`의 역할을 실제 화면과 요청 흐름에서 분리해 생각하면 됩니다.'; mission='현재 미션의 구현 요구에서 이 용어가 맡는 책임과 다른 단계의 경계를 확인합니다.'; code=f'```text\n{title}\n```'; out=[f'# {title}','','## 한 줄 설명','',summary+'.','','## 쉽게 설명하면','',easy,'','## 정확한 설명','',technical+'.']
 if tier=='A': out += ['','## 동작 원리','','입력·상태·렌더링 또는 요청·응답의 순서를 나누어 관찰하고, 바뀐 결과가 다음 단계의 입력이 되는지 확인합니다.']
 out += ['','## 이 미션에서는 왜 필요한가','',mission,'','## 코드 예','',code]
 if tier in 'AB': out += ['','## 주의할 점 / 경계 조건','','한 단계의 성공을 전체 기능의 성공으로 해석하지 말고, 비동기 순서·접근성·서버 검증처럼 이 개념 밖의 조건을 함께 점검합니다.']
 out += ['','## 관련 용어','']+[f'- `{x}`' for x in related]
 if tier in 'AB': out += ['','## 흔한 오해','','이 용어의 이름만 같다고 모든 framework와 환경에서 같은 동작을 보장하는 것은 아닙니다.','','## 동료평가 질문','','이 기능의 입력, 상태 변화, 사용자에게 보이는 결과를 각각 어떻게 확인하겠습니까?']
 return '\n'.join(out)+'\n'
def main():
 p=json.loads((R/'data/reviews/content-tier-sprint7.json').read_text()); b=next(x for x in p['implementation_batches'] if x['id']=='S7-B02'); items={x['term_id']:x for x in p['items']}; assert set(b['term_ids'])==set(S) and len(S)==42
 for id in b['term_ids']: (R/'content/terms'/f'{id}.md').write_text(render(id,items[id]['tier'],S[id]),encoding='utf-8')
 m=json.loads((R/'data/curated/glossary-master-v0.1.yaml').read_text())
 for t in m['terms']:
  if t['id'] in S: t['content_status']='drafted'
 (R/'data/curated/glossary-master-v0.1.yaml').write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n')
 print('Wrote 42 S7-B02 term files.')
if __name__=='__main__': main()
