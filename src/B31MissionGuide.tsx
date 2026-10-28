import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useParams, useSearchParams } from 'react-router-dom';
import Markdown, {type Components} from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import readme from '../content/mission-guides/main-m05/README.md?raw';
import instructor from '../content/mission-guides/main-m05/instructor-notes.md?raw';
import qa from '../content/mission-guides/main-m05/qa-draft.md?raw';
import webQA from '../content/mission-guides/main-m05/qa-web.md?raw';
import supplement from '../content/mission-guides/main-m05/supplement/README.md?raw';
import { b31GuideAsset, b31GuideChapters, b31GuideLink, b31GuidePath, b31SupplementAsset, b31SupplementLink, b31SupplementPath } from './b31GuideContent';
import './missionGuide.css';
import PacketJourney from './b31PacketJourney/PacketJourney';

function ChapterLinks() {
  return <nav aria-label="학습 단원"><ol>{b31GuideChapters.map(chapter => <li key={chapter.id}><NavLink to={`${b31GuidePath}/${chapter.id}`} end>{chapter.title}</NavLink></li>)}</ol></nav>;
}

export default function B31MissionGuide() {
  const { chapterId } = useParams();
  const location = useLocation();
  const [params] = useSearchParams();
  const article = useRef<HTMLElement>(null);
  const [headings, setHeadings] = useState<{ id: string; text: string }[]>([]);
  const index = b31GuideChapters.findIndex(item => item.id === chapterId);
  const chapter = b31GuideChapters[index];
  const documents: Record<string, string> = { README: readme, instructor, qa, webQA, supplement };
  const isSupplement = !chapterId && params.get('document') === 'supplement';
  const markdown = chapter?.markdown ?? documents[params.get('document') ?? ''];

  // Stable Markdown component types retain focus and playback across heading updates.
  const markdownComponents = useMemo<Components>(() => ({
    h1: ({ node: _node, ...props }) => <h1 tabIndex={-1} {...props} />,
    h2: ({ node: _node, ...props }) => <h2 tabIndex={-1} {...props} {...(isSupplement && String(props.children).startsWith('체험 학습 — 패킷의 여행:') ? {id:'packet-journey'} : {})} />,
    h3: ({ node: _node, ...props }) => <><h3 tabIndex={-1} {...props} />{isSupplement && props.children === '패킷을 한 단계씩 보내 보기' && <PacketJourney />}</>,
    a: ({ href = '', children }) => {
      const target = isSupplement ? b31SupplementLink(href) : b31GuideLink(href, chapterId);
      if (target.startsWith('/missions/') || target.startsWith('/terms/')) return <Link to={target}>{children}</Link>;
      return <a href={target} target="_blank" rel="noopener noreferrer">{children}</a>;
    },
    img: ({ src = '', alt = '' }) => {
      const url = isSupplement ? b31SupplementAsset(src) : b31GuideAsset(src);
      if (!url) return <span>{alt}</span>;
      const overview = isSupplement && src.endsWith('00-enterprise-network-overview.svg');
      return <><span className="b31-figure-hint">{overview ? '전체도는 좌우로 밀어 읽고, 아래에서 크게 열 수 있습니다.' : '그림을 좌우로 밀어 보세요'}</span><span className={`b31-figure-scroll${overview ? ' b31-figure-overview' : ''}${isSupplement ? ' b31-figure-supplement' : ''}`} role="region" aria-label={`${alt} — 그림 가로 스크롤 가능`} tabIndex={0}><img src={url} alt={alt} /></span></>;
    },
    pre: ({ children }) => <pre tabIndex={0} aria-label="코드 예제 (가로 스크롤 가능)">{children}</pre>,
    table: ({ children }) => <div className="guide-table" role="region" aria-label="본문 표 (가로 스크롤 가능)" tabIndex={0}><table>{children}</table></div>,
  }), [isSupplement, chapterId]);

  useEffect(() => {
    setHeadings(Array.from(article.current?.querySelectorAll('h2') ?? []).map(heading => ({ id: heading.id, text: heading.textContent ?? '' })));
  }, [markdown]);
  useEffect(() => {
    if (location.hash) {
      let id = location.hash.slice(1);
      try { id = decodeURIComponent(id); } catch { /* Leave malformed fragments unchanged. */ }
      const target = document.getElementById(id);
      target?.scrollIntoView();
      target?.focus({ preventScroll: true });
    } else {
      window.scrollTo(0, 0);
      article.current?.querySelector('h1')?.focus({ preventScroll: true });
    }
  }, [location, markdown]);

  if (chapterId && !chapter) return <section><h1>단원을 찾을 수 없습니다.</h1><Link to={b31GuidePath}>전체 목차로 돌아가기</Link></section>;
  return <div className="mission-guide b31-guide">
    <div className="guide-toolbar"><Link to="/missions/main-M05">← B3-1 미션</Link><Link to={b31GuidePath}>전체 목차</Link></div>
    {!markdown ? <section className="guide-index"><p className="eyebrow">B3-1 학습 가이드</p><h1>내 웹사이트는 어떻게<br />인터넷에서 열릴까?</h1><p>일반 네트워크의 역할을 AWS 구성에 연결하며 7개 단원으로 읽어 보세요.</p><section className="b31-supplement-entry"><p className="eyebrow">구성도로 먼저 보기</p><h2>기업 홈페이지 네트워크 전체도</h2><p>방문자 접속, 직원 게시, 웹 서버의 자료 조회를 한 장에서 보고 AWS의 역할과 비교합니다. 2장 앞에 읽으면 좋습니다.</p><Link to={b31SupplementPath}>기업망 보강 자료 읽기 →</Link></section><ChapterLinks /><Link to={`${b31GuidePath}?document=README`}>가이드 소개와 표기 규칙</Link></section> : <div className={`guide-layout${isSupplement ? ' b31-supplement-layout' : ''}`}>
      <aside className="guide-sidebar"><ChapterLinks /><Link to={b31SupplementPath}>기업망 보강 자료</Link></aside>
      <div className="guide-reading">
        <details className="guide-mobile-nav" key={chapterId ?? params.toString()}><summary>{chapter ? `현재 단원 ${index + 1} / 7 · 단원 이동` : isSupplement ? '기업망 보강 자료 · 단원 이동' : '단원 이동'}</summary><ChapterLinks /><Link to={b31SupplementPath}>기업망 보강 자료</Link></details>
        {headings.length > 0 && <details className="guide-headings"><summary>이 문서의 주요 제목</summary><nav aria-label="문서 내 탐색">{headings.map(heading => <Link key={heading.id} to={`${location.pathname}${location.search}#${heading.id}`}>{heading.text}</Link>)}</nav></details>}
        <article ref={article} tabIndex={-1} className={`guide-prose${isSupplement ? ' b31-supplement' : ''}`}>
          <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]} components={markdownComponents}>{markdown}</Markdown>
        </article>
        {chapter && <nav className="guide-pagination" aria-label="이전 다음 단원">{index > 0 && <Link to={`${b31GuidePath}/${b31GuideChapters[index - 1].id}`}>← 이전 단원<br />{b31GuideChapters[index - 1].title}</Link>}{index < b31GuideChapters.length - 1 && <Link to={`${b31GuidePath}/${b31GuideChapters[index + 1].id}`}>다음 단원 →<br />{b31GuideChapters[index + 1].title}</Link>}<Link to={b31GuidePath}>전체 목차</Link></nav>}
      </div>
    </div>}
  </div>;
}
