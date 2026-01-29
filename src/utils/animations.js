import gsap from 'gsap'
import { EASING, PHASE_DURATIONS } from './constants'

/**
 * Reusable GSAP animation presets for the liquid glass experience.
 * Each function returns a gsap.timeline or tween for composition.
 */

/** Fade in an element from transparent */
export function fadeIn(target, { duration = 0.6, delay = 0, ease = EASING.SMOOTH } = {}) {
  return gsap.fromTo(
    target,
    { opacity: 0 },
    { opacity: 1, duration, delay, ease }
  )
}

/** Fade out an element to transparent */
export function fadeOut(target, { duration = 0.6, delay = 0, ease = EASING.SMOOTH } = {}) {
  return gsap.to(target, { opacity: 0, duration, delay, ease })
}

/** Scale in from zero with optional spring */
export function scaleIn(target, { duration = 0.8, delay = 0, ease = EASING.SPRING } = {}) {
  return gsap.fromTo(
    target,
    { scale: 0, opacity: 0 },
    { scale: 1, opacity: 1, duration, delay, ease }
  )
}

/** Bubble rise animation (upward with sine oscillation) */
export function bubbleRise(target, { duration = 3, startY = '120%', endY = '-20%', delay = 0 } = {}) {
  const tl = gsap.timeline({ delay })

  tl.fromTo(
    target,
    { y: startY, opacity: 0 },
    {
      y: endY,
      opacity: 1,
      duration,
      ease: 'power1.out',
    },
    0
  )

  // Horizontal sine oscillation via keyframes
  tl.to(
    target,
    {
      x: '+=15',
      duration: duration / 3,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: 2,
    },
    0
  )

  return tl
}

/** Attract element to center point */
export function attractToCenter(target, { duration = 2, ease = EASING.EXPO } = {}) {
  return gsap.to(target, {
    x: 0,
    y: 0,
    duration,
    ease,
  })
}

/** Explosion: scale up + fade out */
export function explode(target, { duration = 1, scale = 8, ease = EASING.EXPO } = {}) {
  return gsap.to(target, {
    scale,
    opacity: 0,
    duration,
    ease,
  })
}

/**
 * Builds a master timeline for the full intro sequence.
 * Each phase is added sequentially using labels.
 */
export function createIntroTimeline() {
  const tl = gsap.timeline({ paused: true })

  tl.addLabel('emergence', 0)
  tl.addLabel('convergence', `emergence+=${PHASE_DURATIONS.EMERGENCE / 1000}`)
  // Phase 3 (central bubble) is user-driven, so the timeline pauses there.
  tl.addLabel('centralBubble', `convergence+=${PHASE_DURATIONS.CONVERGENCE / 1000}`)
  tl.addPause('centralBubble')
  tl.addLabel('explosion', 'centralBubble')

  return tl
}
