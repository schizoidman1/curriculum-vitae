import { useCallback, useRef } from 'react'
import useAppStore from '../stores/appStore'
import { Howl } from 'howler'

/**
 * Sound effects for curriculum interactions.
 *
 * Audio files in public/audio/:
 *   - hover.mp3   (soft glass tap on hover)
 *   - click.mp3   (satisfying click/tap)
 *   - whoosh.mp3  (section transition swoosh)
 */
export default function useCurriculumSounds() {
  const audioEnabled = useAppStore((s) => s.audioEnabled)
  const sfxCache = useRef({})
  const lastHoverTime = useRef(0)

  const play = useCallback(
    (name, volume = 0.3) => {
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

  // Throttled hover sound (max once per 100ms to avoid spam)
  const playHover = useCallback(() => {
    const now = Date.now()
    if (now - lastHoverTime.current > 100) {
      lastHoverTime.current = now
      play('hover', 0.15)
    }
  }, [play])

  const playClick = useCallback(() => {
    play('click', 0.25)
  }, [play])

  const playWhoosh = useCallback(() => {
    play('whoosh', 0.2)
  }, [play])

  // Event handler props to spread onto elements
  const hoverSoundProps = {
    onMouseEnter: playHover,
  }

  const clickSoundProps = {
    onMouseEnter: playHover,
    onClick: playClick,
  }

  return {
    playHover,
    playClick,
    playWhoosh,
    hoverSoundProps,
    clickSoundProps,
  }
}
