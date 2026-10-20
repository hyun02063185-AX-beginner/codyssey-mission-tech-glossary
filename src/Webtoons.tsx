import {useEffect, useRef, useState} from 'react';
import {Link, useSearchParams} from 'react-router-dom';
import source from './data/generated/webtoons.json';
import './webtoons.css';

export type WebtoonEpisode = {
  id:string; topic:string; title:string; summary:string; termId:string|null;
  relatedTerms:Array<{termId:string;label:string}>;
  imageSrc:string; mediumImageSrc:string; smallImageSrc:string; width:number; height:number; alt:string;
  definition:string; analogyLimit:string;
  panels:Array<{number:number;description:string;dialogue:Array<{speaker:string;text:string}>;imageSrc:string;smallImageSrc:string;width:number;height:number}>;
};
export const webtoonEpisodes=source as WebtoonEpisode[];
export const episodesForTerm=(termId:string)=>webtoonEpisodes.filter(episode=>episode.termId===termId||episode.relatedTerms.some(link=>link.termId===termId));
export const webtoonHref=(episode:WebtoonEpisode)=>`/webtoons?episode=${encodeURIComponent(episode.id)}`;

function EpisodeCards(){
  return <div className="webtoon-episode-grid">{webtoonEpisodes.map(episode=><Link className="webtoon-episode-card" to={webtoonHref(episode)} key={episode.id}>
    <img src={episode.smallImageSrc} srcSet={`${episode.smallImageSrc} 768w, ${episode.mediumImageSrc} 1024w`} sizes="(max-width:700px) calc(100vw - 32px), 440px" width={episode.width} height={episode.height} alt="" loading="lazy"/>
    <span className="webtoon-topic">{episode.topic}</span><h2>{episode.title}</h2><p>{episode.summary}</p><span className="webtoon-read">웹툰 읽기 →</span>
  </Link>)}</div>;
}

export function WebtoonHome(){
  return <section className="webtoon-home"><h2>웹툰으로 이해하기</h2><p>낯선 기술 말을 이야기와 웃음으로 만나 보세요. <Link to="/webtoons">웹툰 {webtoonEpisodes.length}편 모아보기 →</Link></p><EpisodeCards/></section>;
}

export function WebtoonForTerm({termId}:{termId:string}){
  const related=episodesForTerm(termId);
  if(!related.length)return null;
  return <section className="webtoon-term-entry"><h2>웹툰으로 이해하기</h2>{related.map(episode=><Link to={webtoonHref(episode)} key={episode.id}><strong>{episode.topic} · {episode.title}</strong><span>{episode.summary}</span><b>이야기로 읽기 →</b></Link>)}</section>;
}

function Artwork({episode}:{episode:WebtoonEpisode}){
  const[mobile,setMobile]=useState(()=>typeof window!=='undefined'&&window.matchMedia('(max-width:700px)').matches);
  useEffect(()=>{
    const media=window.matchMedia('(max-width:700px)');
    const update=()=>setMobile(media.matches);update();media.addEventListener('change',update);
    return()=>media.removeEventListener('change',update);
  },[]);
  if(mobile)return <div className="webtoon-panel-stack">{episode.panels.map(panel=><figure key={panel.number}>
    <img src={panel.imageSrc} srcSet={`${panel.smallImageSrc} 368w, ${panel.imageSrc} 736w`} sizes="calc(100vw - 16px)" width={panel.width} height={panel.height} alt={`${panel.number}컷. ${panel.description}`} loading="eager" decoding="async"/>
  </figure>)}</div>;
  return <figure className="webtoon-full-art"><img src={episode.imageSrc} srcSet={`${episode.smallImageSrc} 768w, ${episode.mediumImageSrc} 1024w, ${episode.imageSrc} 1536w`} sizes="(max-width:1448px) calc(100vw - 48px), 1400px" width={episode.width} height={episode.height} alt={episode.alt} decoding="async"/></figure>;
}

export function WebtoonReader({episode}:{episode:WebtoonEpisode}){
  return <section className="webtoon-reader" aria-label={`${episode.topic} 웹툰`}>
    <Artwork episode={episode}/>
    <div className="webtoon-reader-notes">
      <section className="webtoon-easy-meaning"><h2>이 말의 쉬운 뜻</h2><p>{episode.definition}</p><p className="webtoon-analogy-limit">{episode.analogyLimit}</p><div className="webtoon-next-links">{episode.relatedTerms.map(link=><Link to={`/terms/${link.termId}?webtoon=${episode.id}`} key={link.termId}>{link.label} →</Link>)}</div></section>
      <details className="webtoon-transcript"><summary>그림 설명과 대사 읽기</summary><ol>{episode.panels.map(panel=><li key={panel.number}><h3>{panel.number}컷</h3><p>{panel.description}</p>{panel.dialogue.map((speech,index)=><p key={index} className="webtoon-dialogue"><strong>{speech.speaker}</strong> {speech.text.replaceAll('\n',' ')}</p>)}</li>)}</ol></details>
      <nav className="webtoon-reader-navigation" aria-label="다른 웹툰"><Link to="/webtoons">← 웹툰 목록</Link>{webtoonEpisodes.filter(other=>other.id!==episode.id).map(other=><Link to={webtoonHref(other)} key={other.id}>다음 이야기: {other.topic} →</Link>)}</nav>
    </div>
  </section>;
}

type QuickTerm={id:string;termKo:string;summary:string;easyExplanation:string;technicalExplanation:string};
export function WebtoonQuickTerm({term,episodeId}:{term:QuickTerm;episodeId:string}){
  const episode=episodesForTerm(term.id).find(item=>item.id===episodeId);
  if(!episode)return null;
  return <article className="webtoon-quick-term"><Link className="webtoon-back" to={webtoonHref(episode)}>← {episode.topic} 웹툰으로 돌아가기</Link><p className="eyebrow">웹툰에서 이어 읽기</p><h1>{term.termKo}</h1><h2>쉽게 설명하면</h2><p className="summary">{term.easyExplanation||term.summary}</p><details><summary>정확한 설명 더 읽기</summary><p>{term.technicalExplanation}</p></details><p><Link to={`/terms/${term.id}`}>미션과 기술 세부까지 보기 →</Link></p></article>;
}

export default function WebtoonPage(){
  const[params]=useSearchParams();const id=params.get('episode');
  const episode=webtoonEpisodes.find(item=>item.id===id);
  const heading=useRef<HTMLHeadingElement>(null);
  useEffect(()=>{if(id){heading.current?.focus({preventScroll:true});heading.current?.scrollIntoView({block:'start'});}},[id]);
  if(id&&!episode)return <section><h1>웹툰을 찾지 못했어요</h1><p>공개 중인 이야기에서 다시 골라 보세요.</p><Link to="/webtoons">웹툰 목록으로 →</Link></section>;
  return <section className="webtoon-page">{episode?<>
    <Link className="webtoon-back" to="/webtoons">← 웹툰 목록</Link><p className="webtoon-topic">{episode.topic} · 4컷 웹툰</p><h1 ref={heading} tabIndex={-1}>{episode.title}</h1><p className="webtoon-story-intro">{episode.summary}</p><WebtoonReader episode={episode}/>
  </>:<><p className="eyebrow">이야기로 만나는 기술</p><h1>웹툰으로 이해하기</h1><p className="webtoon-intro">기술을 처음 만나는 분들을 위한 {webtoonEpisodes.length}편의 이야기입니다. 일상 속 오해와 웃음으로 낯선 말에 가까워져 보세요.</p><EpisodeCards/></>}</section>;
}
