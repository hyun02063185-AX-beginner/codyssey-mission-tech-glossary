import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { readExplorerTermReturn, readLearningReturn, readReviewReturn, learningReturnHref } from './returnContext';
import { sourceLabel } from '../b21StoryV3/links/returnAddress';
import { b21StoryPath } from './paths';
import './service.css';
export default function B21LearningReturn() {
  const location=useLocation(),previous=useRef(location.pathname);
  const explorer=readReviewReturn(location.pathname,location.state?.b21Explorer)??readExplorerTermReturn(location.pathname,location.search);
  const story=new URLSearchParams(location.search).has('b21-explorer')?null:readLearningReturn(location.pathname,location.search);
  useEffect(()=>{
    if(previous.current!==location.pathname&&location.pathname===b21StoryPath)document.getElementById('q')?.focus();
    previous.current=location.pathname;
  },[location.pathname]);
  if(!explorer&&!story)return null;
  return <nav className="b21-service-return" aria-label="B2-1 학습 위치로 복귀"><Link to={explorer??learningReturnHref(story!)}>{explorer?'← 전체 개념지도로 돌아가기 · 탐색 위치 유지':`← B2-1 Story로 돌아가기 · ${sourceLabel(story!)}`}</Link></nav>;
}
