import type { SceneId, StepAddress } from '../content';

export interface TermConnection {
  termId: string; label: string; mode: 'direct' | 'extension';
  sources: readonly StepAddress[]; notice?: string;
}
// U4 sidecar only. U1's approved steps, hashes and candidate map stay read-only.
export const termConnections: readonly TermConnection[] = [
  {termId:'cli',label:'CLI',mode:'direct',sources:[{scene:'01',step:'2'}]},
  {termId:'module',label:'모듈',mode:'extension',sources:[{scene:'02',step:'11'}],notice:'용어 페이지는 JavaScript 중심입니다. Python의 모듈 설명은 Scene 02와 함께 확인하세요.'},
  {termId:'repository-pattern',label:'Repository',mode:'direct',sources:[{scene:'02',step:'4'}]},
  {termId:'layered-architecture',label:'역할 분리와 계층 구조',mode:'extension',sources:[{scene:'02',step:'5'},{scene:'02',step:'6'}],notice:'Service나 CLI 한 역할의 정의가 아니라 계층 분리와 의존 방향으로 확장하는 설명입니다.'},
  {termId:'crud',label:'CRUD',mode:'direct',sources:[{scene:'03',step:'1'}]},
  {termId:'summary-aggregation',label:'요약',mode:'extension',sources:[{scene:'03',step:'8'}],notice:'이 강의는 금액 합계·분류별 계산을 다룹니다. 용어 페이지는 정보 조각을 압축하는 일반적 요약 설명이며 같은 계산 기능의 정의가 아닙니다.'},
  {termId:'persistence',label:'영구 저장',mode:'direct',sources:[{scene:'04',step:'2'}]},
  {termId:'file-io',label:'파일 입출력',mode:'direct',sources:[{scene:'04',step:'4'}]},
  {termId:'json-lines',label:'JSONL',mode:'extension',sources:[{scene:'04',step:'6'},{scene:'05',step:'jsonl'}],notice:'파일 형식의 설명입니다. 메모리 사용량은 읽는 방식과 값을 보관하는 방식에 따라 달라집니다.'},
  {termId:'csv',label:'CSV',mode:'direct',sources:[{scene:'04',step:'8'}]},
  {termId:'iterator',label:'Iterator',mode:'extension',sources:[{scene:'05',step:'iter'}],notice:'Iterator라는 이름만으로 저절로 메모리가 절약되지는 않습니다. 공급·소비·보관 방식을 구분하세요.'},
  {termId:'generator',label:'Generator',mode:'direct',sources:[{scene:'05',step:'gen'}]},
  {termId:'yield',label:'yield',mode:'direct',sources:[{scene:'05',step:'give'}]},
  {termId:'decorator',label:'Decorator',mode:'extension',sources:[{scene:'06',step:'deco'}],notice:'정의 시 감싸기와 호출 시 실행을 구분하세요. 다른 Decorator 활용은 강의 예시보다 넓습니다.'},
  {termId:'function',label:'함수',mode:'direct',sources:[{scene:'06',step:'pass'}]},
  {termId:'exception-handling',label:'오류 처리',mode:'direct',sources:[{scene:'06',step:'err'}]},
  {termId:'type-hint',label:'Type Hint',mode:'direct',sources:[{scene:'07',step:'1'}]},
  {termId:'input-validation',label:'값 검증',mode:'extension',sources:[{scene:'07',step:'8'}],notice:'용어 페이지의 API 예와 강의의 CLI 예는 다릅니다. 형 표시·자료형 변환·값 검증을 구분하세요.'},
];
export const extensionNotice = '용어사전의 설명은 이 강의보다 넓을 수 있습니다.';
export const heldConcepts = [
  'Iterable', 'python -m', 'argparse', '옵션', '패키지', '__main__.py', 'import', 'Model', '메모리',
  '재대입', '함수 전달·반환', 'wrapper', '자료형 변환', 'Parameter·Argument', '__init__.py', '반복',
] as const;
export const heldTermIds = ['iterable','python-cli','argparse','package','main-py','import','model','memory','wrapper','parameter','argument','init','loop'] as const;
export const guideConnections: Readonly<Record<SceneId, readonly string[]>> = {
  '01':['01-cli-execution'], '02':['09-ledger-overview'], '03':['02-transaction-crud','05-search-summary'],
  '04':['03-file-persistence'], '05':['04-generator-streaming'], '06':['07-decorator-error-handling'],
  '07':['08-type-hint-validation'], '08':['09-ledger-overview'],
};
export const fieldMapConnections = [
  {scene:'04',href:'/maps/data-database?mission=main-m03'},
  {scene:'05',href:'/maps/data-database?mission=main-m03'},
  {scene:'08',href:'/maps/data-database?mission=main-m03'},
] as const;
export function isConnectedTerm(id: string) { return termConnections.some(term=>term.termId===id); }
