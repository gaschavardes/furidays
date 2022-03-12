precision highp float;
uniform float uTime;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vMPos;
uniform vec2 u_mapResolution;
uniform vec2 u_resolution;
uniform sampler2D tMap;
uniform sampler2D tNormal;
uniform float uNormalScale;
uniform float uNormalUVScale;

void main() {
 	
	 gl_FragColor.rgb = vec3(1., 1., 1.);
	 gl_FragColor.a =  1. * clamp(0., 1., (1. - exp(vUv.y)* 0.7)) * step(0.03, vUv.y);
 
}