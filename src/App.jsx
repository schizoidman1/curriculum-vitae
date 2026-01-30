import { lazy, Suspense, useEffect, useState } from 'react'
import useAppStore, { PHASES } from './stores/appStore'
import Background from './components/layout/Background'
import IntroSequence from './components/intro/IntroSequence'
import ParticleField from './components/effects/ParticleField'
import NoiseOverlay from './components/effects/NoiseOverlay'
import FluidCursor from './components/effects/FluidCursor'
import ScrollProgress from './components/effects/ScrollProgress'
import ParallaxLayers from './components/effects/ParallaxLayers'
import LoadingScreen from './components/effects/LoadingScreen'
import EasterEggEffects from './components/effects/EasterEggEffects'
import SoundToggle from './components/ui/SoundToggle'
import FloatingNav from './components/ui/FloatingNav'
import BackToTop from './components/ui/BackToTop'
import AvailabilityBadge from './components/ui/AvailabilityBadge'
import ThemeToggle from './components/ui/ThemeToggle'
import useKeyboardNav from './hooks/useKeyboardNav'
import useEasterEggs from './hooks/useEasterEggs'
import curriculum from './data/curriculum'

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
  const [isLoading, setIsLoading] = useState(true)
  const { activeEgg } = useEasterEggs()

  // Enable keyboard navigation during curriculum phase
  useKeyboardNav(phase === PHASES.CURRICULUM)

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

  // Show loading screen on initial load
  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />
  }

  return (
    <>
      {/* Animated gradient background (always visible) */}
      <Background />

      {/* Ambient effects layer */}
      <ParticleField />
      <NoiseOverlay />
      <FluidCursor />
      {phase === PHASES.CURRICULUM && <ParallaxLayers />}

      {/* Easter egg effects */}
      <EasterEggEffects activeEgg={activeEgg} />

      {/* UI controls (curriculum phase only) */}
      {phase === PHASES.CURRICULUM && (
        <>
          <ScrollProgress />
          <SoundToggle />
          <FloatingNav />
          <BackToTop />
          <ThemeToggle />
          <AvailabilityBadge
            available={curriculum.personal.availability.available}
            type={curriculum.personal.availability.type}
            message={curriculum.personal.availability.message}
          />
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
