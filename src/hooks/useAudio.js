import { useCallback, useRef, useEffect } from 'react'
import { Howl } from 'howler'
import useAppStore from '../stores/appStore'

/**
 * Manages audio playback for the experience.
 *
 * Howler.js handles Web Audio API context initialization.
 * User enables audio via the sound toggle button.
 *
 * Audio files should be placed in public/audio/:
 *   Intro sounds:
 *   - ambient.mp3  (ocean/tide ambient loop)
 *   - glass.mp3    (crystal/glass chime on bubble interactions)
 *   - pop.mp3      (bubble pop for explosion)
 *
 *   Curriculum sounds:
 *   - hover.mp3    (soft glass tap on hover)
 *   - click.mp3    (satisfying click/tap)
 *   - whoosh.mp3   (section transition swoosh)
 */
export default function useAudio() {
  const audioEnabled = useAppStore((s) => s.audioEnabled)
  const ambientRef = useRef(null)
  const sfxCache = useRef({})

  // Initialize ambient sound (lazy)
  const getAmbient = useCallback(() => {
    if (!ambientRef.current) {
      ambientRef.current = new Howl({
        src: ['/audio/ambient.mp3'],
        loop: true,
        volume: 0.3,
        preload: true,
      })
    }
    return ambientRef.current
  }, [])

  // Play a one-shot sound effect
  const playSfx = useCallback(
    (name, volume = 0.5) => {
      if (!audioEnabled) return

      if (!sfxCache.current[name]) {
        sfxCache.current[name] = new Howl({
          src: [`/audio/${name}.mp3`],
          volume,
          preload: true,
        })
      }

      sfxCache.current[name].play()
    },
    [audioEnabled]
  )

  // Start ambient loop
  const startAmbient = useCallback(() => {
    if (!audioEnabled) return
    const ambient = getAmbient()
    if (!ambient.playing()) {
      ambient.play()
      ambient.fade(0, 0.3, 2000)
    }
  }, [audioEnabled, getAmbient])

  // Stop ambient loop with fade
  const stopAmbient = useCallback(() => {
    const ambient = ambientRef.current
    if (ambient && ambient.playing()) {
      ambient.fade(ambient.volume(), 0, 1000)
      setTimeout(() => ambient.stop(), 1000)
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      ambientRef.current?.unload()
      Object.values(sfxCache.current).forEach((s) => s.unload())
    }
  }, [])

  return { startAmbient, stopAmbient, playSfx }
}
