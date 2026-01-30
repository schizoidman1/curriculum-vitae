import { useState, useEffect } from 'react'
import { User, Briefcase, FolderGit2, MessageSquareQuote, Mail, Building2, Sparkles } from 'lucide-react'
import useAppStore from '../../stores/appStore'

const sections = [
  { id: 'hero', label: 'Início', icon: User, horizontal: false },
  { id: 'about', label: 'Sobre', icon: User, horizontal: false },
  { id: 'skills', label: 'Habilidades', icon: Sparkles, horizontal: false },
  { id: 'affiliations', label: 'Filiações', icon: Building2, horizontal: false },
  { id: 'experience', label: 'Experiência', icon: Briefcase, horizontal: true, hIndex: 0 },
  { id: 'projects', label: 'Projetos', icon: FolderGit2, horizontal: true, hIndex: 1 },
  { id: 'recommendations', label: 'Recomendações', icon: MessageSquareQuote, horizontal: true, hIndex: 2 },
  { id: 'contact', label: 'Contato', icon: Mail, horizontal: true, hIndex: 3 },
]

const horizontalSections = sections.filter(s => s.horizontal)

/**
 * Floating navigation dots on the right side of the screen.
 * Shows current section and allows quick navigation.
 */
export default function FloatingNav() {
  const [activeSection, setActiveSection] = useState('hero')
  const [isVisible, setIsVisible] = useState(false)
  const scrollProgress = useAppStore((s) => s.scrollProgress)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setIsVisible(scrollY > 100)

      // Check vertical sections first
      const verticalSections = sections.filter(s => !s.horizontal)
      const sectionElements = verticalSections
        .map(s => ({ id: s.id, el: document.getElementById(s.id) }))
        .filter(s => s.el)

      let foundVertical = false
      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const { id, el } = sectionElements[i]
        const rect = el.getBoundingClientRect()
        if (rect.top <= window.innerHeight / 2 && rect.bottom > 0) {
          setActiveSection(id)
          foundVertical = true
          break
        }
      }

      // If we're past vertical sections, use horizontal scroll progress
      if (!foundVertical && scrollProgress > 0) {
        const hSectionIndex = Math.min(
          Math.floor(scrollProgress * horizontalSections.length),
          horizontalSections.length - 1
        )
        setActiveSection(horizontalSections[hSectionIndex].id)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [scrollProgress])

  const scrollToSection = (sectionId) => {
    const section = sections.find(s => s.id === sectionId)
    if (!section) return

    if (section.horizontal) {
      // For horizontal sections, calculate the scroll position based on section index
      const wrapper = document.querySelector('[data-h-section]')?.closest('.overflow-hidden')
      if (wrapper) {
        const wrapperRect = wrapper.getBoundingClientRect()
        const wrapperTop = window.scrollY + wrapperRect.top
        const sectionWidth = window.innerWidth
        const targetScroll = wrapperTop + (section.hIndex * sectionWidth)
        window.scrollTo({ top: targetScroll, behavior: 'smooth' })
      }
    } else {
      // For vertical sections, use standard scrollIntoView
      const el = document.getElementById(sectionId)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  return (
    <nav
      className={`fixed right-6 top-1/2 -translate-y-1/2 z-50 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
      }`}
      aria-label="Navegação rápida"
    >
      <div className="flex flex-col gap-3">
        {sections.map((section) => {
          const Icon = section.icon
          const isActive = activeSection === section.id
          return (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`group relative flex items-center justify-end transition-all duration-300`}
              aria-label={section.label}
              aria-current={isActive ? 'true' : undefined}
            >
              {/* Label tooltip */}
              <span
                className={`absolute right-14 px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-all duration-300 liquid-glass-subtle ${
                  isActive
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
                }`}
              >
                {section.label}
              </span>

              {/* Dot/Icon */}
              <div
                className={`relative flex items-center justify-center transition-all duration-300 ${
                  isActive
                    ? 'w-10 h-10 liquid-glass-subtle text-white'
                    : 'w-3 h-3 bg-white/30 group-hover:bg-white/50 group-hover:scale-125'
                } rounded-full`}
              >
                {isActive && <Icon size={18} />}
                {isActive && (
                  <span className="absolute inset-0 rounded-full bg-white/10 animate-ping" />
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Keyboard hint */}
      <div className="mt-6 text-center">
        <span className="text-[10px] text-white/30 tracking-wider">
          1-8
        </span>
      </div>
    </nav>
  )
}
