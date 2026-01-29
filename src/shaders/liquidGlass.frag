// Liquid Glass Fragment Shader
// Implements Fresnel-based refraction, chromatic aberration, and environment reflection.

uniform float uTime;
uniform float uOpacity;
uniform vec3 uColor;
uniform float uFresnelPower;
uniform float uChromaticAberration;
uniform float uRefractionRatio;
uniform float uHover; // 0.0 = idle, 1.0 = hovered

varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec2 vUv;

void main() {
  vec3 viewDir = normalize(vViewPosition);
  vec3 normal = normalize(vNormal);

  // --- Fresnel effect (brighter at glancing angles) ---
  float fresnel = pow(1.0 - abs(dot(viewDir, normal)), uFresnelPower);

  // --- Simulated refraction via normal-based UV distortion ---
  vec2 refractOffset = normal.xy * uRefractionRatio;

  // --- Chromatic aberration (slight RGB channel separation) ---
  float r = 0.5 + refractOffset.x + uChromaticAberration * 0.01;
  float g = 0.5 + refractOffset.y;
  float b = 0.5 - refractOffset.x + uChromaticAberration * 0.01;
  vec3 refractedColor = vec3(r, g, b) * uColor;

  // --- Internal highlight (top-left specular) ---
  float highlight = smoothstep(0.6, 1.0, dot(normal, normalize(vec3(0.3, 0.5, 1.0))));

  // --- Combine ---
  vec3 finalColor = mix(refractedColor, vec3(1.0), fresnel * 0.4);
  finalColor += highlight * 0.25;

  // Subtle time-based shimmer
  float shimmer = sin(uTime * 1.5 + vUv.x * 6.0 + vUv.y * 4.0) * 0.03;
  finalColor += shimmer;

  // --- Hover border glow ---
  // Boost edge brightness and alpha when hovered
  vec3 glowColor = vec3(0.6, 0.8, 1.0);
  float glowStrength = fresnel * uHover * 1.2;
  finalColor += glowColor * glowStrength;

  float baseAlpha = fresnel * 0.5 + 0.15;
  float hoverAlpha = fresnel * 0.35 * uHover;

  gl_FragColor = vec4(finalColor, (baseAlpha + hoverAlpha) * uOpacity);
}
