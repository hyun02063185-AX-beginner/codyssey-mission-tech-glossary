import Markdown, { type Options } from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const b32V04RemarkPlugins: Options['remarkPlugins'] = [[remarkGfm, { singleTilde: false }]];

export default function B32MarkdownV04(props: Omit<Options, 'remarkPlugins'>) {
  return <Markdown {...props} remarkPlugins={b32V04RemarkPlugins}/>;
}
