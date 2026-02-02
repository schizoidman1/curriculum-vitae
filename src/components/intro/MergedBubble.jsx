import { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Html } from '@react-three/drei'
import liquidGlassVert from '../../shaders/liquidGlass.vert?raw'
import liquidGlassFrag from '../../shaders/liquidGlass.frag?raw'
import useAudio from '../../hooks/useAudio'

/**
 * Large central bubble that appears in Phase 3.
 *
 * Displays text inside via Drei's Html component.
 * Pulses subtly and responds to hover/click.
 *
 * @param {boolean} visible - Whether to render
 * @param {number} scale - Current scale (animated externally)
 * @param {Function} onClick - Click handler for Phase 3→4 transition
 */
export default function MergedBubble({ visible = false, scale = 1, onClick }) {
  const meshRef = useRef()
  const hovered = useRef(false)
  const canPlayHoverSound = useRef(true)
  const hoverSoundTimeout = useRef(null)
  const { playSfx } = useAudio()

  const HOVER_SOUND_DEBOUNCE_MS = 5000

  // Responsive base scale
  const [baseScale, setBaseScale] = useState(2.5)

  useEffect(() => {
    const updateScale = () => {
      const isMobile = window.innerWidth < 768
      setBaseScale(isMobile ? 1.5 : 2.5)
    }
    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [])

  useEffect(() => {
    return () => clearTimeout(hoverSoundTimeout.current)
  }, [])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uColor: { value: new THREE.Color(0.75, 0.88, 1.0) },
      uFresnelPower: { value: 2.0 },
      uChromaticAberration: { value: 0.4 },
      uRefractionRatio: { value: 0.12 },
      uHover: { value: 0 },
    }),
    []
  )

  useFrame((state) => {
    if (!meshRef.current || !visible) return

    const elapsed = state.clock.getElapsedTime()
    uniforms.uTime.value = elapsed

    // Fade in
    uniforms.uOpacity.value = THREE.MathUtils.lerp(
      uniforms.uOpacity.value,
      visible ? 1 : 0,
      0.05
    )

    // Smooth hover transition
    uniforms.uHover.value = THREE.MathUtils.lerp(
      uniforms.uHover.value,
      hovered.current ? 1 : 0,
      0.08
    )

    // Subtle breathing pulse
    const pulse = 1 + Math.sin(elapsed * 1.2) * 0.02
    meshRef.current.scale.setScalar(baseScale * scale * pulse)
  })

  if (!visible) return null

  return (
    <group>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => {
          hovered.current = true
          document.body.style.cursor = 'pointer'
          if (canPlayHoverSound.current) {
            playSfx('hoverBubble', 0.3)
            canPlayHoverSound.current = false
            clearTimeout(hoverSoundTimeout.current)
            hoverSoundTimeout.current = setTimeout(() => {
              canPlayHoverSound.current = true
            }, HOVER_SOUND_DEBOUNCE_MS)
          }
        }}
        onPointerOut={() => {
          hovered.current = false
          document.body.style.cursor = 'default'
        }}
      >
        <sphereGeometry args={[1, 64, 64]} />
        <shaderMaterial
          vertexShader={liquidGlassVert}
          fragmentShader={liquidGlassFrag}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* HTML text overlay inside the bubble */}
      <Html center distanceFactor={6} style={{ pointerEvents: 'none' }}>
        <div className="select-none text-center">
          <p className="liquid-glass-text text-3xl md:text-8xl font-light tracking-wide opacity-0 animate-[fadeIn_1s_ease_0.5s_forwards]">
            Acessar
          </p>
        </div>
      </Html>
    </group>
  )
}
