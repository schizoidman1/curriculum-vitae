import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import useAppStore, { PHASES } from '../../stores/appStore'
import useAnimationPhase from '../../hooks/useAnimationPhase'
import useAudio from '../../hooks/useAudio'
import BubbleCanvas from './BubbleCanvas'
import SoundToggle from '../ui/SoundToggle'

/**
 * Orchestrates the full intro sequence (Phases 1-4).
 *
 * Animation starts immediately without user interaction.
 * Sound toggle button allows users to enable audio during playback.
 *
 * - Phase 1: BubbleCanvas shows rising bubbles
 * - Phase 2: Bubbles converge to center
 * - Phase 3: Central merged bubble awaits click
 * - Phase 4: Explosion overlay fills screen, then transitions to curriculum
 *
 * After Phase 4 completes, this component unmounts.
 */
export default function IntroSequence() {
  const phase = useAppStore((s) => s.phase)
  const audioEnabled = useAppStore((s) => s.audioEnabled)
  const setIntroComplete = useAppStore((s) => s.setIntroComplete)
  const explosionRef = useRef(null)
  const { startAmbient, stopAmbient, playSfx } = useAudio()

  // Drive automatic phase transitions
  useAnimationPhase()

  // Start ambient audio when user enables sound
  useEffect(() => {
    if (audioEnabled && phase >= PHASES.EMERGENCE && phase < PHASES.CURRICULUM) {
      startAmbient()
      playSfx('glass', 0.3)
    }
  }, [audioEnabled, phase, startAmbient, playSfx])

  // Phase 4: Explosion animation
  useEffect(() => {
    if (phase === PHASES.EXPLOSION && explosionRef.current) {
      if (audioEnabled) playSfx('pop', 0.6)

      gsap.fromTo(
        explosionRef.current,
        { scale: 0, opacity: 1, borderRadius: '50%' },
        {
          scale: 3,
          opacity: 1,
          borderRadius: '0%',
          duration: 1,
          ease: 'expo.inOut',
          onComplete: () => {
            stopAmbient()
            setIntroComplete(true)
          },
        }
      )
    }
  }, [phase, audioEnabled, stopAmbient, setIntroComplete, playSfx])

  // Don't render after intro is done
  if (phase === PHASES.CURRICULUM) return null

  return (
    <div className="fixed inset-0 z-20">
      {/* Phases 1-3: Three.js bubble canvas */}
      <BubbleCanvas />

      {/* Controls (visible during intro phases 1-3) */}
      {phase >= PHASES.EMERGENCE && phase <= PHASES.CENTRAL_BUBBLE && (
        <>
          <button
            className="fixed top-6 right-6 z-50 text-sm opacity-40 hover:opacity-80 transition-opacity text-white/70 underline underline-offset-4"
            onClick={() => useAppStore.getState().skipIntro()}
            aria-label="Pular introdução"
          >
            Pular
          </button>
          <SoundToggle />
        </>
      )}

      {/* Phase 4: Explosion overlay */}
      {phase === PHASES.EXPLOSION && (
        <div
          ref={explosionRef}
          className="fixed inset-0 z-30 flex items-center justify-center"
          style={{
            background:
              'radial-gradient(circle, rgba(168,196,229,0.9) 0%, rgba(123,163,208,0.95) 100%)',
            transform: 'scale(0)',
            transformOrigin: 'center center',
          }}
          aria-hidden="true"
        />
      )}
    </div>
  )
}
