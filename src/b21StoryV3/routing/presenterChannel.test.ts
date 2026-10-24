import { describe, expect, it } from 'vitest';
import { isSnapshot } from './presenterChannel';
describe('presenter message boundary',()=>{
  it('accepts a bounded projector snapshot including safe map return',()=>{
    expect(isSnapshot({route:{scene:4,step:1,back:6,presenter:false},reveal:false})).toBe(true);
  });
  it.each([null,{}, {route:null,reveal:true}, {route:{scene:99,step:0,back:null,presenter:false},reveal:false}, {route:{scene:4,step:-1,back:null,presenter:false},reveal:false}, {route:{scene:4,step:1,back:'https://example.test',presenter:false},reveal:false}, {route:{scene:4,step:1,back:18,presenter:false},reveal:false}, {route:{scene:7,step:1,back:6,presenter:false},reveal:false}, {route:{scene:4,step:1,back:null,presenter:true},reveal:false}, {route:{scene:4,step:1,back:null,presenter:false},reveal:'yes'}])('rejects malformed state %j',value=>expect(isSnapshot(value)).toBe(false));
});
