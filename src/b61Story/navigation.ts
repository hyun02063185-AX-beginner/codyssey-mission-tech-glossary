import {b61StoryPath,scenes,screens} from './content';
export function screenHref(index:number){
  const screen=screens[index]??screens[0];
  return `${b61StoryPath}?${new URLSearchParams({scene:screen.scene,screen:screen.id.split('-')[1]})}`;
}
/** Mission-owned URL adapter, with no arbitrary destinations or source HTML. */
export function readStoryState(search:string){
  const query=new URLSearchParams(search.slice(0,1025));
  if(!search)return {overview:true,index:0,canonical:b61StoryPath,notice:''};
  const scene=query.get('scene')??scenes[0].id;
  const validScene=scenes.some(item=>item.id===scene),number=query.get('screen')??'1';
  const id=`S${validScene?scene:scenes[0].id}-${number}`;
  const match=screens.findIndex(item=>item.id===id);
  const index=match<0?screens.findIndex(item=>item.scene===(validScene?scene:scenes[0].id)):match;
  const invalid=!validScene||match<0||search.length>1024||[...query.keys()].some(key=>!['scene','screen'].includes(key)||query.getAll(key).length!==1);
  return {overview:false,index,canonical:screenHref(index),notice:invalid?'잘못된 강의 주소를 복구했습니다. Scene과 화면을 확인해 주세요.':''};
}
export const b61ReturnKey='b61-story';
export function guideHref(index:number,chapter?:string){
  return `/missions/main-M11/guide${chapter?'/'+chapter:''}?${new URLSearchParams({[b61ReturnKey]:screenHref(index).split('?')[1]})}`;
}
export function readGuideReturn(pathname:string,search:string){
  if(!/^\/missions\/main-M11\/guide(?:\/[a-z0-9-]+)?$/.test(pathname)||search.length>2048)return null;
  const query=new URLSearchParams(search);
  if(query.getAll(b61ReturnKey).length!==1)return null;
  const value=query.get(b61ReturnKey)!;
  const state=readStoryState('?'+value);
  return state.overview||state.notice||state.canonical.split('?')[1]!==value?null:state.canonical;
}

/** Carry only a validated Story position through existing guide navigation. */
export function carryGuideReturn(href:string,pathname:string,search:string){
  const source=readGuideReturn(pathname,search);
  if(!source||!/^\/missions\/main-M11\/guide(?:[/?#]|$)/.test(href))return href;
  const [base,hash]=href.split('#'),[path,query='']=base.split('?'),params=new URLSearchParams(query);
  params.set(b61ReturnKey,source.split('?')[1]);
  return path+'?'+params+(hash?'#'+hash:'');
}
