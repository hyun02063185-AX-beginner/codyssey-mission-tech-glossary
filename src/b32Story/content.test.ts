import {describe,it,expect} from 'vitest';
import evidenceText from '../../content/mission-stories/main-m06/assets/evidence/real-output-2026-10-20.txt?raw';
import {authoredScreen,readStoryState,screenHref,screens,guideLinks,intro} from './content';
import {learningForMission} from '../missionLearning';
describe('B3-2 approved content integration',()=>{
 it('restores every direct screen and bounds malformed addresses',()=>{
  for(let i=0;i<8;i++)expect(readStoryState('?'+screenHref(i).split('?')[1])).toMatchObject({overview:false,index:i,notice:''});
  expect(readStoryState('')).toMatchObject({overview:true});
  expect(readStoryState('?scene=3')).toMatchObject({index:4,notice:''});
  for(const query of ['?scene=9','?scene=1&screen=9','?scene=1&scene=2','?return=https://evil.test'])expect(readStoryState(query).notice).toBeTruthy();
 });
 it('preserves the actual output verbatim including the unverified file-position claim',()=>{
  const evidence=evidenceText.replace(/\r\n/g,'\n');
  const blocks=[...authoredScreen('S4-1').output.replace(/\r\n/g,'\n').matchAll(/```text\n([\s\S]*?)\n```/g)];
  expect(blocks).toHaveLength(2);for(const block of blocks)expect(evidence).toContain(block[1]);
  expect(authoredScreen('S4-1').notes).toContain('실행 당시 위치는 기록이 없어');
 });
 it('explains beginner terms and distinguishes execution results from Python decisions',()=>{
  expect(intro.draftDefinition).toContain('AI가 먼저 작성한 검토용 글');
  expect(screens[0].caption).toContain('실제 커밋이나 PR은 아직 만들어지지 않았다');
  const first=authoredScreen('S2-1'),second=authoredScreen('S2-2');
  for(const text of ['Python 리스트','실행할 프로그램','Git에 전달할 명령','생략','shell=False','운영체제를 통해 Git'])expect(first.explanation).toContain(text);
  for(const text of ['CompletedProcess','객체의 속성','표준 오류 출력','항상 실패를 의미하지는 않습니다','성공했을 때 stdout'])expect(second.explanation).toContain(text);
  expect(screens.map(screen=>screen.technology)).toEqual(['Git · AI 자동화','git status · git diff','argparse → subprocess.run()','subprocess.run() 실행 결과','Git 변경 수집 · 보안 검사','urllib.request · HTTP API','AI 응답 · 출력 형식 검증','결과 검증 · 사람의 최종 확인']);
 });
 it('uses only real B3-2 chapter links and keeps the concept map unavailable',()=>{
  for(const screen of screens){expect(authoredScreen(screen.id).notes).not.toBe('');for(const chapter of screen.guide)expect(guideLinks[chapter]).toMatch(/Codyssey_B3-2\/blob\/be21c4994a93bc943a6783ea380c50f61aa7c45b\/docs\/learning\//);}
  expect(learningForMission('main-m06')!.materials.map(item=>item.kind)).toEqual(['story','guide']);
 });
});
