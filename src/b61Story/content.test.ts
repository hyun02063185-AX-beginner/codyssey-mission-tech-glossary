import {describe,it,expect} from 'vitest';
import storyboard from '../../content/mission-stories/main-m11/storyboard-v0.2.md?raw';
const assets=import.meta.glob('../../content/mission-stories/main-m11/assets/*.svg',{eager:true,query:'?raw',import:'default'}) as Record<string,string>;
import preview from '../../content/mission-stories/main-m11/_tools/screens.json';
import {scenes,screens} from './content';
import {carryGuideReturn,guideHref,readGuideReturn,readStoryState,screenHref} from './navigation';
describe('approved B6-1 production adapter',()=>{
 it('preserves exactly four scenes, twelve messages and captions in authored order',()=>{
  expect(scenes).toHaveLength(4);expect(screens).toHaveLength(12);
  expect(scenes.map(({id,...scene})=>scene)).toEqual(Object.values(preview.scenes));
  for(const [i,screen]of screens.entries()){
   const authored=preview.screens[i];expect(screen.id).toBe(authored.id);expect(screen.scene).toBe(authored.scene);
   expect(screen.message).toBe(authored.message);expect(screen.caption).toBe(authored.caption);
   expect(storyboard).toContain(screen.message);expect(storyboard).toContain(screen.caption);
   expect(screens.filter(item=>item.scene===screen.scene)).toHaveLength(3);
   if(authored.desktop){expect(screen.diagram+'-desktop.svg').toBe(authored.desktop[0]);expect(screen.state).toBe(authored.desktop[1]);}
  }
 });
 it('allows only static, self-contained SVG assets and authored states',()=>{
  for(const name of new Set(screens.flatMap(screen=>screen.diagram?[screen.diagram+'-desktop.svg',screen.diagram+'-mobile.svg']:[]))){
   const svg=assets[`../../content/mission-stories/main-m11/assets/${name}`];
   expect(svg).not.toMatch(/<(script|foreignObject|iframe|image)\b|\son[a-z]+\s*=|<!DOCTYPE|@import/i);
   expect(svg).not.toMatch(/(?:href|xlink:href)\s*=\s*["'](?!#)|url\(\s*["']?(?!#)[a-z]/i);
   for(const screen of screens.filter(screen=>name.startsWith(screen.diagram??'never'))){expect(svg.match(/data-states="([^"]+)"/)![1].split(' ')).toContain(screen.state);}
  }
 });
 it('applies the single authorized wording correction to both diagram variants',()=>{
  expect(storyboard).toContain('다대다(N:M) 관계는 연결 테이블로 표현할 수 있다.');
  for(const kind of ['desktop','mobile']){
   const svg=assets[`../../content/mission-stories/main-m11/assets/same-structure-${kind}.svg`];
   expect(svg).toContain('다대다(N:M) 관계는 연결 테이블로 표현할 수 있다.');expect(svg).not.toContain('일 때만 쓴다');
  }
 });
});
describe('B6-1 URLs and guide returns',()=>{
 it('distinguishes overview from directly addressed slides',()=>{expect(readStoryState('').overview).toBe(true);expect(readStoryState('?scene=03').index).toBe(6);});
 it.each(screens.map((screen,index)=>({screen,index})))('round trips $screen.id',({index})=>{
  const result=readStoryState(screenHref(index).split('?')[1].replace(/^/,'?'));expect(result.index).toBe(index);expect(result.notice).toBe('');
  const href=guideHref(index,'06-sql-joins'),[path,query]=href.split('?');expect(readGuideReturn(path,'?'+query)).toBe(screenHref(index));
 });
 it.each(['?scene=bad&screen=99','?scene=03&screen=999','?scene=02&screen=1&screen=2','?scene=04&screen=2&returnUrl=https://evil.test'])('safely recovers %s',query=>{
  const state=readStoryState(query);expect(state.notice).not.toBe('');expect(state.index).toBeGreaterThanOrEqual(0);expect(state.index).toBeLessThan(12);expect(readStoryState(state.canonical.split('?')[1].replace(/^/,'?')).notice).toBe('');
 });
 it.each(['https://evil.test','/missions/main-M11/story?scene=01&screen=1','scene=99&screen=1','scene=01&screen=1&view=x'])('rejects an unapproved return payload %s',value=>{
  expect(readGuideReturn('/missions/main-M11/guide','?'+new URLSearchParams({'b61-story':value}))).toBeNull();
 });
 it('keeps a validated position through guide chapter, document and fragment links only',()=>{
  const source=guideHref(7),search='?'+source.split('?')[1];
  expect(carryGuideReturn('/missions/main-M11/guide/06-sql-joins#example','/missions/main-M11/guide',search)).toContain('b61-story=scene%3D03%26screen%3D2#example');
  expect(carryGuideReturn('/terms/join','/missions/main-M11/guide',search)).toBe('/terms/join');
 });
 it('never shows a B6 return on another mission or arbitrary page',()=>{expect(readGuideReturn('/missions/main-M03/guide','?'+new URLSearchParams({'b61-story':'scene=01&screen=1'}))).toBeNull();});
});
