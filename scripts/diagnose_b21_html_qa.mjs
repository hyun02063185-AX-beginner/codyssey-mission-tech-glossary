// Diagnostic copies collect every failed assertion. Approved QA and its thresholds stay unchanged.
import { cp, mkdir, readFile, writeFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync, spawnSync } from 'node:child_process';

const root = fileURLToPath(new URL('../', import.meta.url));
const gitDir = execFileSync('git', ['rev-parse', '--absolute-git-dir'], { cwd: root, encoding: 'utf8' }).trim();
const proposal = '@media (max-width:360px){.mf>.pane{min-width:0}}\n';
const previewPath = 'drafts/b2-1-story-map/v3/teaching-preview/index.html';
const qaPath = 'drafts/b2-1-story-map/v3/teaching-preview/qa/check-preview.mjs';
const reportPath = 'drafts/b2-1-story-map/v3/teaching-preview/qa/results.json';
async function normalizeCopy(folder) {
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    const path = resolve(folder, entry.name);
    if (entry.isDirectory()) await normalizeCopy(path);
    else if (/\.(md|html|json|svg|mjs)$/.test(entry.name)) await writeFile(path, (await readFile(path, 'utf8')).replace(/\r\n/g, '\n'));
  }
}
function replaceOnce(text, from, to) {
  if (text.split(from).length !== 2) throw Error('QA source changed; diagnostic adapter requires review');
  return text.replace(from, to);
}
for (const mode of ['original', 'proposal']) {
  const dir = resolve(root, `node_modules/.cache/b21-u3-c-all-qa-${mode}`);
  await mkdir(dir, { recursive: true });
  await cp(resolve(root, 'drafts/b2-1-story-map'), resolve(dir, 'drafts/b2-1-story-map'), { recursive: true });
  await normalizeCopy(resolve(dir, 'drafts/b2-1-story-map'));
  await writeFile(resolve(dir, '.git'), `gitdir: ${gitDir}\n`);
  if (mode === 'proposal') {
    const html = await readFile(resolve(dir, previewPath), 'utf8');
    await writeFile(resolve(dir, previewPath), replaceOnce(html, '</style>', proposal + '</style>'));
  }
  let script = await readFile(resolve(dir, qaPath), 'utf8');
  script = replaceOnce(script, 'new URL(`${name}-${width}.png`, here).pathname', 'fileURLToPath(new URL(`${name}-${width}.png`, here))');
  script = replaceOnce(script,
    "const check = (ok, label) => { assertions++; if (!ok) throw Error(label); };",
    "const diagnosticFailures = [], diagnosticRoles = [];\nconst check = (ok, label) => { assertions++; if (!ok) diagnosticFailures.push(label); };");
  script = replaceOnce(script,
    "if (['2-2', '2-10', '2-15'].includes(key)) boxes[key] = await tileBoxes();",
    `if (['2-2', '2-10', '2-15'].includes(key)) {
      boxes[key] = await tileBoxes();
      diagnosticRoles.push({width,key,boxes:boxes[key],details:await page.evaluate(()=>({scrollY,tiles:[...document.querySelectorAll('#stage .tile')].map(e=>({text:e.innerText,box:e.getBoundingClientRect().toJSON(),rows:getComputedStyle(e.parentElement).gridTemplateRows,minHeight:getComputedStyle(e).minHeight,koFont:getComputedStyle(e.querySelector('.ko')??e).font}))}))});
    }`);
  script = replaceOnce(script, 'const report = { date:', `const report = { diagnosticMode: '${mode}', diagnosticFailures, diagnosticRoles, status: diagnosticFailures.length || results.some(r=>r.status==='FAIL') ? 'FAIL' : 'PASS', date:`);
  script = replaceOnce(script, 'assertions, results, regressionDiffs:', "assertions, results: results.map(r=>r.width && diagnosticFailures.some(f=>f.startsWith(String(r.width)))?{...r,status:'FAIL'}:r), regressionDiffs:");
  await writeFile(resolve(dir, qaPath), script);
  const run = spawnSync(process.execPath, [resolve(dir, qaPath)], { cwd: dir, env: { ...process.env, B21_BROWSER_CHANNEL: process.env.B21_BROWSER_CHANNEL || 'chrome', LEDGER_REPO: resolve(root, '../m03-pocket-money-ledger') }, encoding: 'utf8' });
  await writeFile(resolve(dir, 'execution.log'), run.stdout + run.stderr);
  const result = JSON.parse(await readFile(resolve(dir, reportPath), 'utf8'));
  if (result.diagnosticMode !== mode) throw Error('Child QA did not produce a fresh diagnostic report');
  if (run.status !== 0 || result.status !== 'PASS') process.exitCode = 1;
  console.log(JSON.stringify({ mode, status: result.status, assertions: result.assertions, failures: result.diagnosticFailures, results: result.results, output: dir }));
}
