import { Link } from 'react-router-dom';

export const M03_MAC_ASSET_ROUTE = '/learning-assets/mac-sliding-window';

/**
 * This is deliberately a single, evidence-backed story rather than a new mission
 * schema. Future stories can earn their own model after this first case is tested.
 */
export function M03LearningStory({ missionId }: { missionId: string }) {
  if (missionId !== 'preliminary-m03') return null;

  return <section className="learning-story" aria-labelledby="m03-learning-story-title">
    <p className="eyebrow">점이 선이 되는 순간</p>
    <h3 id="m03-learning-story-title">MAC을 어디에 쓰는 걸까?</h3>
    <p>MAC을 직접 계산한 뒤에는 “이 계산을 실제로 어디에 쓸까?”라는 질문이 남습니다. 작은 필터를 더 큰 입력의 한 위치에 놓고 곱해 더한 뒤, 한 칸씩 옮겨 같은 계산을 반복하면 각 위치의 결과가 쌓입니다. 필터와 같은 패턴이 있는 위치에서는 값이 크게 나타나므로, 이 계산이 입력 안에서 패턴이 있을 법한 위치를 찾는 데 쓰일 수 있음을 볼 수 있습니다.</p>
    <Link className="learning-story-action" to={M03_MAC_ASSET_ROUTE}>움직여서 이해하기 <span aria-hidden="true">→</span></Link>
  </section>;
}

export function MacLearningAssetLink() {
  return <Link className="term-learning-asset-entry" to={M03_MAC_ASSET_ROUTE}>▹ 점이 선이 되는 순간으로 보기 <span>MAC이 위치마다 어떤 결과를 만드는지 움직여서 이해하기</span></Link>;
}
