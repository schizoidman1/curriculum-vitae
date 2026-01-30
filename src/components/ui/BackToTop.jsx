import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'

/**
 * Animated back-to-top button that appears after scrolling down.
 */
export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      onClick={scrollToTop}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed bottom-8 left-8 z-50 liquid-glass-subtle w-12 h-12 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-all duration-500 ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-4 scale-75 pointer-events-none'
      }`}
      aria-label="Voltar ao topo"
    >
      <ArrowUp
        size={20}
        className={`transition-transform duration-300 ${isHovered ? '-translate-y-1' : ''}`}
      />

      {/* Ripple effect on hover */}
      <span
        className={`absolute inset-0 rounded-full bg-white/10 transition-transform duration-500 ${
          isHovered ? 'scale-150 opacity-0' : 'scale-100 opacity-100'
        }`}
      />

      {/* Keyboard hint */}
      <span
        className={`absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] text-white/40 whitespace-nowrap transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        Home
      </span>
    </button>
  )
}
