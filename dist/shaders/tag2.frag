#version 300 es
precision highp float;
uniform float uTime;
uniform sampler2D tMap;
uniform float uOpacity;
uniform mat4 viewMatrix;
uniform float angle;
uniform float uGold;
in vec2 vUv;
in vec3 vNormal;
in vec3 vMVPos;

uniform float uNormalScale;
uniform float uNormalUVScale;

out vec4 FragColor;


float pixelsize = 1.0;
float PI = 3.14159265359;

vec2 hash22(vec2 p) {
    p = p*mat2(127.1,311.7,269.5,183.3);
	p = -1.0 + 20.0 * fract(sin(p)*43758.5453123);
	return sin(p*5.283 + uTime);
}

float perlin_noise(vec2 p) {
	vec2 pi = floor(p);
    vec2 pf = p - pi;
    
    // interpolation
    vec2 w = pf * pf * (3.0 - 2.0 * pf);
    
    float f00 = dot(hash22(pi + vec2(0.0, 0.0)), pf - vec2(0.0, 0.0));
    float f01 = dot(hash22(pi + vec2(0.0, 1.0)), pf - vec2(0.0, 1.0));
    float f10 = dot(hash22(pi + vec2(1.0, 0.0)), pf - vec2(1.0, 0.0));
    float f11 = dot(hash22(pi + vec2(1.0, 1.0)), pf - vec2(1.0, 1.0));
    
    // mixing top & bottom edges
    float xm1 = mix(f00, f10, w.x);
    float xm2 = mix(f01, f11, w.x);
    
    // mixing to point
    float ym = mix(xm1, xm2, w.y); 
    
    return ym;
}

float fBM2(float size, int octaves, float persistence, float scale, vec2 coord) {
    float c = 0.0;
    float p = 1.0;
    float n = p;
    
    for (int i = 1; i <= 1; i++) {
        c += perlin_noise(coord * size) * p * 3.;
        n    += p;
        size *= scale;
        p    *= persistence;
    }
    // normalize c
    c /= n;
    
    return c;
}

vec3 normals(vec3 pos) {
    vec3 fdx = dFdx(pos);
    vec3 fdy = dFdy(pos);
    return normalize(cross(fdx, fdy));
}
vec2 matcap(vec3 eye, vec3 normal) {
    vec3 reflected = reflect(eye, normal);
    float m = 2.8284271247461903 * sqrt(reflected.z + 1.0);
    return reflected.xy / m + 0.5;
}

void main() {
    vec3 normal = normals(vMVPos.xyz);
    vec3 tex = texture(tMap, vUv).rgb;
    float mat = texture(tMap, matcap(normalize(vMVPos.xyz), normal)).g;
    vec3 light = normalize(vec3(1., sin(1.41), cos(1.41)));
    //float shading = dot(normal, light) * 0.2;
    FragColor.rgb = tex + mat + normal;
    if(tex == vec3(1., 1., 1.)) {
        FragColor.rgb = (mat + normal) * 2.;
    } else {
        FragColor.rgb = tex + mat * 0.5;
    }

    FragColor.a =  1.;
}