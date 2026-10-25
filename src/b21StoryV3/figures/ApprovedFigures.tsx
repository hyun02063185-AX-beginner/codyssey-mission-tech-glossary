// JSX port of the eleven approved v3.7 figures. Lesson steps live only in U1 content.
import { useContext, type ReactNode } from 'react';
import type { TeachingStep } from '../content';
import { lectureMap as MAP8_SRC, lectureAreas, relationTypes, relationReviews, comparisonReviews, lectureTasks } from '../content';
import { FigureButton, FigureContext, keyed, rich } from './FigureContext';
import { LearningServiceConnected, serviceMapCaption } from '../../b21Learning/availability';
const AREAS8 = lectureAreas.map(a => ({id:a.id,n:a.scene,name:a.name,say:a.say,keys:a.concepts,review:a.review}));
const TYPES8 = relationTypes.map(t=>({t:t.type,mean:t.meaning,rel:t.relations[0],rel2:t.relations[1]}));
const REL8_REVIEW = Object.fromEntries(Object.entries(relationReviews).map(([id,links])=>[id,links!.map(l=>[l.target,l.label])]));
const CMP8_REVIEW = Object.fromEntries(Object.entries(comparisonReviews).map(([id,links])=>[id,links.map(l=>[l.target,l.label])]));
const TASKS8 = lectureTasks.map(t=>[t.q,t.areaId]);
const I = (d?: any, s: any = 28) => <><svg width={(s)} height={(s)} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>{d}</svg></>;
const ICON = {
    model: <><rect x={"4"} y={"3"} width={16} height={18} rx={"2"}/><path d={"M8 8h3M8 12h3M8 16h3M13 8h3M13 12h3M13 16h3"}/></>,
    repo: <><rect x={"3"} y={"4"} width={18} height={5} rx={"1"}/><path d={"M5 9v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9M10 13h4"}/></>,
    service: <><circle cx={"12"} cy={"12"} r={"3"}/><path d={"M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"}/></>,
    cli: <><rect x={"3"} y={"4"} width={18} height={16} rx={"2"}/><path d={"M7 9l3 3-3 3M12 15h5"}/></>
};
const esc = (s?: any) => s;
const PARTS = [
    { id: 'python', grp: 'py', tok: 'python', lbl: '실행 도구', mean: 'Python 프로그램을 실행해 주는 도구' },
    { id: 'target', grp: 'py', tok: '-m todo', lbl: '실행할 대상', mean: 'todo 프로그램을 실행해 줘' },
    { id: 'task', grp: 'app', tok: 'list', lbl: '할 일', mean: '목록을 보여 줘' },
    { id: 'cond', grp: 'app', tok: '--limit 5', lbl: '조건', mean: '최대 5개까지만' }
];
const ROLES = [
    { id: 'model', en: 'Model', ko: '기록의 모양을 정하는 부분', file: 'models.py', need: '할 일 기록이 어떤 모양인지 알아야 해', small: '내용, 완료 여부', ex: '할 일 하나 = 내용 + 완료 여부' },
    { id: 'repo', en: 'Repository', ko: '기록을 읽고 저장하는 부분', file: 'repository.py', need: '저장해 둔 기록을 꺼내 와야 해', ex: '저장된 할 일을 꺼내 오고, 새 할 일을 저장' },
    { id: 'service', en: 'Service', ko: '요청한 일을 처리하는 부분', file: 'services.py', need: '그중 5개를 골라야 해', ex: '목록에서 최대 5개 고르기' },
    { id: 'cli', en: 'CLI', ko: '명령을 받고 결과를 보여 주는 부분', file: 'cli.py', need: '고른 결과를 화면에 보여 줘야 해', ex: <><code>{"list --limit 5"}</code>{"를 받고, 고른 결과를 화면에 보여 주기"}</> }
];
const SITS = [
    { id: 'storage', text: '할 일을 저장하는 파일 형식을 바꾸고 싶다', target: 'repo' },
    { id: 'display', text: '목록을 표 모양으로 보여 주고 싶다', target: 'cli' }
];
const REC = [
    { id: 1, d: '10/01', iso: '2026-10-01', c: '간식', m: '떡볶이', a: 3000 },
    { id: 2, d: '10/02', iso: '2026-10-02', c: '교통', m: '버스', a: 1500 },
    { id: 3, d: '10/03', iso: '2026-10-03', c: '간식', m: '아이스크림', a: 2000 },
    { id: 4, d: '10/05', iso: '2026-10-05', c: '책', m: '만화책', a: 8000 }
];
const REC5 = { id: 5, d: '10/06', iso: '2026-10-06', c: '교통', m: '지하철', a: 1500 };
const UPD = { id: 3, a: 2500 }, DEL = 2, SEARCH = '간식';
const won = (n?: any) => n.toLocaleString('ko-KR') + '원';
const recRow = (r?: any, o: any = {}) => <><span className={"rec" + (o.cls ? ' ' + o.cls : '')}><span className={"no"}>{"#"}{r.id}</span><span className={"dt"}>{r.d}</span><span className={"ct"}>{r.c}</span><span className={"mm"}>{r.m}</span><span className={"am"}>{o.am || won(r.a)}</span>{o.b ? <><span className={"rb"}>{o.b}</span></> : ''}</span></>;
const miniRow = (r?: any) => <><span className={"rec"}><span className={"no"}>{"#"}{r.id}</span><span className={"mm"}>{r.m}</span><span className={"am"}>{won(r.a)}</span></span></>;
const jsonl = (r?: any) => `{"id": ${r.id}, "date": ${JSON.stringify(r.iso)}, "category": ${JSON.stringify(r.c)}, "amount": ${r.a}, "memo": ${JSON.stringify(r.m)}}`;
const CSV_HEAD = 'id,date,category,amount,memo';
const csvRow = (r?: any) => [r.id, r.iso, r.c, r.a, r.m].join(',');
const goBtn = (sc?: any, label?: any) => <><FigureButton className={"go"} goScene={(sc)} focusKey={"go" + (sc + 1)}>{label}</FigureButton></>;
const OPS = [
    { id: 'create', cls: 'op-c', ko: '추가', en: 'Create', d: '새 기록을 더함' },
    { id: 'read', cls: 'op-r', ko: '조회', en: 'Read', d: '기록을 꺼내 봄' },
    { id: 'update', cls: 'op-u', ko: '수정', en: 'Update', d: '있는 기록을 바꿈' },
    { id: 'delete', cls: 'op-d', ko: '삭제', en: 'Delete', d: '있는 기록을 없앰' }
];
export function FigS3({ step: s }: {
    step: TeachingStep;
}) {
    const { reveal, file } = useContext(FigureContext);
    const book = (rows?: any, head?: any, acc?: any) => <><div className={"book"}><div className={"book-h"}><b>{"용돈 기입장 기록"}</b><span className={(acc ? 'acc' : '')}>{head}</span></div>{rows}</div></>;
    if (s.mode === 'sum') {
        const c = (v?: any, t?: any, b?: any, line?: any) => <><div className={"card"}><span className={"v"}>{v}</span><span className={"t"}>{t}</span><span className={"badge" + (line ? ' line' : '')}>{b}</span></div></>;
        return <><div className={"sumwrap"}><div className={"recap"}>{"\n      "}{c('바꾸는 일', '추가 · 수정 · 삭제', '원본이 바뀜')}{"\n      "}{c('꺼내 보는 일', '조회', '원본 그대로', 1)}{"\n      "}{c('고르는 일', '검색 — 조건에 맞는 기록들', '원본 그대로', 1)}{"\n      "}{c('계산하는 일', '요약 — 계산한 하나의 결과', '원본 그대로', 1)}{"\n    "}</div><p className={"next-q"}>{"다음 장면 · "}<b>{s.next?.question}</b>{" "}{goBtn(3, 'Scene 04로 ›')}</p></div></>;
    }
    if (s.mode === 'sr') {
        const hits = REC.filter((r?: any) => r.c === SEARCH), total = REC.reduce((t?: any, r?: any) => t + r.a, 0);
        const cats = [...new Set(REC.map((r?: any) => r.c))].map((c?: any) => [c, REC.filter((r?: any) => r.c === c).reduce((t?: any, r?: any) => t + r.a, 0)]);
        const showHit = s.sr === 'search';
        const rows = keyed(REC.map((r?: any) => recRow(r, showHit && r.c === SEARCH ? { cls: 'hit', b: '✓ ' + SEARCH } : {})));
        const search = <><FigureButton className={"rsp rsp-s hit" + (s.sr === 'search' ? ' on' : s.sr === 'summary' ? ' off' : '')} go={"search"} focusKey={"res-search"}>{"\n      "}<span className={"k"}>{"검색"}</span><span className={"cond"}>{"조건: 분류가 "}{SEARCH}</span>{keyed(hits.map(miniRow))}<span className={"foot"}>{"조건에 맞는 기록 "}{hits.length}{"개"}</span></FigureButton></>;
        const summ = <><FigureButton className={"rsp rsp-m hit" + (s.sr === 'summary' ? ' on' : s.sr === 'search' ? ' off' : '')} go={"summary"} focusKey={"res-summary"}>{"\n      "}<span className={"k"}>{"요약"}</span><span className={"cond"}>{"계산: 금액 합계"}</span><span className={"total"}>{won(total)}</span>{keyed(cats.map(([c, v]: any) => <><span className={"cat"}><span>{c}</span><b>{won(v)}</b></span></>))}<span className={"foot"}>{"기록 "}{REC.length}{"개를 계산한 결과"}</span></FigureButton></>;
        return <><div className={"s3 sr"}>{search}{book(rows, s.sr === 'both' ? '원본 4개 그대로' : '기록 4개', s.sr === 'both')}{summ}</div></>;
    }
    // ops / change
    let rows, head = '기록 4개', acc = false;
    if (s.mode === 'ops' && s.op === 'create') {
        rows = <>{keyed(REC.map((r?: any) => recRow(r)))}{recRow(REC5, { cls: 'new', b: '새로 추가' })}</>;
        head = '기록 4개에서 5개로';
        acc = true;
    }
    else if (s.mode === 'ops' && s.op === 'update') {
        rows = keyed(REC.map((r?: any) => r.id === UPD.id ? recRow(r, { cls: 'upd', b: '수정됨', am: <><s>{won(r.a)}</s><ins>{won(UPD.a)}</ins></> }) : recRow(r)));
        head = '기록 4개 · 1곳 바뀜';
        acc = true;
    }
    else if (s.mode === 'ops' && s.op === 'delete') {
        rows = keyed(REC.map((r?: any) => r.id === DEL ? recRow(r, { cls: 'del', b: '삭제됨' }) : recRow(r)));
        head = '기록 4개에서 3개로';
        acc = true;
    }
    else if (s.mode === 'ops' && s.op === 'read') {
        rows = keyed(REC.map((r?: any) => recRow(r)));
        head = '기록 4개 그대로 · 원본 변화 없음';
        acc = true;
    }
    else {
        rows = keyed(REC.map((r?: any) => recRow(r)));
        head = s.mode === 'change' ? '처음 기록 4개 · 각 변화는 여기서 따로 비교' : '기록 4개';
    }
    const op = (o?: any) => {
        const sel = s.op === o.id;
        const gb = s.mode === 'change' ? (o.id === 'read' ? <><span className={"gb badge line"}>{"원본 그대로"}</span></> : <><span className={"gb badge"}>{"원본이 바뀜"}</span></>) : '';
        return <><FigureButton className={"op hit " + (o.cls) + (sel ? ' sel' : '')} go={(o.id)} focusKey={"op-" + (o.id)} aria-pressed={(sel)}>{gb}<span className={"ko"}>{o.ko}</span><span className={"en"}>{o.en}</span><span className={"d"}>{o.d}</span></FigureButton></>;
    };
    return <><div className={"s3"}>{keyed(OPS.map(op))}{book(rows, head, acc)}<div className={"note"}>{"네 동작의 분류 — 순서가 아닙니다"}</div></div></>;
}
export function FigS4({ step: s }: {
    step: TeachingStep;
}) {
    const { reveal, file } = useContext(FigureContext);
    if (s.mode === 'mf') {
        const k = s.st, flowOn = k === 'flow' || k === 'saved', exited = k === 'exit' || k === 'saved';
        const fileRecs = flowOn ? [...REC, REC5] : REC;
        const fb = (n?: any, t?: any, v?: any, role?: any, on?: any) => <><FigureButton className={"fb hit" + (on ? ' on' : '')} go={"flow"} focusKey={"fb-" + (n)}><span className={"k"}>{n}{" "}{t}</span><span className={"v"}>{v}</span>{role && k === 'saved' ? <><span className={"badge soft role"}>{role}</span></> : ''}</FigureButton></>;
        const flow = <><div className={"flowbar" + (flowOn ? ' on' : '')} aria-label={"저장할 때 일어나는 일"}>{fb('①', '사용자 요청', '기록 추가: 10/06 교통 지하철 1,500원', '', false)}<span className={"arrow-h"} aria-hidden={"true"}></span><span className={"arrow-v"} aria-hidden={"true"}></span>{fb('②', '프로그램의 처리', '내용을 확인하고 번호를 붙임', 'Service', false)}<span className={"arrow-h"} aria-hidden={"true"}></span><span className={"arrow-v"} aria-hidden={"true"}></span>{fb('③', '파일에 저장', '파일 끝에 한 줄 덧붙임', 'Repository', true)}</div>{"\n      "}<div className={"flowcap" + (flowOn ? ' on' : '')}>{"저장하는 단계가 있어야 파일이 바뀝니다"}</div></>;
        const memRows = exited ? <><span className={"empty"}>{"프로그램 종료 — 메모리 비워짐"}{k === 'exit' ? recRow(REC5, { cls: 'gone', b: '남지 않음' }) : ''}</span></>
            : <>{keyed(REC.map((r?: any) => recRow(r)))}{recRow(REC5, { cls: 'new', b: flowOn ? '파일에도 저장됨' : '방금 추가 · 아직 파일에 없음' })}</>;
        const fileRows = <>{keyed(fileRecs.map((r?: any) => recRow(r, r.id === 5 ? { cls: 'new', b: '저장됨' } : {})))}{(exited ? <><span className={"badge acc stay"}>{"프로그램을 끝내도 남음"}</span></> : '')}</>;
        const pane = (id?: any, cls?: any, title?: any, sub?: any, rows?: any, on?: any) => <><FigureButton className={"pane " + (cls) + " hit" + (on ? ' on' : '')} go={(id)} focusKey={"pane-" + (id)}><span className={"pane-h"}><b>{title}</b><span>{sub}</span></span>{rows}</FigureButton></>;
        return <><div className={"s4"}>{flow}<div className={"mf"}>{"\n      "}{pane('mem', 'memp', '메모리', exited ? '프로그램 종료' : '프로그램 실행 중', memRows, k === 'mem')}{"\n      "}{pane('file', 'filep', '파일', '저장된 기록', fileRows, k === 'file' || k === 'exit' || k === 'saved')}{"\n    "}</div></div></>;
    }
    if (s.mode === 'jsonl') {
        const recs = [...REC, REC5], pair = s.sub === 'pair';
        const mark = (r?: any) => {
            if (!pair || r.id !== 1)
                return esc(jsonl(r));
            return jsonl(r).replace(/"(id|date|category|amount|memo)":/g, '<span class="kname">"$1"</span>:').replace(/: ("[^"]*"|\d+)/g, ': <span class="kval">$1</span>');
        };
        return <><div className={"fwrap"}><div className={"fwin on"}><div className={"fwin-h"}><code>{"records.jsonl"}</code>{" · 학습용 가상 기록"}</div><div className={"lines"}>{"\n      "}{keyed(recs.map((r?: any, i?: any) => <><FigureButton className={"ln hit" + (pair && i === 0 ? ' on' : '')} go={"pair"} focusKey={"ln-" + (i + 1)}><span className={"gut"}>{i + 1}</span><code>{rich(mark(r))}</code><span className={"lab"}>{"기록 "}{r.id}</span></FigureButton></>))}{"\n    "}</div></div>{pair ? <><div className={"legend"}><span><code className={"kname"}>{"\"date\""}</code>{" 항목 이름"}</span><span><code className={"kval"}>{"\"2026-10-01\""}</code>{" 값"}</span></div></> : <><div className={"fsub"}>{"한 줄 = 기록 하나 · 좁은 화면에서는 접혀 보여도 파일에서는 한 줄입니다"}</div></>}</div></>;
    }
    if (s.mode === 'csv') {
        const recs = [...REC, REC5], hd = s.sub === 'header';
        return <><div className={"csvg"}><div className={"fwin"}><div className={"fwin-h"}><code>{"records.csv"}</code>{" · 학습용 가상 기록"}</div><div className={"lines"}>{"\n      "}<FigureButton className={"ln hit" + (hd ? ' on' : '')} go={"header"} focusKey={"csv-h"}><span className={"gut"}>{"1"}</span><code>{CSV_HEAD}</code><span className={"lab"}></span></FigureButton>{"\n      "}{keyed(recs.map((r?: any, i?: any) => <><div className={"ln"}><span className={"gut"}>{i + 2}</span><code>{csvRow(r)}</code><span className={"lab"}></span></div></>))}{"\n    "}</div></div><div><table className={"tb" + (hd ? ' hd' : '')}><thead><tr>{keyed(CSV_HEAD.split(',').map((h?: any) => <><th>{h}</th></>))}</tr></thead><tbody>{keyed(recs.map((r?: any) => <><tr><td className={"n"}>{r.id}</td><td>{r.iso}</td><td>{r.c}</td><td className={"n"}>{r.a}</td><td>{r.m}</td></tr></>))}</tbody></table><div className={"tbcap"}>{hd ? '첫 줄 = 열 이름 (한 번만) · 다음 줄부터 한 줄 = 기록 하나' : '같은 기록 5개를 표로 본 모습'}</div></div></div></>;
    }
    if (s.mode === 'cmp') {
        const use = s.sub === 'use';
        return <><div className={"cmpg"}>{"\n      "}<div className={"rl"}></div><div className={"h"}>{"JSONL"}</div><div className={"h"}>{"CSV"}</div>{"\n      "}<div className={"rl"}>{"한 줄 예"}</div><div><code>{"{\"id\": 1, \"date\": \"2026-10-01\", …}"}</code></div><div><code>{csvRow((REC as any)[0])}</code></div>{"\n      "}<div className={"rl"}>{"모양"}</div><div>{"줄마다 항목 이름과 값을 함께 적음"}</div><div>{"열 이름은 첫 줄에 한 번, 아래 줄은 쉼표로 나눈 값"}</div>{"\n      "}<div className={"rl"}>{"잘 맞는 곳"}</div><div>{"기록 하나를 이름표와 함께 한 줄에 담기"}</div><div>{"표 프로그램에서 열어 보고 주고받기"}</div>{"\n      "}<FigureButton className={"rl use hit" + (use ? '' : ' off')} go={"use"} focusKey={"cmp-use"}>{"용돈 기입장"}{use ? <><br />{"실제 사례"}</> : ''}</FigureButton><div className={"use" + (use ? '' : ' off')}>{use ? <>{"기록 저장 · "}<code>{"data/"}<wbr />{"transactions.jsonl"}</code></> : '다음 단계'}</div><div className={"use" + (use ? '' : ' off')}>{use ? <>{"가져오기·내보내기 · "}<code>{"import"}</code>{" / "}<code>{"export"}</code></> : '다음 단계'}</div>{"\n    "}</div></>;
    }
    // sum
    const c = (v?: any, t?: any) => <><div className={"card"}><span className={"v"}>{v}</span><span className={"t"}>{t}</span></div></>;
    return <><div className={"sumwrap"}><div className={"recap"}>{"\n    "}{c('메모리', '프로그램 실행 중에만 기록을 둠')}{"\n    "}{c('파일 저장', '저장 단계를 거친 기록은 끝내도 남음 · Repository')}{"\n    "}{c('JSONL', '한 줄 = 기록 하나 · 용돈 기입장의 기록 저장')}{"\n    "}{c('CSV', '첫 줄 열 이름 + 행 · 용돈 기입장의 가져오기·내보내기')}{"\n  "}</div><p className={"next-q"}>{"다음 장면 · "}<b>{s.next?.question}</b>{" "}{goBtn(4, 'Scene 05로 ›')}</p></div></>;
}
const G5 = [...REC, REC5];
const D6FN = ['기록 추가', '기록 수정', '기록 삭제', '기록 검색'];
export function FigS5({ step: s }: {
    step: TeachingStep;
}) {
    const { reveal, file } = useContext(FigureContext);
    const dots = (n?: any) => <><span className={"g5-dots"} aria-hidden={"true"}>{keyed(Array.from({ length: n }, () => <><i></i></>))}</span></>;
    // ---- v3.7: 반복·Iterable·Iterator·관계·JSONL 연결 ----
    const FR = ['사과', '바나나', '포도'];
    const AH = <><span className={"arrow-h"} aria-hidden={"true"}></span><span className={"arrow-v"} aria-hidden={"true"}></span></>;
    if (s.mode === 'rep') {
        return <><div className={"i5-rep"}><div className={"i5-list on"}><span className={"i5-lh"}>{"리스트"}</span><div className={"i5-items"}>{keyed(FR.map((f?: any) => <><span className={"i5-it"}><b>{f}</b><small></small></span></>))}</div></div>{"\n      "}<div className={"i5-order"}>{"1번째 사과 · 2번째 바나나 · 3번째 포도 — 차례로 꺼내 씀"}</div></div></>;
    }
    if (s.mode === 'itr') {
        const k = String(s.sub), n = ({ iterable: 0, iter: 0, next1: 1, next2: 2, iterend: 3 } as any)[k];
        const items = keyed(FR.map((f?: any, i?: any) => {
            const done = i < n, cur = k !== 'iterend' && i === n - 1;
            return <><span className={"i5-it" + (cur ? ' cur' : done ? ' done' : '')}><b>{f}</b><small>{cur ? '여기까지 꺼냄' : done ? '✓ 꺼냄' : ''}</small></span></>;
        }));
        const out = ({ iterable: ['아직 없음', '', ''], iter: ['준비됨', '아직 꺼낸 값 없음', ''], next1: ['건넨 값', '사과', '1번째까지 꺼냄'], next2: ['건넨 값', '바나나', '2번째까지 꺼냄'], iterend: ['끝', '꺼낼 값 없음', '더 없다고 알림'] } as any)[k];
        return <><div className={"i5-itr"}>{"\n      "}<div className={"i5-list" + (k === 'iterable' ? ' on' : '')}><span className={"i5-lh"}>{"Iterable · 리스트"}</span><div className={"i5-items"}>{items}</div>{k === 'iterend' ? <><span className={"i5-keep"}>{"리스트는 그대로 · 세 값 모두 남아 있음"}</span></> : ''}</div>{"\n      "}<div className={"i5-ch" + (k === 'iter' ? ' on' : '')}>{AH}<span>{"iter()"}</span></div>{"\n      "}<div className={"i5-box" + (k === 'iterable' ? ' ghost' : ' on')}><span className={"i5-bh"}><b>{"Iterator"}</b><span>{"다음 값을 꺼내고 위치를 기억"}</span></span>{"\n        "}{['next1', 'next2', 'iterend'].includes(k) ? <><span className={"i5-tag"}>{"next()"}</span></> : ''}{"\n        "}<span className={"i5-out"}><span className={"k"}>{(out as any)[0]}</span>{(out as any)[1] ? <><b>{(out as any)[1]}</b></> : ''}{(out as any)[2] ? <><span className={"s"}>{(out as any)[2]}</span></> : ''}</span></div>{"\n    "}</div></>;
    }
    if (s.mode === 'sets') {
        const g = s.sub === 'genkind';
        return <><div className={"i5-sets"}><span className={"i5-sl"}>{"Iterable"}<span>{"반복할 수 있는 대상"}</span></span>{"\n      "}<div className={"i5-outside"}><b>{"리스트"}</b><span>{"Iterable이지만 Iterator는 아님"}</span></div>{"\n      "}<div className={"i5-iter" + (g ? '' : ' on')}><span className={"i5-sl"}>{"Iterator"}<span>{"다음 값을 꺼내고 위치를 기억 · Iterable이기도 함"}</span></span>{"\n        "}<div className={"i5-gen" + (g ? ' on' : '')}><b>{"Generator 객체"}</b><span>{"Iterator의 한 종류 · 요청받을 때 값을 만들어 건넴"}</span></div></div>{"\n      "}<span className={"i5-src"}>{"원본 개념지도 관계 R41 ‘Iterator도 Iterable’ · R23 ‘Iterator의 한 종류’ · 실행 순서가 아닌 포함·종류 관계"}</span></div></>;
    }
    if (s.mode === 'jsonl') {
        return <><div className={"i5-jl"}>{"\n      "}<div className={"i5-card"}><h3>{"JSONL"}<small>{"저장 형식 · Scene 04"}</small></h3><p>{"파일에 기록을 한 줄에 하나씩 적는 규칙"}</p>{keyed(G5.slice(0, 3).map((r?: any, i?: any) => <><span className={"i5-line"}>{i + 1}{"번 줄 · #"}{r.id}{" "}{r.m}</span></>))}</div>{"\n      "}<div className={"i5-card"}><h3>{"Generator"}<small>{"처리 방식 · Scene 05"}</small></h3><p>{"요청을 받을 때 값을 하나씩 만들어 건네는 방식"}</p><span className={"i5-req"}><span>{"다음 기록 줘"}</span><span>{"기록 하나"}</span></span></div>{"\n      "}<div className={"i5-jlcap"}>{"한 줄씩 적힌 파일은 하나씩 건네기에 잘 맞지만, 형식이 메모리를 아껴 주는 것은 아닙니다"}</div></div></>;
    }
    if (s.mode === 'gen') {
        const k = String(s.sub);
        // 각 상태: 건넨 줄 수, 책갈피 위치/글, 주고받기, Generator 상태, 처리하는 쪽
        const S = ({
            start: { done: 0, mark: 0, give: true, ask: true, st: ['', '시작 전', '요청을 기다림'], got: null, cnt: 0, giveTx: '기록 건넴', askTx: '다음 기록 줘' },
            give: { done: 1, mark: 0, give: true, st: ['give', '값을 건넴 (yield)', '1번 줄을 읽어 #1을 건넴'], got: (G5 as any)[0], cnt: 0, giveTx: '기록 #1 건넴' },
            pause: { done: 1, mark: 1, mtx: '여기서 멈춤', st: ['pause', '잠시 멈춤', '다음 요청을 기다리는 중'], got: (G5 as any)[0], cnt: 0, proc: '#1을 처리하는 중' },
            ask: { done: 1, mark: 1, mtx: '여기서 멈춤', ask: true, st: ['go', '다시 움직임', '요청을 받음'], got: (G5 as any)[0], cnt: 1, proc: '#1 처리 끝', askTx: '다음 기록 줘' },
            resume: { done: 2, mark: 2, mtx: '여기서 이어감', give: true, st: ['give', '이어서 진행 · 값을 건넴', '멈춘 곳 다음 줄(2번 줄)부터'], got: (G5 as any)[1], cnt: 1, giveTx: '기록 #2 건넴' },
            end: { done: 5, mark: 0, ask: true, st: ['end', '끝남', '더 건넬 기록 없음'], got: null, cnt: 5, askTx: '다음 기록 줘 (더 없음)', endTx: '받을 기록이 더 없음' }
        } as any)[k];
        const lines = keyed(G5.map((r?: any, i?: any) => {
            const n = i + 1, done = n <= S.done, mark = n === S.mark;
            const cls = mark ? 'mark' : done ? 'done' : 'unread';
            const lab = mark ? S.mtx : done ? '건넴 ✓' : '아직 읽지 않음';
            return <><span className={"g5-ln " + (cls)}><span className={"n"}>{n}{"번 줄"}</span><span>{"#"}{r.id}{" "}{r.m}{" "}{won(r.a)}</span><span className={"l"}>{lab}</span></span></>;
        }));
        const pz = (S.st as any)[0] === 'pause' ? <><span className={"g5-pz"} aria-hidden={"true"}></span></> : '';
        const gen = <><div className={"g5-box" + (['give', 'pause', 'resume', 'end'].includes(k) ? ' on' : '')}><span className={"g5-bh"}><b>{"Generator"}</b><span>{"기록을 하나씩 만들어 건넴"}</span></span>{"\n      "}<span className={"g5-state " + ((S.st as any)[0])}>{pz}<span>{(S.st as any)[1]}<span className={"g5-st-sub"}>{(S.st as any)[2]}</span></span></span>{"\n      "}<span className={"g5-lk"}>{"파일 records.jsonl · Generator가 읽는 곳"}</span>{lines}</div></>;
        const msg = (on?: any, dir?: any, tx?: any) => <><div className={"g5-msg" + (on ? ' on' : '')}><span className={"arrow-h" + (dir < 0 ? ' g5-rev' : '')} aria-hidden={"true"}></span><span className={"arrow-v" + (dir < 0 ? ' g5-revv' : '')} aria-hidden={"true"}></span><span>{tx || ''}</span></div></>;
        const ch = <><div className={"g5-ch"}>{msg(!!S.give, 1, S.giveTx || '기록 건넴')}{msg(!!S.ask, -1, S.askTx || '다음 기록 줘')}</div></>;
        const recv = S.got ? recRow(S.got, { cls: k === 'give' || k === 'resume' ? 'new' : '', b: k === 'give' || k === 'resume' ? '방금 받음' : '' }) : <><span className={"g5-empty"}>{S.endTx || '아직 받은 기록 없음'}</span></>;
        const con = <><div className={"g5-box" + (['ask', 'pause'].includes(k) ? ' on' : '')}><span className={"g5-bh"}><b>{"처리하는 쪽"}</b><span>{"기록을 받아 씀"}</span></span>{"\n      "}{recv}{S.proc ? <><span className={"g5-count"}>{S.proc}</span></> : ''}<span className={"g5-count"}>{"처리한 기록 "}{S.cnt}{"개"}</span></div></>;
        return <><div className={"g5-gen"}>{gen}{ch}{con}</div></>;
    }
    if (s.mode === 'keep') {
        const lane = (id?: any, on?: any, title?: any, ex?: any, mem?: any) => <><FigureButton className={"g5-lane hit" + (on ? ' on' : s.sub === 'both' ? '' : ' dim')} go={(id)} focusKey={"g5-" + (id)}>{"\n      "}<span className={"arrow-v"} aria-hidden={"true"}></span><span className={"g5-lh"}>{title}</span><span className={"g5-ak"}>{ex}</span>{mem}{"\n      "}<span className={"g5-disk"}>{"파일(저장 공간) · 100,000줄 그대로"}</span></FigureButton></>;
        return <><div className={"g5-keep"}><div className={"g5-src"}>{"Generator가 기록을 하나씩 건넴 · 100,000개"}</div>{"\n      "}{lane('drop', s.sub === 'drop', 'A. 하나씩 처리하고 보관하지 않음', '예: 금액을 합계에 더하고 기록은 버림', <><span className={"g5-mem"}><span className={"g5-mk"}>{"메모리"}</span><span className={"g5-memtxt"}>{"합계 하나"}</span>{recRow((REC as any)[0])}<span className={"g5-memtxt"}>{"+ 지금 받은 기록 1개"}</span></span></>)}{"\n      "}{lane('list', s.sub === 'list', 'B. 받은 기록을 모두 리스트에 모음', '예: 받은 기록을 리스트에 계속 추가', <><span className={"g5-mem"}><span className={"g5-mk"}>{"메모리 · 리스트"}</span>{dots(60)}<span className={"g5-memtxt"}>{"기록 100,000개"}</span></span></>)}{"\n      "}<div className={"g5-cap" + (s.sub === 'both' ? ' on' : '')}>{"메모리 사용은 받은 값을 어떻게 보관하느냐에 달려 있습니다"}</div></div></>;
    }
    if (s.mode === 'real') {
        const b = (k?: any, v?: any, extra: any = '') => <><div className={"g5-rb"}><span className={"k"}>{k}</span><span className={"v"}>{v}</span>{extra}</div></>;
        const A = <><span className={"arrow-h"} aria-hidden={"true"}></span><span className={"arrow-v"} aria-hidden={"true"}></span></>;
        return <><div className={"g5-realwrap"}><div className={"g5-real"}>{"\n      "}{b(<>{"data/"}<wbr />{"transactions.jsonl"}</>, 'JSONL 파일 · 한 줄 = 기록 하나')}{A}{"\n      "}{b('_iter_jsonl()', '한 줄 읽어 JSON 하나 건넴', <><span className={"badge soft y"}>{"yield"}</span></>)}{A}{"\n      "}{b('iter_all()', '기록 하나로 만들어 건넴', <><span className={"badge soft y"}>{"yield"}</span></>)}{A}{"\n      "}{b('서비스에서 사용', '받은 기록을 쓰는 방식이 다름', <><span className={"g5-uses"}><span>{"목록 · 최근 N개만 보관"}</span><span>{"검색 · 조건에 맞는 기록 보관"}</span><span>{"요약 · 합계만 계산"}</span></span></>)}{"\n    "}</div><span className={"g5-srcnote"}>{"repository.py · services.py · 커밋 d14e812 · 코드가 아닌 구조만 표시"}</span></div></>;
    }
    const c = (v?: any, t?: any) => <><div className={"card"}><span className={"v"}>{v}</span><span className={"t"}>{t}</span></div></>;
    return <><div className={"sumwrap"}><div className={"recap"}>{"\n    "}{c('Iterable', '반복할 수 있는 대상 · 예: 리스트')}{"\n    "}{c('Iterator', '다음 값을 꺼내고 위치를 기억')}{"\n    "}{c('Generator 객체', 'Iterator의 한 종류 · yield에서 건네고 멈췄다가 이어감')}{"\n    "}{c('보관 방식', '모두 모으면 메모리에 모두 쌓임')}{"\n  "}</div><p className={"next-q"}>{"다음 장면 · "}<b>{s.next?.question}</b>{" "}{goBtn(5, 'Scene 06으로 ›')}</p></div></>;
}
export function FigS6({ step: s }: {
    step: TeachingStep;
}) {
    const { reveal, file } = useContext(FigureContext);
    const fn = (name?: any, band?: any) => <><div className={"d6-fn"}><span className={"d6-core"}><small>{"원래 기능"}</small><b>{name}</b></span>{band ? <><span className={"d6-band"}>{"오류가 나면 [오류]·[힌트] 알리기"}<span className={"badge soft"}>{"반복"}</span></span></> : ''}</div></>;
    // ---- v3.7: 재대입·함수 전달/반환·감싸기 ----
    const AH = <><span className={"arrow-h"} aria-hidden={"true"}></span><span className={"arrow-v"} aria-hidden={"true"}></span></>;
    if (s.mode === 'reassign') {
        return <><div className={"f6-ra"}><div className={"f6-code"}><span>{"a = 1"}</span><span className={"c2"}>{"a = a + 1"}</span></div>{"\n      "}<div className={"f6-rows"}>{"\n        "}<div className={"f6-row"}><span className={"lab"}>{"a = 1"}</span><span className={"f6-name"}>{"a"}</span><span className={"f6-link"}></span><span className={"f6-val"}>{"1"}</span></div>{"\n        "}<div className={"f6-row"}><span className={"lab"}>{"a = a + 1"}</span><span className={"f6-val old"}>{"1"}</span><span>{"에 1을 더해 새 값"}</span><span className={"f6-val new"}>{"2"}</span></div>{"\n        "}<div className={"f6-row"}><span className={"lab"}>{"그 결과에"}</span><span className={"f6-name"}>{"a"}</span><span className={"f6-link"}></span><span className={"f6-val new"}>{"2"}</span></div>{"\n        "}<span className={"f6-note"}>{"값 1이 2로 바뀌는 것이 아니라, a라는 이름이 새 값 2를 가리킵니다"}</span>{"\n      "}</div></div></>;
    }
    if (s.mode === 'fn') {
        const k = String(s.sub), rb = k === 'rebind';
        const card = (cls?: any, on?: any, inner?: any, tag?: any) => <><div className={"f6-card " + (cls) + (on ? ' on' : '')}>{tag ? <><span className={"f6-name"}>{"work"}</span></> : ''}{inner}</div></>;
        return <><div className={"f6-fnwrap"}><div className={"f6-codeline" + (rb ? ' on' : '')}>{"work = decorate(work)"}</div><div className={"f6-fn"}>{"\n      "}{card('', k === 'pass', <><b>{"원래 함수"}</b><code>{"work"}</code><span>{"예: 기록 추가"}</span>{rb ? <><span className={"kept"}>{"원래 함수는 그대로 · 새 함수 안에서 쓰임"}</span></> : ''}</>, !rb)}{"\n      "}<div className={"f6-ar" + (k === 'pass' ? ' on' : '')}>{AH}<span>{"함수를 값처럼 넘김"}</span></div>{"\n      "}{card('deco', false, <><b>{"꾸미는 함수"}</b><code>{"decorate"}</code><span>{"함수를 받아 새 함수를 만듦"}</span></>)}{"\n      "}<div className={"f6-ar" + (k === 'ret' ? ' on' : '')}>{AH}<span>{"새 함수를 돌려줌"}</span></div>{"\n      "}{card('', k !== 'pass', <><b>{"새 함수"}</b><span>{"원래 함수를 안에 품음"}</span></>, rb)}{"\n    "}</div><div className={"f6-same" + (rb ? ' on' : '')}>{"a = a + 1과 같은 모양 — 결과에 같은 이름을 다시 연결"}</div></div></>;
    }
    if (s.mode === 'wrapfn') {
        const pp = s.sub === 'prepost';
        const inner = pp ? <><div className={"f6-step add"}><b>{"실행 전"}</b><span>{"‘시작합니다’ 알림"}</span></div>{AH}<div className={"f6-step core"}><b>{"원래 함수 실행"}</b><span>{"기록 추가"}</span></div>{AH}<div className={"f6-step add"}><b>{"실행 후"}</b><span>{"‘끝났습니다’ 알림"}</span></div></>
            : <><div className={"f6-step core"}><b>{"원래 함수 실행"}</b><span>{"기록 추가 · 원래 함수는 고치지 않음"}</span></div></>;
        return <><div className={"f6-shell"}><span className={"t"}>{"새 함수 · 원래 함수를 감싼 함수"}</span><div className={"f6-inner"}>{inner}</div>{pp ? <><div className={"f6-cap"}>{"정상적으로 끝난 경우의 예"}</div></> : ''}</div></>;
    }
    if (s.mode === 'rep')
        return <><div className={"d6-wrapall"}><span className={"d6-label"}>{"만약 기능마다 따로 처리한다면 · 개념 그림"}</span><div className={"d6-row"}>{keyed(D6FN.map((n?: any) => fn(n, true)))}</div></div></>;
    if (s.mode === 'gather')
        return <><div className={"d6-ba"}>{"\n    "}<FigureButton className={"d6-half hit"} go={"rep"} focusKey={"d6-before"}><h3>{"전 · 기능마다 같은 처리"}</h3><div className={"d6-row"}>{keyed(D6FN.map((n?: any) => fn(n, true)))}</div></FigureButton>{"\n    "}<div className={"d6-half on"}><h3>{"후 · 공통 처리 한 곳"}</h3><div className={"d6-row"}>{keyed(D6FN.map((n?: any) => fn(n, false)))}</div><div className={"d6-shared"}>{"공통 처리 · 오류가 나면 [오류]·[힌트] 알리기"}<small>{"한 곳에서 관리"}</small></div></div></div></>;
    if (s.mode === 'wrap') {
        const k = String(s.sub);
        const inOn = k === 'inner' || k === 'ok' || k === 'err', outOn = k === 'outer' || k === 'ok' || k === 'err';
        const is = k === 'ok' ? '✓ 끝까지 정상 완료' : k === 'err' ? '✕ 정해 둔 종류의 오류 발생 (예: 잘못된 금액)' : k === 'inner' ? '원래 일은 원래 기능이 합니다' : '';
        const slot = k === 'ok' ? '✓ 정상 결과를 돌려줌' : k === 'err' ? '오류를 받아 [오류]·[힌트]로 알림' : k === 'outer' ? '정해 둔 공통 처리만 합니다' : '';
        return <><div className={"d6-wrap" + (outOn ? ' on' : '')}>{"\n      "}<FigureButton className={"d6-wl hit"} go={"outer"} focusKey={"d6-outer"}>{"Decorator · 바깥: 덧붙인 공통 처리"}<span>{"예: 오류 처리"}</span></FigureButton>{"\n      "}<FigureButton className={"d6-in hit" + (inOn ? ' on' : '') + (k === 'err' ? ' err' : '')} go={"inner"} focusKey={"d6-inner"}><small>{"원래 기능 · 예: 기록 추가"}</small><b>{"원래 기능"}</b><p>{"기록을 확인하고 저장하는 원래 일"}</p><span className={"d6-is" + (is ? ' on' : '')}>{is}</span></FigureButton>{"\n      "}<div className={"d6-slot" + (slot ? ' on' : '')}>{slot}</div></div></>;
    }
    if (s.mode === 'real') {
        const edge = s.sub === 'edge', all = s.sub === 'all';
        const A = <><span className={"arrow-h"} aria-hidden={"true"}></span><span className={"arrow-v"} aria-hidden={"true"}></span></>;
        return <><div className={"g5-realwrap"}><div className={"d6-real"}>{"\n      "}<div className={"d6-rb"}><span className={"k"}>{"① CLI 명령"}</span><span className={"v"}>{"add · list · update · delete …"}</span></div>{A}{"\n      "}<div className={"d6-rwrap"}><div className={"d6-tl"}>{"handle_errors"}</div><div className={"d6-rb"}><span className={"k"}>{"② 모든 명령이 지나는 한 지점"}</span><span className={"v"}><code>{"_dispatch"}</code></span></div></div>{A}{"\n      "}<div className={"d6-outs"}>{"\n        "}<div className={"d6-out" + (edge ? '' : ' on')}><b>{"✓ 정상으로 끝남"}</b>{"종료 코드 0"}</div>{"\n        "}<div className={"d6-out" + (edge ? '' : ' on')}><b>{"LedgerError 계열 오류"}</b>{"[오류] 메시지 · [힌트] 힌트 출력 · 종료 코드 1"}</div>{"\n        "}<div className={"d6-out" + (edge || all ? ' on' : ' hide')}><b>{"✕ 그 밖의 오류 (프로그래밍 실수)"}</b>{"잡지 않음 · 그대로 드러남"}</div>{"\n      "}</div></div><span className={"g5-srcnote"}>{"decorators.py · cli.py · errors.py · 커밋 d14e812 · 코드가 아닌 구조만 표시"}</span></div></>;
    }
    if (s.mode === 'uses') {
        const m = (band?: any, real?: any, tag?: any) => <><div className={"d6-mini" + (real ? ' real' : '')}><div className={"d6-mw"}><span>{band}</span><div>{"원래 기능"}</div></div><span className={"badge " + (real ? 'real' : 'line')}>{tag}</span></div></>;
        return <><div className={"d6-uses"}>{m('오류 처리', 1, '용돈 기입장에 있음 · handle_errors')}{m('로그 기록', 0, '일반 개념 예시 · 용돈 기입장에는 없음')}{m('실행 시간 측정', 0, '일반 개념 예시 · 용돈 기입장에는 없음')}</div></>;
    }
    const c = (v?: any, t?: any) => <><div className={"card"}><span className={"v"}>{v}</span><span className={"t"}>{t}</span></div></>;
    return <><div className={"sumwrap"}><div className={"recap"}>{"\n    "}{c('함수도 값', '넘겨주고 돌려받을 수 있음')}{"\n    "}{c('감싸기', '새 함수 안에서 원래 함수를 실행')}{"\n    "}{c('Decorator', '원래 함수를 그대로 두고 공통 처리를 덧붙임')}{"\n    "}{c('정해 둔 일만', '용돈 기입장: LedgerError만 알림, 그 밖의 오류는 그대로')}{"\n  "}</div><p className={"next-q"}>{"다음 장면 · "}<b>{s.next?.question}</b>{" "}{goBtn(6, 'Scene 07로 ›')}</p></div></>;
}
export function FigS7({ step: s }: {
    step: TeachingStep;
}) {
    const { reveal, file } = useContext(FigureContext);
    if (s.mode === 'sign') {
        const k = String(s.sub);
        return <><div className={"t7-sign"}><div className={"t7-board"} aria-label={"amount: int"}><span className={"n"}>{"amount"}</span>{": "}<span className={"t"}>{"int"}</span></div>{"\n      "}<div className={"t7-calls"}><div className={"t7-call"}><code>{"amount"}</code><span>{"이름 · 금액"}</span></div><div className={"t7-call"}><code>{"int"}</code><span>{"기대하는 형 · 정수"}</span></div></div>{"\n      "}{k === 'pass' ? <><div className={"t7-pass"}>{keyed(['1000', '"1000"', '-5'].map((v?: any) => <><span className={"t7-val"}><code>{v}</code><span>{"그대로 지나감"}</span></span></>))}</div><div className={"t7-gate"}>{"안내판은 문이 아닙니다 — 실행 중에 값을 막지 않음"}</div></>
                : <><div className={"t7-row" + (k === 'who' ? ' on' : '')}><div className={"t7-card"}><b>{"사람"}</b><span>{"코드를 읽을 때 기대를 안다"}</span></div><div className={"t7-card"}><b>{"검사 도구"}</b><span>{"실행하기 전에 맞지 않는 곳을 찾아 줄 수 있다"}</span></div></div></>}{"\n    "}</div></>;
    }
    if (s.mode === 'cmp') {
        const R = [['1000', '✓ int와 맞음', '✓ 0보다 큰 정수 — 통과'], ['"1000"', '글자 — int와 다름 (그래도 막지는 않음)', '글자 그대로는 정수가 아님 — 먼저 바꿔야 함'], ['-5', '✓ int와 맞음', '✕ 0보다 크지 않음 — 거부']];
        return <><div className={"t7-tbl"}><div className={"h"}>{"값"}</div><div className={"h"}>{"Type Hint"}<small>{"기대하는 형 표시 · "}<code>{"amount: int"}</code></small></div><div className={"h"}>{"값 검증"}<small>{"실제 값 확인 · 금액 규칙: 0보다 큰 정수"}</small></div>{"\n      "}{keyed(R.map((r?: any, i?: any) => { const n = i + 1, hid = n > Number(s.sub) ? ' hid' : '', cur = n === s.sub ? ' cur' : ''; return <><div className={"v" + (cur)}><code>{(r as any)[0]}</code></div><div className={(hid) + (cur)}>{(r as any)[1]}</div><div className={(hid) + (cur)}>{(r as any)[2]}</div></>; }))}{"\n    "}</div></>;
    }
    if (s.mode === 'flow') {
        const A = <><span className={"arrow-h"} aria-hidden={"true"}></span></>;
        const R = [
            ['"1000"', ['ok', <><b>{"✓"}</b>{" "}<code>{"1000"}</code></>], ['ok', <><b>{"✓"}</b>{" 0보다 큼"}</>], ['ok', '사용']],
            ['"abc"', ['no', <><b>{"✕"}</b>{" 정수로 바꿀 수 없음"}</>], ['stop', '—'], ['no', '변환 단계에서 멈춤']],
            ['"-5"', ['ok', <><b>{"✓"}</b>{" "}<code>{"-5"}</code></>], ['no', <><b>{"✕"}</b>{" 0보다 크지 않음"}</>], ['no', '규칙 단계에서 거부']]
        ];
        const row = (r?: any, i?: any) => {
            const n = i + 1, h = n > Number(s.sub) ? ' hid' : '', c = n === s.sub ? ' cur' : '';
            return <><div className={"c" + (c)}><code>{(r as any)[0]}</code></div><span></span><div className={"c " + (((r as any)[1] as any)[0]) + (h) + (c)}>{((r as any)[1] as any)[1]}</div><span></span><div className={"c " + (((r as any)[2] as any)[0]) + (h) + (c)}>{((r as any)[2] as any)[1]}</div><span></span><div className={"c " + (((r as any)[3] as any)[0]) + (h) + (c)}>{((r as any)[3] as any)[1]}</div></>;
        };
        return <><div className={"t7-flow"}><div className={"fh"}>{"입력"}</div>{A}<div className={"fh"}>{"정수로 변환"}</div>{A}<div className={"fh"}>{"금액 규칙 검사"}</div>{A}<div className={"fh"}>{"결과"}</div>{"\n      "}{keyed(R.map(row))}<div className={"t7-fcap"}>{"이 순서는 이 예시의 처리 흐름입니다. 모든 프로그램이 같은 곳에서 같은 순서로 하는 것은 아닙니다."}</div></div></>;
    }
    if (s.mode === 'real') {
        const it = (t?: any, f?: any) => <><div className={"t7-item"}><span>{t}</span><small>{f}</small></div></>;
        return <><div className={"t7-wrap"}><div className={"t7-real"}>{"\n      "}<div className={"t7-role"}><h3>{"타입 표시"}</h3>{it(<>{"기록의 금액은 정수 · "}<code>{"amount: int"}</code></>, 'models.py')}{it('검사 함수는 정수나 글자를 받아 정수를 돌려준다고 표시', 'validators.py')}</div>{"\n      "}<div className={"t7-role"}><h3>{"자료형 변환"}</h3>{it(<>{"명령줄 "}<code>{"--amount"}</code>{"의 글자를 정수로 · argparse "}<code>{"type=int"}</code></>, 'cli.py')}{it(<>{"대화형 입력·CSV 가져오기의 글자 금액을 정수로 · "}<code>{"validate_amount()"}</code></>, 'validators.py')}</div>{"\n      "}<div className={"t7-role"}><h3>{"실제 검증"}</h3>{it(<>{"정수인지, 0보다 큰지 확인 · "}<code>{"validate_amount()"}</code></>, 'validators.py')}{it('아니면 금액 오류 · Scene 06의 공통 처리가 ‘[오류] 금액은 0보다 큰 정수여야 합니다.’로 알림', 'errors.py · decorators.py')}</div>{"\n    "}</div><span className={"g5-srcnote"}>{"ledger 커밋 d14e812 · 코드가 아닌 역할만 표시"}</span></div></>;
    }
    if (s.mode === 'apply') {
        const V = [['3000', ['예', '바꿀 필요 없음', '예']], ['"15000"', ['아니요 (글자)', '예 · 15000', '예']], ['"1,000"', ['아니요 (글자)', '아니요 (쉼표)', '— 변환에서 멈춤']], ['"0"', ['아니요 (글자)', '예 · 0', '아니요']]];
        return <><div className={"t7-wrap"}><div className={"t7-app"}><div className={"h"}>{"값"}</div><div className={"h"}>{"int 표시에 맞나?"}</div><div className={"h"}>{"정수로 바꿀 수 있나?"}</div><div className={"h"}>{"금액 규칙(0보다 큼)에 맞나?"}</div>{"\n      "}{keyed(V.map(([v, a]: any) => <><div className={"v"}><code>{v}</code></div>{keyed(a.map((x?: any) => reveal ? <><div className={"a"}>{x}</div></> : <><div className={"q"}>{"?"}</div></>))}</>))}{"\n    "}</div><FigureButton className={"reveal"} revealAction focusKey={"reveal"}>{reveal ? '답 숨기기' : '답 보기'}</FigureButton></div></>;
    }
    const c = (v?: any, t?: any) => <><div className={"card"}><span className={"v"}>{v}</span><span className={"t"}>{t}</span></div></>;
    return <><div className={"sumwrap"}><div className={"recap"}>{"\n    "}{c('Type Hint', '기대하는 형을 알려 주는 표시 · 실행 중에 막지 않음')}{"\n    "}{c('자료형 변환', '받은 글자를 필요한 형으로 바꿈')}{"\n    "}{c('값 검증', '실제 값이 규칙에 맞는지 확인')}{"\n    "}{c('형과 규칙', '-5는 int지만 금액 규칙에는 맞지 않음')}{"\n  "}</div><p className={"next-q"}>{"다음 장면 · "}<b>{s.next?.question}</b>{" "}{goBtn(7, 'Scene 08로 ›')}</p></div></>;
}
const nodeLabel = (id?: any) => (MAP8_SRC.nodes as any)[id].label;
const revBtn = (h?: any, label?: any) => <><FigureButton className={"m8-rev"} review={(h)} focusKey={"rev-" + (h.scene) + "-" + (h.step)}>{label}{" 복습 ›"}</FigureButton></>;
export function FigS8({ step: s }: {
    step: TeachingStep;
}) {
    const connected = useContext(LearningServiceConnected);
    const { reveal, file } = useContext(FigureContext);
    const tile = (a?: any, i?: any, opts: any = {}) => {
        const sel = s.sel === i;
        const attr = opts.review ? { review: a.review, focusKey: `wrap-${a.id}` } : { go: a.id, focusKey: `area-${a.id}`, "aria-pressed": sel };
        return <><FigureButton className={"m8-tile hit" + (sel ? ' sel' : '')} {...attr}><span className={"no"}>{a.n}</span><b>{a.name}</b>{opts.mean ? <><span className={"mean"}>{a.say}</span></> : ''}<span className={"sc"}>{"Scene "}{a.n}</span>{sel ? <><span className={"badge acc"}>{"선택"}</span></> : ''}</FigureButton></>;
    };
    if (s.mode === 'areas') {
        const a = (AREAS8 as any)[s.sel ?? -1];
        const side = a ? <><div className={"card on"}><span className={"k"}>{a.n}{" · "}{a.name}</span><span className={"v"}>{a.say}</span></div>{"\n      "}<div className={"card"}><span className={"k"}>{"대표 개념"}</span><span className={"m8-chips"}>{keyed(a.keys.map((k?: any) => <><span>{k}</span></>))}</span></div>{revBtn(a.review, `Scene ${a.n}`)}</>
            : <><div className={"card"}><span className={"k"}>{"일곱 영역"}</span><span className={"v"}>{"영역을 고르면 대표 개념과 뜻을 봅니다"}</span></div><div className={"card off"}><span className={"k"}>{"읽는 법"}</span><span className={"v"}>{"배치 순서는 강의 순서이며, 실행 순서가 아닙니다"}</span></div></>;
        return <><div className={"m8-map"}><div className={"m8-grid"} role={"group"} aria-label={"일곱 영역"}>{keyed(AREAS8.map((x?: any, i?: any) => tile(x, i)))}</div><div className={"m8-side"}>{side}</div></div></>;
    }
    if (s.mode === 'types') {
        return <><div className={"m8-relwrap"}><div className={"m8-head"}>{"개념지도는 실행 순서도가 아닙니다 — 선은 개념 사이의 관계"}</div><div className={"m8-types"}>{keyed(TYPES8.map((t?: any) => {
                const r = (MAP8_SRC.relations as any)[t.rel];
                const r2 = t.rel2 && (MAP8_SRC.relations as any)[t.rel2];
                return <><FigureButton className={"m8-type hit"} {...["R09", "R37", "R28"].includes(t.rel) ? { go: t.rel, focusKey: `type-${t.rel}` } : { "aria-disabled": true }}><b>{t.t}</b><span className={"mean"}>{t.mean}</span><span className={"ex"}>{"예: "}{nodeLabel(r.from)}{" — "}{nodeLabel(r.to)}<small>{"원본 관계 "}{t.rel}{" · "}{r.label}</small></span>{r2 ? <><span className={"ex"}>{"예: "}{nodeLabel(r2.from)}{" — "}{nodeLabel(r2.to)}<small>{"원본 관계 "}{t.rel2}{" · "}{r2.label}</small></span></> : ''}</FigureButton></>;
            }))}</div></div></>;
    }
    if (s.mode === 'rel') {
        const r = (MAP8_SRC.relations as any)[s.rel!], A = (MAP8_SRC.nodes as any)[r.from], B = (MAP8_SRC.nodes as any)[r.to];
        const node = (n?: any, id?: any) => <><div className={"m8-node"}><b>{n.label}</b><span>{n.easy}</span><small>{id}</small></div></>;
        return <><div className={"m8-relwrap"}><div className={"m8-rel"}>{node(A, r.from)}<div className={"m8-link"}><span className={"tp"}>{r.type}</span><span className={"lb"}>{r.label}</span></div>{node(B, r.to)}</div>{"\n      "}<span className={"m8-src"}>{"원본 관계 "}{s.rel}{" · 선은 관계이며 실행 순서가 아님 · 범위: "}{r.scope}</span><div className={"m8-revs"}>{keyed((REL8_REVIEW as any)[s.rel!].map(([h, l]: any) => revBtn(h, l)))}</div></div></>;
    }
    if (s.mode === 'cmp') {
        const c = (MAP8_SRC.comparisons as any)[s.cmp!];
        const side = (id?: any, t?: any) => <><div className={"m8-node"}><b>{nodeLabel(id)}</b><span>{t}</span><small>{id}</small></div></>;
        return <><div className={"m8-cmpwrap"}><div className={"m8-cmp"}>{side(c.left, c.leftText)}{side(c.right, c.rightText)}</div>{"\n      "}<span className={"m8-src"}>{"원본 비교 카드 "}{s.cmp}</span><div className={"m8-revs"}>{keyed((CMP8_REVIEW as any)[s.cmp!].map(([h, l]: any) => revBtn(h, l)))}</div></div></>;
    }
    if (s.mode === 'apply') {
        return <><div className={"m8-app" + (reveal ? ' shown' : '')}><div className={"m8-scn"}>{"용돈 기입장 프로그램에서 기록을 추가하고 저장한 뒤, 다시 검색해서 결과를 보여 주려면 어떤 종류의 일들이 필요할까요?"}</div>{"\n      "}<span className={"m8-note"}>{"필요한 일의 종류 — 순서가 아닙니다"}</span>{"\n      "}<div className={"m8-tasks"}>{keyed(TASKS8.map(([q, a]: any) => <><div className={"m8-task"}><b>{q}</b><span className={"ar"}>{AREAS8.find((x?: any) => x.id === a)!.name}</span></div></>))}</div>{"\n      "}<FigureButton className={"reveal"} revealAction focusKey={"reveal"}>{reveal ? '답 숨기기' : '답 보기'}</FigureButton></div></>;
    }
    // wrap
    return <><div className={"m8-wrapall"}><div className={"m8-wrapgrid"}>{keyed(AREAS8.map((a?: any, i?: any) => tile(a, i, { review: 1, mean: 1 })))}</div>{"\n    "}<span className={"m8-note"}>{connected?serviceMapCaption:"영역을 누르면 그 장면으로 복습 이동 · 자세한 개념지도(45개념·24관계·10비교)는 별도 탐색 시안 · 용어사전 연결은 미연결"}</span></div></>;
}
export function FigF1({ step: s }: {
    step: TeachingStep;
}) {
    const { reveal, file } = useContext(FigureContext);
    const p = (id?: any, inner?: any, cap?: any) => <><FigureButton className={"way hit"} go={(id)} focusKey={"f1-" + (id)} aria-pressed={(s.hl === id)}>{inner}<span className={"cap"}>{cap}</span></FigureButton></>;
    return <><div className={"f1"}><div className={"ask"}>{"부탁: 할 일 목록을 최대 5개 보여 줘"}</div><div className={"f1-row"}>{"\n    "}{p('gui', <><div className={"win"} aria-hidden={"true"}><div className={"win-bar"}><i></i><i></i><i></i>{"todo"}</div><div className={"win-body"}><span className={"fake-btn"}>{"목록 보기"}</span><span className={"fake-sel"}>{"최대 개수"}<b>{"5"}</b>{" ▾"}</span></div></div></>, <>{"GUI "}<span>{"— 화면을 눌러서 부탁"}</span></>)}{"\n    "}{p('cli', <><div className={"term"} aria-hidden={"true"}>{"python -m todo list --limit 5"}</div></>, <>{"CLI "}<span>{"— 글자로 입력해서 부탁"}</span></>)}{"\n  "}</div></div></>;
}
export function FigCmd({ step: s }: {
    step: TeachingStep;
}) {
    const { reveal, file } = useContext(FigureContext);
    const apply = s.mode === 'apply', sum = s.mode === 'summary', who = s.mode === 'who' || sum;
    const part = (p?: any) => {
        const sel = s.sel === p.id || (apply && reveal && p.id === 'cond');
        const three = apply && reveal && p.id === 'cond';
        const tok = three ? '--limit 3' : p.tok, mean = three ? '최대 3개까지만' : p.mean;
        const go = apply ? {} : { go: p.id };
        return <><FigureButton className={"part hit" + (s.opt && p.id === 'cond' ? ' opt' : '')} {...go} focusKey={"part-" + (p.id)} aria-pressed={(sel)} aria-disabled={(apply ? true : undefined)}>{"\n      "}<code>{tok}</code><span className={"lbl"}>{p.lbl}</span><span className={"mean"}>{mean}</span><span className={"term-chip"}>{"옵션"}</span></FigureButton></>;
    };
    const grp = (g?: any, b?: any, sub?: any) => <><div className={"grp"} data-grp={(g)}><div className={"glabel"}><b>{b}</b><span>{sub}</span></div><div className={"parts"}>{keyed(PARTS.filter((p?: any) => p.grp === g).map(part))}</div></div></>;
    let after: ReactNode = '';
    if (apply)
        after = reveal ? <><span className={"changed"}>{"바뀐 곳: 조건 하나"}</span><span>{"나머지 세 부분은 그대로"}</span></> : <><FigureButton className={"reveal"} revealAction focusKey={"reveal"}>{"답 보기"}</FigureButton></>;
    if (sum)
        after = <><span className={"recap-note"}>{"todo 프로그램 쪽은 argparse가 규칙대로 알아듣도록 돕습니다"}</span></>;
    return <><div className={"cmdfig" + (who ? ' who' : '')}><div className={"cmd"} role={"group"} aria-label={"명령 python -m todo list --limit 5의 네 부분"}>{"\n    "}{grp('py', 'Python이 읽는 부분', '어떤 프로그램을 실행할까?')}{"\n    "}<div className={"handoff"} aria-hidden={"true"}><span className={"arrow-h"}></span><span className={"arrow-v"}></span><span className={"txt"}>{"todo를 시작하고, 나머지 글자를 넘겨줌"}</span></div>{"\n    "}{grp('app', 'todo 프로그램이 받는 부분', '무엇을, 어떻게 할까?')}{"\n  "}</div><div className={"after"}>{after}</div>{sum ? <><p className={"next-q"}>{"다음 장면 · "}<b>{s.next?.question}</b>{" "}<FigureButton className={"go"} goScene={1} focusKey={"go2"}>{"Scene 02로 ›"}</FigureButton></p></> : ''}</div></>;
}
export function FigF4({ step: s }: {
    step: TeachingStep;
}) {
    const { reveal, file } = useContext(FigureContext);
    return <><div className={"f4 " + (s.hl)}>{"\n    "}<FigureButton className={"box b-in hit"} go={"argparse"} focusKey={"f4-in"}><span className={"k"}>{"① 받은 글자"}</span><code className={"v"}>{"list --limit 5"}</code></FigureButton>{"\n    "}<span className={"arrow-h"} aria-hidden={"true"}></span><span className={"arrow-v"} aria-hidden={"true"}></span>{"\n    "}<FigureButton className={"box b-ap hit"} go={"argparse"} focusKey={"f4-ap"}><span className={"k"}>{"② 미리 정한 규칙"}</span><span className={"v"}>{"argparse"}</span>{"\n      "}<span className={"rule"}>{"할 일 자리에는 정해 둔 이름(list 등)"}<br /><code>{"--limit"}</code>{" 뒤에는 숫자 하나"}</span></FigureButton>{"\n    "}<span className={"arrow-h"} aria-hidden={"true"}></span><span className={"arrow-v"} aria-hidden={"true"}></span>{"\n    "}<FigureButton className={"box b-out hit"} go={"argparse"} focusKey={"f4-out"}><span className={"k"}>{"③ 알아들은 내용"}</span><span className={"res"}>{"할 일 = 목록 보기"}<br />{"최대 개수 = 5"}</span></FigureButton>{"\n    "}<span className={"wall"} aria-hidden={"true"}><span>{"여기까지 argparse"}</span></span>{"\n    "}<FigureButton className={"box b-next hit"} go={"boundary"} focusKey={"f4-next"}><span className={"k"}>{"다음 장면 (Scene 02)"}</span><span className={"v"}>{"실제로 목록을 찾아 보여 주는 일 → 프로그램의 다른 부분"}</span></FigureButton>{"\n  "}</div></>;
}
export function FigCheck({ step: s }: {
    step: TeachingStep;
}) {
    const { reveal, file } = useContext(FigureContext);
    return <><div className={"checks" + (reveal ? ' shown' : '')}>{keyed((s.questions ?? []).map((q?: any, i?: any) => <><div className={"qa"}><span className={"kind"}>{q.kind}</span><span className={"q"}>{q.q}</span><span className={"a"}>{(s.reveal?.answers as any)[i]}</span></div></>))}{"\n    "}<FigureButton className={"reveal"} revealAction focusKey={"reveal"}>{reveal ? '답 숨기기' : '답 보기'}</FigureButton></div></>;
}
export function FigS2({ step: s }: {
    step: TeachingStep;
}) {
    const { reveal, file } = useContext(FigureContext);
    const m = s.mode ?? '', real = m === 'ledger', fileish = ['files', 'import', 'main', 'ledger', 'summary'].includes(m);
    const sit = SITS.find((x?: any) => x.id === s.sit);
    const tile = (r?: any) => {
        let cls = 'tile', go = '', disabled = false;
        let badge: ReactNode = '';
        if (m === 'needs') {
            cls += ' bubble';
            go = r.id;
        }
        else if (m === 'roles') {
            go = r.id;
            if (s.sel === r.id)
                cls += ' sel';
        }
        else if (m === 'change') {
            go = r.id;
            if (sit && sit.target === r.id) {
                cls += ' sel';
                badge = <><span className={"badge acc"}>{"먼저 볼 곳"}</span></>;
            }
        }
        else if (m === 'files') {
            go = 'module';
            if (s.hl === 'module' && file === r.id) {
                cls += ' sel';
                badge = <><span className={"badge acc"}>{"모듈"}</span></>;
            }
        }
        else if (m === 'import') {
            disabled = true;
            if (r.id === 'cli' || r.id === 'service')
                cls += ' soft';
        }
        else if (m === 'main') {
            disabled = true;
            if (r.id === 'cli')
                cls += ' soft';
        }
        else
            disabled = true;
        let inner;
        if (m === 'needs')
            inner = <><span className={"need"}>{r.need}{r.small ? <><small>{"("}{r.small}{")"}</small></> : ''}</span></>;
        else if (fileish)
            inner = <><span className={"tx"}><code className={"fn"}>{r.file}</code><span className={"en"}>{r.en}</span>{m === 'summary' ? <><span className={"kosub"}>{r.ko}</span></> : ''}</span></>;
        else
            inner = <><span className={"tx"}><span className={"ko"}>{r.ko}</span><span className={"en"}>{r.en}</span></span></>;
        const attrs = disabled ? { "aria-disabled": true } : { go, file: m === 'files' ? r.id : undefined };
        const pressed = cls.includes(' sel');
        return <><FigureButton className={(cls) + " hit"} {...attrs} focusKey={"tile-" + (r.id)} aria-pressed={(pressed)}><span className={"ic"}>{I((ICON as any)[r.id])}</span>{inner}{badge ? <><span className={"bd"}>{badge}</span></> : ''}</FigureButton></>;
    };
    // 프레임 머리
    let head;
    if (m === 'needs' || m === 'roles' || m === 'change')
        head = <><span className={"fname"}>{"todo 프로그램"}</span></>;
    else if (real)
        head = <><span className={"fname"}><code>{"ledger/"}</code></span><span className={"badge soft"}>{"패키지"}</span></>;
    else
        head = <><FigureButton className={"fname hit"} go={"package"} focusKey={"pkg"} aria-disabled={(m !== 'files' ? true : undefined)} tabIndex={(m !== 'files' ? -1 : undefined)}><code>{"todo/"}</code></FigureButton>{(s.hl === 'package' || m !== 'files') ? <><span className={"badge" + (s.hl === 'package' ? ' acc' : ' soft')}>{"패키지"}</span></> : ''}</>;
    const frameCls = 'frame' + (m === 'needs' ? ' dashed' : '') + (real ? ' real' : '') + (s.hl === 'package' ? ' hl' : '');
    const mainOn = ['main', 'ledger', 'summary'].includes(m);
    const main = m === 'needs' ? <><div className={"mainrow capt"}><span>{"필요한 일들 — 순서표가 아닙니다"}</span></div></> : <><div className={"mainrow" + (mainOn ? ' on' : '') + (m === 'main' ? ' sel' : '')}><code>{"__main__.py"}</code><span>{real ? <>{"실행: "}<code>{"python -m ledger list --limit 5"}</code></> : '패키지를 실행할 때의 시작 파일'}</span></div></>;
    const req = m === 'needs' ? <><div className={"req"}><code>{"list --limit 5"}</code><span>{"할 일 목록을 최대 5개 보여 줘"}</span></div></> : '';
    const link = m === 'import' ? <><div className={"link"} aria-hidden={"true"}><span>{"import"}</span></div></> : '';
    const frame = <><div className={(frameCls)}><div className={"fhead"}>{head}</div><div className={"grid"} role={"group"} aria-label={"네 가지 역할"}>{keyed(ROLES.map(tile))}{req}{link}</div>{main}</div></>;
    return <><div className={"s2"}>{frame}<div className={"side"}>{side(s)}</div></div></>;
}
function side(s?: any) {
    const m = s.mode ?? '', card = (k?: any, v?: any, cls: any = '') => <><div className={"card " + (cls)}><span className={"k"}>{k}</span><span className={"v"}>{v}</span></div></>;
    if (m === 'needs')
        return <>{card('Scene 01의 부탁', <><code>{"python -m todo list --limit 5"}</code></>)}{card('질문', '이 부탁 하나를 들어주려면 프로그램은 무엇을 해야 할까요?')}</>;
    if (m === 'roles') {
        const r = ROLES.find((x?: any) => x.id === s.sel);
        return <>{(r ? card(`todo 예시 · ${r.en}`, r.ex, 'on') : card('이 그림은', '순서가 아니라 ‘누가 무엇을 맡는가’를 나타냅니다'))}{card('네 역할', ROLES.map((x?: any) => x.en).join(' · '), 'off')}</>;
    }
    if (m === 'change')
        return <>{<><h2>{"바꾸고 싶은 것이 있을 때, "}<b>{"먼저"}</b>{" 볼 곳은?"}</h2></>}{keyed(SITS.map((x?: any) => {
                const r = ROLES.find((y?: any) => y.id === x.target)!, on = s.sit === x.id;
                return <><FigureButton className={"card hit"} go={(x.id)} focusKey={"sit-" + (x.id)} aria-pressed={(on)}><span className={"v"}>{x.text}</span>{on ? <><span className={"ans"}>{"먼저 볼 곳: "}{r.ko}{" · "}{r.en}</span></> : ''}</FigureButton></>;
            }))}</>;
    if (m === 'files') {
        return <>{<>{card('가상 todo를 역할별로 나눈 예', '파일 이름은 만드는 사람이 정합니다', s.hl ? 'off' : 'on')}{card('모듈', 'Python 코드를 담은 파일 하나', s.hl === 'module' ? 'on' : s.hl ? '' : 'off')}</>}{card('패키지', '관련 있는 모듈을 하나의 이름으로 묶은 것', s.hl === 'package' ? 'on' : 'off')}</>;
    }
    if (m === 'import')
        return <>{<>{card('import', '다른 모듈의 기능을 가져다 씀', 'on')}{card('이 선의 뜻', <><code>{"cli.py"}</code>{"가 "}<code>{"services.py"}</code>{"의 기능을 가져다 씀"}</>)}</>}{card('주의', '가져다 쓰는 관계 · 실행 순서가 아닙니다', 'off')}</>;
    if (m === 'main')
        return <><div className={"runflow"} aria-label={"실행할 때 일어나는 일"}>{keyed([['① 명령', <><code>{"python -m todo list --limit 5"}</code></>], ['② Python', 'todo 패키지를 찾음'], ['③ 시작 파일', <><code>{"todo/__main__.py"}</code></>], ['④ 이어서', <>{"CLI 부분이 "}<code>{"list --limit 5"}</code>{"를 받음"}</>]].map((x?: any, i?: any) => <>{i ? <><span className={"arrow-v"} aria-hidden={"true"}></span></> : ''}{card((x as any)[0], (x as any)[1], i === 2 ? 'on' : '')}</>))}</div></>;
    if (m === 'ledger')
        return <>{<>{card('같은 자리, 같은 네 역할', <><code>{"models.py"}</code>{" · "}<code>{"repository.py"}</code>{" · "}<code>{"services.py"}</code>{" · "}<code>{"cli.py"}</code></>, 'on')}{<><div className={"card"}><span className={"k"}>{"이 프로젝트가 따로 둔 파일"}</span><span className={"extras"}><code>{"__init__.py"}</code><code>{"errors.py"}</code><code>{"validators.py"}</code><code>{"decorators.py"}</code></span></div></>}</>}{card('참고', '실제 사례 · 용돈 기입장 ledger, 커밋 d14e812', 'off')}</>;
    if (m === 'summary')
        return <>{<>{<>{card('역할', '기록의 모양 · 읽고 저장하기 · 요청 처리 · 명령과 결과')}{card('모듈 · 패키지', <>{"역할별 파일 = 모듈, 묶음 "}<code>{"todo/"}</code>{" = 패키지"}</>)}</>}{card('함께 쓰기 · 시작', <>{"import로 가져다 쓰고, "}<code>{"__main__.py"}</code>{"에서 시작"}</>)}</>}{<><p className={"next-q"}>{"다음 장면 · "}<b>{s.next?.question}</b>{" "}{goBtn(2, 'Scene 03으로 ›')}</p></>}</>;
    return '';
}
