import { describe, expect, it } from 'vitest';
import missionSource from '../data/encyclopedia/missions.json';
import roleSource from '../data/encyclopedia/roles.json';
import {
  academicFields, coverage, graph, highlightTerms, learnFirst, membership, missionAnswers, missions,
  normalizeMissionId, pathsThrough, roles, visibleAcademicFields,
} from './encyclopedia';
import {
  INTERNAL_KEYS, LEARNER_FIELDS, learnerAcademicList, learnerMission, learnerPath, learnerRole, learnerTerm,
} from './learnerView';

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
    // 학문 범위 계약 전체는 아래 global contracts 의
    // 'keeps every mission prerequisite inside its allowed academic scope' 가 본다.
    // 여기서는 그 계약을 만들게 한 구체적 사건만 지킨다.
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

// Global contracts: 전체 시스템에 대해 항상 참이어야 하는 규칙.
// Impact Gate 는 이번 변경의 영향만 보므로, 과거부터 있던 위반은 여기서 잡는다.
// 다른 validator 가 이미 보장하는 것(self-reference, 중복 edge, 경로 근거)은 중복 검사하지 않는다.
describe('global contracts', () => {
  it('shows no academic field that has nothing to render', () => {
    for (const field of visibleAcademicFields()) {
      const report = coverage({ academic: field.academicId as string });
      expect(report.total, `${field.academicId} is active but empty`).toBeGreaterThan(0);
      expect(highlightTerms(graph.indexes.byAcademic[field.academicId as string]?.primary ?? []).length,
        `${field.academicId} has no term to show`).toBeGreaterThan(0);
    }
  });

  it('keeps every mission prerequisite inside its allowed academic scope', () => {
    // Impact Gate 는 이번 변경의 delta 만 본다. 과거부터 있던 위반은 여기서 잡는다.
    // U17: 허용 범위 = 미션이 선언한 학문 + Curriculum Baseline.
    // baseline 은 과정 전체가 전제하는 학문이라 미션마다 다시 적지 않는다.
    const baseline = new Set(graph.policy.curriculumBaseline ?? []);
    const violations: string[] = [];
    for (const mission of missions()) {
      const answers = missionAnswers(mission.missionId as string);
      if (!answers) continue;
      const allowed = new Set([
        answers.mission.academic?.primary as unknown as string,
        ...((answers.mission.academic as unknown as { supporting: string[] })?.supporting ?? []),
        ...baseline,
      ].filter(Boolean));
      for (const id of answers.prerequisiteTerms) {
        const home = graph.nodes[id]?.academic?.primary;
        if (home && !allowed.has(home)) violations.push(`${mission.id} <- ${id} (${home})`);
      }
    }
    expect(violations, 'widen the mission academic scope, or fix the relation direction').toEqual([]);
  });

  it('never authors a term list into the role source', () => {
    // 값만 본다. roles.json 은 "weight" 같은 키를 쓰는데 그것과 이름이 같은 canonical term 이 있어
    // 문자열 전체를 훑으면 오탐이 난다.
    const values: string[] = [];
    const walk = (value: unknown) => {
      if (typeof value === 'string') values.push(value);
      else if (Array.isArray(value)) value.forEach(walk);
      else if (value && typeof value === 'object') Object.values(value).forEach(walk);
    };
    walk(roleSource);
    const canonical = new Set(Object.values(graph.nodes).filter(x => x.kind === 'term').map(x => x.termId as string));
    const leaked = values.filter(value => canonical.has(value));
    expect(leaked, 'role source must derive its terms, not store them').toEqual([]);
  });
});

// Learner-facing display contract.
// 같은 종류의 누수가 세 Cycle 연속으로 나왔다. note -> override reason -> 또 override reason.
// 그래서 필드를 하나씩 막는 대신, 화면에 나갈 수 있는 것을 projection 이 정한 목록으로 좁혔다.
// 여기서는 그 목록이 실제로 지켜지는지와, View 가 projection 을 건너뛰지 않는지를 함께 본다.
describe('learner-facing display contract', () => {
  const VIEW_FILES = ['./PrerequisiteView.tsx', './MissionEncyclopedia.tsx', './AcademicView.tsx', './RoleView.tsx'];
  const viewSource = import.meta.glob('./*.tsx', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
  // 유지보수자에게 하는 말이거나, 내부 상태 이름이라 화면 글자가 되면 안 되는 표현.
  const INTERNAL_WORDS = ['Atlas', 'atlas', 'crosswalk', 'override', 'canonical', 'cluster', 'RC1',
    'insufficient-coverage', 'coverageState', 'visibility', 'noteAudience', 'evidenceType', 'promotionCandidate'];
  const readable = (value: unknown): string[] => {
    if (typeof value === 'string') return [value];
    if (Array.isArray(value)) return value.flatMap(readable);
    if (value && typeof value === 'object') return Object.values(value).flatMap(readable);
    return [];
  };

  it('exposes only the allowlisted fields on every projection', () => {
    const check = (row: object | null, allowed: readonly string[], where: string) => {
      if (!row) return;
      expect(Object.keys(row).sort(), where).toEqual([...allowed].sort());
      for (const key of Object.keys(row)) expect(INTERNAL_KEYS as readonly string[], `${where}.${key}`).not.toContain(key);
    };
    for (const field of learnerAcademicList()) check(field, LEARNER_FIELDS.academic, field.key);
    for (const mission of missions()) check(learnerMission(mission.missionId as string), LEARNER_FIELDS.mission, mission.id);
    for (const role of roles()) check(learnerRole(role.id, graph.indexes.byRole[role.id]), LEARNER_FIELDS.role, role.id);
    for (const id of Object.keys(graph.nodes).slice(0, 80)) check(learnerTerm(id), LEARNER_FIELDS.term, id);
    for (const path of graph.paths.slice(0, 40)) {
      const view = learnerPath(path);
      check(view, LEARNER_FIELDS.path, path.id);
      for (const step of view.steps) check(step, LEARNER_FIELDS.step, `${path.id}/${step.key}`);
    }
  });

  it('never lets maintainer vocabulary reach a learner string', () => {
    const projections = [
      ...learnerAcademicList(),
      ...missions().map(x => learnerMission(x.missionId as string)),
      ...roles().map(x => learnerRole(x.id, graph.indexes.byRole[x.id])),
      ...graph.paths.map(learnerPath),
    ];
    for (const row of projections) {
      for (const text of readable(row)) {
        for (const word of INTERNAL_WORDS) expect(text, `${word} in "${text}"`).not.toContain(word);
      }
    }
  });

  it('never shows a raw node id or internal status value as display text', () => {
    const rawStates = ['active', 'declared', 'limited', 'insufficient-coverage'];
    for (const field of learnerAcademicList()) {
      for (const text of [field.title, field.subtitle, field.kindLabel, field.scopeNote]) {
        expect(text, field.key).not.toMatch(/^(term|academic|mission|field|foundation):/);
        expect(rawStates, `${field.key} scope text`).not.toContain(text);
      }
      expect(field.title, field.key).not.toBe(field.key);
    }
    for (const role of roles()) {
      const view = learnerRole(role.id, graph.indexes.byRole[role.id]);
      expect(rawStates, `${role.id} scopeLabel`).not.toContain(view.scopeLabel);
      expect(view.scopeLabel.length, role.id).toBeGreaterThan(1);
    }
    for (const mission of missions()) {
      const view = learnerMission(mission.missionId as string);
      expect(view?.title, mission.id).not.toContain(mission.missionId as string);
      expect(view?.courseLabel, mission.id).toMatch(/^(본과정|예비) M\d\d$/);
    }
  });

  it('turns a hidden academic field into a sentence, never into a status word', () => {
    for (const field of learnerAcademicList()) {
      if (field.open) { expect(field.scopeNote, field.key).toBe(''); expect(field.href, field.key).toBeTruthy(); }
      else { expect(field.scopeNote.length, field.key).toBeGreaterThan(10); expect(field.href, field.key).toBeNull(); }
    }
  });

  it('keeps views away from internal fields — they must read the projection instead', () => {
    // 이 검사가 이번 Cycle 의 실제 발견이다. PrerequisiteView 가 academicOverrides 의 reason 을
    // place.academicReason 으로 다시 내보내고 있었다. 문자열 blacklist 가 아니라 '어떤 필드를
    // 읽었는가'를 본다.
    const forbidden = ['.note', '.reason', '.visibility', '.coverageState', '.origin', '.confidence',
      '.evidenceType', '.academicReason', '.academicOrigin', '.signals', '.promotionCandidate',
      '.rationale', '.purpose', '.noteAudience'];
    for (const file of VIEW_FILES) {
      const source = viewSource[file];
      expect(source, `${file} not found`).toBeTruthy();
      const body = source.split('\n').filter((line: string) => !line.trim().startsWith('*') && !line.trim().startsWith('//')).join('\n');
      for (const token of forbidden) expect(body, `${file} reads ${token} directly`).not.toContain(token);
    }
  });
  it('keeps maintainer rationale out of the text we author for learners', () => {
    // edge 의 reason 과 path 의 why 는 화면에 그대로 나간다. 그런데 같은 칸에 '왜 이 관계를
    // 새로 적었는가'라는 유지보수 판단까지 적어 넣기 쉽다. 실제로 '기존 map 에 대칭 관계만
    // 있었다', 'upstream-registry.json :: U9 참조' 같은 문장이 학습자 화면에 나가고 있었다.
    // 그 판단은 cluster 의 review.note 에 적는다. note 는 화면에 나가지 않는다.
    // map: 출처 텍스트는 동결된 상위 자료라 여기서 고치지 않는다(upstream-registry 에 등록).
    const words = ['map', 'Atlas', 'crosswalk', 'override', 'canonical', 'cluster', 'RC1',
      'upstream', 'registry', 'self-reference', 'Owner Gate', 'Impact Gate', 'validator', '.json'];
    const offenders: string[] = [];
    for (const edge of graph.edges) {
      if (!edge.origin.startsWith('cluster:')) continue;
      for (const word of words) if (edge.reason.includes(word)) offenders.push(`${edge.origin} ${edge.from}->${edge.to} (${word})`);
    }
    for (const path of graph.paths) {
      if (!path.origin.startsWith('cluster:')) continue;
      for (const word of words) if (path.why.includes(word) || path.label.includes(word)) offenders.push(`${path.origin}:${path.id} (${word})`);
    }
    expect(offenders, 'move this sentence into the cluster review note').toEqual([]);
  });
});
