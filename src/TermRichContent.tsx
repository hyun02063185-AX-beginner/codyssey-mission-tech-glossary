import { Fragment, useEffect, useState, type ReactNode } from 'react';
import cidrRangeSvg from './assets/b3-1/cidr-range.svg?raw';
import sshKeyAuthSvg from './assets/b3-1/ssh-key-auth.svg?raw';
import erdDesktop from './assets/glossary/b6-1/erd-basics-desktop.svg?raw';
import erdMobile from './assets/glossary/b6-1/erd-basics-mobile.svg?raw';
import keysDesktop from './assets/glossary/b6-1/pk-fk-relationship-desktop.svg?raw';
import keysMobile from './assets/glossary/b6-1/pk-fk-relationship-mobile.svg?raw';
import joinDesktop from './assets/glossary/b6-1/join-inner-left-desktop.svg?raw';
import joinMobile from './assets/glossary/b6-1/join-inner-left-mobile.svg?raw';

type RichSection = { heading: string; body: string };

const figures: Record<string, { svg: string; mobile?:string; caption: string }> = {
  'assets/ssh-key-auth.svg': { svg: sshKeyAuthSvg, caption: 'SSH 키 인증 흐름' },
  'assets/cidr-range.svg': { svg: cidrRangeSvg, caption: 'CIDR 접두사 길이와 주소 범위' },
  'assets/erd-basics.svg': {svg:erdDesktop,mobile:erdMobile,caption:'ERD 읽기 — 상자는 표, 선은 관계, 선 끝 기호는 최소·최대 개수 (B6-1 사례 일부)'},
  'assets/pk-fk-relationship.svg': {svg:keysDesktop,mobile:keysMobile,caption:'FK 값이 다른 표의 PK 값을 가리킨다 (B6-1 사례 일부, 거부 행은 교육용 예시)'},
  'assets/join-inner-left.svg': {svg:joinDesktop,mobile:joinMobile,caption:'같은 데이터에서 INNER JOIN과 LEFT JOIN의 결과 비교 (B6-1 사례 일부)'},
};

function inline(text: string): ReactNode[] {
  const tokens = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return tokens.filter(Boolean).map((token, index) => {
    if (token.startsWith('`')) return <code key={index}>{token.slice(1, -1)}</code>;
    if (token.startsWith('**')) return <strong key={index}>{token.slice(2, -2)}</strong>;
    return <Fragment key={index}>{token}</Fragment>;
  });
}

function cells(line: string) { return line.trim().replace(/^\||\|$/g, '').split('|').map(cell => cell.trim()); }
function isTableDivider(line: string) { return /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(line); }
function isBlockStart(line: string, next = '') { return !line || /^#{3} /.test(line) || /^!\[.*\]\(.+\)$/.test(line) || /^```/.test(line) || /^> ?/.test(line) || /^[-*] /.test(line) || /^\d+\. /.test(line) || (line.includes('|') && isTableDivider(next)); }

function Figure({ path, alt }: { path: string; alt: string }) {
  const figure = figures[path];
  const [mobile,setMobile]=useState(()=>typeof window!=='undefined'&&window.matchMedia('(max-width:700px)').matches);
  const responsive=Boolean(figure?.mobile);
  useEffect(()=>{
    if(!responsive)return;
    const media=window.matchMedia('(max-width:700px)'),update=()=>setMobile(media.matches);
    update();media.addEventListener('change',update);return()=>media.removeEventListener('change',update);
  },[responsive]);
  if (!figure) return <p className="notice">{alt}</p>;
  return <figure className={`rich-figure${responsive?' is-responsive':''}`} data-figure={path} data-variant={responsive?(mobile?'mobile':'desktop'):'legacy'}>
    <div className="rich-svg-scroll" aria-label={responsive?undefined:`${alt}는 가로로 스크롤해 자세히 볼 수 있습니다.`}>
      <div className="rich-svg" dangerouslySetInnerHTML={{ __html: responsive&&mobile?figure.mobile!:figure.svg }} />
    </div>
    <figcaption>{figure.caption}</figcaption>
  </figure>;
}

function Table({ lines }: { lines: string[] }) {
  const [header, , ...rows] = lines;
  return <div className="connection-table-wrap rich-table" role="region" aria-label="용어 설명 비교표" tabIndex={0}>
    <table><thead><tr>{cells(header).map((cell, index) => <th key={index}>{inline(cell)}</th>)}</tr></thead>
      <tbody>{rows.map((row, rowIndex) => <tr key={rowIndex}>{cells(row).map((cell, cellIndex) => cellIndex === 0 ? <th key={cellIndex} scope="row">{inline(cell)}</th> : <td key={cellIndex}>{inline(cell)}</td>)}</tr>)}</tbody>
    </table>
  </div>;
}

function Blocks({ markdown }: { markdown: string }) {
  const lines = markdown.split('\n'); const blocks: ReactNode[] = []; let index = 0;
  while (index < lines.length) {
    const line = lines[index]; const next = lines[index + 1] ?? '';
    if (!line.trim()) { index += 1; continue; }
    const image = line.match(/^!\[([^\]]+)\]\(([^)]+)\)$/);
    if (image) { blocks.push(<Figure key={index} alt={image[1]} path={image[2]} />); index += 1; continue; }
    if (line.startsWith('### ')) { blocks.push(<h3 key={index}>{inline(line.slice(4))}</h3>); index += 1; continue; }
    if (line.startsWith('```')) { const code: string[] = []; index += 1; while (index < lines.length && !lines[index].startsWith('```')) code.push(lines[index++]); index += 1; blocks.push(<pre className="code" key={index}>{code.join('\n')}</pre>); continue; }
    if (line.startsWith('>')) { const quote: string[] = []; while (index < lines.length && lines[index].startsWith('>')) quote.push(lines[index++].replace(/^> ?/, '')); blocks.push(<blockquote key={index}>{quote.map((part, partIndex) => <p key={partIndex}>{inline(part)}</p>)}</blockquote>); continue; }
    if (line.includes('|') && isTableDivider(next)) { const table = [line, next]; index += 2; while (index < lines.length && lines[index].includes('|') && lines[index].trim()) table.push(lines[index++]); blocks.push(<Table key={index} lines={table} />); continue; }
    const ordered = line.match(/^\d+\. (.*)$/);
    if (ordered) { const items: string[] = []; while (index < lines.length) { const item = lines[index].match(/^\d+\. (.*)$/); if (!item) break; items.push(item[1]); index += 1; } blocks.push(<ol key={index}>{items.map((item, itemIndex) => <li key={itemIndex}>{inline(item)}</li>)}</ol>); continue; }
    if (/^[-*] /.test(line)) { const items: string[] = []; while (index < lines.length && /^[-*] /.test(lines[index])) items.push(lines[index++].slice(2)); blocks.push(<ul key={index}>{items.map((item, itemIndex) => <li key={itemIndex}>{inline(item)}</li>)}</ul>); continue; }
    const paragraph: string[] = [line]; index += 1; while (index < lines.length && !isBlockStart(lines[index], lines[index + 1] ?? '')) paragraph.push(lines[index++]); blocks.push(<p key={index}>{inline(paragraph.join(' '))}</p>);
  }
  return <>{blocks}</>;
}

export function TermRichContent({ sections }: { sections: RichSection[] }) {
  return <div className="term-rich-content">{sections.map(section => <section key={section.heading}><h2>{section.heading}</h2><Blocks markdown={section.body} /></section>)}</div>;
}
