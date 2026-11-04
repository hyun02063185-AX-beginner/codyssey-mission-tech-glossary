import source from '../../content/mission-stories/main-m06/_tools/screens.json';
import storyboard from '../../content/mission-stories/main-m06/storyboard-v0.1.md?raw';
export const storyPath='/missions/main-M06/story';
export const {intro,scenes,screens}=source;
export const guideRoot='https://github.com/hyun02063185-AX-beginner/Codyssey_B3-2/tree/be21c4994a93bc943a6783ea380c50f61aa7c45b/docs/learning/';
export const guideLinks=Object.fromEntries([...storyboard.matchAll(/^\[g(\d+)\]: (https:\/\/\S+)$/gm)].map(match=>[match[1],match[2]]));
export function authoredScreen(id:string){
  const block=storyboard.split(`### ${id} · `)[1]?.split('\n---')[0]??'';
  const field=(name:string)=>block.match(new RegExp(`\\*\\*${name}\\*\\* ?([\\s\\S]*?)(?=\\n\\*\\*|$)`))?.[1].trim()??'';
  return {notes:field('강사 스크립트'),explanation:field('학습자 접힘 설명'),check:field('이해 확인'),output:field('실제 출력 전문')};
}
export const introNotes=storyboard.split('**강사 스크립트 — 시작 (3분)**')[1]?.split('\n---')[0].trim()??'';
export const demoNotes=storyboard.split('## 동료평가 시연 — 발표자 노트')[1]?.split('\n---')[0].trim()??'';
export function screenHref(index:number){const screen=screens[index]??screens[0];return `${storyPath}?scene=${screen.scene}&screen=${screen.id.split('-')[1]}`;}
export function readStoryState(search:string){
  if(!search)return {overview:true,index:0,canonical:storyPath,notice:''};
  const params=new URLSearchParams(search.slice(0,1025)),scene=params.get('scene')??'1',number=params.get('screen')??'1';
  const found=screens.findIndex(screen=>screen.id===`S${scene}-${number}`);
  const index=found<0?Math.max(0,screens.findIndex(screen=>screen.scene===scene)):found;
  const invalid=found<0||search.length>1024||[...params.keys()].some(key=>!['scene','screen'].includes(key)||params.getAll(key).length!==1);
  return {overview:false,index,canonical:screenHref(index),notice:invalid?'잘못된 강의 주소를 복구했습니다. Scene과 화면을 확인해 주세요.':''};
}
