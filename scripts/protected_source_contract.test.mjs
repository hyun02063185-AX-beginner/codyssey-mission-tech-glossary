import {afterAll,describe,expect,it} from 'vitest';
import {execFileSync} from 'node:child_process';
import {mkdtempSync,mkdirSync,readFileSync,rmSync,writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve,sep} from 'node:path';
import {auditProtectedSources} from './protected_source_contract.mjs';
const root=mkdtempSync(join(tmpdir(),'b31-contract-'));
const git=(...args)=>execFileSync('git',args,{cwd:root,stdio:'pipe'});
git('init');mkdirSync(join(root,'protected'));writeFileSync(join(root,'protected','lesson.txt'),'approved\n');writeFileSync(join(root,'.gitignore'),'*.ignored\n');
writeFileSync(join(root,'protected','image.bin'),Buffer.from([0,13,10,255]));
git('add','.');git('-c','user.name=QA','-c','user.email=qa@example.invalid','commit','-m','fixture');
const revision=git('rev-parse','HEAD').toString().trim();
afterAll(()=>{if(!resolve(root).startsWith(resolve(tmpdir())+sep)||!root.split(sep).pop().startsWith('b31-contract-'))throw Error('Unexpected fixture cleanup target');rmSync(root,{recursive:true,force:true});});
describe('protected tree detects workspace changes without moving its golden',()=>{
 it('allows only text checkout line-ending normalization',()=>{
  writeFileSync(join(root,'protected','lesson.txt'),'approved\r\n');const r=auditProtectedSources(root,revision,['protected']);expect([r.added,r.removed,r.changed]).toEqual([[],[],[]]);
 });
 it('detects added ignored/untracked files and modifications to existing files',()=>{
  writeFileSync(join(root,'protected','new.ignored'),'new');writeFileSync(join(root,'protected','lesson.txt'),'modified\n');
  const r=auditProtectedSources(root,revision,['protected']);expect(r.added).toEqual(['protected/new.ignored']);expect(r.changed).toEqual(['protected/lesson.txt']);
  rmSync(join(root,'protected','new.ignored'));writeFileSync(join(root,'protected','lesson.txt'),'approved\n');
 });
 it('detects deleted baseline files',()=>{
  const file=join(root,'protected','lesson.txt'),original=readFileSync(file);rmSync(file);
  expect(auditProtectedSources(root,revision,['protected']).removed).toEqual(['protected/lesson.txt']);writeFileSync(file,original);
 });
 it('does not normalize binary image bytes',()=>{
  const file=join(root,'protected','image.bin');writeFileSync(file,Buffer.from([0,10,255]));expect(auditProtectedSources(root,revision,['protected']).changed).toEqual(['protected/image.bin']);writeFileSync(file,Buffer.from([0,13,10,255]));
 });
 it('exempts Python bytecode but still catches source added inside cache folders',()=>{
  const cache=join(root,'protected','__pycache__');mkdirSync(cache);writeFileSync(join(cache,'check.cpython-314.pyc'),Buffer.from([0,255]));
  expect(auditProtectedSources(root,revision,['protected']).added).toEqual([]);
  writeFileSync(join(cache,'hidden.py'),'source');expect(auditProtectedSources(root,revision,['protected']).added).toEqual(['protected/__pycache__/hidden.py']);
 });
});
