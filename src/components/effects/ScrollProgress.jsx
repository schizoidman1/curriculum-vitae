import useAppStore from '../../stores/appStore'

/**
 * Thin glowing scroll progress bar at the top of the screen.
 *
 * Only visible during the curriculum phase (horizontal scroll).
 * Width is driven by the scroll progress stored in Zustand.
 */
export default function ScrollProgress() {
  const progress = useAppStore((s) => s.scrollProgress)

  if (progress <= 0) return null

  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] z-50" aria-hidden="true">
      <div
        className="h-full"
        style={{
          width: `${progress * 100}%`,
          background:
            'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.8) 100%)',
          boxShadow: '0 0 12px rgba(255,255,255,0.3), 0 0 4px rgba(255,255,255,0.5)',
          transition: 'width 0.05s linear',
        }}
      />
    </div>
  )
}
