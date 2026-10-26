import {describe,it,expect} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';
import {MemoryRouter} from 'react-router-dom';
import MissionStoryOverview from './MissionStoryOverview';
import {readPresentationTheme} from './PresentationTheme';
const render=(node:React.ReactNode)=>renderToStaticMarkup(<MemoryRouter>{node}</MemoryRouter>);
describe('reusable Story overview and presentation preference',()=>{
 it.each([0,3,9])('accepts %i scenes without fixing a mission-specific count',count=>{
  const scenes=Array.from({length:count},(_,i)=>({id:String(i),label:`Scene ${i+1}`,title:`장면 ${i+1}`,href:`/lesson?scene=${i+1}`}));
  const html=render(<MissionStoryOverview missionCode="TEST" title="강의" question="핵심 질문" orientation={<p>학습 목표</p>} scenes={scenes}/>);
  expect((html.match(/<li>/g)??[])).toHaveLength(count);
  expect(html.includes('강의 시작하기')).toBe(count>0);
  if(count)expect(html).toContain('href="/lesson?scene=1"');
  expect(html).toContain('학습 목표와 강의 흐름');
 });
 it.each([null,'','forest','dark','invalid'])('defaults to Dark for missing or unrecognized preference %s',value=>{
  expect(readPresentationTheme({getItem:()=>value})).toBe('dark');
 });
 it('keeps an explicit Light preference independently of OS and site theme',()=>expect(readPresentationTheme({getItem:()=> 'light'})).toBe('light'));
 it('uses Dark when browser storage is unavailable',()=>expect(readPresentationTheme({getItem:()=>{throw new Error('blocked');}})).toBe('dark'));
});
