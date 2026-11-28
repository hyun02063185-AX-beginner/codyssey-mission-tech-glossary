import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import LearningFocusNav from '../missionUI/LearningFocusNav';
import MissionStoryOverview from '../missionUI/MissionStoryOverview';
import { PresentationSurface, PresentationThemeSelector } from '../missionUI/PresentationTheme';
import { storyPath, screenHref, readStoryState, authoredScreen, introNotes, demoNotes, guideLinks } from './content';
import * as approvedLesson from './lessonContent';
import B32Figure from './B32Figure';
import B32MarkdownV04 from './B32MarkdownV04';
import { integratedStoryState } from './integratedNavigation';
import type { IntegratedLesson, IntegratedScreen } from './parseStoryboardV04';
import { splitLearningCheck, type LearningCheck } from '../../content/mission-stories/main-m06/_tools/storyboard-v02.mjs';
import './b32Story.css';

const explanationId = 'b32-slide-explanation';

function CheckAnswer({ question, answer, integrated }: LearningCheck & { integrated: boolean }) {
  const AnswerMarkdown = integrated ? B32MarkdownV04 : Markdown;
  return <>
    <AnswerMarkdown>{question}</AnswerMarkdown>
    <details className="b32-check-answer">
      <summary>정답 보기</summary>
      <AnswerMarkdown>{answer}</AnswerMarkdown>
    </details>
  </>;
}

type IntegratedPresentation = {
  lesson: IntegratedLesson;
  introActions: ReactNode;
  introOrientation: ReactNode;
  header: (screen: IntegratedScreen) => ReactNode;
  body: (screen: IntegratedScreen) => ReactNode;
  explanation: (screen: IntegratedScreen) => ReactNode;
  guides: (screen: IntegratedScreen) => ReactNode;
};

type ReviewOptions = {
  integrated?: IntegratedPresentation;
  lesson?: typeof approvedLesson;
  readReturn?: (search: string, screen: string) => string | undefined;
  practice?: (screen: string, copy: string) => ReactNode;
  returnNote?: (id: string, screen: string, dismiss: () => void) => ReactNode;
  drafts?: (previous: string) => ReactNode;
};

export default function B32Story({ lesson = approvedLesson, readReturn, practice, returnNote, drafts, integrated }: ReviewOptions) {
  const { intro, scenes, screens } = integrated?.lesson ?? lesson;
  const isIntegrated = Boolean(integrated);
  const StoryMarkdown = isIntegrated ? B32MarkdownV04 : Markdown;
  const href = (index: number) => screenHref(index, screens);
  const sceneLinks = Object.entries(scenes).map(([id, scene]) => ({
    id, label: `Scene ${id}`, title: scene.title, href: href(screens.findIndex(screen => screen.scene === id)),
  }));
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search.slice(0, 1025));
  const labParameter = location.search.length <= 1024 && query.has('from-lab') && readReturn;
  if (labParameter) query.delete('from-lab');
  const integratedState = integrated && integratedStoryState(location.search, screens);
  const state = integratedState ?? readStoryState(labParameter ? (query.size ? `?${query}` : '') : location.search, screens);
  const screen = screens[state.index];
  const integratedScreen = integrated?.lesson.screens[state.index];
  const legacyScreen = integrated ? undefined : lesson.screens[state.index];
  const returnId = integratedState
    ? integratedState.returnId
    : !state.notice && readReturn?.(location.search, state.overview ? 'intro' : screen.id);
  const canonical = returnId
    ? `${state.canonical}${state.overview ? '?' : '&'}from-lab=${returnId}`
    : state.canonical;
  const dismissReturn = () => navigate(state.canonical, { replace: true });
  const authored = legacyScreen && authoredScreen(screen.id);
  const check = screen.check ?? (authored && { ...splitLearningCheck(authored.check), label: '이해 확인' });
  const reviewLayout = Boolean(practice || integrated);
  const heading = useRef<HTMLHeadingElement>(null);
  const explanationHeading = useRef<HTMLHeadingElement>(null);
  const explanationButton = useRef<HTMLButtonElement>(null);
  const [notice, setNotice] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (state.notice) setNotice(state.notice);
    else if (isIntegrated && returnId) setNotice('');
    if ((!state.overview || labParameter) && location.pathname + location.search !== canonical) {
      navigate(canonical, { replace: true });
    }
  }, [state.notice, state.overview, canonical, isIntegrated, returnId, labParameter, location.pathname, location.search, navigate]);

  useEffect(() => {
    document.title = state.overview ? `B3-2 · ${intro.title}` : `${screen.id} · ${screen.title}`;
    return () => { document.title = '코디세이 기술용어 사전'; };
  }, [state.overview, screen.id, screen.title]);

  useLayoutEffect(() => {
    setOpen(false);
    if (reviewLayout) window.scrollTo(0, 0);
    heading.current?.focus({ preventScroll: true });
  }, [location, reviewLayout]);

  useLayoutEffect(() => {
    if (open) explanationHeading.current?.focus({
      preventScroll: !reviewLayout || !window.matchMedia('(max-width:1239px)').matches,
    });
  }, [open, reviewLayout]);

  const closeExplanation = useCallback(() => {
    setOpen(false);
    explanationButton.current?.focus({
      preventScroll: !reviewLayout || !window.matchMedia('(max-width:1239px)').matches,
    });
  }, [reviewLayout]);

  useEffect(() => {
    if (state.overview) return;
    function onKey(event: globalThis.KeyboardEvent) {
      if (event.defaultPrevented || event.isComposing || event.repeat || event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.target;
      const shortcut = event.key.toLowerCase() === 'p';
      if (shortcut && target instanceof HTMLElement && target.closest('input,textarea,select,[contenteditable]:not([contenteditable=false]),dialog')) return;
      if (shortcut || (open && event.key === 'Escape')) {
        event.preventDefault();
        if (open) closeExplanation();
        else setOpen(true);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [state.overview, open, closeExplanation]);

  if (state.overview) {
    const figure = <div className="b32-intro-figure"><B32Figure desktop={intro.desktop} mobile={intro.mobile}/></div>;
    const overview = <>
      <LearningFocusNav missionId="main-m06" active="story" />
      <MissionStoryOverview missionCode={intro.code} title={intro.title} subtitle={intro.subtitle} question={intro.question}
        scenes={sceneLinks} openOrientation={returnId ? true : undefined}
        entryActions={integrated?.introActions ?? (practice && intro.practice && <div className="b32-cycle-intro">
          <PresentationThemeSelector/>
          {practice('intro', intro.practice)}
          {returnId && returnNote?.(returnId, 'intro', dismissReturn)}
        </div>)}
        orientation={<>
          <StoryMarkdown>{intro.draftDefinition}</StoryMarkdown>
          <ol>{intro.goals.map(goal => <li key={goal}>{integrated ? <StoryMarkdown>{goal}</StoryMarkdown> : goal}</li>)}</ol>
          <StoryMarkdown>{intro.learningGuide}</StoryMarkdown>
          {practice ? figure : <PresentationSurface>{figure}</PresentationSurface>}
          {integrated ? integrated.introOrientation : <details><summary>발표자 노트 · 시작</summary><Markdown>{introNotes}</Markdown></details>}
        </>} />
    </>;
    return practice ? <PresentationSurface>{overview}</PresentationSurface> : overview;
  }

  function move(index: number) {
    if (screens[index]) navigate(href(index));
  }

  function handleSlideKeys(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    if (event.altKey || event.ctrlKey || event.metaKey || event.isDefaultPrevented() ||
        target.closest('button,a,select,input,textarea,summary,[contenteditable],.b32-explanation-body,.b32-integrated-scroll,.b32-integrated-practice pre,.b32-lab-table-scroll')) return;
    if (['ArrowRight', 'PageDown'].includes(event.key)) {
      event.preventDefault();
      move(state.index + 1);
    }
    if (['ArrowLeft', 'PageUp'].includes(event.key)) {
      event.preventDefault();
      move(state.index - 1);
    }
  }

  return <PresentationSurface>
    <div className="b32-story" data-b32-review={reviewLayout || undefined} data-b32-integrated={integrated ? true : undefined}>
      <LearningFocusNav missionId="main-m06" active="story" storyHref={href(state.index)}>
        <Link to={storyPath}>강의 소개 보기</Link>
        <PresentationThemeSelector />
      </LearningFocusNav>

      <div className="b32-deck" onKeyDown={handleSlideKeys}>
        <article className="b32-lesson" data-returned={returnId ? true : undefined} data-screen={screen.id} aria-labelledby="b32-message">
          {notice && !(isIntegrated && returnId) && <p role="status">{notice} <button onClick={() => setNotice('')}>안내 닫기</button></p>}
          <header className="b32-heading">
            <div className="b32-heading-top">
              <div className="b32-slide-meta">
                <p className="b32-slide-title">{screen.id} · {screen.title}</p>
                <p className="b32-technology" aria-label={integrated ? '현재 관점' : '현재 학습 기술'}>{screen.technology}</p>
              </div>
              <nav className="b32-controls b32-top-controls" aria-label="슬라이드 상단 탐색">
                <button type="button" ref={explanationButton} aria-expanded={open} aria-controls={explanationId}
                  aria-keyshortcuts="P" onClick={() => open ? closeExplanation() : setOpen(true)}>
                  {open ? '설명 닫기' : '설명 보기'} <kbd aria-hidden="true">P</kbd>
                </button>
                <button disabled={!state.index} onClick={() => move(state.index - 1)}>이전</button>
                <span aria-label="현재 슬라이드">{state.index + 1} / {screens.length}</span>
                <button disabled={state.index === screens.length - 1} onClick={() => move(state.index + 1)}>다음</button>
              </nav>
            </div>
            <h1 id="b32-message" tabIndex={-1} ref={heading}>
              {integrated ? <StoryMarkdown components={{ p: ({ children }) => <>{children}</> }}>{screen.message}</StoryMarkdown> : screen.message}
            </h1>
            {integratedScreen && integrated?.header(integratedScreen)}
            {!integrated && <Markdown components={{ p: ({ children }) => <p className="b32-caption">{children}</p> }}>{screen.caption}</Markdown>}
            {practice && legacyScreen?.practice && practice(screen.id, legacyScreen.practice)}
            {returnId && returnNote?.(returnId, screen.id, dismissReturn)}
          </header>
          {integratedScreen && integrated ? <>
            <nav className="b32-perspectives" aria-label="Scene 관점">
              {sceneLinks.map(scene => <Link key={scene.id} to={scene.href} aria-current={screen.scene === scene.id ? 'step' : undefined}>
                {scene.label} · {integrated.lesson.scenes[scene.id].perspective}
              </Link>)}
            </nav>
            <div className="b32-integrated-caption"><StoryMarkdown>{screen.caption}</StoryMarkdown></div>
            <div key={screen.id} className="b32-integrated-material">{integrated.body(integratedScreen)}</div>
          </> : legacyScreen && <>
            <B32Figure journey desktop={['f0-journey-v02-desktop.svg', legacyScreen.journey]} mobile={['f0-journey-v02-mobile.svg', legacyScreen.journey]} />
            <B32Figure desktop={legacyScreen.desktop} mobile={legacyScreen.mobile} />
          </>}
          <nav className="b32-controls" aria-label="B3-2 강의 조작">
            <label>Scene <select aria-label="Scene 선택" value={screen.scene}
              onChange={event => move(screens.findIndex(item => item.scene === event.target.value))}>
              {Object.entries(scenes).map(([id, item]) => <option key={id} value={id}>{id} · {item.title}</option>)}
            </select></label>
            <span>{state.index + 1} / {screens.length}</span>
            <button disabled={!state.index} onClick={() => move(state.index - 1)}>이전</button>
            <button disabled={state.index === screens.length - 1} onClick={() => move(state.index + 1)}>다음</button>
          </nav>
        </article>

        <section className="b32-explanation" id={explanationId} hidden={!open}
          aria-labelledby="b32-explanation-title">
          <div className="b32-explanation-header">
            <div>
              <p>화면 해설 · {screen.id}</p>
              <h2 id="b32-explanation-title" ref={explanationHeading} tabIndex={-1}>{screen.title}</h2>
            </div>
            <button type="button" aria-label="화면 해설 닫기" onClick={closeExplanation}>닫기</button>
          </div>
          <div className="b32-explanation-body" key={screen.id} tabIndex={0} role="region" aria-label="해설 본문">
            {integratedScreen && integrated ? integrated.explanation(integratedScreen) : <Markdown>{screen.explanation}</Markdown>}
            <div className="b32-explanation-guides">
              {integratedScreen && integrated ? integrated.guides(integratedScreen) : screen.explanationGuides.map(guide => <a key={guide.href} href={guide.href} target="_blank" rel="noreferrer">{guide.label} ↗</a>)}
            </div>
          </div>
        </section>
      </div>

      <div className="b32-review" key={screen.id}>
        {check && <details>
          <summary>{check.label}</summary>
          <CheckAnswer {...check} integrated={isIntegrated} />
        </details>}
        {screen.wrapUp && <details>
          <summary>마무리 · 스스로 설명하기</summary>
          <CheckAnswer {...screen.wrapUp} integrated={isIntegrated} />
        </details>}
        {authored && authored.output && (drafts ? drafts(authored.output) : <details><summary>실제 COMMIT·PR 출력 전문</summary><Markdown remarkPlugins={[remarkGfm]}>{authored.output}</Markdown></details>)}
        {authored && <>
        <details><summary>발표자 노트 · 강사 스크립트</summary><p>학습 질문: {screen.question}</p>{drafts && <p>이전 실행 사례 · 2026-10-20</p>}
          <Markdown urlTransform={url => url === 'review.md' ? 'https://github.com/hyun02063185-AX-beginner/codyssey-mission-tech-glossary/blob/264cb6983974a6bfafe143e805249716771e6ec3/content/mission-stories/main-m06/review.md' : url}>{authored.notes}</Markdown>
          {authored.output && <Markdown>{authored.output}</Markdown>}
        </details>
        <details><summary>실제 시연 · 발표자 노트</summary>{drafts && <p>이전 실행 사례 · 2026-10-20</p>}<Markdown>{demoNotes}</Markdown></details>
        </>}
        <details><summary>관련 용어사전 · 학습가이드</summary><p>{integrated ? 'B3-2 개념지도 미구현' : '개념지도 준비 중 · 미제공'}</p>
          <div className="b32-links">
            {screen.terms.map(id => <Link key={id} to={`/terms/${id}?b32-story=${encodeURIComponent(href(state.index).split('?')[1])}`}>{id} · 용어사전</Link>)}
            {integratedScreen && integrated ? integrated.guides(integratedScreen) : legacyScreen?.guide.map(chapter => <a key={chapter} href={guideLinks[chapter]} target="_blank" rel="noreferrer">{chapter} 학습가이드 ↗</a>)}
          </div>
        </details>
      </div>
    </div>
  </PresentationSurface>;
}
