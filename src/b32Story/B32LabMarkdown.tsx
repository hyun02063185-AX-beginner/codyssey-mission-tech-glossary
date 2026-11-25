import { useState, type ReactNode } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Link } from 'react-router-dom';
import { labHref, withLabReferences } from './labContent';
import { labPath } from './reviewMode';

const evidence = import.meta.glob('../../content/mission-stories/main-m06/assets/evidence/*2026-11-25.txt', {
  eager: true, query: '?url', import: 'default',
}) as Record<string, string>;

function CodeBlock({ text, kind, record, sends }: { text: string; kind: string; record: string; sends: boolean }) {
  const [status, setStatus] = useState('');
  const shell = kind === 'bash' || kind === 'zsh';
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus('복사했습니다.');
    } catch {
      setStatus('복사 권한을 확인하거나 블록에서 직접 선택해 주세요.');
    }
  }
  return <div className={`b32-lab-code ${shell ? 'b32-lab-command' : ''}`}>
    <div className="b32-lab-code-bar">
      <strong>{shell ? '터미널 명령' : record || (kind === 'text' ? '출력 · 참고 자료' : '구조 · 참고 코드')}</strong>
      {shell && <button type="button" onClick={copy} aria-label="명령 블록 복사">명령 복사</button>}
    </div>
    {shell && sends && <p className="b32-lab-cost">이 명령은 실제 API를 1회 호출합니다.</p>}
    <pre tabIndex={0}><code>{text.split('\n').map((line, index) => <span key={index}>
      {index > 0 && '\n'}{!shell && /^\+?실습 메모: AI가 작성한 초안은 사람이 검토한다\.$/.test(line)
        ? <mark>{line}</mark> : line}
    </span>)}</code></pre>
    {shell && <span className="b32-lab-copy-status" role="status">{status}</span>}
  </div>;
}

function recordFor(prefix: string) {
  const last = prefix.trimEnd().split(/\n\n/).at(-1) ?? '';
  if (last.includes('최소 연결 테스트')) return '실제 실행 · 최소 연결 테스트 · COMMIT·PR 응답 아님';
  if (last.includes('실제 ·')) return '실제 실행 · 2026-11-25 Owner';
  if (last.includes('재현 ·')) return '재현 검증 · Claude';
  if (last.includes('예상')) return '예상';
  if (last.includes('교육용 예시') || last.includes('진단용 예시')) return '교육용 예시';
  return '';
}

export default function B32LabMarkdown({ text, inline = false, lab }: { text: string; inline?: boolean; lab?: string }) {
  return <Markdown remarkPlugins={[remarkGfm]} components={{
    p: ({ children }) => inline ? <>{children}</> : <p>{children}</p>,
    a: ({ href = '', children }) => {
      if (/^#lab-\d{2}$/.test(href)) return <Link to={labHref(href.slice(-2))}>{children}</Link>;
      if (href === '#실습-정리') return <Link to={labHref('09', undefined, href)}>{children}</Link>;
      if (href.startsWith('#')) return <Link to={`${labPath}${href}`}>{children}</Link>;
      if (href.startsWith('assets/evidence/')) {
        const url = evidence[`../../content/mission-stories/main-m06/${href}`];
        return url ? <a href={url} target="_blank" rel="noreferrer">{children}</a> : <>{children}</>;
      }
      return <a href={href}>{children}</a>;
    },
    table: ({ children }) => <div className="b32-lab-table-scroll" tabIndex={0}><table>{children}</table></div>,
    code: ({ children }) => typeof children === 'string' && /^(실제 ·|재현 ·|예상$|교육용 예시$)/.test(children)
      ? <span className="b32-lab-badge">{children}</span> : <code>{children}</code>,
    li: ({ children, className }) => <li className={className}>{className === 'task-list-item'
      ? <label>{children}</label> : children}</li>,
    input: ({ type, checked }) => <input type={type} defaultChecked={checked}/>,
    pre: ({ node }) => {
      const start = node?.position?.start.offset ?? 0;
      const end = node?.position?.end.offset ?? 0;
      const [opening, ...body] = text.slice(start, end).split('\n');
      const fence = opening.match(/^(`{3,}|~{3,})(\S*)/);
      if (!fence) return <pre>{text.slice(start, end)}</pre>;
      if (body.at(-1)?.trimStart().startsWith(fence[1])) body.pop();
      const code = body.join('\n');
      const sends = (lab === '07' && /^(?:python3 main\.py commit$|printf .*\| curl)|request\.urlopen/m.test(code)) ||
        (lab === '08' && code === 'python3 main.py pr') ||
        (lab === '09' && code.startsWith('python3 main.py commit >'));
      const record = lab === '08' && code.startsWith('=== 검토용 초안:')
        ? '실제 실행 · 2026-11-25 Owner' : recordFor(text.slice(0, start));
      return <CodeBlock text={code} kind={fence[2]} record={record} sends={sends} />;
    },
  }}>{withLabReferences(text)}</Markdown>;
}

export function LabDetails({ id, label, open, children }: { id?: string; label: ReactNode; open?: boolean; children: ReactNode }) {
  return <details className="b32-lab-details" id={id} open={open}>
    <summary>{label}</summary>
    <div className="b32-lab-details-content">{children}</div>
  </details>;
}
