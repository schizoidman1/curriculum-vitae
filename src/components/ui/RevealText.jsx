import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Text component that reveals words with highlight effect as they enter viewport.
 *
 * @param {string} children - Text content to reveal
 * @param {string} className - Additional classes
 * @param {string[]} highlightWords - Words to highlight with special effect
 * @param {string} as - HTML element to render as (default: p)
 */
export default function RevealText({
  children,
  className = '',
  highlightWords = [],
  as: Tag = 'p',
}) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    const words = containerRef.current.querySelectorAll('.reveal-word')

    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        {
          opacity: 0.2,
          y: 20,
          filter: 'blur(4px)',
        },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.6,
          stagger: 0.03,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            end: 'bottom 60%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Highlight effect for special words
      const highlightedWords = containerRef.current.querySelectorAll('.highlight-word')
      highlightedWords.forEach((word) => {
        ScrollTrigger.create({
          trigger: word,
          start: 'top 75%',
          onEnter: () => {
            gsap.to(word, {
              '--highlight-width': '100%',
              duration: 0.4,
              ease: 'power2.out',
            })
          },
          onLeaveBack: () => {
            gsap.to(word, {
              '--highlight-width': '0%',
              duration: 0.3,
              ease: 'power2.in',
            })
          },
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [children])

  // Split text into words
  const text = typeof children === 'string' ? children : ''
  const words = text.split(' ')

  return (
    <Tag ref={containerRef} className={`${className}`}>
      {words.map((word, index) => {
        const isHighlight = highlightWords.some(
          (hw) => word.toLowerCase().includes(hw.toLowerCase())
        )

        return (
          <span
            key={index}
            className={`reveal-word inline-block mr-[0.25em] ${
              isHighlight ? 'highlight-word relative' : ''
            }`}
            style={
              isHighlight
                ? {
                    '--highlight-width': '0%',
                  }
                : undefined
            }
          >
            {word}
            {isHighlight && (
              <span
                className="absolute bottom-0 left-0 h-[0.15em] bg-white/30 rounded-full -z-10"
                style={{
                  width: 'var(--highlight-width, 0%)',
                  transition: 'width 0.4s ease-out',
                }}
              />
            )}
          </span>
        )
      })}
    </Tag>
  )
}
