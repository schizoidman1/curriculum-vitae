import { lazy, Suspense, useEffect } from 'react'
import useAppStore, { PHASES } from './stores/appStore'
import Background from './components/layout/Background'
import IntroSequence from './components/intro/IntroSequence'
import ParticleField from './components/effects/ParticleField'
import NoiseOverlay from './components/effects/NoiseOverlay'
import FluidCursor from './components/effects/FluidCursor'
import ScrollProgress from './components/effects/ScrollProgress'
import SoundToggle from './components/ui/SoundToggle'

// Lazy-load the curriculum (heavy component tree with ScrollTrigger)
const HorizontalScroll = lazy(() =>
  import('./components/curriculum/HorizontalScroll')
)

/**
 * Root application component.
 *
 * Renders layered effects (particles, spotlight, noise),
 * the animated background, the intro sequence (phases 0-4),
 * and lazily loads the curriculum (phase 5) once the intro completes.
 */
export default function App() {
  const phase = useAppStore((s) => s.phase)

  // Lock scrolling during intro; unlock for curriculum (ScrollTrigger needs it)
  useEffect(() => {
    const html = document.documentElement
    if (phase < PHASES.CURRICULUM) {
      html.classList.add('scroll-locked')
    } else {
      html.classList.remove('scroll-locked')
    }
    return () => html.classList.remove('scroll-locked')
  }, [phase])

  return (
    <>
      {/* Animated gradient background (always visible) */}
      <Background />

      {/* Ambient effects layer */}
      <ParticleField />
      <NoiseOverlay />
      <FluidCursor />

      {/* Scroll progress indicator and sound toggle (curriculum phase only) */}
      {phase === PHASES.CURRICULUM && (
        <>
          <ScrollProgress />
          <SoundToggle />
        </>
      )}

      {/* Intro sequence: phases 0-4 */}
      {phase < PHASES.CURRICULUM && <IntroSequence />}

      {/* Curriculum: phase 5 (lazy loaded) */}
      {phase === PHASES.CURRICULUM && (
        <Suspense
          fallback={
            <div className="fixed inset-0 flex items-center justify-center">
            </div>
          }
        >
          <HorizontalScroll />
        </Suspense>
      )}
    </>
  )
}
