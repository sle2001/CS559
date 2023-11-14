precision highp float;
uniform float time;
uniform vec2 resolution;
varying vec3 fPosition;
varying vec3 fNormal;
varying vec3 uPos;
varying vec3 rawX;

void main(){

  // Normalize the coord x, y to between 0 to 1
  vec2 normalized_frag_coord = gl_FragCoord.xy / resolution;
  vec3 color = vec3(0);
  
  vec2 multi_xy = normalized_frag_coord * 10.0;
  multi_xy = fract(multi_xy);
  
  // Hacks to do the texture
  float xs = fract(uPos.x*5.0);
  float ys = fract(uPos.y*5.0);
  vec2 hack_xy = vec2(xs, ys);

  // Use the modle location to draw changing circles
  float len = length(abs(hack_xy) - fract(sin(time*0.01) * 1.0));
  
  // Add diffusive light to it, otherwise the color would
  // cover all the shape
  float diffusive = max(0.0, dot(fNormal, vec3(.707,.707,0)));
  
  // Add on the changing base color
  color = vec3(fract(len * 8.0 * (0.2 + abs(sin(time*4.0))))) *
              (.3 +.9*diffusive) + 
              vec3((sin(time*2.0)), 0.0, 0.0);
               
  
  gl_FragColor = vec4(color, 1.0);
  
  if(sin(1000.0*rawX.x)>0.3) discard;
}
