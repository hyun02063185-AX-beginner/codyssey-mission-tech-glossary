import { Link } from 'react-router-dom';
import { M03_MAC_ASSET_ROUTE } from './M03LearningStory';

export default function LearningAssetView() {
  return <article className="learning-asset-page" aria-labelledby="learning-asset-title">
    <p className="eyebrow">점이 선이 되는 순간 · 예비 M03</p>
    <h1 id="learning-asset-title">MAC 슬라이딩 윈도우</h1>
    <p className="learning-asset-intro">작은 필터를 큰 입력의 여러 위치에 적용할 때, 위치마다 MAC 결과가 어떻게 쌓이고 패턴과 맞는 곳에서 왜 값이 커지는지 직접 움직여 보세요.</p>
    <iframe
      className="learning-asset-frame"
      src={`${import.meta.env.BASE_URL}learning-assets/mac_sliding_window_demo.standalone.html`}
      title="MAC 슬라이딩 윈도우 시뮬레이터"
      sandbox="allow-scripts"
    />
    <p className="learning-asset-note">이 예제처럼 작은 필터를 큰 입력의 여러 위치에 적용하려면 필터를 이동시키며 계산합니다. 예비 M03의 기본 실습은 필터와 입력 크기가 같아 한 위치에서 MAC을 수행합니다.</p>
    <Link className="learning-asset-back" to="/missions/preliminary-M03">예비 M03으로 돌아가기</Link>
  </article>;
}
