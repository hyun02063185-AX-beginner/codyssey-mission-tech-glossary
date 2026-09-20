// Learner-facing projection layer.
//
// 두 Cycle 연속으로 유지보수용 데이터가 사용자 화면에 나갔다. Cycle 01 은 academic/role 의
// note 였고, Cycle 02 는 academicOverrides 의 reason 이었다. 이번 Cycle 에서 세 번째로
// PrerequisiteView 가 같은 reason 을 다시 내보내고 있는 것이 발견됐다. 필드를 하나씩 막는
// 방식으로는 끝나지 않는다는 뜻이다.
//
// 그래서 규칙을 뒤집는다. View 는 그래프 node 를 직접 표시 데이터로 쓰지 않는다. 화면에 나갈
// 수 있는 것은 이 파일이 만들어 주는 Learner* 객체의 필드뿐이고, 그 목록은 아래 타입이
// 전부다. 새 필드를 화면에 내보내려면 여기에 먼저 추가해야 하며, 그때 이것이 학습자에게
// 하는 말인지 유지보수자에게 하는 말인지 한 번 더 판단하게 된다.
//
// 내부 데이터(academic.origin, academic.reason, visibility, coverageState, status, signals,
// confidence, evidenceType, source, clusterId, mapId, promotionCandidate)는 여기서 끊긴다.
// 학습자에게 필요한 설명은 그 값을 그대로 넘기는 대신 문장으로 바꿔서 내보낸다.
import {
  coverage, graph, label, missionLabel, missionHref, node, subLabel, termHref,
  type GraphEdge, type GraphNode, type GraphPath, type RoleRow,
} from './encyclopedia';

/** 화면에 나갈 수 있는 필드 목록. 계약 테스트가 이 목록으로 누수를 검사한다. */
export const LEARNER_FIELDS = {
  term: ['key', 'title', 'subtitle', 'href', 'kindLabel', 'detailed'],
  academic: ['key', 'title', 'subtitle', 'href', 'kindLabel', 'open', 'intro', 'scopeNote', 'termCount', 'coreCount', 'detailCount', 'missionCount'],
  mission: ['key', 'title', 'courseLabel', 'href'],
  role: ['key', 'title', 'subtitle', 'href', 'open', 'scopeLabel', 'stateKey', 'intro', 'scopeNote', 'coreFieldTermCount', 'termCount'],
  path: ['key', 'title', 'why', 'steps'],
  step: ['key', 'title', 'href'],
} as const;

/** 화면에 절대 그대로 나가면 안 되는 내부 키. 계약 테스트와 소스 검사가 함께 쓴다. */
export const INTERNAL_KEYS = [
  'origin', 'reason', 'visibility', 'coverageState', 'status', 'signals', 'confidence',
  'evidenceType', 'source', 'clusterId', 'mapId', 'promotionCandidate', 'academicOrigin',
  'academicReason', 'note', 'noteAudience', 'rationale', 'purpose',
] as const;

export type LearnerTerm = { key: string; title: string; subtitle: string; href: string | null; kindLabel: string; detailed: boolean };
export type LearnerAcademic = { key: string; title: string; subtitle: string; href: string | null; kindLabel: string; open: boolean; intro: string; scopeNote: string; termCount: number; coreCount: number; detailCount: number; missionCount: number };
export type LearnerMission = { key: string; title: string; courseLabel: string; href: string };
export type LearnerRole = { key: string; title: string; subtitle: string; href: string; open: boolean; scopeLabel: string; stateKey: string; intro: string; scopeNote: string; coreFieldTermCount: number; termCount: number };
export type LearnerStep = { key: string; title: string; href: string | null };
export type LearnerPath = { key: string; title: string; why: string; steps: LearnerStep[] };

const KIND_LABEL: Record<string, string> = { term: '용어', foundation: '연결 개념', academic: '학문', mission: '미션', field: '기술 분야' };
const ACADEMIC_KIND_LABEL: Record<string, string> = { academic: '컴퓨터공학 과목', applied: '실무 적용 영역' };
const ROLE_SCOPE_LABEL: Record<string, string> = { active: '연결된 범위 넓음', limited: '연결된 범위 제한적', declared: '아직 연결 없음' };

/** 용어·연결 개념 한 칸. 어느 cluster 에서 왔는지, 어떤 근거였는지는 넘기지 않는다. */
export const learnerTerm = (id: string): LearnerTerm => ({
  key: id, title: label(id), subtitle: subLabel(id), href: termHref(id),
  kindLabel: KIND_LABEL[node(id)?.kind ?? ''] ?? '', detailed: Boolean(node(id)?.hasDetail),
});

/**
 * 학문 한 칸. visibility 값을 그대로 내보내지 않고 '열려 있는가'와 사람이 읽을 문장으로 바꾼다.
 * declared / insufficient-coverage 라는 내부 상태 이름이 화면에 나갈 일이 없어진다.
 */
export function learnerAcademic(id: string): LearnerAcademic | null {
  const field = node(id);
  if (!field || field.kind !== 'academic') return null;
  const open = field.visibility === 'active';
  const report = coverage({ academic: field.academicId as string });
  const scopeNote = open ? ''
    : field.visibility === 'declared'
      ? '이 영역에 연결된 용어가 아직 없습니다.'
      : `이 영역에는 용어 ${field.termCount ?? 0}개만 연결되어 있어 학습 지도를 만들기에 이릅니다.`;
  return {
    key: id, title: field.labelKo ?? id, subtitle: field.labelEn ?? '',
    href: open ? `/academic/${field.academicId}` : null,
    kindLabel: ACADEMIC_KIND_LABEL[field.academicKind ?? 'academic'],
    open, intro: field.note ?? '', scopeNote,
    termCount: report.total, coreCount: report.core, detailCount: report.withDetail, missionCount: report.missions,
  };
}

/** 미션 한 칸. 내부 id 대신 공개 경로와 사람이 읽는 회차 이름만 넘긴다. */
export function learnerMission(id: string): LearnerMission | null {
  const mission = node(`mission:${id}`) ?? node(id);
  if (!mission || mission.kind !== 'mission') return null;
  const missionId = mission.missionId as string;
  return { key: mission.id, title: mission.titleKo ?? missionId, courseLabel: missionLabel(missionId), href: missionHref(missionId) };
}

/** 직무 한 칸. coverageState 값 대신 상태 이름과 안내 문장을 만들어 넘긴다. */
export function learnerRole(id: string, row: RoleRow): LearnerRole {
  const open = row.coverageState === 'active';
  const weak = row.weakCoreAcademic.map(key => node(`academic:${key}`)?.labelKo ?? key).join(', ');
  const scopeNote = open ? ''
    : row.coreFieldTermCount === 0
      ? '이 직무의 중심 어휘가 아직 사전에 거의 없습니다. 아래 내용은 주변 영역에서 끌어온 것이라 직무 전체를 대표하지 않습니다.'
      : `이 직무의 중심 학문(${weak})에 연결된 용어가 부족합니다. 아래는 인접 분야 기준입니다.`;
  return {
    key: id, title: row.labelKo, subtitle: row.labelEn, href: `/roles/${id}`,
    open, scopeLabel: ROLE_SCOPE_LABEL[row.coverageState], stateKey: row.coverageState, intro: row.note ?? '', scopeNote,
    coreFieldTermCount: row.coreFieldTermCount, termCount: row.termCount,
  };
}

/** 학습 경로 한 개. 경로의 출처(cluster/map)와 scope 는 넘기지 않는다. */
export const learnerPath = (path: GraphPath): LearnerPath => ({
  key: path.id, title: path.label, why: path.why,
  steps: path.steps.map(step => ({ key: step, title: label(step), href: termHref(step) })),
});

/**
 * 관계 한 줄에 붙는 설명. edge 의 reason 만 쓴다.
 * reason 은 '왜 이 관계가 성립하는지'를 학습자에게 설명하려고 쓰는 문장이라 의도적으로 내보낸다.
 * 같은 이름이라도 academicOverrides 의 reason 은 유지보수자에게 하는 말이라 여기 들어오지 않는다.
 */
export const learnerWhy = (edge?: GraphEdge, via?: string): string =>
  (edge ? `${via ? `${label(via)}: ` : ''}${edge.reason}` : '');

/**
 * 기술 분야와 학문이 갈린 용어를 학습자에게 설명하는 문장.
 * 왜 갈랐는지(유지보수자용 reason)가 아니라 갈렸다는 사실과 반대쪽 이름만 말한다.
 */
export function learnerPlacementNote(id: string): string {
  const found = node(id);
  if (!found || found.academic?.origin !== 'override' || !found.field?.primary) return '';
  return `기술 지도에서는 ${label(`field:${found.field.primary}`)}에 있습니다. 어느 쪽이 틀린 것이 아니라 보는 축이 다릅니다.`;
}

/** 기술 분야와 다르게 배정된 용어 목록. 사실만 담고 조정 사유는 담지 않는다. */
export const learnerOverrides = (termIds: string[]): Array<LearnerTerm & { otherAxis: string }> => termIds
  .map(termId => node(`term:${termId}`))
  .filter((found): found is GraphNode => Boolean(found) && found?.academic?.origin === 'override')
  .map(found => ({ ...learnerTerm(found.id), otherAxis: found.field?.primary ? label(`field:${found.field.primary}`) : '' }));

/**
 * 한 학문에서 보여 줄 학습 경로. 경로를 고르는 기준(cluster 출처인지)은 내부 사정이라
 * View 가 알 필요가 없다. 여기서 걸러서 이미 사람이 읽을 모양이 된 것만 넘긴다.
 */
export const learnerAcademicPaths = (fieldId: string): LearnerPath[] => {
  const primary = graph.indexes.byAcademic[fieldId]?.primary ?? [];
  return graph.paths
    .filter(path => path.origin.startsWith('cluster:')
      && path.steps.some(step => step === `academic:${fieldId}` || primary.includes(node(step)?.termId ?? '')))
    .map(learnerPath);
};

/** 화면에 열 수 있는 학문만. 닫힌 영역은 목록에서 이름과 안내 문장만 보여 준다. */
export const learnerAcademicList = (): LearnerAcademic[] =>
  Object.values(graph.nodes).filter(x => x.kind === 'academic')
    .map(x => learnerAcademic(x.id)).filter((x): x is LearnerAcademic => Boolean(x))
    .sort((a, b) => b.termCount - a.termCount);
