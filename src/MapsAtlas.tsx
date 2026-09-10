import { Link } from 'react-router-dom';
import registrySource from './data/generated/map-registry.json';
import type { RegistryMap } from './knowledgeMapTypes';

const maps = (registrySource as { maps: RegistryMap[] }).maps;
const statusLabel = { implemented: '구현됨', planned: '준비 중', 'review-required': '검토 중', 'cross-field-candidate': '공통 계층 검토', 'cross-field-layer': '공통 계층' } as const;
const missionLabel = (mission: string) => mission.replace('main-', '본과정 ').replace('preliminary-', '예비 ').replace(/m(\d+)/, (_, value) => `M${value}`);

export default function MapsAtlas() {
  const groups = [['implemented', '구현된 지도'], ['planned', '준비 중인 지도'], ['review-required', '검토 중인 지도'], ['cross-field-layer', '공통 계층'], ['cross-field-candidate', '공통 계층 후보']] as const;
  return <section className="atlas-page" aria-labelledby="atlas-title"><p className="eyebrow">Technology Atlas</p><h1 id="atlas-title">기술 분야 지도</h1><p className="atlas-intro">미션별 용어를 기술 분야의 관계 속에서 살펴보세요. 미션은 각 Field Map 위에 겹쳐지는 overlay이며, 같은 용어를 여러 맥락에서 재사용합니다.</p>{groups.map(([status, title]) => { const entries = maps.filter(map => map.status === status); return entries.length ? <section className="atlas-group" key={status}><h2>{title}</h2><div className="atlas-grid">{entries.map(map => <MapCard key={map.mapId} map={map} />)}</div></section> : null; })}</section>;
}
function MapCard({ map }: { map: RegistryMap }) { const body = <><div className="atlas-card-top"><span className={`atlas-status ${map.status}`}>{statusLabel[map.status]}</span>{map.fieldTermCount ? <small>{map.fieldTermCount}개 canonical term</small> : null}</div><h3>{map.title}</h3><p>{map.description}</p><small>관련 미션 · {map.availableMissions.map(missionLabel).join(', ') || '미정'}</small>{map.nodeCount && <small>현재 curated view · {map.nodeCount} nodes</small>}</>; return map.status === 'implemented' ? <Link className="atlas-card is-available" to={`/maps/${map.mapId}`}>{body}<b>지도 열기 →</b></Link> : <article className="atlas-card">{body}</article>; }
