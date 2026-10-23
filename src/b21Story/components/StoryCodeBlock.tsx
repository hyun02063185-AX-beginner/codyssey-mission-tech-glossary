import { useRef, useState } from 'react';
import type { StoryCode } from '../content/storyTypes';
export async function copySource(raw: string, writer?: (text: string) => Promise<void>): Promise<boolean> {
  try {
    if (writer) await writer(raw);
    else await navigator.clipboard.writeText(raw);
    return true;
  } catch { return false; }
}
export default function StoryCodeBlock({ block }: { block: StoryCode }) {
  const [status, setStatus] = useState(''), code = useRef<HTMLElement>(null);
  const labels = { code: '코드', command: '명령 예시', data: '데이터 예시', output: '기록된 실행 출력', text: '텍스트 예시' };
  const copyLabels = { code: '코드 원문 복사', command: '명령 원문 복사', data: '데이터 복사', output: '출력 복사', text: '텍스트 복사' };
  async function copy() {
    if (await copySource(block.raw)) setStatus('원문을 복사했습니다.');
    else {
      setStatus('복사하지 못했습니다. 선택된 원문을 직접 복사할 수 있습니다.');
      if (code.current) {
        const range = document.createRange(); range.selectNodeContents(code.current);
        const selection = window.getSelection(); selection?.removeAllRanges(); selection?.addRange(range);
      }
    }
  }
  return <div className={`b21-story-code is-${block.kind}`} data-block-id={block.id}>
    <div className="b21-story-code-label"><strong>{labels[block.kind]} · {block.language}</strong>
      <button type="button" onClick={copy}>{copyLabels[block.kind]}</button></div>
    {block.sourceFile && <p>예제 파일: <code>{block.sourceFile}</code></p>}
    {block.partial && <p>코드 조각입니다. 실행하려면 원고의 앞뒤 문맥과 필요한 정의를 함께 확인하세요.</p>}
    {block.kind === 'command' && <p>실행 위치와 준비 파일을 원고에서 먼저 확인하세요.</p>}
    <pre tabIndex={0} aria-label={`${labels[block.kind]} (${block.language}, 가로 스크롤 가능)`}><code ref={code}>{block.raw}</code></pre>
    <span role="status" aria-live="polite">{status}</span>
  </div>;
}
