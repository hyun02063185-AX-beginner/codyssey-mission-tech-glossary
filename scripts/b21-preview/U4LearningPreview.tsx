import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import B21StoryRouter from '../../src/b21StoryV3/routing/B21StoryRouter';
import B21StoryReturn from '../../src/b21StoryV3/B21StoryReturn';
import { resolveStoryRoute, routeURL, storyPath } from '../../src/b21StoryV3/routing/storyRoute';
import { scenes } from '../../src/b21StoryV3/content';
import { connectionsForSource } from '../../src/b21StoryV3/links/contextLinks';
import { extensionNotice, heldConcepts } from '../../src/b21StoryV3/links/catalog';
import { sourceLabel } from '../../src/b21StoryV3/links/returnAddress';
import './u4-preview.css';

const AppDestination=lazy(()=>import('./U4AppDestination'));
export default function U4LearningPreview() {
  const location=useLocation(), route=resolveStoryRoute(location.pathname,location.search).route;
  const isStory=location.pathname===storyPath;
  const [placement,setPlacement]=useState('notes');
  const focus=useRef<HTMLHeadingElement>(null), prior=useRef(location.pathname);
  useEffect(()=>{
    if(prior.current!==location.pathname){
      if(isStory)document.getElementById('q')?.focus();else focus.current?.focus();
      window.scrollTo(0,0);prior.current=location.pathname;
    }
  },[isStory,location.pathname]);
  const links=connectionsForSource(route), isSummary=route.step===scenes[route.scene].steps.length-1;
  const eligible=placement==='notes'||(placement==='map'&&route.scene===7&&route.step>=1&&route.step<=7)||(placement==='summary'&&isSummary);
  if(location.pathname==='/')return <Navigate replace to={routeURL({scene:0,step:0,back:null,presenter:false})}/>;
  if(isStory&&route.presenter)return <B21StoryRouter/>;
  return <div className="b21-u4-preview">
    <div className="b21-u4-banner"><h1 ref={focus} tabIndex={-1}>U4 연결 검토 · 비공개 Owner Preview</h1><p>정식 링크 위치와 Scene 08 문구는 D8 승인 전입니다. 용어·가이드·분야 지도는 실제 앱 화면을 재사용하며, 공개 Story는 전환하지 않았습니다.</p></div>
    {isStory?<>
      <B21StoryRouter/>
      <section className="b21-u4-panel" aria-label="U4 연결 검토">
        <h2>U4 연결 검토 · {sourceLabel(route)}</h2>
        <label>배치 후보 <select aria-label="배치 후보" value={placement} onChange={e=>setPlacement(e.currentTarget.value)}>
          <option value="notes">강사 노트 · 선택형 심화</option><option value="map">Scene 08 선택 영역 옆</option><option value="summary">장면 정리 단계 아래</option>
        </select></label>
        <p>이 검토 패널은 승인된 강의 무대 바깥에 있습니다. 현재 후보의 정식 위치에 장착한 화면은 아닙니다.</p>
        {!eligible?<p role="status">이 후보는 {placement==='map'?'Scene 08의 영역 2~8단계':'각 장면의 마지막 정리 단계'}에서 검토할 수 있습니다.</p>:<>
          <h3>현재 장면 관련 용어</h3><p>각 링크는 지금의 단계로 돌아옵니다. 연결 보류 개념을 다른 용어로 대신 연결하지 않습니다.</p>
          <ul className="b21-u4-terms">{links.terms.map(term=><li key={term.termId} data-term-id={term.termId} data-mode={term.mode}>
            <Link to={term.href}>{term.label} 용어 보기</Link><span>{term.mode==='direct'?'직접 연결':'범위 확장'} · {term.termId}</span>
            {term.mode==='extension'&&<p className="b21-u4-extension">{extensionNotice} {term.notice}</p>}
            <small>출발 {term.from.scene} / {term.from.step} · 복귀 {term.returnTo}</small>
          </li>)}</ul>
          <h3>실습과 코드 검증</h3><p>강의에서 개념을 이해한 뒤 학습가이드에서 직접 구현하고 검증합니다.</p>
          <ul>{links.guides.map(guide=><li key={guide.chapter}><Link to={guide.href}>학습가이드 · {guide.chapter}</Link></li>)}</ul>
          {!!links.maps.length&&<><h3>기술 분야 지도</h3><p>이 지도에는 B2-1 Story 전용 복귀 배너가 없습니다. 돌아오려면 브라우저 뒤로가기를 사용하세요.</p>{links.maps.map(map=><p key={map.href}><Link to={map.href}>데이터·데이터베이스 분야 지도</Link></p>)}</>}
        </>}
        <details><summary>연결 보류 개념</summary><p>{heldConcepts.join(' · ')}</p><p>페이지 부재·범위 불일치·원본 매핑 보류 항목입니다. 유사한 용어 링크를 만들지 않았습니다.</p></details>
      </section>
    </>:<>
      <div className="b21-u4-return"><B21StoryReturn/></div>
      <Suspense fallback={<p className="b21-u4-panel" role="status">실제 앱 화면을 불러옵니다.</p>}><AppDestination/></Suspense>
    </>}
  </div>;
}
