import { Link } from 'react-router-dom';

export const B21_LEARNING_STORY_ROUTE = '/missions/main-M03/story';

export default function B21LearningStoryEntry({ missionId }: { missionId: string }) {
  if (missionId !== 'main-m03') return null;

  return <section className="b21-story-entry" aria-labelledby="b21-story-entry-title">
    <div>
      <div className="b21-story-entry-meta">
        <p className="eyebrow">점이 선이 되는 순간</p>
        <span>검토 시안</span>
      </div>
      <h2 id="b21-story-entry-title">코드에서 이해가 바뀐 세 장면</h2>
      <p>저장과 순회, 함수를 감싸는 과정, 입력·반환 계약을 실제 용돈 기입장 코드에서 확인한 흐름을 따라갑니다.</p>
      <ul className="b21-story-entry-topics" aria-label="다루는 개념">
        <li>Iterator · Generator</li>
        <li>Decorator</li>
        <li>Type Hint</li>
      </ul>
    </div>
    <Link className="learning-story-action" to={B21_LEARNING_STORY_ROUTE}>이해의 흐름 보기 <span aria-hidden="true">→</span></Link>
  </section>;
}
