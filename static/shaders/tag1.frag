#extension GL_OES_standard_derivatives : enable
precision highp float;
uniform float uTime;
uniform sampler2D tMap;
uniform float uOpacity;
uniform float uGold;
uniform mat4 viewMatrix;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vMPos;

uniform sampler2D tNormal;
uniform float uNormalScale;
uniform float uNormalUVScale;


vec3 getNormal() {
  vec3 pos_dx = dFdx(vMPos.xyz);
  vec3 pos_dy = dFdy(vMPos.xyz);
  vec2 tex_dx = dFdx(vUv);
  vec2 tex_dy = dFdy(vUv);
  vec3 t = normalize(pos_dx * tex_dy.t - pos_dy * tex_dx.t);
  vec3 b = normalize(-pos_dx * tex_dy.s + pos_dy * tex_dx.s);
  mat3 tbn = mat3(t, b, normalize(vNormal));
  vec3 n = texture2D(tNormal, vUv * uNormalUVScale).rgb * 2.0 - 1.0;
  n.xy *= uNormalScale;
  vec3 normal = normalize(tbn * n);
  // Get world normal from view normal
  return normalize((vec4(normal, 0.0) * viewMatrix).xyz);
}

void main() {
    // vec3 normal = normalize(vNormal);
    vec3 tex = texture2D(tMap, vUv).rgb;
    vec3 normal = getNormal();
    vec3 light = normalize(vec3(.1, 1.0, .1));
    float shading = dot(normal, light) * 0.5;
    vec3 finalText = mix(vec3(67./255., 79./255., 94./255.),tex + shading, uGold);
    gl_FragColor.rgb = finalText;
    // FragColor.rgb = vec3(n-0.5);
    gl_FragColor.a =  uOpacity;
    // FragColor.a = uOpacity;
}