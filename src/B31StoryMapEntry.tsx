import { Link } from 'react-router-dom';
import { b31ConceptPath, b31StoryPath } from './b31StoryNavigation';
import './b31StoryMap.css';

export default function B31StoryMapEntry() {
  return <section className="b31-story-entry" aria-labelledby="b31-story-entry-title">
    <p className="eyebrow">B3-1 · 미션 스토리맵</p>
    <h2 id="b31-story-entry-title">AWS로 다시 이해하는 네트워크</h2>
    <p>내 웹사이트는 어떻게 인터넷에서 열릴까? 강의에서 흐름을 살펴보고, 스토리와 개념지도를 오가며 복습하세요.</p>
    <div className="b31-story-actions"><Link className="b31-story-primary" to={b31StoryPath}>미션 스토리맵으로 학습 시작하기 →</Link><Link to={b31ConceptPath}>인터랙티브 개념지도 바로 보기 →</Link></div>
    <nav className="b31-story-existing" aria-label="B3-1 기존 학습 자료"><b>기존 학습 자료</b><Link to="/missions/main-M05/guide">B3-1 학습가이드</Link><Link to="/missions/main-M05/guide?document=supplement">기업망 보강 자료</Link></nav>
  </section>;
}
