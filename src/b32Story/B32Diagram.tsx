import { useState, type ReactNode } from 'react';

export const memo = '실습 메모: AI가 작성한 초안은 사람이 검토한다.';
export const statusLine = ' M README.md';

export function Box({ title, tone = 'plain', children }: { title: string; tone?: string; children: ReactNode }) {
  return <div className={`b32-diagram-box b32-diagram-${tone}`}>
    <strong>{title}</strong>
    <div>{children}</div>
  </div>;
}

export function Arrow({ children, compare = false }: { children: ReactNode; compare?: boolean }) {
  return <div className={`b32-diagram-arrow ${compare ? 'b32-diagram-compare' : ''}`}>
    <span aria-hidden="true"/>{children}
  </div>;
}

export function Diagram({ id, title, options, initial, caption, canSelect, children }: {
  id: string; title: string; options?: Record<string, string>; initial?: string; caption?: ReactNode; canSelect?: (state: string, target: string) => boolean;
  children: (state: string) => ReactNode;
}) {
  const [state, setState] = useState(initial ?? 'all');
  return <figure className="b32-diagram" data-state={state} data-diagram={id} aria-labelledby={id}>
    <figcaption id={id}>{title}</figcaption>
    {caption}
    {options && <div className="b32-diagram-switch" role="group" aria-label="도식 보기 선택">
      {Object.entries(options).map(([value, label]) => <button key={value} type="button"
        aria-pressed={state === value} disabled={canSelect && !canSelect(state, value)} onClick={() => setState(value)}>{label}</button>)}
    </div>}
    <div aria-live={options ? 'polite' : undefined}>{children(state)}</div>
  </figure>;
}

export function GitAreasContents({ state, legacy = false }: { state: string; legacy?: boolean }) {
  const staged = state !== 'before';
  const split = state === 'mm';
  return <>
    <p className="b32-diagram-annotation"><code>git add README.md</code> · 작업 폴더의 README.md를 스테이징 영역으로 복사</p>
    <div className="b32-diagram-flow">
      <Box title="마지막 커밋 (HEAD)" tone="git">메모 없음</Box>
      <Arrow compare><code>git diff --cached</code><span>{staged ? '다름 → 메모 줄 출력' : '같음 → 출력 없음'}</span></Arrow>
      <Box title="스테이징 영역" tone={staged ? 'action' : 'git'}>{staged ? '메모 있음' : '메모 없음'}</Box>
      <Arrow compare><code>git diff</code><span>{split ? '다름 → 두 번째 메모 줄' : staged ? '같음 → 출력 없음' : '다름 → 메모 줄 출력'}</span></Arrow>
      <Box title="작업 폴더 (README.md)" tone="git">{split ? '메모 + 두 번째 메모' : '메모 있음'}</Box>
    </div>
    <div className="b32-diagram-status">
      <code>git status --short</code>
      <span>스테이징 <code>{staged ? 'M' : '\u00a0'}</code></span>
      <span>작업 폴더 <code>{staged && !split ? '\u00a0' : 'M'}</code></span>
      <code>README.md</code>
    </div>
    <p><mark>실습 메모</mark> <code>+{memo}</code></p>
    {legacy && <p className="b32-diagram-evidence">실제 실행 · 2026-11-25 add 전후, 재현 일치 · MM 재현<br/>스토리 S1-2의 그림은 add 이전 상태입니다.</p>}
  </>;
}

export function ContextSample({ heading = 'Git 문맥 · 이번 실행 535자' }: { heading?: string } = {}) {
  return <div className="b32-diagram-document">
    <strong>{heading}</strong>
    <code>Branch: main</code><code>{statusLine}</code>
    <code>…</code><code><mark>+{memo}</mark></code>
  </div>;
}

