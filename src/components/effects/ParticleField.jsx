import { useRef, useEffect } from 'react'
import useAppStore, { PHASES } from '../../stores/appStore'

/**
 * Canvas-based particle system that adapts to the current phase.
 *
 * - Default: Subtle floating dots (stars/dust)
 * - Curriculum: Underwater sea effect with bubbles, light rays, and floating particles
 */
const PARTICLE_COUNT = 100
const BUBBLE_COUNT = 25
const LIGHT_RAY_COUNT = 5

export default function ParticleField() {
  const canvasRef = useRef(null)
  const phase = useAppStore((s) => s.phase)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let w = (canvas.width = window.innerWidth)
    let h = (canvas.height = window.innerHeight)
    let animId
    let time = 0

    // Regular floating particles
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.2 - 0.1,
      opacity: Math.random() * 0.3 + 0.05,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.01 + 0.005,
    }))

    // Bubbles for sea effect
    const bubbles = Array.from({ length: BUBBLE_COUNT }, () => createBubble(w, h))

    function createBubble(w, h, startFromBottom = false) {
      return {
        x: Math.random() * w,
        y: startFromBottom ? h + Math.random() * 100 : Math.random() * h,
        r: Math.random() * 4 + 2,
        speed: Math.random() * 0.8 + 0.3,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.02 + 0.01,
        wobbleAmount: Math.random() * 20 + 10,
        opacity: Math.random() * 0.3 + 0.1,
      }
    }

    // Light rays from surface
    const lightRays = Array.from({ length: LIGHT_RAY_COUNT }, (_, i) => ({
      x: (w / (LIGHT_RAY_COUNT + 1)) * (i + 1) + (Math.random() - 0.5) * 100,
      width: Math.random() * 80 + 40,
      opacity: Math.random() * 0.03 + 0.02,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: Math.random() * 0.005 + 0.002,
    }))

    // Floating sea particles (plankton/dust)
    const seaParticles = Array.from({ length: 60 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.2,
      dy: (Math.random() - 0.5) * 0.1,
      opacity: Math.random() * 0.15 + 0.05,
      drift: Math.random() * Math.PI * 2,
      driftSpeed: Math.random() * 0.01 + 0.005,
    }))

    function drawDefault() {
      ctx.clearRect(0, 0, w, h)

      for (const p of particles) {
        p.pulse += p.pulseSpeed
        const alpha = p.opacity + Math.sin(p.pulse) * 0.08

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, alpha)})`
        ctx.fill()

        p.x += p.dx
        p.y += p.dy

        if (p.x < -10) p.x = w + 10
        if (p.x > w + 10) p.x = -10
        if (p.y < -10) p.y = h + 10
        if (p.y > h + 10) p.y = -10
      }
    }

    function drawSea() {
      ctx.clearRect(0, 0, w, h)
      time += 0.016

      // Draw light rays from surface
      for (const ray of lightRays) {
        ray.sway += ray.swaySpeed
        const swayOffset = Math.sin(ray.sway) * 30

        const gradient = ctx.createLinearGradient(
          ray.x + swayOffset, 0,
          ray.x + swayOffset, h
        )
        gradient.addColorStop(0, `rgba(120, 180, 220, ${ray.opacity})`)
        gradient.addColorStop(0.5, `rgba(80, 140, 180, ${ray.opacity * 0.5})`)
        gradient.addColorStop(1, 'rgba(40, 80, 120, 0)')

        ctx.beginPath()
        ctx.moveTo(ray.x + swayOffset - ray.width / 2, 0)
        ctx.lineTo(ray.x + swayOffset + ray.width / 2, 0)
        ctx.lineTo(ray.x + swayOffset + ray.width * 1.5, h)
        ctx.lineTo(ray.x + swayOffset - ray.width * 1.5, h)
        ctx.closePath()
        ctx.fillStyle = gradient
        ctx.fill()
      }

      // Draw floating sea particles
      for (const p of seaParticles) {
        p.drift += p.driftSpeed
        const driftX = Math.sin(p.drift) * 0.5
        const driftY = Math.cos(p.drift * 0.7) * 0.3

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(150, 200, 230, ${p.opacity})`
        ctx.fill()

        p.x += p.dx + driftX
        p.y += p.dy + driftY

        if (p.x < -10) p.x = w + 10
        if (p.x > w + 10) p.x = -10
        if (p.y < -10) p.y = h + 10
        if (p.y > h + 10) p.y = -10
      }

      // Draw bubbles
      for (let i = 0; i < bubbles.length; i++) {
        const b = bubbles[i]
        b.wobble += b.wobbleSpeed
        const wobbleX = Math.sin(b.wobble) * b.wobbleAmount * 0.1

        // Bubble body
        ctx.beginPath()
        ctx.arc(b.x + wobbleX, b.y, b.r, 0, Math.PI * 2)

        // Gradient for 3D bubble effect
        const bubbleGradient = ctx.createRadialGradient(
          b.x + wobbleX - b.r * 0.3, b.y - b.r * 0.3, 0,
          b.x + wobbleX, b.y, b.r
        )
        bubbleGradient.addColorStop(0, `rgba(200, 230, 255, ${b.opacity * 0.8})`)
        bubbleGradient.addColorStop(0.5, `rgba(150, 200, 240, ${b.opacity * 0.4})`)
        bubbleGradient.addColorStop(1, `rgba(100, 160, 200, ${b.opacity * 0.1})`)

        ctx.fillStyle = bubbleGradient
        ctx.fill()

        // Bubble highlight
        ctx.beginPath()
        ctx.arc(b.x + wobbleX - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.25, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${b.opacity * 0.6})`
        ctx.fill()

        // Move bubble up
        b.y -= b.speed
        b.x += Math.sin(b.wobble) * 0.3

        // Reset bubble when it reaches the top
        if (b.y < -b.r * 2) {
          bubbles[i] = createBubble(w, h, true)
        }
      }

      // Subtle caustic effect at bottom (light patterns)
      const causticTime = time * 0.5
      for (let i = 0; i < 8; i++) {
        const cx = (Math.sin(causticTime + i * 1.5) * 0.5 + 0.5) * w
        const cy = h - 50 + Math.sin(causticTime * 1.3 + i) * 20
        const cr = 30 + Math.sin(causticTime * 2 + i * 0.7) * 15

        const causticGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, cr)
        causticGradient.addColorStop(0, 'rgba(100, 180, 220, 0.03)')
        causticGradient.addColorStop(1, 'rgba(80, 140, 180, 0)')

        ctx.beginPath()
        ctx.arc(cx, cy, cr, 0, Math.PI * 2)
        ctx.fillStyle = causticGradient
        ctx.fill()
      }
    }

    function draw() {
      if (phase === PHASES.CURRICULUM) {
        drawSea()
      } else {
        drawDefault()
      }
      animId = requestAnimationFrame(draw)
    }

    draw()

    const onResize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight

      // Reposition light rays on resize
      lightRays.forEach((ray, i) => {
        ray.x = (w / (LIGHT_RAY_COUNT + 1)) * (i + 1) + (Math.random() - 0.5) * 100
      })
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
    }
  }, [phase])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    />
  )
}
