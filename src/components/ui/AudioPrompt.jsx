import { useCallback } from 'react'
import { Howler } from 'howler'
import useAppStore, { PHASES } from '../../stores/appStore'

/**
 * Phase 0: Entry screen.
 * Displays a subtle "Click to enter" prompt on a dark background.
 * On click, enables audio context and advances to Phase 1.
 */
export default function AudioPrompt() {
  const phase = useAppStore((s) => s.phase)
  const setPhase = useAppStore((s) => s.setPhase)
  const setAudioEnabled = useAppStore((s) => s.setAudioEnabled)
  const skipIntro = useAppStore((s) => s.skipIntro)

  const handleEnter = useCallback(() => {
    // Unlock Web Audio context for Safari/iOS
    if (Howler.ctx && Howler.ctx.state === 'suspended') {
      Howler.ctx.resume()
    }
    setAudioEnabled(true)
    setPhase(PHASES.EMERGENCE)
  }, [setAudioEnabled, setPhase])

  if (phase !== PHASES.ENTRY) return null

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-(--color-bg-dark) cursor-pointer"
      onClick={handleEnter}
      role="button"
      tabIndex={0}
      aria-label="Clique para entrar na experiência"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleEnter()
        }
      }}
    >
      {/* Subtle pulsing prompt */}
      <p className="liquid-glass-text text-lg tracking-widest uppercase opacity-60 animate-pulse">
        Clique para entrar
      </p>

      {/* Skip intro button (accessibility) */}
      <button
        className="mt-8 text-sm opacity-30 hover:opacity-60 transition-opacity underline underline-offset-4"
        onClick={(e) => {
          e.stopPropagation()
          skipIntro()
        }}
        aria-label="Pular introdução e ir direto ao currículo"
      >
        Pular introdução
      </button>
    </div>
  )
}
