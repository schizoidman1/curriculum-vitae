import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import liquidGlassVert from '../../shaders/liquidGlass.vert?raw'
import liquidGlassFrag from '../../shaders/liquidGlass.frag?raw'

/**
 * Individual 3D bubble with liquid glass shader.
 *
 * Uses a custom ShaderMaterial for refraction, Fresnel, and
 * chromatic aberration effects.
 *
 * @param {[number, number, number]} position - Initial 3D position
 * @param {number} size - Radius of the bubble
 * @param {number} speed - Vertical rise speed multiplier
 * @param {number} phase - Current animation phase
 * @param {boolean} converging - Whether bubble is being attracted to center
 * @param {[number, number, number]} targetPosition - Convergence target
 * @param {number} opacity - Bubble opacity (0-1)
 */
export default function Bubble({
  position = [0, 0, 0],
  size = 0.5,
  speed = 1,
  phase = 1,
  converging = false,
  targetPosition = [0, 0, 0],
  opacity = 1,
}) {
  const meshRef = useRef()
  const initialPos = useRef(new THREE.Vector3(...position))

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: opacity },
      uColor: { value: new THREE.Color(0.7, 0.85, 1.0) },
      uFresnelPower: { value: 2.5 },
      uChromaticAberration: { value: 0.3 },
      uRefractionRatio: { value: 0.15 },
      uHover: { value: 0 },
    }),
    []
  )

  useFrame((state) => {
    if (!meshRef.current) return

    const elapsed = state.clock.getElapsedTime()
    uniforms.uTime.value = elapsed
    uniforms.uOpacity.value = opacity

    if (converging) {
      // Lerp toward target position during convergence
      meshRef.current.position.lerp(
        new THREE.Vector3(...targetPosition),
        0.03
      )
      // Shrink as it approaches center
      const dist = meshRef.current.position.distanceTo(
        new THREE.Vector3(...targetPosition)
      )
      const shrink = THREE.MathUtils.clamp(dist / 5, 0.1, 1)
      meshRef.current.scale.setScalar(shrink)
    } else {
      // Phase 1: Rise upward with sine oscillation
      const y = initialPos.current.y + elapsed * speed * 0.5
      const x =
        initialPos.current.x + Math.sin(elapsed * 0.8 + initialPos.current.x) * 0.3

      meshRef.current.position.set(x, y, initialPos.current.z)
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 32, 32]} />
      <shaderMaterial
        vertexShader={liquidGlassVert}
        fragmentShader={liquidGlassFrag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}
