import {describe,it,expect} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';
import {MemoryRouter} from 'react-router-dom';
import LearningFocusNav from './LearningFocusNav';
import {MissionLearningStart,MissionsPage} from '../MissionLearningPages';
import {learningMissions,materialLabel} from '../missionLearning';

const render=(node:React.ReactNode)=>renderToStaticMarkup(<MemoryRouter>{node}</MemoryRouter>);
describe('shared mission entry and focus navigation',()=>{
  it('sends every recommendation and mission card to its introduction',()=>{
    const html=render(<MissionsPage/>),hrefs=[...html.matchAll(/href="([^"]+)"/g)].map(match=>match[1]);
    expect(hrefs.length).toBeGreaterThan(16);
    expect(hrefs.every(href=>learningMissions.some(mission=>mission.href===href))).toBe(true);
  });
  it.each(learningMissions)('$id shows all three roles and links only available resources',mission=>{
    const html=render(<MissionLearningStart mission={mission}/>);
    for(const kind of ['story','concepts','guide'] as const){
      const card=html.split(`data-material="${kind}"`)[1].split('</li>')[0];
      expect(card).toContain(materialLabel(mission.id,kind));
      const item=mission.materials.find(item=>item.kind===kind);
      if(item)expect(card).toContain(`href="${item.href}"`);
      else {expect(card).toContain('미제공');expect(card).not.toContain('<a ');}
    }
  });
  it('reuses the same names and keeps approved contextual destinations',()=>{
    for(const id of ['main-m03','main-m05']){
      const html=render(<LearningFocusNav missionId={id} active="story" conceptHref="/missions/main-M05/story-map/concepts?node=gen%3Afirewall"/>);
      expect(html).toContain('data-menu-mode="learning-focus"');
      expect(html).toContain('미션 스토리');expect(html).toContain('개념지도');expect(html).toContain('학습가이드');
      expect(html).toContain('node=gen%3Afirewall');expect(html).toContain('aria-current="page"');
      expect(html).not.toContain('주요 메뉴');
    }
  });
});
