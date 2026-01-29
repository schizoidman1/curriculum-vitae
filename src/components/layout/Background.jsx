import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import useAppStore, { PHASES } from '../../stores/appStore'

/**
 * Animated gradient background that transitions based on the current phase.
 *
 * - Phases 0: Dark
 * - Phases 1-4: Soft blue gradient (A8C4E5 → 7BA3D0)
 * - Phase 5: Slightly darker gradient for readability
 */
export default function Background() {
  const phase = useAppStore((s) => s.phase)
  const bgRef = useRef(null)

  useEffect(() => {
    if (!bgRef.current) return

    const colors = {
      [PHASES.ENTRY]: { start: '#121212', end: '#121212' },
      [PHASES.EMERGENCE]: { start: '#A8C4E5', end: '#7BA3D0' },
      [PHASES.CONVERGENCE]: { start: '#A8C4E5', end: '#7BA3D0' },
      [PHASES.CENTRAL_BUBBLE]: { start: '#9BBCDE', end: '#6F97C4' },
      [PHASES.EXPLOSION]: { start: '#8AADD4', end: '#5E88B5' },
      [PHASES.CURRICULUM]: { start: '#121212', end: '#121212' },
    }

    const { start, end } = colors[phase] || colors[PHASES.ENTRY]

    gsap.to(bgRef.current, {
      background: `linear-gradient(135deg, ${start} 0%, ${end} 100%)`,
      duration: phase === PHASES.ENTRY ? 0 : 1.2,
      ease: 'power2.inOut',
    })
  }, [phase])

  return (
    <div
      ref={bgRef}
      className="fixed inset-0 -z-10"
      style={{ background: 'linear-gradient(135deg, #121212 0%, #121212 100%)' }}
      aria-hidden="true"
    />
  )
}
