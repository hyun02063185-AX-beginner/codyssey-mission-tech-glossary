import { useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import LearningFocusNav from '../missionUI/LearningFocusNav';
import { PresentationSurface, PresentationThemeSelector } from '../missionUI/PresentationTheme';
import glossary from '../data/generated/glossary.json';
import { returnFocus } from './B32CycleLinks';
import B32LabMarkdown, { LabDetails } from './B32LabMarkdown';
import B32LabFigures from './B32LabFigures';
import {
  cleanup, getLab, indexSections, labHref, labOverview, labs, mainScreen, optionalCleanup,
  readLabOrigin, resultIndex, storyFor, timeSummary, tripFor,
} from './labContent';
import { storyPath } from './content';
import { labPath } from './reviewMode';
import './b32Lab.css';

const termIds = new Set(glossary.map(term => term.id));
const resultHash = '#결과로-찾아보기';
const startStateHash = '#실습-상태-카드';
const tierAnchors: Record<string, string> = { A: '#results', B: '#b', C: '#c' };

function linkedScreens(id: string, origin: string) {
  const primary = mainScreen(id);
  const candidates = [origin, primary, 'intro', 'S1-1', 'S1-2', 'S2-1', 'S2-2', 'S3-1', 'S3-2', 'S4-1', 'S4-2'];
  return [...new Set(candidates)].filter(screen => tripFor(screen, id));
}

function preferredResultOrigin(id: string, screens: string[]) {
  const primary = mainScreen(id);
  return screens.includes(primary) ? primary : screens.find(screen => tripFor(screen, id));
}

function TermLinks({ terms, back }: { terms: string[]; back?: string }) {
  return <div className="b32-lab-mini-links">{terms.map(id => termIds.has(id)
    ? <Link key={id} to={`/terms/${id}${back ? `?b32-lab=${encodeURIComponent(back)}` : ''}`}>{id}</Link>
    : null)}</div>;
}

function ResultIndex() {
  return <section id={resultHash.slice(1)} tabIndex={-1}>
    <h2>결과로 찾아보기</h2>
    <ul className="b32-result-index">
      {resultIndex.map((row, index) => <li key={row.output} id={`결과-${index}`} tabIndex={-1}>
        <h3><B32LabMarkdown inline text={row.output}/></h3>
        <B32LabMarkdown text={row.meaning}/>
        <div className="b32-lab-mini-links">
          {row.targets.map(({ lab, tier }) => <Link key={`${lab}-${tier}`}
            to={labHref(lab, preferredResultOrigin(lab, row.screens), tierAnchors[tier])}>
            Lab {lab} · {tier === 'A' ? '실행 기록' : tier === 'B' ? '추가 탐구' : '문제 해결'}
          </Link>)}
          {row.screens.map(screen => <Link key={screen} to={storyFor(screen)}>스토리 {screen}</Link>)}
        </div>
        <TermLinks terms={row.terms} back={`index:${index}`}/>
      </li>)}
    </ul>
  </section>;
}

function LabIndex() {
  return <>
    <header className="b32-lab-heading">
      <p className="b32-lab-kicker">B3-2 · 따라 하기 실습</p>
      <h1 tabIndex={-1}>실습 목차</h1>
      <p>Git 변경이 AI 초안이 되기까지</p>
      <div className="b32-lab-index-summary">
        <div>핵심 실습 <B32LabMarkdown inline text={timeSummary[0]}/></div>
        <div>추가 탐구 <B32LabMarkdown inline text={timeSummary[1]}/></div>
        <div>핵심 API <B32LabMarkdown inline text={timeSummary[2]}/></div>
      </div>
      <nav className="b32-lab-mini-links" aria-label="실습 공통 자료">
        <Link to={resultHash}>결과로 찾아보기</Link>
        {indexSections.map(([id, title]) => <Link key={id} to={`#${id}`}>{title}</Link>)}
        <Link to={labHref('09', undefined, '#실습-정리')}>실습 정리</Link>
      </nav>
    </header>
    <ol className="b32-lab-index">
      {labs.map(lab => <li key={lab.id}>
        <p className="b32-lab-kicker">Lab {lab.id}</p>
        <h2><Link to={labHref(lab.id)}>{lab.title}</Link></h2>
        <p>핵심 {lab.minutes} · 추가 <B32LabMarkdown inline text={lab.optionalMinutes}/> · API {lab.calls.replaceAll('*', '')}회</p>
        <p>키 <B32LabMarkdown inline text={lab.key}/> · <Link to={storyFor(mainScreen(lab.id))}>스토리 {mainScreen(lab.id)}</Link></p>
      </li>)}
    </ol>
    <LabDetails label="학습 경로와 이용 방법"><B32LabMarkdown text={labOverview}/></LabDetails>
    <ResultIndex/>
    {indexSections.map(([id, title, text]) => <section key={id} id={id} tabIndex={-1}>
      <h2>{title}</h2><B32LabMarkdown text={text}/>
    </section>)}
  </>;
}

function ReturnCard({ id, origin }: { id: string; origin: string }) {
  const trip = tripFor(origin, id);
  const example = getLab(id)?.example;
  if (!trip) return null;
  return <section className="b32-lab-return-card" aria-label="스토리에서 다시 확인하기" data-round-trip={trip.id}>
    <h3>스토리에서 다시 확인하기</h3>
    <B32LabMarkdown text={returnFocus(origin, id) ?? ''}/>
    <strong>확인 질문</strong>
    <B32LabMarkdown text={origin === 'intro' ? '방금 한 작업은 그림의 어느 경계 안에서 일어났나요?' : trip.check}/>
    {example && <LabDetails label="예시 답 보기">
      <B32LabMarkdown text={example.question}/>
      <B32LabMarkdown text={example.answer}/>
    </LabDetails>}
    <div className="b32-lab-mini-links">
      <Link to={storyFor(origin, id)}>{origin === 'intro' ? '강의 소개' : origin}로 돌아가기</Link>
      {linkedScreens(id, origin).filter(screen => screen !== origin).map(screen =>
        <Link key={screen} to={storyFor(screen, id)}>{screen === 'intro' ? '강의 소개' : screen}에서 이어 보기</Link>)}
    </div>
  </section>;
}

function LabCommands({ commands, id }: { commands: string; id: string }) {
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width:599px)').matches);
  useLayoutEffect(() => {
    const query = window.matchMedia('(max-width:599px)');
    const update = () => setMobile(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  const content = <B32LabMarkdown text={commands} lab={id}/>;
  return mobile ? <LabDetails label="PC에서 실습 · 실행 명령">{content}</LabDetails> : content;
}

function LabLesson({ lab, origin, hash }: { lab: typeof labs[number]; origin: string; hash: string }) {
  const { id } = lab;
  const trip = tripFor(origin, id);
  const index = labs.indexOf(lab);
  const prev = labs[index - 1];
  const next = labs[index + 1];
  const returnLabel = origin === 'intro' ? '강의 소개' : origin;
  return <>
    <header className="b32-lab-heading">
      <nav className="b32-lab-heading-links" aria-label="실습 탐색">
        <Link className="b32-lab-back" to={storyFor(origin, id)}>← {returnLabel}로 돌아가기</Link>
        <Link to={labPath}>Lab 목차</Link>
      </nav>
      <p className="b32-lab-kicker">B3-2 · Lab {id}</p>
      <h1 tabIndex={-1}>{lab.title}</h1>
      <B32LabMarkdown text={lab.purpose}/>
      <div className="b32-lab-meta"><B32LabMarkdown text={lab.meta}/></div>
      {lab.cost && <div className="b32-lab-cost"><B32LabMarkdown text={lab.cost}/></div>}
      {lab.conditions ? <B32LabMarkdown text={lab.conditions}/> : id === '01' &&
        <p><strong>시작 조건</strong> <B32LabMarkdown inline text={lab.startState}/></p>}
      <nav className="b32-lab-mini-links" aria-label="관련 스토리와 실습 자료">
        <Link to={`${labPath}${startStateHash}`}>실습 상태 카드</Link>
        <Link to="#results">실행 기록 보기</Link>
        <Link to="#c">문제 해결 바로가기</Link>
        {!['01', '02', '03'].includes(id) && <Link to={labHref('01')}>연습 저장소 준비</Link>}
        {linkedScreens(id, origin).map(screen =>
          <Link key={screen} to={storyFor(screen, id)}>{screen === 'intro' ? '강의 소개' : `스토리 ${screen}`}</Link>)}
      </nav>
    </header>
    <section className="b32-lab-core" id="a">
      <h2>A. 핵심 실습</h2>
      {trip && <div className="b32-lab-question" data-round-trip={trip.id}>
        <strong>스토리에서 가져온 질문</strong>
        <B32LabMarkdown text={origin === 'intro' ? '연습 저장소와 Python 프로그램은 어디서 작동할까요?' : trip.question}/>
      </div>}
      <B32LabMarkdown text={lab.questions}/>
      <LabCommands commands={lab.commands} id={id}/>
      <B32LabMarkdown text={lab.observations}/>
      <LabDetails id="results" label="실행 기록 · 결과 해설 · 도식" open={hash === '#results'}>
        <B32LabMarkdown text={lab.results} lab={id}/>
        <B32LabFigures id={id}/>
      </LabDetails>
      <ReturnCard id={id} origin={origin}/>
    </section>
    <LabDetails id="b" label={<>B. 추가 탐구 <span><B32LabMarkdown inline text={lab.optionalMinutes}/></span></>} open={hash === '#b'}>
      <B32LabMarkdown text={lab.optional} lab={id}/>
    </LabDetails>
    <LabDetails id="c" label="C. 문제 해결" open={hash === '#c'}>
      <B32LabMarkdown text={lab.troubleshooting} lab={id}/>
    </LabDetails>
    {id === '09' && <section id="실습-정리" tabIndex={-1}>
      <h2>실습 정리</h2><B32LabMarkdown text={cleanup}/>
      <LabDetails label="선택 · 실습 폴더 정리 (강사 안내 시)"><B32LabMarkdown text={optionalCleanup}/></LabDetails>
    </section>}
    <section><h2>관련 용어</h2><TermLinks terms={lab.terms} back={`${id}:${origin}`}/></section>
    <nav className="b32-lab-bottom b32-lab-mini-links" aria-label="Lab 둘러보기">
      {prev && <Link to={labHref(prev.id)}>← Lab {prev.id} · {prev.title}</Link>}
      <Link to={labPath}>Lab 목차</Link>
      {next && <Link to={labHref(next.id)}>Lab {next.id} · {next.title} →</Link>}
    </nav>
  </>;
}

export default function B32Lab() {
  const { labId } = useParams();
  const { hash, search, key } = useLocation();
  const lab = getLab(labId);
  const origin = lab ? readLabOrigin(search, lab.id) : '';
  const article = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    document.title = lab ? `Lab ${lab.id} · ${lab.title}` : 'B3-2 · 실습 목차';
    let anchor = '';
    try { anchor = decodeURIComponent(hash.slice(1)); } catch { /* Malformed fragments use the heading. */ }
    const target = anchor && document.getElementById(anchor);
    if (target && article.current?.contains(target)) {
      target.scrollIntoView();
      (target.querySelector('summary') ?? target).focus({ preventScroll: true });
    } else {
      window.scrollTo(0, 0);
      article.current?.querySelector('h1')?.focus({ preventScroll: true });
    }
    return () => { document.title = '코디세이 기술용어 사전'; };
  }, [hash, key, lab]);

  return <PresentationSurface>
    <div className="b32-lab">
      <LearningFocusNav missionId="main-m06" active="story" storyHref={origin ? storyFor(origin) : storyPath}>
        <Link to={labPath}>Lab 목차</Link>
        <Link to={`${labPath}${resultHash}`}>결과로 찾아보기</Link>
        <PresentationThemeSelector/>
      </LearningFocusNav>
      <main className="b32-lab-page" ref={article} key={labId ?? 'index'}>
        {lab ? <LabLesson lab={lab} origin={origin} hash={hash}/> : labId ? <>
          <h1 tabIndex={-1}>Lab을 찾을 수 없습니다</h1>
          <Link to={labPath}>9개 Lab 목차 보기</Link>
        </> : <LabIndex/>}
      </main>
    </div>
  </PresentationSurface>;
}
