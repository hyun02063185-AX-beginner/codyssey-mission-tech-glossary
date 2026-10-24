// Run the unchanged HTML QA in a disposable worktree-shaped copy, preserving approved captures.
import {cp,mkdir,readFile,writeFile,readdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const root=fileURLToPath(new URL('../',import.meta.url)),dir=resolve(root,'node_modules/.cache/b21-html-qa');
await mkdir(dir,{recursive:true});
await cp(resolve(root,'drafts/b2-1-story-map'),resolve(dir,'drafts/b2-1-story-map'),{recursive:true});
async function normalizeCopy(folder){
 for(const entry of await readdir(folder,{withFileTypes:true})){
  const path=resolve(folder,entry.name);
  if(entry.isDirectory())await normalizeCopy(path);
  else if(/\.(md|html|json|svg|mjs)$/.test(entry.name))await writeFile(path,(await readFile(path,'utf8')).replace(/\r\n/g,'\n'));
 }
}
await normalizeCopy(resolve(dir,'drafts/b2-1-story-map'));
// Existing harness uses Git history at repository root. A .git pointer provides read-only access.
const gitDir=spawnSync('git',['rev-parse','--absolute-git-dir'],{cwd:root,encoding:'utf8'}).stdout.trim();
await writeFile(resolve(dir,'.git'),`gitdir: ${gitDir}\n`);
const script=resolve(dir,'drafts/b2-1-story-map/v3/teaching-preview/qa/check-preview.mjs');
// Preserve the script bytes except its known Windows file URL pathname issue in screenshot output.
const source=await readFile(script,'utf8');await writeFile(script,source.replace('new URL(`${name}-${width}.png`, here).pathname','fileURLToPath(new URL(`${name}-${width}.png`, here))'));
const result=spawnSync(process.execPath,[script],{cwd:dir,env:{...process.env,LEDGER_REPO:resolve(root,'../m03-pocket-money-ledger')},encoding:'utf8'});
console.log(result.stdout);console.error(result.stderr);process.exitCode=result.status??1;
