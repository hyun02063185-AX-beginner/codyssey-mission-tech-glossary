import type { KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import type { StoryExtensions } from '../B21TeachingStory';
import type { StoryRoute } from '../routing/storyRoute';
import { termStoryHref, sourceLabel } from '../links/returnAddress';
import { extensionNotice, type TermConnection } from '../links/catalog';
import { learningPresentation } from '../links/presentation';
import { connectionsForSource } from '../links/contextLinks';
import { guides } from '../../missionGuideContent';
import './storyLearningLinks.css';

function keepLinkNavigation(event: KeyboardEvent) {
  if(['ArrowLeft','ArrowRight','PageUp','PageDown','Home','End'].includes(event.key))event.stopPropagation();
}
function Terms({terms,source}: {terms:readonly TermConnection[];source:StoryRoute}) {
  return <ul className="b21-learning-term-list">{terms.map(term=><li key={term.termId} data-term-id={term.termId} data-mode={term.mode}>
    <Link to={termStoryHref(term.termId,source)}><span>{term.label}</span><span className={`b21-learning-kind ${term.mode}`}>{term.mode==='direct'?'직접 연결':'범위 확장'} <span aria-hidden="true">↗</span></span></Link>
    {term.mode==='extension'&&<p className="b21-learning-caution">{extensionNotice} {term.notice}</p>}
  </li>)}</ul>;
}
function NoteLearning({source}: {source:StoryRoute}) {
  const {scene,area,noteTerms}=learningPresentation(source);
  return <details className="b21-learning-links b21-learning-notes" data-testid="learning-notes" onKeyDown={keepLinkNavigation}>
    <summary>관련 용어·심화 학습 <span>선택형</span></summary>
    <div className="b21-learning-content"><p className="b21-learning-eyebrow">{area?`${area.name} · 선택 영역`:`Scene ${scene.id} · 장면 관련 용어`}</p>
      {noteTerms.length?<><p>필요할 때 더 살펴보세요. 용어 화면의 복귀 링크로 {sourceLabel(source)}에 돌아옵니다.</p><Terms terms={noteTerms} source={source}/></>:<p>개념지도에서 학습 영역을 선택하면 그 영역과 관련된 용어가 나타납니다.</p>}
    </div>
  </details>;
}
function SelectedAreaLearning({source}: {source:StoryRoute}) {
  const {area,areaTerms}=learningPresentation(source);
  if(!area)return null;
  return <aside className="b21-learning-links b21-learning-area" data-testid="learning-area" aria-labelledby="learning-area-title" onKeyDown={keepLinkNavigation}>
    <div className="b21-learning-heading"><div><p className="b21-learning-eyebrow">선택한 학습 영역 · Scene 08</p><h2 id="learning-area-title">{area.name} 더 살펴보기</h2></div><span className="b21-learning-count">관련 용어 {areaTerms.length}개</span></div>
    <p>개념은 용어사전에서 더 살펴보고, 복귀 링크로 지금 선택한 영역에 돌아오세요.</p><Terms terms={areaTerms} source={source}/>
  </aside>;
}
function FurtherLearning({source}: {source:StoryRoute}) {
  const {isSummary,scene}=learningPresentation(source),links=connectionsForSource(source);
  if(!isSummary)return null;
  return <section className="b21-learning-links b21-learning-further" data-testid="learning-further" aria-labelledby="learning-further-title" onKeyDown={keepLinkNavigation}>
    <p className="b21-learning-eyebrow">Scene {scene.id} 정리 · 개념 이해 다음 단계</p><h2 id="learning-further-title">더 학습하기</h2>
    <p>학습가이드에서 내 프로젝트로 직접 해 보고, 코드와 실행 결과를 검증하는 방법을 확인하세요.</p>
    <ul className="b21-learning-guide-list">{links.guides.map(guide=><li key={guide.chapter}><Link to={guide.href}><span className="b21-learning-guide-icon" aria-hidden="true">↗</span><span><small>실습 가이드 읽기</small><strong>{guides['main-M03'].guideChapters.find(chapter=>chapter.id===guide.chapter)!.title}</strong></span></Link></li>)}</ul>
    {!!links.maps.length&&<div className="b21-learning-field"><h3>분야 전체에서 연결하기</h3>{links.maps.map(map=><Link key={map.href} to={map.href}>데이터·데이터베이스 분야 지도 <span aria-hidden="true">↗</span></Link>)}<p>분야 지도에서 이 강의로 돌아오려면 브라우저 뒤로가기를 사용하세요.</p></div>}
  </section>;
}
/** Only the private U4 Preview supplies these optional slots. */
export function learningLinkExtensions(source: StoryRoute): StoryExtensions {
  return {
    instructorNotesFooter:<NoteLearning key={source.scene} source={source}/>,
    afterLecture:<div className="b21-learning-supplements"><SelectedAreaLearning source={source}/><FurtherLearning source={source}/></div>,
  };
}
