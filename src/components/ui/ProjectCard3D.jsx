import { useState, useRef } from 'react'
import { ExternalLink } from 'lucide-react'
import GlassCard from '../curriculum/GlassCard'

/**
 * 3D hover effect card for projects.
 * Opens slightly on hover to reveal a preview/additional info.
 */
export default function ProjectCard3D({
  title,
  description,
  technologies = [],
  link,
  image,
  onClick,
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })
  const cardRef = useRef(null)

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    setMousePos({ x, y })
  }

  const rotateX = isHovered ? (mousePos.y - 0.5) * -20 : 0
  const rotateY = isHovered ? (mousePos.x - 0.5) * 20 : 0

  return (
    <div
      ref={cardRef}
      className="relative group"
      style={{ perspective: '1000px' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      onClick={onClick}
    >
      {/* Shadow layer */}
      <div
        className="absolute inset-0 rounded-2xl transition-all duration-300"
        style={{
          transform: `translateZ(-50px) scale(0.95)`,
          background: 'rgba(0,0,0,0.3)',
          filter: `blur(${isHovered ? 20 : 10}px)`,
          opacity: isHovered ? 0.8 : 0.5,
        }}
      />

      {/* Back face - Preview/Image */}
      <div
        className="absolute inset-0 rounded-2xl overflow-hidden transition-all duration-500"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(-20px)`,
          transformStyle: 'preserve-3d',
          opacity: isHovered ? 1 : 0,
        }}
      >
        <div className="absolute inset-0 liquid-glass-subtle flex items-center justify-center">
          {image ? (
            <img
              src={image}
              alt={`Preview de ${title}`}
              className="w-full h-full object-cover opacity-60"
            />
          ) : (
            <div className="flex flex-col items-center gap-3 text-white/40">
              <ExternalLink size={32} />
              <span className="text-sm">Ver projeto</span>
            </div>
          )}
        </div>
      </div>

      {/* Front face - Card */}
      <div
        className="relative transition-all duration-500"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${isHovered ? 30 : 0}px)`,
          transformStyle: 'preserve-3d',
        }}
      >
        <GlassCard
          title={title}
          expandable
          compact
          footer={
            <div className="flex flex-wrap gap-1.5">
              {technologies.map((tech) => (
                <span
                  key={tech}
                  className="liquid-glass-subtle text-[11px] px-2 py-1 rounded-full text-white/70"
                >
                  {tech}
                </span>
              ))}
            </div>
          }
        >
          {description}
        </GlassCard>

        {/* Shine effect */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(255,255,255,0.15) 0%, transparent 50%)`,
            opacity: isHovered ? 1 : 0,
          }}
        />

        {/* Edge glow */}
        <div
          className={`absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            boxShadow: '0 0 30px rgba(255,255,255,0.1), inset 0 0 30px rgba(255,255,255,0.05)',
          }}
        />
      </div>
    </div>
  )
}
