import { useRef, useEffect } from 'react'

/**
 * Radial gradient spotlight that follows the cursor.
 *
 * Creates a subtle luminous glow under the mouse, making
 * glass panels "light up" as the user explores the page.
 */
export default function MouseSpotlight() {
  const spotRef = useRef(null)
  const pos = useRef({ x: -200, y: -200 })
  const target = useRef({ x: -200, y: -200 })

  useEffect(() => {
    let animId

    const onMove = (e) => {
      target.current.x = e.clientX
      target.current.y = e.clientY
    }

    // Smooth lerp toward mouse position
    function tick() {
      pos.current.x += (target.current.x - pos.current.x) * 0.08
      pos.current.y += (target.current.y - pos.current.y) * 0.08

      if (spotRef.current) {
        spotRef.current.style.background = `radial-gradient(600px circle at ${pos.current.x}px ${pos.current.y}px, rgba(255,255,255,0.03) 0%, transparent 60%)`
      }

      animId = requestAnimationFrame(tick)
    }

    tick()
    window.addEventListener('mousemove', onMove)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <div
      ref={spotRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 2 }}
      aria-hidden="true"
    />
  )
}
