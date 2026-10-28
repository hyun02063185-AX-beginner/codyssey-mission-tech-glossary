import assert from 'node:assert/strict';

// Explicit approvals from the 2026-10-28 audit and PR #38 (33) + #39 (2).
export const approvedStatusIds = [
  'asynchronous-programming','concurrency','const','cookie','curl',
  'data-integrity','database-index','database-session','dependency-injection',
  'event-handler','event-loop','function','http','http-get','http-post',
  'http-request-response','http-status-code','https','json-request-response',
  'let','login-session','module','process','queue','react-props',
  'request-response-cycle','rest-api','schema','stack','tcp','user-event','var','variable',
  'thread','json-web-token',
];
type Term = {id:string;content_status:string;[key:string]:unknown};
type Master = {terms:Term[];[key:string]:unknown};
export function assertApprovedCanonicalStatusSync(baseline:Master,current:Master) {
  const approved=new Set(approvedStatusIds);
  assert.equal(approvedStatusIds.length,35);
  assert.equal(approved.size,35);
  assert.equal(baseline.terms.length,523);
  assert.equal(current.terms.length,523);
  assert.equal(new Set(baseline.terms.map(term=>term.id)).size,523);
  assert.equal(new Set(current.terms.map(term=>term.id)).size,523);
  for(const id of approved){
    assert.equal(baseline.terms.find(term=>term.id===id)?.content_status,'raw',id+' baseline');
    assert.equal(current.terms.find(term=>term.id===id)?.content_status,'drafted',id+' current');
  }
  // Whole-document comparison retains order, all 488 other terms, and every
  // field of the approved 35 except the explicitly authorized state transition.
  assert.deepStrictEqual(current,{...baseline,terms:baseline.terms.map(term=>
    approved.has(term.id)?{...term,content_status:'drafted'}:term)});
}
