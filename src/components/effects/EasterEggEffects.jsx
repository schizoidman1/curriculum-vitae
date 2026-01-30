import { useEffect, useRef } from 'react'

/**
 * Visual effects for Easter eggs.
 *
 * @param {string} activeEgg - Currently active easter egg ('konami' | 'matrix' | 'avatar')
 */
export default function EasterEggEffects({ activeEgg }) {
  const canvasRef = useRef(null)

  // Matrix rain effect
  useEffect(() => {
    if (activeEgg !== 'matrix' || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Matrix-style characters with Japanese katakana
    const katakana = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'
    const numbers = '0123456789'
    const chars = katakana + numbers

    const fontSize = 14
    const columns = canvas.width / fontSize
    const drops = Array(Math.floor(columns)).fill(1)

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = '#0f0'
      ctx.font = `${fontSize}px 'Courier New', monospace`

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillText(char, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }

    const interval = setInterval(draw, 33)
    return () => clearInterval(interval)
  }, [activeEgg])

  // Konami confetti effect
  useEffect(() => {
    if (activeEgg !== 'konami') return

    const colors = ['#ff0', '#f0f', '#0ff', '#f00', '#0f0', '#00f']
    const confetti = []
    const container = document.createElement('div')
    container.className = 'fixed inset-0 pointer-events-none z-[200] overflow-hidden'
    document.body.appendChild(container)

    // Create confetti pieces
    for (let i = 0; i < 150; i++) {
      const piece = document.createElement('div')
      piece.style.cssText = `
        position: absolute;
        width: ${Math.random() * 10 + 5}px;
        height: ${Math.random() * 10 + 5}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        left: ${Math.random() * 100}%;
        top: -20px;
        opacity: ${Math.random() * 0.5 + 0.5};
        transform: rotate(${Math.random() * 360}deg);
        border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
      `
      container.appendChild(piece)
      confetti.push({
        el: piece,
        x: parseFloat(piece.style.left),
        y: -20,
        speedY: Math.random() * 3 + 2,
        speedX: (Math.random() - 0.5) * 2,
        rotation: Math.random() * 10,
        rotationSpeed: (Math.random() - 0.5) * 10,
      })
    }

    // Animate confetti
    let animationId
    const animate = () => {
      confetti.forEach((c) => {
        c.y += c.speedY
        c.x += c.speedX
        c.rotation += c.rotationSpeed

        c.el.style.top = `${c.y}px`
        c.el.style.left = `${c.x}%`
        c.el.style.transform = `rotate(${c.rotation}deg)`

        if (c.y > window.innerHeight + 20) {
          c.y = -20
          c.x = Math.random() * 100
        }
      })
      animationId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animationId)
      container.remove()
    }
  }, [activeEgg])

  if (!activeEgg) return null

  return (
    <>
      {/* Matrix effect canvas */}
      {activeEgg === 'matrix' && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 z-200 pointer-events-none"
          style={{ opacity: 0.8 }}
        />
      )}

      {/* Avatar secret message */}
      {activeEgg === 'avatar' && (
        <div className="fixed inset-0 z-200 flex items-center justify-center pointer-events-none">
          <div
            className="liquid-glass-elevated px-8 py-6 rounded-2xl text-center animate-in fade-in zoom-in duration-300"
            style={{
              background: 'rgba(0,0,0,0.8)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <p className="text-2xl mb-2">🎉</p>
            <p className="text-white text-lg font-medium">
              Você descobriu um segredo!
            </p>
            <p className="text-white/60 text-sm mt-2">
              Obrigado por explorar meu portfólio!
            </p>
          </div>
        </div>
      )}

      {/* Konami code celebration message */}
      {activeEgg === 'konami' && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-201 pointer-events-none">
          <div
            className="text-center animate-in fade-in zoom-in duration-500"
            style={{
              textShadow: '0 0 20px rgba(255,255,255,0.5)',
            }}
          >
            <p className="text-6xl mb-4">🎮</p>
            <p className="text-white text-3xl font-bold tracking-wider">
              KONAMI CODE!
            </p>
            <p className="text-white/60 text-lg mt-2">
              +30 vidas desbloqueadas
            </p>
          </div>
        </div>
      )}
    </>
  )
}
