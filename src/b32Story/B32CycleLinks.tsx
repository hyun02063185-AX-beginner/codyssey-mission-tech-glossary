import { Link } from 'react-router-dom';
import Markdown from 'react-markdown';
import ownerOutputSource from '../../content/mission-stories/main-m06/assets/evidence/lab-v0.3-owner-2026-11-25.txt?raw';
import { labPath } from './reviewMode';
import { getLab, labHref, storyFor, tripFor, tripsFrom } from './labContent';
import './b32Cycle.css';

const action: Record<string, string> = {
  '01': '연습 저장소 준비하기',
  '02': '변경이 없을 때의 출력 확인하기',
  '03': '두 가지 diff의 차이를 직접 확인하기',
  '04': 'Python이 받은 실행 결과 확인하기',
  '05': 'AI에게 보낼 Git 문맥 만들기',
  '06': 'API 요청 JSON 미리 만들기',
  '07': '실제 API 요청과 오류 확인하기',
  '08': '실제 AI 응답과 초안 살펴보기',
  '09': 'stdout과 stderr를 파일로 나눠 보기',
};

export function PracticeLinks({ screen, copy }: { screen: string; copy: string }) {
  const ids = screen === 'intro' ? ['01'] : [...new Set(tripsFrom(screen).flatMap(card => card.labs))];
  if (screen === 'S2-2') ids.reverse();
  return <nav className="b32-cycle-links" aria-label="실습으로 확인하기">
    <Markdown>{copy}</Markdown>
    <div>
      {ids.map(id => {
        const lab = getLab(id)!;
        return <Link key={id} to={labHref(id, screen)}
          aria-label={`Lab ${id} · ${action[id]} · 핵심 ${lab.minutes} · API ${lab.calls.replaceAll('*', '')}회`}>
          <span>Lab {id}</span> {action[id]}
        </Link>;
      })}
      <Link to={labPath}>Lab 목차</Link>
    </div>
  </nav>;
}

export function returnFocus(screen: string, lab: string) {
  if (screen === 'intro') return 'F1의 **“내 컴퓨터” 실선 경계** 안에서 방금 준비한 연습 저장소와 `main.py`의 위치를 찾아보세요.';
  if (screen === 'S1-2' && lab === '03') return 'F3에서 ` M README.md`의 M 위치와 맨 아래 **이번에는 없다** 문구(`git diff --cached`)를 확인하세요. 그림은 add 이전 상태입니다.';
  if (screen === 'S3-1' && lab === '03') return 'F6 “보낼 글에 담는 것”에서 **“git add 전후 변경을 함께 읽음”** 줄을 찾아보세요.';
  if (screen === 'S2-2' && lab === '09') return 'F5의 결과 세 칸 중 **stdout**과 **stderr**의 이름을 Lab 09에서 나눈 두 파일과 맞춰 보세요.';
  if (screen === 'S4-1' && lab === '09') return 'F8 카드 아래 **“AI API 요청 횟수: 1 ← stderr”** 줄을 진단 파일과 맞춰 보세요.';
  return tripFor(screen, lab)?.focus.replace(/\(개정 전 그림: [^)]+\)/g, '');
}

const nextLinks: Record<string, { to: string; label: string }> = {
  K1: { to: labHref('08', 'S4-2', '#results'), label: '초안의 사실을 diff와 맞춰 보기' },
  K2: { to: labHref('03', 'S1-2', '#b'), label: 'MM 상태 더 알아보기' },
  K3: { to: storyFor('S2-2'), label: 'Python이 받은 결과 보기' },
  K4: { to: labHref('09'), label: '출력 통로를 파일로 분리하기' },
  K5: { to: labHref('04', 'S2-2', '#b'), label: '출력 받기 옵션 빼 보기' },
  K6: { to: labHref('05', 'S3-1', '#b'), label: '가짜 이메일을 가리는 방식 확인하기' },
  K7: { to: labHref('07', 'S3-2'), label: '실제 요청과 오류 살펴보기' },
  K8: { to: labHref('07', 'S3-2', '#b'), label: '최소 연결 테스트 보기 (API +1회)' },
  K9: { to: labHref('08', 'S3-2', '#b'), label: '응답 JSON의 다른 필드 보기' },
  K10: { to: labHref('09'), label: '사람의 검토와 출력 통로 확인하기' },
  K11: { to: `${labPath}#데이터의-여행`, label: '데이터의 여행 다시 보기' },
};

export function StoryReturnNote({ id, screen, dismiss }: { id: string; screen: string; dismiss: () => void }) {
  const card = tripFor(screen, id);
  if (!card) return null;
  const next = nextLinks[card.id];
  const observation = id === '01'
    ? '연습 저장소에서 도움말을 출력해 `commit`과 `pr`을 확인했습니다.'
    : card.id === 'K11' && id === '09'
      ? '초안은 stdout 파일, 요청 횟수와 오류는 stderr 파일에서 확인할 수 있습니다.'
      : card.id === 'K11'
        ? '초안의 파일 이름·위치·추가 줄은 diff와 맞고, Why에는 AI가 추측한 이유가 들어 있습니다.'
        : card.observe;
  return <aside className="b32-return-note" aria-label="실습 복귀 안내" data-round-trip={card.id}>
    <div className="b32-return-heading">
      <strong>Lab {id} 결과와 그림 맞춰 보기</strong>
      <button type="button" onClick={dismiss}>안내 닫기</button>
    </div>
    <Markdown>{returnFocus(screen, id)}</Markdown>
    <details>
      <summary>관찰 기록 · 확인 질문</summary>
      <Markdown>{observation}</Markdown>
      <strong>확인 질문</strong>
      <Markdown>{screen === 'intro' ? '방금 한 작업은 그림의 어느 경계 안에서 일어났나요?' : card.check}</Markdown>
      <Link to={next.to}>{next.label}</Link>
      {card.id === 'K2' && screen === 'S1-2' && <> · <Link to={storyFor('S3-1', id)}>S3-1의 Git 문맥에서 이어 보기</Link></>}
    </details>
    <div className="b32-return-question"><Markdown>{screen === 'intro' ? '방금 한 작업은 그림의 어느 경계 안에서 일어났나요?' : card.check}</Markdown></div>
  </aside>;
}

const output = ownerOutputSource.replace(/\r\n/g, '\n').split('## Lab 08')[1].split('## Lab 09')[0];
export const draftRecords = [...output.matchAll(/^\$ python3 main\.py (?:commit|pr)\n([\s\S]+?^AI API 요청 횟수: 1)$/gm)]
  .map(match => match[1]);
if (draftRecords.length !== 2) throw new Error('11월 25일 COMMIT·PR 출력 전문이 필요합니다.');

export function StoryDraftRecords({ previous }: { previous: string }) {
  return <details>
    <summary>실제 COMMIT·PR 출력 전문</summary>
    <p>실제 실행 · 2026-11-25 Owner</p>
    {draftRecords.map(draft => <pre key={draft}>{draft}</pre>)}
    <details>
      <summary>이전 실행 사례 · Windows · 2026-10-20</summary>
      <Markdown>{previous}</Markdown>
    </details>
  </details>;
}
