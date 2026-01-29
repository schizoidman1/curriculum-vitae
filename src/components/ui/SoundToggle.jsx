import { Volume2, VolumeX } from 'lucide-react'
import useAppStore from '../../stores/appStore'

/**
 * Floating sound toggle button.
 * Appears during intro animation so users can enable audio.
 */
export default function SoundToggle() {
  const audioEnabled = useAppStore((s) => s.audioEnabled)
  const setAudioEnabled = useAppStore((s) => s.setAudioEnabled)

  const toggle = () => setAudioEnabled(!audioEnabled)

  return (
    <button
      onClick={toggle}
      className="fixed bottom-6 right-6 z-50 liquid-glass-subtle liquid-glass-interactive w-12 h-12 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
      aria-label={audioEnabled ? 'Desativar som' : 'Ativar som'}
    >
      {audioEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
    </button>
  )
}
