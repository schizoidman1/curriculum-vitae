import { useState, useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import useCurriculumSounds from '../../hooks/useCurriculumSounds'

/**
 * Interactive skills visualization with floating bubbles.
 * Bubble size and glow intensity represent proficiency level.
 * Click to pop bubbles - they respawn after a few seconds!
 */
export default function SkillsVisualization({ skills = [] }) {
  const containerRef = useRef(null)
  const [activeSkill, setActiveSkill] = useState(null)
  const [positions, setPositions] = useState([])
  const [poppedSkills, setPoppedSkills] = useState(new Set())
  const [poppingSkills, setPoppingSkills] = useState(new Set())
  const { playClick } = useCurriculumSounds()

  // Group skills by category
  const categories = {
    frontend: { label: 'Frontend', color: 'rgba(100, 200, 255, 0.8)' },
    backend: { label: 'Backend', color: 'rgba(150, 100, 255, 0.8)' },
    devops: { label: 'DevOps', color: 'rgba(100, 255, 150, 0.8)' },
    tools: { label: 'Ferramentas', color: 'rgba(255, 200, 100, 0.8)' },
  }

  // Calculate initial positions using a spiral layout for better distribution
  useEffect(() => {
    if (!containerRef.current || skills.length === 0) return

    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const maxRadius = Math.min(centerX, centerY) * 0.85

    // Sort skills by level for better visual hierarchy
    const sortedIndices = skills
      .map((s, i) => ({ level: s.level, index: i }))
      .sort((a, b) => b.level - a.level)
      .map(s => s.index)

    const newPositions = new Array(skills.length)

    // Use golden angle spiral for even distribution
    const goldenAngle = Math.PI * (3 - Math.sqrt(5))

    sortedIndices.forEach((originalIndex, spiralIndex) => {
      // Spiral positioning - higher level skills closer to center
      const normalizedIndex = spiralIndex / skills.length
      const radius = maxRadius * (0.3 + normalizedIndex * 0.7)
      const angle = spiralIndex * goldenAngle

      const x = centerX + Math.cos(angle) * radius
      const y = centerY + Math.sin(angle) * radius

      newPositions[originalIndex] = {
        x,
        y,
        baseX: x,
        baseY: y,
      }
    })

    setPositions(newPositions)
  }, [skills])

  // Animate bubbles floating - very subtle and smooth
  useEffect(() => {
    if (!containerRef.current || positions.length === 0) return

    const bubbles = containerRef.current.querySelectorAll('.skill-bubble')

    const ctx = gsap.context(() => {
      bubbles.forEach((bubble, index) => {
        gsap.to(bubble, {
          x: `random(-5, 5)`,
          y: `random(-5, 5)`,
          duration: `random(6, 10)`,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut',
          delay: index * 0.2,
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [positions])

  const getSkillSize = (level) => {
    const baseSize = 50
    const maxSize = 90
    return baseSize + ((level / 100) * (maxSize - baseSize))
  }

  // Pop a bubble and respawn after delay
  const popBubble = useCallback((skillName) => {
    if (poppedSkills.has(skillName) || poppingSkills.has(skillName)) return

    // Play pop sound
    playClick()

    // Start popping animation
    setPoppingSkills(prev => new Set([...prev, skillName]))

    // After pop animation, mark as popped
    setTimeout(() => {
      setPoppingSkills(prev => {
        const next = new Set(prev)
        next.delete(skillName)
        return next
      })
      setPoppedSkills(prev => new Set([...prev, skillName]))

      // Respawn after 3 seconds
      setTimeout(() => {
        setPoppedSkills(prev => {
          const next = new Set(prev)
          next.delete(skillName)
          return next
        })
      }, 3000)
    }, 300)
  }, [poppedSkills, poppingSkills, playClick])

  return (
    <div className="w-full">
      {/* Category legend */}
      <div className="flex flex-wrap justify-center gap-6 mb-8">
        {Object.entries(categories).map(([key, { label, color }]) => (
          <div key={key} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-sm text-white/60">{label}</span>
          </div>
        ))}
      </div>

      {/* Skills container */}
      <div
        ref={containerRef}
        className="relative w-full h-[600px] overflow-visible"
      >
        {skills.map((skill, index) => {
          const pos = positions[index] || { x: 0, y: 0 }
          const size = getSkillSize(skill.level)
          const category = categories[skill.category] || categories.tools
          const isActive = activeSkill === skill.name
          const isPopping = poppingSkills.has(skill.name)
          const isPopped = poppedSkills.has(skill.name)

          if (isPopped) return null

          return (
            <div
              key={skill.name}
              className={`skill-bubble absolute cursor-pointer transition-all ${
                isPopping ? 'duration-300' : 'duration-300'
              }`}
              style={{
                left: pos.x - size / 2,
                top: pos.y - size / 2,
                width: size,
                height: size,
                zIndex: isActive ? 50 : 10,
                transform: isPopping ? 'scale(1.5)' : undefined,
                opacity: isPopping ? 0 : 1,
              }}
              onMouseEnter={() => !isPopping && setActiveSkill(skill.name)}
              onMouseLeave={() => setActiveSkill(null)}
              onClick={() => popBubble(skill.name)}
            >
              {/* Pop particles */}
              {isPopping && (
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 rounded-full bg-white/60 animate-pop-particle"
                      style={{
                        left: '50%',
                        top: '50%',
                        '--angle': `${i * 45}deg`,
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Liquid Glass Bubble */}
              <div
                className={`liquid-glass-bubble w-full h-full flex items-center justify-center transition-all duration-300 ${
                  isActive && !isPopping ? 'scale-110' : 'scale-100'
                }`}
                style={{
                  boxShadow: isActive
                    ? `0 8px 32px rgba(0, 0, 0, 0.1), 0px 0px 24px -4px ${category.color}, 0 0 40px ${category.color.replace('0.8', '0.3')}`
                    : undefined,
                }}
              >
                <div className="relative z-10 text-center px-2">
                  <span
                    className={`font-medium transition-all duration-300 ${
                      isActive ? 'text-white text-sm' : 'text-white/80 text-xs'
                    }`}
                  >
                    {skill.name}
                  </span>
                </div>
              </div>

              {/* Category color ring (subtle) */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none transition-opacity duration-300"
                style={{
                  border: `2px solid ${category.color.replace('0.8', isActive ? '0.6' : '0.25')}`,
                  opacity: isActive ? 1 : 0.7,
                }}
              />
            </div>
          )
        })}
      </div>

      {/* Hint text */}
      <div className="text-center mt-6">
        <p className="text-white/40 text-sm">
          Clique nas bolhas para estourá-las
        </p>
      </div>

      {/* Pop animation styles */}
      <style>{`
        @keyframes pop-particle {
          0% {
            transform: translate(-50%, -50%) rotate(var(--angle)) translateX(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) rotate(var(--angle)) translateX(60px) scale(0);
            opacity: 0;
          }
        }

        .animate-pop-particle {
          animation: pop-particle 0.4s ease-out forwards;
        }

        .skill-bubble {
          animation: bubble-spawn 0.5s ease-out;
        }

        @keyframes bubble-spawn {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
