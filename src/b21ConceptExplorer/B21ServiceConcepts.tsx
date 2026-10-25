import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ConceptExplorer from './ConceptExplorer';
import { explorerHref, readExplorer } from './state';
import { b21ConceptPath, b21MissionPath, b21StoryPath } from '../b21Learning/paths';
import '../b21Learning/service.css';
export default function B21ServiceConcepts() {
  const location=useLocation(),navigate=useNavigate(),result=readExplorer(location.search);
  const [notice,setNotice]=useState(result.notice);
  const canonical=explorerHref(result.state,b21ConceptPath);
  useEffect(()=>{
    if(result.notice)setNotice(result.notice);
    if(location.pathname+location.search!==canonical)navigate(canonical,{replace:true,state:location.state});
  },[canonical,location.pathname,location.search,result.notice,navigate,location.state]);
  return <div className="b21-service-page"><nav className="b21-service-nav" aria-label="B2-1 학습 자료"><Link to={b21MissionPath}>← B2-1 미션 상세</Link><Link to={b21StoryPath}>미션 Story</Link></nav>
    {notice&&<aside className="b21-service-return" role="alert">{notice} <button onClick={()=>setNotice('')}>안내 닫기</button></aside>}
    <ConceptExplorer path={b21ConceptPath}/>
  </div>;
}
