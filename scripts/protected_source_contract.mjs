import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {isUtf8} from 'node:buffer';
import {lstatSync,readdirSync,readFileSync,readlinkSync} from 'node:fs';
import {join} from 'node:path';

const digest=bytes=>createHash('sha256').update(isUtf8(bytes)&&!bytes.includes(0)?Buffer.from(bytes.toString('utf8').replace(/\r\n/g,'\n')):bytes).digest('hex');
/** Compare both inventories as well as content. Includes untracked/ignored files in
 * the selected working directories; binary assets are hashed without conversion. */
export function auditProtectedSources(repo,baseline,paths){
 const files=execFileSync('git',['ls-tree','-r','-z','--name-only',baseline,'--',...paths],{cwd:repo}).toString('utf8').split('\0').filter(Boolean).sort();
 if(!files.length)throw Error(`Empty protected baseline: ${baseline}`);
 const expected=new Map(files.map(file=>[file,digest(execFileSync('git',['show',`${baseline}:${file}`],{cwd:repo}))]));
 const actual=new Map(),runtimeCaches=[];
 function walk(file){
  const absolute=join(repo,file);let stat;
  try{stat=lstatSync(absolute);}catch(error){if(error.code==='ENOENT')return;throw error;}
  if(stat.isSymbolicLink()){actual.set(file,'symlink:'+readlinkSync(absolute));return;}
  if(stat.isDirectory()){for(const entry of readdirSync(absolute).sort())walk(file+'/'+entry);}
  // Official Python validation imports the legacy checker and emits bytecode.
  // Exempt only compiled cache files, never ignored source files in that folder.
  else if(/(?:^|\/)__pycache__\/[^/]+\.py[co]$/.test(file))runtimeCaches.push(file);
  else if(stat.isFile())actual.set(file,digest(readFileSync(absolute)));
  else actual.set(file,'unsupported-file-type');
 }
 paths.forEach(walk);
 return {baseline,paths,files,runtimeCaches,added:[...actual.keys()].filter(file=>!expected.has(file)).sort(),removed:files.filter(file=>!actual.has(file)),changed:files.filter(file=>actual.has(file)&&actual.get(file)!==expected.get(file)),normalization:'UTF-8 text CRLF → LF; binary bytes unchanged'};
}
