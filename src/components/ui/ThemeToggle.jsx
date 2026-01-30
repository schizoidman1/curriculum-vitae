import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'

/**
 * Theme toggle button with smooth transition between light and dark modes.
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState('dark')
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Check for saved theme or system preference
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setTheme(savedTheme)
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      setTheme('light')
    }
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
      setTimeout(() => setIsAnimating(false), 300)
    }, 150)
  }

  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-6 left-6 z-40 liquid-glass-subtle w-12 h-12 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:scale-110 transition-all overflow-hidden"
      aria-label={`Mudar para tema ${isDark ? 'claro' : 'escuro'}`}
    >
      <div
        className={`relative transition-transform duration-300 ${
          isAnimating ? 'scale-0 rotate-180' : 'scale-100 rotate-0'
        }`}
      >
        {isDark ? <Moon size={20} /> : <Sun size={20} />}
      </div>

      {/* Ripple effect */}
      <span
        className={`absolute inset-0 rounded-full transition-all duration-500 ${
          isAnimating
            ? 'scale-[3] opacity-0'
            : 'scale-0 opacity-100'
        } ${isDark ? 'bg-yellow-500/20' : 'bg-blue-500/20'}`}
      />
    </button>
  )
}
