import storyboardV02 from '../../content/mission-stories/main-m06/storyboard-v0.2.md?raw';
import storyboardR1 from '../../content/mission-stories/main-m06/storyboard-v0.2-r1.md?raw';
import { lessonFromStoryboard } from '../../content/mission-stories/main-m06/_tools/storyboard-v02.mjs';
import { intro as lessonIntro, scenes as lessonScenes, screens as lessonScreens } from './lessonContent';
import {describe,it,expect} from 'vitest';
import evidenceText from '../../content/mission-stories/main-m06/assets/evidence/real-output-2026-10-20.txt?raw';
import {authoredScreen,readStoryState,screenHref,screens,guideLinks,intro,scenes} from './content';
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

describe('B3-2 v0.2 r1 storyboard integration', () => {
  const normalized = storyboardR1.replace(/\r\n/g, '\n');

  it('uses the exact 8 authored explanations and keeps their legacy slide identities', () => {
    const rows = [...normalized.matchAll(/^### (S\d-\d) · (.+)\n[\s\S]*?^\*\*화면 해설\*\*\n\n(.+)$/gm)];
    expect(rows).toHaveLength(8);
    expect(lessonScreens.map(screen => screen.id)).toEqual(screens.map(screen => screen.id));

    for (const [index, [, id, title, explanation]] of rows.entries()) {
      const legacy = screens[index], screen = lessonScreens[index];
      expect(screen).toMatchObject({
        id, title, explanation, scene: legacy.scene, journey: legacy.journey, terms: legacy.terms, guide: legacy.guide,
      });
      expect(screen.explanationGuides.length).toBeGreaterThan(0);
      expect(authoredScreen(id).notes).not.toBe('');
      expect(authoredScreen(id).explanation).not.toBe('');
    }
  });

  it('loads the API-focused intro, scene headings and active F7', () => {
    expect(lessonIntro).toMatchObject({
      title: 'Python으로 외부 AI를 활용하는 방법',
      subtitle: 'Git 변경 내용을 설명하는 AI 도우미 만들기',
      desktop: ['f1-overview-r1-desktop.svg', 'all'],
    });
    expect(lessonIntro.goals).toHaveLength(4);
    expect(lessonIntro.learningGuide).toContain('Python 딕셔너리·리스트');
    expect(lessonScreens[1].check?.question).toBe('`git status`와 `git diff`는 각각 무엇을 알려 주나요?');
    expect(lessonScreens[5].check?.answer).toContain('choices[0].message.content');
    expect(lessonScreens[7].wrapUp?.answer).toContain('⑦ 사람');
    expect(lessonScenes['3'].title).toBe('Python과 외부 AI API의 요청·응답');
    expect(lessonScreens[5]).toMatchObject({
      id: 'S3-2',
      desktop: ['f7-api-r1-desktop.svg', 'main'],
      mobile: ['f7-api-r1-mobile.svg', 'main'],
    });
  });

  it('keeps the v0.2 preview compatible with the original unanswered Scene 3 check', () => {
    const previous = lessonFromStoryboard({ intro, scenes, screens }, storyboardV02);
    expect(previous.screens).toHaveLength(8);
    expect(previous.screens[5].desktop[0]).toBe('f7-api-v02-desktop.svg');
  });

  it('rejects a missing or mismatched authored screen and missing P content', () => {
    expect(() => lessonFromStoryboard({ intro, scenes, screens }, normalized.replace('### S3-2', '### S9-2')))
      .toThrow(/화면 ID 순서/);
    expect(() => lessonFromStoryboard({ intro, scenes, screens }, normalized.replace('**화면 해설**\n\n', '**해설 없음**\n\n')))
      .toThrow(/S1-1 화면 해설/);
  });
});
