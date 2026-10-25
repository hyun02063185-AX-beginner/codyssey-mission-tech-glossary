export type Camera={x:number;y:number;scale:number};
export type ViewportSize={width:number;height:number};
/** Resizing the display area preserves the world point at its centre and zoom. */
export function resizeCamera(camera:Camera,before:ViewportSize,after:ViewportSize):Camera {
  return {...camera,x:camera.x+(before.width-after.width)/camera.scale/2,y:camera.y+(before.height-after.height)/camera.scale/2};
}
export function fitMap(size:ViewportSize,width:number,height:number):Camera {
  const scale=Math.min(size.width/width,size.height/height)*.95;
  return {scale,x:(width-size.width/scale)/2,y:(height-size.height/scale)/2};
}
export function fitBounds(size:ViewportSize,bounds:{left:number;top:number;right:number;bottom:number},reading=false):Camera {
  const fit=Math.min(size.width/(bounds.right-bounds.left),size.height/(bounds.bottom-bounds.top))*.95;
  // Focused labels use 18px: .75 preserves 13.5px reading size for long fixed columns.
  const scale=reading?Math.max(.75,Math.min(1.6,fit)):fit;
  return {scale,x:(bounds.left+bounds.right)/2-size.width/scale/2,y:(bounds.top+bounds.bottom)/2-size.height/scale/2};
}
