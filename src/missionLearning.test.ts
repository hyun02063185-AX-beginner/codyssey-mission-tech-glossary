import { describe, expect, it } from 'vitest';
import { learningForMission, learningMissions, missionGuidePaths, missionMapLinks } from './missionLearning';
import source from '../data/encyclopedia/missions.json';
import { highlightTerms, missionAnswers } from './encyclopedia';
import { learnerTerm } from './learnerView';

describe('actual mission learning entries', () => {
  it('preserves all sixteen original mission names and public aliases', () => {
    expect(learningMissions).toHaveLength(16);
    expect(learningMissions.filter(item => item.course === 'preliminary')).toHaveLength(3);
    expect(learningMissions.filter(item => item.course === 'main')).toHaveLength(13);
    for (const mission of source.missions) {
      const entry = learningForMission(mission.id)!;
      expect(entry.title).toBe(mission.titleKo);
      expect(entry.href).toBe(`/missions/${mission.aliases.route}`);
      expect(learningForMission(mission.aliases.route)).toEqual(entry);
    }
    expect(learningForMission('main-M99')).toBeNull();
  });
  it('only offers existing material kinds and supported guide destinations', () => {
    expect(learningForMission('main-M05')!.materials.map(item => item.kind)).toEqual(['story', 'concepts', 'guide']);
    expect(learningForMission('main-M03')!.materials.map(item => item.kind)).toEqual(['story', 'concepts', 'guide']);
    expect(learningForMission('main-M01')!.materials.map(item => item.kind)).toEqual(['guide']);
    expect(learningForMission('main-M11')!.materials.map(item => item.kind)).toEqual(['story','guide']);
    expect(learningForMission('preliminary-M03')!.materials[0].href).toBe('/learning-assets/mac-sliding-window');
    for (const id of ['main-M02', 'main-M13', 'preliminary-M01']) {
      expect(learningForMission(id)!.materials).toEqual([]);
      expect(learningForMission(id)!.question).toBeUndefined();
      const mission = learningForMission(id)!;
      const actualTerms = highlightTerms(missionAnswers(mission.id)!.coreTerms, 3).map(term => learnerTerm(term).title);
      for (const term of actualTerms) expect(mission.intro).toContain(term);
    }
    for (const mission of learningMissions) for (const item of mission.materials) if (item.kind === 'guide') expect(item.href).toBe(missionGuidePaths[mission.id]);
  });
  it('retains real mission overlays without manufacturing a dedicated concept map', () => {
    for (const mission of learningMissions) {
      for (const map of missionMapLinks(mission.id).maps) expect(map.href).toMatch(/^\/maps\/[^?]+\?mission=(?:main|preliminary)-m\d\d$/);
    }
    expect(missionMapLinks('main-m02').maps.length).toBeGreaterThan(0);
    expect(learningForMission('main-M02')!.materials.some(item => item.kind === 'concepts')).toBe(false);
  });
});
