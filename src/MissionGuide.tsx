import {carryGuideReturn} from './b11Story/navigation';
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useParams, useSearchParams } from 'react-router-dom';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import { guides, type Guide } from './missionGuideContent';
import './missionGuide.css';

function ChapterLinks({ guide }: { guide: Guide }) {
  const { guideChapters, guidePath } = guide;
  const location=useLocation();
  return <nav aria-label="학습 단원"><ol>{guideChapters.map(chapter => <li key={chapter.id}><NavLink to={carryGuideReturn(`${guidePath}/${chapter.id}`,location.pathname,location.search)} end>{chapter.title}</NavLink></li>)}</ol></nav>;
}

export default function MissionGuide({ missionId = 'main-M01' }: { missionId?: keyof typeof guides }) {
  const guide = guides[missionId];
  const { guidePath, guideChapters, guideAsset, guideLink, documents } = guide;
  const { chapterId } = useParams();
  const location = useLocation();
  const [params] = useSearchParams();
  const article = useRef<HTMLElement>(null);
  const [headings, setHeadings] = useState<{ id: string; text: string }[]>([]);
  const [desktop, setDesktop] = useState(() => window.matchMedia('(min-width: 1024px)').matches);
  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)');
    const update = () => setDesktop(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  const index = guideChapters.findIndex(item => item.id === chapterId);
  const chapter = guideChapters[index];
  const relatedTerms = [
    [['cli', 'CLI'], ['python', 'Python'], ['python-cli', 'Python CLI']],
    [['crud', 'CRUD'], ['input-validation', '입력 검증']],
    [['file-io', '파일 입출력'], ['json-lines', 'JSONL'], ['csv', 'CSV']],
    [['generator', 'Generator'], ['iterator', 'Iterator']],
    [['crud', 'CRUD']],
    [['temporary-file-replace-strategy', '임시 파일 교체 전략'], ['file-io', '파일 입출력']],
    [['decorator', 'Decorator'], ['exception-handling', '예외 처리']],
    [['type-hint', 'Type Hint'], ['input-validation', '입력 검증']],
    [['cli', 'CLI'], ['crud', 'CRUD'], ['generator', 'Generator'], ['decorator', 'Decorator'], ['type-hint', 'Type Hint']],
  ][index] ?? [];
  const sourceDocument = documents[params.get('document') ?? ''];
  const markdown = chapter?.markdown ?? sourceDocument;
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
  if (chapterId && !chapter) return <section><h1>단원을 찾을 수 없습니다.</h1><Link to={carryGuideReturn(guidePath,location.pathname,location.search)}>전체 목차로 돌아가기</Link></section>;
  return <div className={`mission-guide ${missionId === 'main-M03' ? 'guide-b21' : ''}`}>
    <div className="guide-toolbar"><Link to={`/missions/${missionId}`}>← {guide.label} 미션</Link><Link to={carryGuideReturn(guidePath,location.pathname,location.search)}>전체 목차</Link></div>
    {!markdown ? <section className="guide-index"><p className="eyebrow">{guide.label} 학습 가이드</p><h1>{missionId === 'main-M01' ? <>AI가 만든 웹사이트,<br />이제 내가 이해하고 설명하기</> : guide.title}</h1><p>Chapter 1부터 8까지, 그리고 전체 통합 장을 읽어 보세요.</p><ChapterLinks guide={guide} /><Link to={carryGuideReturn(`${guidePath}?document=README`,location.pathname,location.search)}>가이드 소개와 표기 규칙</Link></section> : <div className="guide-layout">
      <aside className="guide-sidebar"><ChapterLinks guide={guide} /></aside>
      <div className="guide-reading">
        <details className="guide-mobile-nav" key={chapterId ?? params.toString()}><summary>{chapter ? `현재 단원 ${index + 1} / 9 · 단원 이동` : '단원 이동'}</summary><ChapterLinks guide={guide} /></details>
        {headings.length > 0 && <details className="guide-headings"><summary>이 문서의 주요 제목</summary><nav aria-label="문서 내 탐색">{headings.map(heading => <Link key={heading.id} to={`${location.pathname}${location.search}#${heading.id}`}>{heading.text}</Link>)}</nav></details>}
        <article ref={article} tabIndex={-1} className="guide-prose">
          <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]} components={{
            h1: ({ node: _node, ...props }) => <h1 tabIndex={-1} {...props} />,
            h2: ({ node: _node, ...props }) => <h2 tabIndex={-1} {...props} />,
            h3: ({ node: _node, ...props }) => <h3 tabIndex={-1} {...props} />,
            a: ({ href = '', children }) => {
              const target = carryGuideReturn(guideLink(href, chapterId),location.pathname,location.search);
              return target.startsWith('/missions/') || target.startsWith('/terms/') ? <Link to={target}>{children}</Link> : <a href={target}>{children}</a>;
            },
            img: ({ src = '', alt = '' }) => {
              const url = guideAsset(src);
              const overview = src.endsWith(`/${guide.overview}.svg`);
              const mobile = guideAsset(src, true);
              const isWide = src.endsWith('-wide.svg');
              const wide = guideAsset(`${guide.overview}-wide.svg`);
              const readableWide = guideAsset(`${guide.overview}-wide.svg`, 'desktop') ?? wide;
              const original = missionId === 'main-M03' && overview && desktop ? wide : url;
              return <span className={`guide-figure ${overview ? 'guide-overview' : ''} ${isWide ? 'guide-wide' : ''}`}><a href={original} target="_blank" rel="noopener noreferrer" aria-label={`${alt} — 원본 새 탭에서 보기`}><picture>{overview && <source media="(min-width: 1024px)" srcSet={readableWide} />}<img src={isWide ? readableWide : mobile ?? url} alt={alt} /></picture></a><span className="guide-figure-actions"><a href={original} target="_blank" rel="noopener noreferrer">그림 원본 확대 보기 ↗</a>{overview && <a href={wide} target="_blank" rel="noopener noreferrer">PC 전체 관계도 ↗</a>}</span></span>;
            },
            pre: ({ children }) => <pre tabIndex={0} aria-label="코드 예제 (가로 스크롤 가능)">{children}</pre>,
            table: ({ children }) => <div className="guide-table" role="region" aria-label="본문 표 (가로 스크롤 가능)" tabIndex={0}><table>{children}</table></div>,
          }}>{markdown}</Markdown>
        </article>
        {missionId === 'main-M03' && chapter && <nav className="guide-related" aria-label="관련 기술용어"><strong>관련 기술용어</strong><ul>{relatedTerms.map(([id, label]) => <li key={id}><Link to={`/terms/${id}`}>{label}</Link></li>)}</ul></nav>}
        {chapter && <nav className="guide-pagination" aria-label="이전 다음 단원">{index > 0 && <Link to={carryGuideReturn(`${guidePath}/${guideChapters[index - 1].id}`,location.pathname,location.search)}>← 이전 단원<br />{guideChapters[index - 1].title}</Link>}{index < guideChapters.length - 1 && <Link to={carryGuideReturn(`${guidePath}/${guideChapters[index + 1].id}`,location.pathname,location.search)}>다음 단원 →<br />{guideChapters[index + 1].title}</Link>}<Link to={carryGuideReturn(guidePath,location.pathname,location.search)}>전체 목차</Link></nav>}
      </div>
    </div>}
  </div>;
}
