import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Howl } from 'howler'
import useAppStore from '../stores/appStore'

gsap.registerPlugin(ScrollTrigger)

// Lazy-loaded whoosh sound for section transitions
let whooshSound = null
const getWhoosh = () => {
  if (!whooshSound) {
    whooshSound = new Howl({
      src: ['/audio/whoosh.mp3'],
      volume: 0.2,
      preload: true,
    })
  }
  return whooshSound
}

/**
 * Hybrid vertical → horizontal scroll system with entrance animations.
 *
 * Vertical sections: Hero parallax, About slide-in.
 * Horizontal zone: pinned + translated, with per-section
 * stagger-in animations triggered by horizontal progress.
 *
 * @param {boolean} enabled - Only activate when in curriculum phase
 * @returns {{ wrapperRef, trackRef }} Refs for the horizontal section
 */
export default function useHorizontalScroll(enabled = false) {
  const wrapperRef = useRef(null)
  const trackRef = useRef(null)
  const setScrollProgress = useAppStore((s) => s.setScrollProgress)
  const audioEnabled = useAppStore((s) => s.audioEnabled)

  useEffect(() => {
    if (!enabled) return

    let frameId = requestAnimationFrame(() => {
      frameId = requestAnimationFrame(() => {
        const wrapper = wrapperRef.current
        const track = trackRef.current
        if (!wrapper || !track) return

        const distance = track.scrollWidth - window.innerWidth
        if (distance <= 0) return

        const ctx = gsap.context(() => {
          // --- Vertical section entrance animations ---

          // Hero: parallax text float + fade
          gsap.fromTo(
            '[data-anim="hero-content"]',
            { y: 0, opacity: 1 },
            {
              y: -80,
              opacity: 0,
              ease: 'none',
              scrollTrigger: {
                trigger: '#hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true,
              },
            }
          )

          // About: slide up + fade in
          gsap.fromTo(
            '[data-anim="about-content"]',
            { y: 100, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: '#about',
                start: 'top 80%',
                end: 'top 30%',
                scrub: true,
              },
            }
          )

          // --- Horizontal scroll ---
          const horizontalTween = gsap.to(track, {
            x: -distance,
            ease: 'none',
            scrollTrigger: {
              trigger: wrapper,
              pin: true,
              scrub: 1,
              end: () => `+=${distance}`,
              invalidateOnRefresh: true,
              onUpdate: (self) => setScrollProgress(self.progress),
            },
          })

          // --- Per-section stagger entrance animations ---
          track.querySelectorAll('[data-h-section]').forEach((section) => {
            const heading = section.querySelector('[data-h-heading]')
            const items = section.querySelectorAll('[data-h-item]')

            // Play whoosh sound when section enters
            ScrollTrigger.create({
              trigger: section,
              containerAnimation: horizontalTween,
              start: 'left 80%',
              onEnter: () => {
                if (useAppStore.getState().audioEnabled) {
                  getWhoosh().play()
                }
              },
            })

            // Heading: slide up + fade
            if (heading) {
              gsap.fromTo(
                heading,
                { y: 40, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 0.8,
                  ease: 'power3.out',
                  scrollTrigger: {
                    trigger: section,
                    containerAnimation: horizontalTween,
                    start: 'left 80%',
                    toggleActions: 'play none none reverse',
                  },
                }
              )
            }

            // Items: stagger in
            if (items.length) {
              gsap.fromTo(
                items,
                { y: 50, opacity: 0, scale: 0.95 },
                {
                  y: 0,
                  opacity: 1,
                  scale: 1,
                  duration: 0.7,
                  stagger: 0.1,
                  ease: 'power3.out',
                  scrollTrigger: {
                    trigger: section,
                    containerAnimation: horizontalTween,
                    start: 'left 70%',
                    toggleActions: 'play none none reverse',
                  },
                }
              )
            }
          })
        })

        wrapper._gsapCtx = ctx
      })
    })

    return () => {
      cancelAnimationFrame(frameId)
      wrapperRef.current?._gsapCtx?.revert()
      ScrollTrigger.refresh()
    }
  }, [enabled, setScrollProgress])

  useEffect(() => {
    if (!enabled) return
    const onResize = () => ScrollTrigger.refresh()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [enabled])

  return { wrapperRef, trackRef }
}
