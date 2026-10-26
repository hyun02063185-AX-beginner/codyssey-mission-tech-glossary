import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ConceptExplorer from './ConceptExplorer';
import { explorerHref, readExplorer } from './state';
import { b21ConceptPath } from '../b21Learning/paths';
import '../b21Learning/service.css';
import LearningFocusNav from '../missionUI/LearningFocusNav';
import {parseStorySource} from '../b21StoryV3/links/returnAddress';
import {routeURL} from '../b21StoryV3/routing/storyRoute';
export default function B21ServiceConcepts() {
  const location=useLocation(),navigate=useNavigate(),result=readExplorer(location.search);
  const [notice,setNotice]=useState(result.notice);
  const canonical=explorerHref(result.state,b21ConceptPath);
  useEffect(()=>{
    if(result.notice)setNotice(result.notice);
    if(location.pathname+location.search!==canonical)navigate(canonical,{replace:true,state:location.state});
  },[canonical,location.pathname,location.search,result.notice,navigate,location.state]);
  return <div className="b21-service-page b21-service-concepts">
    {notice&&<aside className="b21-service-return" role="alert">{notice} <button onClick={()=>setNotice('')}>안내 닫기</button></aside>}
    <ConceptExplorer path={b21ConceptPath} headingNavigation={<LearningFocusNav compact missionId="main-m03" active="concepts" conceptHref={canonical} storyState={{b21Explorer:canonical}} storyHref={result.state.origin?routeURL(parseStorySource(result.state.origin)!):undefined}/>}/>
  </div>;
}
