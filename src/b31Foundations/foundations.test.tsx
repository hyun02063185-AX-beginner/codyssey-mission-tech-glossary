import {describe,it,expect} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';
import {MemoryRouter} from 'react-router-dom';
import B31Foundations from './B31Foundations';
import {b31SceneIds} from '../b31StoryNavigation';
import map from '../../data/mission-story-maps/main-m05/concept-map.json';
import glossary from '../data/generated/glossary.json';
import {b31GuideChapters} from '../b31GuideContent';
const render=(scene:typeof b31SceneIds[number])=>renderToStaticMarkup(<MemoryRouter><B31Foundations scene={scene}/></MemoryRouter>);
describe('network foundations scope and existing destinations',()=>{
 it('adds exactly three closed cards in the existing five scenes with two prompts each',()=>{
  const html=b31SceneIds.map(render);
  expect(html.filter(Boolean)).toHaveLength(3);expect(html[2]).toBe('');expect(html[4]).toBe('');
  for(const card of html.filter(Boolean)){
   expect(card).not.toMatch(/<details[^>]*\sopen(?:=|>)/);
   const checks=card.split('aria-label="기초 이해 확인"')[1].split('</section>')[0];expect(checks.match(/<li>/g)).toHaveLength(2);
   expect(card).toContain('강사용 기대 답');
  }
 });
 it('renders two responsive diagrams and one semantic comparison table',()=>{
  const a=render('scene-01'),b=render('scene-02'),c=render('scene-03b');
  expect(a).toContain('data-foundation-visual="V1"');expect(b).toContain('data-foundation-visual="V2"');
  expect(c.match(/<table>/g)).toHaveLength(1);expect(c.match(/scope="row"/g)).toHaveLength(5);
  expect(b.indexOf('data-layer="ip"')).toBeLessThan(b.indexOf('data-layer="tcp"'));expect(b.indexOf('data-layer="tcp"')).toBeLessThan(b.indexOf('data-layer="http"'));
 });
 it('only uses real existing glossary IDs, guide chapters and map selections',()=>{
  for(const scene of b31SceneIds)for(const [,raw] of render(scene).matchAll(/href="([^"]+)"/g)){
   const url=new URL(raw.replaceAll('&amp;','&'),'https://local.test');
   expect(url.origin).toBe('https://local.test');
   if(url.pathname.startsWith('/terms/'))expect(glossary.some(t=>t.id===url.pathname.split('/')[2])).toBe(true);
   else if(url.pathname.includes('/guide/'))expect(b31GuideChapters.some(c=>c.id===url.pathname.split('/').pop())).toBe(true);
   else{
    expect(url.pathname).toBe('/missions/main-M05/story-map/concepts');expect(url.searchParams.get('scene')).toBe(scene);
    const node=url.searchParams.get('node'),rel=url.searchParams.get('rel')??url.searchParams.get('flow');
    expect(node?map.nodes.some(n=>n.id===node):map.relations.some(r=>r.id===rel)).toBe(true);
   }
  }
 });
});
