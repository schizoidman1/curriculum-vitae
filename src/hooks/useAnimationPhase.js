import { useEffect, useRef } from 'react'
import useAppStore, { PHASES } from '../stores/appStore'
import { PHASE_DURATIONS } from '../utils/constants'

/**
 * Orchestrates automatic phase transitions.
 *
 * Phases 1→2 and 2→3 are time-based.
 * Phase 3→4 requires a user click (handled elsewhere).
 * Phase 4→5 is time-based after the explosion.
 *
 * If prefers-reduced-motion is active, skips straight to CURRICULUM.
 */
export default function useAnimationPhase() {
  const phase = useAppStore((s) => s.phase)
  const nextPhase = useAppStore((s) => s.nextPhase)
  const prefersReducedMotion = useAppStore((s) => s.prefersReducedMotion)
  const setPrefersReducedMotion = useAppStore((s) => s.setPrefersReducedMotion)
  const skipIntro = useAppStore((s) => s.skipIntro)
  const timerRef = useRef(null)

  // Detect reduced motion preference on mount
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mql.matches)

    if (mql.matches) {
      skipIntro()
    }

    const handler = (e) => {
      setPrefersReducedMotion(e.matches)
      if (e.matches) skipIntro()
    }
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [setPrefersReducedMotion, skipIntro])

  // Auto-advance timed phases
  useEffect(() => {
    if (prefersReducedMotion) return

    clearTimeout(timerRef.current)

    const durations = {
      [PHASES.EMERGENCE]: PHASE_DURATIONS.EMERGENCE,
      [PHASES.CONVERGENCE]: PHASE_DURATIONS.CONVERGENCE,
      [PHASES.EXPLOSION]: PHASE_DURATIONS.EXPLOSION,
    }

    const duration = durations[phase]
    if (duration) {
      timerRef.current = setTimeout(() => {
        nextPhase()
      }, duration)
    }

    return () => clearTimeout(timerRef.current)
  }, [phase, nextPhase, prefersReducedMotion])

  return { phase }
}
