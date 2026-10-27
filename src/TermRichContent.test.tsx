import {describe,it,expect} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';
import {TermRichContent} from './TermRichContent';
import glossary from './data/generated/glossary.json';
describe('rich glossary sections and asset fallback',()=>{
  it.each(['erd','foreign-key','join','cidr','ssh-key'])('%s renders every source section and one accessible drawing',id=>{
    const term=glossary.find(term=>term.id===id)!,html=renderToStaticMarkup(<TermRichContent sections={term.richSections}/>);
    expect(html.match(/<svg\b/g)).toHaveLength(1);expect(html.match(/<h2>/g)).toHaveLength(term.richSections.length);expect(html).not.toContain('![');expect(html).toContain('흔한 오해');expect(html).toContain('동료평가 질문');expect(html).toContain('aria-labelledby=');
    if(id==='foreign-key'){expect(html).toContain('주의할 점 / 경계 조건');expect(html).toContain('NOT NULL');}
    if(id==='join'){expect(html).toContain('SELECT orders.id, users.name');expect(html).toContain('26행');expect(html).toContain('27행');expect(html).toContain('ORDER BY');}
  });
  it('renders missing or unregistered images as escaped alternative text',()=>{
    const html=renderToStaticMarkup(<TermRichContent sections={[{heading:'설명',body:'![<img onerror="boom"> 설명](assets/missing.svg)'}]}/>);
    expect(html).not.toContain('<svg');expect(html).not.toContain('<img');expect(html).not.toContain('![');expect(html).toContain('&lt;img');expect(html).toContain('설명');
  });
});
