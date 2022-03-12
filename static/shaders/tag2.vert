#version 300 es
precision highp float;

in vec3 position;
in vec2 uv;
in vec3 normal;
uniform mat4 modelViewMatrix;
uniform mat4 modelMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;
uniform float angle;
uniform float progress;
uniform float uTime;
uniform float uTurbulence;
out vec2 vUv;
out vec3 vNormal;
out vec3 vMVPos;


void main() {

  // NOISE
  //float noiseFreq = .5;
  //float noiseAmp = uTurbulence; 
  //vec3 noisePos = vec3(position.x * noiseFreq + uTime, position.y, position.z);
  //finalposition.y += noise(noisePos) * noiseAmp;

  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vMVPos = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}