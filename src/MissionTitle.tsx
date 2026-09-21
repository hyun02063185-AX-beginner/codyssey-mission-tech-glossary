import { learnerMission } from './learnerView';
import { normalizeMissionId } from './encyclopedia';

/**
 * 미션 목록 카드에 붙는 제목.
 *
 * 목록이 "본과정 M13 · 28개 용어" 뿐이면 학습자가 자기 미션을 찾을 수 없다. 회차 번호를
 * 외우고 있는 사람만 쓸 수 있는 목록이었다. 제목은 이미 데이터에 있으므로 꺼내 놓기만 한다.
 */
export default function MissionTitle({ routeId }: { routeId: string }) {
  const canonical = normalizeMissionId(routeId);
  const mission = canonical ? learnerMission(canonical) : null;
  return mission ? <span className="mission-card-title">{mission.title}</span> : null;
}
