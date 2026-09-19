// Shared query layer for the Encyclopedia views.
//
// The four views (prerequisites, mission, academic, role) must not walk the graph JSON
// themselves — the same traversal reimplemented per component is how the learning-evidence
// contract gets broken. Everything here is derived from the generated graph; nothing is
// authored twice.
//
// The five queries are the ones fixed in docs/knowledge-encyclopedia/04-view-architecture.md:
// membership · neighbors · learnFirst · pathsThrough · coverage.
import graphSource from './data/generated/encyclopedia-graph.json';

export type NodeKind = 'term' | 'foundation' | 'academic' | 'mission' | 'field';
export type Visibility = 'active' | 'insufficient-coverage' | 'declared';
export type CoverageState = 'active' | 'limited' | 'declared';
export type GraphNode = {
  id: string; kind: NodeKind;
  termId?: string; academicId?: string; missionId?: string; fieldId?: string;
  labelKo?: string; labelEn?: string; importance?: string; hasDetail?: boolean;
  field?: { primary: string | null; secondary: string[] };
  academic?: { primary: string | null; secondary: string[]; origin: string; reason: string; cluster: string | null };
  missions?: Array<{ missionId: string; sourceStatus: string }>;
  academicKind?: 'academic' | 'applied'; parent?: string | null; prerequisiteFields?: string[];
  note?: string; termCount?: number; status?: string; visibility?: Visibility;
  signals?: { termCount: number; learnFirstEdges: number; clusterPaths: number; missionCount: number };
  missionIds?: string[]; purpose?: string; rationale?: string; origin?: string; summary?: string;
  promotionCandidate?: boolean; mapId?: string; clusterId?: string;
  order?: number; course?: string; titleKo?: string;
  aliases?: Record<string, string>;
  studyNext?: { missions: string[]; academic: string[] };
  primaryField?: string | null; crossFieldLayers?: string[]; maps?: string[];
  prerequisiteAcademic?: string[]; coreTermIds?: string[];
};
export type GraphEdge = { from: string; relation: string; to: string; origin: string; reason: string; confidence: string; evidenceType: string; source: string };
export type GraphPath = { id: string; label: string; why: string; steps: string[]; origin: string; scope: string };
export type RoleRow = {
  labelKo: string; labelEn: string; coverage: string; coverageState: CoverageState; note: string;
  fields: Array<{ id: string; weight: string }>; academic: Array<{ id: string; weight: string }>;
  fieldIds: string[]; academicIds: string[]; coreFieldTermCount: number; weakCoreAcademic: string[];
  termCount: number; coreTermIds: string[];
};

type Graph = {
  stats: Record<string, number>;
  learnFirstRelations: string[];
  policy: { academicVisibility: Record<string, string>; roleCoverage: Record<string, string> };
  nodes: Record<string, GraphNode>;
  edges: GraphEdge[];
  derivedEdges: Array<{ from: string; relation: string; to: string; role?: string; sourceStatus?: string; origin?: string }>;
  paths: GraphPath[];
  indexes: {
    learnFirst: Record<string, string[]>; unlocks: Record<string, string[]>;
    reverse: Record<string, Array<{ relation: string; to: string }>>;
    byAcademic: Record<string, { primary: string[]; secondary: string[] }>;
    byField: Record<string, { primary: string[]; secondary: string[] }>;
    byMission: Record<string, Array<{ termId: string; sourceStatus: string }>>;
    byRole: Record<string, RoleRow>;
    missionAliases: Record<string, string>;
  };
};

export const graph = graphSource as unknown as Graph;
const { nodes, indexes } = graph;

export const node = (id: string): GraphNode | undefined => nodes[id];
export const label = (id: string): string => nodes[id]?.labelKo || nodes[id]?.labelEn || id;
export const subLabel = (id: string): string => {
  const found = nodes[id];
  if (!found) return '';
  return found.labelKo && found.labelEn && found.labelKo !== found.labelEn ? found.labelEn : '';
};
export const termHref = (id: string): string | null => (nodes[id]?.kind === 'term' ? `/terms/${nodes[id].termId}` : null);

/** Any mission notation (main/M01, main-M01, main-m01) resolves to the canonical id. */
export const normalizeMissionId = (value: string): string | undefined => indexes.missionAliases[value];

export const missions = (): GraphNode[] => Object.values(nodes).filter(x => x.kind === 'mission').sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
export const academicFields = (): GraphNode[] => Object.values(nodes).filter(x => x.kind === 'academic').sort((a, b) => (b.termCount ?? 0) - (a.termCount ?? 0));
export const visibleAcademicFields = (): GraphNode[] => academicFields().filter(x => x.visibility === 'active');
export const roles = (): Array<RoleRow & { id: string }> => Object.entries(indexes.byRole).map(([id, row]) => ({ id, ...row }));

// --- the five shared queries ------------------------------------------------

/** membership: which field / academic / missions a node belongs to. */
export function membership(id: string) {
  const found = nodes[id];
  if (!found) return { field: null as string | null, academic: null as string | null, missions: [] as string[] };
  return {
    field: found.field?.primary ?? null,
    fieldSecondary: found.field?.secondary ?? [],
    academic: found.academic?.primary ?? null,
    academicSecondary: found.academic?.secondary ?? [],
    academicOrigin: found.academic?.origin ?? null,
    academicReason: found.academic?.reason ?? '',
    missions: (found.missions ?? []).map(m => m.missionId),
  };
}

/** neighbors: authored edges touching a node, optionally filtered by relation. */
export function neighbors(id: string, relations?: string[]) {
  return graph.edges
    .filter(edge => (edge.from === id || edge.to === id) && (!relations || relations.includes(edge.relation)))
    .map(edge => ({ edge, other: edge.from === id ? edge.to : edge.from, outgoing: edge.from === id }));
}

export type LearnEntry = { id: string; from: string; edge?: GraphEdge };
export type LearnLayer = { depth: number; nodes: string[]; entries: LearnEntry[] };
/**
 * learnFirst: what to study before this node, grouped by distance.
 * Walks only the learn-first sub-graph (prerequisite/based_on/is_a/cs_foundation);
 * generic `related` never enters a prerequisite answer.
 */
export function learnFirst(id: string, maxDepth = 6): { layers: LearnLayer[]; total: number; edgeFor: (from: string, to: string) => GraphEdge | undefined } {
  const edgeFor = (from: string, to: string) => graph.edges.find(edge => edge.from === from && edge.to === to && graph.learnFirstRelations.includes(edge.relation));
  const layers: LearnLayer[] = [];
  const seen = new Set([id]);
  let frontier = [id];
  for (let depth = 1; depth <= maxDepth && frontier.length; depth += 1) {
    const entries: LearnEntry[] = [];
    for (const current of frontier) {
      for (const target of indexes.learnFirst[current] ?? []) {
        if (seen.has(target)) continue;
        seen.add(target);
        // Keep the edge that introduced this node, so the view can say *why* it comes first.
        entries.push({ id: target, from: current, edge: edgeFor(current, target) });
      }
    }
    if (entries.length) {
      entries.sort((a, b) => label(a.id).localeCompare(label(b.id), 'ko'));
      layers.push({ depth, nodes: entries.map(e => e.id), entries });
    }
    frontier = entries.map(e => e.id);
  }
  return { layers, total: seen.size - 1, edgeFor };
}

/** What becomes reachable once this node is understood (one step only — the useful depth). */
export function unlocks(id: string): string[] {
  return (indexes.unlocks[id] ?? []).slice().sort((a, b) => label(a).localeCompare(label(b), 'ko'));
}

/** pathsThrough: curated learning paths (cluster + existing map routes) that contain the node. */
export function pathsThrough(id: string): GraphPath[] {
  return graph.paths.filter(path => path.steps.includes(id));
}

export type CoverageReport = { total: number; withDetail: number; core: number; missions: number };
/** coverage: how much of a scope the dictionary actually holds. */
export function coverage(scope: { academic?: string; field?: string; role?: string }): CoverageReport {
  let termIds: string[] = [];
  if (scope.academic) termIds = indexes.byAcademic[scope.academic]?.primary ?? [];
  else if (scope.field) termIds = indexes.byField[scope.field]?.primary ?? [];
  else if (scope.role) termIds = [...new Set((indexes.byRole[scope.role]?.fieldIds ?? []).flatMap(f => indexes.byField[f]?.primary ?? []))];
  const missionIds = new Set<string>();
  let withDetail = 0, core = 0;
  for (const termId of termIds) {
    const found = nodes[`term:${termId}`];
    if (!found) continue;
    if (found.hasDetail) withDetail += 1;
    if (found.importance === 'core') core += 1;
    for (const ref of found.missions ?? []) missionIds.add(ref.missionId);
  }
  return { total: termIds.length, withDetail, core, missions: missionIds.size };
}

// --- view helpers built on the five queries ---------------------------------

export const missionLabel = (missionId: string): string => {
  const found = nodes[`mission:${missionId}`];
  const course = found?.course === 'main' ? '본과정' : '예비';
  return `${course} ${missionId.split('-')[1]?.toUpperCase() ?? missionId}`;
};

/** The web route for a mission keeps the existing public alias (main-M01), never the internal id. */
export const missionHref = (missionId: string): string => `/missions/${nodes[`mission:${missionId}`]?.aliases?.route ?? missionId}`;

export type MissionAnswers = {
  mission: GraphNode;
  academicPrimary: GraphNode | undefined;
  academicSupporting: GraphNode[];
  prerequisiteAcademic: GraphNode[];
  coreTerms: string[];
  practiceTerms: string[];
  prerequisiteTerms: string[];
  studyNextMissions: GraphNode[];
  studyNextAcademic: GraphNode[];
};
/** The six questions a mission page must answer. Everything is computed; nothing is copied. */
export function missionAnswers(missionId: string): MissionAnswers | undefined {
  const mission = nodes[`mission:${missionId}`];
  if (!mission) return undefined;
  const rows = indexes.byMission[missionId] ?? [];
  const direct = rows.filter(r => r.sourceStatus === 'direct').map(r => r.termId);
  const directSet = new Set(direct.map(t => `term:${t}`));
  const seeds = (mission.coreTermIds ?? []).map(t => `term:${t}`);
  const closure = new Set<string>();
  const queue = [...seeds];
  const visited = new Set(seeds);
  while (queue.length) {
    const current = queue.shift() as string;
    for (const target of indexes.learnFirst[current] ?? []) {
      if (visited.has(target)) continue;
      visited.add(target); queue.push(target);
      if (!directSet.has(target)) closure.add(target);
    }
  }
  const ac = (id: string | null | undefined) => (id ? nodes[`academic:${id}`] : undefined);
  return {
    mission,
    academicPrimary: ac(mission.academic?.primary as unknown as string),
    academicSupporting: ((mission.academic as unknown as { supporting: string[] })?.supporting ?? []).map(ac).filter(Boolean) as GraphNode[],
    prerequisiteAcademic: (mission.prerequisiteAcademic ?? []).map(ac).filter(Boolean) as GraphNode[],
    coreTerms: mission.coreTermIds ?? [],
    practiceTerms: direct,
    prerequisiteTerms: [...closure].sort((a, b) => label(a).localeCompare(label(b), 'ko')),
    studyNextMissions: (mission.studyNext?.missions ?? []).map(id => nodes[`mission:${id}`]).filter(Boolean),
    studyNextAcademic: (mission.studyNext?.academic ?? []).map(ac).filter(Boolean) as GraphNode[],
  };
}

/** Terms worth showing first for a scope: core importance, then detailed content. */
export function highlightTerms(termIds: string[], limit = 12): string[] {
  return termIds
    .map(id => nodes[`term:${id}`])
    .filter(Boolean)
    .sort((a, b) => {
      const score = (x: GraphNode) => (x.importance === 'core' ? 0 : 1) + (x.hasDetail ? 0 : 0.5) - (x.missions?.length ?? 0) / 100;
      return score(a) - score(b) || label(a.id).localeCompare(label(b.id), 'ko');
    })
    .slice(0, limit)
    .map(x => x.id);
}
