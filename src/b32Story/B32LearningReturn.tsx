import { lazy, Suspense } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { readStoryState, type ScreenAddress } from './content';
import { b32Integrated, b32Review, b32V05, labPath } from './reviewMode';
import '../b61Story/storyReturn.css';

const IntegratedReturn = b32V05 ? lazy(async () => {
  const { lessonV05 } = await import('./lessonV05');
  return { default: () => <LearningReturn screens={lessonV05.screens}/> };
}) : b32Integrated ? lazy(async () => {
  const { integratedLesson } = await import('./lessonV04');
  return { default: () => <LearningReturn screens={integratedLesson.screens}/> };
}) : null;

export default function B32LearningReturn() {
  const { pathname, search } = useLocation();
  if (!/^\/terms\/[a-z0-9-]+$/.test(pathname)) return null;
  const params = new URLSearchParams(search);
  if (IntegratedReturn && (params.has('b32-story') || params.has('b32-lab'))) {
    return <Suspense fallback={null}><IntegratedReturn/></Suspense>;
  }
  return <LearningReturn/>;
}

function LearningReturn({ screens }: { screens?: readonly ScreenAddress[] }) {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const [query, duplicateStory] = params.getAll('b32-story');
  const [lab, duplicateLab] = params.getAll('b32-lab');
  if ((b32Review || screens) && lab && duplicateLab === undefined) {
    const lesson = lab.match(/^(0[1-9]):(.*)$/);
    const result = lab.match(/^index:(\d{1,2})$/);
    const origin = lesson?.[2];
    const validOrigin = screens ? origin === '' || screens.some(screen => screen.id === origin)
      : /^(intro|S[1-4]-[12])$/.test(origin ?? '');
    const target = lesson && validOrigin ? `${labPath}/${lesson[1]}${origin ? `?from=${origin}` : ''}`
      : result ? `${labPath}#결과-${result[1]}` : null;
    if (target) return <nav className="b61-story-return" aria-label="B3-2 Lab으로 복귀">
      <Link to={target}>← B3-2 Lab의 이전 화면으로 돌아가기</Link>
    </nav>;
  }
  if (!query || duplicateStory !== undefined || query.length > 1024) return null;
  const state = readStoryState('?' + query, screens);
  return state.notice || state.canonical.split('?')[1] !== query ? null
    : <nav className="b61-story-return" aria-label="B3-2 학습으로 복귀">
      <Link to={state.canonical}>← B3-2 스토리의 이전 화면으로 돌아가기</Link>
    </nav>;
}
