import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import GlassCard from './GlassCard'

/**
 * Horizontal timeline conveying temporal progression.
 *
 * Each item is a single column: year → dot → connector → card.
 * A horizontal line runs behind the dots across all columns.
 *
 * @param {Array} items - Experience entries in chronological order
 */
export default function Timeline({ items = [] }) {
  const containerRef = useRef(null)
  const lineRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      const fill = containerRef.current.querySelector('.timeline-fill')
      const nodes = containerRef.current.querySelectorAll('.timeline-node')
      const cards = containerRef.current.querySelectorAll('.timeline-card')

      if (fill) {
        gsap.fromTo(fill, { width: '0%' }, {
          width: '100%',
          duration: 1,
          ease: 'power2.out',
        })
      }

      gsap.fromTo(nodes, { scale: 0, opacity: 0 }, {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        stagger: 0.25,
        delay: 0.3,
        ease: 'back.out(2)',
      })

      gsap.fromTo(cards, { y: 24, opacity: 0 }, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.25,
        delay: 0.5,
        ease: 'power2.out',
      })
    }, containerRef)

    return () => ctx.revert()
  }, [items])

  // Dynamically position the line at the dot centers after render
  useEffect(() => {
    if (!containerRef.current || !lineRef.current) return
    const firstNode = containerRef.current.querySelector('.timeline-node')
    if (!firstNode) return
    const offset = firstNode.offsetTop + firstNode.offsetHeight / 2
    lineRef.current.style.top = `${offset}px`
  }, [items])

  return (
    <div ref={containerRef} className="relative w-full max-w-5xl mx-auto px-4 md:px-6">
      {/* ── MOBILE: Vertical timeline ── */}
      <div className="md:hidden relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-white/10">
          <div
            className="timeline-fill absolute top-0 left-0 w-px h-full"
            style={{
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.5) 100%)',
            }}
          />
        </div>

        {/* Items */}
        <div className="relative flex flex-col gap-8">
          {items.map((item, index) => (
            <div key={item.id} className="flex gap-6 pl-2">
              {/* Left: dot + year */}
              <div className="flex flex-col items-center">
                <span className="text-xs font-mono tracking-wider text-white/40 mb-2">
                  {item.year}
                </span>
                <div className="timeline-node relative">
                  <div
                    className={`w-3 h-3 rounded-full border-2 ${
                      item.current
                        ? 'bg-white border-white/70 shadow-[0_0_12px_rgba(255,255,255,0.5)]'
                        : 'bg-white/25 border-white/30'
                    }`}
                  />
                  {item.current && (
                    <span className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
                  )}
                </div>
              </div>

              {/* Right: card */}
              <div className="timeline-card flex-1 min-w-0">
                <GlassCard
                  title={item.role}
                  subtitle={
                    <span className="flex items-center gap-2">
                      {item.companyLogo && (
                        <img
                          src={item.companyLogo}
                          alt={item.company}
                          className="w-4 h-4 object-contain rounded"
                        />
                      )}
                      {item.company} · {item.period}
                    </span>
                  }
                  footer={
                    <div className="flex flex-wrap gap-1.5">
                      {item.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="liquid-glass-subtle text-[10px] px-2 py-1 rounded-full text-white/70"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  }
                >
                  <p className="text-sm">{item.description}</p>
                </GlassCard>
                {item.current && (
                  <span className="mt-2 inline-block text-[10px] uppercase tracking-[0.15em] text-white/45 font-semibold">
                    Atual
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── DESKTOP: Horizontal timeline ── */}
      <div className="hidden md:block">
        {/* Horizontal line */}
        <div ref={lineRef} className="absolute left-0 right-0">
          <div className="h-px bg-white/10" />
          <div
            className="timeline-fill absolute top-0 left-0 h-px"
            style={{
              background:
                'linear-gradient(90deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.25) 40%, rgba(255,255,255,0.5) 100%)',
            }}
          />
          <div
            className="absolute -right-1 -top-[4px] w-0 h-0
              border-t-[5px] border-t-transparent
              border-b-[5px] border-b-transparent
              border-l-[8px] border-l-white/30"
            aria-hidden="true"
          />
        </div>

        {/* Items row */}
        <div className="relative flex gap-16">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex-1 min-w-0 flex flex-col items-center"
            >
              {/* Year label */}
              <span className="text-sm font-mono tracking-widest text-white/40 mb-4">
                {item.year}
              </span>

              {/* Node dot */}
              <div className="timeline-node relative mb-5 flex-shrink-0">
                <div
                  className={`w-4 h-4 rounded-full border-2 ${
                    item.current
                      ? 'bg-white border-white/70 shadow-[0_0_18px_rgba(255,255,255,0.5)]'
                      : 'bg-white/25 border-white/30'
                  }`}
                />
                {item.current && (
                  <span className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
                )}
              </div>

              {/* Vertical connector */}
              <div
                className={`w-px h-8 mb-4 ${
                  item.current ? 'bg-white/35' : 'bg-white/12'
                }`}
              />

              {/* Card */}
              <div className="timeline-card w-full">
                <GlassCard
                  title={item.role}
                  subtitle={
                    <span className="flex items-center gap-2">
                      {item.companyLogo && (
                        <img
                          src={item.companyLogo}
                          alt={item.company}
                          className="w-5 h-5 object-contain rounded"
                        />
                      )}
                      {item.company} · {item.period}
                    </span>
                  }
                  footer={
                    <div className="flex flex-wrap gap-2">
                      {item.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="liquid-glass-subtle text-sm px-4 py-1.5 rounded-full text-white/70"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  }
                >
                  <p className="text-base">{item.description}</p>
                </GlassCard>
              </div>

              {/* "Atual" badge */}
              {item.current && (
                <span className="mt-4 text-xs uppercase tracking-[0.2em] text-white/45 font-semibold">
                  Atual
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
