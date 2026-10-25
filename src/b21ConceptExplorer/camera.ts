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
