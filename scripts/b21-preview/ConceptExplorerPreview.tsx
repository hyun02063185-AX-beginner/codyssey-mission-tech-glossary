import { lazy, Suspense, useEffect, useRef } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import ConceptExplorer from '../../src/b21ConceptExplorer/ConceptExplorer';
import { explorerPath, explorerHref, initialExplorer, validExplorerReturn } from '../../src/b21ConceptExplorer/state';
import { isConnectedTerm } from '../../src/b21StoryV3/links/catalog';
import { storySource } from '../../src/b21StoryV3/links/returnAddress';
import { resolveStoryRoute, storyPath } from '../../src/b21StoryV3/routing/storyRoute';
import B21StoryRouter from '../../src/b21StoryV3/routing/B21StoryRouter';
import { learningLinkExtensions } from '../../src/b21StoryV3/components/StoryLearningLinks';
import './concept-preview.css';

const Destination=lazy(()=>import('./U4AppDestination'));
export default function ConceptExplorerPreview() {
  const location=useLocation(),focus=useRef<HTMLHeadingElement>(null);
  const isStory=location.pathname===storyPath,isMap=location.pathname===explorerPath;
  const query=new URLSearchParams(location.search),term=location.pathname.match(/^\/terms\/([a-z0-9-]+)$/)?.[1];
  const termReturn=term&&isConnectedTerm(term)&&!query.has('b31-map')&&query.getAll('b21-explorer').length===1
    ?validExplorerReturn(query.get('b21-explorer')):null;
  const reviewReturn=isStory?validExplorerReturn(location.state?.b21Explorer):null;
  const route=resolveStoryRoute(location.pathname,location.search).route;
  useEffect(()=>{if(!isMap&&!isStory){focus.current?.focus();window.scrollTo(0,0);}},[location.pathname,isMap,isStory]);
  if(location.pathname==='/')return <Navigate replace to={explorerPath}/>;
  if(isStory&&route.presenter)return <B21StoryRouter/>;
  return <div className="b21-c1-preview">
    <header className="b21-c1-banner"><h1 ref={focus} tabIndex={-1}>Concept Explorer · 비공개 Owner Preview</h1><p>전체 개념지도 검토용입니다. 공개 서비스 라우팅·배포는 연결하지 않았습니다.</p>
      {(termReturn||reviewReturn)&&<Link to={(termReturn??reviewReturn)!}>← 전체 개념지도로 돌아가기 · 탐색 위치 유지</Link>}
    </header>
    {isMap?<ConceptExplorer/>:isStory?<>
      <B21StoryRouter extensions={learningLinkExtensions(route)}/>
      {route.scene===7&&<nav className="b21-c1-entry" aria-label="Scene 08 전체 지도 연결"><Link to={explorerHref({...initialExplorer,origin:storySource(route)})}>전체 개념지도에서 관계 탐색 →</Link><p>강의용 7개 묶음과 전체 지도의 원본 7개 영역은 분류가 다릅니다. 현재 강의 위치를 기억합니다.</p></nav>}
    </>:term&&isConnectedTerm(term)?<Suspense fallback={<p>실제 용어사전을 불러옵니다.</p>}><Destination/></Suspense>:<p className="b21-c1-entry">이 비공개 검토 모드에서 지원하지 않는 주소입니다. <Link to={explorerPath}>전체 개념지도 열기</Link></p>}
  </div>;
}
