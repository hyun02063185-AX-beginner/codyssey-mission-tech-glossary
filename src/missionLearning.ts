import { highlightTerms, missionAnswers, missions, normalizeMissionId } from './encyclopedia';
import { learnerAcademic, learnerMission, learnerTerm } from './learnerView';
import mapRegistry from './data/generated/map-registry.json';
import routing from './data/generated/mission-map-routing.json';
import { b31ConceptPath, b31StoryPath } from './b31StoryNavigation';
import { b21StoryPath, b21ConceptPath } from './b21Learning/paths';
import { M03_MAC_ASSET_ROUTE } from './M03LearningStory';

export type LearningMaterial = { kind: 'story' | 'concepts' | 'guide' | 'interactive'; title: string; description: string; href: string; action: string };
export const materialLabels = { story: '미션 스토리', concepts: '개념지도', guide: '학습가이드', interactive: '체험 학습' };
export function materialLabel(_missionId:string, kind:LearningMaterial['kind']) {return materialLabels[kind];}
export const missionGuidePaths = Object.fromEntries(['main-m01', 'main-m03', 'main-m05', 'main-m11'].map(id => [id, `/missions/${id.replace('-m', '-M')}/guide`])) as Record<string, string>;
const guideFolders = new Set(Object.keys(import.meta.glob('../content/mission-guides/*/chapters/*.md', { query: '?raw', import: 'default' })).map(path => path.split('/')[3]));
const guide = (id: string): LearningMaterial => ({ kind: 'guide', title: '직접 해 보고 확인하기', description: '내 프로젝트의 코드와 실행 결과를 살펴보고, 동작을 설명하고 검증합니다.', href: missionGuidePaths[id], action: '학습 가이드 읽기 →' });

// Presentation and route availability only. Mission names/terms/maps retain their
// existing sources. Intro/question copy comes from the existing entries and guides.
const definitions: Record<string, { intro: string; question?: string; materials: LearningMaterial[] }> = {
  'main-m01': { intro: 'AI가 만든 웹사이트의 구조와 동작을 이해하고, 실제 코드에서 근거를 찾아 자기 말로 설명합니다.', question: '내가 만든 웹사이트는 어떤 구조로, 어떻게 동작할까?', materials: [guide('main-m01')] },
  'main-m03': { intro: 'Python 용돈 기입장의 핵심 개념을 8개 장면으로 배우고, 관계를 확인합니다.', question: '지금까지 배운 개념은 한 프로그램 안에서 어떤 관계로 연결될까?', materials: [
    { kind: 'story', title: '명령 한 줄부터 개념지도까지', description: 'Python 용돈 기입장의 핵심 개념을 8개 장면으로 배우고, 관계를 확인합니다.', href: b21StoryPath, action: '미션 Story 시작하기 →' },
    { kind: 'concepts', title: '45개 개념의 연결 관계 탐색', description: '개념과 관계를 선택하고, 헷갈리는 개념을 비교하며 복습합니다.', href: b21ConceptPath, action: '전체 개념지도 탐색하기 →' }, guide('main-m03'),
  ] },
  'main-m05': { intro: '일반 네트워크의 흐름과 역할을 살펴보고, B3-1 AWS 구성의 공통점과 차이점을 연결합니다.', question: '내 웹사이트는 어떻게 인터넷에서 열릴까?', materials: [
    { kind: 'story', title: '흐름을 따라 이해하기', description: '전체 구조에서 요청·응답, AWS 접속 조건까지 장면별로 살펴봅니다.', href: b31StoryPath, action: '미션 스토리맵으로 학습 시작하기 →' },
    { kind: 'concepts', title: '기술 관계 탐색하기', description: '개념을 선택해 연결 관계와 일반망·AWS의 공통점과 차이점을 읽습니다.', href: b31ConceptPath, action: '인터랙티브 개념지도 바로 보기 →' }, guide('main-m05'),
  ] },
  'main-m11': { intro: '내가 만든 SQL 데이터베이스의 구조와 원리를 이해하고, 내 프로젝트의 근거를 찾아 설명합니다.', question: '데이터베이스는 어떤 구조로 데이터를 나누어 담고, 어떤 규칙으로 지킬까?', materials: [guide('main-m11')] },
  'preliminary-m03': { intro: 'MAC 계산이 입력의 위치마다 어떤 결과를 만드는지 직접 움직이며 확인합니다.', question: 'MAC을 어디에 쓰는 걸까?', materials: [{ kind: 'interactive', title: 'MAC을 움직여서 이해하기', description: '필터를 한 칸씩 옮기며 위치마다 쌓이는 계산 결과를 확인합니다.', href: M03_MAC_ASSET_ROUTE, action: '움직여서 이해하기 →' }] },
};

export function learningForMission(value: string) {
  const id = normalizeMissionId(value);
  const mission = id ? learnerMission(id) : null;
  if (!id || !mission) return null;
  const entry = definitions[id];
  const materials = (entry?.materials ?? []).filter(item => item.kind !== 'guide' || guideFolders.has(id));
  const concepts = highlightTerms(missionAnswers(id)?.coreTerms ?? [], 3).map(term => learnerTerm(term).title);
  const intro = concepts.length ? `${concepts.join(' · ')} 등 이 미션에 연결된 핵심 개념을 살펴보고, 실제로 사용하는 맥락을 이해합니다.` : `${mission.title}에서 만나는 개념을 관련 학문·기술지도·용어사전에서 찾아보세요.`;
  return { ...mission, id, course: id.split('-')[0], intro: entry?.intro ?? intro, question: entry?.question, materials,
    supplement: id === 'main-m05' ? `${missionGuidePaths[id]}?document=supplement` : undefined };
}

export const learningMissions = missions().map(mission => learningForMission(mission.missionId!)!);

export function missionMapLinks(id: string) {
  const route = routing.missions.find(item => item.missionId === id);
  const maps = (route?.maps ?? []).flatMap(context => {
    const map = mapRegistry.maps.find(item => item.mapId === context.mapId && item.status === 'implemented' && context.overlayMissionId && item.availableMissions.includes(context.overlayMissionId));
    return map ? [{ title: map.title, href: `/maps/${map.mapId}?mission=${context.overlayMissionId}`, secondary: context.relation === 'secondary' }] : [];
  });
  return { maps, crossField: route?.primaryContext.kind === 'cross-field-layer' };
}

export function knowledgeSummary(id: string) {
  const answers = missionAnswers(id), { maps } = missionMapLinks(id);
  const academic = answers?.academicPrimary ? learnerAcademic(answers.academicPrimary.id)?.title : undefined;
  return [academic, `핵심 용어 ${answers?.coreTerms.length ?? 0}개`, `기술지도 ${maps.length}개`].filter(Boolean).join(' · ');
}
