import { useRef, useEffect } from 'react'

/**
 * Magnetic attraction effect for interactive elements.
 *
 * When the cursor gets close, the element gently pulls
 * toward it, creating a playful magnetic feel.
 *
 * @param {number} strength - Pull strength multiplier (default 0.3)
 * @param {number} radius - Activation radius in pixels (default 120)
 * @returns {React.RefObject} Ref to attach to the magnetic element
 */
export default function useMagnetic(strength = 0.3, radius = 120) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let animId

    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < radius) {
        const pull = (1 - dist / radius) * strength
        el.style.transform = `translate(${dx * pull}px, ${dy * pull}px)`
        el.style.transition = 'transform 0.15s ease-out'
      } else {
        el.style.transform = 'translate(0px, 0px)'
        el.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      }
    }

    const onLeave = () => {
      el.style.transform = 'translate(0px, 0px)'
      el.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    }

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [strength, radius])

  return ref
}
