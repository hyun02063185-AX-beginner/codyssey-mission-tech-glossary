import { Link, useLocation } from 'react-router-dom';
import { readStoryReturn, sourceLabel } from './links/returnAddress';
import { routeURL } from './routing/storyRoute';

/** Not installed in public App.tsx. U4 private Preview/test entry only. */
export default function B21StoryReturn() {
  const {pathname,search}=useLocation();
  const source=readStoryReturn(pathname,search);
  if(!source)return null;
  return <nav className="b21-story-return" aria-label="B2-1 Story로 복귀"><Link to={routeURL(source)}>← B2-1 Story로 돌아가기 · {sourceLabel(source)}</Link></nav>;
}
