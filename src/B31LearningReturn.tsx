import { Link, useLocation } from 'react-router-dom';
import { conceptHref, mapQuery } from './b31StoryNavigation';

export default function B31LearningReturn() {
  const { pathname, search } = useLocation();
  const params = new URLSearchParams(search);
  if (!pathname.startsWith('/terms/') || !params.has('b31-map')) return null;
  return <nav className="b31-context-return" aria-label="미션 학습으로 복귀"><Link to={conceptHref(mapQuery(params.get('b31-map') ?? ''))}>← B3-1 개념지도로 돌아가기</Link></nav>;
}
