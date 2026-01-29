import { Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import Bubble from './Bubble'
import MergedBubble from './MergedBubble'
import useAppStore, { PHASES } from '../../stores/appStore'
import { BUBBLE_CONFIG } from '../../utils/constants'

/**
 * Three.js Canvas containing all bubbles for the intro sequence.
 *
 * Renders individual bubbles in Phases 1-2 and the merged
 * central bubble in Phase 3. Hides entirely in Phase 5.
 */
export default function BubbleCanvas() {
  const phase = useAppStore((s) => s.phase)
  const nextPhase = useAppStore((s) => s.nextPhase)

  // Generate random bubble configurations once
  const bubbles = useMemo(() => {
    return Array.from({ length: BUBBLE_CONFIG.COUNT }, (_, i) => {
      const sizeNorm = Math.random()
      const size =
        BUBBLE_CONFIG.MIN_SIZE / 100 +
        sizeNorm * ((BUBBLE_CONFIG.MAX_SIZE - BUBBLE_CONFIG.MIN_SIZE) / 100)

      return {
        id: i,
        position: [
          (Math.random() - 0.5) * 8,   // x: spread across viewport
          -5 - Math.random() * 3,       // y: start below view
          (Math.random() - 0.5) * 2,    // z: slight depth variation
        ],
        size,
        speed:
          BUBBLE_CONFIG.RISE_SPEED_MIN +
          Math.random() * (BUBBLE_CONFIG.RISE_SPEED_MAX - BUBBLE_CONFIG.RISE_SPEED_MIN),
      }
    })
  }, [])

  const showBubbles = phase === PHASES.EMERGENCE || phase === PHASES.CONVERGENCE
  const showMerged = phase === PHASES.CENTRAL_BUBBLE
  const isConverging = phase === PHASES.CONVERGENCE

  // Don't render canvas after intro is done
  if (phase === PHASES.CURRICULUM) return null

  return (
    <div className="fixed inset-0 z-10" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
      >
        <Suspense fallback={null}>
          {/* Ambient light for subtle illumination */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={0.3} />

          {/* Individual bubbles (Phases 1-2) */}
          {showBubbles &&
            bubbles.map((b) => (
              <Bubble
                key={b.id}
                position={b.position}
                size={b.size}
                speed={b.speed}
                phase={phase}
                converging={isConverging}
                targetPosition={[0, 0, 0]}
                opacity={isConverging ? 0.6 : 1}
              />
            ))}

          {/* Merged central bubble (Phase 3) */}
          <MergedBubble
            visible={showMerged}
            scale={1}
            onClick={() => {
              if (phase === PHASES.CENTRAL_BUBBLE) {
                nextPhase() // → EXPLOSION
              }
            }}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
