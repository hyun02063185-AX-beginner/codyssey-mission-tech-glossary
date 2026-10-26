"""Build only B6-1's fixed detailed ERD, from its pinned SQLite/Mermaid originals."""
import hashlib
import html
import json
from pathlib import Path
import re
import sqlite3

HERE = Path(__file__).resolve().parent
SOURCE = HERE / 'erd-detail-source'
OUT = HERE.parent / 'assets' / 'detail'
OUT.mkdir(exist_ok=True)
metadata = json.loads((SOURCE / 'source.json').read_text())
for file in metadata['files']:
    content = (SOURCE / Path(file['path']).name).read_bytes()
    assert hashlib.sha1(b'blob ' + str(len(content)).encode() + b'\0' + content).hexdigest() == file['blob'], file['path']

db = sqlite3.connect(':memory:')
db.executescript((SOURCE / '01_schema.sql').read_text())
names = ['teacher', 'subject', 'course', 'student', 'enrollment', 'score']
assert set(names) == {row[0] for row in db.execute("SELECT name FROM sqlite_master WHERE type='table'")}
columns = {name: [(r[1], r[2], bool(r[5])) for r in db.execute(f'PRAGMA table_info({name})')] for name in names}
references = {name: {r[3]: (r[2], r[4]) for r in db.execute(f'PRAGMA foreign_key_list({name})')} for name in names}
mermaid = (SOURCE / 'erd.mmd').read_text()
mermaid_tables = re.findall(r'^    (\w+)\s*\{([^}]+)\}', mermaid, re.M)
assert {name.lower() for name, _ in mermaid_tables} == set(names)
for name, body in mermaid_tables:
    rows = re.findall(r'^\s*(INTEGER|TEXT|DATE)\s+(\w+)(?:\s+(PK|FK))?', body, re.M)
    assert [(column, kind, flag == 'PK') for kind, column, flag in rows] == columns[name.lower()], name
    assert {column for _, column, flag in rows if flag == 'FK'} == set(references[name.lower()]), name

relations = re.findall(r'(\w+)\s+\|\|--o\{\s*(\w+)\s*:\s*"([^"]+)"', mermaid)
assert {(parent.lower(), child.lower()) for parent, child, _ in relations} == {
    (parent, child) for child, refs in references.items() for parent, _ in refs.values()
}
assert sum(map(len, columns.values())) == 25 and len(relations) == 5
assert sum(pk for rows in columns.values() for _, _, pk in rows) == 6

# This is a fixed mission asset layout, not a runtime diagram engine.
pc = {'teacher': (24, 32), 'subject': (24, 560), 'course': (448, 220),
      'student': (872, 32), 'enrollment': (872, 500), 'score': (448, 580)}
mobile = {'teacher': (40, 24), 'subject': (40, 246), 'course': (40, 432),
          'student': (40, 726), 'enrollment': (40, 1092), 'score': (40, 1350)}
labels = {'teacher': '강사', 'subject': '과목', 'course': '수업', 'student': '학생', 'enrollment': '수강', 'score': '시험 점수'}
style = '''.b61d-bg{fill:var(--presentation-bg,#111827)}
.b61d-box{fill:var(--presentation-panel,#1d2736);stroke:var(--presentation-line,#64748b);stroke-width:2}
.b61d-head{fill:var(--presentation-chip,#293549)}
.b61d-line{fill:none;stroke:var(--presentation-accent,#ffad86);stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}
.b61d-ring{fill:var(--presentation-bg,#111827);stroke:var(--presentation-accent,#ffad86);stroke-width:2.5}
.b61d-ink{fill:var(--presentation-ink,#eef2f7)}
.b61d-muted{fill:var(--presentation-muted,#bdc8d7)}
.b61d-pk{fill:var(--presentation-python-soft,#203957);stroke:var(--presentation-python,#9cc8ff)}
.b61d-pkt{fill:var(--presentation-python,#9cc8ff);font-weight:700}
.b61d-fk{fill:var(--presentation-app-soft,#183f32);stroke:var(--presentation-app,#86dfb0)}
.b61d-fkt{fill:var(--presentation-app,#86dfb0);font-weight:700}
.b61d-rule{stroke:var(--presentation-line,#64748b);stroke-width:1}'''

def text(x, y, value, size=18, cls='ink', **attrs):
    extra = ' '.join(f'{k.replace("_", "-")}="{html.escape(str(v))}"' for k, v in attrs.items())
    return f'<text x="{x}" y="{y}" font-size="{size}" class="b61d-{cls}" {extra}>{html.escape(value)}</text>'

def endpoint(x, y, dx, dy, many):
    def line(a, b):
        return f'<path d="M{a[0]} {a[1]} L{b[0]} {b[1]}" class="b61d-line"/>'
    result = ''
    if many:
        result += f'<circle cx="{x+24*dx}" cy="{y+24*dy}" r="4" class="b61d-ring"/>'
        for side in [-8, 0, 8]:
            result += line((x+13*dx, y+13*dy), (x+side*dy, y-side*dx))
    else:
        for offset in [8, 14]:
            result += line((x+offset*dx-8*dy, y+offset*dy+8*dx), (x+offset*dx+8*dy, y+offset*dy-8*dx))
    return result

def build(compact):
    layout, width, height, card_width = (mobile, 360, 1586, 280) if compact else (pc, 1240, 840, 344)
    description = '; '.join(name + ': ' + ', '.join(column + ' ' + kind + (' PK' if pk else ' FK → ' + '.'.join(references[name][column]) if column in references[name] else '') for column, kind, pk in columns[name]) for name in names)
    description += '. 관계: ' + '; '.join(f'{p.lower()}.id 1 : 0..N {c.lower()}' for p, c, _ in relations)
    parts = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" role="img" aria-labelledby="b61d-title b61d-description" font-family="Pretendard VF, sans-serif">',
             '<title id="b61d-title">B6-1 상세 ERD · 6개 테이블과 전체 컬럼</title>',
             f'<desc id="b61d-description">{html.escape(description)}</desc>', '<style>' + style + '</style>',
             f'<rect width="{width}" height="{height}" class="b61d-bg"/>']
    # parent/child endpoint, outward directions, route and label position.
    routes = [
        ((368,120,1,0),(448,290,-1,0),'M368 120 H408 V290 H448',(403,184)),
        ((368,630,1,0),(448,426,-1,0),'M368 630 H408 V426 H448',(403,536)),
        ((792,344,1,0),(872,606,-1,0),'M792 344 H832 V606 H872',(832,484)),
        ((1044,352,0,1),(1044,500,0,-1),'M1044 352 V500',(1080,432)),
        ((872,656,-1,0),(792,744,1,0),'M872 656 H832 V744 H792',(832,710)),
    ]
    if compact:
        routes = [
            ((320,112,1,0),(320,500,1,0),'M320 112 H348 V500 H320',(337,306)),
            ((40,316,-1,0),(40,584,-1,0),'M40 316 H12 V584 H40',(30,450)),
            ((320,628,1,0),(320,1160,1,0),'M320 628 H348 V1160 H320',(337,894)),
            ((40,960,-1,0),(40,1240,-1,0),'M40 960 H12 V1240 H40',(30,1100)),
            ((320,1268,1,0),(320,1456,1,0),'M320 1268 H348 V1456 H320',(337,1362)),
        ]
    for (parent, child, label), (start, end, route, (x,y)) in zip(relations, routes):
        parent, child = parent.lower(), child.lower()
        fk = next(column for column, target in references[child].items() if target[0] == parent)
        parts += [f'<g data-parent="{parent}" data-child="{child}" data-child-key="{fk}" data-parent-key="id">',
                  f'<path d="{route}" class="b61d-line"/>', endpoint(*start, False), endpoint(*end, True)]
        if compact:
            parts.append(text(x,y,label,16,'muted',text_anchor='middle',transform=f'rotate(-90 {x} {y})'))
        else:
            parts.append(f'<rect x="{x-36}" y="{y-18}" width="72" height="26" class="b61d-bg"/>')
            parts.append(text(x,y,label,16,'muted',text_anchor='middle'))
        parts.append('</g>')
    for name in names:
        x, y = layout[name]
        h = 68 + 36 * len(columns[name])
        parts += [f'<g data-table="{name}">', f'<rect x="{x}" y="{y}" width="{card_width}" height="{h}" rx="12" class="b61d-box"/>',
                  f'<path d="M{x+12} {y+1} H{x+card_width-12} Q{x+card_width-1} {y+1} {x+card_width-1} {y+12} V{y+51} H{x+1} V{y+12} Q{x+1} {y+1} {x+12} {y+1}" class="b61d-head"/>',
                  text(x+14,y+33,name,22,font_weight=750), text(x+card_width-14,y+32,labels[name],16,'muted',text_anchor='end')]
        for i, (column, kind, pk) in enumerate(columns[name]):
            baseline = y+80+i*36
            fk = references[name].get(column)
            key = 'PK' if pk else 'FK' if fk else ''
            parts.append(f'<g data-column="{column}" data-type="{kind}" data-key="{key}" data-references="{".".join(fk) if fk else ""}">')
            if key:
                cls = key.lower()
                parts += [f'<rect x="{x+12}" y="{baseline-19}" width="30" height="24" rx="4" class="b61d-{cls}"/>',text(x+27,baseline-1,key,16,cls+'t',text_anchor='middle')]
            parts += [text(x+52,baseline,column,18), text(x+card_width-12,baseline,kind,18,'muted',text_anchor='end'), '</g>']
            if i<len(columns[name])-1:
                parts.append(f'<path d="M{x+12} {baseline+12} H{x+card_width-12}" class="b61d-rule"/>')
        parts.append('</g>')
    parts.append('</svg>')
    name = f'erd-detail-{"mobile" if compact else "desktop"}.svg'
    (OUT / name).write_text(''.join(parts)+'\n')

build(False)
build(True)
print('PASS: pinned source blobs; SQLite + Mermaid agree: 6 tables, 25 columns, 6 PKs, 5 FKs/relationships. Built PC/mobile detailed SVGs.')
