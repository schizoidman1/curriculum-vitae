import { useRef, useEffect } from 'react'
import gsap from 'gsap'

/**
 * Parallax background layers that move at different speeds during scroll.
 * Creates depth illusion with floating elements.
 */
export default function ParallaxLayers() {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    const layers = containerRef.current.querySelectorAll('.parallax-layer')

    const handleScroll = () => {
      const scrollY = window.scrollY

      layers.forEach((layer, index) => {
        const speed = (index + 1) * 0.05
        const yPos = scrollY * speed
        gsap.to(layer, {
          y: yPos,
          duration: 0.3,
          ease: 'power1.out',
        })
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden -z-5"
      aria-hidden="true"
    >
      {/* Layer 1 - Slow moving large shapes */}
      <div className="parallax-layer absolute inset-0">
        <div className="absolute top-[10%] left-[5%] w-64 h-64 rounded-full bg-white/[0.02] blur-3xl" />
        <div className="absolute top-[60%] right-[10%] w-96 h-96 rounded-full bg-white/[0.015] blur-3xl" />
        <div className="absolute bottom-[20%] left-[20%] w-48 h-48 rounded-full bg-white/[0.02] blur-2xl" />
      </div>

      {/* Layer 2 - Medium speed elements */}
      <div className="parallax-layer absolute inset-0">
        <div className="absolute top-[25%] right-[25%] w-32 h-32 rounded-full bg-white/[0.03] blur-2xl" />
        <div className="absolute top-[70%] left-[40%] w-40 h-40 rounded-full bg-white/[0.025] blur-2xl" />
        <div className="absolute top-[45%] left-[70%] w-24 h-24 rounded-full bg-white/[0.03] blur-xl" />
      </div>

      {/* Layer 3 - Fast moving small particles */}
      <div className="parallax-layer absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/20"
            style={{
              top: `${10 + (i * 7) % 80}%`,
              left: `${5 + (i * 13) % 90}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Layer 4 - Gradient orbs */}
      <div className="parallax-layer absolute inset-0">
        <div
          className="absolute top-[15%] left-[60%] w-72 h-72 rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(100,150,255,0.1) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute top-[50%] left-[15%] w-56 h-56 rounded-full opacity-25"
          style={{
            background: 'radial-gradient(circle, rgba(150,200,255,0.08) 0%, transparent 70%)',
          }}
        />
      </div>
    </div>
  )
}
