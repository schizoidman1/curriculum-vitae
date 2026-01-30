import { useEffect, useState, useCallback } from 'react'

// Konami code sequence
const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'b', 'a'
]

/**
 * Easter eggs hook that listens for secret key combinations.
 *
 * Easter eggs:
 * - Konami code: Triggers party mode with confetti
 * - Click avatar 5 times: Shows secret message
 * - Type "matrix": Matrix rain effect
 */
export default function useEasterEggs() {
  const [konamiIndex, setKonamiIndex] = useState(0)
  const [matrixBuffer, setMatrixBuffer] = useState('')
  const [avatarClicks, setAvatarClicks] = useState(0)
  const [activeEgg, setActiveEgg] = useState(null)
  const [konamiUnlocked, setKonamiUnlocked] = useState(false)

  // Reset active egg after duration
  const triggerEgg = useCallback((eggName, duration = 5000) => {
    setActiveEgg(eggName)
    setTimeout(() => setActiveEgg(null), duration)
  }, [])

  // Konami code listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Normalize key for comparison (lowercase for letters)
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key

      // Check konami code
      if (key === KONAMI_CODE[konamiIndex]) {
        const nextIndex = konamiIndex + 1
        if (nextIndex === KONAMI_CODE.length) {
          triggerEgg('konami', 8000)
          setKonamiUnlocked(true)
          setKonamiIndex(0)
        } else {
          setKonamiIndex(nextIndex)
        }
      } else if (KONAMI_CODE.slice(0, konamiIndex + 1).includes(key)) {
        // Allow restarting sequence if user hits a valid starting key
        if (key === KONAMI_CODE[0]) {
          setKonamiIndex(1)
        }
      } else {
        setKonamiIndex(0)
      }

      // Check matrix (letter keys only)
      if (e.key.length === 1 && /[a-z]/i.test(e.key)) {
        const newBuffer = (matrixBuffer + e.key.toLowerCase()).slice(-6)
        setMatrixBuffer(newBuffer)
        if (newBuffer === 'matrix') {
          triggerEgg('matrix', 10000)
          setMatrixBuffer('')
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [konamiIndex, matrixBuffer, triggerEgg])

  // Avatar click handler
  const handleAvatarClick = useCallback(() => {
    const newClicks = avatarClicks + 1
    setAvatarClicks(newClicks)

    if (newClicks >= 5) {
      triggerEgg('avatar', 4000)
      setAvatarClicks(0)
    }

    // Reset clicks after 2 seconds of inactivity
    setTimeout(() => setAvatarClicks(0), 2000)
  }, [avatarClicks, triggerEgg])

  return {
    activeEgg,
    konamiUnlocked,
    handleAvatarClick,
  }
}
