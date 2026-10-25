import { lazy, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
const Return=lazy(()=>import('./B21LearningReturn'));
/** Ordinary pages do not load the lesson/map data just to check for a banner. */
export default function B21ReturnGate() {
  const location=useLocation(),query=new URLSearchParams(location.search);
  if(query.has('b31-map')||(!query.has('b21-story')&&!query.has('b21-explorer')&&!location.state?.b21Explorer))return null;
  return <Suspense fallback={null}><Return/></Suspense>;
}
