import {storyPath, screens, guideChapter} from './content';
export function screenHref(index:number) {
  const screen=screens[index]??screens[0];
  return `${storyPath}?${new URLSearchParams({scene:screen.scene,screen:screen.id.split('-')[1]})}`;
}
export function readStoryState(search:string) {
  const params=new URLSearchParams(search.slice(0,1025));
  if(!search)return {overview:true,index:0,canonical:storyPath,notice:''};
  const scene=params.get('scene')??'1', number=params.get('screen')??'1';
  const found=screens.findIndex(screen=>screen.id===`S${scene}-${number}`);
  const index=found<0?Math.max(0,screens.findIndex(screen=>screen.scene===scene)):found;
  const invalid=found<0||search.length>1024||[...params.keys()].some(key=>!['scene','screen'].includes(key)||params.getAll(key).length!==1);
  return {overview:false,index,canonical:screenHref(index),notice:invalid?'잘못된 강의 주소를 복구했습니다. Scene과 화면을 확인해 주세요.':''};
}
export function validStoryQuery(query:string|null) {
  if(!query)return null;
  const state=readStoryState('?'+query);
  return !state.notice&&state.canonical.split('?')[1]===query?query:null;
}
export function guideHref(index:number, chapter=screens[index]?.guide[0]) {
  return `/missions/main-M01/guide${chapter&&guideChapter(chapter)?'/'+guideChapter(chapter):''}?${new URLSearchParams({'b11-story':screenHref(index).split('?')[1]})}`;
}
export function readGuideReturn(path:string,search:string) {
  if(!/^\/missions\/main-M01\/guide(?:\/[a-z0-9-]+)?$/.test(path)||search.length>2048)return null;
  const params=new URLSearchParams(search),origin=params.getAll('b11-story').length===1?validStoryQuery(params.get('b11-story')):null;
  return origin?storyPath+'?'+origin:null;
}
export function carryGuideReturn(href:string,path:string,search:string) {
  const origin=readGuideReturn(path,search);
  if(!origin||!/^\/missions\/main-M01\/guide(?:[/?#]|$)/.test(href))return href;
  const [base,hash]=href.split('#'),[target,query='']=base.split('?'),params=new URLSearchParams(query);
  params.set('b11-story',origin.split('?')[1]);
  return target+'?'+params+(hash?'#'+hash:'');
}
