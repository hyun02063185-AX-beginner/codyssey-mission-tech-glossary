import {describe,it,expect} from 'vitest';
import {fitMap,resizeCamera} from './camera';
describe('Map-first camera viewport contracts',()=>{
  it.each([[1280,720],[1280,900],[390,844],[360,800]])('fits the whole map inside %ix%i with space around it',(width,height)=>{
    const camera=fitMap({width,height},1600,2200);
    expect(camera.x).toBeLessThan(0);expect(camera.y).toBeLessThan(0);
    expect(camera.x+width/camera.scale).toBeGreaterThan(1600);expect(camera.y+height/camera.scale).toBeGreaterThan(2200);
  });
  it.each([.3,.9,1.05,1.8])('preserves world centre and zoom at %s when a side panel or sheet changes size',scale=>{
    const before={width:1246,height:660},after={width:884,height:300},camera={x:120,y:-87,scale};
    const resized=resizeCamera(camera,before,after);
    expect(resized.scale).toBe(scale);
    expect(resized.x+after.width/scale/2).toBeCloseTo(camera.x+before.width/scale/2,10);
    expect(resized.y+after.height/scale/2).toBeCloseTo(camera.y+before.height/scale/2,10);
    const restored=resizeCamera(resized,after,before);expect(restored.x).toBeCloseTo(camera.x,10);expect(restored.y).toBeCloseTo(camera.y,10);
  });
});
