import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * 3D Carousel component with rotating cards effect
 */
export default function Carousel3D({
  items,
  renderItem,
  autoRotate = false,
  autoRotateInterval = 5000,
  className = '',
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const itemCount = items.length

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % itemCount)
  }, [itemCount])

  const goToPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + itemCount) % itemCount)
  }, [itemCount])

  // Auto-rotate
  useEffect(() => {
    if (!autoRotate || isHovered || itemCount <= 1) return
    const interval = setInterval(goToNext, autoRotateInterval)
    return () => clearInterval(interval)
  }, [autoRotate, autoRotateInterval, isHovered, goToNext, itemCount])

  // Calculate position and styles for each card
  const getCardStyle = (index) => {
    const diff = index - activeIndex
    const normalizedDiff = ((diff % itemCount) + itemCount) % itemCount
    const adjustedDiff = normalizedDiff > itemCount / 2 ? normalizedDiff - itemCount : normalizedDiff

    // Position calculations
    const absPos = Math.abs(adjustedDiff)
    const isActive = adjustedDiff === 0

    // Only show cards within range of -1, 0, 1 (active and immediate neighbors)
    const isVisible = absPos <= 1

    // 3D transforms
    const rotateY = adjustedDiff * 35
    const translateX = adjustedDiff * 85
    const translateZ = -absPos * 200
    const scale = isActive ? 1 : 0.75
    const opacity = isVisible ? (isActive ? 1 : 0.5) : 0
    const zIndex = isActive ? 10 : 5 - absPos

    return {
      transform: `
        translateX(${translateX}%)
        translateZ(${translateZ}px)
        rotateY(${rotateY}deg)
        scale(${scale})
      `,
      opacity,
      zIndex,
      filter: isActive ? 'none' : 'blur(2px)',
      pointerEvents: isVisible ? 'auto' : 'none',
    }
  }

  if (itemCount === 0) return null

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Carousel container */}
      <div
        className="relative flex items-start justify-center pb-8"
        style={{
          perspective: '1200px',
          perspectiveOrigin: 'center center',
        }}
      >
        {/* Cards */}
        <div className="relative w-full max-w-2xl" style={{ transformStyle: 'preserve-3d' }}>
          {/* Invisible placeholder to maintain height */}
          <div className="invisible" aria-hidden="true">
            {renderItem(items[0], false)}
          </div>
          {/* Actual carousel cards */}
          {items.map((item, index) => (
            <div
              key={item.id || index}
              className="absolute top-0 left-1/2 w-full transition-all duration-500 ease-out cursor-pointer"
              style={{
                ...getCardStyle(index),
                transformStyle: 'preserve-3d',
                marginLeft: '-50%',
              }}
              onClick={() => setActiveIndex(index)}
            >
              {renderItem(item, index === activeIndex)}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows - hidden on mobile */}
      {itemCount > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-50 liquid-glass-subtle w-12 h-12 rounded-full items-center justify-center text-white/60 hover:text-white hover:scale-110 transition-all"
            aria-label="Anterior"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={goToNext}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-50 liquid-glass-subtle w-12 h-12 rounded-full items-center justify-center text-white/60 hover:text-white hover:scale-110 transition-all"
            aria-label="Próximo"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Dots indicator */}
      {itemCount > 1 && (
        <div className="flex justify-center gap-2 mt-16 relative z-50">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? 'bg-white/80 w-6'
                  : 'bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Ir para recomendação ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
