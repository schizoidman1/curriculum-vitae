import { useRef, useEffect } from 'react'

/**
 * 3D perspective tilt effect on hover.
 *
 * Makes glass panels feel physical by subtly rotating
 * toward the cursor when hovered, with a spring-back
 * transition on mouse leave.
 *
 * @param {Object} options
 * @param {number} options.maxTilt - Maximum tilt in degrees (default 8)
 * @param {number} options.perspective - CSS perspective value (default 800)
 * @param {number} options.scale - Scale on hover (default 1.02)
 * @param {boolean} options.glare - Enable specular glare effect
 * @returns {React.RefObject} Ref to attach to the tiltable element
 */
export default function useTilt({
  maxTilt = 8,
  perspective = 800,
  scale = 1.02,
  glare = true,
} = {}) {
  const ref = useRef(null)
  const glareRef = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Create glare overlay element
    let glareEl = null
    if (glare) {
      glareEl = document.createElement('div')
      glareEl.style.cssText = `
        position: absolute;
        inset: 0;
        border-radius: inherit;
        pointer-events: none;
        z-index: 20;
        opacity: 0;
        transition: opacity 0.3s ease;
        background: linear-gradient(
          135deg,
          rgba(255,255,255,0.15) 0%,
          transparent 50%,
          transparent 100%
        );
      `
      el.style.position = 'relative'
      el.appendChild(glareEl)
      glareRef.current = glareEl
    }

    el.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'

    const onEnter = () => {
      el.style.transition = 'transform 0.1s ease-out'
      if (glareEl) glareEl.style.opacity = '1'
    }

    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const cx = rect.width / 2
      const cy = rect.height / 2

      const rotateX = ((y - cy) / cy) * -maxTilt
      const rotateY = ((x - cx) / cx) * maxTilt

      el.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`

      // Move glare with cursor
      if (glareEl) {
        const angle = Math.atan2(y - cy, x - cx) * (180 / Math.PI) + 135
        glareEl.style.background = `linear-gradient(${angle}deg, rgba(255,255,255,0.12) 0%, transparent 60%)`
      }
    }

    const onLeave = () => {
      el.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      el.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`
      if (glareEl) glareEl.style.opacity = '0'
    }

    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)

    return () => {
      el.removeEventListener('mouseenter', onEnter)
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
      if (glareEl && el.contains(glareEl)) el.removeChild(glareEl)
    }
  }, [maxTilt, perspective, scale, glare])

  return ref
}
