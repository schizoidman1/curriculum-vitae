import { useRef, useEffect } from 'react'
import gsap from 'gsap'

/**
 * Skill badge with liquid glass bubble aesthetic.
 *
 * Size scales with the skill level. Appears with a staggered
 * animation when scrolled into view.
 *
 * @param {string} name - Skill name
 * @param {number} level - Proficiency level (0-100)
 * @param {string} category - Skill category (frontend, backend, etc.)
 * @param {number} index - Position index for stagger delay
 */
export default function SkillBubble({ name, level = 50, category = 'frontend', index = 0 }) {
  const ref = useRef(null)

  // Size based on level (min 60px, max 120px)
  const size = 60 + (level / 100) * 60

  // Category-based tint
  const categoryColors = {
    frontend: 'rgba(136, 180, 224, 0.15)',
    backend: 'rgba(136, 224, 180, 0.15)',
    devops: 'rgba(224, 180, 136, 0.15)',
    tools: 'rgba(224, 200, 136, 0.15)',
    design: 'rgba(200, 136, 224, 0.15)',
  }

  useEffect(() => {
    if (!ref.current) return
    gsap.fromTo(
      ref.current,
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        delay: index * 0.08,
        ease: 'elastic.out(1, 0.5)',
      }
    )
  }, [index])

  return (
    <div
      ref={ref}
      className="liquid-glass-bubble liquid-glass-interactive inline-flex items-center justify-center"
      style={{
        width: size,
        height: size,
      }}
      title={`${name}: ${level}%`}
      role="listitem"
    >
      <span className="liquid-glass-text text-xs md:text-sm font-medium text-center px-1 leading-tight relative z-10">
        {name}
      </span>
    </div>
  )
}
