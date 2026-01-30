import { useEffect } from 'react'

const sections = [
  { key: '1', id: 'hero', label: 'Início', horizontal: false },
  { key: '2', id: 'about', label: 'Sobre', horizontal: false },
  { key: '3', id: 'skills', label: 'Habilidades', horizontal: false },
  { key: '4', id: 'affiliations', label: 'Filiações', horizontal: false },
  { key: '5', id: 'experience', label: 'Experiência', horizontal: true, hIndex: 0 },
  { key: '6', id: 'projects', label: 'Projetos', horizontal: true, hIndex: 1 },
  { key: '7', id: 'recommendations', label: 'Recomendações', horizontal: true, hIndex: 2 },
  { key: '8', id: 'contact', label: 'Contato', horizontal: true, hIndex: 3 },
]

/**
 * Keyboard navigation hook for quick section jumping.
 *
 * Shortcuts:
 * - 1-8: Jump to specific section
 * - Home: Scroll to top
 * - End: Scroll to bottom
 * - ArrowDown/J: Next section
 * - ArrowUp/K: Previous section
 */
export default function useKeyboardNav(enabled = true) {
  useEffect(() => {
    if (!enabled) return

    let currentIndex = 0

    const findCurrentSection = () => {
      const sectionElements = sections
        .map((s, i) => ({
          index: i,
          el: document.getElementById(s.id),
        }))
        .filter((s) => s.el)

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const { index, el } = sectionElements[i]
        const rect = el.getBoundingClientRect()
        if (rect.top <= window.innerHeight / 2) {
          currentIndex = index
          break
        }
      }
    }

    const scrollToSection = (section) => {
      if (section.horizontal) {
        // For horizontal sections, calculate scroll position
        const wrapper = document.querySelector('[data-h-section]')?.closest('.overflow-hidden')
        if (wrapper) {
          const wrapperRect = wrapper.getBoundingClientRect()
          const wrapperTop = window.scrollY + wrapperRect.top
          const sectionWidth = window.innerWidth
          const targetScroll = wrapperTop + (section.hIndex * sectionWidth)
          window.scrollTo({ top: targetScroll, behavior: 'smooth' })
        }
      } else {
        const el = document.getElementById(section.id)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
    }

    const handleKeyDown = (e) => {
      // Ignore if typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return

      // Number keys 1-8
      const numKey = parseInt(e.key)
      if (numKey >= 1 && numKey <= 8) {
        e.preventDefault()
        const section = sections[numKey - 1]
        if (section) {
          scrollToSection(section)
          currentIndex = numKey - 1
        }
        return
      }

      switch (e.key) {
        case 'Home':
          e.preventDefault()
          window.scrollTo({ top: 0, behavior: 'smooth' })
          currentIndex = 0
          break

        case 'End':
          e.preventDefault()
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
          currentIndex = sections.length - 1
          break

        case 'ArrowDown':
        case 'j':
          if (e.ctrlKey || e.metaKey) return // Don't interfere with browser shortcuts
          e.preventDefault()
          findCurrentSection()
          if (currentIndex < sections.length - 1) {
            currentIndex++
            const section = sections[currentIndex]
            scrollToSection(section)
          }
          break

        case 'ArrowUp':
        case 'k':
          if (e.ctrlKey || e.metaKey) return
          e.preventDefault()
          findCurrentSection()
          if (currentIndex > 0) {
            currentIndex--
            const section = sections[currentIndex]
            scrollToSection(section)
          }
          break

        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [enabled])
}
