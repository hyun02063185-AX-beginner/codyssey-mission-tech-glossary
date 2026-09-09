import { describe, expect, it } from 'vitest';

type Pending={query:string;rawQuery:string;source:string;requestedAt:number;requestId:string};
const payload=(rawQuery:string,requestId:string):Pending=>({query:rawQuery.trim(),rawQuery,source:'context-menu',requestedAt:1,requestId});
const apply=(last:string,pending:Pending)=>pending.requestId===last?{last,tab:'requirements',input:'DOM'}:{last:pending.requestId,tab:'search',input:pending.query};

describe('extension right-click handoff state',()=>{
  it('stores selection text without page URL gating',()=>{const pending=payload('HTML','one');expect(pending.query).toBe('HTML');expect(pending.rawQuery).toBe('HTML');});
  it('hydrates a closed panel into search with an exact query',()=>expect(apply('',payload('HTML','one'))).toMatchObject({tab:'search',input:'HTML'}));
  it('updates an open panel and accepts the same query with a new request id',()=>{expect(apply('dom',payload('JavaScript','next'))).toMatchObject({tab:'search',input:'JavaScript'});expect(apply('one',payload('HTML','two'))).toMatchObject({tab:'search',input:'HTML'});});
  it('keeps aliases as ordinary search input',()=>expect(apply('',payload('로컬스토리지','alias')).input).toBe('로컬스토리지'));
});
