import { describe, expect, it } from 'vitest';
import missionSource from '../data/encyclopedia/missions.json';
import {
  academicFields, coverage, graph, learnFirst, membership, missionAnswers, missions,
  normalizeMissionId, pathsThrough, roles, visibleAcademicFields,
} from './encyclopedia';

const labels = (ids: string[]) => ids.map(id => graph.nodes[id]?.labelKo ?? graph.nodes[id]?.labelEn ?? id);

describe('encyclopedia query layer', () => {
  it('normalizes every mission notation to one canonical id', () => {
    for (const alias of ['main/M01', 'main-M01', 'main-m01']) expect(normalizeMissionId(alias)).toBe('main-m01');
    for (const alias of ['preliminary/M03', 'preliminary-M03', 'preliminary-m03']) expect(normalizeMissionId(alias)).toBe('preliminary-m03');
    expect(normalizeMissionId('main-m99')).toBeUndefined();
  });

  it('keeps the public mission route alias intact', () => {
    for (const mission of Object.values(graph.nodes).filter(x => x.kind === 'mission')) {
      const course = mission.course as string;
      const number = (mission.missionId as string).split('-')[1].toUpperCase();
      expect(mission.aliases?.route).toBe(`${course}-${number}`);
    }
  });

  it('walks only learning-order relations, never generic related', () => {
    const relations = new Set(graph.learnFirstRelations);
    expect(relations.has('related')).toBe(false);
    expect(relations.has('interacts_with')).toBe(false);
    expect(relations.has('compare_with')).toBe(false);
    expect([...relations].sort()).toEqual(['based_on', 'cs_foundation', 'is_a', 'prerequisite']);
    for (const [from, targets] of Object.entries(graph.indexes.learnFirst)) {
      for (const to of targets) {
        expect(graph.edges.some(edge => edge.from === from && edge.to === to && relations.has(edge.relation))).toBe(true);
      }
    }
  });

  it('never produces a prerequisite cycle', () => {
    for (const id of Object.keys(graph.indexes.learnFirst)) {
      const { layers } = learnFirst(id, 12);
      expect(layers.flatMap(layer => layer.nodes)).not.toContain(id);
    }
  });
});

describe('prerequisite view data', () => {
  it('answers "what comes before Redis" with an ordered, reasoned chain', () => {
    const { layers, total } = learnFirst('term:redis');
    expect(total).toBeGreaterThan(0);
    expect(labels(layers.flatMap(layer => layer.nodes))).toContain('키-값 저장소');
    for (const entry of layers.flatMap(layer => layer.entries)) {
      expect(entry.edge?.reason).toBeTruthy();
      expect(entry.edge?.source).toMatch(/^(https?:\/\/|repo:)/);
    }
  });

  it('keeps the curated Redis learning path reachable from the term', () => {
    const paths = pathsThrough('term:redis');
    const structure = paths.find(path => path.id === 'data-redis:structure-to-product');
    expect(structure).toBeDefined();
    expect(labels(structure?.steps ?? [])).toEqual(['자료구조', 'Hash Function', '해시맵', '키-값 저장소', 'Cache', 'Redis']);
    expect(structure?.why).toBeTruthy();
  });

  it('says nothing rather than inventing an order when evidence is missing', () => {
    const bare = Object.values(graph.nodes).find(x => x.kind === 'term' && !(graph.indexes.learnFirst[x.id]?.length));
    expect(bare).toBeDefined();
    expect(learnFirst(bare?.id as string).total).toBe(0);
  });
});

describe('mission view data', () => {
  const sample = ['main-m03', 'main-m08', 'main-m09', 'main-m11', 'main-m12', 'main-m13'];

  it('answers all six mission questions for the regression sample', () => {
    for (const missionId of sample) {
      const answers = missionAnswers(missionId);
      expect(answers, missionId).toBeDefined();
      expect(answers?.academicPrimary, missionId).toBeDefined();
      expect(answers?.coreTerms.length, missionId).toBeGreaterThan(0);
      expect(answers?.practiceTerms.length, missionId).toBeGreaterThan(0);
      expect(answers?.mission.titleKo, missionId).toBeTruthy();
    }
  });

  it('connects M13 to authentication and M11 to database systems', () => {
    expect(missionAnswers('main-m13')?.coreTerms).toContain('authentication');
    expect(missionAnswers('main-m13')?.academicPrimary?.academicId).toBe('information-security');
    expect(missionAnswers('main-m11')?.academicPrimary?.academicId).toBe('database-systems');
    expect(membership('term:database-index').academic).toBe('database-systems');
  });

  // Expansion Cycle 1 shipped an edge that was right inside the security cluster but pulled
  // attack techniques into an unrelated mission. This is the regression guard for that leak.
  it('does not pull security attacks into M03 prerequisites', () => {
    const prerequisites = missionAnswers('main-m03')?.prerequisiteTerms ?? [];
    expect(prerequisites).not.toContain('term:xss');
    expect(prerequisites).not.toContain('term:sql-injection');
    // 스냅샷이 아니라 계약을 본다: 어떤 미션도 자신이 선언한 학문 밖의 선수 학습을 얻지 않는다.
    for (const mission of missions()) {
      const node = graph.nodes[mission.id];
      const declared = new Set([node.academic?.primary, ...((node.academic as unknown as { supporting: string[] })?.supporting ?? [])]);
      for (const id of missionAnswers(mission.missionId as string)?.prerequisiteTerms ?? []) {
        const home = graph.nodes[id]?.academic?.primary;
        expect(home == null || declared.has(home), `${id} (${home}) leaked into ${mission.missionId}`).toBe(true);
      }
    }
  });

  it('never copies a term list into the mission source', () => {
    const blob = JSON.stringify(missionSource);
    for (const termId of ['authentication', 'redis', 'hash-map', 'fastapi']) expect(blob).not.toContain(`"${termId}"`);
  });
});

describe('academic view policy', () => {
  it('shows only fields with enough coverage and keeps the rest in the data', () => {
    const hidden = academicFields().filter(x => x.visibility !== 'active');
    expect(academicFields()).toHaveLength(14);
    expect(hidden.map(x => x.academicId)).toEqual(['sre']);
    expect(visibleAcademicFields().length).toBe(13);
    // 숨긴 영역은 삭제하지 않고 데이터에 남아 있어야 한다.
    for (const field of hidden) expect(field.labelKo, field.academicId).toBeTruthy();
  });

  it('admits a small field only when it carries a real learning path', () => {
    const architecture = graph.nodes['academic:computer-architecture'];
    expect(architecture.visibility).toBe('active');
    expect(architecture.termCount).toBeLessThan(20);
    expect(architecture.signals?.clusterPaths).toBeGreaterThan(0);
    // 반대쪽: 학습 경로도 term 도 없으면 열지 않는다.
    const sre = graph.nodes['academic:sre'];
    expect(sre.visibility).toBe('declared');
    expect(sre.termCount).toBe(0);
    expect(sre.signals?.clusterPaths).toBe(0);
    // 노출된 영역은 모두 기준 중 하나를 실제로 충족한다.
    for (const field of visibleAcademicFields()) {
      const signals = field.signals;
      const ok = (field.termCount ?? 0) >= 20
        || ((field.termCount ?? 0) >= 3 && (signals?.clusterPaths ?? 0) >= 1 && (signals?.missionCount ?? 0) >= 1);
      expect(ok, field.academicId).toBe(true);
    }
  });

  it('keeps the academic axis separate from the technology axis', () => {
    const mutex = graph.nodes['term:mutex'];
    expect(mutex.field?.primary).toBe('programming-foundations');
    expect(mutex.academic?.primary).toBe('operating-systems');
    expect(mutex.academic?.origin).toBe('override');
    expect(mutex.academic?.reason).toBeTruthy();
  });

  it('reports coverage for a visible field', () => {
    const report = coverage({ academic: 'operating-systems' });
    expect(report.total).toBeGreaterThan(20);
    expect(report.missions).toBeGreaterThan(0);
  });
});

describe('role view policy', () => {
  it('computes roles instead of storing term lists', () => {
    expect(roles()).toHaveLength(10);
    for (const role of roles()) {
      expect(role.fieldIds.length).toBeGreaterThan(0);
      expect(['active', 'limited', 'declared']).toContain(role.coverageState);
    }
  });

  it('does not overstate thin roles', () => {
    const limited = roles().filter(role => role.coverageState !== 'active').map(role => role.id).sort();
    expect(limited).toEqual(['qa-engineer', 'site-reliability-engineer']);
    expect(roles().find(role => role.id === 'qa-engineer')?.coreFieldTermCount).toBe(0);
    expect(roles().find(role => role.id === 'site-reliability-engineer')?.weakCoreAcademic).toContain('sre');
  });
});

// View Implementation Cycle 에서 수동 확인으로만 잡히던 표시 품질 문제를 회귀로 고정한다.
// 내부 식별자와 유지보수용 어휘가 사용자 화면 문구로 새는 것을 막는다.
describe('display quality', () => {
  const internalJargon = /Atlas|override|crosswalk|canonical|cluster|primaryField|secondaryFields|insufficient-coverage|declared|coverageState/;

  it('keeps maintainer jargon out of learner-facing copy', () => {
    for (const field of academicFields()) {
      expect(field.note ?? '', field.academicId).not.toMatch(internalJargon);
    }
    for (const role of roles()) {
      expect(role.note ?? '', role.id).not.toMatch(internalJargon);
    }
  });

  it('gives every user-visible node a human label, not an internal id', () => {
    for (const node of Object.values(graph.nodes)) {
      const shown = node.kind === 'mission' ? node.titleKo : node.labelKo || node.labelEn;
      expect(shown, node.id).toBeTruthy();
      expect(shown as string, node.id).not.toMatch(/^(term|academic|mission|field|foundation):/);
      expect(shown as string, node.id).not.toMatch(/^(main|preliminary)[-/]m?\d/i);
    }
  });

  it('never renders a raw mission id where a title belongs', () => {
    for (const mission of missions()) {
      expect(mission.aliases?.route, mission.id).toMatch(/^(main|preliminary)-M\d\d$/);
      expect(mission.titleKo, mission.id).not.toContain(mission.missionId as string);
    }
  });
});
