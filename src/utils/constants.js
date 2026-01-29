/* ===========================
   Project-wide constants
   =========================== */

/** Phase durations in milliseconds */
export const PHASE_DURATIONS = {
  EMERGENCE: 3000,
  CONVERGENCE: 2000,
  EXPLOSION: 1000,
}

/** Bubble configuration */
export const BUBBLE_CONFIG = {
  COUNT: 18,
  MIN_SIZE: 20,
  MAX_SIZE: 80,
  MERGED_SIZE: 350,
  RISE_SPEED_MIN: 0.8,
  RISE_SPEED_MAX: 2.0,
  OSCILLATION_AMPLITUDE: 15,
  OSCILLATION_FREQUENCY: 0.5,
}

/** Background gradient colors */
export const BACKGROUND_COLORS = {
  START: '#A8C4E5',
  END: '#7BA3D0',
  DARK: '#0a0a1a',
}

/** Breakpoints matching Tailwind defaults */
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
}

/** Horizontal scroll sections (order matters) */
export const SECTION_IDS = [
  'hero',
  'about',
  'experience',
  'skills',
  'projects',
  'contact',
]

/** GSAP default ease curves */
export const EASING = {
  SMOOTH: 'power2.inOut',
  SPRING: 'elastic.out(1, 0.5)',
  BOUNCE: 'bounce.out',
  EXPO: 'expo.inOut',
}
